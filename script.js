// Modern JavaScript - Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeLanguageToggle(); // Dil değiştirici sistemi
    loadGitHubProjects(); // GitHub projelerini yükle (arama ve filtreleme dahil)
    initializeAdvancedFormValidation(); // Gelişmiş form validasyonu
    initializeScrollEffects();
    initializeParticles(); // Parçacık sistemini başlat
});

// Navigasyon işlevselliği
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    // Sayfa kaydırıldıkça navbar arka planını değiştirir
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-gray-900/95');
            navbar.classList.remove('bg-gray-900/80');
        } else {
            navbar.classList.add('bg-gray-900/80');
            navbar.classList.remove('bg-gray-900/95');
        }
        updateActiveNavLink();
    });

    // Navigasyon linklerine tıklandığında yumuşak kaydırma
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                closeMobileMenu();
            }
        });
    });

    // Aktif navigasyon linkini günceller
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-primary-400');
                    link.classList.add('text-gray-300');
                });

                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('text-primary-400');
                    activeLink.classList.remove('text-gray-300');
                }
            }
        });
    }
}

// Mobil Menü İşlevselliği
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerLines = mobileMenuButton?.querySelectorAll('.hamburger-line');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isOpen = !mobileMenu.classList.contains('hidden');

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        if (hamburgerLines && hamburgerLines.length >= 3) {
            hamburgerLines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            hamburgerLines[1].style.opacity = '0';
            hamburgerLines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        }
    }

    window.closeMobileMenu = function() {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';

        if (hamburgerLines && hamburgerLines.length >= 3) {
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';
        }
    };

    // Menü dışında tıklanınca kapat
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            window.closeMobileMenu();
        }
    });

    // Escape tuşu ile kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeMobileMenu();
        }
    });
}

// Dil değiştirme sistemi
function initializeLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    const languageMenu = document.getElementById('language-menu');
    const currentLangSpan = document.getElementById('current-lang');
    const langOptions = document.querySelectorAll('.lang-option');
    const mobileLangOptions = document.querySelectorAll('.lang-option-mobile');

    let currentLang = localStorage.getItem('language') || 'tr';

    // Dili uygula
    function applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-tr][data-en]');
        elements.forEach(element => {
            const trText = element.getAttribute('data-tr');
            const enText = element.getAttribute('data-en');
            
            if (lang === 'tr') {
                element.textContent = trText;
            } else {
                element.textContent = enText;
            }
        });

        // Placeholder'ları güncelle
        const placeholderElements = document.querySelectorAll('[data-tr-placeholder][data-en-placeholder]');
        placeholderElements.forEach(element => {
            const trPlaceholder = element.getAttribute('data-tr-placeholder');
            const enPlaceholder = element.getAttribute('data-en-placeholder');
            
            if (lang === 'tr') {
                element.placeholder = trPlaceholder;
            } else {
                element.placeholder = enPlaceholder;
            }
        });

        // Dil göstergesini güncelle
        currentLangSpan.textContent = lang.toUpperCase();
        
        // Mobil butonları güncelle
        mobileLangOptions.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            btn.classList.remove('active', 'bg-primary-600', 'text-white');
            btn.classList.add('bg-gray-700', 'text-gray-300');
            
            if (btnLang === lang) {
                btn.classList.remove('bg-gray-700', 'text-gray-300');
                btn.classList.add('active', 'bg-primary-600', 'text-white');
            }
        });

        // GitHub projelerindeki kategori isimlerini güncelle
        updateProjectCategories(lang);

        localStorage.setItem('language', lang);
        currentLang = lang;
    }

    // Proje kategorilerini güncelle
    function updateProjectCategories(lang) {
        // Proje kartlarındaki kategori metinlerini güncelle
        setTimeout(() => {
            const categoryElements = document.querySelectorAll('.project-card .text-xs.opacity-75');
            categoryElements.forEach(element => {
                const currentText = element.textContent.trim();
                
                // Türkçe'den İngilizce'ye çevir
                if (lang === 'en') {
                    if (currentText === 'Web') element.textContent = 'Web';
                    else if (currentText === 'Desktop') element.textContent = 'Desktop';
                    else if (currentText === 'Mobil') element.textContent = 'Mobile';
                    else if (currentText === 'API/Backend') element.textContent = 'API/Backend';
                    else if (currentText === 'Diğer') element.textContent = 'Other';
                }
                // İngilizce'den Türkçe'ye çevir
                else if (lang === 'tr') {
                    if (currentText === 'Web') element.textContent = 'Web';
                    else if (currentText === 'Desktop') element.textContent = 'Desktop';
                    else if (currentText === 'Mobile') element.textContent = 'Mobil';
                    else if (currentText === 'API/Backend') element.textContent = 'API/Backend';
                    else if (currentText === 'Other') element.textContent = 'Diğer';
                }
            });
        }, 100);
    }

    // Başlangıç dilini uygula
    applyLanguage(currentLang);

    // Dil menüsü toggle
    if (languageToggle && languageMenu) {
        languageToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            languageMenu.classList.toggle('hidden');
        });

        // Dışarı tıklanınca menüyü kapat
        document.addEventListener('click', () => {
            languageMenu.classList.add('hidden');
        });
    }

    // Dil seçenekleri
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang');
            applyLanguage(selectedLang);
            languageMenu.classList.add('hidden');
        });
    });

    // Mobil dil seçenekleri
    mobileLangOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang');
            applyLanguage(selectedLang);
        });
    });
}

