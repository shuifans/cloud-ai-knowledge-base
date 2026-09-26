import test from 'node:test'
import assert from 'node:assert/strict'
import { createBackgroundMusicPlayer, MUSIC_PREFERENCE_KEY } from '../docs/.vitepress/theme/backgroundMusic.js'

class Events {
  handlers = new Map()
  addEventListener(type, handler) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set())
    this.handlers.get(type).add(handler)
  }
  removeEventListener(type, handler) { this.handlers.get(type)?.delete(handler) }
  emit(type, data = {}) {
    for (const handler of this.handlers.get(type) || []) handler({ type, ...data })
  }
}

class AudioStub extends Events {
  plays = 0
  pauses = 0
  loads = 0
  currentTime = 25
  nextPlay = () => Promise.resolve()
  play() { this.plays++; return this.nextPlay() }
  pause() { this.pauses++; this.emit('pause') }
  load() { this.loads++ }
  removeAttribute() {}
}

const tick = () => new Promise((resolve) => setImmediate(resolve))
function setup({ preference, blocked = false, unavailableStorage = false } = {}) {
  const audio = new AudioStub()
  if (blocked) audio.nextPlay = () => Promise.reject(Object.assign(new Error(), { name: 'NotAllowedError' }))
  const gestures = new Events()
  const storageEvents = new Events()
  const data = new Map(preference === undefined ? [] : [[MUSIC_PREFERENCE_KEY, String(preference)]])
  const storage = {
    getItem: (key) => { if (unavailableStorage) throw Error('denied'); return data.get(key) },
    setItem: (key, value) => { if (unavailableStorage) throw Error('denied'); data.set(key, value) },
  }
  let state
  const player = createBackgroundMusicPlayer({ audio, gestures, storageEvents, storage, onChange: (next) => { state = next } })
  return { audio, gestures, storageEvents, data, player, get state() { return state } }
}

test('saved opt-in tries audible looping autoplay, then retries only after a real interaction', async () => {
  const t = setup({ preference: false, blocked: true })
  await tick()
  assert.equal(t.state.status, 'blocked')
  assert.equal(t.audio.loop, true)
  assert.equal(t.audio.muted, false)
  assert.equal(t.audio.volume, 0.24)
  t.gestures.emit('pointerup', { isTrusted: false })
  assert.equal(t.audio.plays, 1)
  t.audio.nextPlay = () => Promise.resolve()
  t.gestures.emit('pointerup', { isTrusted: true })
  await tick()
  assert.equal(t.state.status, 'playing')
  assert.equal(t.audio.plays, 2)
  t.player.dispose()
})

for (const preference of [undefined, true, 'invalid']) {
  test(`default or saved mute (${preference}) prevents autoplay until explicitly enabled`, async () => {
    const t = setup({ preference })
    t.gestures.emit('pointerup', { isTrusted: true })
    t.gestures.emit('keydown', { isTrusted: true, key: 'Enter' })
    assert.equal(t.audio.plays, 0)
    assert.equal(t.audio.muted, true)
    assert.equal(t.audio.autoplay, false)
    assert.equal(t.state.status, 'muted')
    t.player.toggle()
    await tick()
    assert.equal(t.state.status, 'playing')
    assert.equal(t.data.get(MUSIC_PREFERENCE_KEY), 'false')
    assert.equal(t.audio.currentTime, 25, 'unmuting preserves the playback position')
    t.player.dispose()
  })
}

test('muting during an unresolved play request cannot be undone by that request', async () => {
  const t = setup({ preference: true })
  let resolvePlay
  t.audio.nextPlay = () => new Promise((resolve) => { resolvePlay = resolve })
  t.player.toggle()
  assert.equal(t.state.status, 'loading')
  t.player.toggle()
  resolvePlay()
  await tick()
  assert.equal(t.state.status, 'muted')
  assert.equal(t.audio.muted, true)
  assert.equal(t.audio.autoplay, false)
  assert.equal(t.data.get(MUSIC_PREFERENCE_KEY), 'true')
  t.player.dispose()
})

test('a playback failure offers explicit retry without retrying on every page click', async () => {
  const t = setup({ preference: true })
  t.audio.nextPlay = () => Promise.reject(Object.assign(new Error(), { name: 'NotSupportedError' }))
  t.player.toggle()
  await tick()
  assert.equal(t.state.status, 'error')
  t.gestures.emit('pointerup', { isTrusted: true })
  assert.equal(t.audio.plays, 1)
  t.audio.nextPlay = () => Promise.resolve()
  t.player.toggle()
  await tick()
  assert.equal(t.audio.loads, 1)
  assert.equal(t.state.status, 'playing')
  t.player.dispose()
})

test('mute synchronizes across tabs and cleanup detaches all handlers', async () => {
  const t = setup({ preference: false })
  await tick()
  t.storageEvents.emit('storage', { key: MUSIC_PREFERENCE_KEY, newValue: 'true' })
  assert.equal(t.state.status, 'muted')
  t.player.dispose()
  for (const source of [t.audio, t.gestures, t.storageEvents]) {
    assert.equal([...source.handlers.values()].reduce((sum, handlers) => sum + handlers.size, 0), 0)
  }
  assert.equal(t.audio.autoplay, false)
})

test('denied browser storage does not prevent playback or mute controls', async () => {
  const t = setup({ unavailableStorage: true })
  assert.equal(t.state.status, 'muted')
  assert.equal(t.audio.plays, 0)
  t.player.toggle()
  await tick()
  assert.equal(t.state.status, 'playing')
  t.player.toggle()
  assert.equal(t.state.status, 'muted')
  t.player.dispose()
})

for (const key of [MUSIC_PREFERENCE_KEY, null]) {
  test(`removing the preference (${key}) restores the muted default across tabs`, async () => {
    const t = setup({ preference: false })
    await tick()
    assert.equal(t.state.status, 'playing')
    t.storageEvents.emit('storage', { key, newValue: null })
    t.gestures.emit('pointerup', { isTrusted: true })
    assert.equal(t.state.status, 'muted')
    assert.equal(t.audio.autoplay, false)
    assert.equal(t.audio.plays, 1)
    t.player.dispose()
  })
}
