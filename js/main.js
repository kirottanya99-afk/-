// Функция для загрузки данных корзины из localStorage
function loadCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Функция для сохранения корзины в localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция для обновления счетчика корзины в шапке
function updateCartCount() {
    const cart = loadCart();
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalCount;
    });
}

// Функция для поиска по сайту
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query) {
        let found = false;
        
        // Поиск по товарам
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const titleElement = card.querySelector('.product-title');
            const descriptionElement = card.querySelector('.product-category');
            
            if (titleElement && descriptionElement) {
                const title = titleElement.textContent.toLowerCase();
                const description = descriptionElement.textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    card.classList.add('highlight-search');
                    setTimeout(() => {
                        card.classList.remove('highlight-search');
                    }, 3000);
                    found = true;
                    
                    // Прокрутка к найденному элементу
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Поиск по услугам
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            const titleElement = card.querySelector('h3');
            const descriptionElement = card.querySelector('p');
            
            if (titleElement && descriptionElement) {
                const title = titleElement.textContent.toLowerCase();
                const description = descriptionElement.textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    card.classList.add('highlight-search');
                    setTimeout(() => {
                        card.classList.remove('highlight-search');
                    }, 3000);
                    found = true;
                    
                    // Прокрутка к найденному элементу
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Поиск по отзывам
        const reviewAuthors = document.querySelectorAll('.review-author');
        reviewAuthors.forEach(author => {
            const authorName = author.textContent.toLowerCase();
            if (authorName.includes(query)) {
                author.closest('.review').classList.add('highlight-search');
                setTimeout(() => {
                    author.closest('.review').classList.remove('highlight-search');
                }, 3000);
                found = true;
                author.closest('.review').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        const featureTitles = document.querySelectorAll('.feature h3');
        featureTitles.forEach(title => {
            const titleText = title.textContent.toLowerCase();
            if (titleText.includes(query)) {
                title.closest('.feature').classList.add('highlight-search');
                setTimeout(() => {
                    title.closest('.feature').classList.remove('highlight-search');
                }, 3000);
                found = true;
                title.closest('.feature').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        if (!found) {
            showMessage('По вашему запросу ничего не найдено.');
        }
        
        searchInput.value = '';
    } else {
        showMessage('Пожалуйста, введите поисковый запрос');
    }
}

// Альтернативная упрощенная версия маски телефона
function initializeSimplePhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            // Убираем первую 7 или 8
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }
            
            let formattedValue = '+7 (';
            
            if (value.length > 0) {
                formattedValue += value.substring(0, 3);
            }
            if (value.length > 3) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length > 8) {
                formattedValue += '-' + value.substring(8, 10);
            }
            
            this.value = formattedValue;
        });
        
        // Устанавливаем паттерн для валидации
        input.setAttribute('pattern', '\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}');
        input.placeholder = '+7 (999) 999-99-99';
    });
}

// Функция для форматирования даты
function initializeDateInputs() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
        
        // Устанавливаем сегодняшнюю дату по умолчанию
        if (!input.value) {
            input.value = today;
        }
    });
}

// Функция для форматирования номера карты
function initializeCardMasks() {
    const cardInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('card-expiry');
    const cvcInput = document.getElementById('card-cvc');
    const cardHolderInput = document.getElementById('card-holder');
    
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            value = value.substring(0, 16);
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            this.value = value;
        });
    }
    
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }
    
    if (cvcInput) {
        cvcInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').substring(0, 3);
        });
    }
    
    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', function(e) {
            // Удаляем все символы, кроме английских букв и пробелов
            let value = this.value.replace(/[^A-Z\s]/gi, '');
            
            // Преобразуем в верхний регистр
            value = value.toUpperCase();
            
            this.value = value;
        });
        
        // Устанавливаем placeholder
        cardHolderInput.placeholder = 'IVAN IVANOV';
    }
}

