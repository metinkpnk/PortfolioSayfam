// DOM tamamen yüklendikten sonra çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();  // Navigasyon fonksiyonunu başlatır
    initializeThemeToggle();  // Tema değiştirici fonksiyonunu başlatır
    initializeMobileMenu();  // Mobil menü fonksiyonunu başlatır
    initializeScrollEffects();  // Scroll (kaydırma) efektlerini başlatır
    initializePortfolioFilter();  // Portföy filtreleme fonksiyonunu başlatır
    initializeAnimations();  // Animasyonları başlatır
    initializeCounters();  // Sayaç animasyonlarını başlatır
    initializeContactForm();  // İletişim formunu başlatır
    initializeScrollToTop();  // Sayfayı yukarı kaydırma butonunu başlatır
    addAccessibilityFeatures();  // Erişilebilirlik özelliklerini ekler
});

// Navigasyon işlevselliği
function initializeNavigation() {
    const navbar = document.getElementById('navbar');  // Navbar (üst menü) öğesini alır
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');  // Tüm navigasyon bağlantılarını seçer

    // Sayfa kaydırıldıkça navbar arka planını değiştirir
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-gray-900/95');  // Arka plan rengini koyulaştırır
            navbar.classList.remove('bg-gray-900/80');  // İlk rengi kaldırır
        } else {
            navbar.classList.add('bg-gray-900/80');  // Başlangıç rengini geri getirir
            navbar.classList.remove('bg-gray-900/95');
        }
        updateActiveNavLink();  // Aktif bağlantıyı günceller
    });

    // Navigasyon linklerine tıklandığında yumuşak kaydırma (smooth scroll) yapılır
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();  // Varsayılan tıklama davranışını engeller
            const targetId = this.getAttribute('href');  // Tıklanan linkin hedef id'sini alır
            const targetSection = document.querySelector(targetId);  // Hedef bölümü bulur

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;  // Hedef bölümün üst kenarından 80px yukarı kaydırır
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'  // Kaydırma animasyonu ekler
                });

                closeMobileMenu();  // Mobil menü açıksa kapatır
            }
        });
    });

    // Aktif navigasyon linkini günceller
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');  // Tüm bölümleri seçer
        const scrollPosition = window.scrollY + 100;  // Scroll pozisyonunu 100px yukarı alır

        sections.forEach(section => {
            const sectionTop = section.offsetTop;  // Bölümün üst kısmının mesafesi
            const sectionHeight = section.offsetHeight;  // Bölümün yüksekliği
            const sectionId = section.getAttribute('id');  // Bölümün id'sini alır

            // Eğer scroll pozisyonu bölümün içinde ise aktif linki değiştirir
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Tüm linklerden aktif sınıfını kaldırır
                navLinks.forEach(link => {
                    link.classList.remove('text-primary-400');
                    link.classList.add('text-gray-300');
                });

                // Şu anki bölümün linkine aktif sınıfı ekler
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('text-primary-400');
                    activeLink.classList.remove('text-gray-300');
                }
            }
        });
    }
}

// Tema değiştirme fonksiyonu (Sadece koyu mod)
function initializeThemeToggle() {
    const html = document.documentElement;  // HTML elementini seçer
    const body = document.body;  // Body elementini seçer

    // Koyu modu kalıcı yapar
    html.classList.add('dark');
    body.classList.add('dark');

    // Işık modunun varsa, onu kaldırır
    html.classList.remove('light');
    body.classList.remove('light');
}

