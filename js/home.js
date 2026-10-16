/* ============================================
   NOVARYX STORE - Homepage JavaScript
============================================ */

// ---- Render Categories ----
function renderCategories() {
  const container = document.getElementById("categories-track");
  if (!container) return;
  
  container.innerHTML = CATEGORIES.map((cat, i) => `
    <div class="category-card ${i === 0 ? "active" : ""}" 
         data-category="${cat.id}"
         onclick="filterByCategory('${cat.id}', this)">
      <span class="category-icon">${cat.icon}</span>
      <span class="category-name">${cat.name}</span>
      <span class="category-count">${cat.count} articles</span>
    </div>
  `).join("");
}

// ---- Filter by Category ----
let currentCategory = "all";

function filterByCategory(catId, el) {
  currentCategory = catId;
  document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
  el?.classList.add("active");
  renderFeaturedProducts(catId);
}

// ---- Render Featured Products ----
function renderFeaturedProducts(category = "all", limit = 8) {
  const container = document.getElementById("featured-products");
  if (!container) return;
  
  const filtered = category === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category);
  
  const sorted = [...filtered].sort((a, b) => {
    const hasTag = p => p.tags.includes("bestseller") ? 2 : p.tags.includes("new") ? 1 : 0;
    return hasTag(b) - hasTag(a);
  });
  
  const displayed = sorted.slice(0, limit);
  
  container.style.opacity = "0";
  container.style.transform = "translateY(16px)";
  
  setTimeout(() => {
    container.innerHTML = displayed.map(p => createProductCard(p)).join("");
    container.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    container.style.opacity = "1";
    container.style.transform = "translateY(0)";
  }, 150);
}

// ---- New Arrivals ----
function renderNewArrivals() {
  const container = document.getElementById("new-arrivals");
  if (!container) return;
  
  const newProducts = PRODUCTS.filter(p => p.tags.includes("new")).slice(0, 4);
  container.innerHTML = newProducts.map(p => createProductCard(p)).join("");
}

// ---- Flash Sale Products ----
function renderFlashSale() {
  const container = document.getElementById("flash-sale-products");
  if (!container) return;
  
  const saleProducts = PRODUCTS.filter(p => p.oldPrice).slice(0, 4);
  container.innerHTML = saleProducts.map(p => createProductCard(p)).join("");
}

// ---- Bestsellers ----
function renderBestsellers() {
  const container = document.getElementById("bestsellers-products");
  if (!container) return;
  
  const best = PRODUCTS.filter(p => p.tags.includes("bestseller")).slice(0, 4);
  container.innerHTML = best.map(p => createProductCard(p)).join("");
}

// ---- Hero Slides ----
const heroSlides = [
  {
    badge: "🆕 Nouveautés 2025",
    title: "PERFORM\nBEYOND\nLIMITS",
    titleAccent: "BEYOND",
    desc: "Découvrez notre collection exclusive de chaussures professionnelles et d'équipements sportifs haute performance.",
    cta: "Explorer la Collection",
    ctaLink: "shop.html",
    emoji: "👟",
    color: "var(--primary)",
  },
  {
    badge: "⚡ Tech Premium",
    title: "SOUND\nWITHOUT\nBOUNDS",
    titleAccent: "WITHOUT",
    desc: "La technologie audio qui redéfinit l'expérience musicale. ANC avancé, son cristallin, confort optimal.",
    cta: "Voir l'Électronique",
    ctaLink: "shop.html?cat=electronics",
    emoji: "🎧",
    color: "var(--accent)",
  },
  {
    badge: "👔 Style Professionnel",
    title: "DRESS\nFOR\nSUCCESS",
    titleAccent: "FOR",
    desc: "Vêtements et chaussures de qualité premium pour les professionnels qui exigent l'excellence.",
    cta: "Découvrir la Mode",
    ctaLink: "shop.html?cat=clothing",
    emoji: "🤵",
    color: "var(--gold)",
  },
];

let currentSlide = 0;
let slideInterval;

function updateHeroSlide(index) {
  const slide = heroSlides[index];
  const titleEl = document.getElementById("hero-title");
  const descEl = document.getElementById("hero-desc");
  const badgeEl = document.getElementById("hero-badge");
  const emojiEl = document.getElementById("hero-emoji");
  const ctaEl = document.getElementById("hero-cta");
  
  if (!titleEl) return;
  
  // Fade out
  [titleEl, descEl].forEach(el => {
    if (el) { el.style.opacity = "0"; el.style.transform = "translateY(20px)"; }
  });
  
  setTimeout(() => {
    if (badgeEl) badgeEl.textContent = slide.badge;
    if (emojiEl) emojiEl.textContent = slide.emoji;
    if (ctaEl) ctaEl.href = slide.ctaLink;
    
    // Rebuild title with accent
    const lines = slide.title.split("\n");
    titleEl.innerHTML = lines.map(line => 
      line === slide.titleAccent 
        ? `<span class="line-accent">${line}</span>` 
        : line
    ).join("<br>");
    
    if (descEl) descEl.textContent = slide.desc;
    
    // Fade in
    [titleEl, descEl].forEach(el => {
      if (el) {
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  }, 300);
  
  // Update dots
  document.querySelectorAll(".hero-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % heroSlides.length;
  updateHeroSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
  updateHeroSlide(currentSlide);
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
  clearInterval(slideInterval);
}

// ---- Brands Marquee ----
function renderBrands() {
  const containers = document.querySelectorAll(".brands-inner");
  const brandsHTML = [...BRANDS, ...BRANDS].map(b => `<div class="brand-item">${b}</div>`).join("");
  containers.forEach(c => c.innerHTML = brandsHTML);
}

// ---- Newsletter ----
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  
  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = form.querySelector("input[type='email']").value;
    if (!email) return;
    showToast(`Merci! ${email} est inscrit à notre newsletter 🎉`, "success");
    form.reset();
  });
}

// ---- Stats Counter Animation ----
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target.toLocaleString();
              clearInterval(interval);
            } else {
              el.textContent = Math.floor(current).toLocaleString();
            }
          }, 16);
          observer.unobserve(el);
        }
      });
    });
    
    observer.observe(el);
  });
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    observer.observe(el);
  });
}

// ---- Currency Modal ----
function openCurrencyModal() {
  const modal = document.getElementById("currency-modal");
  if (modal) modal.style.display = "flex";
}

function closeCurrencyModal() {
  const modal = document.getElementById("currency-modal");
  if (modal) modal.style.display = "none";
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderFeaturedProducts("all");
  renderNewArrivals();
  renderFlashSale();
  renderBestsellers();
  renderBrands();
  initNewsletter();
  animateCounters();
  initScrollReveal();
  
  // Hero slideshow
  startSlideshow();
  document.getElementById("hero-prev")?.addEventListener("click", () => { stopSlideshow(); prevSlide(); startSlideshow(); });
  document.getElementById("hero-next")?.addEventListener("click", () => { stopSlideshow(); nextSlide(); startSlideshow(); });
  
  // Currency
  document.getElementById("currency-select")?.addEventListener("change", e => setCurrency(e.target.value));
  
  console.log("🏠 Homepage initialized");
});