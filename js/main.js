// State Management
let cart = [];
let currentCategory = 'all';
let searchQuery = '';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const noResults = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');
const categoryTabs = document.getElementById('category-tabs');

const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartEmptyState = document.getElementById('cart-empty');
const cartBadge = document.getElementById('cart-badge');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const cartCountHeader = document.getElementById('cart-count-header');
const freeShippingBar = document.getElementById('free-shipping-bar');
const freeShippingText = document.getElementById('free-shipping-text');

// Initialize Store App
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
});

// Render Products Grid
function renderProducts() {
    const filtered = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        productsGrid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    productsGrid.innerHTML = filtered.map(product => `
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div class="relative overflow-hidden bg-gray-100">
                <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 font-bold text-xs px-3 py-1 rounded-full border border-white/50 shadow-sm">
                    ${product.badge}
                </span>
                <span class="absolute top-3 right-3 bg-emerald-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
                    ${product.energy}
                </span>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center gap-1 text-amber-500 text-xs font-bold mb-2">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                        <span>${product.rating}</span>
                        <span class="text-gray-400">(${product.reviews})</span>
                    </div>

                    <h3 class="font-bold text-gray-900 text-base group-hover:text-brand-600 transition-colors line-clamp-2">
                        ${product.name}
                    </h3>

                    <ul class="mt-3 space-y-1">
                        ${product.specs.map(spec => `
                            <li class="text-xs text-gray-500 flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                                ${spec}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span class="text-xs text-gray-400 block">Price</span>
                        <span class="text-xl font-extrabold text-gray-900">$${product.price.toLocaleString()}</span>
                    </div>

                    <button onclick="addToCart('${product.id}')" class="px-4 py-2.5 bg-gray-900 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center gap-2 active:scale-95 shadow-md">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

// Event Listeners Setup
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });

    // Category Filter Buttons
    categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('bg-brand-600', 'text-white', 'shadow-md', 'shadow-brand-500/20');
            b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
        });

        btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');
        btn.classList.add('bg-brand-600', 'text-white', 'shadow-md', 'shadow-brand-500/20');

        currentCategory = btn.dataset.category;
        renderProducts();
    });

    // Cart Toggle
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

// Side Cart Controls
function openCart() {
    cartDrawer.classList.remove('translate-x-full');
    cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
}

function closeCart() {
    cartDrawer.classList.add('translate-x-full');
    cartOverlay.classList.add('opacity-0', 'pointer-events-none');
}

// Cart Actions
function addToCart(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    openCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
}

// Cart UI Sync
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Badge & Header Count
    cartBadge.textContent = totalItems;
    cartCountHeader.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;

    if (totalItems > 0) {
        cartBadge.classList.remove('opacity-0', 'scale-0');
        cartEmptyState.classList.add('hidden');
        cartItemsContainer.classList.remove('hidden');
    } else {
        cartBadge.classList.add('opacity-0', 'scale-0');
        cartEmptyState.classList.remove('hidden');
        cartItemsContainer.classList.add('hidden');
    }

    // Render Items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 items-center justify-between">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
            <div class="flex-1 min-w-0">
                <h4 class="text-xs font-bold text-gray-900 truncate">${item.name}</h4>
                <p class="text-xs text-gray-500 font-semibold mt-0.5">$${item.price.toLocaleString()}</p>
                
                <div class="flex items-center gap-2 mt-2">
                    <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-xs font-bold hover:bg-gray-100">-</button>
                    <span class="text-xs font-bold text-gray-800">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-xs font-bold hover:bg-gray-100">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 transition-colors p-1">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `).join('');

    // Update Totals
    cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;
    cartTotal.textContent = `$${subtotal.toLocaleString()}`;

    // Free Shipping Progress (Threshold: $1500)
    const shippingThreshold = 1500;
    const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);
    freeShippingBar.style.width = `${progressPercent}%`;

    if (subtotal >= shippingThreshold) {
        freeShippingText.innerHTML = `🎉 You've unlocked <span class="font-bold">Free Express Delivery!</span>`;
    } else {
        const remaining = shippingThreshold - subtotal;
        freeShippingText.innerHTML = `Add <span class="font-bold">$${remaining.toLocaleString()}</span> more to qualify for <span class="font-bold">Free Express Delivery</span>`;
    }

    lucide.createIcons();
}