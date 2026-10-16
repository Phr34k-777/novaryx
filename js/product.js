/* ============================================
   NOVARYX STORE - Product Detail JavaScript
============================================ */

let selectedOptions = {
  size: null,
  color: null,
  qty: 1,
};

// ---- Load Product ----
function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")) || 1;
  const product = PRODUCTS.find(p => p.id === productId);
  
  if (!product) {
    document.getElementById("product-detail").innerHTML = `
      <div style="text-align:center;padding:80px;color:var(--text-muted);">
        <div style="font-size:64px;margin-bottom:16px;">😕</div>
        <h3>Produit introuvable</h3>
        <a href="shop.html" class="btn btn-primary" style="margin-top:16px;display:inline-flex;">← Retour à la boutique</a>
      </div>
    `;
    return;
  }
  
  selectedOptions.size = product.sizes && product.sizes[0];
  selectedOptions.color = product.colors && product.colors[0];
  
  renderProductDetail(product);
  renderRelatedProducts(product);
  updatePageMeta(product);
  initProductTabs();
}

// ---- Render Product Detail ----
function renderProductDetail(product) {
  const container = document.getElementById("product-detail");
  if (!container) return;
  
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  
  container.innerHTML = `
    <div class="product-detail-grid">
      <!-- Gallery -->
      <div class="product-gallery">
        <div class="gallery-main" id="gallery-main" onclick="openImageModal()">
          <span style="font-size:160px;transition:transform 0.3s ease;">${product.emoji}</span>
          <div class="gallery-zoom" style="opacity:1;">🔍</div>
        </div>
        <div class="gallery-thumbs">
          ${[product.emoji, product.emoji, product.emoji, product.emoji].map((e, i) => `
            <div class="gallery-thumb ${i === 0 ? "active" : ""}" onclick="selectThumb(this)">
              <span style="font-size:36px;">${e}</span>
            </div>
          `).join("")}
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="product-detail-info">
        <div class="breadcrumb" style="margin-bottom:16px;">
          <a href="index.html">Accueil</a>
          <span>›</span>
          <a href="shop.html">Boutique</a>
          <span>›</span>
          <a href="shop.html?cat=${product.category}">${getCategoryName(product.category)}</a>
          <span>›</span>
          <span style="color:var(--text-primary);">${product.name}</span>
        </div>
        
        <div class="product-detail-brand">${product.brand}</div>
        <h1 class="product-detail-title">${product.name}</h1>
        
        <div class="product-detail-rating">
          <div class="stars" style="font-size:18px;color:var(--gold);">${renderStars(product.rating)}</div>
          <span style="font-weight:700;">${product.rating}</span>
          <span class="review-count">${product.reviews.toLocaleString()} avis vérifiés</span>
          <span style="width:1px;height:16px;background:var(--border);"></span>
          <span class="in-stock">✅ En stock (${product.stock} disponibles)</span>
        </div>
        
        <div class="product-detail-price">
          <span class="detail-price-current" id="detail-price">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="detail-price-old">${formatPrice(product.oldPrice)}</span>` : ""}
          ${discount > 0 ? `<span class="detail-price-save">Économisez ${discount}%</span>` : ""}
        </div>
        
        <p style="font-size:15px;color:var(--text-secondary);line-height:1.7;margin-bottom:24px;">${product.description}</p>
        
        <!-- Size Selector -->
        ${product.sizes && product.sizes.length > 1 ? `
          <div class="option-section">
            <div class="option-label">
              <span>Taille: <strong style="color:var(--text-primary);" id="selected-size">${product.sizes[0]}</strong></span>
              <a href="#">Guide des tailles →</a>
            </div>
            <div class="size-options">
              ${product.sizes.map((size, i) => `
                <button class="size-option ${i === 0 ? "active" : ""}" 
                        onclick="selectSize('${size}', this)">
                  ${size}
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}
        
        <!-- Color Selector -->
        ${product.colors && product.colors.length > 1 ? `
          <div class="option-section">
            <div class="option-label">
              Couleur: <strong style="color:var(--text-primary);" id="selected-color-label">Default</strong>
            </div>
            <div class="color-options">
              ${product.colors.map((color, i) => `
                <div class="color-option ${i === 0 ? "active" : ""}" onclick="selectColor('${color}', this)">
                  <div class="swatch" style="background:${color};"></div>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}
        
        <!-- Quantity + Add to Cart -->
        <div class="add-to-cart-section">
          <div class="quantity-input">
            <button class="qty-decrease" onclick="changeQty(-1)">−</button>
            <input type="number" class="qty-value" id="product-qty" value="1" min="1" max="${product.stock}" onchange="selectedOptions.qty = parseInt(this.value)">
            <button class="qty-increase" onclick="changeQty(1)">+</button>
          </div>
          <button class="btn btn-primary btn-lg" style="flex:1;" onclick="addToCartDetail(${product.id})">
            🛒 Ajouter au panier
          </button>
          <button class="btn btn-outline" id="detail-wishlist-btn" onclick="toggleDetailWishlist(${product.id})" style="min-width:56px;padding:0;">
            ${store.isWishlisted(product.id) ? "❤️" : "🤍"}
          </button>
        </div>
        
        <!-- Buy Now -->
        <button class="btn btn-ghost btn-full" onclick="buyNow(${product.id})" style="margin-top:8px;">
          ⚡ Acheter maintenant
        </button>
        
        <!-- Trust badges -->
        <div style="display:flex;gap:16px;margin-top:24px;padding:16px;background:var(--surface-2);border-radius:var(--radius-lg);flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);">🚚 <span>Livraison gratuite dès 50$</span></div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);">↩️ <span>Retour sous 30 jours</span></div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);">🔒 <span>Paiement sécurisé SSL</span></div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);">✅ <span>Garantie 2 ans</span></div>
        </div>
        
        <!-- Share -->
        <div style="display:flex;align-items:center;gap:12px;margin-top:20px;">
          <span style="font-size:13px;color:var(--text-muted);">Partager:</span>
          <button class="btn btn-ghost btn-sm" onclick="shareProduct(${product.id})">🔗 Copier le lien</button>
        </div>
        
        <!-- Product Tabs -->
        <div class="product-tabs" style="margin-top:32px;">
          <div class="tabs-nav">
            <button class="tab-btn active" data-tab="description">Description</button>
            <button class="tab-btn" data-tab="specs">Spécifications</button>
            <button class="tab-btn" data-tab="reviews">Avis (${product.reviews.toLocaleString()})</button>
            <button class="tab-btn" data-tab="shipping">Livraison</button>
          </div>
          
          <div class="tab-content active" id="tab-description">
            <p>${product.description}</p>
            <p style="margin-top:12px;">Notre collection ${getCategoryName(product.category)} est conçue pour les professionnels qui exigent le meilleur en termes de qualité, de performance et de style. Chaque article est soigneusement sélectionné pour vous offrir une expérience exceptionnelle.</p>
            <ul style="margin-top:16px;display:flex;flex-direction:column;gap:8px;">
              <li style="display:flex;gap:8px;color:var(--text-secondary);font-size:14px;"><span style="color:var(--success);">✓</span> Matériaux premium de haute qualité</li>
              <li style="display:flex;gap:8px;color:var(--text-secondary);font-size:14px;"><span style="color:var(--success);">✓</span> Design moderne et fonctionnel</li>
              <li style="display:flex;gap:8px;color:var(--text-secondary);font-size:14px;"><span style="color:var(--success);">✓</span> Confort optimal pour une utilisation quotidienne</li>
              <li style="display:flex;gap:8px;color:var(--text-secondary);font-size:14px;"><span style="color:var(--success);">✓</span> Durabilité testée et prouvée</li>
            </ul>
          </div>
          
          <div class="tab-content" id="tab-specs">
            <table class="specs-table">
              <tr><td>Marque</td><td>${product.brand}</td></tr>
              <tr><td>Catégorie</td><td>${getCategoryName(product.category)}</td></tr>
              <tr><td>Sous-catégorie</td><td>${product.subcategory}</td></tr>
              <tr><td>Tailles disponibles</td><td>${product.sizes?.join(", ") || "Standard"}</td></tr>
              <tr><td>Couleurs</td><td>${product.colors?.length || 1} coloris</td></tr>
              <tr><td>Note moyenne</td><td>${product.rating}/5 ⭐</td></tr>
              <tr><td>Stock</td><td>${product.stock} unités</td></tr>
              <tr><td>SKU</td><td>NVRX-${product.id.toString().padStart(5, "0")}</td></tr>
            </table>
          </div>
          
          <div class="tab-content" id="tab-reviews">
            ${renderReviews(product)}
          </div>
          
          <div class="tab-content" id="tab-shipping">
            <div style="display:flex;flex-direction:column;gap:16px;">
              ${[
                {icon:"🚀",title:"Express 24h",desc:"Livraison express disponible dans les grandes villes. Commandez avant 14h pour une livraison le lendemain.",price:"12.99$"},
                {icon:"🚚",title:"Standard 3-5 jours",desc:"Livraison standard partout dans le monde. Suivi en temps réel disponible.",price:"Gratuite dès 50$"},
                {icon:"📦",title:"Click & Collect",desc:"Récupérez votre commande dans un de nos points de retrait partenaires.",price:"Gratuit"},
                {icon:"🌍",title:"International",desc:"Livraison internationale dans plus de 120 pays. Délai variable selon destination.",price:"Dès 19.99$"},
              ].map(s => `
                <div style="display:flex;gap:14px;padding:16px;background:var(--surface-2);border-radius:var(--radius-lg);">
                  <span style="font-size:28px;">${s.icon}</span>
                  <div>
                    <div style="font-weight:700;margin-bottom:4px;">${s.title} — <span style="color:var(--primary);">${s.price}</span></div>
                    <p style="font-size:13px;color:var(--text-secondary);">${s.desc}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- Reviews ----
function renderReviews(product) {
  const reviews = generateFakeReviews(product);
  const ratingCounts = { 5: 68, 4: 18, 3: 8, 2: 4, 1: 2 };
  
  return `
    <div class="review-summary">
      <div class="review-score">
        <div class="review-score-num">${product.rating}</div>
        <div class="stars" style="justify-content:center;color:var(--gold);margin:4px 0;">${renderStars(product.rating)}</div>
        <div class="review-score-max">${product.reviews.toLocaleString()} avis</div>
      </div>
      <div class="review-bars">
        ${[5,4,3,2,1].map(n => `
          <div class="review-bar-row">
            <span class="review-bar-label">${n}</span>
            <div class="review-bar-track"><div class="review-bar-fill" style="width:${ratingCounts[n]}%;"></div></div>
            <span class="review-bar-count">${ratingCounts[n]}%</span>
          </div>
        `).join("")}
      </div>
    </div>
    <div style="margin-bottom:20px;">
      <button class="btn btn-outline btn-sm" onclick="openReviewModal()">✏️ Laisser un avis</button>
    </div>
    ${reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">${r.avatar}</div>
            <div>
              <div class="reviewer-name">${r.name}</div>
              <div class="reviewer-date">${r.date}</div>
            </div>
          </div>
          <div>
            <div class="stars" style="color:var(--gold);">${renderStars(r.rating)}</div>
            ${r.verified ? '<div class="review-verified" style="margin-top:4px;">✅ Achat vérifié</div>' : ""}
          </div>
        </div>
        <strong style="display:block;margin-bottom:8px;font-size:14px;">${r.title}</strong>
        <p class="review-text">${r.text}</p>
      </div>
    `).join("")}
  `;
}

function generateFakeReviews(product) {
  const names = ["Mohamed A.", "Sarah K.", "Jean-Pierre D.", "Aminata S.", "Carlos M.", "Priya R."];
  const avatars = ["👨", "👩", "👨🏻", "👩🏾", "👨🏽", "👩🏽"];
  const titles = ["Excellent produit!", "Très satisfait de mon achat", "Qualité supérieure", "Livraison rapide, produit conforme", "Je recommande vivement!"];
  const texts = [
    "Je suis vraiment impressionné par la qualité de ce produit. Exactement comme décrit, livraison rapide et emballage soigné.",
    "Deuxième commande chez NOVARYX. Toujours aussi satisfait. La qualité est au rendez-vous et le service client est excellent.",
    "Très bon rapport qualité-prix. Je recommande à tous ceux qui recherchent de la qualité à prix raisonnable.",
    "Produit conforme à la description. Belle finition, matériaux de qualité. Je suis très content de mon achat.",
  ];
  
  return names.map((name, i) => ({
    name,
    avatar: avatars[i],
    rating: [5, 5, 4, 5, 4, 5][i],
    title: titles[i % titles.length],
    text: texts[i % texts.length],
    date: ["Il y a 2 jours", "Il y a 1 semaine", "Il y a 2 semaines", "Il y a 1 mois", "Il y a 2 mois", "Il y a 3 mois"][i],
    verified: i % 3 !== 2,
  }));
}

// ---- Size / Color Selection ----
function selectSize(size, btn) {
  selectedOptions.size = size;
  document.querySelectorAll(".size-option").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("selected-size").textContent = size;
}

function selectColor(color, el) {
  selectedOptions.color = color;
  document.querySelectorAll(".color-option").forEach(e => e.classList.remove("active"));
  el.classList.add("active");
  const label = document.getElementById("selected-color-label");
  if (label) label.textContent = color;
}

function changeQty(delta) {
  const input = document.getElementById("product-qty");
  if (!input) return;
  const newQty = Math.max(1, Math.min(parseInt(input.value) + delta, 99));
  input.value = newQty;
  selectedOptions.qty = newQty;
}

// ---- Add to Cart from Detail ----
function addToCartDetail(productId) {
  const btn = document.querySelector(".add-to-cart-section .btn-primary");
  if (btn) {
    btn.textContent = "✅ Ajouté!";
    btn.style.background = "var(--success)";
    setTimeout(() => {
      btn.innerHTML = "🛒 Ajouter au panier";
      btn.style.background = "";
    }, 1500);
  }
  
  store.addToCart(productId, {
    size: selectedOptions.size,
    color: selectedOptions.color,
    qty: selectedOptions.qty,
  });
}

function buyNow(productId) {
  store.addToCart(productId, {
    size: selectedOptions.size,
    color: selectedOptions.color,
    qty: selectedOptions.qty,
  });
  window.location.href = "checkout.html";
}

function toggleDetailWishlist(productId) {
  store.toggleWishlist(productId);
  const btn = document.getElementById("detail-wishlist-btn");
  if (btn) btn.textContent = store.isWishlisted(productId) ? "❤️" : "🤍";
}

// ---- Related Products ----
function renderRelatedProducts(product) {
  const container = document.getElementById("related-products");
  if (!container) return;
  
  const related = PRODUCTS
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);
  
  container.innerHTML = related.map(p => createProductCard(p)).join("");
}

// ---- Gallery Thumb ----
function selectThumb(thumb) {
  document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
  thumb.classList.add("active");
}

// ---- Product Tabs ----
function initProductTabs() {
  document.addEventListener("click", e => {
    if (e.target.classList.contains("tab-btn")) {
      const tab = e.target.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");
      document.getElementById(`tab-${tab}`)?.classList.add("active");
    }
  });
}

// ---- Meta ----
function updatePageMeta(product) {
  document.title = `${product.name} - NOVARYX Store`;
  const el = document.getElementById("product-name-breadcrumb");
  if (el) el.textContent = product.name;
}

// ---- Review Modal (simple) ----
function openReviewModal() {
  showToast("Fonctionnalité disponible après connexion", "warning");
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  loadProductDetail();
  document.addEventListener("currencyChange", loadProductDetail);
  console.log("📦 Product page initialized");
});