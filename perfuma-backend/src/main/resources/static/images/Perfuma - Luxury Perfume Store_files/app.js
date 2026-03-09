const API_BASE_URL = "http://localhost:8080/api/products";
const LEGACY_PRODUCT_BASE = "http://localhost:8080/products";
const USER_BASE_URL = "http://localhost:8080/users";
const CART_BASE_URL = "http://localhost:8080/cart";
const ORDER_BASE_URL = "http://localhost:8080/orders";
const CART_KEY = "perfuma-cart";
const SESSION_KEY = "perfuma-session";
const FALLBACK_IMAGE = "https://via.placeholder.com/600x600?text=Perfuma";

const productsGrid = document.getElementById("products-grid");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const cartToggle = document.getElementById("cart-toggle");
const closeCart = document.getElementById("close-cart");
const cartSidebar = document.getElementById("cart-sidebar");
const cartItemsElement = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("product-modal");
const closeModal = document.getElementById("close-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-product-title");
const modalBrand = document.getElementById("modal-brand");
const modalDescription = document.getElementById("modal-description");
const modalStock = document.getElementById("modal-stock");
const modalPrice = document.getElementById("modal-price");
const modalAddCart = document.getElementById("modal-add-cart");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const adminLink = document.getElementById("admin-link");
const adminPanel = document.getElementById("admin-panel");
const adminProductForm = document.getElementById("admin-product-form");
const adminProductsList = document.getElementById("admin-products-list");
const adminOrdersList = document.getElementById("admin-orders-list");
const cancelEditBtn = document.getElementById("cancel-edit");
const authModal = document.getElementById("auth-modal");
const closeAuthModal = document.getElementById("close-auth-modal");
const authModalTitle = document.getElementById("auth-modal-title");
const authForm = document.getElementById("auth-form");
const authName = document.getElementById("auth-name");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authRole = document.getElementById("auth-role");
const productIdInput = document.getElementById("product-id");
const productNameInput = document.getElementById("product-name");
const productBrandInput = document.getElementById("product-brand");
const productPriceInput = document.getElementById("product-price");
const productStockInput = document.getElementById("product-stock");
const productSizeInput = document.getElementById("product-size");
const productCategoryInput = document.getElementById("product-category");
const productImageInput = document.getElementById("product-image");
const productDescriptionInput = document.getElementById("product-description");
const heroSection = document.querySelector(".hero-section");
const featuredSection = document.querySelector(".featured-section");
const notesSection = document.querySelector(".notes-section");
const inspirationSection = document.querySelector(".inspiration-section");
const productsSection = document.getElementById("products");
const aboutSection = document.getElementById("about");

let products = [];
let selectedProduct = null;
let cart = loadCart();
let currentUser = loadSession();
let authMode = "login";
let editingImageData = "";

function formatPrice(value) {
    const amount = Number(value) || 0;
    return `$${amount.toFixed(2)}`;
}

function loadCart() {
    try {
        const parsed = JSON.parse(localStorage.getItem(CART_KEY));
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed;
    } catch (error) {
        return [];
    }
}

function loadSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (error) {
        return null;
    }
}

function saveSession(user) {
    currentUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
    currentUser = null;
    localStorage.removeItem(SESSION_KEY);
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getUserId() {
    return currentUser?.id;
}

function usesServerCart() {
    return isCustomer() && Boolean(getUserId());
}

function mapServerCartItem(item) {
    return {
        cartId: item.id,
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price) || 0,
        quantity: item.quantity
    };
}

async function fetchServerCart() {
    if (!usesServerCart()) {
        return;
    }
    const response = await fetch(`${CART_BASE_URL}/user/${getUserId()}`);
    if (!response.ok) {
        throw new Error("Failed to load cart.");
    }
    const items = await response.json();
    cart = items.map(mapServerCartItem);
    saveCart();
    syncCartUI();
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
}

function hideError() {
    errorElement.classList.add("hidden");
}

function isAdmin() {
    return currentUser?.role === "ADMIN";
}

function isCustomer() {
    return currentUser?.role === "CUS";
}

