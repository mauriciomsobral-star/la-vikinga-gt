document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile nav */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('active');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('active');
  nav.classList.remove('active');
}));

/* Catálogo grid with "load more" */
const TOTAL_PAGES = 42;
const PAGE_SIZE = 12;
let loaded = 0;

const grid = document.getElementById('catalogo-grid');
const loadMoreBtn = document.getElementById('load-more');

function pageSrc(num) {
  return `assets/catalogo/page_${String(num).padStart(2, '0')}.jpg`;
}

function renderPage(num) {
  const img = document.createElement('img');
  img.src = pageSrc(num);
  img.loading = 'lazy';
  img.alt = `Catálogo La Vikinga - página ${num}`;
  img.dataset.index = num;
  grid.appendChild(img);
}

function loadMore() {
  const next = Math.min(loaded + PAGE_SIZE, TOTAL_PAGES);
  for (let i = loaded + 1; i <= next; i++) renderPage(i);
  loaded = next;
  if (loaded >= TOTAL_PAGES) loadMoreBtn.style.display = 'none';
}
loadMore();
loadMoreBtn.addEventListener('click', loadMore);

/* Lightbox with prev/next slideshow navigation */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCurrent = document.getElementById('lightbox-current');
document.getElementById('lightbox-total').textContent = TOTAL_PAGES;

let currentPage = 1;

function showPage(num) {
  currentPage = ((num - 1 + TOTAL_PAGES) % TOTAL_PAGES) + 1;
  lightboxImg.src = pageSrc(currentPage);
  lightboxCurrent.textContent = currentPage;
}

function openLightbox(num) {
  showPage(num);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

grid.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    openLightbox(parseInt(e.target.dataset.index, 10));
  }
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.querySelector('.lightbox-prev').addEventListener('click', () => showPage(currentPage - 1));
document.querySelector('.lightbox-next').addEventListener('click', () => showPage(currentPage + 1));

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') showPage(currentPage - 1);
  if (e.key === 'ArrowRight') showPage(currentPage + 1);
  if (e.key === 'Escape') closeLightbox();
});

/* swipe support inside lightbox on mobile */
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
lightbox.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? showPage(currentPage - 1) : showPage(currentPage + 1);
  }
});
