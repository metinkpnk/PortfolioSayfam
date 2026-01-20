// Modern JavaScript - Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeLanguageToggle(); // Dil değiştirici sistemi
    loadGitHubProjects();
    initializeContactForm();
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

// GitHub projelerini yükleme fonksiyonu
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
        
        // Projeleri HTML'e dönüştür
        const projectsHTML = filteredRepos.map(repo => {
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
                // Web, Desktop, API/Backend aynı kalır
            }

            // Teknoloji etiketleri
            const techTags = [language, ...topics.slice(0, 3)].filter(Boolean);
            
            // Son güncelleme tarihi
            const updatedDate = new Date(repo.updated_at).toLocaleDateString('tr-TR');
            
            return `
                <div class="project-card ${category}">
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

// Parçacık Sistemi
function initializeParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 50; // Parçacık sayısı
    const particles = [];

    // Parçacık sınıfı
    class Particle {
        constructor() {
            this.reset();
            this.element = this.createElement();
            container.appendChild(this.element);
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 4 + 2; // 2-6px arası boyut
            this.speedX = (Math.random() - 0.5) * 1; // Yavaş hareket
            this.speedY = (Math.random() - 0.5) * 1;
            this.opacity = Math.random() * 0.6 + 0.2; // 0.2-0.8 arası opaklık
            this.life = Math.random() * 200 + 100; // Yaşam süresi
            this.age = 0;
        }

        createElement() {
            const element = document.createElement('div');
            element.className = 'particle';
            
            // Rastgele boyut sınıfı
            const sizeClasses = ['particle-small', 'particle-medium', 'particle-large'];
            const sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
            
            // Rastgele renk sınıfı
            const colorClasses = ['particle-purple', 'particle-pink', 'particle-blue'];
            const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
            
            element.classList.add(sizeClass, colorClass);
            
            // Rastgele animasyon gecikmesi
            element.style.animationDelay = Math.random() * 6 + 's';
            
            this.updateElement(element);
            return element;
        }

        updateElement(element) {
            element.style.left = this.x + 'px';
            element.style.top = this.y + 'px';
            element.style.opacity = this.opacity * (1 - this.age / this.life);
        }

        update() {
            // Pozisyonu güncelle
            this.x += this.speedX;
            this.y += this.speedY;
            this.age++;

            // Sınırları kontrol et
            if (this.x < -10) this.x = window.innerWidth + 10;
            if (this.x > window.innerWidth + 10) this.x = -10;
            if (this.y < -10) this.y = window.innerHeight + 10;
            if (this.y > window.innerHeight + 10) this.y = -10;

            // Yaşam süresini kontrol et
            if (this.age >= this.life) {
                this.reset();
            }

            // Element pozisyonunu güncelle
            this.updateElement(this.element);
        }

        destroy() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    // Parçacıkları oluştur
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animasyon döngüsü
    function animate() {
        particles.forEach(particle => particle.update());
        requestAnimationFrame(animate);
    }

    animate();

    // Pencere boyutu değiştiğinde parçacıkları yeniden konumlandır
    window.addEventListener('resize', () => {
        particles.forEach(particle => {
            if (particle.x > window.innerWidth) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = window.innerHeight;
        });
    });

    // Fare hareketiyle etkileşim
    let mouseX = 0;
    let mouseY = 0;

    container.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Fareye yakın parçacıkları etkile
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.speedX += (dx / distance) * force * 0.01;
                particle.speedY += (dy / distance) * force * 0.01;
            }
        });
    });

    // Temizlik fonksiyonu
    window.destroyParticles = function() {
        particles.forEach(particle => particle.destroy());
        particles.length = 0;
    };
}