function updateAuthUI() {
    const loggedIn = Boolean(currentUser);
    loginBtn.classList.toggle("hidden", loggedIn);
    registerBtn.classList.toggle("hidden", loggedIn);
    logoutBtn.classList.toggle("hidden", !loggedIn);
    adminLink.classList.toggle("hidden", !isAdmin());
    adminPanel.classList.toggle("hidden", !isAdmin());
    cartToggle.classList.toggle("hidden", !isCustomer());
    applyRoute();
    if (isAdmin()) {
        renderAdminOrders();
    } else if (adminOrdersList) {
        adminOrdersList.innerHTML = "";
    }
}

function setSectionVisibility(showMain, showAdmin) {
    heroSection.classList.toggle("hidden", !showMain);
    featuredSection?.classList.toggle("hidden", !showMain);
    notesSection?.classList.toggle("hidden", !showMain);
    inspirationSection?.classList.toggle("hidden", !showMain);
    productsSection.classList.toggle("hidden", !showMain);
    aboutSection.classList.toggle("hidden", !showMain);
    adminPanel.classList.toggle("hidden", !showAdmin);
}

function applyRoute() {
    const route = (window.location.hash || "#home").replace("#", "");
    if (route === "admin-panel" && isAdmin()) {
        setSectionVisibility(false, true);
        return;
    }
    setSectionVisibility(true, false);
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = product.imageUrl || FALLBACK_IMAGE;
    const stockText = product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock";

    card.innerHTML = `
        <img src="${image}" alt="${product.name}" onerror="this.src='${FALLBACK_IMAGE}'">
        <div class="product-body">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-brand">${product.brand}</p>
            <p>${product.category}</p>
            <div class="product-bottom">
                <span class="product-price">${formatPrice(product.price)}</span>
                <span>${stockText}</span>
            </div>
            <div class="button-row">
                <button class="open-details" data-id="${product.id}" type="button">Details</button>
                <button class="primary add-cart" data-id="${product.id}" type="button">Add to Cart</button>
            </div>
        </div>
    `;

    card.querySelector(".open-details").addEventListener("click", () => openProductModal(product.id));
    card.querySelector(".add-cart").addEventListener("click", () => addToCart(product.id));

    return card;
}

function renderProducts(items) {
    productsGrid.innerHTML = "";
    if (!items.length) {
        productsGrid.innerHTML = "<p>No perfumes match your search.</p>";
        return;
    }
    items.forEach((product) => {
        productsGrid.appendChild(createProductCard(product));
    });
}

function renderAdminProducts() {
    if (!isAdmin()) {
        return;
    }

    adminProductsList.innerHTML = "";
    products.forEach((product) => {
        const row = document.createElement("div");
        row.className = "admin-product-row";
        row.innerHTML = `
            <div>
                <strong>${product.name}</strong>
                <p>${product.brand} - ${formatPrice(product.price)} - Stock: ${product.stockQuantity}</p>
            </div>
            <div>
                <button class="plain-button" type="button" data-action="edit" data-id="${product.id}">Edit</button>
                <button class="plain-button" type="button" data-action="delete" data-id="${product.id}">Delete</button>
            </div>
        `;
        adminProductsList.appendChild(row);
    });
}

function getFilteredProducts() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    return products.filter((product) => {
        const matchSearch = product.name.toLowerCase().includes(search) || product.brand.toLowerCase().includes(search);
        const matchCategory = category === "all" || product.category === category;
        return matchSearch && matchCategory;
    });
}

function applyFilters() {
    renderProducts(getFilteredProducts());
}

function populateCategoryOptions(items) {
    const current = categoryFilter.value;
    const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort();
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    if ([...categoryFilter.options].some((opt) => opt.value === current)) {
        categoryFilter.value = current;
    } else {
        categoryFilter.value = "all";
    }
}

async function fetchProducts() {
    try {
        loadingElement.classList.remove("hidden");
        hideError();

        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        products = await response.json();
        populateCategoryOptions(products);
        renderProducts(products);
        renderAdminProducts();
    } catch (error) {
        showError("Could not load products. Ensure the Spring Boot API is running on http://localhost:8080.");
    } finally {
        loadingElement.classList.add("hidden");
    }
}

