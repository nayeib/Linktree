const linksData = [
  {
    name: 'X / Naytools',
    subtitle: 'Actualizaciones y enlaces',
    url: 'https://x.com/Naytools',
    specialText: '¿Abrir la cuenta de X de Naytools?',
    spritePrefix: 'x',
    frames: { idle: 1, blink: 1 }
  },
  {
    name: 'F95Zone / Naytools',
    subtitle: 'Búsqueda de publicaciones',
    url: 'https://f95zone.to/search/647099816/?c[users]=Naytools&o=date',
    specialText: '¿Ir a la búsqueda de Naytools en F95Zone?',
    spritePrefix: 'f95zone',
    frames: { idle: 1, blink: 1 }
  },
  {
    name: 'Patreon / Naytools',
    subtitle: 'Apóyame en Patreon',
    url: 'https://www.patreon.com/cw/Naytools',
    specialText: '¿Ir a la página de Patreon de Naytools?',
    spritePrefix: 'patreon',
    frames: { idle: 1, blink: 1 }
  },
  {
    name: 'Itch.io / Naytools',
    subtitle: 'Juegos y demos',
    url: 'https://nayeib.itch.io/',
    specialText: '¿Ir a la página de Itch.io de Naytools?',
    spritePrefix: 'itchio',
    frames: { idle: 1, blink: 1 }
  }
];

let currentPrefix = 'default';
let currentPose = 'idle';
let blinkIntervalId = null;

const charDisplay = document.getElementById('hero-character');
CharacterController.setElement(charDisplay);

function createSparks(){
  const bg = document.getElementById('fire-bg');
  const count = 12;
  for(let i=0;i<count;i++){
    const s = document.createElement('div'); s.className='spark';
    const size = Math.random()*6+4; s.style.width=size+'px'; s.style.height=size+'px';
    s.style.left = Math.random()*100 + 'vw'; s.style.animationDuration = Math.random()*4+3 + 's'; s.style.animationDelay = Math.random()*5 + 's';
    bg.appendChild(s);
  }
}

function startLoopAnimacion(){
  // recurrent blink to give life: every X seconds trigger blink
  if (blinkIntervalId) clearInterval(blinkIntervalId);
  blinkIntervalId = setInterval(()=>{
    CharacterController.playState('blink');
    // return to idle after blink
    setTimeout(()=> CharacterController.playState('idle'), 300);
  }, 4200); // blink every ~4.2s
}

function renderLinks(){
  const container = document.getElementById('links-container');
  container.innerHTML = '';
  linksData.forEach(link => {
    const btn = document.createElement('button'); btn.className='link-box'; btn.innerHTML = `${link.name} <span>${link.subtitle}</span>`;
    btn.addEventListener('click', (e)=>{ inkEffect(e); openVNModal(link); });
    container.appendChild(btn);
  });
}

function openVNModal(link){
  currentPrefix = link.spritePrefix; currentPose='idle';
  // switch character sprites for this link
  CharacterController.switchCharacter(currentPrefix, link.frames);
  CharacterController.playState('idle');

  // Move transition mask to visible side and start logo river
  const slash = document.getElementById('slash-transition');
  slash.classList.add('side-visible');
  startLogoRiver(currentPrefix);

  // move links away and slightly move character out (exit)
  document.getElementById('links-container').classList.add('hidden');
  const wrapper = document.getElementById('character-wrapper');
  // remove list-scale when showing modal
  wrapper.classList.remove('scale-list');
  wrapper.classList.add('center-stage');
  wrapper.classList.add('exit');

  // configure modal text and confirm action
  document.getElementById('modal-prompt').innerText = link.specialText;
  const confirmBtn = document.getElementById('modal-confirm-btn');
  confirmBtn.onclick = () => { triggerSlashTransition(()=>{ window.location.href = link.url; }); };

  // show modal from bottom after short delay
  setTimeout(()=>{
    document.getElementById('vn-modal').classList.add('active');
  }, 280);

  // bring character back from below but behind the modal after a bit
  setTimeout(()=>{
    wrapper.classList.remove('exit');
    wrapper.classList.add('behind-modal');
    // ensure character uses link sprite while behind modal
    CharacterController.switchCharacter(currentPrefix, link.frames);
    CharacterController.playState('idle');
  }, 520);
}