// GitHub projelerini yükleme fonksiyonu - Gelişmiş Arama ve Filtreleme ile
async function loadGitHubProjects() {
    const username = 'metinkpnk';
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    try {
        // Loading göstergesi
        portfolioGrid.innerHTML = `
            <div class="col-span-full loading">
                <i class="fas fa-spinner fa-spin text-4xl text-primary-400 mb-4"></i>
                <p class="text-gray-400">GitHub projeleri yükleniyor...</p>
            </div>
        `;

        // GitHub API'den projeleri çek
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        
        if (!response.ok) throw new Error(`GitHub API hatası: ${response.status}`);
        
        const repos = await response.json();
        if (!repos || repos.length === 0) throw new Error('Hiç proje bulunamadı');

        // Fork olmayan projeleri filtrele
        const filteredRepos = repos.filter(repo => !repo.fork && !repo.private);
        
        // Global değişkene kaydet (arama ve filtreleme için)
        window.allProjects = filteredRepos;
        
        // Projeleri render et
        renderProjects(filteredRepos);
        
        // Teknoloji filtrelerini oluştur
        createTechFilters(filteredRepos);
        
        // Arama ve filtreleme event listener'larını başlat
        initializeSearchAndFilter();
        
    } catch (error) {
        console.error('GitHub projeleri yüklenirken hata:', error);
        portfolioGrid.innerHTML = `
            <div class="col-span-full loading">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p class="text-gray-400 mb-2">GitHub projeleri yüklenirken hata oluştu.</p>
                <p class="text-gray-500 text-sm mb-4">Hata: ${error.message}</p>
                <button onclick="loadGitHubProjects()" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                    <i class="fas fa-redo mr-2"></i>Tekrar Dene
                </button>
            </div>
        `;
    }
}

