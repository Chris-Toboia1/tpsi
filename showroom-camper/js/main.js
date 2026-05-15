import { vehicles } from './data.js';

// ELEMENTI DOM
const catalogGrid = document.getElementById('catalog-grid');
const favGrid = document.getElementById('favorites-grid');

const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');

const toastContainer = document.getElementById('toast-container');

const modalOverlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const themeBtn = document.getElementById('theme-toggle');

const hamburgerBtn = document.getElementById('hamburger-btn');
const mainNav = document.getElementById('main-nav');

// FAVORITI
let favorites = JSON.parse(localStorage.getItem('camper_favs')) || [];

// TOAST
function showToast(message) {

  const toast = document.createElement('div');

  toast.className = 'toast';
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// CREA CARD
function createCard(camper) {

  const isFav = favorites.includes(camper.id);

  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${camper.image}" alt="${camper.name}">

    <h3>${camper.name}</h3>

    <p>${camper.brand}</p>

    <p class="price">
      € ${camper.price.toLocaleString('it-IT')}
    </p>

    <div style="display:flex; gap:10px; margin-top:auto;">

      <button 
        class="btn-gold btn-details"
        data-id="${camper.id}"
      >
        Dettagli
      </button>

      <button 
        class="btn-gold btn-fav"
        data-id="${camper.id}"
      >
        ${isFav ? '❤️ Salvato' : '🤍 Preferiti'}
      </button>

    </div>
  `;

  return card;
}

// RENDER CATALOGO
function renderCatalog() {

  let filtered = [...vehicles];

  const term = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sort = sortSelect.value;

  // CERCA
  if (term) {

    filtered = filtered.filter(vehicle =>
      vehicle.name.toLowerCase().includes(term) ||
      vehicle.brand.toLowerCase().includes(term)
    );
  }

  // CATEGORIA
  if (category !== 'all') {

    filtered = filtered.filter(vehicle =>
      vehicle.category === category
    );
  }

  // ORDINA
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // MOSTRA
  catalogGrid.innerHTML = '';

  filtered.forEach(vehicle => {
    catalogGrid.appendChild(createCard(vehicle));
  });

  renderFavorites();
}

// RENDER FAVORITI
function renderFavorites() {

  favGrid.innerHTML = '';

  const favVehicles = vehicles.filter(vehicle =>
    favorites.includes(vehicle.id)
  );

  if (favVehicles.length === 0) {

    favGrid.innerHTML = `
      <p style="color:var(--text-soft);">
        Nessun camper salvato.
      </p>
    `;

    return;
  }

  favVehicles.forEach(vehicle => {
    favGrid.appendChild(createCard(vehicle));
  });
}

// MODAL DETTAGLI
function openModal(id) {

  const camper = vehicles.find(v => v.id === id);

  if (!camper) return;

  modalBody.innerHTML = `

    <img
      src="${camper.image}"
      alt="${camper.name}"
      style="
        width:100%;
        border-radius:20px;
        margin-bottom:20px;
      "
    >

    <h2>${camper.name}</h2>

    <p style="margin:10px 0;">
      <strong>Marca:</strong> ${camper.brand}
    </p>

    <p style="margin:10px 0;">
      <strong>Categoria:</strong> ${camper.category}
    </p>

    <p class="price">
      € ${camper.price.toLocaleString('it-IT')}
    </p>

    <p style="margin-top:20px; line-height:1.7;">
      ${camper.desc}
    </p>
  `;

  modalOverlay.classList.remove('hidden');
}

// CHIUDI MODAL
function closeModal() {
  modalOverlay.classList.add('hidden');
}

// EVENTI CLICK
document.addEventListener('click', (e) => {

  // PREFERITI
  if (e.target.classList.contains('btn-fav')) {

    const id = Number(e.target.dataset.id);

    if (favorites.includes(id)) {

      favorites = favorites.filter(fav => fav !== id);

      showToast('Rimosso dai preferiti');

    } else {

      favorites.push(id);

      showToast('Aggiunto ai preferiti');
    }

    localStorage.setItem(
      'camper_favs',
      JSON.stringify(favorites)
    );

    renderCatalog();
  }

  // DETTAGLI
  if (e.target.classList.contains('btn-details')) {

    const id = Number(e.target.dataset.id);

    openModal(id);
  }
});

// CHIUSURA MODAL
modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {

  if (e.target === modalOverlay) {
    closeModal();
  }
});

// FILTRI
searchInput.addEventListener('input', renderCatalog);

categoryFilter.addEventListener('change', renderCatalog);

sortSelect.addEventListener('change', renderCatalog);

// DARK MODE
function applyTheme(theme) {

  if (theme === 'light') {

    document.body.classList.add('light-mode');
    themeBtn.textContent = '☀️';

  } else {

    document.body.classList.remove('light-mode');
    themeBtn.textContent = '🌙';
  }
}

// TEMA SALVATO
const savedTheme =
  localStorage.getItem('camper_theme') || 'dark';

applyTheme(savedTheme);

// CLICK TEMA
themeBtn.addEventListener('click', () => {

  const isLight =
    document.body.classList.contains('light-mode');

  const newTheme = isLight ? 'dark' : 'light';

  localStorage.setItem('camper_theme', newTheme);

  applyTheme(newTheme);
});

// MENU HAMBURGER
hamburgerBtn.addEventListener('click', () => {

  mainNav.classList.toggle('active');
});

// CHIUSURA MENU MOBILE
document.querySelectorAll('.nav-link').forEach(link => {

  link.addEventListener('click', () => {
    mainNav.classList.remove('active');
  });
});

// FORM CONTATTI
const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {

  e.preventDefault();

  showToast('Messaggio inviato con successo!');

  form.reset();
});

// AVVIO
renderCatalog();
