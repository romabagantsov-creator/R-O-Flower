// ===== FloraBloom - Flower Shop JavaScript =====
class FloraBloom {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        console.log('🌺 R&O - цветочный магазин инициализирован');
        
        // Инициализация всех модулей
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initScrollToTop();
        this.initContactForms();
        this.initAddToCart();
        this.initNewsletter();
        
        // Отслеживание аналитики
        this.trackPageView();
    }

    // ===== MOBILE MENU =====
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;

        if (!menuToggle || !navLinks) return;

        const toggleMenu = (isOpen) => {
            menuToggle.setAttribute('aria-expanded', isOpen.toString());
            navLinks.classList.toggle('active', isOpen);
            body.classList.toggle('menu-open', isOpen);
            body.style.overflow = isOpen ? 'hidden' : '';
            this.animateHamburger(menuToggle, isOpen);
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            toggleMenu(!isExpanded);
        });

        // Закрытие меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Закрытие меню при клике вне области
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !menuToggle.contains(e.target) && 
                !navLinks.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Закрытие меню по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    animateHamburger(menuToggle, isActive) {
        const lines = menuToggle.querySelectorAll('.hamburger-line');
        
        if (isActive) {
            lines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    }

    // ===== SMOOTH SCROLL =====
    initSmoothScroll() {
        // Плавная прокрутка для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#main-content') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===== SCROLL TO TOP =====
    initScrollToTop() {
        // Создаем кнопку только если её нет
        if (document.querySelector('.scroll-to-top')) return;
        
        const scrollToTop = document.createElement('button');
        scrollToTop.innerHTML = '↑';
        scrollToTop.className = 'scroll-to-top';
        scrollToTop.setAttribute('aria-label', 'Наверх');
        document.body.appendChild(scrollToTop);

        const toggleScrollButton = () => {
            if (window.pageYOffset > 300) {
                scrollToTop.classList.add('visible');
            } else {
                scrollToTop.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleScrollButton);

        scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Инициализируем состояние
        toggleScrollButton();
    }

    // ===== ADD TO CART FUNCTIONALITY =====
    initAddToCart() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cta-button') && 
                e.target.textContent.includes('корзину')) {
                e.preventDefault();
                this.addToCart(e.target);
            }
        });
    }

    addToCart(button) {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        
        const product = {
            name: productName,
            price: productPrice,
            id: Date.now()
        };
        
        this.cart.push(product);
        this.showNotification(`"${productName}" добавлен в корзину!`, 'success');
        
        // Обновляем счетчик корзины если он есть
        this.updateCartCounter();
        
        // Анимация кнопки
        button.textContent = 'Добавлено!';
        button.style.background = '#4caf50';
        
        setTimeout(() => {
            button.textContent = 'В корзину';
            button.style.background = '';
        }, 2000);
    }

    updateCartCounter() {
        let cartCounter = document.querySelector('.cart-counter');
        if (!cartCounter) {
            // Создаем счетчик если его нет
            const nav = document.querySelector('.nav-links');
            if (nav) {
                const cartItem = document.createElement('li');
                cartItem.innerHTML = `
                    <a href="#" class="cart-link">
                        🛒 Корзина <span class="cart-counter">${this.cart.length}</span>
                    </a>
                `;
                nav.appendChild(cartItem);
            }
        } else {
            cartCounter.textContent = this.cart.length;
        }
    }

    // ===== FORM HANDLING =====
    initContactForms() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    initNewsletter() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(newsletterForm);
            });
        }
    }

    handleFormSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Показываем состояние загрузки
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        // Имитация отправки формы
        setTimeout(() => {
            this.showNotification('Сообщение отправлено успешно! Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
            
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    handleNewsletterSubmit(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        if (!this.isValidEmail(emailInput.value)) {
            this.showNotification('Пожалуйста, введите корректный email адрес', 'error');
            return;
        }

        // Показываем состояние загрузки
        submitBtn.textContent = 'Подписываем...';
        submitBtn.disabled = true;

        // Имитация подписки
        setTimeout(() => {
            this.showNotification('Спасибо за подписку! Проверьте вашу почту для получения скидки 10%.', 'success');
            form.reset();
            
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== UTILITIES =====
    showNotification(message, type = 'info') {
        // Удаляем предыдущие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    trackPageView() {
        console.log(`Просмотр страницы: ${window.location.pathname}`);
        
        // Простая аналитика для цветочного магазина
        const pageName = this.getPageName();
        console.log(`🌺 FloraBloom - ${pageName}`);
    }

    getPageName() {
        const path = window.location.pathname;
        if (path.includes('catalog')) return 'Каталог букетов';
        if (path.includes('about')) return 'О нас';
        if (path.includes('contacts')) return 'Контакты';
        if (path.includes('delivery')) return 'Доставка';
        return 'Главная страница';
    }

    // Метод для получения корзины (может пригодиться)
    getCart() {
        return this.cart;
    }

    // Метод для очистки корзины
    clearCart() {
        this.cart = [];
        this.updateCartCounter();
    }
}

// ===== FLOWER SHOP UTILITY FUNCTIONS =====
window.FloraBloomUtils = {
    // Форматирование цены для цветов
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    },

    // Расчет даты доставки
    calculateDeliveryDate(days = 1) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    },

    // Сезонные рекомендации
    getSeasonalFlowers() {
        const month = new Date().getMonth();
        const seasons = {
            winter: ['🌹 Розы', '❄️ Хризантемы', '🎄 Пуансеттии'],
            spring: ['🌷 Тюльпаны', '🌸 Нарциссы', '💐 Гиацинты'],
            summer: ['🌻 Подсолнухи', '🌺 Пионы', '🏵️ Герберы'],
            autumn: ['🍂 Астры', '🌼 Хризантемы', '🎃 Георгины']
        };
        
        if (month >= 11 || month <= 1) return seasons.winter;
        if (month >= 2 && month <= 4) return seasons.spring;
        if (month >= 5 && month <= 7) return seasons.summer;
        return seasons.autumn;
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    if ('querySelector' in document && 'addEventListener' in window) {
        try {
            window.floraBloom = new FloraBloom();
        } catch (error) {
            console.error('Ошибка инициализации FloraBloom:', error);
            initLegacySupport();
        }
    } else {
        initLegacySupport();
    }
});

// Fallback для старых браузеров
function initLegacySupport() {
    console.log('FloraBloom - базовая функциональность');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', (!isExpanded).toString());
            navLinks.classList.toggle('active');
        });
    }
    
    // Базовая функциональность форм
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Форма отправлена! В полной версии это отправит данные на сервер.');
            form.reset();
        });
    });
}

// Глобальные функции для использования в консоли
window.getCart = () => window.floraBloom ? window.floraBloom.getCart() : [];
window.clearCart = () => window.floraBloom ? window.floraBloom.clearCart() : null;
