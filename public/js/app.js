const API_URL = '/api'; // Mantenemos la API solo para el catálogo de productos

let dbProducts = [];
let cart = JSON.parse(localStorage.getItem('merakiies_cart')) || []; 

const views = document.querySelectorAll('.view');
const catalogGrid = document.getElementById('catalog-grid');
const searchGrid = document.getElementById('search-grid');
let currentCategory = 'all'; // State variable for category buttons
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
        if (catalogGrid) renderProducts(dbProducts, catalogGrid);
        if (carouselTrack) initCarousel();
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        
        const container = document.getElementById('category-buttons-container');
        if (container) {
            // Keep the "Todo el Menú" button, append the rest
            const allBtn = `
                <button class="category-btn whitespace-nowrap px-6 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md shadow-md transition-all active:scale-95" data-category="all">
                    Todo el Menú
                </button>
            `;
            const otherBtns = categories.map(c => `
                <button class="category-btn whitespace-nowrap px-6 py-2 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-label-md hover:bg-secondary-fixed transition-all" data-category="${c.name}">
                    ${c.name}
                </button>
            `).join('');
            container.innerHTML = allBtn + otherBtns;

            // Re-bind click events for dynamic buttons
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Reset all styles
                    document.querySelectorAll('.category-btn').forEach(b => {
                        b.classList.remove("bg-primary", "text-on-primary", "shadow-md");
                        b.classList.add("bg-secondary-container", "text-on-secondary-container");
                    });
                    // Apply active styles to clicked
                    btn.classList.add("bg-primary", "text-on-primary", "shadow-md");
                    btn.classList.remove("bg-secondary-container", "text-on-secondary-container");

                    currentCategory = btn.dataset.category || 'all';
                    applyFilters();
                });
            });
        }
    } catch (error) {
        console.error('Error al obtener categorías:', error);
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

const btnClearCart = document.getElementById('btn-clear-cart');
if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
        cart = [];
        saveCart();
    });
}

function createProductCard(product) {
    const badgeHtml = product.badge ? `<div class="absolute top-4 left-4 z-10"><span class="bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full shadow-sm">${product.badge}</span></div>` : '';
    return `
        <div class="group bg-surface-bright p-base rounded-cookie product-card-shadow transition-all duration-500 overflow-hidden relative opacity-100 translate-y-0 flex flex-col h-[420px]">
            ${badgeHtml}
            <div class="relative w-full aspect-square mb-4 rounded-[1.5rem] overflow-hidden hover-reveal">
              <img class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" alt="${product.name}" src="${product.image_url}" />
              <img class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0" alt="${product.name} hover" src="${product.image_url}" />
            </div>
            <div class="px-3 pb-4 flex flex-col h-full">
              <h3 class="font-headline-md text-headline-md text-on-background mb-1">${product.name}</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">${product.description}</p>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-on-primary-fixed-variant font-bold text-headline-md">$${parseFloat(product.price).toFixed(2)}</span>
                <div class="flex items-center gap-2">
                  <input type="number" min="1" value="1" id="qty-${product.id}" class="w-14 h-12 text-center bg-surface-container-low border-2 border-outline-variant/20 rounded-full font-label-md text-on-surface-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                  <button onclick="addToCart(${product.id})" class="bg-primary-container text-on-primary w-12 h-12 rounded-full flex items-center justify-center hover:rotate-90 transition-transform">
                    <span class="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>
        </div>
    `;
}

function renderProducts(productsArray, container) {
    container.innerHTML = productsArray.map(createProductCard).join('');
}

function applyFilters() {
    if (!catalogGrid) return;
    
    let filtered = [...dbProducts];
    const category = currentCategory;
    const sort = priceSort ? priceSort.value : 'Más vendidos';

    if (category !== 'all') {
        filtered = filtered.filter(p => (p.category_name || p.category) === category);
    }

    if (sort === 'Precio: Menor a Mayor' || sort === 'asc') {
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sort === 'Precio: Mayor a Menor' || sort === 'desc') {
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sort === 'Más vendidos') {
        filtered.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
    } else if (sort === 'Nuevos ingresos') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    renderProducts(filtered, catalogGrid);
}

