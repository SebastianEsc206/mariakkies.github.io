const API_URL = '/api';

// ===== UI UTILITIES =====

function togglePassword(inputId, btnElement) {
    const input = document.getElementById(inputId);
    const icon = btnElement.querySelector('.material-symbols-outlined');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility_off';
    }
}
function showToast(message, type = 'success') {
    const toast = document.getElementById('mk-toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `mk-toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function switchAuthTab(tab) {
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
    
    document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';
}

function switchSection(sectionId, btnElement) {
    // Hide all sections
    document.querySelectorAll('.account-section').forEach(sec => sec.classList.remove('active'));
    // Show target section
    const target = document.getElementById(`section-${sectionId}`);
    if (target) target.classList.add('active');
    
    // Update active button state
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
}

// ===== INPUT FORMATTERS & VALIDATION =====

function formatCardNumber(input) {
    let val = input.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += val[i];
    }
    input.value = formatted;
}

function formatExpiry(input) {
    let val = input.value.replace(/\D/g, '');
    if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    input.value = val;
}

function checkPasswordStrength(password) {
    const fill = document.getElementById('strength-fill');
    if (!fill) return;
    
    let strength = 0;
    if (password.length >= 4) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    
    fill.style.width = `${strength}%`;
    if (strength <= 25) fill.style.backgroundColor = '#ba1a1a'; // error
    else if (strength <= 50) fill.style.backgroundColor = '#E68A5C'; // warning
    else if (strength <= 75) fill.style.backgroundColor = '#74593f'; // good
    else fill.style.backgroundColor = '#155724'; // excellent
}

// ===== AUTH API CALLS =====

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span> Cargando...';
        
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }
        
        // Save auth data
        localStorage.setItem('merakiies_token', data.token);
        localStorage.setItem('merakiies_user', JSON.stringify(data.user));
        
        showToast('¡Sesión iniciada correctamente!');
        setTimeout(() => window.location.reload(), 1000);
        
    } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">login</span> Iniciar Sesión';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('register-error');
    const btn = document.getElementById('register-btn');
    
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-password-confirm').value;
    
    if (password !== confirm) {
        errorDiv.textContent = 'Las contraseñas no coinciden.';
        errorDiv.style.display = 'block';
        return;
    }
    
    const formData = {
        first_name: document.getElementById('reg-first-name').value,
        last_name: document.getElementById('reg-last-name').value,
        cedula: document.getElementById('reg-cedula').value,
        email: document.getElementById('reg-email').value,
        password: password,
        phone: document.getElementById('reg-phone').value,
        address: document.getElementById('reg-address').value,
        card_type: document.getElementById('reg-card-type').value,
        card_last_four: document.getElementById('reg-card-number').value.slice(-4),
        card_holder: document.getElementById('reg-card-holder').value,
        card_expiry: document.getElementById('reg-card-expiry').value
    };
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span> Registrando...';
        
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al crear cuenta');
        }
        
        // Save auth data
        localStorage.setItem('merakiies_token', data.token);
        localStorage.setItem('merakiies_user', JSON.stringify(data.user));
        
        showToast('¡Cuenta creada exitosamente!');
        setTimeout(() => window.location.reload(), 1000);
        
    } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">how_to_reg</span> Crear Cuenta';
    }
}

function handleLogout() {
    localStorage.removeItem('merakiies_token');
    localStorage.removeItem('merakiies_user');
    window.location.href = '/index.html';
}

// ===== DASHBOARD API CALLS & RENDERING =====

async function authenticatedFetch(endpoint, options = {}) {
    const token = localStorage.getItem('merakiies_token');
    if (!token) throw new Error('No autorizado');
    
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await res.json();
    if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            handleLogout();
        }
        throw new Error(data.error || 'Error de servidor');
    }
    return data;
}