// Функция для отображения модального окна с сообщением
function showMessage(message, title = '') {
    const modal = document.getElementById('message-modal');
    const messageContent = document.getElementById('message-content');
    const okButton = document.getElementById('message-ok');
    
    if (!modal || !messageContent || !okButton) {
        // Создаем модальное окно, если его нет
        createMessageModal();
        // Повторно вызываем функцию
        return showMessage(message, title);
    }
    
    let messageHTML = '';
    if (title) {
        messageHTML += `<h3 style="margin-bottom: 15px; color: #2c3e50;">${title}</h3>`;
    }
    messageHTML += `<p style="line-height: 1.5;">${message}</p>`;
    
    messageContent.innerHTML = messageHTML;
    
    modal.style.display = 'block';
    
    okButton.onclick = function() {
        modal.style.display = 'none';
    };
    
    // Закрытие при клике вне окна
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Функция для создания модального окна сообщений, если его нет
function createMessageModal() {
    if (document.getElementById('message-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'message-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="message-content"></div>
            <div class="modal-actions">
                <button class="btn-primary" id="message-ok">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Инициализация модального окна
    initializeModals();
}

// Функция для инициализации модальных окон
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Закрытие при клике вне модального окна
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Функция для валидации форм с фильтрацией имени и email
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalidField = null;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Валидация телефона
                    if (field.type === 'tel' && field.value) {
                        const phonePattern = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/;
                        if (!phonePattern.test(field.value)) {
                            isValid = false;
                            field.classList.add('error');
                            if (!firstInvalidField) {
                                firstInvalidField = field;
                            }
                        }
                    }
                    
                    // Валидация email - только один символ @
                    if (field.type === 'email' && field.value) {
                        const emailValue = field.value;
                        const atCount = (emailValue.match(/@/g) || []).length;
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        
                        if (atCount !== 1 || !emailPattern.test(emailValue)) {
                            isValid = false;
                            field.classList.add('error');
                            if (!firstInvalidField) {
                                firstInvalidField = field;
                            }
                        }
                    }
                    
                    // Валидация имени - только буквы и пробелы (русские и английские)
                    if (field.classList.contains('validate-name') && field.value) {
                        const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;
                        if (!namePattern.test(field.value.trim())) {
                            isValid = false;
                            field.classList.add('error');
                            if (!firstInvalidField) {
                                firstInvalidField = field;
                            }
                        }
                    }
                    
                    // Валидация имени владельца карты - только заглавные английские буквы и пробелы
                    if (field.classList.contains('validate-card-holder') && field.value) {
                        const cardHolderPattern = /^[A-Z\s]+$/;
                        if (!cardHolderPattern.test(field.value.trim())) {
                            isValid = false;
                            field.classList.add('error');
                            if (!firstInvalidField) {
                                firstInvalidField = field;
                            }
                        }
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showMessage('Пожалуйста, заполните все обязательные поля корректно.', 'Ошибка заполнения формы');
                
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                
                return false;
            }
        });
        
        // Убираем класс ошибки при вводе
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                
                // Реальная фильтрация ввода для имени
                if (this.classList.contains('validate-name')) {
                    let value = this.value;
                    // Удаляем все символы, кроме букв и пробелов
                    value = value.replace(/[^A-Za-zА-Яа-яЁё\s]/g, '');
                    this.value = value;
                }
                
                // Реальная фильтрация ввода для email - ограничиваем количество @
                if (this.type === 'email') {
                    let value = this.value;
                    const atCount = (value.match(/@/g) || []).length;
                    if (atCount > 1) {
                        // Оставляем только первый символ @
                        const parts = value.split('@');
                        value = parts[0] + '@' + parts.slice(1).join('');
                        this.value = value;
                    }
                }
                
                // Реальная фильтрация ввода для имени владельца карты
                if (this.classList.contains('validate-card-holder')) {
                    let value = this.value;
                    // Удаляем все символы, кроме английских букв и пробелов
                    value = value.replace(/[^A-Z\s]/gi, '');
                    // Преобразуем в верхний регистр
                    value = value.toUpperCase();
                    this.value = value;
                }
            });
        });
    });
}

// Функция для плавной прокрутки к якорям
function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Функция для обработки активного состояния навигации
function initializeActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Функция для инициализации всех общих функций
function initializeCommonFeatures() {
    updateCartCount();
    initializeSearch();
    initializeModals();
    initializeSimplePhoneMask(); 
    initializeDateInputs();
    initializeCardMasks();
    initializeFormValidation();
    initializeSmoothScroll();
    initializeActiveNav();
}

// Функция для работы с уведомлениями
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Добавляем стили для уведомлений, если их еще нет
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 0;
                border-radius: 4px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 300px;
                animation: slideInRight 0.3s ease-out;
            }
            .notification-error {
                background: #e74c3c;
            }
            .notification-warning {
                background: #f39c12;
            }
            .notification-content {
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Обработчик закрытия уведомления
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Функция для определения типа устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Функция для адаптации интерфейса под мобильные устройства
function adaptForMobile() {
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
        
        // Адаптация поисковой строки
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.style.flexDirection = 'column';
            searchBox.style.gap = '10px';
        }
    }
}