// Projeleri render etme fonksiyonu
function renderProjects(repos) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    const projectsHTML = repos.map(repo => {
        const language = repo.language || 'Other';
        const description = repo.description || 'Açıklama eklenmemiş.';
        const topics = repo.topics || [];
        
        // Kategori belirleme
        let category = 'other';
        let categoryIcon = 'fas fa-code';
        let categoryName = 'Diğer';
        
        if (language.toLowerCase().includes('javascript') || 
            language.toLowerCase().includes('html') || 
            language.toLowerCase().includes('css') ||
            topics.some(t => ['web', 'frontend', 'react', 'vue', 'angular'].includes(t.toLowerCase()))) {
            category = 'web';
            categoryIcon = 'fas fa-globe';
            categoryName = 'Web';
        } else if (language.toLowerCase().includes('c#') || 
                  language.toLowerCase().includes('python') || 
                  language.toLowerCase().includes('java') ||
                  topics.some(t => ['desktop', 'gui', 'windows'].includes(t.toLowerCase()))) {
            category = 'desktop';
            categoryIcon = 'fas fa-desktop';
            categoryName = 'Desktop';
        } else if (topics.some(t => ['mobile', 'android', 'ios', 'flutter'].includes(t.toLowerCase()))) {
            category = 'mobile';
            categoryIcon = 'fas fa-mobile-alt';
            categoryName = 'Mobil';
        } else if (topics.some(t => ['api', 'backend', 'server', 'nodejs'].includes(t.toLowerCase()))) {
            category = 'api';
            categoryIcon = 'fas fa-server';
            categoryName = 'API/Backend';
        }

        // Dil durumuna göre kategori ismini ayarla
        const currentLang = localStorage.getItem('language') || 'tr';
        if (currentLang === 'en') {
            if (categoryName === 'Diğer') categoryName = 'Other';
            else if (categoryName === 'Mobil') categoryName = 'Mobile';
        }

        // Teknoloji etiketleri
        const techTags = [language, ...topics.slice(0, 3)].filter(Boolean);
        
        // Son güncelleme tarihi
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('tr-TR');
        
        return `
            <div class="project-card ${category}" 
                 data-name="${repo.name.toLowerCase()}" 
                 data-description="${description.toLowerCase()}" 
                 data-language="${language.toLowerCase()}" 
                 data-topics="${topics.join(' ').toLowerCase()}"
                 data-category="${category}">
                <h3>
                    <span class="category-icon">
                        <i class="${categoryIcon}"></i>
                    </span>
                    ${repo.name}
                </h3>
                <p>${description}</p>
                
                ${techTags.length > 0 ? `
                    <div class="tech-tags">
                        ${techTags.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="project-info">
                    <div class="project-stats">
                        <span class="project-stat">
                            <i class="fas fa-calendar-alt"></i>
                            ${updatedDate}
                        </span>
                        ${repo.stargazers_count > 0 ? `
                            <span class="project-stat">
                                <i class="fas fa-star"></i>
                                ${repo.stargazers_count}
                            </span>
                        ` : ''}
                        ${repo.forks_count > 0 ? `
                            <span class="project-stat">
                                <i class="fas fa-code-branch"></i>
                                ${repo.forks_count}
                            </span>
                        ` : ''}
                    </div>
                    <span class="text-xs opacity-75">${categoryName}</span>
                </div>
                
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank">
                        <i class="fab fa-github"></i>
                        Kod
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    portfolioGrid.innerHTML = projectsHTML;
    
    // Kartları sırayla animasyonla göster
    const cards = portfolioGrid.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Sonuç sayısını güncelle
    updateResultsCount(repos.length);
}

// İletişim formu işlevi
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('_replyto');
            const subject = formData.get('_subject');
            const message = formData.get('message');

            // Temel doğrulama
            if (!name || !email || !subject || !message) {
                showNotification('Lütfen tüm alanları doldurun', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Lütfen geçerli bir e-posta adresi girin', 'error');
                return;
            }

            // Buton animasyonu
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Gönderiliyor...';

            // Netlify'ye gönder
            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Hata:', error);
                showNotification('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            });
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type) {
        // Mevcut bildirimleri kaldır
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

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

        // 5 saniye sonra otomatik kaldır
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Scroll efektleri
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animasyonlu elementleri gözlemle
    const animatedElements = document.querySelectorAll('.project-card, .bg-gray-800\\/80');
    animatedElements.forEach(el => {
        observer.observe(el);
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Performans iyileştirmeleri
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll olaylarını optimize et
const debouncedScroll = debounce(function() {
    // Scroll işlemleri burada
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Hata işleme
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Sayfa yüklenmeden önce temizlik
window.addEventListener('beforeunload', function() {
    document.body.style.overflow = '';
});

// Yıldız Sistemi
function initializeParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const starCount = 100; // Statik yıldız sayısı
    const stars = [];
    const shootingStars = [];

    // Statik Yıldız sınıfı
    class Star {
        constructor() {
            this.reset();
            this.element = this.createElement();
            container.appendChild(this.element);
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.opacity = Math.random() * 0.8 + 0.2; // 0.2-1.0 arası opaklık
            this.twinkleSpeed = Math.random() * 2 + 1; // 1-3 saniye arası
        }

        createElement() {
            const element = document.createElement('div');
            element.className = 'star';
            
            // Rastgele boyut sınıfı
            const sizeClasses = ['star-small', 'star-medium', 'star-large'];
            const sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
            
            // Rastgele renk sınıfı
            const colorClasses = ['star-white', 'star-blue', 'star-purple', 'star-pink'];
            const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
            
            element.classList.add(sizeClass, colorClass);
            
            // Rastgele animasyon gecikmesi
            element.style.animationDelay = Math.random() * 3 + 's';
            element.style.animationDuration = this.twinkleSpeed + 's';
            
            this.updateElement(element);
            return element;
        }

        updateElement(element) {
            element.style.left = this.x + 'px';
            element.style.top = this.y + 'px';
            element.style.opacity = this.opacity;
        }

        destroy() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    // Kayan Yıldız sınıfı - Her Yönden Sakin Hareket
    class ShootingStar {
        constructor() {
            this.element = this.createElement();
            container.appendChild(this.element);
            
            // Animasyon bitince kendini yok et (daha uzun süre)
            setTimeout(() => {
                this.destroy();
            }, 20000); // 20 saniye
        }

        createElement() {
            const element = document.createElement('div');
            element.className = 'shooting-star';
            
            // Rastgele yön seç (8 farklı yön)
            const directions = [
                'diagonal-down',    // Sol üstten sağ alta
                'diagonal-left',    // Sağ üstten sol alta  
                'vertical-down',    // Yukarıdan aşağıya
                'horizontal-right', // Soldan sağa
                'horizontal-left',  // Sağdan sola
                'diagonal-up',      // Sol alttan sağ üste
                'diagonal-down-reverse', // Sağ alttan sol üste
                'vertical-up'       // Aşağıdan yukarıya
            ];
            
            const direction = directions[Math.floor(Math.random() * directions.length)];
            
            // Yöne göre başlangıç pozisyonu ayarla
            this.setStartPosition(element, direction);
            
            // Rastgele animasyon süresi (çok daha yavaş)
            const duration = Math.random() * 8 + 12; // 12-20 saniye arası
            element.style.animationDuration = duration + 's';
            element.style.animationName = 'shoot-' + direction;
            
            // Rastgele kuyruk uzunluğu ve açısı (hareket yönüyle paralel)
            const tailLength = Math.random() * 80 + 60; // 60-140px
            const angle = this.getAngleForDirection(direction);
            
            // CSS custom properties ile kuyruk stilini ayarla
            const style = document.createElement('style');
            const uniqueClass = 'dynamic-shooting-' + Date.now() + Math.random().toString(36).substring(2, 11);
            element.classList.add(uniqueClass);
            
            style.textContent = `
                .${uniqueClass}::before {
                    width: ${tailLength}px !important;
                    transform: rotate(${angle}deg) !important;
                    ${direction.includes('left') || direction.includes('horizontal-left') ? 'left: 2px !important;' : 'right: 2px !important;'}
                }
            `;
            document.head.appendChild(style);
            
            // Style'ı temizlemek için referans sakla
            this.styleElement = style;
            
            return element;
        }

        setStartPosition(element, direction) {
            const margin = 200;
            
            switch(direction) {
                case 'diagonal-down':
                    element.style.top = -margin + 'px';
                    element.style.left = -margin + 'px';
                    break;
                case 'diagonal-left':
                    element.style.top = -margin + 'px';
                    element.style.right = -margin + 'px';
                    break;
                case 'vertical-down':
                    element.style.top = -margin + 'px';
                    element.style.left = Math.random() * window.innerWidth + 'px';
                    break;
                case 'horizontal-right':
                    element.style.left = -margin + 'px';
                    element.style.top = Math.random() * window.innerHeight + 'px';
                    break;
                case 'horizontal-left':
                    element.style.right = -margin + 'px';
                    element.style.top = Math.random() * window.innerHeight + 'px';
                    break;
                case 'diagonal-up':
                    element.style.bottom = -margin + 'px';
                    element.style.left = -margin + 'px';
                    break;
                case 'diagonal-down-reverse':
                    element.style.bottom = -margin + 'px';
                    element.style.right = -margin + 'px';
                    break;
                case 'vertical-up':
                    element.style.bottom = -margin + 'px';
                    element.style.left = Math.random() * window.innerWidth + 'px';
                    break;
            }
        }

        getAngleForDirection(direction) {
            switch(direction) {
                case 'diagonal-down': return 45;
                case 'diagonal-left': return -45;
                case 'vertical-down': return 90;
                case 'horizontal-right': return 0;
                case 'horizontal-left': return 180;
                case 'diagonal-up': return -45;
                case 'diagonal-down-reverse': return 135;
                case 'vertical-up': return -90;
                default: return 45;
            }
        }

        destroy() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            if (this.styleElement && this.styleElement.parentNode) {
                this.styleElement.parentNode.removeChild(this.styleElement);
            }
            // Array'den kaldır
            const index = shootingStars.indexOf(this);
            if (index > -1) {
                shootingStars.splice(index, 1);
            }
        }
    }

    // Statik yıldızları oluştur
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    // Kayan yıldız oluşturma fonksiyonu
    function createShootingStar() {
        if (shootingStars.length < 3) { // Maksimum 3 kayan yıldız aynı anda
            const shootingStar = new ShootingStar();
            shootingStars.push(shootingStar);
        }
    }

    // Rastgele aralıklarla kayan yıldız oluştur - Daha sakin
    function scheduleShootingStar() {
        const delay = Math.random() * 15000 + 10000; // 10-25 saniye arası (çok daha sakin)
        setTimeout(() => {
            createShootingStar();
            scheduleShootingStar(); // Bir sonrakini planla
        }, delay);
    }

    // İlk kayan yıldızı başlat
    setTimeout(() => {
        scheduleShootingStar();
    }, 5000); // 5 saniye sonra başla

    // Pencere boyutu değiştiğinde yıldızları yeniden konumlandır
    window.addEventListener('resize', () => {
        stars.forEach(star => {
            if (star.x > window.innerWidth) star.x = window.innerWidth;
            if (star.y > window.innerHeight) star.y = window.innerHeight;
            star.updateElement(star.element);
        });
    });

    // Fare hareketiyle etkileşim (yıldızların parlaklığını artır)
    let mouseX = 0;
    let mouseY = 0;

    container.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Fareye yakın yıldızları parlat
        stars.forEach(star => {
            const dx = mouseX - star.x;
            const dy = mouseY - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const intensity = (150 - distance) / 150;
                star.element.style.transform = `scale(${1 + intensity * 0.5})`;
                star.element.style.filter = `brightness(${1 + intensity})`;
            } else {
                star.element.style.transform = 'scale(1)';
                star.element.style.filter = 'brightness(1)';
            }
        });
    });

    // Temizlik fonksiyonu
    window.destroyParticles = function() {
        stars.forEach(star => star.destroy());
        shootingStars.forEach(shootingStar => shootingStar.destroy());
        stars.length = 0;
        shootingStars.length = 0;
    };
}

// Teknoloji filtrelerini oluşturma
function createTechFilters(repos) {
    const techFilters = document.getElementById('tech-filters');
    const allTechs = new Set();
    
    // Tüm teknolojileri topla
    repos.forEach(repo => {
        if (repo.language) allTechs.add(repo.language);
        if (repo.topics) repo.topics.forEach(topic => allTechs.add(topic));
    });
    
    // En popüler teknolojileri seç (en fazla 8 tane)
    const techCount = {};
    repos.forEach(repo => {
        if (repo.language) techCount[repo.language] = (techCount[repo.language] || 0) + 1;
        if (repo.topics) repo.topics.forEach(topic => {
            techCount[topic] = (techCount[topic] || 0) + 1;
        });
    });
    
    const popularTechs = Object.entries(techCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([tech]) => tech);
    
    // Filtre butonlarını oluştur
    const filterButtons = popularTechs.map(tech => 
        `<button class="filter-btn" data-filter="${tech.toLowerCase()}">${tech}</button>`
    ).join('');
    
    // "Tümü" butonundan sonra ekle
    const allButton = techFilters.querySelector('[data-filter="all"]');
    allButton.insertAdjacentHTML('afterend', filterButtons);
}

// Arama ve filtreleme sistemi
function initializeSearchAndFilter() {
    const searchInput = document.getElementById('project-search');
    const clearButton = document.getElementById('clear-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Arama fonksiyonu
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        currentSearch = searchTerm;
        
        // Clear butonu görünürlüğü
        if (searchTerm) {
            clearButton.classList.remove('hidden');
        } else {
            clearButton.classList.add('hidden');
        }
        
        filterAndDisplayProjects();
    }
    
    // Filtreleme fonksiyonu
    function filterProjects(filter) {
        currentFilter = filter;
        
        // Aktif buton stilini güncelle
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        filterAndDisplayProjects();
    }
    
    // Projeleri filtrele ve göster
    function filterAndDisplayProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const name = card.dataset.name || '';
            const description = card.dataset.description || '';
            const language = card.dataset.language || '';
            const topics = card.dataset.topics || '';
            const category = card.dataset.category || '';
            
            // Arama kriteri
            const matchesSearch = !currentSearch || 
                name.includes(currentSearch) || 
                description.includes(currentSearch) || 
                language.includes(currentSearch) || 
                topics.includes(currentSearch);
            
            // Filtre kriteri
            const matchesFilter = currentFilter === 'all' || 
                language.includes(currentFilter.toLowerCase()) || 
                topics.includes(currentFilter.toLowerCase()) ||
                category === currentFilter.toLowerCase();
            
            // Göster/gizle
            if (matchesSearch && matchesFilter) {
                card.classList.remove('hidden');
                card.classList.add('fade-in');
                visibleCount++;
                
                // Arama terimini vurgula
                if (currentSearch) {
                    highlightSearchTerm(card, currentSearch);
                } else {
                    removeHighlight(card);
                }
            } else {
                card.classList.add('hidden');
                card.classList.remove('fade-in');
            }
        });
        
        updateResultsCount(visibleCount);
    }
    
    // Arama terimi vurgulama
    function highlightSearchTerm(card, term) {
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        if (title && title.textContent.toLowerCase().includes(term)) {
            const regex = new RegExp(`(${term})`, 'gi');
            const originalText = title.textContent;
            const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
            title.innerHTML = title.innerHTML.replace(originalText, highlightedText);
        }
    }
    
    // Vurgulamayı kaldır
    function removeHighlight(card) {
        const highlights = card.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            highlight.outerHTML = highlight.textContent;
        });
    }
    
    // Event listener'lar
    searchInput.addEventListener('input', debounce(performSearch, 300));
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        clearButton.classList.add('hidden');
        filterAndDisplayProjects();
    });
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterProjects(btn.dataset.filter);
        });
    });
}

