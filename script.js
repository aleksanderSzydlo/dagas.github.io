// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
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
});

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
                background: #FF6B35;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                border: 3px solid #1E3A8A;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    color: white;
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
            <strong style="color: #1E3A8A; font-size: 16px;">DAGAS</strong><br>
            <span style="color: #666;">Transport paliwa i usługi logistyczne</span><br>
            <span style="color: #FF6B35; font-weight: bold;">Sosnowiec</span><br>
            <small style="color: #888;">
                ${lat.toFixed(6)}, ${lng.toFixed(6)}
            </small>
        </div>
    `).openPopup();
    
    // Dodanie okręgu pokazującego obszar działania
    L.circle([lat, lng], {
        color: '#FF6B35',
        fillColor: '#FF6B35',
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
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Zbieranie danych z formularza
            const formData = new FormData(this);
            const data = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                phone: this.querySelector('input[type="tel"]').value,
                service: this.querySelector('select').value,
                message: this.querySelector('textarea').value
            };
            
            // Walidacja
            if (!data.name || !data.email || !data.message) {
                showNotification('Proszę wypełnić wszystkie wymagane pola', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Proszę podać prawidłowy adres email', 'error');
                return;
            }
            
            // Symulacja wysyłania (w rzeczywistości potrzebny backend)
            showNotification('Wiadomość została wysłana! Skontaktujemy się z Państwem wkrótce.', 'success');
            this.reset();
        });
    }
}

// Walidacja emaila
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// System powiadomień
function showNotification(message, type = 'info') {
    // Usuń istniejące powiadomienia
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Utwórz nowe powiadomienie
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Style dla powiadomienia
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        max-width: 400px;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        font-weight: 500;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    document.body.appendChild(notification);
    
    // Animacja pojawiania się
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Zamknij powiadomienie
    const closeNotification = () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeNotification);
    
    // Auto-zamknięcie po 5 sekundach
    setTimeout(closeNotification, 5000);
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