// Функция для обработки изменения размера окна
function handleResize() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.innerWidth <= 768) {
            header.classList.add('mobile-header');
        } else {
            header.classList.remove('mobile-header');
        }
    }
}

// Функция для обработки формы заявки (главная страница)
function initializeRequestForm() {
    const requestForm = document.getElementById('request-form');
    
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбор данных формы
            const formData = new FormData(this);
            const data = {
                id: 'req_' + Date.now(),
                name: formData.get('name'),
                phone: formData.get('phone'),
                car: formData.get('car'),
                problem: formData.get('problem'),
                type: 'repair_request',
                status: 'new',
                date: new Date().toLocaleDateString('ru-RU'),
                timestamp: new Date().toISOString()
            };
            
            // Валидация
            if (!data.name || !data.phone || !data.car || !data.problem) {
                showMessage('Пожалуйста, заполните все поля', 'Ошибка заполнения');
                return;
            }
            
            // Сохранение в localStorage
            saveRepairRequest(data);
            
            // Отправка данных (здесь можно добавить AJAX запрос)
            showMessage(
                `Спасибо, ${data.name}! Ваша заявка принята.<br><br>Мы свяжемся с вами по телефону ${data.phone} в ближайшее время.`,
                'Заявка отправлена!'
            );
            this.reset();
        });
    }
}

// Функция сохранения заявки на ремонт
function saveRepairRequest(requestData) {
    try {
        let repairRequests = JSON.parse(localStorage.getItem('repairRequests') || '[]');
        repairRequests.push(requestData);
        localStorage.setItem('repairRequests', JSON.stringify(repairRequests));
    } catch (error) {
        console.error('Ошибка при сохранении заявки на ремонт:', error);
    }
}

// Функция для обработки формы отзыва
function initializeReviewForm() {
    const reviewForm = document.getElementById('review-form');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('review-name').value;
            const rating = document.getElementById('review-rating').value;
            const text = document.getElementById('review-text').value;
            
            if (!name || !rating || !text) {
                showMessage('Пожалуйста, заполните все поля', 'Ошибка заполнения');
                return;
            }
            
            const reviewData = {
                id: 'rev_' + Date.now(),
                name: name,
                rating: parseInt(rating),
                text: text,
                status: 'new',
                date: new Date().toLocaleDateString('ru-RU'),
                timestamp: new Date().toISOString()
            };
            
            // Сохранение отзыва
            saveReview(reviewData);
            
            // Отправка данных (здесь можно добавить AJAX запрос)
            showMessage(`Спасибо, ${name}! Ваш отзыв принят и будет опубликован после проверки.`, 'Отзыв отправлен!');
            
            // Закрытие модального окна
            const reviewModal = document.getElementById('review-modal');
            if (reviewModal) {
                reviewModal.style.display = 'none';
            }
            this.reset();
        });
    }
}

// Функция сохранения отзыва
function saveReview(reviewData) {
    try {
        let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.push(reviewData);
        localStorage.setItem('reviews', JSON.stringify(reviews));
    } catch (error) {
        console.error('Ошибка при сохранении отзыва:', error);
    }
}

// Функция для инициализации кнопки добавления отзыва
function initializeAddReviewButton() {
    const addReviewBtn = document.getElementById('add-review-btn');
    const reviewModal = document.getElementById('review-modal');
    
    if (addReviewBtn && reviewModal) {
        addReviewBtn.addEventListener('click', () => {
            reviewModal.style.display = 'block';
        });
    }
}

// Функция для инициализации всех страничных функций
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initializeRequestForm();
            initializeReviewForm();
            initializeAddReviewButton();
            break;
        case 'services.html':
            // Функции для страницы услуг уже инициализируются в services.js
            break;
        case 'products.html':
            // Функции для страницы товаров уже инициализируются в products.js
            break;
        case 'about.html':
            // Функции для страницы "О нас" уже инициализируются в about.js
            break;
    }
}

// Главная функция инициализации
document.addEventListener('DOMContentLoaded', function() {
    initializeCommonFeatures();
    initializePageSpecificFeatures();
    adaptForMobile();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', handleResize);
    
    // Первоначальная проверка
    handleResize();
});