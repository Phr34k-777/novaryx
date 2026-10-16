/* ============================================
   NOVARYX STORE - Shop Page JavaScript
============================================ */

let shopState = {
  category: new URLSearchParams(window.location.search).get("cat") || "all",
  search: new URLSearchParams(window.location.search).get("q") || "",
  sort: "popular",
  page: 1,
  perPage: 12,
  view: "grid",
  filters: {
    priceMin: 0,
    priceMax: 1000,
    brands: [],
    sizes: [],
    colors: [],
    tags: [],
    rating: 0,
  }
};

// ---- Get Filtered Products ----
function getFilteredProducts() {
  let result = [...PRODUCTS];
  
  if (shopState.category !== "all") {
    result = result.filter(p => p.category === shopState.category);
  }
  
  if (shopState.search) {
    const q = shopState.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }
  
  const f = shopState.filters;
  result = result.filter(p => p.price >= f.priceMin && p.price <= f.priceMax);
  
  if (f.brands.length > 0) result = result.filter(p => f.brands.includes(p.brand));
  if (f.tags.length > 0) result = result.filter(p => f.tags.some(t => p.tags.includes(t)));
  if (f.rating > 0) result = result.filter(p => p.rating >= f.rating);
  if (f.sizes.length > 0) result = result.filter(p => p.sizes?.some(s => f.sizes.includes(s)));
  
  // Sort
  switch (shopState.sort) {
    case "price-asc": result.sort((a, b) => a.price - b.price); break;
    case "price-desc": result.sort((a, b) => b.price - a.price); break;
    case "rating": result.sort((a, b) => b.rating - a.rating); break;
    case "newest": result.sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0)); break;
    case "discount": result.sort((a, b) => {
      const da = a.oldPrice ? (1 - a.price / a.oldPrice) : 0;
      const db = b.oldPrice ? (1 - b.price / b.oldPrice) : 0;
      return db - da;
    }); break;
    default: result.sort((a, b) => b.reviews - a.reviews); // popular
  }
  
  return result;
}