function closeVNModal(){
  document.getElementById('vn-modal').classList.remove('active');
  // restore links
  document.getElementById('links-container').classList.remove('hidden');

  // Restore transition mask and stop logo river
  const slash = document.getElementById('slash-transition');
  slash.classList.remove('side-visible');
  stopLogoRiver();

  const wrapper = document.getElementById('character-wrapper');
  // bring character forward then return to default layout
  wrapper.classList.remove('behind-modal');
  wrapper.classList.remove('exit');
  wrapper.classList.remove('center-stage');
  // after closing, restore list scale
  wrapper.classList.add('scale-list');
  // short delay to let transition complete, then reset sprite
  setTimeout(()=>{
    CharacterController.switchCharacter('default');
    CharacterController.playState('idle');
  }, 220);
}

function triggerSlashTransition(cb){ const slash = document.getElementById('slash-transition'); slash.classList.remove('active'); void slash.offsetWidth; slash.classList.add('active'); setTimeout(()=>{ if(cb) cb(); }, 350); }

function startLogoRiver(prefix) {
  stopLogoRiver();
  const slash = document.getElementById('slash-transition');
  const logoPath = `../character/${prefix}/logo.png`;
  
  const img = new Image();
  img.src = logoPath;
  img.onload = () => {
    const aspectRatio = img.width / img.height;
    const logoHeight = 80;
    const logoWidth = logoHeight * aspectRatio;
    
    // Grid spacing (checkerboard)
    const spacingX = logoWidth * 2;
    const spacingY = logoHeight * 2;

    // Set CSS variables for seamless loop based on exact grid unit
    slash.style.setProperty('--tx', `${spacingX}px`);
    slash.style.setProperty('--ty', `${spacingY}px`);
    
    const containerWidth = slash.offsetWidth;
    const containerHeight = slash.offsetHeight;
    
    // Expand grid to cover rotation and translation offset
    const cols = Math.ceil(containerWidth / spacingX) + 4;
    const rows = Math.ceil(containerHeight / spacingY) + 4;
    
    for (let r = -2; r < rows; r++) {
      for (let c = -2; c < cols; c++) {
        // Checkerboard pattern: only place logo if row+col is even
        if ((r + c) % 2 === 0) {
          const logo = document.createElement('img');
          logo.src = logoPath;
          logo.className = 'river-logo';
          logo.style.height = `${logoHeight}px`;
          logo.style.top = `${r * spacingY}px`;
          logo.style.left = `${c * spacingX}px`;
          slash.appendChild(logo);
        }
      }
    }
  };
}

function stopLogoRiver() {
  const slash = document.getElementById('slash-transition');
  const logos = slash.querySelectorAll('.river-logo');
  logos.forEach(logo => {
    logo.classList.add('fading');
    // Remove from DOM after fade animation finishes
    setTimeout(() => logo.remove(), 500);
  });
}

function inkEffect(e){ const splash = document.createElement('div'); splash.className='ink-splash'; splash.style.left = e.clientX + 'px'; splash.style.top = e.clientY + 'px'; document.body.appendChild(splash); setTimeout(()=>splash.remove(),400); }

window.onload = ()=>{
  createSparks();
  renderLinks();
  startLoopAnimacion();
  const wrapper = document.getElementById('character-wrapper');
  // default to enlarged list mode
  wrapper.classList.add('scale-list');
  CharacterController.switchCharacter('default', { idle: 1, blink: 1 });
  CharacterController.playState('idle');
};