// Category logic is now handled in fetchCategories()
if (priceSort) priceSort.addEventListener('change', applyFilters);

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

const nextBtn = document.getElementById('carousel-next');
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const items = document.querySelectorAll('.carousel-item');
        if (currentIndex < items.length - 1) {
            currentIndex++;
            updateCarouselPosition();
        }
    });
}

const prevBtn = document.getElementById('carousel-prev');
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarouselPosition();
        }
    });
}

function updateCarouselPosition() {
    const item = document.querySelector('.carousel-item');
    if(!item) return;
    const itemWidth = item.offsetWidth;
    const gap = 16;
    carouselTrack.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
}

// Búsqueda
function executeSearch() {
    if (!searchInput || !searchGrid) return;
    const query = searchInput.value.toLowerCase().trim();
    if (query === '') {
        if(searchStatusText) searchStatusText.textContent = "";
        searchGrid.innerHTML = "";
        return;
    }

    const results = dbProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
    );

    if (results.length > 0) {
        if(searchStatusText) searchStatusText.textContent = `Resultados para: "${query}" (${results.length})`;
        renderProducts(results, searchGrid);
    } else {
        if(searchStatusText) searchStatusText.textContent = `No se encontraron resultados para "${query}".`;
        searchGrid.innerHTML = "";
    }
}

if(btnSearch) btnSearch.addEventListener('click', executeSearch);
if(searchInput) searchInput.addEventListener('input', executeSearch);

