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
        
        // Dispatch event in case app.js needs to know header is loaded (for SPA logic)
        document.dispatchEvent(new Event('headerLoaded'));
        
      })
      .catch(error => console.error("Error loading header:", error));
  }
});
