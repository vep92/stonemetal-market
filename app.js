const STORE_KEY = "stonemetal.store.v1";
const SESSION_KEY = "stonemetal.session.v1";
const CART_KEY = "stonemetal.cart.v1";
const THEME_KEY = "stonemetal.theme.v1";

const icons = {
  moon: "moon",
  sun: "sun",
};

const demoGroups = [
  {
    id: "granite",
    name: "Гранит",
    description: "Плиты, бордюр, ступени и облицовка из натурального камня.",
    image: "assets/granite-slabs.png",
  },
  {
    id: "tiles",
    name: "Плитка",
    description: "Керамогранит и техническая плитка для пола, фасада и входных групп.",
    image: "assets/stone-tiles.png",
  },
  {
    id: "slabs",
    name: "Слэбы",
    description: "Крупноформатные каменные заготовки для столешниц и интерьеров.",
    image: "assets/dark-slab.png",
  },
  {
    id: "sheet",
    name: "Профлист",
    description: "Оцинкованный и окрашенный профилированный лист для кровли и ограждений.",
    image: "assets/profile-sheet.png",
  },
  {
    id: "pipes",
    name: "Трубы",
    description: "Стальные круглые и профильные трубы для каркасов, ворот и металлоконструкций.",
    image: "assets/steel-pipes.png",
  },
];

const demoProducts = [
  {
    id: "p-granite-1",
    groupId: "granite",
    name: "Гранитная плита Grey Rock",
    price: 6200,
    unit: "м2",
    stock: 86,
    spec: "600x300x30 мм, термообработка",
    description: "Прочная плита для входных групп, лестниц, цоколей и городских объектов.",
    image: "assets/granite-slabs.png",
    featured: true,
    popularity: 95,
  },
  {
    id: "p-granite-2",
    groupId: "granite",
    name: "Брусчатка гранитная колотая",
    price: 3900,
    unit: "м2",
    stock: 120,
    spec: "100x100x50 мм, серый гранит",
    description: "Плотная колотая фактура для парковок, тротуаров и промышленных дворов.",
    image: "assets/granite-paving.png",
    featured: false,
    popularity: 72,
  },
  {
    id: "p-tile-1",
    groupId: "tiles",
    name: "Керамогранит Industrial Smoke",
    price: 1850,
    unit: "м2",
    stock: 240,
    spec: "600x600x10 мм, R10",
    description: "Матовая техническая плитка под бетон для магазинов, складов и офисов.",
    image: "assets/stone-tiles.png",
    featured: true,
    popularity: 88,
  },
  {
    id: "p-slab-1",
    groupId: "slabs",
    name: "Слэб Black Star",
    price: 14800,
    unit: "м2",
    stock: 18,
    spec: "3000x1600x30 мм, полировка",
    description: "Темный камень с контрастной прожилкой для столешниц и декоративных стен.",
    image: "assets/dark-slab.png",
    featured: true,
    popularity: 91,
  },
  {
    id: "p-sheet-1",
    groupId: "sheet",
    name: "Профлист С20 графит",
    price: 720,
    unit: "лист",
    stock: 460,
    spec: "1150x2000 мм, 0.45 мм, RAL 7024",
    description: "Жесткий профилированный лист для кровли, заборов и фасадных решений.",
    image: "assets/profile-sheet.png",
    featured: true,
    popularity: 84,
  },
  {
    id: "p-pipe-1",
    groupId: "pipes",
    name: "Труба профильная 60x40",
    price: 410,
    unit: "м.п.",
    stock: 980,
    spec: "60x40x2 мм, сталь 3",
    description: "Ходовой профиль для каркасов, ворот, навесов и производственных стеллажей.",
    image: "assets/steel-pipes.png",
    featured: true,
    popularity: 97,
  },
  {
    id: "p-pipe-2",
    groupId: "pipes",
    name: "Труба круглая электросварная",
    price: 360,
    unit: "м.п.",
    stock: 640,
    spec: "57x3 мм, ГОСТ 10704-91",
    description: "Стальная круглая труба для инженерных и строительных металлоконструкций.",
    image: "assets/round-pipes.png",
    featured: false,
    popularity: 70,
  },
];

const demoUsers = [
  {
    id: "u-admin",
    name: "Администратор",
    email: "admin@stonemetal.ru",
    password: "admin123",
    role: "admin",
  },
];

