/* ============================================
   NOVARYX STORE - Checkout & Account JavaScript
============================================ */

// ============ CHECKOUT ============

function initCheckout() {
  renderOrderSummary();
  initPaymentTabs();
  initFormValidation();
  initPromoCode();
  updateCheckoutTotals();
}

function renderOrderSummary() {
  const container = document.getElementById("checkout-items");
  if (!container) return;
  
  if (store.cart.length === 0) {
    window.location.href = "index.html";
    return;
  }
  
  container.innerHTML = store.cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) return "";
    return `
      <div class="order-item">
        <div class="order-item-img">
          ${product.emoji}
          <span class="order-item-qty-badge">${item.qty}</span>
        </div>
        <div style="flex:1;">
          <div class="order-item-name">${product.name}</div>
          <div class="order-item-variant">Taille: ${item.size}</div>
        </div>
        <div class="order-item-price">${formatPrice(product.price * item.qty)}</div>
      </div>
    `;
  }).join("");
}

function updateCheckoutTotals(discount = 0) {
  const subtotal = store.getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;
  
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  
  set("checkout-subtotal", formatPrice(subtotal));
  set("checkout-shipping", shipping === 0 ? "GRATUIT" : formatPrice(shipping));
  set("checkout-tax", formatPrice(tax));
  set("checkout-total", formatPrice(total));
  
  const shippingEl = document.getElementById("checkout-shipping");
  if (shippingEl && shipping === 0) shippingEl.style.color = "var(--success)";
}

function initPaymentTabs() {
  document.querySelectorAll(".payment-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      
      const method = opt.dataset.method;
      document.querySelectorAll(".payment-fields").forEach(f => f.style.display = "none");
      const fields = document.getElementById(`payment-${method}`);
      if (fields) fields.style.display = "block";
    });
  });
}

function initFormValidation() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (validateCheckout()) processOrder();
  });
  
  form.querySelectorAll(".form-input[required]").forEach(input => {
    input.addEventListener("blur", () => validateField(input));
  });
}

function validateField(input) {
  const value = input.value.trim();
  const isValid = value.length > 0;
  input.style.borderColor = isValid ? "" : "var(--error)";
  return isValid;
}

function validateCheckout() {
  let valid = true;
  document.querySelectorAll(".form-input[required]").forEach(input => {
    if (!validateField(input)) valid = false;
  });
  if (!valid) showToast("Veuillez remplir tous les champs obligatoires", "error");
  return valid;
}

function processOrder() {
  const btn = document.getElementById("place-order-btn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="loader" style="width:20px;height:20px;border-width:2px;"></span> Traitement...';
  }
  
  setTimeout(() => {
    store.cart = [];
    store.save();
    
    const orderId = "NVRX-" + Date.now().toString(36).toUpperCase();
    const successSection = document.getElementById("order-success");
    const formSection = document.getElementById("checkout-form-section");
    
    if (successSection && formSection) {
      formSection.style.display = "none";
      successSection.style.display = "block";
      document.getElementById("order-id-display").textContent = orderId;
    } else {
      window.location.href = `index.html?order=${orderId}`;
    }
    
    updateCartUI();
  }, 2000);
}

function initPromoCode() {
  const btn = document.getElementById("apply-promo");
  const input = document.getElementById("promo-input");
  
  if (!btn || !input) return;
  
  const PROMO_CODES = {
    "NOVARYX101": 0.10,
    "WELCOME20": 0.20,
    "SPORT15": 0.15,
    "FLASH30": 0.30,
  };
  
  btn.addEventListener("click", () => {
    const code = input.value.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      const discount = store.getCartTotal() * PROMO_CODES[code];
      updateCheckoutTotals(discount);
      showToast(`Code "${code}" appliqué! -${Math.round(PROMO_CODES[code] * 100)}% 🎉`, "success");
      const el = document.getElementById("promo-discount-row");
      if (el) {
        el.style.display = "flex";
        document.getElementById("checkout-discount").textContent = `-${formatPrice(discount)}`;
        document.getElementById("checkout-discount").style.color = "var(--success)";
      }
      btn.textContent = "✓ Appliqué";
      btn.disabled = true;
    } else {
      showToast("Code promo invalide", "error");
      input.style.borderColor = "var(--error)";
    }
  });
}

