const API_BASE_URL = "http://localhost:8080/api/products";
const CART_KEY = "perfuma-cart";
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

let products = [];
let selectedProduct = null;
let cart = loadCart();

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

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
}

function hideError() {
    errorElement.classList.add("hidden");
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

async function fetchProducts() {
    try {
        loadingElement.classList.remove("hidden");
        hideError();

        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        products = await response.json();
        renderProducts(products);
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
    const product = products.find((item) => item.id === productId);
    if (!product) {
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

function updateCartItem(productId, action) {
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
    overlay.addEventListener("click", () => {
        closeProductModal();
        closeCartSidebar();
    });

    modalAddCart.addEventListener("click", () => {
        if (selectedProduct) {
            addToCart(selectedProduct.id);
            openCart();
        }
    });

    cartItemsElement.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const action = target.dataset.action;
        const id = Number(target.dataset.id);
        if (!action || Number.isNaN(id)) {
            return;
        }
        updateCartItem(id, action);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    registerEvents();
    syncCartUI();
    await fetchProducts();
});