let store = loadStore();
let session = loadJson(SESSION_KEY, null);
let cart = loadJson(CART_KEY, []);
let selectedGroup = "all";
let activeView = "catalog";
let activeAuthTab = "login";
let activeAdminTab = "groups";
let groupImageDraft = "";
let productImageDraft = "";
let toastTimer = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const els = {
  catalogView: $("#catalogView"),
  adminView: $("#adminView"),
  productGrid: $("#productGrid"),
  catalogEmpty: $("#catalogEmpty"),
  groupFilters: $("#groupFilters"),
  searchInput: $("#searchInput"),
  sortSelect: $("#sortSelect"),
  catalogSummary: $("#catalogSummary"),
  metricGroups: $("#metricGroups"),
  metricProducts: $("#metricProducts"),
  metricStock: $("#metricStock"),
  accountButton: $("#accountButton"),
  accountText: $("#accountText"),
  authDialog: $("#authDialog"),
  cartButton: $("#cartButton"),
  cartDrawer: $("#cartDrawer"),
  cartCount: $("#cartCount"),
  cartItems: $("#cartItems"),
  cartSummary: $("#cartSummary"),
  cartTotal: $("#cartTotal"),
  overlay: $("#overlay"),
  toast: $("#toast"),
  groupForm: $("#groupForm"),
  productForm: $("#productForm"),
  groupsList: $("#groupsList"),
  productsList: $("#productsList"),
  ordersList: $("#ordersList"),
  productGroup: $("#productGroup"),
  groupImagePreview: $("#groupImagePreview"),
  productImagePreview: $("#productImagePreview"),
  themeToggle: $("#themeToggle"),
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  applyTheme();
  bindEvents();
  render();
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadStore() {
  const loaded = loadJson(STORE_KEY, null);
  if (loaded?.groups?.length && loaded?.products?.length && loaded?.users?.length) {
    return loaded;
  }
  const seeded = {
    groups: structuredClone(demoGroups),
    products: structuredClone(demoProducts),
    users: structuredClone(demoUsers),
    orders: [],
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveStore() {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function saveSession(user) {
  session = user ? { userId: user.id } : null;
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  render();
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function currentUser() {
  return store.users.find((user) => user.id === session?.userId) || null;
}

function isAdmin() {
  return currentUser()?.role === "admin";
}

function bindEvents() {
  $$(".nav-link, .brand").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  els.searchInput.addEventListener("input", renderProducts);
  els.sortSelect.addEventListener("change", renderProducts);
  $("#resetFilters").addEventListener("click", () => {
    selectedGroup = "all";
    els.searchInput.value = "";
    els.sortSelect.value = "popular";
    render();
  });

  els.productGrid.addEventListener("click", handleCatalogClick);
  els.accountButton.addEventListener("click", handleAccountClick);
  $("#cartButton").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  els.overlay.addEventListener("click", closeCart);
  $("#checkoutButton").addEventListener("click", checkout);

  $$(".segment").forEach((button) => {
    button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
  });

  $("#loginForm").addEventListener("submit", login);
  $("#registerForm").addEventListener("submit", register);

  $$(".admin-tab").forEach((button) => {
    button.addEventListener("click", () => setAdminTab(button.dataset.adminTab));
  });

  els.groupForm.addEventListener("submit", saveGroup);
  els.productForm.addEventListener("submit", saveProduct);
  $("#clearGroupForm").addEventListener("click", resetGroupForm);
  $("#clearProductForm").addEventListener("click", resetProductForm);
  $("#seedResetButton").addEventListener("click", resetDemoData);

  $("#groupImage").addEventListener("change", (event) => {
    readImage(event.target.files[0], (image) => {
      groupImageDraft = image;
      setPreview(els.groupImagePreview, image);
    });
  });

  $("#productImage").addEventListener("change", (event) => {
    readImage(event.target.files[0], (image) => {
      productImageDraft = image;
      setPreview(els.productImagePreview, image);
    });
  });

  els.groupsList.addEventListener("click", handleAdminClick);
  els.productsList.addEventListener("click", handleAdminClick);
  els.ordersList.addEventListener("click", handleAdminClick);
  els.cartItems.addEventListener("click", handleCartClick);
  els.themeToggle.addEventListener("click", toggleTheme);
}

function setView(view) {
  if (view === "admin" && !isAdmin()) {
    showToast("Админка доступна только администратору");
    openAuth("login");
    return;
  }
  activeView = view || "catalog";
  $$(".view").forEach((section) => section.classList.toggle("active", section.id === `${activeView}View`));
  $$(".nav-link").forEach((button) => button.classList.toggle("active", button.dataset.view === activeView));
  renderAdminGate();
}

function setAdminTab(tab) {
  activeAdminTab = tab;
  $$(".admin-tab").forEach((button) => button.classList.toggle("active", button.dataset.adminTab === tab));
  $$(".admin-section").forEach((section) => section.classList.toggle("active", section.id === `${tab}Admin`));
  renderAdmin();
}

function setAuthTab(tab) {
  activeAuthTab = tab;
  $$(".segment").forEach((button) => button.classList.toggle("active", button.dataset.authTab === tab));
  $$(".auth-form").forEach((form) => form.classList.toggle("active", form.id === `${tab}Form`));
}

function render() {
  renderAccount();
  renderAdminGate();
  renderFilters();
  renderProducts();
  renderCart();
  renderAdmin();
}

function renderAccount() {
  const user = currentUser();
  els.accountText.textContent = user ? user.name.split(" ")[0] : "Войти";
  $("[data-admin-link]").hidden = !isAdmin();
  if (activeView === "admin" && !isAdmin()) {
    setView("catalog");
  }
}

function renderAdminGate() {
  $("[data-admin-link]").hidden = !isAdmin();
}

function renderFilters() {
  const counts = store.groups.map((group) => [
    group.id,
    store.products.filter((product) => product.groupId === group.id).length,
  ]);
  const countMap = Object.fromEntries(counts);
  const allCount = store.products.length;
  els.groupFilters.innerHTML = [
    groupChipTemplate({ id: "all", name: "Все материалы" }, allCount),
    ...store.groups.map((group) => groupChipTemplate(group, countMap[group.id] || 0)),
  ].join("");

  els.groupFilters.querySelectorAll(".group-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectedGroup = button.dataset.groupId;
      render();
    });
  });

  els.metricGroups.textContent = store.groups.length;
  els.metricProducts.textContent = store.products.length;
  els.metricStock.textContent = store.products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
}

function groupChipTemplate(group, count) {
  return `
    <button class="group-chip ${selectedGroup === group.id ? "active" : ""}" data-group-id="${escapeAttr(group.id)}" type="button">
      <span>${escapeHtml(group.name)}</span>
      <small>${count}</small>
    </button>
  `;
}

function renderProducts() {
  const query = els.searchInput.value.trim().toLowerCase();
  let products = store.products.filter((product) => {
    const group = getGroup(product.groupId);
    const inGroup = selectedGroup === "all" || product.groupId === selectedGroup;
    const haystack = `${product.name} ${product.description} ${product.spec} ${group?.name || ""}`.toLowerCase();
    return inGroup && (!query || haystack.includes(query));
  });

  products = sortProducts(products, els.sortSelect.value);

  els.productGrid.innerHTML = products.map(productCardTemplate).join("");
  els.catalogEmpty.hidden = products.length > 0;
  els.catalogSummary.textContent = `${products.length} из ${store.products.length} позиций на витрине`;
}

function sortProducts(products, sort) {
  const list = [...products];
  if (sort === "priceAsc") return list.sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") return list.sort((a, b) => b.price - a.price);
  if (sort === "stock") return list.sort((a, b) => b.stock - a.stock);
  return list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.popularity - a.popularity);
}

function productCardTemplate(product) {
  const group = getGroup(product.groupId);
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" />
        <span class="product-badge">${escapeHtml(group?.name || "Материал")}</span>
      </div>
      <div class="product-body">
        <div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description || "")}</p>
        </div>
        <div class="product-meta">
          <span class="pill">${escapeHtml(product.spec || "под заказ")}</span>
          <span class="pill">${escapeHtml(product.unit)}</span>
        </div>
        <div class="price-row">
          <div>
            <div class="price">${money(product.price)}</div>
            <div class="stock">${Number(product.stock || 0)} ${escapeHtml(product.unit)} на складе</div>
          </div>
        </div>
        <div class="product-actions">
          <input class="qty-input" type="number" min="1" value="1" aria-label="Количество" />
          <button class="primary wide" data-action="add-cart" data-product-id="${escapeAttr(product.id)}" type="button">
            <span data-icon="shopping-cart"></span>
            В корзину
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderAdmin() {
  if (!isAdmin()) return;
  renderGroupSelect();
  renderGroupsList();
  renderProductsList();
  renderOrdersList();
}