async function loadUserProfile() {
    try {
        const user = await authenticatedFetch('/user/profile');
        
        // Populate profile form
        document.getElementById('profile-first-name').value = user.first_name || '';
        document.getElementById('profile-last-name').value = user.last_name || '';
        document.getElementById('profile-email').value = user.email || '';
        document.getElementById('profile-phone').value = user.phone || '';
        document.getElementById('profile-cedula').value = user.cedula || '';
        
        // Populate address form
        document.getElementById('profile-address').value = user.address || '';
        
        // Populate payment display
        if (user.card_last_four) {
            const cardDisplay = document.getElementById('current-card-display');
            cardDisplay.style.display = 'block';
            document.getElementById('card-type-icon').textContent = user.card_type === 'credit' ? 'Crédito' : 'Débito';
            document.getElementById('card-display-number').textContent = `•••• •••• •••• ${user.card_last_four}`;
            document.getElementById('card-display-holder').textContent = user.card_holder;
            document.getElementById('card-display-expiry').textContent = user.card_expiry;
        }
        
    } catch (err) {
        console.error('Error al cargar perfil:', err);
        showToast(err.message, 'error');
    }
}

async function loadUserOrders() {
    try {
        const [orders, deliveryConfig] = await Promise.all([
            authenticatedFetch('/user/orders'),
            fetch(`${API_URL}/delivery-config`).then(res => res.json())
        ]);
        
        const container = document.getElementById('orders-container');
        document.getElementById('orders-count').textContent = `(${orders.length})`;
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-on-surface-variant bg-surface-container-low rounded-xl">
                    <span class="material-symbols-outlined text-[48px] mb-3 block opacity-50">shopping_bag</span>
                    <p class="font-body-md">Aún no has realizado ningún pedido.</p>
                    <a href="/html/menu.html" class="mk-btn-outline mt-4 inline-flex">Ver Menú</a>
                </div>
            `;
            return;
        }
        
        const statusMap = {
            'pending': { label: 'Pendiente', class: 'status-pending' },
            'confirmed': { label: 'Confirmado', class: 'status-confirmed' },
            'preparing': { label: 'Preparando', class: 'status-preparing' },
            'shipped': { label: 'En Camino', class: 'status-shipped' },
            'delivered': { label: 'Entregado', class: 'status-delivered' },
            'cancelled': { label: 'Cancelado', class: 'status-cancelled' }
        };
        
        const whatsappNumber = deliveryConfig.whatsapp_number ? deliveryConfig.whatsapp_number.replace(/\D/g, '') : '';
        
        container.innerHTML = orders.map(o => `
            <div class="order-card mb-6">
                <div class="order-header flex flex-col md:flex-row md:items-center justify-between bg-surface-container-high p-4 border-b border-outline-variant/30">
                    <div class="flex flex-wrap gap-6">
                        <div>
                            <span class="text-xs text-on-surface-variant block uppercase tracking-widest font-bold">Orden ID</span>
                            <span class="font-headline-sm font-bold text-on-background">${o.order_number}</span>
                        </div>
                        <div>
                            <span class="text-xs text-on-surface-variant block uppercase tracking-widest font-bold">Fecha</span>
                            <span class="font-body-sm text-on-background">${new Date(o.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div>
                            <span class="text-xs text-on-surface-variant block uppercase tracking-widest font-bold">Total</span>
                            <span class="font-body-sm text-on-background font-bold">$${parseFloat(o.total).toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="mt-4 md:mt-0 flex items-center gap-3">
                        <span class="status-badge ${statusMap[o.status].class}">${statusMap[o.status].label}</span>
                        ${whatsappNumber && (o.status === 'shipped' || o.status === 'preparing') ? `
                            <a href="https://wa.me/${whatsappNumber}?text=Hola,%20quisiera%20saber%20el%20estado%20de%20mi%20pedido%20${o.order_number}" target="_blank" class="flex items-center gap-1 bg-[#25D366] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#128C7E] transition-colors no-underline">
                                <span class="material-symbols-outlined text-[16px]">chat</span> Delivery
                            </a>
                        ` : ''}
                    </div>
                </div>
                <div class="p-4">
                    ${o.items.map(item => `
                        <div class="flex items-center gap-4 py-3 border-b border-outline-variant/10 last:border-0">
                            <img src="${item.image_url || '/media/placeholder.jpg'}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md bg-surface-container-low" />
                            <div class="flex-1">
                                <h4 class="font-bold text-on-background text-sm">${item.name}</h4>
                                <p class="text-xs text-on-surface-variant mt-1">Cant: ${item.quantity} | Precio: $${parseFloat(item.unit_price).toFixed(2)}</p>
                            </div>
                            <div class="font-bold text-on-background text-sm">
                                $${(item.quantity * item.unit_price).toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
    } catch (err) {
        console.error('Error al cargar pedidos:', err);
        document.getElementById('orders-container').innerHTML = '<p class="text-error">Error al cargar los pedidos.</p>';
    }
}

// ===== FORMS HANDLERS =====

async function handleUpdateProfile(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    const body = {
        first_name: document.getElementById('profile-first-name')?.value,
        last_name: document.getElementById('profile-last-name')?.value,
        phone: document.getElementById('profile-phone')?.value,
        cedula: document.getElementById('profile-cedula')?.value,
        address: document.getElementById('profile-address')?.value
    };
    
    try {
        btn.disabled = true;
        btn.innerHTML = 'Guardando...';
        
        await authenticatedFetch('/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        showToast('Perfil actualizado correctamente');
        
        // Update local storage user data partially
        const userData = JSON.parse(localStorage.getItem('merakiies_user') || '{}');
        Object.assign(userData, body);
        localStorage.setItem('merakiies_user', JSON.stringify(userData));
        
        // Update header initials if components.js function exists
        if (typeof updateHeaderProfileState === 'function') {
            updateHeaderProfileState();
        }
        
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function handleUpdatePayment(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    const body = {
        card_type: document.getElementById('pay-card-type').value,
        card_last_four: document.getElementById('pay-card-number').value.slice(-4),
        card_holder: document.getElementById('pay-card-holder').value,
        card_expiry: document.getElementById('pay-card-expiry').value
    };
    
    try {
        btn.disabled = true;
        btn.innerHTML = 'Guardando...';
        
        await authenticatedFetch('/user/payment', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        showToast('Método de pago actualizado');
        e.target.reset();
        loadUserProfile(); // Reload to show the new card
        
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    const current = document.getElementById('pw-current').value;
    const newPw = document.getElementById('pw-new').value;
    const confirm = document.getElementById('pw-confirm').value;
    
    if (newPw !== confirm) {
        showToast('La nueva contraseña y la confirmación no coinciden', 'error');
        return;
    }
    
    try {
        btn.disabled = true;
        btn.innerHTML = 'Guardando...';
        
        await authenticatedFetch('/user/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_password: current, new_password: newPw })
        });
        
        showToast('Contraseña cambiada exitosamente');
        e.target.reset();
        
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ===== ADMIN API CALLS & RENDERING =====

async function loadAdminOrders() {
    try {
        const orders = await authenticatedFetch('/admin/orders');
        const container = document.getElementById('admin-orders-container');
        document.getElementById('admin-orders-count').textContent = `(${orders.length})`;
        
        if (orders.length === 0) {
            container.innerHTML = '<p class="text-on-surface-variant">No hay pedidos registrados.</p>';
            return;
        }
        
        container.innerHTML = orders.map(o => `
            <div class="order-card mb-6">
                <div class="bg-surface-container-low p-4 border-b border-outline-variant/30 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                        <span class="font-bold text-primary mr-2">${o.order_number}</span>
                        <span class="text-sm text-on-surface-variant">${new Date(o.created_at).toLocaleString()}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <select onchange="updateOrderStatus(${o.id}, this.value)" class="mk-input !py-1 !text-sm w-auto">
                            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                            <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>Confirmado</option>
                            <option value="preparing" ${o.status === 'preparing' ? 'selected' : ''}>Preparando</option>
                            <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>En Camino</option>
                            <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Entregado</option>
                            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                </div>
                <div class="p-4 flex flex-col md:flex-row gap-6">
                    <div class="flex-1">
                        <h5 class="font-bold text-sm text-on-surface-variant uppercase mb-2">Cliente</h5>
                        <p class="text-sm"><strong>Nombre:</strong> ${o.first_name} ${o.last_name}</p>
                        <p class="text-sm"><strong>Teléfono:</strong> ${o.phone || 'N/A'}</p>
                        <p class="text-sm"><strong>Dirección:</strong> ${o.address || 'N/A'}</p>
                        ${o.notes ? `<p class="text-sm mt-2 text-primary bg-primary/10 p-2 rounded"><strong>Notas:</strong> ${o.notes}</p>` : ''}
                    </div>
                    <div class="flex-1 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
                        <h5 class="font-bold text-sm text-on-surface-variant uppercase mb-2">Artículos</h5>
                        <ul class="text-sm space-y-1 mb-3">
                            ${o.items.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('')}
                        </ul>
                        <div class="border-t border-outline-variant/20 pt-2 font-bold text-right">
                            Total: $${parseFloat(o.total).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (err) {
        document.getElementById('admin-orders-container').innerHTML = `<p class="text-error">${err.message}</p>`;
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await authenticatedFetch(`/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        showToast('Estado del pedido actualizado');
    } catch (err) {
        showToast(err.message, 'error');
        loadAdminOrders(); // Reload to revert select
    }
}

async function loadAdminMessages() {
    try {
        const messages = await authenticatedFetch('/admin/messages');
        const container = document.getElementById('admin-messages-container');
        
        if (messages.length === 0) {
            container.innerHTML = '<p class="text-on-surface-variant">No hay mensajes de contacto.</p>';
            return;
        }
        
        container.innerHTML = messages.map(m => `
            <div class="msg-card mb-4 ${m.is_read ? '' : 'unread'}">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-on-background">${m.full_name} <span class="text-sm font-normal text-on-surface-variant ml-2">${m.email}</span></h4>
                    <span class="text-xs text-on-surface-variant">${new Date(m.created_at).toLocaleString()}</span>
                </div>
                ${m.phone ? `<p class="text-xs text-on-surface-variant mb-2"><span class="material-symbols-outlined text-[14px] align-middle">phone</span> ${m.phone}</p>` : ''}
                <p class="text-sm text-on-background whitespace-pre-wrap">${m.message}</p>
                
                ${!m.is_read ? `
                    <div class="mt-3 text-right">
                        <button onclick="markMessageRead(${m.id})" class="text-xs text-primary font-bold hover:underline">Marcar como leído</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
    } catch (err) {
        document.getElementById('admin-messages-container').innerHTML = `<p class="text-error">${err.message}</p>`;
    }
}

async function markMessageRead(msgId) {
    try {
        await authenticatedFetch(`/admin/messages/${msgId}/read`, { method: 'PUT' });
        loadAdminMessages(); // Reload list
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function loadAdminDeliveryConfig() {
    try {
        const config = await authenticatedFetch('/delivery-config'); // Public endpoint is fine for reading
        document.getElementById('delivery-whatsapp').value = config.whatsapp_number || '';
        document.getElementById('delivery-name').value = config.delivery_person_name || '';
    } catch (err) {
        console.error('Error al cargar config delivery', err);
    }
}

async function handleUpdateDelivery(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    const body = {
        whatsapp_number: document.getElementById('delivery-whatsapp').value,
        delivery_person_name: document.getElementById('delivery-name').value
    };
    
    try {
        btn.disabled = true;
        btn.innerHTML = 'Guardando...';
        
        await authenticatedFetch('/admin/delivery-config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        showToast('Configuración guardada exitosamente');
        
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('merakiies_token');
    const userDataStr = localStorage.getItem('merakiies_user');
    
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    
    if (token && userDataStr) {
        // Logged In
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        
        const user = JSON.parse(userDataStr);
        
        if (user.role === 'admin') {
            document.getElementById('customer-sidebar').style.display = 'none';
            document.getElementById('admin-sidebar').style.display = 'block';
            
            // Default admin section
            switchSection('admin-orders', document.querySelector('#admin-sidebar .sidebar-item'));
            loadAdminOrders();
            loadAdminMessages();
            loadAdminDeliveryConfig();
        } else {
            document.getElementById('customer-sidebar').style.display = 'block';
            document.getElementById('admin-sidebar').style.display = 'none';
            
            // Default customer section
            switchSection('personal-info', document.querySelector('#customer-sidebar .sidebar-item'));
            loadUserProfile();
            loadUserOrders();
        }
        
    } else {
        // Not Logged In
        authSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        switchAuthTab('login');
    }
});