// ---- Render Products ----
function renderShopProducts() {
  const container = document.getElementById("shop-products");
  if (!container) return;
  
  const filtered = getFilteredProducts();
  const start = (shopState.page - 1) * shopState.perPage;
  const end = start + shopState.perPage;
  const displayed = filtered.slice(start, end);
  
  // Count
  const countEl = document.getElementById("products-count");
  if (countEl) countEl.innerHTML = `<strong>${filtered.length}</strong> produits trouvés`;
  
  if (displayed.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:80px 24px;color:var(--text-muted);">
        <div style="font-size:64px;margin-bottom:16px;">🔍</div>
        <h3 style="color:var(--text-secondary);margin-bottom:8px;">Aucun produit trouvé</h3>
        <p>Essayez de modifier vos filtres ou votre recherche</p>
        <button class="btn btn-outline" onclick="resetFilters()" style="margin-top:16px;">Réinitialiser les filtres</button>
      </div>
    `;
  } else {
    container.className = shopState.view === "list" 
      ? "grid" 
      : "grid grid-4";
    container.innerHTML = displayed.map(p => createProductCard(p)).join("");
  }
  
  renderPagination(filtered.length);
  updateActiveFilters();
}

// ---- Pagination ----
function renderPagination(total) {
  const container = document.getElementById("pagination");
  if (!container) return;
  
  const totalPages = Math.ceil(total / shopState.perPage);
  if (totalPages <= 1) { container.innerHTML = ""; return; }
  
  let html = "";
  if (shopState.page > 1) html += `<button class="page-btn" onclick="goToPage(${shopState.page - 1})">‹</button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= shopState.page - 2 && i <= shopState.page + 2)) {
      html += `<button class="page-btn ${i === shopState.page ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === shopState.page - 3 || i === shopState.page + 3) {
      html += `<span style="color:var(--text-muted);padding:0 4px;">…</span>`;
    }
  }
  
  if (shopState.page < totalPages) html += `<button class="page-btn" onclick="goToPage(${shopState.page + 1})">›</button>`;
  
  container.innerHTML = html;
}

function goToPage(page) {
  shopState.page = page;
  renderShopProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- Active Filter Tags ----
function updateActiveFilters() {
  const container = document.getElementById("active-filters");
  if (!container) return;
  
  const tags = [];
  if (shopState.category !== "all") tags.push({ label: getCategoryName(shopState.category), key: "category" });
  if (shopState.search) tags.push({ label: `"${shopState.search}"`, key: "search" });
  if (shopState.filters.brands.length > 0) shopState.filters.brands.forEach(b => tags.push({ label: b, key: `brand-${b}` }));
  if (shopState.filters.rating > 0) tags.push({ label: `${shopState.filters.rating}⭐+`, key: "rating" });
  
  container.innerHTML = tags.map(t => `
    <div class="active-filter-tag">
      ${t.label}
      <button onclick="removeFilter('${t.key}')">✕</button>
    </div>
  `).join("");
}

function removeFilter(key) {
  if (key === "category") shopState.category = "all";
  else if (key === "search") shopState.search = "";
  else if (key.startsWith("brand-")) shopState.filters.brands = shopState.filters.brands.filter(b => b !== key.slice(6));
  else if (key === "rating") shopState.filters.rating = 0;
  shopState.page = 1;
  renderShopProducts();
}

function resetFilters() {
  shopState.filters = { priceMin: 0, priceMax: 1000, brands: [], sizes: [], colors: [], tags: [], rating: 0 };
  shopState.category = "all";
  shopState.search = "";
  shopState.page = 1;
  renderShopProducts();
  
  document.querySelectorAll(".filter-option input").forEach(i => i.checked = false);
  document.querySelectorAll(".size-btn.active, .color-swatch.active").forEach(el => el.classList.remove("active"));
}

// ---- Filter Sidebar ----
function initFilters() {
  // Filter panel collapse
  document.querySelectorAll(".filter-panel-header").forEach(header => {
    header.addEventListener("click", () => {
      header.parentElement.classList.toggle("collapsed");
    });
  });
  
  // Brand checkboxes
  renderBrandFilter();
  
  // Sort
  document.getElementById("sort-select")?.addEventListener("change", e => {
    shopState.sort = e.target.value;
    shopState.page = 1;
    renderShopProducts();
  });
  
  // View toggle
  document.getElementById("view-grid")?.addEventListener("click", () => setView("grid"));
  document.getElementById("view-list")?.addEventListener("click", () => setView("list"));
  
  // Price range
  initPriceRange();
  
  // Category tabs (sidebar)
  document.querySelectorAll("[data-cat-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      shopState.category = btn.dataset.catFilter;
      shopState.page = 1;
      document.querySelectorAll("[data-cat-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderShopProducts();
    });
  });
  
  // Rating filter
  document.querySelectorAll("[data-rating-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      shopState.filters.rating = parseFloat(btn.dataset.ratingFilter);
      shopState.page = 1;
      document.querySelectorAll("[data-rating-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderShopProducts();
    });
  });
  
  // Tags
  document.querySelectorAll("[data-tag-filter]").forEach(cb => {
    cb.addEventListener("change", () => {
      const tag = cb.dataset.tagFilter;
      if (cb.checked) shopState.filters.tags.push(tag);
      else shopState.filters.tags = shopState.filters.tags.filter(t => t !== tag);
      shopState.page = 1;
      renderShopProducts();
    });
  });
}

function renderBrandFilter() {
  const container = document.getElementById("brand-filter");
  if (!container) return;
  
  const brandCounts = {};
  PRODUCTS.forEach(p => { brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1; });
  
  container.innerHTML = Object.entries(brandCounts).map(([brand, count]) => `
    <label class="filter-option">
      <input type="checkbox" data-brand="${brand}" onchange="toggleBrandFilter('${brand}', this.checked)">
      <span class="filter-check"></span>
      <span class="filter-option-label">${brand}</span>
      <span class="filter-option-count">${count}</span>
    </label>
  `).join("");
}

function toggleBrandFilter(brand, checked) {
  if (checked) shopState.filters.brands.push(brand);
  else shopState.filters.brands = shopState.filters.brands.filter(b => b !== brand);
  shopState.page = 1;
  renderShopProducts();
}

function initPriceRange() {
  const minInput = document.getElementById("price-min");
  const maxInput = document.getElementById("price-max");
  
  if (!minInput || !maxInput) return;
  
  function update() {
    shopState.filters.priceMin = parseInt(minInput.value);
    shopState.filters.priceMax = parseInt(maxInput.value);
    shopState.page = 1;
    renderShopProducts();
    
    const minDisplay = document.getElementById("price-min-display");
    const maxDisplay = document.getElementById("price-max-display");
    if (minDisplay) minDisplay.textContent = formatPrice(parseInt(minInput.value));
    if (maxDisplay) maxDisplay.textContent = formatPrice(parseInt(maxInput.value));
  }
  
  minInput.addEventListener("input", update);
  maxInput.addEventListener("input", update);
}

function setView(view) {
  shopState.view = view;
  document.getElementById("view-grid")?.classList.toggle("active", view === "grid");
  document.getElementById("view-list")?.classList.toggle("active", view === "list");
  renderShopProducts();
}

// ---- Mobile Filter Toggle ----
function toggleMobileFilter() {
  const sidebar = document.getElementById("filter-sidebar");
  sidebar?.classList.toggle("mobile-open");
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  // Read URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get("cat")) shopState.category = params.get("cat");
  if (params.get("q")) shopState.search = params.get("q");
  
  initFilters();
  renderShopProducts();
  
  // Mobile filter btn
  document.getElementById("mobile-filter-btn")?.addEventListener("click", toggleMobileFilter);
  
  console.log("🏪 Shop page initialized");
});