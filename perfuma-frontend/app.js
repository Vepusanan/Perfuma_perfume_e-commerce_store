const API_URL = 'http://localhost:8080/api/products';
let products = [];
let cart = JSON.parse(localStorage.getItem('perfuma_cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartTotalPrice = document.getElementById('cart-total-price');

// Modal Elements
const modal = document.getElementById('product-modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const modalAddBtn = document.getElementById('modal-add-btn');

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();

    // Event Listeners
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', () => {
        closeCart();
        closeModal();
    });
    closeModalBtn.addEventListener('click', closeModal);
});

// Fetch Products from Backend
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error:', error);
        productsGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Could not load products. Please make sure the Spring Boot backend server is running on localhost:8080.</p>';
    }
}

// Render Products to Grid
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-container" onclick="openModal(${product.id})">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-brand">${product.brand}</span>
                <h3 class="product-name" onclick="openModal(${product.id})">${product.name}</h3>
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, event)">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// Cart Functionality
window.addToCart = function (productId, event) {
    if (event) event.stopPropagation();

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    openCart();
}

window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

window.updateQuantity = function (productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('perfuma_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Render Items
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:2rem;">Your bag is empty.</p>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img class="cart-item-img" src="${item.imageUrl}" alt="${item.name}">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p style="font-size:0.8rem; color:#888;">${item.brand}</p>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <input type="text" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    cartTotalPrice.textContent = '$' + total.toFixed(2);
}

// UI Toggles
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
}

window.openModal = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modal-img').src = product.imageUrl;
    document.getElementById('modal-brand').textContent = product.brand;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-desc').textContent = product.description;
    document.getElementById('modal-category-text').textContent = product.category;
    document.getElementById('modal-price').textContent = '$' + product.price.toFixed(2);

    const stockEl = document.getElementById('modal-stock');
    if (product.stockQuantity > 10) {
        stockEl.textContent = 'In Stock';
        stockEl.style.color = 'green';
    } else if (product.stockQuantity > 0) {
        stockEl.textContent = `Only ${product.stockQuantity} left`;
        stockEl.style.color = 'orange';
    } else {
        stockEl.textContent = 'Out of Stock';
        stockEl.style.color = 'red';
    }

    modalAddBtn.onclick = () => {
        addToCart(product.id, null);
        closeModal();
    };

    modal.classList.add('show');
    cartOverlay.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
    cartOverlay.classList.remove('show');
}
