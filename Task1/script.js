/* ---------- HERO SLIDER (auto + manual) ---------- */
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideIndex = 0;

function showSlide(i){
  slides.forEach(s=>s.classList.remove('active'));
  dots.forEach(d=>d.classList.remove('active'));
  slides[i].classList.add('active');
  dots[i].classList.add('active');
  slideIndex = i;
}
dots.forEach(d=>d.addEventListener('click', e=>{
  showSlide(parseInt(e.currentTarget.dataset.index));
  resetAuto();
}));

function autoSlide(){
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}
let autoTimer = setInterval(autoSlide, 4000);
function resetAuto(){
  clearInterval(autoTimer);
  autoTimer = setInterval(autoSlide, 4000);
}

/* ---------- HERO PARALLAX (mouse move) ---------- */
const heroBg = document.getElementById('hero-bg');
document.querySelector('.hero').addEventListener('mousemove', (e)=>{
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
  heroBg.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.06)`;
});
document.querySelector('.hero').addEventListener('mouseleave', ()=>{
  heroBg.style.transform = 'translate3d(0,0,0) scale(1)';
});

/* ---------- FILTERS + SEARCH ---------- */
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search');
const cards = Array.from(document.querySelectorAll('.card'));

function applyFilterCategory(cat){
  cards.forEach(card=>{
    const c = card.dataset.category;
    if(cat === 'all' || c === cat) card.style.display = '';
    else card.style.display = 'none';
  });
  // also re-run search to combine filters
  runSearch();
}

filterButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filterButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    applyFilterCategory(btn.dataset.filter);
  });
});

function runSearch(){
  const q = searchInput.value.trim().toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  cards.forEach(card=>{
    const title = card.dataset.title.toLowerCase();
    const cat = card.dataset.category;
    const matchesSearch = title.includes(q);
    const matchesFilter = (activeFilter==='all' || activeFilter===cat);
    card.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
  });
}
searchInput.addEventListener('input', runSearch);

/* ---------- LAZY ANIMATE ON SCROLL (IntersectionObserver) ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      ent.target.classList.add('visible');
      io.unobserve(ent.target); // one-time reveal
    }
  });
},{ threshold: 0.12 });

cards.forEach(c=> io.observe(c));

/* ---------- LIGHTBOX (caption + download + prev/next) ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
const lbCategory = document.getElementById('lb-category');
const lbDownload = document.getElementById('lb-download');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

let visibleCards = []; // dynamic list of shown cards (after filter+search)
function refreshVisibleCards(){
  visibleCards = cards.filter(c => c.style.display !== 'none');
}
refreshVisibleCards();

function openLightboxByIndex(i){
  const card = visibleCards[i];
  if(!card) return;
  const img = card.querySelector('img');
  lbImg.src = img.src;
  lbTitle.textContent = card.dataset.title || '';
  lbCategory.textContent = card.dataset.category || '';
  lbDownload.href = img.src;
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden','false');
  currentLBIndex = i;
}
let currentLBIndex = 0;

function openLightboxFromCard(card){
  refreshVisibleCards();
  const idx = visibleCards.indexOf(card);
  if(idx === -1) return;
  openLightboxByIndex(idx);
}

document.querySelectorAll('.open-lightbox').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const card = e.currentTarget.closest('.card');
    openLightboxFromCard(card);
  });
});

// Prev/Next handlers
lbPrev.addEventListener('click', ()=>{
  refreshVisibleCards();
  currentLBIndex = (currentLBIndex - 1 + visibleCards.length) % visibleCards.length;
  openLightboxByIndex(currentLBIndex);
});
lbNext.addEventListener('click', ()=>{
  refreshVisibleCards();
  currentLBIndex = (currentLBIndex + 1) % visibleCards.length;
  openLightboxByIndex(currentLBIndex);
});

// Close
lbClose.addEventListener('click', closeLB);
lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) closeLB(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeLB(); if(e.key==='ArrowLeft') lbPrev.click(); if(e.key==='ArrowRight') lbNext.click(); });

function closeLB(){
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden','true');
}

/* ---------- THEME (dark/light) ---------- */
const themeToggle = document.getElementById('theme-toggle');
function setTheme(t){
  if(t === 'light'){
    document.documentElement.style.setProperty('--bg','#f6f7fb');
    document.documentElement.style.setProperty('--card','#ffffff');
    document.documentElement.style.setProperty('--text','#061224');
    document.documentElement.style.setProperty('--muted','#567');
    document.documentElement.style.setProperty('--accent','#00a86b');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme','light');
  } else {
    document.documentElement.style.setProperty('--bg','#0f1724');
    document.documentElement.style.setProperty('--card','#1b2430');
    document.documentElement.style.setProperty('--text','#ffffff');
    document.documentElement.style.setProperty('--muted','#aab3c2');
    document.documentElement.style.setProperty('--accent','#00ff99');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme','dark');
  }
}
themeToggle.addEventListener('click', ()=>{
  const cur = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  setTheme(cur === 'light' ? 'dark' : 'light');
});

// initialize theme
setTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');

/* ---------- Recompute visibleCards after filters/search change ---------- */
['click','input'].forEach(ev=>{
  document.addEventListener(ev, ()=>{ refreshVisibleCards(); });
});

/* ---------- Ensure filter/search applies initially ---------- */
applyInitial();

function applyInitial(){
  // show all initially
  refreshVisibleCards();
}