// Mobil Menü İşlevselliği
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');  // Mobil menü butonunu seçer
    const mobileMenu = document.getElementById('mobile-menu');  // Mobil menü öğesini seçer
    const hamburgerLines = mobileMenuButton?.querySelectorAll('.hamburger-line');  // Hamburger menü çizgilerini seçer

    if (mobileMenuButton && mobileMenu) {
        // Butona tıklanıldığında menüyü açar veya kapatır
        mobileMenuButton.addEventListener('click', function () {
            const isOpen = !mobileMenu.classList.contains('hidden');  // Menü açık mı kontrol eder

            if (isOpen) {
                closeMobileMenu();  // Menüyü kapatır
            } else {
                openMobileMenu();  // Menüyü açar
            }
        });
    }

    // Mobil menüyü açma fonksiyonu
    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('animate-fade-in');  // Fade-in animasyonu ekler
        document.body.style.overflow = 'hidden';  // Sayfa kaydırmayı engeller

        // Hamburger menü animasyonu
        if (hamburgerLines && hamburgerLines.length >= 3) {
            hamburgerLines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            hamburgerLines[1].style.opacity = '0';
            hamburgerLines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        }
    }

    // Menüyü kapama fonksiyonu
    window.closeMobileMenu = function () {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('animate-fade-in');
        document.body.style.overflow = '';

        // Hamburger menü çizgilerini eski haline getirir
        if (hamburgerLines && hamburgerLines.length >= 3) {
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';
        }
    };

    // Menü dışında bir yere tıklanınca menüyü kapatır
    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            window.closeMobileMenu();
        }
    });

    // Mobil menü linklerine tıklanınca menüyü kapatır
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => window.closeMobileMenu(), 300);  // Kapanma için küçük bir gecikme ekler
        });
    });

    // Escape tuşuna basılınca menüyü kapatır
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            window.closeMobileMenu();
        }
    });
}

// Scroll efektleri (Intersection Observer ile)
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,  // %10 göründüğünde animasyon başlatılır
        rootMargin: '0px 0px -50px 0px'  // Üst kısmı biraz daha yukarıda gözlemleme
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {  // Element görünür olduğunda
                entry.target.classList.add('animate-slide-up');  // Slide-up animasyonu ekler
                entry.target.style.opacity = '1';  // Opaklığı artırır
                entry.target.style.transform = 'translateY(0)';  // Y pozisyonunu sıfırlar
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, [data-count]');
    animatedElements.forEach(el => {
        observer.observe(el);  // Elementleri gözlemler
        el.style.opacity = '0';  // Başlangıçta opaklık sıfırdır
        el.style.transform = 'translateY(30px)';  // Başlangıçta 30px aşağıda başlar
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';  // Yumuşak geçiş animasyonları
    });
}
// Portfolio Filter
// Portföy filtreleme işlevi
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');  // Filtreleme butonlarını seçer
    const portfolioItems = document.querySelectorAll('.portfolio-item');  // Portföy öğelerini seçer

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');  // Tıklanan butondan filtre değerini alır

            // Aktif butonun stilini günceller
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary-600', 'text-white');
                btn.classList.add('bg-gray-800', 'text-gray-300');
            });

            this.classList.add('bg-primary-600', 'text-white');
            this.classList.remove('bg-gray-800', 'text-gray-300');

            // Portföy öğelerini filtreler
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');  // Her portföy öğesinin kategorisini alır

                // Filtreye göre portföy öğelerini gösterir veya gizler
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'block';  // Öğeyi gösterir
                    item.classList.remove('hidden');  // 'hidden' sınıfını kaldırır
                    setTimeout(() => {
                        item.style.opacity = '1';  // Opaklık 1'e çıkar (görünür hale gelir)
                        item.style.transform = 'scale(1)';  // Öğeyi normal boyuta getirir
                    }, 100);
                } else {
                    item.style.opacity = '0';  // Opaklık 0'a indirir (gizler)
                    item.style.transform = 'scale(0.8)';  // Öğeyi küçültür
                    setTimeout(() => {
                        item.style.display = 'none';  // Öğeyi gizler
                        item.classList.add('hidden');  // 'hidden' sınıfını ekler
                    }, 300);
                }
            });
        });
    });
}

// Animasyon işlevi
function initializeAnimations() {
    // Sayaç animasyonlarını gözlemlemek için IntersectionObserver kullanır
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                animateCounter(entry.target);  // Sayacı animasyonla başlatır
            }
        });
    }, { threshold: 0.5 });  // %50 görünürlükte animasyon başlatır

    // Sayaç öğelerini gözlemler
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        counterObserver.observe(counter);  // Her bir öğeyi gözlemler
    });
}

