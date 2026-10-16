/* ============================================
   NOVARYX STORE - Main JavaScript
   Data, Cart, Wishlist, Utilities
============================================ */

'use strict';

// ---- Product Data ----
const PRODUCTS = [
  // Sports
  { id: 1, name: "Air Force Pro Running Shoes", category: "sports", subcategory: "footwear", price: 189.99, oldPrice: 249.99, rating: 4.8, reviews: 2341, emoji: "👟", brand: "SportMax", colors: ["#000000","#ffffff","#FF3D00","#0a84ff"], sizes: ["39","40","41","42","43","44","45"], tags: ["new","bestseller"], stock: 15, description: "High-performance running shoes with advanced cushioning technology." },
  { id: 2, name: "Pro Training Jersey Set", category: "sports", subcategory: "clothing", price: 79.99, oldPrice: 99.99, rating: 4.6, reviews: 892, emoji: "👕", brand: "AthleteX", colors: ["#FF3D00","#000000","#0a84ff"], sizes: ["XS","S","M","L","XL","XXL"], tags: ["sale"], stock: 30, description: "Moisture-wicking performance jersey for intense training sessions." },
  { id: 3, name: "Power Dumbbell Set 40kg", category: "sports", subcategory: "equipment", price: 349.99, rating: 4.9, reviews: 456, emoji: "🏋️", brand: "IronCore", colors: ["#333333","#FF3D00"], sizes: ["20kg","40kg","60kg"], tags: ["bestseller"], stock: 8, description: "Professional-grade adjustable dumbbell set for home gym." },
  { id: 4, name: "Elite Football Cleats", category: "sports", subcategory: "footwear", price: 159.99, oldPrice: 199.99, rating: 4.7, reviews: 1234, emoji: "⚽", brand: "StrikePro", colors: ["#FFD700","#000000","#ffffff"], sizes: ["39","40","41","42","43","44"], tags: ["new"], stock: 20, description: "Championship-grade football cleats with enhanced grip technology." },
  { id: 5, name: "Resistance Band Set Pro", category: "sports", subcategory: "equipment", price: 49.99, oldPrice: 69.99, rating: 4.5, reviews: 3210, emoji: "🎽", brand: "FlexFit", colors: ["#FF3D00","#FFD700","#00D4FF"], sizes: ["Light","Medium","Heavy","X-Heavy"], tags: ["sale","bestseller"], stock: 50, description: "Complete resistance training set with 5 bands of varying resistance." },
  { id: 6, name: "Basketball Pro High-Tops", category: "sports", subcategory: "footwear", price: 219.99, oldPrice: 279.99, rating: 4.9, reviews: 678, emoji: "🏀", brand: "CourtKing", colors: ["#000000","#FF3D00","#ffffff"], sizes: ["40","41","42","43","44","45","46"], tags: ["new","limited"], stock: 12, description: "Elite basketball shoes with superior ankle support and traction." },

  // Electronics
  { id: 7, name: "Pro Wireless Earbuds ANC", category: "electronics", subcategory: "audio", price: 299.99, oldPrice: 399.99, rating: 4.8, reviews: 5621, emoji: "🎧", brand: "SoundX", colors: ["#000000","#ffffff","#FF3D00"], sizes: ["Standard"], tags: ["bestseller","new"], stock: 40, description: "Active noise cancellation with 30-hour battery life and premium sound." },
  { id: 8, name: "SmartWatch Ultra Sport", category: "electronics", subcategory: "wearables", price: 449.99, oldPrice: 549.99, rating: 4.7, reviews: 2105, emoji: "⌚", brand: "TechWrist", colors: ["#1a1a1a","#C0C0C0","#FF3D00"], sizes: ["40mm","44mm"], tags: ["new","hot"], stock: 25, description: "Advanced fitness tracking with GPS, heart rate monitor, and 7-day battery." },
  { id: 9, name: "4K Action Camera Pro", category: "electronics", subcategory: "cameras", price: 399.99, rating: 4.6, reviews: 987, emoji: "📷", brand: "CamPro", colors: ["#000000","#FF3D00"], sizes: ["Standard"], tags: ["bestseller"], stock: 18, description: "Waterproof 4K action camera with image stabilization and live streaming." },
  { id: 10, name: "Gaming Controller Pro", category: "electronics", subcategory: "gaming", price: 89.99, oldPrice: 119.99, rating: 4.8, reviews: 4320, emoji: "🎮", brand: "GameFace", colors: ["#000000","#ffffff","#FF3D00","#0a84ff"], sizes: ["Standard"], tags: ["sale"], stock: 60, description: "Professional wireless gaming controller with haptic feedback and 20h battery." },
  { id: 11, name: "Bluetooth Speaker 360°", category: "electronics", subcategory: "audio", price: 149.99, oldPrice: 199.99, rating: 4.7, reviews: 1890, emoji: "🔊", brand: "SoundX", colors: ["#000000","#00D4FF","#FF3D00"], sizes: ["Compact","Standard"], tags: ["sale","bestseller"], stock: 35, description: "360° omnidirectional sound with 24-hour battery and IPX7 waterproofing." },
  { id: 12, name: "Drone FPV Racing Pro", category: "electronics", subcategory: "drones", price: 699.99, oldPrice: 899.99, rating: 4.5, reviews: 342, emoji: "🚁", brand: "SkyFlyer", colors: ["#FF3D00","#000000"], sizes: ["Standard"], tags: ["new","limited"], stock: 6, description: "Professional FPV racing drone with 4K camera and 25-minute flight time." },

  // Shoes / Professional Footwear
  { id: 13, name: "Luxury Oxford Derby Shoes", category: "footwear", subcategory: "formal", price: 289.99, oldPrice: 369.99, rating: 4.9, reviews: 445, emoji: "👞", brand: "EliteStep", colors: ["#5C4033","#1a1a1a","#8B7355"], sizes: ["39","40","41","42","43","44","45"], tags: ["premium","new"], stock: 22, description: "Full-grain leather Oxford shoes crafted for ultimate comfort and style." },
  { id: 14, name: "Chef Pro Safety Boots", category: "footwear", subcategory: "professional", price: 179.99, oldPrice: 229.99, rating: 4.8, reviews: 1123, emoji: "🥾", brand: "SafeStep", colors: ["#000000","#5C4033"], sizes: ["38","39","40","41","42","43","44","45","46"], tags: ["bestseller"], stock: 28, description: "Anti-slip, waterproof professional boots with steel-toe protection." },
  { id: 15, name: "Business Comfort Loafers", category: "footwear", subcategory: "formal", price: 199.99, oldPrice: 249.99, rating: 4.7, reviews: 789, emoji: "🥿", brand: "EliteStep", colors: ["#1a1a1a","#5C4033","#8B7355","#C0C0C0"], sizes: ["36","37","38","39","40","41","42","43"], tags: ["sale","popular"], stock: 32, description: "Premium leather loafers with memory foam insole for all-day comfort." },
  { id: 16, name: "Medical Pro Standing Shoes", category: "footwear", subcategory: "professional", price: 159.99, oldPrice: 199.99, rating: 4.9, reviews: 2341, emoji: "👠", brand: "MedStep", colors: ["#ffffff","#000000","#87CEEB"], sizes: ["35","36","37","38","39","40","41","42"], tags: ["bestseller","medical"], stock: 45, description: "Orthopedic professional shoes designed for 12-hour standing comfort." },

  // Clothing / Quality Apparel
  { id: 17, name: "Premium Merino Wool Suit", category: "clothing", subcategory: "formal", price: 499.99, oldPrice: 699.99, rating: 4.8, reviews: 234, emoji: "🤵", brand: "EliteWear", colors: ["#1a1a2e","#2F4F2F","#5C4033","#1a1a1a"], sizes: ["S","M","L","XL","XXL","XXXL"], tags: ["premium","new"], stock: 15, description: "Hand-finished Italian merino wool two-piece suit for the modern professional." },
  { id: 18, name: "Tech Fleece Track Jacket", category: "clothing", subcategory: "casual", price: 129.99, oldPrice: 169.99, rating: 4.7, reviews: 1567, emoji: "🧥", brand: "AthleteX", colors: ["#000000","#1a1a2e","#FF3D00","#2F4F2F"], sizes: ["XS","S","M","L","XL","XXL"], tags: ["bestseller","sale"], stock: 40, description: "Lightweight tech fleece jacket with minimalist design and deep pockets." },
  { id: 19, name: "Tactical Cargo Pants Pro", category: "clothing", subcategory: "tactical", price: 99.99, oldPrice: 139.99, rating: 4.6, reviews: 2890, emoji: "👖", brand: "FieldGear", colors: ["#556B2F","#1a1a1a","#8B7355","#000080"], sizes: ["28","30","32","34","36","38"], tags: ["sale","bestseller"], stock: 55, description: "Durable tactical pants with 14 pockets and ripstop fabric technology." },
  { id: 20, name: "Cashmere Premium Hoodie", category: "clothing", subcategory: "casual", price: 249.99, oldPrice: 329.99, rating: 4.9, reviews: 891, emoji: "👕", brand: "LuxWear", colors: ["#F5F5DC","#1a1a1a","#708090","#FF3D00"], sizes: ["XS","S","M","L","XL","XXL"], tags: ["premium","limited"], stock: 20, description: "Ultra-soft cashmere blend hoodie with brushed interior and oversized fit." },
];

