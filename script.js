// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicjalizacja EmailJS
        initEmailJS();
        
        // Inicjalizacja mapy (Google Maps iframe)
        initGoogleMapsIframe();
        
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
        
        // Performance monitoring
        initPerformanceMonitoring();
        
        // Service Worker registration
        initServiceWorker();
        
        console.log('✅ Aplikacja DAGAS załadowana pomyślnie');
        
    } catch (error) {
        console.error('❌ Błąd podczas inicjalizacji aplikacji:', error);
        showToast('Wystąpił błąd podczas ładowania strony. Odśwież stronę.', 'error');
    }
    
    // Parallax effects wyłączone - tła są teraz przypięte do sekcji
    // initParallaxEffects();
});

// Inicjalizacja EmailJS
function initEmailJS() {
    try {
        // Sprawdź czy strona nie jest otwarta lokalnie
        if (location.protocol === 'file:') {
            console.log('ℹ️ EmailJS w trybie lokalnym - funkcje ograniczone');
            console.log('ℹ️ Pełna funkcjonalność EmailJS będzie dostępna po wdrożeniu');
        }
        
        // Inicjalizacja EmailJS z public key: 3qSdcdYGB_F2FxHQv
        // Ten klucz umożliwia wysyłanie emaili przez formularz kontaktowy
        if (typeof emailjs !== 'undefined') {
            emailjs.init('3qSdcdYGB_F2FxHQv');
            console.log('✅ EmailJS zainicjalizowany pomyślnie');
        } else {
            console.log('ℹ️ EmailJS nie załadowany - formularz będzie działał po wdrożeniu');
        }
        
        // Test połączenia z EmailJS (opcjonalny)
        testEmailJSConnection();
        
        return true;
    } catch (error) {
        console.error('❌ Błąd podczas inicjalizacji EmailJS:', error);
        return false;
    }
}

// Funkcja testowa dla EmailJS
function testEmailJSConnection() {
    // Dodaj przycisk testowy do console (tylko w trybie deweloperskim)
    console.log('🧪 Aby przetestować EmailJS w console, uruchom: testEmailJS()');
    
    // Funkcja globalna do testowania
    window.testEmailJS = function() {
        const testData = {
            from_name: 'Test DAGAS',
            from_email: 'test@dagas.com.pl',
            message: 'To jest wiadomość testowa z formularza kontaktowego DAGAS.',
            subject: 'Test wiadomości ze strony',
            reply_to: 'test@dagas.com.pl',
            phone: '123456789',
            service: 'transport',
            web: 'Dagas'
        };
        
        console.log('🚀 Wysyłanie testowego emaila...');
        emailjs.send('service_wvhublc', 'template_ypn9c6y', testData)
            .then(function(response) {
                console.log('✅ TEST SUCCESS!', response.status, response.text);
            })
            .catch(function(error) {
                console.error('❌ TEST FAILED...', error);
            });
    };
}

// Inicjalizacja Google Maps iframe z fallback
function initGoogleMapsIframe() {
    const iframe = document.getElementById('google-maps-iframe');
    const fallback = document.querySelector('.map-fallback');
    const mapWrapper = document.querySelector('.map-wrapper');
    
    if (!iframe || !fallback || !mapWrapper) return;
    
    // Monitor czy iframe się załadował
    let iframeLoaded = false;
    
    iframe.addEventListener('load', () => {
        iframeLoaded = true;
        mapWrapper.classList.add('loaded');
        console.log('✅ Google Maps iframe załadowany pomyślnie');
    });
    
    iframe.addEventListener('error', () => {
        console.log('❌ Błąd ładowania Google Maps iframe - pokazuję fallback');
        showMapFallback();
    });
    
    // Sprawdź po 8 sekundach czy iframe się załadował
    setTimeout(() => {
        if (!iframeLoaded) {
            console.log('⚠️ Google Maps iframe nie załadowany w czasie - pokazuję fallback');
            showMapFallback();
        }
    }, 8000);
    
    // Funkcja pokazująca fallback
    function showMapFallback() {
        if (iframe) iframe.style.display = 'none';
        if (mapWrapper) mapWrapper.classList.add('loaded'); // Usuń loading spinner
        if (fallback) {
            fallback.style.display = 'flex';
        }
    }
    
    // Intersection Observer dla lazy loading optimization
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('🗺️ Sekcja mapy w viewport');
                // Preload iframe jeśli jeszcze nie załadowany
                if (!iframeLoaded && iframe.src.includes('embed')) {
                    console.log('🚀 Aktywowanie mapy...');
                }
            }
        });
    }, { rootMargin: '100px' });
    
    const mapContainer = iframe.closest('.map-container');
    if (mapContainer) {
        mapObserver.observe(mapContainer);
    }
    
    // Dodaj event listener dla linków w fallback
    const fallbackLinks = fallback.querySelectorAll('.map-fallback-link');
    fallbackLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('📍 Użytkownik otwiera mapę zewnętrzną:', link.href);
        });
    });
}

