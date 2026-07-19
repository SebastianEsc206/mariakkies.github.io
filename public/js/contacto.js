// Utilidad de Toast (si no está definida globalmente)
function showToast(message, type = 'success') {
    const toast = document.getElementById('mk-toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `mk-toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const btnSubmit = document.getElementById('btn-submit-contact');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!fullName || !email || !message) {
                showToast('Por favor completa todos los campos requeridos', 'error');
                return;
            }

            // Deshabilitar botón
            const originalBtnText = btnSubmit.textContent;
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Enviando...';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        full_name: fullName,
                        email: email,
                        phone: phone,
                        message: message
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('Mensaje enviado exitosamente. ¡Nos contactaremos pronto!');
                    form.reset();
                } else {
                    showToast(data.error || 'Error al enviar el mensaje', 'error');
                }
            } catch (err) {
                console.error('Error al enviar formulario:', err);
                showToast('Error de conexión. Intenta nuevamente.', 'error');
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = originalBtnText;
            }
        });
    }
});