const CATEGORIES = [
  { id: "all", name: "All Products", icon: "🛍️", count: PRODUCTS.length },
  { id: "sports", name: "Sports", icon: "⚽", count: PRODUCTS.filter(p => p.category === "sports").length },
  { id: "electronics", name: "Electronics", icon: "📱", count: PRODUCTS.filter(p => p.category === "electronics").length },
  { id: "footwear", name: "Footwear", icon: "👟", count: PRODUCTS.filter(p => p.category === "footwear").length },
  { id: "clothing", name: "Clothing", icon: "👕", count: PRODUCTS.filter(p => p.category === "clothing").length },
];

const BRANDS = ["SportMax","AthleteX","IronCore","SoundX","TechWrist","CamPro","EliteStep","SafeStep","EliteWear","FieldGear","LuxWear","FlexFit","StrikePro","GameFace","CourtKing","SkyFlyer","MedStep"];

const CURRENCIES = {
  USD: { symbol: "$", rate: 1, name: "US Dollar" },
  EUR: { symbol: "€", rate: 0.92, name: "Euro" },
  GBP: { symbol: "£", rate: 0.79, name: "British Pound" },
  XOF: { symbol: "CFA", rate: 605, name: "CFA Franc" },
  NGN: { symbol: "₦", rate: 1580, name: "Nigerian Naira" },
  CAD: { symbol: "CA$", rate: 1.36, name: "Canadian Dollar" },
  AUD: { symbol: "A$", rate: 1.54, name: "Australian Dollar" },
  JPY: { symbol: "¥", rate: 149, name: "Japanese Yen" },
};

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