// Nawigacja mobilna
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Click handler
        hamburger.addEventListener('click', toggleMenu);
        
        // Keyboard handler for hamburger
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        function toggleMenu() {
            const isExpanded = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Update ARIA attributes
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            // Focus management
            if (!isExpanded) {
                const firstLink = navMenu.querySelector('a');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        }
        
        // Zamknij menu po kliknięciu w link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Zamknij menu przy naciśnięciu Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.focus();
            }
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
            
            // Debugging - wypisz dane formularza
            console.log('📧 Wysyłanie emaila z danymi:', formData);
            console.log('🔧 Service ID: service_wvhublc');
            console.log('🔧 Template ID: template_ypn9c6y');
            
            // Sprawdź czy EmailJS jest dostępny
            if (typeof emailjs === 'undefined') {
                console.error('❌ EmailJS nie jest dostępny!');
                showToast('❌ Błąd konfiguracji EmailJS. Skontaktuj się telefonicznie.', 'error');
                submitButton.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                return;
            }
            
            // Wyślij email przez EmailJS
            emailjs.send('service_wvhublc', 'template_ypn9c6y', formData)
                .then(function(response) {
                    console.log('✅ SUCCESS!', response.status, response.text);
                    showToast('✅ Wiadomość została wysłana pomyślnie! Skontaktujemy się z Państwem wkrótce.', 'success');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('❌ FAILED...', error);
                    
                    // Szczegółowe informacje o błędzie
                    let errorMessage = 'Wystąpił błąd podczas wysyłania wiadomości.';
                    
                    if (error.status) {
                        console.error('Status błędu:', error.status);
                        switch (error.status) {
                            case 400:
                                errorMessage = 'Nieprawidłowe dane formularza.';
                                break;
                            case 401:
                                errorMessage = 'Błąd autoryzacji - nieprawidłowy klucz API.';
                                break;
                            case 402:
                                errorMessage = 'Limit wysyłek został przekroczony.';
                                break;
                            case 404:
                                errorMessage = 'Nie znaleziono szablonu email lub usługi.';
                                break;
                            case 429:
                                errorMessage = 'Zbyt wiele żądań - spróbuj ponownie za chwilę.';
                                break;
                            default:
                                errorMessage = `Błąd serwera (${error.status}). Spróbuj ponownie.`;
                        }
                    }
                    
                    if (error.text) {
                        console.error('Tekst błędu:', error.text);
                    }
                    
                    // Pokaż błąd z alternatywną opcją kontaktu
                    showToast(`❌ ${errorMessage}`, 'error');
                    
                    // Po 3 sekundach pokaż alternatywną opcję
                    setTimeout(() => {
                        showAlternativeContactOption(formData);
                    }, 3000);
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
    
    // Bezpieczne tworzenie elementów DOM
    const toastContent = document.createElement('div');
    toastContent.className = 'toast-content';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'toast-message';
    messageDiv.textContent = message; // Bezpieczne ustawienie tekstu
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Zamknij powiadomienie');
    closeBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;
    
    toastContent.appendChild(messageDiv);
    toastContent.appendChild(closeBtn);
    toast.appendChild(toastContent);
    
    // ARIA attributes dla accessibility
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');
    
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
    
    // Funkcja zamykania toast
    const closeToast = () => {
        toast.style.transform = 'translateY(100px) scale(0.8)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    };
    
    // Event listener dla przycisku zamknięcia
    closeButton.addEventListener('click', closeToast);
    
    // Dodaj toast do strony
    document.body.appendChild(toast);
    
    // Animacja pojawiania się
    setTimeout(() => {
        toast.style.transform = 'translateY(0) scale(1)';
        toast.style.opacity = '1';
    }, 100);
    
    // Animacja znikania po 5 sekundach
    setTimeout(() => {
        closeToast();
    }, 5000);
}

// Walidacja emaila
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Alternatywna opcja kontaktu gdy EmailJS nie działa
function showAlternativeContactOption(formData) {
    const emailBody = encodeURIComponent(
        `Imię: ${formData.from_name}\n` +
        `Email: ${formData.from_email}\n` +
        `Telefon: ${formData.phone}\n` +
        `Usługa: ${formData.service}\n\n` +
        `Wiadomość:\n${formData.message}`
    );
    
    const subject = encodeURIComponent('Zapytanie ze strony DAGAS');
    const mailtoLink = `mailto:biuro@dagas.com.pl?subject=${subject}&body=${emailBody}`;
    
    // Pokaż toast z alternatywną opcją
    showToast(`
        📧 Możesz wysłać email bezpośrednio:
        <br><br>
        <a href="${mailtoLink}" style="color: #FCD34D; text-decoration: underline;" 
           onclick="window.open(this.href); return false;">
           Otwórz program email
        </a>
        <br><br>
        lub zadzwoń: <strong>+48 123 456 789</strong>
    `, 'info');
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

// Performance monitoring
function initPerformanceMonitoring() {
    // Measurement of Core Web Vitals
    if ('performance' in window) {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('🚀 LCP:', entry.startTime);
                if (entry.startTime > 2500) {
                    console.warn('⚠️ LCP zbyt wolne:', entry.startTime + 'ms');
                }
            }
        }).observe({entryTypes: ['largest-contentful-paint']});
        
        // First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('⚡ FID:', entry.processingStart - entry.startTime);
                if (entry.processingStart - entry.startTime > 100) {
                    console.warn('⚠️ FID zbyt wolne:', (entry.processingStart - entry.startTime) + 'ms');
                }
            }
        }).observe({entryTypes: ['first-input']});
        
        // Cumulative Layout Shift
        let clsValue = 0;
        let clsEntries = [];
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = clsEntries[0];
                    const lastSessionEntry = clsEntries[clsEntries.length - 1];
                    if (clsEntries.length === 0 || entry.startTime - lastSessionEntry.startTime < 1000 && entry.startTime - firstSessionEntry.startTime < 5000) {
                        clsEntries.push(entry);
                        clsValue += entry.value;
                    } else {
                        clsEntries = [entry];
                        clsValue = entry.value;
                    }
                    console.log('📏 CLS:', clsValue);
                    if (clsValue > 0.1) {
                        console.warn('⚠️ CLS zbyt wysokie:', clsValue);
                    }
                }
            }
        }).observe({entryTypes: ['layout-shift']});
    }
    
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log('⏱️ Czas ładowania strony:', loadTime + 'ms');
        if (loadTime > 3000) {
            console.warn('⚠️ Strona ładuje się zbyt wolno');
        }
    });
}
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

// Service Worker registration
function initServiceWorker() {
    // Sprawdź czy strona jest serwowana przez HTTP/HTTPS (nie file://)
    if (location.protocol === 'file:') {
        console.log('ℹ️ Service Worker wyłączony - strona otwarta lokalnie (file://)');
        console.log('ℹ️ Service Worker będzie działał po wdrożeniu na GitHub Pages (https://)');
        return;
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('✅ Service Worker zarejestrowany:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        console.log('🔄 Dostępna nowa wersja aplikacji');
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showToast('Dostępna jest nowa wersja strony. Odśwież aby zaktualizować.', 'info');
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('❌ Błąd rejestracji Service Worker:', error);
                });
        });
    } else {
        console.log('ℹ️ Service Worker nie jest obsługiwany przez przeglądarkę');
    }
}

// Dodaj dodatkowe style do dokumentu
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