// Sonuç sayısını güncelleme
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    const currentLang = localStorage.getItem('language') || 'tr';
    
    if (count === 0) {
        resultsCount.textContent = currentLang === 'tr' ? 'Hiç proje bulunamadı' : 'No projects found';
    } else if (count === 1) {
        resultsCount.textContent = currentLang === 'tr' ? '1 proje bulundu' : '1 project found';
    } else {
        resultsCount.textContent = currentLang === 'tr' ? `${count} proje bulundu` : `${count} projects found`;
    }
}

// CV İndirme Fonksiyonu
function initializeCVDownload() {
    const downloadBtn = document.getElementById('download-cv-btn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async function() {
            const originalHTML = this.innerHTML;
            const currentLang = localStorage.getItem('language') || 'tr';
            
            // Loading durumu
            this.disabled = true;
            this.innerHTML = `
                <span class="loading-spinner mr-2"></span>
                ${currentLang === 'tr' ? 'İndiriliyor...' : 'Downloading...'}
            `;
            
            try {
                // CV URL'ini fetch et
                const cvUrl = 'https://metinkpnk.github.io/CV/';
                
                // Yeni sekmede aç
                window.open(cvUrl, '_blank');
                
                // Başarı mesajı göster
                setTimeout(() => {
                    showNotification(
                        currentLang === 'tr' ? 'CV başarıyla açıldı!' : 'CV opened successfully!', 
                        'success'
                    );
                }, 500);
                
            } catch (error) {
                console.error('CV indirme hatası:', error);
                showNotification(
                    currentLang === 'tr' ? 'CV açılırken hata oluştu.' : 'Error opening CV.', 
                    'error'
                );
            } finally {
                // Butonu eski haline getir
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = originalHTML;
                }, 1000);
            }
        });
    }
}