// Update general UI and side cart
function updateCartUI() {
    const emptyMsg = document.getElementById('empty-cart-message');
    const cartContent = document.getElementById('cart-content');
    const itemsContainer = document.getElementById('cart-items-container');
    const cartBadge = document.getElementById('cart-badge');
    
    // Fix for all pages
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    } else if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }

    // Optional Side Cart (only if it exists on the page)
    if (itemsContainer) {
        if (cart.length === 0) {
            if (emptyMsg) emptyMsg.classList.remove('app-hidden');
            if (cartContent) cartContent.classList.add('app-hidden');
        } else {
            if (emptyMsg) emptyMsg.classList.add('app-hidden');
            if (cartContent) cartContent.classList.remove('app-hidden');
            
            itemsContainer.innerHTML = cart.map(item => `
                <div class="flex items-center gap-4 py-2 border-b border-outline-variant/20">
                    <img src="${item.image_url}" class="w-12 h-12 object-cover rounded-md" alt="${item.name}">
                    <div class="flex-1">
                        <h4 class="font-bold text-on-surface text-sm">${item.name}</h4>
                        <div class="text-on-surface-variant text-sm">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <button class="text-error hover:text-error/80" onclick="removeFromCart(${item.product_id})">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const summaryTotal = document.getElementById('summary-total');
            if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Render for the dedicated Cart Page
    renderCartPage();
}

function renderCartPage() {
    const pageItems = document.getElementById('cart-page-items');
    const pageSubtotal = document.getElementById('cart-page-subtotal');
    const pageTotal = document.getElementById('cart-page-total');

    if (!pageItems) return; // Not on carrito.html

    if (cart.length === 0) {
        pageItems.innerHTML = `<p class="text-on-surface-variant py-8">Tu carrito está vacío.</p>`;
        if (pageSubtotal) pageSubtotal.textContent = `$0.00`;
        if (pageTotal) pageTotal.textContent = `$0.00`;
        return;
    }

    pageItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `
            <div class="flex items-center gap-4 py-6 border-b border-outline-variant/30 relative">
                <!-- X Button -->
                <button onclick="removeFromCart(${item.product_id})" class="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 text-outline hover:text-error transition-colors hidden md:block">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
                
                <!-- Image -->
                <img src="${item.image_url}" alt="${item.name}" class="w-20 h-20 object-cover bg-surface-container-low" />
                
                <!-- Details -->
                <div class="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 ml-4 md:ml-0">
                    
                    <div class="flex-1">
                        <h4 class="font-headline-sm text-headline-sm text-on-background">${item.name}</h4>
                        <p class="text-label-sm text-on-surface-variant mt-1">Merakiies Item</p>
                    </div>

                    <!-- Price Options (Mocked as text for this design) -->
                    <div class="flex items-center gap-2 text-label-md text-on-background min-w-[120px]">
                        <span class="material-symbols-outlined text-[16px] text-primary">radio_button_checked</span>
                        $${item.price.toFixed(2)}
                    </div>

                    <!-- Quantity Control -->
                    <div class="flex items-center gap-4">
                        <div class="flex items-center">
                            <button onclick="updateQuantity(${item.product_id}, ${item.quantity - 1})" class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30 rounded-full">
                                <span class="material-symbols-outlined text-[14px]">remove</span>
                            </button>
                            <span class="w-8 text-center font-bold text-label-md">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.product_id}, ${item.quantity + 1})" class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30 rounded-full">
                                <span class="material-symbols-outlined text-[14px]">add</span>
                            </button>
                        </div>
                    </div>

                    <!-- Item Total -->
                    <div class="font-bold text-headline-sm text-on-background min-w-[80px] text-right">
                        $${itemTotal.toFixed(2)}
                    </div>
                </div>

                <!-- Mobile X Button (top right) -->
                <button onclick="removeFromCart(${item.product_id})" class="absolute right-0 top-2 text-outline hover:text-error transition-colors md:hidden">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>
        `;
    }).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (pageSubtotal) pageSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (pageTotal) pageTotal.textContent = `$${subtotal.toFixed(2)}`;
}

async function processCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    
    const token = localStorage.getItem('merakiies_token');
    if (!token) {
        alert("Debes iniciar sesión para procesar tu compra.");
        window.location.href = '/html/miCuenta.html';
        return;
    }
    
    try {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery_fee = 0; // Se asume envío gratis o calculable luego
        const total = subtotal + delivery_fee;
        
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                subtotal: subtotal,
                delivery_fee: delivery_fee,
                total: total,
                notes: "Orden creada desde la web",
                items: cart.map(i => ({
                    product_id: i.product_id,
                    quantity: i.quantity,
                    price: i.price
                }))
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert("¡Tu orden ha sido creada exitosamente! Puedes verla en 'Mi Cuenta'.");
            cart = [];
            saveCart();
            window.location.href = '/html/miCuenta.html';
        } else {
            alert("Error al procesar la orden: " + (data.error || "Intenta nuevamente."));
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('merakiies_token');
                window.location.href = '/html/miCuenta.html';
            }
        }
    } catch (error) {
        console.error("Error procesando checkout:", error);
        alert("Error de conexión. Intenta nuevamente.");
    }
}

const btnCheckout = document.getElementById('btn-checkout');
if (btnCheckout) {
    btnCheckout.addEventListener('click', processCheckout);
}

const btnCartCheckout = document.getElementById('btn-cart-checkout');
if (btnCartCheckout) {
    btnCartCheckout.addEventListener('click', processCheckout);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
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

// Lógica de Suscripción Newsletter
const newsletterBtn = document.getElementById('newsletter-btn');
const newsletterEmail = document.getElementById('newsletter-email');

if (newsletterBtn && newsletterEmail) {
    newsletterBtn.addEventListener('click', async () => {
        const email = newsletterEmail.value.trim();
        
        // Validación básica de email en frontend
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            alert('Por favor, ingresa tu correo electrónico.');
            return;
        }
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }
        
        try {
            newsletterBtn.disabled = true;
            newsletterBtn.textContent = 'Enviando...';
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: 'Suscripción Newsletter',
                    email: email,
                    message: 'Nuevo usuario suscrito al Club de la Galleta.'
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('¡Gracias por unirte al Club de la Galleta!');
                newsletterEmail.value = '';
            } else {
                alert('Hubo un problema: ' + (data.error || 'Intenta nuevamente.'));
            }
        } catch (error) {
            console.error('Error enviando suscripción:', error);
            alert('Error de red. Por favor, revisa tu conexión e intenta de nuevo.');
        } finally {
            newsletterBtn.disabled = false;
            newsletterBtn.textContent = 'Quiero Unirme';
        }
    });
}