// ---- State Management ----
const store = {
  cart: JSON.parse(localStorage.getItem("nvrx_cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("nvrx_wishlist") || "[]"),
  currency: localStorage.getItem("nvrx_currency") || "USD",
  language: localStorage.getItem("nvrx_lang") || "en",
  user: JSON.parse(localStorage.getItem("nvrx_user") || "null"),
  
  save() {
    localStorage.setItem("nvrx_cart", JSON.stringify(this.cart));
    localStorage.setItem("nvrx_wishlist", JSON.stringify(this.wishlist));
    localStorage.setItem("nvrx_currency", this.currency);
    localStorage.setItem("nvrx_lang", this.language);
    if (this.user) localStorage.setItem("nvrx_user", JSON.stringify(this.user));
  },

  // Cart
  addToCart(productId, options = {}) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const key = `${productId}-${options.size || "default"}-${options.color || "default"}`;
    const existing = this.cart.find(i => i.key === key);
    if (existing) {
      existing.qty = Math.min(existing.qty + (options.qty || 1), product.stock);
    } else {
      this.cart.push({
        key,
        productId,
        qty: options.qty || 1,
        size: options.size || (product.sizes && product.sizes[0]) || "Standard",
        color: options.color || (product.colors && product.colors[0]) || "#000000",
      });
    }
    this.save();
    this.onCartChange();
    showToast(`${product.name} ajouté au panier!`, "success");
  },

  removeFromCart(key) {
    this.cart = this.cart.filter(i => i.key !== key);
    this.save();
    this.onCartChange();
  },

  updateQty(key, qty) {
    const item = this.cart.find(i => i.key === key);
    if (item) {
      if (qty <= 0) this.removeFromCart(key);
      else item.qty = qty;
      this.save();
      this.onCartChange();
    }
  },

  getCartCount() { return this.cart.reduce((s, i) => s + i.qty, 0); },

  getCartTotal() {
    return this.cart.reduce((s, i) => {
      const p = PRODUCTS.find(p => p.id === i.productId);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },

  // Wishlist
  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx >= 0) {
      this.wishlist.splice(idx, 1);
      showToast("Retiré des favoris", "");
    } else {
      this.wishlist.push(productId);
      showToast("Ajouté aux favoris ❤️", "success");
    }
    this.save();
    this.onWishlistChange();
  },

  isWishlisted(productId) { return this.wishlist.includes(productId); },

  // Events
  onCartChange() {
    updateCartUI();
    document.dispatchEvent(new CustomEvent("cartChange"));
  },

  onWishlistChange() {
    updateWishlistUI();
    document.dispatchEvent(new CustomEvent("wishlistChange"));
  },
};

// ---- Currency ----
function formatPrice(price, currency = store.currency) {
  const cur = CURRENCIES[currency];
  const converted = price * cur.rate;
  if (currency === "XOF" || currency === "NGN" || currency === "JPY") {
    return `${cur.symbol} ${Math.round(converted).toLocaleString()}`;
  }
  return `${cur.symbol}${converted.toFixed(2)}`;
}

// ---- Product Card Generator ----
function createProductCard(product, variant = "default") {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const isWish = store.isWishlisted(product.id);
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <div class="product-badges">
          ${product.tags.includes("new") ? '<span class="badge badge-accent">NEW</span>' : ""}
          ${product.tags.includes("sale") || discount > 0 ? `<span class="badge badge-primary">-${discount}%</span>` : ""}
          ${product.tags.includes("bestseller") ? '<span class="badge badge-gold">⭐ BEST</span>' : ""}
          ${product.tags.includes("limited") ? '<span class="badge" style="background:var(--surface-3);color:var(--text-secondary);">LIMITED</span>' : ""}
          ${product.tags.includes("premium") ? '<span class="badge" style="background:rgba(255,215,0,0.15);color:var(--gold);border:1px solid rgba(255,215,0,0.3);">PREMIUM</span>' : ""}
        </div>
        <span class="product-emoji" style="font-size:80px;">${product.emoji}</span>
        <div class="product-actions-float">
          <button class="product-action-btn wishlist-toggle ${isWish ? "active" : ""}" 
            onclick="store.toggleWishlist(${product.id}); this.classList.toggle('active'); this.textContent = store.isWishlisted(${product.id}) ? '❤️' : '🤍';"
            title="Wishlist">${isWish ? "❤️" : "🤍"}</button>
          <button class="product-action-btn" onclick="openQuickView(${product.id})" title="Quick view">👁️</button>
          <button class="product-action-btn" onclick="shareProduct(${product.id})" title="Share">🔗</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${getCategoryName(product.category)} • ${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <div class="stars">${renderStars(product.rating)}</div>
          <span style="font-size:13px;font-weight:700;color:var(--text-secondary);">${product.rating}</span>
          <span class="product-rating-count">(${product.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price-row">
          <div class="product-prices">
            <span class="price-current">${formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ""}
          </div>
          <button class="product-add-btn" onclick="quickAddToCart(${product.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `;
}

function getCategoryName(cat) {
  const map = { sports: "Sports", electronics: "Électronique", footwear: "Chaussures", clothing: "Vêtements" };
  return map[cat] || cat;
}

function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars += "★";
    else if (i - 0.5 <= rating) stars += "★";
    else stars += "☆";
  }
  return stars;
}

// ---- Cart UI ----
function updateCartUI() {
  const count = store.getCartCount();
  const total = store.getCartTotal();
  
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
    if (count > 0) el.classList.add("animate__bounceIn");
  });

  document.querySelectorAll(".cart-total-display").forEach(el => {
    el.textContent = formatPrice(total);
  });

  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cart-items-container");
  if (!container) return;

  if (store.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:48px 24px;color:var(--text-muted);">
        <div style="font-size:64px;margin-bottom:16px;">🛒</div>
        <p style="font-size:16px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">Votre panier est vide</p>
        <p style="font-size:14px;">Explorez notre boutique et ajoutez des articles!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = store.cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) return "";
    return `
      <div class="cart-item" data-key="${item.key}">
        <div class="cart-item-image">${product.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-variant">Taille: ${item.size}</div>
          <div class="cart-item-controls">
            <div class="qty-control">
              <button class="qty-btn" onclick="store.updateQty('${item.key}', ${item.qty - 1})">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="store.updateQty('${item.key}', ${item.qty + 1})">+</button>
            </div>
            <span class="price-current">${formatPrice(product.price * item.qty)}</span>
          </div>
        </div>
        <span class="cart-item-remove" onclick="store.removeFromCart('${item.key}')" title="Supprimer">✕</span>
      </div>
    `;
  }).join("");
}