function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function syncCartUI() {
    cartCountElement.textContent = String(getCartItemCount());
    cartTotalElement.textContent = formatPrice(getCartTotal());
    cartItemsElement.innerHTML = "";

    if (!cart.length) {
        cartItemsElement.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <h4>${item.name}</h4>
            <p>${formatPrice(item.price)} each</p>
            <div class="qty-controls">
                <button type="button" data-action="decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" type="button" data-action="remove" data-id="${item.id}">Remove</button>
            <p>Subtotal: ${formatPrice(item.quantity * item.price)}</p>
        `;
        cartItemsElement.appendChild(row);
    });
}

function addToCart(productId) {
    if (!isCustomer()) {
        showError("Please login as a customer to add items to cart.");
        return;
    }

    const product = products.find((item) => item.id === productId);
    if (!product) {
        return;
    }
    if (usesServerCart()) {
        addToServerCart(productId);
        return;
    }

    const existing = cart.find((item) => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            quantity: 1
        });
    }
    saveCart();
    syncCartUI();
}

async function addToServerCart(productId) {
    try {
        const response = await fetch(`${CART_BASE_URL}/addToCart`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userId: getUserId(),
                productId,
                quantity: 1
            })
        });

        if (!response.ok) {
            const message = await response.text();
            showError(message || "Failed to add item to cart.");
            return;
        }

        await fetchServerCart();
        await fetchProducts();
    } catch (error) {
        showError("Failed to add item to cart.");
    }
}

function openAuthModal(mode) {
    authMode = mode;
    authModalTitle.textContent = mode === "login" ? "Login" : "Signup";
    authName.classList.toggle("hidden", mode === "login");
    authRole.classList.toggle("hidden", mode === "login");
    authModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function closeAuthDialog() {
    authModal.classList.add("hidden");
    if (modal.classList.contains("hidden") && !cartSidebar.classList.contains("open")) {
        overlay.classList.add("hidden");
    }
}

function fillAdminForm(product) {
    productIdInput.value = product.id;
    productNameInput.value = product.name || "";
    productBrandInput.value = product.brand || "";
    productPriceInput.value = product.price || "";
    productStockInput.value = product.stockQuantity || 0;
    productSizeInput.value = product.size || "";
    productCategoryInput.value = product.category || "";
    editingImageData = product.imageUrl || "";
    productImageInput.value = "";
    productDescriptionInput.value = product.description || "";
}

function resetAdminForm() {
    adminProductForm.reset();
    productIdInput.value = "";
    editingImageData = "";
}

async function saveAdminProduct(event) {
    event.preventDefault();
    const id = productIdInput.value;
    const selectedFile = productImageInput.files?.[0];
    let imageData = editingImageData;

    if (selectedFile) {
        imageData = await readFileAsDataUrl(selectedFile);
    }

    const payload = {
        name: productNameInput.value,
        brand: productBrandInput.value,
        price: Number(productPriceInput.value),
        stockQuantity: Number(productStockInput.value),
        size: productSizeInput.value ? Number(productSizeInput.value) : 0,
        category: productCategoryInput.value,
        imageUrl: imageData || "",
        description: productDescriptionInput.value
    };

    const url = id ? `${LEGACY_PRODUCT_BASE}/updateProduct/${id}` : `${LEGACY_PRODUCT_BASE}/addProduct`;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        showError("Failed to save product.");
        return;
    }

    resetAdminForm();
    await fetchProducts();
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(file);
    });
}

async function deleteAdminProduct(id) {
    const response = await fetch(`${LEGACY_PRODUCT_BASE}/deleteProduct/${id}`, {method: "DELETE"});
    if (!response.ok) {
        showError("Failed to delete product.");
        return;
    }
    await fetchProducts();
}

async function checkoutCashOnDelivery() {
    if (!usesServerCart()) {
        showError("Please login as a customer to checkout.");
        return;
    }
    if (!cart.length) {
        showError("Your cart is empty.");
        return;
    }

    try {
        const response = await fetch(`${ORDER_BASE_URL}/checkout/${getUserId()}?paymentMethod=CASH_ON_DELIVERY`, {
            method: "POST"
        });
        if (!response.ok) {
            showError("Checkout failed.");
            return;
        }

        cart = [];
        saveCart();
        syncCartUI();
        await fetchProducts();
        closeCartSidebar();
        alert("Order placed successfully with Cash on Delivery.");
        if (isAdmin()) {
            await renderAdminOrders();
        }
    } catch (error) {
        showError("Checkout failed.");
    }
}

async function renderAdminOrders() {
    if (!isAdmin()) {
        return;
    }

    try {
        const response = await fetch(`${ORDER_BASE_URL}/all`);
        if (!response.ok) {
            adminOrdersList.innerHTML = "<p>Failed to load orders.</p>";
            return;
        }

        const orders = await response.json();
        if (!orders.length) {
            adminOrdersList.innerHTML = "<p>No orders yet.</p>";
            return;
        }

        adminOrdersList.innerHTML = "";
        orders.forEach((order) => {
            const row = document.createElement("div");
            row.className = "admin-product-row admin-order-row";
            row.innerHTML = `
                <div>
                    <strong>Order #${order.id}</strong>
                    <p>Customer: ${order.user?.name || "N/A"} (${order.user?.email || "N/A"})</p>
                    <p>Total: ${formatPrice(order.total)} | Payment: ${order.paymentMethod || "CASH_ON_DELIVERY"}</p>
                    <p>Date: ${order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}</p>
                </div>
                <div class="order-status-controls">
                    <select data-order-id="${order.id}" class="order-status-select">
                        <option value="PLACED" ${order.status === "PLACED" ? "selected" : ""}>PLACED</option>
                        <option value="PROCESSING" ${order.status === "PROCESSING" ? "selected" : ""}>PROCESSING</option>
                        <option value="DISPATCHED" ${order.status === "DISPATCHED" ? "selected" : ""}>DISPATCHED</option>
                        <option value="DELIVERED" ${order.status === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
                        <option value="CANCELLED" ${order.status === "CANCELLED" ? "selected" : ""}>CANCELLED</option>
                    </select>
                    <button class="plain-button" type="button" data-action="save-order-status" data-order-id="${order.id}">
                        Update
                    </button>
                </div>
            `;
            adminOrdersList.appendChild(row);
        });
    } catch (error) {
        adminOrdersList.innerHTML = "<p>Failed to load orders.</p>";
    }
}

async function updateOrderStatus(orderId, status) {
    const response = await fetch(`${ORDER_BASE_URL}/${orderId}/status?status=${encodeURIComponent(status)}`, {
        method: "PUT"
    });
    if (!response.ok) {
        showError("Failed to update order status.");
        return;
    }
    await renderAdminOrders();
}

async function handleAuthSubmit(event) {
    event.preventDefault();
    if (authMode === "login") {
        const response = await fetch(`${USER_BASE_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: authEmail.value, password: authPassword.value})
        });
        if (!response.ok) {
            showError("Invalid login credentials.");
            return;
        }
        const user = await response.json();
        saveSession(user);
    } else {
        const response = await fetch(`${USER_BASE_URL}/addUser`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: authName.value,
                email: authEmail.value,
                password: authPassword.value,
                role: authRole.value
            })
        });
        if (!response.ok) {
            showError("Signup failed.");
            return;
        }
        const user = await response.json();
        saveSession(user);
    }

    updateAuthUI();
    closeAuthDialog();
    await fetchProducts();
    if (isCustomer()) {
        await fetchServerCart();
    } else {
        cart = [];
        saveCart();
        syncCartUI();
    }
}

