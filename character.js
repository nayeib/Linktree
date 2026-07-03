const CharacterController = (() => {
  const spriteElement = document.getElementById('characterSprite');
  const defaultPrefix = 'default';
  const defaultConfig = { idle: 1, blink: 1 };

  let currentPrefix = defaultPrefix;
  let currentFrames = { ...defaultConfig };
  let currentState = 'idle';
  let stateTimer = null;
  let frameIndex = 0;

  function pad(number) {
    return String(number).padStart(3, '0');
  }

  function buildPath(prefix, state, index) {
    return `character/${prefix}/${state}_${pad(index)}.png`;
  }

  function setSource(src) {
    if (!spriteElement) return;
    spriteElement.src = src;
  }

  function clearTimers() {
    if (stateTimer) {
      clearTimeout(stateTimer);
      clearInterval(stateTimer);
    }
    stateTimer = null;
  }

  // Probe how many frames exist for a given prefix/state by loading images until failure.
  function probeFramesRoot(prefix, pose, maxTry = 16){
    return new Promise((resolve) => {
      let found = 0;
      let idx = 0;
      function tryNext(){
        if(idx >= maxTry) return resolve(found);
        const img = new Image();
        const p = buildPath(prefix, pose, idx);
        img.onload = () => { found = idx + 1; idx += 1; tryNext(); };
        img.onerror = () => { resolve(found); };
        img.src = p;
      }
      tryNext();
    }).then(c => Math.max(1, c));
  }

  function animateState(state) {
    clearTimers();
    currentState = state;
    frameIndex = 0;
    const count = Math.max(1, currentFrames[state] || 1);
    const safeCount = count > 1 ? count : 1;
    const interval = state === 'idle' ? 180 : 120;

    function nextFrame() {
      const safeIndex = safeCount <= 1 ? 0 : frameIndex % safeCount;
      const path = buildPath(currentPrefix, state, safeIndex);
      setSource(path);
      frameIndex = (safeIndex + 1) % safeCount;
      if (state !== 'idle' && frameIndex === 0) {
        playState('idle');
      }
    }

    nextFrame();
    if (state === 'idle') {
      stateTimer = setInterval(nextFrame, interval);
    } else {
      stateTimer = setTimeout(() => {
        nextFrame();
      }, interval);
    }
  }

  function playState(state) {
    if (!spriteElement) return;
    if (state === 'blink') {
      animateState('blink');
      return;
    }
    animateState('idle');
  }

  function switchCharacter(prefix, frameConfig = {}) {
    currentPrefix = prefix || defaultPrefix;
    // conservative defaults
    currentFrames = { idle: 1, blink: 1 };
    playState('idle');
    // async probe of real counts
    (async ()=>{
      try{
        const maxIdle = Math.min(frameConfig.idle || defaultConfig.idle, 30);
        const maxBlink = Math.min(frameConfig.blink || defaultConfig.blink, 30);
        const [idleCount, blinkCount] = await Promise.all([
          probeFramesRoot(currentPrefix, 'idle', maxIdle),
          probeFramesRoot(currentPrefix, 'blink', maxBlink)
        ]);
        currentFrames.idle = idleCount;
        currentFrames.blink = blinkCount;
        playState('idle');
      }catch(e){/* keep defaults */}
    })();
  }

  spriteElement?.addEventListener('error', () => {
    if (currentPrefix !== defaultPrefix) {
      currentPrefix = defaultPrefix;
      playState('idle');
    }
  });

  return {
    switchCharacter,
    playState
  };
})();
