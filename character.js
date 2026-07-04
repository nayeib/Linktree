const CharacterController = (() => {
  let element = null;
  const defaultPrefix = 'default';
  const defaultFrames = { idle: 1, blink: 1 };
  let currentPrefix = defaultPrefix;
  let frames = { ...defaultFrames };
  let state = 'idle';
  let frameIndex = 0;
  let intervalId = null;
  let breathingId = null;

  function pad(n){ return String(n).padStart(3,'0'); }
  function buildPath(prefix, st, idx){
    return `../character/${prefix}/${st}_${pad(idx)}.png`;
  }

  function setElement(el){ element = el; }
  function clearIntervalIfAny(){ if(intervalId){ clearInterval(intervalId); intervalId = null; } }
  function clearBreathing(){ if(breathingId){ clearInterval(breathingId); breathingId = null; } }

  function startBreathing(){
    clearBreathing();
    if(!element) return;
      // Use CSS-driven breathing for a perfectly smooth loop.
      if (!element) return;
      element.classList.add('breathing');
      // ensure transform-origin is bottom so scaling anchors at the feet
      element.style.transformOrigin = 'bottom center';
  }

  function stopBreathing(){ clearBreathing(); if(element){ element.classList.remove('breathing'); element.style.transform = ''; element.style.transformOrigin = ''; } }

  // Probe the filesystem (via Image loading) to find how many frames actually exist.
  // Returns a Promise resolving to the number of frames found (at least 1 if a base frame exists).
  function probeFrames(prefix, pose, maxTry = 16){
    return new Promise((resolve) => {
      let found = 0;
      let idx = 0;
      function tryNext(){
        if(idx >= maxTry) return resolve(found);
        const img = new Image();
        const testPath = buildPath(prefix, pose, idx);
        img.onload = () => { found = idx + 1; idx += 1; tryNext(); };
        img.onerror = () => { resolve(found); };
        // start load
        img.src = testPath;
      }
      tryNext();
    }).then(count => Math.max(1, count));
  }

  function resolveFrameCount(pose){
    const count = frames[pose] || 1;
    return count > 1 ? count : 1;
  }

  function updateFrame(){
    if(!element) return;
    const pose = state === 'blink' ? 'blink' : state;
    const count = resolveFrameCount(pose);
    const safeIndex = count <= 1 ? 0 : frameIndex % count;
    const path = buildPath(currentPrefix, pose, safeIndex);
    element.style.backgroundImage = `url('${path}')`;
    element.style.backgroundSize = 'contain';
    element.style.backgroundPosition = 'center bottom';
    element.style.backgroundRepeat = 'no-repeat';

    if (count <= 1) {
      frameIndex = 0;
      return;
    }

    frameIndex = (frameIndex + 1) % count;
  }

  function playLoop(){
    clearIntervalIfAny();
    startBreathing();
    const delay = state === 'idle' ? 180 : 120;
    updateFrame();
    intervalId = setInterval(updateFrame, delay);
  }

  function switchCharacter(prefix, frameConfig){
    currentPrefix = prefix || defaultPrefix;
    // start with conservative defaults (1 frame each) so we don't try to load missing files
    frames = {
      idle: 1,
      blink: 1
    };
    state = 'idle';
    frameIndex = 0;
    // start playback immediately with safe single-frame defaults
    playLoop();

    // probe asynchronously (non-blocking). When we discover real counts, update and restart loop.
    (async () => {
      const maxIdle = Math.min(frameConfig?.idle || defaultFrames.idle, 30);
      const maxBlink = Math.min(frameConfig?.blink || defaultFrames.blink, 30);
      try {
        const [idleCount, blinkCount] = await Promise.all([
          probeFrames(currentPrefix, 'idle', maxIdle),
          probeFrames(currentPrefix, 'blink', maxBlink)
        ]);
        frames.idle = idleCount || 1;
        frames.blink = blinkCount || 1;
        // restart loop so new counts take effect
        frameIndex = 0;
        playLoop();
      } catch (e){
        // on any error keep defaults
      }
    })();
  }

  function playState(st){
    state = st || 'idle';
    frameIndex = 0;
    clearIntervalIfAny();
    if (state === 'blink') {
      updateFrame();
      intervalId = setInterval(() => {
        updateFrame();
        if (frameIndex === 0) {
          clearInterval(intervalId);
          intervalId = null;
          state = 'idle';
          frameIndex = 0;
          playLoop();
        }
      }, 120);
      return;
    }
    playLoop();
  }

  return { setElement, switchCharacter, playState, stopBreathing };
})();
