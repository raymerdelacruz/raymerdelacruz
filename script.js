// Animación de despliegue progresivo al hacer Scroll (Reveal on Scroll)
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100; // Sensibilidad del despliegue

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Ejecutar al cargar la página y al hacer scroll
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
