export const MUSIC_PREFERENCE_KEY = 'coastal-background-music-muted'

// Owned by the shared layout, so changing articles never creates a second player.
export function createBackgroundMusicPlayer({ audio, gestures, storageEvents, storage, onChange }) {
  let muted = true
  let status = 'idle'
  let disposed = false
  let attempt = 0
  let pending = false
  const cleanup = []

  const listen = (target, event, handler) => {
    target?.addEventListener(event, handler)
    cleanup.push(() => target?.removeEventListener(event, handler))
  }
  const update = (next) => {
    if (disposed) return
    status = muted ? 'muted' : next
    onChange({ muted, status })
  }

  // Silence is the default; only an explicit saved opt-in may enable playback.
  try { muted = storage?.getItem(MUSIC_PREFERENCE_KEY) !== 'false' } catch { /* Private browsing stays muted. */ }
  audio.loop = true
  audio.preload = 'none'
  audio.volume = 0.24
  audio.muted = muted

  async function play() {
    if (disposed || muted || pending) return
    const currentAttempt = ++attempt
    pending = true
    update('loading')
    try {
      await audio.play()
      if (!disposed && currentAttempt === attempt) update('playing')
    } catch (error) {
      if (disposed || currentAttempt !== attempt) return
      update(error?.name === 'NotAllowedError' ? 'blocked' : error?.name === 'AbortError' ? 'idle' : 'error')
    } finally {
      if (currentAttempt === attempt) pending = false
    }
  }

  function setMuted(next, persist = true) {
    muted = next
    audio.muted = next
    audio.autoplay = !next
    if (persist) {
      try { storage?.setItem(MUSIC_PREFERENCE_KEY, String(next)) } catch { /* Playback still works. */ }
    }
    if (next) {
      ++attempt
      pending = false
      audio.pause()
      update('muted')
    } else {
      void play()
    }
  }

  function toggle() {
    if (muted) return setMuted(false)
    if (status === 'blocked' || status === 'idle' || status === 'error') {
      if (status === 'error') audio.load()
      void play()
    } else {
      setMuted(true)
    }
  }

  function onGesture(event) {
    if (event.isTrusted === false || event.defaultPrevented) return
    if (event.target?.closest?.('[data-background-music-toggle]')) return
    if (event.type === 'keydown' && (event.ctrlKey || event.metaKey || event.altKey || event.repeat || ['Shift', 'Control', 'Alt', 'Meta'].includes(event.key))) return
    if (!muted && (status === 'blocked' || status === 'idle')) void play()
  }

  listen(gestures, 'pointerup', onGesture)
  listen(gestures, 'keydown', onGesture)
  listen(storageEvents, 'storage', (event) => {
    if (event.key === MUSIC_PREFERENCE_KEY || event.key === null) setMuted(event.newValue !== 'false', false)
  })
  listen(audio, 'playing', () => {
    if (muted) audio.pause()
    else update('playing')
  })
  listen(audio, 'pause', () => update('idle'))
  listen(audio, 'error', () => update('error'))
  audio.autoplay = !muted
  update('idle')
  if (!muted) void play()

  return {
    toggle,
    setMuted,
    dispose() {
      disposed = true
      ++attempt
      cleanup.forEach((remove) => remove())
      audio.autoplay = false
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    },
  }
}
