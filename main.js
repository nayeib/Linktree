const linksData = [
  {
    id: 'x',
    name: 'X / Naytools',
    subtitle: 'Actualizaciones rápidas y enlaces directos',
    url: 'https://x.com/Naytools',
    confirmText: '¿Quieres abrir la cuenta de X de Naytools?',
    previewTitle: 'Cuenta X de Naytools',
    previewDescription: 'Sigue a Naytools en X para noticias, drops y recursos digitales.',
    spritePrefix: 'x',
    brandColor: '#1da1f2',
    frames: { idle: 10, blink: 4, look: 5 }
  },
  {
    id: 'f95zone',
    name: 'F95Zone / Naytools',
    subtitle: 'Publicaciones recientes y comunidad',
    url: 'https://f95zone.to/search/647099816/?c[users]=Naytools&o=date',
    confirmText: '¿Abrir el enlace de búsqueda en F95Zone?',
    previewTitle: 'Resultados Naytools en F95Zone',
    previewDescription: 'Revisa los temas y publicaciones vinculadas con Naytools.',
    spritePrefix: 'f95zone',
    brandColor: '#8f6ae8',
    frames: { idle: 10, blink: 4, look: 5 }
  },
  {
    id: 'patreon',
    name: 'Patreon / Naytools',
    subtitle: 'Apóyame y desbloquea contenido extra',
    url: 'https://www.patreon.com/cw/Naytools',
    confirmText: '¿Quieres ir a Patreon de Naytools?',
    previewTitle: 'Página de Patreon',
    previewDescription: 'Apóyame en Patreon para contenido exclusivo y adelantos.',
    spritePrefix: 'patreon',
    brandColor: '#f96854',
    frames: { idle: 10, blink: 4, look: 5 }
  },
  {
    id: 'itchio',
    name: 'Itch.io / Naytools',
    subtitle: 'Descargas, demos y juegos independientes',
    url: 'https://nayeib.itch.io/',
    confirmText: '¿Abrir la página de Itch.io de Naytools?',
    previewTitle: 'Tienda Itch.io',
    previewDescription: 'Explora los proyectos y demos publicados por Naytools.',
    spritePrefix: 'itchio',
    brandColor: '#fa5f52',
    frames: { idle: 10, blink: 4, look: 5 }
  }
];

const linksList = document.getElementById('linksList');
const previewBrandIcon = document.getElementById('brandIcon');
const previewBrandName = document.getElementById('brandName');
const previewBrandCaption = document.getElementById('brandCaption');
const previewTitle = document.getElementById('previewTitle');
const previewDescription = document.getElementById('previewDescription');
const previewUrl = document.getElementById('previewUrl');
const modalOverlay = document.getElementById('modalOverlay');
const confirmModal = document.getElementById('confirmModal');
const modalBrand = document.getElementById('modalBrand');
const modalMessage = document.getElementById('modalMessage');
const modalTitle = document.getElementById('modalTitle');
const modalUrl = document.getElementById('modalUrl');
const cancelButton = document.getElementById('cancelButton');
const confirmButton = document.getElementById('confirmButton');
const modalClose = document.getElementById('modalClose');

let currentLink = linksData[0];
let pendingUrl = '';

function buildLinkCard(link, index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'link-card';
  button.dataset.index = String(index);
  button.innerHTML = `
    <div class="link-content">
      <span class="link-label">${link.name}</span>
      <span class="link-subtitle">${link.subtitle}</span>
    </div>
    <span class="link-pill">Abrir</span>
  `;
  button.addEventListener('click', () => openConfirm(index));
  button.addEventListener('pointerenter', () => updatePreview(index));
  button.addEventListener('focus', () => updatePreview(index));
  return button;
}

function renderLinks() {
  linksList.innerHTML = '';
  linksData.forEach((link, index) => {
    linksList.appendChild(buildLinkCard(link, index));
  });
}

function updatePreview(index) {
  const link = linksData[index];
  currentLink = link;
  pendingUrl = link.url;
  previewBrandIcon.textContent = link.id.charAt(0).toUpperCase();
  previewBrandIcon.style.background = `linear-gradient(135deg, ${link.brandColor}, rgba(255,255,255,0.14))`;
  previewBrandName.textContent = link.name;
  previewBrandCaption.textContent = link.previewTitle;
  previewTitle.textContent = link.previewTitle;
  previewDescription.textContent = link.previewDescription;
  previewUrl.textContent = link.url;
  modalBrand.textContent = link.name.split(' ')[0];
  modalMessage.textContent = link.confirmText;
  modalTitle.textContent = link.previewTitle;
  modalUrl.textContent = link.url;
  CharacterController.switchCharacter(link.spritePrefix, link.frames);
}

function openConfirm(index) {
  updatePreview(index);
  confirmModal.classList.add('visible');
  modalOverlay.classList.add('visible');
  modalOverlay.removeAttribute('hidden');
  confirmModal.setAttribute('aria-hidden', 'false');
  CharacterController.playState('look');
}

function closeConfirm() {
  confirmModal.classList.remove('visible');
  modalOverlay.classList.remove('visible');
  modalOverlay.setAttribute('hidden', '');
  confirmModal.setAttribute('aria-hidden', 'true');
  CharacterController.playState('idle');
}

function onConfirm() {
  if (!pendingUrl) return;
  closeConfirm();
  CharacterController.playState('blink');
  window.open(pendingUrl, '_blank', 'noopener');
}

function bindEvents() {
  cancelButton.addEventListener('click', closeConfirm);
  modalClose.addEventListener('click', closeConfirm);
  modalOverlay.addEventListener('click', closeConfirm);
  confirmButton.addEventListener('click', onConfirm);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && confirmModal.classList.contains('visible')) {
      closeConfirm();
    }
  });
}

function initialize() {
  renderLinks();
  bindEvents();
  updatePreview(0);
}

window.addEventListener('DOMContentLoaded', initialize);