// Sayaç animasyonu
function initializeCounters() {
    window.animateCounter = function (element) {
        if (element.hasAttribute('data-animated')) return;  // Eğer animasyon yapılmışsa tekrar yapmaz

        const target = parseInt(element.getAttribute('data-count'));  // Hedef sayıyı alır
        const duration = 2000;  // Animasyon süresi (ms)
        const step = target / (duration / 16);  // Her adımda artacak miktarı hesaplar
        let current = 0;

        const timer = setInterval(function () {
            current += step;
            if (current >= target) {
                current = target;  // Hedef sayıya ulaşıldığında durur
                clearInterval(timer);  // Zamanlayıcıyı durdurur
            }
            element.textContent = Math.floor(current);  // Sayaç değerini günceller
        }, 16);  // Her 16ms'de bir adım atar

        element.setAttribute('data-animated', 'true');  // Animasyonun yapıldığını işaretler
    };
}

// İletişim formu işlevi
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');  // İletişim formunu seçer

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();  // Formun varsayılan gönderimini engeller

            const formData = new FormData(this);  // Form verilerini alır
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Temel doğrulama işlemleri
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');  // Hata bildirimi gösterir
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');  // Geçerli e-posta doğrulaması yapar
                return;
            }

            // Mailto linki oluşturur
            const mailtoLink = `mailto:contact@usama.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

            // E-posta istemcisini açar
            window.location.href = mailtoLink;

            // Başarı bildirimi gösterir
            showNotification('Email client opened! Thank you for your message.', 'success');

            // Formu sıfırlar
            this.reset();
        });
    }

    // Geçerli e-posta adresini kontrol eden fonksiyon
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // E-posta formatını kontrol eder
        return emailRegex.test(email);  // E-posta geçerli mi kontrol eder
    }

    // Bildirim gösterme fonksiyonu
    function showNotification(message, type) {
        // Mevcut bildirimleri temizler
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Yeni bir bildirim öğesi oluşturur
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform ${type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="flex items-center">
                    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
                    ${message}
                </span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // 5 saniye sonra bildirimi otomatik olarak kaldırır
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Sayfayı yukarı kaydırma butonu
function initializeScrollToTop() {
    // Scroll to top butonunu oluşturur
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollButton.className = 'fixed bottom-6 right-6 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-300 transform scale-0 z-40';
    scrollButton.id = 'scroll-to-top';
    document.body.appendChild(scrollButton);

    // Scroll pozisyonuna göre butonu gösterir veya gizler
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollButton.classList.remove('scale-0');  // Butonu görünür hale getirir
            scrollButton.classList.add('scale-100');
        } else {
            scrollButton.classList.remove('scale-100');  // Butonu gizler
            scrollButton.classList.add('scale-0');
        }
    });

    // Butona tıklanınca sayfayı en üste kaydırır
    scrollButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Yumuşak kaydırma
        });
    });
}

// Erişilebilirlik özellikleri
function addAccessibilityFeatures() {
    // Etkileşimli öğelere klavye navigasyonu ekler
    const interactiveElements = document.querySelectorAll('.portfolio-item, .service-card, .portfolio-filter');

    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');  // Öğelere tab indexi ekler

        // Enter veya Space tuşuyla öğeyi tıklanabilir hale getirir
        element.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    // Odaklanan (focus) öğelere stil ekleyip kaldıran işlev
const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
focusableElements.forEach(element => {
    element.addEventListener('focus', function () {
        this.style.outline = '2px solid #7c3aed';  // Odaklanınca dış çerçeve ekler
        this.style.outlineOffset = '2px';  // Dış çerçeveyi biraz dışarıya kaydırır
    });

    element.addEventListener('blur', function () {
        this.style.outline = 'none';  // Odak kaybolduğunda dış çerçeveyi kaldırır
    });
});

// Ana içeriğe atlamak için bir "Skip to main content" (Ana içeriğe geç) linki oluşturur
const skipLink = document.createElement('a');
skipLink.href = '#home';  // Link hedefi: sayfadaki "home" id'sine yönlendirir
skipLink.textContent = 'Skip to main content';  // Link metni
skipLink.className = 'fixed top-0 left-4 z-50 px-4 py-2 bg-primary-600 text-white rounded-b-md transform -translate-y-full focus:translate-y-0 transition-transform duration-300';

// Linke tıklanınca "home" id'sine odaklanır
skipLink.addEventListener('click', function (e) {
    e.preventDefault();  // Linkin varsayılan davranışını engeller
    document.getElementById('home').focus();  // "home" id'sine odaklanır
});

document.body.insertBefore(skipLink, document.body.firstChild);  
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);  // Fonksiyonu çalıştırır
        };
        clearTimeout(timeout);  // Önceki zamanlayıcıyı temizler
        timeout = setTimeout(later, wait);  // Yeni zamanlayıcı başlatır
    };
}

// Throttle fonksiyonu: Fonksiyonları belli bir zaman diliminde sadece bir kez çalıştırır
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);  // Fonksiyonu çalıştırır
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);  // Zamanlayıcıyı başlatır
        }
    };
}

// Performans iyileştirmeleri

const debouncedScroll = debounce(function () {
    // Kaydırma işlemlerini optimize etmek için buraya pahalı işlemler eklenebilir
}, 100);

const throttledResize = throttle(function () {
    // Pencere boyutu değiştiğinde yapılacak işlemler
    const viewportHeight = window.innerHeight;  // Görüntüleme alanı yüksekliği
    document.documentElement.style.setProperty('--vh', `${viewportHeight * 0.01}px`);  // CSS değişkenini günceller
}, 250);

// Scroll ve resize olaylarını dinler
window.addEventListener('scroll', debouncedScroll);
window.addEventListener('resize', throttledResize);

// Başlangıçta viewport yüksekliğini hesaplar
throttledResize();

// Hata işleme
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);  // Hata mesajını konsola yazdırır
});

// Sayfa yüklenmeden önce temizlik yapar
window.addEventListener('beforeunload', function () {
    // Kaynakları temizler
    document.body.style.overflow = '';  // Sayfa kaydırmayı etkinleştirir
});

// Görsellerin tembel yüklenmesi (Lazy loading)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');  // "data-src" özelliği olan img öğelerini seçer

    // IntersectionObserver ile görsellerin görünürlük durumunu gözlemler
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {  // Görsel görünürse
                    const img = entry.target;
                    img.src = img.dataset.src;  // Görselin src özelliğini yükler
                    img.classList.remove('opacity-0');  // Opaklık sıfır ise kaldırır
                    img.classList.add('opacity-100');  // Opaklık 100 yapar
                    imageObserver.unobserve(img);  // Görseli gözlemeyi durdurur
                }
            });
        });

        // Görselleri gözlemler
        images.forEach(img => {
            img.classList.add('opacity-0', 'transition-opacity', 'duration-300');  // Opaklık başlangıçta 0 yapar
            imageObserver.observe(img);  // Görseli gözlemler
        });
    } else {
        // Eski tarayıcılar için fallback (geri dönüş)
        images.forEach(img => {
            img.src = img.dataset.src;  // Görselleri doğrudan yükler
        });
    }
}

// Lazy loading işlevini başlatır, sadece "data-src" özelliğine sahip görseller için
if (document.querySelectorAll('img[data-src]').length > 0) {
    initializeLazyLoading();
}

// Dışarıdan kullanım için fonksiyonları export eder
window.PortfolioApp = {
    closeMobileMenu: window.closeMobileMenu,
    animateCounter: window.animateCounter,
    initializeAnimations,
    initializeCounters
};

// Sayfa yüklendiğinde "kepenek" öğesindeki metni harf harf gösterir
window.onload = function() {
    const kepenek = document.getElementById('kepenek');
    const text = kepenek.textContent;  // Metni alır
    kepenek.textContent = '';  // Mevcut metni siler

    let index = 0;
    const interval = setInterval(() => {
        kepenek.textContent += text[index];  // Bir harf ekler
        index++;
        if (index === text.length) {
            clearInterval(interval);  // Tüm harfler gösterildikten sonra durdurur
        }
    }, 100);  // Harfler arasındaki gecikmeyi belirler
};



