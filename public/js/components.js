document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    fetch("/components/header.html")
      .then(response => response.text())
      .then(data => {
        headerContainer.innerHTML = data;
        
        // Highlight "Menú" link based on current URL if not on the SPA (index.html)
        const currentPath = window.location.pathname;
        if (currentPath.includes('menu.html')) {
          const menuLink = document.querySelector("#main-nav-links a[href*='menu.html']");
          if(menuLink) {
            menuLink.classList.add("active", "border-b-2", "border-primary", "pb-1");
            menuLink.classList.remove("text-on-surface-variant");
            menuLink.classList.add("text-primary");
          }
        }
        
        if (currentPath.includes('nosotros.html')) {
          const nosotrosLink = document.querySelector("#main-nav-links a[href*='nosotros.html']");
          if(nosotrosLink) {
            nosotrosLink.classList.add("active", "border-b-2", "border-primary", "pb-1");
            nosotrosLink.classList.remove("text-on-surface-variant");
            nosotrosLink.classList.add("text-primary");
          }
        }
        
        if (currentPath.includes('contacto.html')) {
          const contactoLink = document.querySelector("#main-nav-links a[href*='contacto.html']");
          if(contactoLink) {
            contactoLink.classList.add("active", "border-b-2", "border-primary", "pb-1");
            contactoLink.classList.remove("text-on-surface-variant");
            contactoLink.classList.add("text-primary");
          }
        }
        
        // Actualizar el ícono de perfil según el estado de autenticación
        updateHeaderProfileState();
        
        // Actualizar el badge del carrito
        updateCartBadge();
        
        // Dispatch event in case app.js needs to know header is loaded (for SPA logic)
        document.dispatchEvent(new Event('headerLoaded'));
        
      })
      .catch(error => console.error("Error loading header:", error));
  }

  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    fetch("/components/footer.html")
      .then(response => response.text())
      .then(data => {
        footerContainer.innerHTML = data;
      })
      .catch(error => console.error("Error loading footer:", error));
  }
});

/**
 * Actualiza el botón de perfil en el header según si el usuario está logueado.
 * Si está logueado, muestra sus iniciales; si no, muestra el ícono genérico.
 */
function updateHeaderProfileState() {
  const profileBtn = document.getElementById('header-profile-btn');
  if (!profileBtn) return;
  
  const token = localStorage.getItem('merakiies_token');
  const userData = localStorage.getItem('merakiies_user');
  
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      const initials = (user.first_name || '').charAt(0).toUpperCase() + (user.last_name || '').charAt(0).toUpperCase();
      
      profileBtn.innerHTML = `
        <span class="w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center font-label-md text-label-sm font-bold">${initials || 'U'}</span>
      `;
    } catch (e) {
      // Si hay error al parsear, dejar el ícono genérico
    }
  }
}

/**
 * Actualiza el badge del carrito con el número total de artículos.
 * Lee directamente de localStorage para funcionar en todas las páginas.
 */
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  try {
    const cart = JSON.parse(localStorage.getItem('merakiies_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  } catch (e) {
    badge.textContent = '0';
    badge.style.display = 'none';
  }
}