// ============ ACCOUNT ============

function initAccount() {
  if (!store.user) {
    showLoginPanel();
    return;
  }
  showAccountPanel();
  loadAccountData();
}

function showLoginPanel() {
  const login = document.getElementById("account-login");
  const panel = document.getElementById("account-panel");
  if (login) login.style.display = "block";
  if (panel) panel.style.display = "none";
}

function showAccountPanel() {
  const login = document.getElementById("account-login");
  const panel = document.getElementById("account-panel");
  if (login) login.style.display = "none";
  if (panel) panel.style.display = "block";
  
  const name = document.getElementById("account-name");
  const email = document.getElementById("account-email");
  const avatar = document.getElementById("account-avatar-letter");
  
  if (name) name.textContent = store.user.name;
  if (email) email.textContent = store.user.email;
  if (avatar) avatar.textContent = store.user.name[0].toUpperCase();
}

function loadAccountData() {
  renderOrders();
  renderWishlistPanel();
  renderAddresses();
}

function login(e) {
  e?.preventDefault();
  const email = document.getElementById("login-email")?.value;
  const pass = document.getElementById("login-password")?.value;
  
  if (!email || !pass) { showToast("Veuillez remplir tous les champs", "error"); return; }
  
  // Simulate login
  setTimeout(() => {
    store.user = { name: email.split("@")[0], email, id: Date.now() };
    store.save();
    showToast("Connexion réussie! Bienvenue 👋", "success");
    showAccountPanel();
    loadAccountData();
  }, 800);
}

function register(e) {
  e?.preventDefault();
  const name = document.getElementById("reg-name")?.value;
  const email = document.getElementById("reg-email")?.value;
  const pass = document.getElementById("reg-password")?.value;
  
  if (!name || !email || !pass) { showToast("Veuillez remplir tous les champs", "error"); return; }
  
  setTimeout(() => {
    store.user = { name, email, id: Date.now() };
    store.save();
    showToast(`Bienvenue ${name}! Compte créé avec succès 🎉`, "success");
    showAccountPanel();
    loadAccountData();
  }, 800);
}

function logout() {
  store.user = null;
  localStorage.removeItem("nvrx_user");
  showToast("Vous avez été déconnecté", "");
  showLoginPanel();
}

function switchAccountTab(tab) {
  document.querySelectorAll(".account-nav-item").forEach(i => i.classList.remove("active"));
  document.querySelectorAll(".account-panel").forEach(p => p.classList.remove("active"));
  
  document.querySelector(`[data-tab="${tab}"]`)?.classList.add("active");
  document.getElementById(`panel-${tab}`)?.classList.add("active");
}

function renderOrders() {
  const container = document.getElementById("orders-list");
  if (!container) return;
  
  const orders = generateFakeOrders();
  
  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <div class="order-id">${order.id}</div>
          <div class="order-date" style="margin-top:4px;">${order.date}</div>
        </div>
        <span class="order-status ${order.status}">${order.statusLabel}</span>
      </div>
      <div class="order-card-items">
        ${order.items.map(item => `
          <div class="order-product-mini">${item.emoji}</div>
        `).join("")}
        ${order.items.length > 4 ? `<div class="order-product-mini" style="color:var(--text-muted);font-size:14px;">+${order.items.length - 4}</div>` : ""}
      </div>
      <div class="order-card-footer">
        <div>
          <div style="font-size:12px;color:var(--text-muted);">${order.items.length} article(s)</div>
          <div class="order-total">${formatPrice(order.total)}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="trackOrder('${order.id}')">📦 Suivre</button>
          ${order.status === "delivered" ? `<button class="btn btn-ghost btn-sm" onclick="reorder(${JSON.stringify(order.items.map(i => i.id)).replace(/"/g, "'")})">🔄 Commander à nouveau</button>` : ""}
        </div>
      </div>
    </div>
  `).join("");
}

function generateFakeOrders() {
  return [
    {
      id: "NVRX-K7X2P",
      date: "12 Janvier 2025",
      status: "delivered",
      statusLabel: "✅ Livré",
      total: 289.98,
      items: [
        { id: 1, emoji: "👟" },
        { id: 7, emoji: "🎧" },
      ]
    },
    {
      id: "NVRX-M4R8Q",
      date: "8 Février 2025",
      status: "shipped",
      statusLabel: "🚚 Expédié",
      total: 449.99,
      items: [{ id: 8, emoji: "⌚" }]
    },
    {
      id: "NVRX-B2S6N",
      date: "15 Février 2025",
      status: "processing",
      statusLabel: "⏳ En traitement",
      total: 179.99,
      items: [{ id: 17, emoji: "🤵" }, { id: 15, emoji: "🥿" }]
    },
  ];
}

function trackOrder(orderId) {
  showToast(`Suivi de la commande ${orderId} - Expédié via DHL`, "success");
}

function reorder(itemIds) {
  itemIds.forEach(id => store.addToCart(id));
  openCart();
}

function renderWishlistPanel() {
  const container = document.getElementById("wishlist-grid");
  if (!container) return;
  
  if (store.wishlist.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted);">
        <div style="font-size:64px;margin-bottom:16px;">🤍</div>
        <h3 style="color:var(--text-secondary);margin-bottom:8px;">Votre liste est vide</h3>
        <a href="shop.html" class="btn btn-primary" style="display:inline-flex;margin-top:12px;">Explorer la boutique</a>
      </div>
    `;
    return;
  }
  
  const wishProducts = PRODUCTS.filter(p => store.wishlist.includes(p.id));
  container.innerHTML = wishProducts.map(p => createProductCard(p)).join("");
}