function updateWishlistUI() {
  const count = store.wishlist.length;
  document.querySelectorAll(".wishlist-count").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

// ---- Cart Sidebar ----
function openCart() {
  const sidebar = document.getElementById("cart-sidebar");
  const overlay = document.getElementById("cart-overlay");
  if (sidebar) sidebar.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const sidebar = document.getElementById("cart-sidebar");
  const overlay = document.getElementById("cart-overlay");
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ---- Search ----
function openSearch() {
  const overlay = document.getElementById("search-overlay");
  if (overlay) {
    overlay.classList.add("active");
    setTimeout(() => overlay.querySelector("input")?.focus(), 100);
  }
}

function closeSearch() {
  const overlay = document.getElementById("search-overlay");
  if (overlay) overlay.classList.remove("active");
}

function searchProducts(query) {
  query = query.toLowerCase().trim();
  if (!query) return PRODUCTS;
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.brand.toLowerCase().includes(query) ||
    p.subcategory.toLowerCase().includes(query) ||
    p.tags.some(t => t.toLowerCase().includes(query))
  );
}

// ---- Quick Add ----
function quickAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  store.addToCart(productId, {
    size: product.sizes && product.sizes[0],
    qty: 1
  });
}

// ---- Quick View Modal ----
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  
  const modal = document.getElementById("quickview-modal");
  const overlay = document.getElementById("quickview-overlay");
  
  if (!modal || !overlay) return;
  
  modal.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start;">
      <div style="background:var(--surface-2);border-radius:var(--radius-xl);aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:120px;">
        ${product.emoji}
      </div>
      <div>
        <button onclick="closeQuickView()" style="position:absolute;top:20px;right:20px;width:36px;height:36px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">✕</button>
        <div style="font-size:12px;font-family:var(--font-condensed);font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--primary);margin-bottom:8px;">${product.brand}</div>
        <h2 style="font-size:22px;margin-bottom:12px;">${product.name}</h2>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <div class="stars" style="color:var(--gold);">${renderStars(product.rating)}</div>
          <span style="font-size:13px;color:var(--text-muted);">(${product.reviews.toLocaleString()} avis)</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:20px;">
          <span style="font-family:var(--font-display);font-size:36px;">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span style="font-size:16px;color:var(--text-muted);text-decoration:line-through;">${formatPrice(product.oldPrice)}</span>` : ""}
          ${discount > 0 ? `<span style="background:rgba(0,230,118,0.1);color:var(--success);padding:2px 10px;border-radius:100px;font-size:13px;font-weight:700;">-${discount}%</span>` : ""}
        </div>
        <p style="font-size:14px;color:var(--text-secondary);line-height:1.7;margin-bottom:20px;">${product.description}</p>
        
        ${product.sizes && product.sizes.length > 1 ? `
          <div style="margin-bottom:16px;">
            <div style="font-size:12px;font-family:var(--font-condensed);font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">Taille</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${product.sizes.slice(0, 6).map((s, i) => `
                <button class="size-btn ${i === 0 ? "active" : ""}" onclick="document.querySelectorAll('#quickview-modal .size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');document.getElementById('selected-size-qv').value='${s}'">${s}</button>
              `).join("")}
            </div>
          </div>
          <input type="hidden" id="selected-size-qv" value="${product.sizes[0]}">
        ` : ""}
        
        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary btn-full" style="flex:2;" onclick="
            const size = document.getElementById('selected-size-qv')?.value;
            store.addToCart(${product.id}, {size});
            closeQuickView();
          ">
            🛒 Ajouter au panier
          </button>
          <button class="btn btn-outline" onclick="store.toggleWishlist(${product.id}); this.textContent = store.isWishlisted(${product.id}) ? '❤️' : '🤍';" style="min-width:48px;">${store.isWishlisted(product.id) ? "❤️" : "🤍"}</button>
        </div>
        
        <div style="display:flex;gap:16px;margin-top:16px;font-size:12px;color:var(--text-muted);">
          <span>✅ En stock (${product.stock} restants)</span>
          <span>🚚 Livraison gratuite</span>
          <span>↩️ Retour 30j</span>
        </div>
      </div>
    </div>
  `;
  
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  const overlay = document.getElementById("quickview-overlay");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ---- Share ----
function shareProduct(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  if (navigator.share) {
    navigator.share({ title: product.name, text: `Découvrez ${product.name} sur NOVARYX Store!`, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => showToast("Lien copié!", "success"));
  }
}

// ---- Toast Notifications ----
function showToast(message, type = "") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icons = { success: "✅", error: "❌", warning: "⚠️", "": "ℹ️" };
  toast.innerHTML = `
    <span style="font-size:18px;">${icons[type] || icons[""]}</span>
    <span style="font-size:14px;">${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "toastOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---- Header Scroll ----
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

// ---- Mobile Menu ----
function initMobileMenu() {
  const toggle = document.getElementById("mobile-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    menu.classList.toggle("active");
  });

  document.querySelectorAll(".mobile-nav-expand").forEach(btn => {
    btn.addEventListener("click", () => {
      const sub = btn.nextElementSibling;
      if (sub) sub.classList.toggle("open");
      const arrow = btn.querySelector(".arrow");
      if (arrow) arrow.style.transform = sub.classList.contains("open") ? "rotate(180deg)" : "";
    });
  });
}

// ---- Search Functionality ----
function initSearch() {
  const input = document.getElementById("main-search-input");
  const results = document.getElementById("search-results");
  
  if (!input) return;
  
  input.addEventListener("input", debounce(() => {
    const q = input.value.trim();
    if (!q || !results) return;
    
    const found = searchProducts(q).slice(0, 6);
    if (found.length === 0) {
      results.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);">Aucun résultat pour "${q}"</div>`;
    } else {
      results.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding-top:12px;">
          ${found.map(p => `
            <a href="product.html?id=${p.id}" style="display:flex;gap:10px;align-items:center;padding:10px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-md);text-decoration:none;" onclick="closeSearch()">
              <span style="font-size:28px;">${p.emoji}</span>
              <div>
                <div style="font-size:13px;font-weight:600;">${p.name}</div>
                <div style="font-size:12px;color:var(--primary);">${formatPrice(p.price)}</div>
              </div>
            </a>
          `).join("")}
        </div>
      `;
    }
    results.style.display = "block";
  }, 300));
  
  document.getElementById("close-search-btn")?.addEventListener("click", closeSearch);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSearch(); });
}

// ---- Countdown Timer ----
function initCountdown() {
  const targets = document.querySelectorAll("[data-countdown]");
  targets.forEach(el => {
    const endTime = new Date().getTime() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 33 * 60 * 1000;
    
    function update() {
      const now = new Date().getTime();
      const diff = endTime - now;
      if (diff <= 0) return;
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      const dEl = el.querySelector(".countdown-days");
      const hEl = el.querySelector(".countdown-hours");
      const mEl = el.querySelector(".countdown-mins");
      const sEl = el.querySelector(".countdown-secs");
      
      if (dEl) dEl.textContent = String(d).padStart(2, "0");
      if (hEl) hEl.textContent = String(h).padStart(2, "0");
      if (mEl) mEl.textContent = String(m).padStart(2, "0");
      if (sEl) sEl.textContent = String(s).padStart(2, "0");
    }
    
    update();
    setInterval(update, 1000);
  });
}

// ---- Intersection Observer for Animations ----
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll(".animate-on-scroll").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
  
  document.addEventListener("click", e => {
    const el = e.target.closest(".animate-on-scroll");
    if (el) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
}

function animateVisible(el) {
  if (!el) return;
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
}

// ---- Currency Selector ----
function setCurrency(code) {
  store.currency = code;
  store.save();
  document.querySelectorAll(".currency-display").forEach(el => el.textContent = code);
  document.dispatchEvent(new CustomEvent("currencyChange", { detail: code }));
  showToast(`Devise changée en ${CURRENCIES[code].name}`, "success");
}

// ---- Utility ----
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  updateWishlistUI();
  initHeaderScroll();
  initMobileMenu();
  initSearch();
  initCountdown();
  initAnimations();
  
  // Cart sidebar events
  document.getElementById("open-cart-btn")?.addEventListener("click", openCart);
  document.getElementById("close-cart-btn")?.addEventListener("click", closeCart);
  document.getElementById("cart-overlay")?.addEventListener("click", closeCart);
  
  // Search events
  document.getElementById("open-search-btn")?.addEventListener("click", openSearch);
  
  // Quick view overlay
  document.getElementById("quickview-overlay")?.addEventListener("click", e => {
    if (e.target === e.currentTarget) closeQuickView();
  });
  
  // Close overlays on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeCart();
      closeQuickView();
    }
  });
  
  console.log("🚀 NOVARYX Store initialized");
});