function renderGroupSelect() {
  els.productGroup.innerHTML = store.groups
    .map((group) => `<option value="${escapeAttr(group.id)}">${escapeHtml(group.name)}</option>`)
    .join("");
}

function renderGroupsList() {
  els.groupsList.innerHTML = store.groups
    .map((group) => {
      const count = store.products.filter((product) => product.groupId === group.id).length;
      return `
        <article class="admin-row">
          <img class="admin-thumb" src="${escapeAttr(group.image)}" alt="${escapeAttr(group.name)}" />
          <div>
            <h3>${escapeHtml(group.name)}</h3>
            <p>${escapeHtml(group.description || "")}</p>
            <span class="pill">${count} товаров</span>
          </div>
          <div class="card-controls">
            <button class="icon-button" data-action="edit-group" data-id="${escapeAttr(group.id)}" type="button" title="Редактировать" aria-label="Редактировать">
              <span data-icon="pencil"></span>
            </button>
            <button class="icon-button danger" data-action="delete-group" data-id="${escapeAttr(group.id)}" type="button" title="Удалить" aria-label="Удалить">
              <span data-icon="trash-2"></span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProductsList() {
  els.productsList.innerHTML = store.products
    .map((product) => {
      const group = getGroup(product.groupId);
      return `
        <article class="admin-row">
          <img class="admin-thumb" src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" />
          <div>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(group?.name || "")} · ${escapeHtml(product.spec || "")}</p>
            <span class="pill">${money(product.price)} / ${escapeHtml(product.unit)}</span>
            <span class="pill">${Number(product.stock || 0)} в наличии</span>
          </div>
          <div class="card-controls">
            <button class="icon-button" data-action="edit-product" data-id="${escapeAttr(product.id)}" type="button" title="Редактировать" aria-label="Редактировать">
              <span data-icon="pencil"></span>
            </button>
            <button class="icon-button danger" data-action="delete-product" data-id="${escapeAttr(product.id)}" type="button" title="Удалить" aria-label="Удалить">
              <span data-icon="trash-2"></span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderOrdersList() {
  if (!store.orders.length) {
    els.ordersList.innerHTML = `<div class="empty-state"><span data-icon="receipt-text"></span><h3>Заказов пока нет</h3><p>Оформи корзину, и заявка появится здесь.</p></div>`;
    return;
  }

  els.ordersList.innerHTML = store.orders
    .slice()
    .reverse()
    .map((order) => `
      <article class="admin-row">
        <div class="admin-thumb" style="display:grid;place-items:center;"><strong>#${escapeHtml(order.id.slice(-4))}</strong></div>
        <div>
          <h3>${escapeHtml(order.customer.name)} · ${money(order.total)}</h3>
          <p>${new Date(order.createdAt).toLocaleString("ru-RU")} · ${escapeHtml(order.customer.email)}</p>
          <p>${order.items.map((item) => `${escapeHtml(item.name)} x ${item.qty}`).join(", ")}</p>
        </div>
        <div class="card-controls">
          <button class="icon-button danger" data-action="delete-order" data-id="${escapeAttr(order.id)}" type="button" title="Удалить" aria-label="Удалить">
            <span data-icon="trash-2"></span>
          </button>
        </div>
      </article>
    `)
    .join("");
}

function renderCart() {
  const items = cart
    .map((item) => ({ ...item, product: getProduct(item.productId) }))
    .filter((item) => item.product);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.qty * item.product.price, 0);

  els.cartCount.textContent = count;
  els.cartSummary.textContent = count ? `${count} позиций в заявке` : "Пока пусто";
  els.cartTotal.textContent = money(total);

  if (!items.length) {
    els.cartItems.innerHTML = `<div class="empty-state"><span data-icon="shopping-cart"></span><h3>Корзина пуста</h3><p>Добавь товары из каталога.</p></div>`;
    return;
  }

  els.cartItems.innerHTML = items.map((item) => `
    <article class="cart-item">
      <img class="cart-thumb" src="${escapeAttr(item.product.image)}" alt="${escapeAttr(item.product.name)}" />
      <div>
        <h3>${escapeHtml(item.product.name)}</h3>
        <p>${money(item.product.price)} / ${escapeHtml(item.product.unit)}</p>
        <div class="qty-row">
          <button class="qty-button" data-action="dec-cart" data-id="${escapeAttr(item.productId)}" type="button">−</button>
          <strong>${item.qty}</strong>
          <button class="qty-button" data-action="inc-cart" data-id="${escapeAttr(item.productId)}" type="button">+</button>
          <button class="icon-button danger" data-action="remove-cart" data-id="${escapeAttr(item.productId)}" type="button" title="Удалить" aria-label="Удалить">
            <span data-icon="trash-2"></span>
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function handleCatalogClick(event) {
  const button = event.target.closest("[data-action='add-cart']");
  if (!button) return;
  const card = button.closest(".product-card");
  const qtyInput = card.querySelector(".qty-input");
  addToCart(button.dataset.productId, Number(qtyInput.value || 1));
}

function handleAdminClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit-group") editGroup(id);
  if (action === "delete-group") deleteGroup(id);
  if (action === "edit-product") editProduct(id);
  if (action === "delete-product") deleteProduct(id);
  if (action === "delete-order") deleteOrder(id);
}

function handleCartClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const item = cart.find((entry) => entry.productId === button.dataset.id);
  if (!item && button.dataset.action !== "remove-cart") return;

  if (button.dataset.action === "inc-cart") item.qty += 1;
  if (button.dataset.action === "dec-cart") item.qty -= 1;
  if (button.dataset.action === "remove-cart" || item?.qty <= 0) {
    cart = cart.filter((entry) => entry.productId !== button.dataset.id);
  }
  saveCart();
  renderCart();
}

function addToCart(productId, qty) {
  const product = getProduct(productId);
  if (!product) return;
  const amount = Math.max(1, Math.min(Number(qty || 1), Number(product.stock || 1)));
  const item = cart.find((entry) => entry.productId === productId);
  if (item) {
    item.qty = Math.min(item.qty + amount, Number(product.stock || item.qty + amount));
  } else {
    cart.push({ productId, qty: amount });
  }
  saveCart();
  renderCart();
  showToast(`${product.name} добавлен в корзину`);
}

function checkout() {
  if (!cart.length) {
    showToast("Корзина пустая");
    return;
  }
  const user = currentUser();
  if (!user) {
    showToast("Сначала войди или зарегистрируйся");
    closeCart();
    openAuth("login");
    return;
  }

  const items = cart
    .map((item) => ({ ...item, product: getProduct(item.productId) }))
    .filter((item) => item.product);

  const order = {
    id: createId("order"),
    createdAt: new Date().toISOString(),
    customer: { id: user.id, name: user.name, email: user.email },
    items: items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      qty: item.qty,
      unit: item.product.unit,
      price: item.product.price,
    })),
    total: items.reduce((sum, item) => sum + item.qty * item.product.price, 0),
  };

  store.orders.push(order);
  cart = [];
  saveStore();
  saveCart();
  render();
  closeCart();
  showToast("Заявка оформлена и появилась в админке");
}

function handleAccountClick() {
  const user = currentUser();
  if (!user) {
    openAuth("login");
    return;
  }
  const logout = confirm(`Выйти из аккаунта ${user.name}?`);
  if (logout) {
    saveSession(null);
    showToast("Ты вышел из аккаунта");
  }
}

function openAuth(tab) {
  setAuthTab(tab);
  els.authDialog.showModal();
}

function login(event) {
  event.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value;
  const user = store.users.find((entry) => entry.email.toLowerCase() === email && entry.password === password);

  if (!user) {
    showToast("Неверный email или пароль");
    return;
  }

  saveSession(user);
  els.authDialog.close();
  showToast(`Добро пожаловать, ${user.name}`);
}

function register(event) {
  event.preventDefault();
  const name = $("#registerName").value.trim();
  const email = $("#registerEmail").value.trim().toLowerCase();
  const password = $("#registerPassword").value;

  if (store.users.some((user) => user.email.toLowerCase() === email)) {
    showToast("Такой email уже зарегистрирован");
    return;
  }

  const user = { id: createId("user"), name, email, password, role: "customer" };
  store.users.push(user);
  saveStore();
  saveSession(user);
  els.authDialog.close();
  showToast("Аккаунт создан");
}

function saveGroup(event) {
  event.preventDefault();
  const id = $("#groupId").value;
  const group = {
    id: id || createId("group"),
    name: $("#groupName").value.trim(),
    description: $("#groupDescription").value.trim(),
    image: groupImageDraft || getGroup(id)?.image || "assets/granite-slabs.png",
  };

  if (id) {
    store.groups = store.groups.map((entry) => (entry.id === id ? group : entry));
  } else {
    store.groups.push(group);
  }

  saveStore();
  resetGroupForm();
  render();
  showToast("Группа сохранена");
}

function editGroup(id) {
  const group = getGroup(id);
  if (!group) return;
  $("#groupFormTitle").textContent = "Редактирование группы";
  $("#groupId").value = group.id;
  $("#groupName").value = group.name;
  $("#groupDescription").value = group.description || "";
  groupImageDraft = "";
  setPreview(els.groupImagePreview, group.image);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteGroup(id) {
  const group = getGroup(id);
  const hasProducts = store.products.some((product) => product.groupId === id);
  if (!group) return;
  if (hasProducts) {
    showToast("Сначала перенеси или удали товары этой группы");
    return;
  }
  if (!confirm(`Удалить группу "${group.name}"?`)) return;
  store.groups = store.groups.filter((entry) => entry.id !== id);
  saveStore();
  resetGroupForm();
  render();
  showToast("Группа удалена");
}

function saveProduct(event) {
  event.preventDefault();
  const id = $("#productId").value;
  const oldProduct = getProduct(id);
  const group = getGroup($("#productGroup").value);
  const product = {
    id: id || createId("product"),
    groupId: $("#productGroup").value,
    name: $("#productName").value.trim(),
    unit: $("#productUnit").value,
    price: Number($("#productPrice").value || 0),
    stock: Number($("#productStock").value || 0),
    spec: $("#productSpec").value.trim(),
    description: $("#productDescription").value.trim(),
    image: productImageDraft || oldProduct?.image || group?.image || "assets/granite-slabs.png",
    featured: $("#productFeatured").checked,
    popularity: oldProduct?.popularity || Math.floor(50 + Math.random() * 45),
  };

  if (id) {
    store.products = store.products.map((entry) => (entry.id === id ? product : entry));
  } else {
    store.products.push(product);
  }

  saveStore();
  resetProductForm();
  render();
  showToast("Товар сохранен");
}

function editProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  $("#productFormTitle").textContent = "Редактирование товара";
  $("#productId").value = product.id;
  $("#productName").value = product.name;
  $("#productGroup").value = product.groupId;
  $("#productUnit").value = product.unit;
  $("#productPrice").value = product.price;
  $("#productStock").value = product.stock;
  $("#productSpec").value = product.spec || "";
  $("#productDescription").value = product.description || "";
  $("#productFeatured").checked = Boolean(product.featured);
  productImageDraft = "";
  setPreview(els.productImagePreview, product.image);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  if (!confirm(`Удалить товар "${product.name}"?`)) return;
  store.products = store.products.filter((entry) => entry.id !== id);
  cart = cart.filter((entry) => entry.productId !== id);
  saveStore();
  saveCart();
  resetProductForm();
  render();
  showToast("Товар удален");
}

function deleteOrder(id) {
  if (!confirm("Удалить заявку?")) return;
  store.orders = store.orders.filter((order) => order.id !== id);
  saveStore();
  renderOrdersList();
  showToast("Заявка удалена");
}

function resetGroupForm() {
  els.groupForm.reset();
  $("#groupFormTitle").textContent = "Новая группа";
  $("#groupId").value = "";
  groupImageDraft = "";
  setPreview(els.groupImagePreview, "");
}

function resetProductForm() {
  els.productForm.reset();
  $("#productFormTitle").textContent = "Новый товар";
  $("#productId").value = "";
  productImageDraft = "";
  setPreview(els.productImagePreview, "");
  renderGroupSelect();
}

function resetDemoData() {
  if (!confirm("Вернуть демо-группы и демо-товары? Пользователи и заказы сохранятся.")) return;
  store.groups = structuredClone(demoGroups);
  store.products = structuredClone(demoProducts);
  saveStore();
  resetGroupForm();
  resetProductForm();
  selectedGroup = "all";
  render();
  showToast("Демо-каталог восстановлен");
}

function readImage(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}

function setPreview(container, src) {
  container.classList.toggle("has-image", Boolean(src));
  container.innerHTML = src ? `<img src="${escapeAttr(src)}" alt="Предпросмотр" />` : "";
}

function openCart() {
  els.cartDrawer.classList.add("open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
  els.overlay.hidden = false;
}

function closeCart() {
  els.cartDrawer.classList.remove("open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
  els.overlay.hidden = true;
}

function getGroup(id) {
  return store.groups.find((group) => group.id === id);
}

function getProduct(id) {
  return store.products.find((product) => product.id === id);
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function money(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function applyTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "dark";
  document.documentElement.classList.toggle("light", theme === "light");
  const icon = els.themeToggle?.querySelector("[data-icon]");
  if (icon) icon.dataset.icon = theme === "light" ? icons.moon : icons.sun;
}

function toggleTheme() {
  const nextTheme = document.documentElement.classList.contains("light") ? "dark" : "light";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme();
}