async function updateCartItem(productId, action) {
    if (usesServerCart()) {
        await updateServerCartItem(productId, action);
        return;
    }

    const target = cart.find((item) => item.id === productId);
    if (!target) {
        return;
    }
    if (action === "increase") {
        target.quantity += 1;
    } else if (action === "decrease") {
        target.quantity = Math.max(1, target.quantity - 1);
    } else if (action === "remove") {
        cart = cart.filter((item) => item.id !== productId);
    }
    saveCart();
    syncCartUI();
}

async function updateServerCartItem(productId, action) {
    const target = cart.find((item) => item.id === productId);
    if (!target) {
        return;
    }

    try {
        if (action === "remove") {
            const removeResponse = await fetch(`${CART_BASE_URL}/delete/${target.cartId}`, {method: "DELETE"});
            if (!removeResponse.ok) {
                showError("Failed to remove item from cart.");
                return;
            }
        } else {
            const nextQty = action === "increase" ? target.quantity + 1 : Math.max(1, target.quantity - 1);
            const updateResponse = await fetch(`${CART_BASE_URL}/updateCart/${target.cartId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({quantity: nextQty})
            });
            if (!updateResponse.ok) {
                const message = await updateResponse.text();
                showError(message || "Failed to update cart.");
                return;
            }
        }

        await fetchServerCart();
        await fetchProducts();
    } catch (error) {
        showError("Failed to update cart.");
    }
}

function openCart() {
    cartSidebar.classList.add("open");
    overlay.classList.remove("hidden");
    cartSidebar.setAttribute("aria-hidden", "false");
}

function closeCartSidebar() {
    cartSidebar.classList.remove("open");
    cartSidebar.setAttribute("aria-hidden", "true");
    if (modal.classList.contains("hidden")) {
        overlay.classList.add("hidden");
    }
}

function openProductModal(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
        return;
    }

    selectedProduct = product;
    modalImage.src = product.imageUrl || FALLBACK_IMAGE;
    modalImage.alt = product.name;
    modalTitle.textContent = product.name;
    modalBrand.textContent = product.brand;
    modalDescription.textContent = product.description;
    modalStock.textContent = `Stock: ${product.stockQuantity}`;
    modalPrice.textContent = formatPrice(product.price);

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function closeProductModal() {
    modal.classList.add("hidden");
    selectedProduct = null;
    if (!cartSidebar.classList.contains("open")) {
        overlay.classList.add("hidden");
    }
}

function registerEvents() {
    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    cartToggle.addEventListener("click", openCart);
    closeCart.addEventListener("click", closeCartSidebar);
    closeModal.addEventListener("click", closeProductModal);
    closeAuthModal.addEventListener("click", closeAuthDialog);
    overlay.addEventListener("click", () => {
        closeProductModal();
        closeAuthDialog();
        closeCartSidebar();
    });
    loginBtn.addEventListener("click", () => openAuthModal("login"));
    registerBtn.addEventListener("click", () => openAuthModal("signup"));
    logoutBtn.addEventListener("click", () => {
        clearSession();
        cart = [];
        saveCart();
        syncCartUI();
        updateAuthUI();
    });
    checkoutBtn.addEventListener("click", checkoutCashOnDelivery);
    authForm.addEventListener("submit", handleAuthSubmit);
    adminProductForm.addEventListener("submit", saveAdminProduct);
    cancelEditBtn.addEventListener("click", resetAdminForm);

    modalAddCart.addEventListener("click", () => {
        if (selectedProduct) {
            addToCart(selectedProduct.id);
            openCart();
        }
    });

    cartItemsElement.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const action = target.dataset.action;
        const id = Number(target.dataset.id);
        if (!action || Number.isNaN(id)) {
            return;
        }
        await updateCartItem(id, action);
    });

    adminProductsList.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const action = target.dataset.action;
        const id = Number(target.dataset.id);
        if (!action || Number.isNaN(id)) {
            return;
        }

        const product = products.find((item) => item.id === id);
        if (action === "edit" && product) {
            fillAdminForm(product);
            return;
        }

        if (action === "delete") {
            await deleteAdminProduct(id);
        }
    });

    adminOrdersList.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        if (target.dataset.action !== "save-order-status") {
            return;
        }

        const orderId = Number(target.dataset.orderId);
        if (Number.isNaN(orderId)) {
            return;
        }

        const select = adminOrdersList.querySelector(`select[data-order-id="${orderId}"]`);
        if (!(select instanceof HTMLSelectElement)) {
            return;
        }

        await updateOrderStatus(orderId, select.value);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    registerEvents();
    updateAuthUI();
    syncCartUI();
    await fetchProducts();
    if (isCustomer()) {
        await fetchServerCart();
    }
    if (isAdmin()) {
        await renderAdminOrders();
    }
    applyRoute();
    window.addEventListener("hashchange", applyRoute);
});
