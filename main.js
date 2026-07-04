const translations = {
  en: {
    page: {
      title: 'Naytools Linktree',
      logo: 'Naytools LINKTREE',
      modalDefaultPrompt: 'Are you sure you want to visit this page?',
      modalCancel: 'CANCEL',
      modalConfirm: 'PROCEED'
    },
    links: {
      x: {
        name: 'X / Naytools',
        subtitle: 'Quick updates and direct links',
        specialText: 'Open Naytools X account?'
      },
      f95zone: {
        name: 'F95Zone / Naytools',
        subtitle: 'Recent posts and community',
        specialText: 'Open the Naytools search on F95Zone?'
      },
      patreon: {
        name: 'Patreon / Naytools',
        subtitle: 'Support me and unlock extra content',
        specialText: 'Open Naytools Patreon page?'
      },
      itchio: {
        name: 'Itch.io / Naytools',
        subtitle: 'Download the demos here',
        specialText: 'Open Naytools Itch.io page?'
      }
    }
  },
  es: {
    page: {
      title: 'Naytools Linktree',
      logo: 'Naytools LINKTREE',
      modalDefaultPrompt: '¿Seguro que deseas visitar esta página?',
      modalCancel: 'CANCELAR',
      modalConfirm: 'CONTINUAR'
    },
    links: {
      x: {
        name: 'X / Naytools',
        subtitle: 'Actualizaciones rápidas y enlaces directos',
        specialText: '¿Abrir la cuenta de X de Naytools?'
      },
      f95zone: {
        name: 'F95Zone / Naytools',
        subtitle: 'Publicaciones recientes y comunidad',
        specialText: '¿Abrir la búsqueda de Naytools en F95Zone?'
      },
      patreon: {
        name: 'Patreon / Naytools',
        subtitle: 'Apóyame y desbloquea contenido extra',
        specialText: '¿Ir a Patreon de Naytools?'
      },
      itchio: {
        name: 'Itch.io / Naytools',
        subtitle: 'Descarga los demos aquí',
        specialText: '¿Abrir la página de Itch.io de Naytools?'
      }
    }
  }
};

function getPreferredLocale() {
  const browserLanguage = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  return browserLanguage.startsWith('es') ? 'es' : 'en';
}

function buildLinksData(locale) {
  const dictionary = translations[locale] || translations.en;
  return [
    {
      name: dictionary.links.x.name,
      subtitle: dictionary.links.x.subtitle,
      url: 'https://x.com/Naytools',
      specialText: dictionary.links.x.specialText,
      spritePrefix: 'x',
      frames: { idle: 1, blink: 1 }
    },
    {
      name: dictionary.links.f95zone.name,
      subtitle: dictionary.links.f95zone.subtitle,
      url: 'https://f95zone.to/search/647099816/?c[users]=Naytools&o=date',
      specialText: dictionary.links.f95zone.specialText,
      spritePrefix: 'f95zone',
      frames: { idle: 1, blink: 1 }
    },
    {
      name: dictionary.links.patreon.name,
      subtitle: dictionary.links.patreon.subtitle,
      url: 'https://www.patreon.com/cw/Naytools',
      specialText: dictionary.links.patreon.specialText,
      spritePrefix: 'patreon',
      frames: { idle: 1, blink: 1 }
    },
    {
      name: dictionary.links.itchio.name,
      subtitle: dictionary.links.itchio.subtitle,
      url: 'https://nayeib.itch.io/',
      specialText: dictionary.links.itchio.specialText,
      spritePrefix: 'itchio',
      frames: { idle: 1, blink: 1 }
    }
  ];
}

let currentPrefix = 'default';
let currentPose = 'idle';
let blinkIntervalId = null;
let currentLocale = getPreferredLocale();
let linksData = buildLinksData(currentLocale);

const charDisplay = document.getElementById('hero-character');
CharacterController.setElement(charDisplay);

function applyLocalization(locale) {
  const dictionary = translations[locale] || translations.en;
  currentLocale = locale;
  document.documentElement.lang = locale;
  document.title = dictionary.page.title;
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.textContent = dictionary.page.logo;
  }

  const modalPrompt = document.getElementById('modal-prompt');
  if (modalPrompt) {
    modalPrompt.textContent = dictionary.page.modalDefaultPrompt;
  }

  const cancelButton = document.getElementById('modal-cancel-btn');
  if (cancelButton) {
    cancelButton.textContent = dictionary.page.modalCancel;
  }

  const confirmButton = document.getElementById('modal-confirm-btn');
  if (confirmButton) {
    confirmButton.textContent = dictionary.page.modalConfirm;
  }

  linksData = buildLinksData(locale);
  renderLinks();
}

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
  if (blinkIntervalId) clearInterval(blinkIntervalId);
  blinkIntervalId = setInterval(()=>{
    CharacterController.playState('blink');
    setTimeout(()=> CharacterController.playState('idle'), 300);
  }, 4200);
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
  CharacterController.switchCharacter(currentPrefix, link.frames);
  CharacterController.playState('idle');

  const slash = document.getElementById('slash-transition');
  slash.classList.add('side-visible');
  startLogoRiver(currentPrefix);

  document.getElementById('links-container').classList.add('hidden');
  const wrapper = document.getElementById('character-wrapper');
  wrapper.classList.remove('scale-list');
  wrapper.classList.add('center-stage');
  wrapper.classList.add('exit');

  document.getElementById('modal-prompt').innerText = link.specialText;
  const confirmBtn = document.getElementById('modal-confirm-btn');
  confirmBtn.onclick = () => { triggerSlashTransition(()=>{ window.location.href = link.url; }); };

  setTimeout(()=>{
    document.getElementById('vn-modal').classList.add('active');
  }, 280);

  setTimeout(()=>{
    wrapper.classList.remove('exit');
    wrapper.classList.add('behind-modal');
    CharacterController.switchCharacter(currentPrefix, link.frames);
    CharacterController.playState('idle');
  }, 520);
}

function closeVNModal(){
  document.getElementById('vn-modal').classList.remove('active');
  document.getElementById('links-container').classList.remove('hidden');

  const slash = document.getElementById('slash-transition');
  slash.classList.remove('side-visible');
  stopLogoRiver();

  const wrapper = document.getElementById('character-wrapper');
  wrapper.classList.remove('behind-modal');
  wrapper.classList.remove('exit');
  wrapper.classList.remove('center-stage');
  wrapper.classList.add('scale-list');
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
    
    const spacingX = logoWidth * 2;
    const spacingY = logoHeight * 2;

    slash.style.setProperty('--tx', `${spacingX}px`);
    slash.style.setProperty('--ty', `${spacingY}px`);
    
    const containerWidth = slash.offsetWidth;
    const containerHeight = slash.offsetHeight;
    
    const cols = Math.ceil(containerWidth / spacingX) + 4;
    const rows = Math.ceil(containerHeight / spacingY) + 4;
    
    for (let r = -2; r < rows; r++) {
      for (let c = -2; c < cols; c++) {
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
    setTimeout(() => logo.remove(), 500);
  });
}

function inkEffect(e){ const splash = document.createElement('div'); splash.className='ink-splash'; splash.style.left = e.clientX + 'px'; splash.style.top = e.clientY + 'px'; document.body.appendChild(splash); setTimeout(()=>splash.remove(),400); }

window.onload = ()=>{
  createSparks();
  applyLocalization(currentLocale);
  startLoopAnimacion();
  const wrapper = document.getElementById('character-wrapper');
  wrapper.classList.add('scale-list');
  CharacterController.switchCharacter('default', { idle: 1, blink: 1 });
  CharacterController.playState('idle');
};