function renderAddresses() {
  const container = document.getElementById("addresses-grid");
  if (!container) return;
  
  const addresses = JSON.parse(localStorage.getItem("nvrx_addresses") || "[]");
  
  let html = addresses.map((addr, i) => `
    <div class="address-card ${i === 0 ? "default" : ""}">
      ${i === 0 ? '<span class="address-default-badge">Par défaut</span>' : ""}
      <div class="address-name">${addr.name}</div>
      <div class="address-text">${addr.street}<br>${addr.city}, ${addr.zip}<br>${addr.country}</div>
      <div class="address-actions">
        <button class="btn btn-ghost btn-sm" onclick="editAddress(${i})">✏️ Modifier</button>
        <button class="btn btn-outline btn-sm" onclick="deleteAddress(${i})">🗑️ Supprimer</button>
      </div>
    </div>
  `).join("");
  
  html += `
    <div class="add-address-card" onclick="openAddAddressModal()">
      <span class="icon">+</span>
      <span style="font-family:var(--font-condensed);font-weight:700;letter-spacing:0.05em;">Ajouter une adresse</span>
    </div>
  `;
  
  container.innerHTML = html;
}

function openAddAddressModal() {
  const overlay = document.getElementById("address-modal-overlay");
  if (overlay) overlay.classList.add("active");
}

function closeAddressModal() {
  const overlay = document.getElementById("address-modal-overlay");
  if (overlay) overlay.classList.remove("active");
}

function saveAddress() {
  const form = document.getElementById("address-form");
  const data = {
    name: document.getElementById("addr-name")?.value,
    street: document.getElementById("addr-street")?.value,
    city: document.getElementById("addr-city")?.value,
    zip: document.getElementById("addr-zip")?.value,
    country: document.getElementById("addr-country")?.value,
  };
  
  const addresses = JSON.parse(localStorage.getItem("nvrx_addresses") || "[]");
  addresses.push(data);
  localStorage.setItem("nvrx_addresses", JSON.stringify(addresses));
  
  closeAddressModal();
  renderAddresses();
  showToast("Adresse ajoutée avec succès!", "success");
}

function deleteAddress(index) {
  const addresses = JSON.parse(localStorage.getItem("nvrx_addresses") || "[]");
  addresses.splice(index, 1);
  localStorage.setItem("nvrx_addresses", JSON.stringify(addresses));
  renderAddresses();
  showToast("Adresse supprimée", "");
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  
  if (page === "checkout") {
    initCheckout();
    document.getElementById("checkout-form")?.addEventListener("submit", e => { e.preventDefault(); processOrder(); });
    document.getElementById("place-order-btn")?.addEventListener("click", processOrder);
  }
  
  if (page === "account") {
    initAccount();
    document.querySelectorAll(".account-nav-item").forEach(item => {
      item.addEventListener("click", () => switchAccountTab(item.dataset.tab));
    });
  }
  
  console.log("💳 Checkout/Account initialized");
});