// Gelişmiş Form Validasyonu
function initializeAdvancedFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    const fields = {
        name: {
            element: contactForm.querySelector('#name'),
            rules: [
                { test: (val) => val.length >= 2, message: { tr: 'Ad en az 2 karakter olmalıdır', en: 'Name must be at least 2 characters' }},
                { test: (val) => /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(val), message: { tr: 'Ad sadece harf içermelidir', en: 'Name should only contain letters' }}
            ]
        },
        email: {
            element: contactForm.querySelector('#email'),
            rules: [
                { test: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), message: { tr: 'Geçerli bir e-posta adresi girin', en: 'Enter a valid email address' }}
            ]
        },
        subject: {
            element: contactForm.querySelector('#subject'),
            rules: [
                { test: (val) => val.length >= 5, message: { tr: 'Konu en az 5 karakter olmalıdır', en: 'Subject must be at least 5 characters' }}
            ]
        },
        message: {
            element: contactForm.querySelector('#message'),
            rules: [
                { test: (val) => val.length >= 10, message: { tr: 'Mesaj en az 10 karakter olmalıdır', en: 'Message must be at least 10 characters' }},
                { test: (val) => val.length <= 1000, message: { tr: 'Mesaj en fazla 1000 karakter olabilir', en: 'Message cannot exceed 1000 characters' }}
            ]
        }
    };
    
    // Her alan için validasyon ekle
    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
        const element = fieldConfig.element;
        if (!element) return;
        
        // Form group wrapper'ı oluştur
        if (!element.parentElement.classList.contains('form-group')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'form-group';
            element.parentElement.insertBefore(wrapper, element);
            wrapper.appendChild(element);
        }
        
        // Real-time validasyon
        element.addEventListener('blur', () => validateField(fieldName, fieldConfig));
        element.addEventListener('input', debounce(() => validateField(fieldName, fieldConfig), 500));
    });
    
    // Form submit validasyonu
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
            if (!validateField(fieldName, fieldConfig)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitForm(this);
        } else {
            showNotification(
                localStorage.getItem('language') === 'tr' ? 
                'Lütfen tüm alanları doğru şekilde doldurun' : 
                'Please fill all fields correctly', 
                'error'
            );
        }
    });
    
    function validateField(fieldName, fieldConfig) {
        const element = fieldConfig.element;
        const value = element.value.trim();
        const currentLang = localStorage.getItem('language') || 'tr';
        
        // Önceki mesajları temizle
        clearFieldMessages(element);
        
        // Boş alan kontrolü
        if (!value) {
            showFieldError(element, currentLang === 'tr' ? 'Bu alan zorunludur' : 'This field is required');
            return false;
        }
        
        // Kuralları kontrol et
        for (const rule of fieldConfig.rules) {
            if (!rule.test(value)) {
                showFieldError(element, rule.message[currentLang]);
                return false;
            }
        }
        
        // Başarılı validasyon
        showFieldSuccess(element);
        return true;
    }
    
    function showFieldError(element, message) {
        element.classList.add('form-error');
        element.classList.remove('form-success');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;
        element.parentElement.appendChild(errorDiv);
    }
    
    function showFieldSuccess(element) {
        element.classList.add('form-success');
        element.classList.remove('form-error');
    }
    
    function clearFieldMessages(element) {
        element.classList.remove('form-error', 'form-success');
        const messages = element.parentElement.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.remove());
    }
    
    async function submitForm(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const currentLang = localStorage.getItem('language') || 'tr';
        
        // Loading durumu
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="loading-spinner mr-2"></span>
            ${currentLang === 'tr' ? 'Gönderiliyor...' : 'Sending...'}
        `;
        
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                showNotification(
                    currentLang === 'tr' ? 
                    'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.' : 
                    'Your message has been sent successfully! I will get back to you soon.', 
                    'success'
                );
                form.reset();
                
                // Tüm validasyon stillerini temizle
                Object.values(fields).forEach(fieldConfig => {
                    if (fieldConfig.element) {
                        clearFieldMessages(fieldConfig.element);
                    }
                });
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Form gönderme hatası:', error);
            showNotification(
                currentLang === 'tr' ? 
                'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' : 
                'An error occurred while sending the message. Please try again.', 
                'error'
            );
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }
}

// Bildirim sistemi (geliştirilmiş)
function showNotification(message, type = 'info', duration = 5000) {
    // Mevcut bildirimleri kaldır
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    // Tip bazlı stiller
    const styles = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-600 text-white',
        info: 'bg-blue-600 text-white'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.className += ` ${styles[type] || styles.info}`;
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="flex items-center">
                <i class="fas ${icons[type] || icons.info} mr-2"></i>
                ${message}
            </span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200 transition-colors">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animasyon ile göster
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Otomatik kaldır
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}
// Loading Screen Fonksiyonu - Kod Yazma Animasyonu (Hızlandırılmış)
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('loading-progress');
    const percentageSpan = document.getElementById('loading-percentage');
    
    // Typing elements
    const typingName = document.getElementById('typing-name');
    const typingRole = document.getElementById('typing-role');
    const typingSkills = document.getElementById('typing-skills');
    const typingStatus = document.getElementById('typing-status');
    const typingConsole = document.getElementById('typing-console');
    
    // Typing data
    const typingData = {
        name: "Metin KEPENEK",
        role: "Software Developer",
        skills: '"C#", "JavaScript", "HTML"',
        status: "Ready for Projects",
        console: '"Portfolio loaded!"'
    };
    
    let progress = 0;
    
    // Typing function (hızlandırılmış)
    function typeText(element, text, callback, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                if (callback) callback();
            }
        }, speed);
    }
    
    // Progress update function (hızlandırılmış)
    function updateProgress(targetProgress) {
        const progressInterval = setInterval(() => {
            if (progress < targetProgress) {
                progress += 5; // Daha hızlı artış
                progressBar.style.width = progress + '%';
                percentageSpan.textContent = progress + '%';
            } else {
                clearInterval(progressInterval);
            }
        }, 30); // Daha sık güncelleme
    }
    
    // Start typing sequence (kısaltılmış süreler)
    setTimeout(() => {
        // Step 1: Type name
        typeText(typingName, typingData.name, () => {
            updateProgress(20);
            
            // Step 2: Type role
            setTimeout(() => {
                typeText(typingRole, typingData.role, () => {
                    updateProgress(40);
                    
                    // Step 3: Type skills
                    setTimeout(() => {
                        typeText(typingSkills, typingData.skills, () => {
                            updateProgress(60);
                            
                            // Step 4: Type status
                            setTimeout(() => {
                                typeText(typingStatus, typingData.status, () => {
                                    updateProgress(80);
                                    
                                    // Step 5: Type console log
                                    setTimeout(() => {
                                        typeText(typingConsole, typingData.console, () => {
                                            updateProgress(100);
                                            
                                            // Finish loading (hızlandırılmış)
                                            setTimeout(() => {
                                                loadingScreen.classList.add('fade-out');
                                                document.body.style.overflow = 'auto';
                                                
                                                // Remove loading screen
                                                setTimeout(() => {
                                                    loadingScreen.remove();
                                                }, 300); // Daha hızlı kaldırma
                                            }, 400); // Daha kısa bekleme
                                        }, 40); // Daha hızlı typing
                                    }, 200); // Daha kısa bekleme
                                }, 40); // Daha hızlı typing
                            }, 200); // Daha kısa bekleme
                        }, 35); // Daha hızlı typing
                    }, 200); // Daha kısa bekleme
                }, 45); // Daha hızlı typing
            }, 200); // Daha kısa bekleme
        }, 60); // Daha hızlı typing
    }, 500); // Daha erken başlama
    
    // Fallback - if page is already loaded (daha hızlı)
    if (document.readyState === 'complete') {
        setTimeout(() => {
            typingName.textContent = typingData.name;
            typingRole.textContent = typingData.role;
            typingSkills.textContent = typingData.skills;
            typingStatus.textContent = typingData.status;
            typingConsole.textContent = typingData.console;
            
            progress = 100;
            progressBar.style.width = '100%';
            percentageSpan.textContent = '100%';
            
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                document.body.style.overflow = 'auto';
                setTimeout(() => loadingScreen.remove(), 300);
            }, 800); // Çok daha kısa
        }, 300);
    }
}

// WhatsApp Widget Fonksiyonu
function initializeWhatsAppWidget() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const whatsappPopup = document.getElementById('whatsapp-popup');
    const closeBtn = document.getElementById('close-whatsapp');
    const quickBtns = document.querySelectorAll('.whatsapp-quick-btn');
    
    let isOpen = false;
    
    // WhatsApp popup toggle
    whatsappBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            whatsappPopup.classList.add('show');
        } else {
            whatsappPopup.classList.remove('show');
        }
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
        isOpen = false;
        whatsappPopup.classList.remove('show');
    });
    
    // Quick message buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.dataset.message;
            const phoneNumber = '905340692040'; // WhatsApp numaranız
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
    
    // Dışarı tıklanınca kapat
    document.addEventListener('click', (e) => {
        if (!whatsappBtn.contains(e.target) && !whatsappPopup.contains(e.target)) {
            isOpen = false;
            whatsappPopup.classList.remove('show');
        }
    });
}

// Social Share Widget Fonksiyonu
function initializeSocialShare() {
    const shareBtn = document.getElementById('share-btn');
    const shareOptions = document.getElementById('share-options');
    
    let isOpen = false;
    
    shareBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            shareOptions.classList.add('show');
        } else {
            shareOptions.classList.remove('show');
        }
    });
    
    // Dışarı tıklanınca kapat
    document.addEventListener('click', (e) => {
        if (!shareBtn.contains(e.target) && !shareOptions.contains(e.target)) {
            isOpen = false;
            shareOptions.classList.remove('show');
        }
    });
}

// Social Share Fonksiyonları
function shareToWhatsApp() {
    const url = window.location.href;
    const text = 'Metin KEPENEK - Yazılım Geliştirici Portfolio';
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
}

function shareToTwitter() {
    const url = window.location.href;
    const text = 'Metin KEPENEK - Yazılım Geliştirici Portfolio';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

function shareToLinkedIn() {
    const url = window.location.href;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank');
}

function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showNotification(
            localStorage.getItem('language') === 'tr' ? 
            'Link panoya kopyalandı!' : 
            'Link copied to clipboard!', 
            'success'
        );
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showNotification(
            localStorage.getItem('language') === 'tr' ? 
            'Link panoya kopyalandı!' : 
            'Link copied to clipboard!', 
            'success'
        );
    });
}

// Easter Eggs - Konami Code
function initializeEasterEggs() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    let userInput = [];
    let konamiActivated = false;
    
    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        
        // Son 10 tuşu kontrol et
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        // Konami kodu kontrolü
        if (userInput.length === konamiCode.length) {
            const isMatch = userInput.every((key, index) => key === konamiCode[index]);
            
            if (isMatch && !konamiActivated) {
                konamiActivated = true;
                activateEasterEgg();
            }
        }
    });
    
    function activateEasterEgg() {
        // Bildirim göster
        const notification = document.getElementById('easter-egg-notification');
        notification.classList.add('show');
        
        // Sayfa elementlerine glow efekti ekle
        document.body.classList.add('konami-activated');
        
        // Yıldız yağmuru başlat
        startStarRain();
        
        // Parçacık efektini değiştir
        enhanceParticles();
        
        // 5 saniye sonra bildirimi kapat
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
        
        // 10 saniye sonra efektleri kapat
        setTimeout(() => {
            document.body.classList.remove('konami-activated');
            stopStarRain();
            konamiActivated = false;
        }, 10000);
        
        console.log('🎉 Konami Code activated! Easter egg unlocked!');
    }
    
    function startStarRain() {
        const starRainInterval = setInterval(() => {
            if (!konamiActivated) {
                clearInterval(starRainInterval);
                return;
            }
            
            const star = document.createElement('div');
            star.className = 'star-rain';
            star.style.left = Math.random() * 100 + 'vw';
            star.style.animationDuration = (Math.random() * 2 + 1) + 's';
            star.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(star);
            
            // Yıldızı 5 saniye sonra kaldır
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 5000);
        }, 200);
    }
    
    function stopStarRain() {
        const stars = document.querySelectorAll('.star-rain');
        stars.forEach(star => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        });
    }
    
    function enhanceParticles() {
        // Mevcut yıldızlara rainbow efekti ekle
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            setTimeout(() => {
                const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
                star.style.background = colors[index % colors.length];
                star.style.boxShadow = `0 0 10px ${colors[index % colors.length]}`;
            }, index * 100);
        });
    }
}

// Tüm yeni fonksiyonları başlat
document.addEventListener('DOMContentLoaded', function() {
    // Mevcut fonksiyonlar
    initializeNavigation();
    initializeMobileMenu();
    initializeLanguageToggle();
    loadGitHubProjects();
    initializeAdvancedFormValidation();
    initializeScrollEffects();
    initializeParticles();
    
    // Yeni fonksiyonlar
    initializeLoadingScreen();
    initializeWhatsAppWidget();
    initializeSocialShare();
    initializeEasterEggs();
    
    // Loading sırasında scroll'u engelle
    document.body.style.overflow = 'hidden';
});