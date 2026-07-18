const API_URL = '/api'; // Mantenemos la API solo para el catálogo de productos

let dbProducts = [];
let cart = JSON.parse(localStorage.getItem('merakiies_cart')) || []; 

const views = document.querySelectorAll('.view');
const catalogGrid = document.getElementById('catalog-grid');
const searchGrid = document.getElementById('search-grid');
const categoryFilter = document.getElementById('category-filter');
const priceSort = document.getElementById('price-sort');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const searchStatusText = document.getElementById('search-status-text');
const carouselTrack = document.getElementById('carousel-track');

function navigateTo(targetId) {
    views.forEach(view => view.classList.remove('active'));
    const targetView = document.getElementById(targetId);
    if(targetView) targetView.classList.add('active');
    
    document.querySelectorAll('.nav-links .nav-link, .nav-links .nav-btn').forEach(btn => {
        btn.classList.remove('active', 'border-b-2', 'border-primary', 'pb-1');
        btn.classList.add('text-on-surface-variant');
        btn.classList.remove('text-primary');

        if(btn.dataset.target === targetId) {
            btn.classList.add('active', 'border-b-2', 'border-primary', 'pb-1');
            btn.classList.remove('text-on-surface-variant');
            btn.classList.add('text-primary');
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-btn');
    if (btn) {
        const target = btn.dataset.target;
        // Only prevent default and do SPA routing if we are on index.html and have a target
        const currentPath = window.location.pathname;
        if(target && (currentPath === '/' || currentPath.endsWith('index.html'))) {
            e.preventDefault();
            window.history.pushState(null, '', `#${target}`);
            navigateTo(target);
        }
    }
});

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        dbProducts = await response.json(); 
        renderProducts(dbProducts, catalogGrid);
        initCarousel();
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

function saveCart() {
    localStorage.setItem('merakiies_cart', JSON.stringify(cart));
    updateCartUI();
}

window.addToCart = function(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const qty = parseInt(qtyInput.value) || 1;
    
    const product = dbProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.product_id === productId);
    
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({
            product_id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image_url: product.image_url,
            quantity: qty
        });
    }

    saveCart();
    qtyInput.value = 1;
    alert('¡Producto agregado al carrito exitosamente!'); 
};

window.updateQuantity = function(productId, newQty) {
    if (newQty < 1) return;
    
    const item = cart.find(item => item.product_id === productId);
    if (item) {
        item.quantity = parseInt(newQty);
        saveCart();
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    saveCart();
};

document.getElementById('btn-clear-cart').addEventListener('click', () => {
    cart = [];
    saveCart();
});

function createProductCard(product) {
    return `
        <article class="product-card">
            <img src="${product.image_url}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <span class="product-tag">${product.category_name || product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                <div class="product-actions">
                    <input type="number" min="1" value="1" class="qty-input" id="qty-${product.id}">
                    <button class="btn-primary" onclick="addToCart(${product.id})">Agregar</button>
                </div>
            </div>
        </article>
    `;
}

function renderProducts(productsArray, container) {
    container.innerHTML = productsArray.map(createProductCard).join('');
}

function applyFilters() {
    let filtered = [...dbProducts];
    const category = categoryFilter.value;
    const sort = priceSort.value;

    if (category !== 'all') {
        filtered = filtered.filter(p => (p.category_name || p.category) === category);
    }

    if (sort === 'asc') {
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sort === 'desc') {
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    renderProducts(filtered, catalogGrid);
}

categoryFilter.addEventListener('change', applyFilters);
priceSort.addEventListener('change', applyFilters);

// Carrusel
let currentIndex = 0;

function initCarousel() {
    if(dbProducts.length === 0) return;
    
    const carouselItems = dbProducts.slice(0, 8);
    
    carouselTrack.innerHTML = carouselItems.map(p => `
        <div class="carousel-item" onclick="navigateTo('catalog')" style="cursor: pointer;">
            <img src="${p.image_url}" alt="${p.name}">
        </div>
    `).join('');

    startAutoPlay();
}

function startAutoPlay() {
    setInterval(() => {
        const items = document.querySelectorAll('.carousel-item');
        if(!items.length) return;
        
        if (currentIndex < items.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        
        const item = document.querySelector('.carousel-item');
        const itemWidth = item.offsetWidth;
        const gap = 16;
        
        carouselTrack.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
    }, 3000); 
}

document.getElementById('carousel-next').addEventListener('click', () => {
    const items = document.querySelectorAll('.carousel-item');
    if (currentIndex < items.length - 1) {
        currentIndex++;
        updateCarouselPosition();
    }
});

document.getElementById('carousel-prev').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarouselPosition();
    }
});

function updateCarouselPosition() {
    const item = document.querySelector('.carousel-item');
    if(!item) return;
    const itemWidth = item.offsetWidth;
    const gap = 16;
    carouselTrack.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
}

// Búsqueda
function executeSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (query === '') {
        searchStatusText.textContent = "Ingresa un término para comenzar la búsqueda.";
        searchGrid.innerHTML = "";
        return;
    }

    const results = dbProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
    );

    if (results.length > 0) {
        searchStatusText.textContent = `Resultados para: "${query}" (${results.length})`;
        renderProducts(results, searchGrid);
    } else {
        searchStatusText.textContent = `No se encontraron resultados para "${query}".`;
        searchGrid.innerHTML = "";
    }
}

btnSearch.addEventListener('click', executeSearch);
searchInput.addEventListener('input', executeSearch);

// Interfaz del carrito
function updateCartUI() {
    const emptyMsg = document.getElementById('empty-cart-message');
    const cartContent = document.getElementById('cart-content');
    const itemsContainer = document.getElementById('cart-items-container');
    const cartBadge = document.getElementById('cart-badge');
    
    if (!cart) cart = [];
    
    const totalItems = cart.reduce((sum, item) => sum + parseInt(item.quantity), 0);
    if (cartBadge) cartBadge.textContent = totalItems;

    if (cart.length === 0) {
        emptyMsg.classList.remove('app-hidden');
        cartContent.classList.add('app-hidden');
    } else {
        emptyMsg.classList.add('app-hidden');
        cartContent.classList.remove('app-hidden');
        
        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} c/u</div>
                </div>
                <div class="cart-item-actions">
                    <input type="number" min="1" value="${item.quantity}" class="qty-input" 
                           onchange="updateQuantity(${item.product_id}, this.value)">
                    <div class="item-subtotal"><strong>$${(item.price * item.quantity).toFixed(2)}</strong></div>
                    <button class="btn-remove" onclick="removeFromCart(${item.product_id})">Eliminar</button>
                </div>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.10;
        const total = subtotal + tax;

        document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
    }
}

document.getElementById('btn-checkout').addEventListener('click', () => {
    if (cart.length > 0) {
        alert("Procesando tu pedido. Tu total es: " + document.getElementById('summary-total').textContent);
        document.getElementById('btn-clear-cart').click();
        navigateTo('home');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();
    
    // Parse URL hash on load (if arriving from menu.html)
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        setTimeout(() => navigateTo(hash), 100);
    }
});

document.addEventListener('headerLoaded', () => {
    updateCartUI();
});