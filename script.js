// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja EmailJS
    initEmailJS();
    
    // Inicjalizacja mapy
    initMap();
    
    // Nawigacja mobilna
    initMobileNavigation();
    
    // Płynne przewijanie
    initSmoothScrolling();
    
    // Formularz kontaktowy
    initContactForm();
    
    // Animacje przy przewijaniu
    initScrollAnimations();
    
    // Optymalizacja obrazów tła
    initBackgroundOptimization();
    
    // Parallax effects wyłączone - tła są teraz przypięte do sekcji
    // initParallaxEffects();
});

// Inicjalizacja EmailJS
function initEmailJS() {
    // Inicjalizacja EmailJS z public key
    emailjs.init('3qSdcdYGB_F2FxHQv');
}

// Inicjalizacja mapy Leaflet
function initMap() {
    // Współrzędne firmy Dagas w Sosnowcu
    const lat = 50.28196061508645;
    const lng = 19.16098499012522;
    
    // Tworzenie mapy
    const map = L.map('map').setView([lat, lng], 15);
    
    // Dodanie warstwy OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Niestandardowa ikona dla markera
    const customIcon = L.divIcon({
        html: `
            <div style="
                background: #FCD34D;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                border: 3px solid #1E40AF;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    color: #1E40AF;
                    font-weight: bold;
                    font-size: 12px;
                    transform: rotate(45deg);
                ">D</div>
            </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
    
    // Dodanie markera
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    // Popup z informacjami
    marker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
            <strong style="color: #1E40AF; font-size: 16px;">DAGAS</strong><br>
            <span style="color: #666;">Transport paliwa i usługi logistyczne</span><br>
            <span style="color: #F59E0B; font-weight: bold;">ul. Kukułek 41, Sosnowiec</span><br>
            <small style="color: #888;">
                ${lat.toFixed(6)}, ${lng.toFixed(6)}
            </small>
        </div>
    `).openPopup();
    
    // Dodanie okręgu pokazującego obszar działania
    L.circle([lat, lng], {
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.1,
        radius: 2000
    }).addTo(map);
}

// Nawigacja mobilna
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Zamknij menu po kliknięciu w link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Płynne przewijanie do sekcji
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Obsługa formularza kontaktowego
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Pobierz elementy formularza
            const submitButton = this.querySelector('button[type="submit"]');
            const btnText = document.getElementById('btn-text');
            const btnLoading = document.getElementById('btn-loading');
            
            // Zbieranie danych z formularza
            const formData = {
                from_name: this.querySelector('input[name="from_name"]').value,
                from_email: this.querySelector('input[name="from_email"]').value,
                message: this.querySelector('textarea[name="message"]').value,
                subject: 'Wiadomość ze strony',
                reply_to: this.querySelector('input[name="from_email"]').value,
                phone: this.querySelector('input[name="phone"]').value,
                service: this.querySelector('select[name="service"]').value,
                web: 'Dagas'
            };
            
            // Walidacja
            if (!formData.from_name || !formData.from_email || !formData.message) {
                showToast('Proszę wypełnić wszystkie wymagane pola', 'error');
                return;
            }
            
            if (!isValidEmail(formData.from_email)) {
                showToast('Proszę podać prawidłowy adres email', 'error');
                return;
            }
            
            // Wyłącz przycisk i pokaż loading
            submitButton.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            // Wyślij email przez EmailJS
            emailjs.send('service_wvhublc', 'template_ypn9c6y', formData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showToast('✅ Wiadomość została wysłana pomyślnie! Skontaktujemy się z Państwem wkrótce.', 'success');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    showToast('❌ Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie lub skontaktuj się telefonicznie.', 'error');
                })
                .finally(function() {
                    // Przywróć przycisk
                    submitButton.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                });
        });
    }
}

// System toast notifications - eleganckie dymki pojawiające się pod formularzem
function showToast(message, type = 'info') {
    // Usuń istniejące toasty
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Znajdź formularz kontaktowy jako punkt odniesienia
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Utwórz toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    // Style dla toast notification
    const styles = {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        maxWidth: '400px',
        minWidth: '300px',
        padding: '0',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.1)',
        zIndex: '10000',
        transform: 'translateY(100px) scale(0.8)',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        background: type === 'success' ? 'linear-gradient(135deg, #10B981, #059669)' : 
                   type === 'error' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 
                   'linear-gradient(135deg, #3B82F6, #2563EB)',
        border: 'none',
        overflow: 'hidden'
    };
    
    Object.assign(toast.style, styles);
    
    // Style dla zawartości
    const content = toast.querySelector('.toast-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        color: white;
        gap: 15px;
    `;
    
    const messageElement = toast.querySelector('.toast-message');
    messageElement.style.cssText = `
        flex: 1;
        font-size: 15px;
        font-weight: 500;
        line-height: 1.4;
    `;
    
    const closeButton = toast.querySelector('.toast-close');
    closeButton.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        transition: all 0.2s ease;
        flex-shrink: 0;
    `;
    
    // Hover effect dla przycisku zamknięcia
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = 'rgba(255, 255, 255, 0.3)';
        closeButton.style.transform = 'scale(1.1)';
    });
    
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
        closeButton.style.transform = 'scale(1)';
    });
    
    // Dodaj toast do strony
    document.body.appendChild(toast);
    
    // Animacja pojawiania się
    setTimeout(() => {
        toast.style.transform = 'translateY(0) scale(1)';
        toast.style.opacity = '1';
    }, 100);
    
    // Animacja znikania po 5 sekundach
    setTimeout(() => {
        toast.style.transform = 'translateY(100px) scale(0.8)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }, 5000);
    
    // Dodaj efekt kliknięcia dla zamknięcia
    closeButton.addEventListener('click', () => {
        toast.style.transform = 'translateY(100px) scale(0.8)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    });
}

// Walidacja emaila
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Animacje przy przewijaniu
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Obserwuj elementy do animacji
    const animatedElements = document.querySelectorAll('.service-card, .feature, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Aktywna nawigacja przy przewijaniu
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Optymalizacja obrazów tła dla lepszej wydajności
function initBackgroundOptimization() {
    // Preload background images for better performance - zdjęcie1 dla Hero i zdjęcie3 dla About
    const backgroundImages = [
        'zdjecia/zdjecie1.jpg',
        'zdjecia/zdjecie3.jpg'
    ];
    
    backgroundImages.forEach(imageSrc => {
        const img = new Image();
        img.src = imageSrc;
    });
    
    // Optimize background images loading - dla sekcji hero i about
    const sections = document.querySelectorAll('.hero, .about');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, { rootMargin: '50px' });
    
    sections.forEach(section => {
        imageObserver.observe(section);
    });
}

// Efekty parallax (tylko na desktop)
function initParallaxEffects() {
    if (window.innerWidth <= 768) return; // Skip on mobile for performance
    
    const parallaxElements = document.querySelectorAll('.services, .about, .location, .contact');
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = 0.5; // Parallax speed
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = -(scrollTop * speed);
                element.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    }
    
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
            setTimeout(() => { ticking = false; }, 10);
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Dodatkowe style CSS dla aktywnej nawigacji i powiadomień
const additionalStyles = `
    .nav-menu a.active {
        color: #FF6B35 !important;
    }
    
    .nav-menu a.active::after {
        width: 100% !important;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: #1E3A8A;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 20px 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 15px 0;
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }
    }
`;

// Dodaj dodatkowe style do dokumentu
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
