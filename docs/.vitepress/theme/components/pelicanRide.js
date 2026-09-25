// Adapted from the supplied pelican bicycle scene. Scoped to one mounted card.
export function mountPelicanRide(root) {
  const controller = new AbortController();
  const { signal } = controller;
  const $ = id => root.querySelector(`#${id}`);
  const ids = ['rear-wheel','front-wheel','pelican','scarf-upper','scarf-lower','eye','clouds','waves','gulls','gull-one','landscape','wind-a','wind-b','wind-c','bell-waves','shadow'];
  const el = Object.fromEntries(ids.map(id => [id, $(id)]));
  const legs = Object.fromEntries(['near','far'].map(side => [side,Object.fromEntries(['crank','outline','leg','foot'].map(part => [part,$(`${side}-${part}`)]))]));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !reducedMotion.matches;
  let elapsed = 0, speed = 1, previous = null, frameId = null;
  let bellTimer, audioContext;
  let inView = true;
  const TAU = Math.PI * 2;
  const fmt = n => n.toFixed(3);
  const transform = (name, value) => el[name].setAttribute('transform', value);

  // Two-segment inverse kinematics keeps both ankles attached to the pedals.
  // The far pedal is always half a revolution ahead of the near pedal.
  function drawLeg(side, phase, bob) {
    const near = side === 'near';
    const pedal = {x:499 + 59 * Math.cos(phase), y:580 + 59 * Math.sin(phase)};
    const hip = {x:near ? 481 : 456, y:(near ? 453 : 444) + bob};
    const ankle = {x:pedal.x - 23, y:pedal.y - 25};
    const dx = ankle.x-hip.x, dy=ankle.y-hip.y;
    const upper = 103, lower = 115;
    const distance = Math.min(upper+lower-.01, Math.max(Math.abs(upper-lower)+.01, Math.hypot(dx,dy)));
    const ux=dx/Math.hypot(dx,dy), uy=dy/Math.hypot(dx,dy);
    const along=(upper*upper-lower*lower+distance*distance)/(2*distance);
    const height=Math.sqrt(Math.max(0,upper*upper-along*along));
    const knee={x:hip.x+ux*along+uy*height,y:hip.y+uy*along-ux*height};
    const d=`M${fmt(hip.x)} ${fmt(hip.y)}L${fmt(knee.x)} ${fmt(knee.y)}L${fmt(ankle.x)} ${fmt(ankle.y)}`;
    const leg=legs[side];
    leg.outline.setAttribute('d',d); leg.leg.setAttribute('d',d);
    leg.crank.setAttribute('d',`M499 580L${fmt(pedal.x)} ${fmt(pedal.y)}`);
    leg.foot.setAttribute('transform',`translate(${fmt(pedal.x)} ${fmt(pedal.y-7)})`);
  }

  function render(t) {
    const phase=t*TAU/2.25+.6;
    const bob=Math.sin(phase*2)*2.8;
    const turn=t*TAU/2.25*1.25;
    const distance=turn*133;
    const angle=turn*180/Math.PI;
    transform('rear-wheel',`rotate(${fmt(angle%360)})`);
    transform('front-wheel',`rotate(${fmt(angle%360)})`);
    transform('pelican',`translate(0 ${fmt(bob)})`);
    transform('scarf-upper',`rotate(${fmt(Math.sin(t*7)*4)} 586 291)`);
    transform('scarf-lower',`rotate(${fmt(Math.sin(t*7+1.8)*5)} 585 301)`);
    const blinkPhase=t%5.7;
    const eyeScale=blinkPhase>5.45 ? Math.max(.08,Math.abs(blinkPhase-5.575)/.125) : 1;
    transform('eye',`translate(617 181) scale(1 ${fmt(eyeScale)}) translate(-617 -181)`);
    transform('clouds',`translate(${fmt(-(distance*.045)%880)} 0)`);
    transform('waves',`translate(${fmt(-(distance*.12)%1000)} 0)`);
    transform('landscape',`translate(${fmt(-distance%1000)} 0)`);
    transform('gulls',`translate(${fmt(Math.sin(t*.45)*18)} ${fmt(Math.sin(t*.9)*6)})`);
    const lift=Math.sin(t*3.4)*8;
    el['gull-one'].setAttribute('d',`M182 ${226-lift}Q195 212 209 226Q222 212 236 ${226-lift}`);
    ['wind-a','wind-b','wind-c'].forEach((name,i) => {
      const p=(t*.85+i/3)%1;
      transform(name,`translate(${fmt(-p*60)} 0)`);
      el[name].setAttribute('opacity',fmt(Math.sin(p*Math.PI)*.7));
    });
    el.shadow.setAttribute('rx',fmt(331-Math.sin(phase*2)*2));
    drawLeg('far',phase+Math.PI,bob);
    drawLeg('near',phase,bob);
  }

  function tick(now) {
    frameId=null;
    if(!playing || document.hidden || !inView) { previous=null; return; }
    if(previous!==null) elapsed+=Math.min((now-previous)/1000,.05)*speed;
    previous=now;
    render(elapsed);
    frameId=requestAnimationFrame(tick);
  }
  function schedule() {
    if(playing && !document.hidden && inView && frameId===null) {previous=null;frameId=requestAnimationFrame(tick);}
  }
  function updateControls() {
    root.setAttribute('data-playing', String(playing));
    $('play-text').textContent=playing?'暂停一下':'继续骑行';
    $('play').setAttribute('aria-label',playing?'暂停动画':'播放动画');
    $('play-icon').innerHTML=playing?'<path d="M7 5h3v14H7zm7 0h3v14h-3z"/>':'<path d="m8 4 12 8-12 8z"/>';
    $('status-text').textContent=playing?'迎着海风':'歇一会儿';
  }
  function setPlaying(value) {
    playing=value;
    if(frameId!==null){cancelAnimationFrame(frameId);frameId=null;}
    previous=null; updateControls(); schedule();
    $('announcement').textContent=playing?'继续骑行':'动画已暂停';
  }
  $('play').addEventListener('click',()=>setPlaying(!playing), { signal });
  $('speed').addEventListener('input',event=>{
    speed=Number(event.target.value);
    $('speed-value').textContent=speed.toFixed(1)+'×';
    event.target.setAttribute('aria-valuetext',speed.toFixed(1)+' 倍速');
  }, { signal });
  async function ringBell() {
    clearTimeout(bellTimer);
    $('toast').classList.add('show');
    el['bell-waves'].setAttribute('opacity','1');
    $('announcement').textContent='叮铃！';
    bellTimer=setTimeout(()=>{$('toast').classList.remove('show');el['bell-waves'].setAttribute('opacity','0');},950);
    // Sound is created only after a click or an explicit keyboard action.
    try {
      const AudioAPI=window.AudioContext||window.webkitAudioContext;
      if(!AudioAPI) return;
      if(!audioContext) audioContext=new AudioAPI();
      await audioContext.resume();
      [0,.14].forEach((delay,index)=>{
        const oscillator=audioContext.createOscillator();
        const gain=audioContext.createGain();
        const start=audioContext.currentTime+delay;
        oscillator.type='sine';oscillator.frequency.value=index?1864:1568;
        gain.gain.setValueAtTime(0,start);
        gain.gain.linearRampToValueAtTime(.07,start+.004);
        gain.gain.exponentialRampToValueAtTime(.0001,start+.6);
        oscillator.connect(gain);gain.connect(audioContext.destination);
        oscillator.start(start);oscillator.stop(start+.65);
        oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
      });
    } catch { /* The visual bell remains available if browser audio is blocked. */ }
  }
  $('bell').addEventListener('click',ringBell, { signal });
  root.addEventListener('keydown',event=>{
    if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.target.closest('button,input,textarea,select,[contenteditable]')) return;
    if(event.code==='Space'){event.preventDefault();setPlaying(!playing);}
    if(event.key.toLowerCase()==='b')ringBell();
  }, { signal });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;previous=null;}
    else schedule();
  }, { signal });
  reducedMotion.addEventListener('change',event=>{if(event.matches)setPlaying(false);}, { signal });
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (!inView && frameId !== null) { cancelAnimationFrame(frameId); frameId = null; previous = null; }
    else schedule();
  });
  observer.observe(root);
  render(0);updateControls();schedule();
  if(reducedMotion.matches)$('announcement').textContent='已按系统减少动态效果的偏好暂停，可点击继续骑行播放。';
  return () => {
    controller.abort();
    observer.disconnect();
    if (frameId !== null) cancelAnimationFrame(frameId);
    clearTimeout(bellTimer);
    if (audioContext) void audioContext.close().catch(() => {});
  };
}
