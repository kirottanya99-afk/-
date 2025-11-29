// Функционал для страницы услуг

// Хранилище для выбранных услуг
let selectedServices = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeServiceFilters();
    initializeOrderButtons();
    initializeServiceRequestForm();
    initializePriceFilter();
    updateSelectedServicesDisplay();
});

// Инициализация фильтров услуг
function initializeServiceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            serviceCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Инициализация кнопок "Заказать"
function initializeOrderButtons() {
    const orderButtons = document.querySelectorAll('.order-service');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-id');
            const serviceName = this.getAttribute('data-name');
            const servicePrice = this.getAttribute('data-price');
            
            addServiceToSelection(serviceId, serviceName, servicePrice);
            
            document.querySelector('.service-request').scrollIntoView({
                behavior: 'smooth'
            });
            
            showServiceMessage(`Услуга "${serviceName}" добавлена в заявку!`);
        });
    });
}

// Добавление услуги в список выбранных
function addServiceToSelection(serviceId, serviceName, servicePrice) {

    const existingService = selectedServices.find(service => service.id === serviceId);
    
    if (!existingService) {

        selectedServices.push({
            id: serviceId,
            name: serviceName,
            price: parseInt(servicePrice),
            quantity: 1
        });
    } else {

        existingService.quantity += 1;
    }
    
    // Обновляем отображение выбранных услуг
    updateSelectedServicesDisplay();
}

// Обновление отображение выбранных услуг
function updateSelectedServicesDisplay() {
    const selectedServicesContainer = document.getElementById('selected-services');
    
    if (!selectedServicesContainer) return;
    
    if (selectedServices.length === 0) {
        selectedServicesContainer.innerHTML = `
            <div class="no-services-selected">
                <p>Выберите услуги из списка выше</p>
            </div>
        `;
        return;
    }
    
    let totalPrice = 0;
    let servicesHtml = `
        <div class="selected-services-header">
            <h3>Выбранные услуги</h3>
        </div>
        <div class="selected-services-list">
    `;
    
    selectedServices.forEach((service, index) => {
        const serviceTotal = service.price * service.quantity;
        totalPrice += serviceTotal;
        
        servicesHtml += `
            <div class="selected-service-item">
                <div class="service-info">
                    <span class="service-name">${service.name}</span>
                    <span class="service-price">${service.price} руб. × ${service.quantity}</span>
                </div>
                <div class="service-total">${serviceTotal} руб.</div>
                <div class="service-actions">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${service.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                    <button class="remove-service" data-index="${index}">×</button>
                </div>
            </div>
        `;
    });
    
    servicesHtml += `
        </div>
        <div class="selected-services-total">
            <strong>Общая стоимость: ${totalPrice} руб.</strong>
        </div>
    `;
    
    selectedServicesContainer.innerHTML = servicesHtml;
    

    initializeSelectedServicesControls();
}

// Инициализация обработчиков для выбранных услуг
function initializeSelectedServicesControls() {

    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            selectedServices[index].quantity += 1;
            updateSelectedServicesDisplay();
        });
    });
    

    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (selectedServices[index].quantity > 1) {
                selectedServices[index].quantity -= 1;
                updateSelectedServicesDisplay();
            }
        });
    });
    

    document.querySelectorAll('.remove-service').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            selectedServices.splice(index, 1);
            updateSelectedServicesDisplay();
        });
    });
}

// Инициализация фильтра по цене
function initializePriceFilter() {
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            const maxPrice = parseInt(this.value);
            priceValue.textContent = maxPrice;
            
            // Фильтрация по цене
            serviceCards.forEach(card => {
                const cardPrice = parseInt(card.getAttribute('data-price'));
                
                if (cardPrice <= maxPrice) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
}

// Инициализация формы заявки на услугу
function initializeServiceRequestForm() {
    const serviceRequestForm = document.getElementById('service-request-form');
    
    if (serviceRequestForm) {
        serviceRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (selectedServices.length === 0) {
                showServiceMessage('Пожалуйста, выберите хотя бы одну услугу', 'Ошибка');
                return;
            }
            
            const name = document.getElementById('service-name').value;
            const phone = document.getElementById('service-phone').value;
            const car = document.getElementById('service-car').value;
            const date = document.getElementById('service-date').value;
            const comments = document.getElementById('service-comments').value;
            
            if (!name || !phone || !car || !date) {
                showServiceMessage('Пожалуйста, заполните все обязательные поля', 'Ошибка');
                return;
            }
            
            const phonePattern = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/;
            if (!phonePattern.test(phone)) {
                showServiceMessage('Пожалуйста, введите корректный номер телефона', 'Ошибка');
                return;
            }
            
            const requestData = {
                id: 'serv_' + Date.now(),
                name: name,
                phone: phone,
                car: car,
                services: selectedServices,
                date: date,
                comments: comments,
                totalPrice: selectedServices.reduce((sum, service) => sum + (service.price * service.quantity), 0),
                status: 'new',
                timestamp: new Date().toISOString()
            };
            
            const submitBtn = serviceRequestForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            sendServiceRequest(requestData)
                .then(result => {
                    if (result.success) {
                        showSuccessModal(name, phone, requestData.totalPrice, selectedServices.length);
                        
                        serviceRequestForm.reset();
                        selectedServices = [];
                        updateSelectedServicesDisplay();
                        
                        const today = new Date().toISOString().split('T')[0];
                        document.getElementById('service-date').value = today;
                    } else {
                        showServiceMessage(result.message || 'Произошла ошибка при отправке заявки.', 'Ошибка');
                    }
                })
                .catch(error => {
                    console.error('Ошибка при отправке заявки:', error);
                    showServiceMessage('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.', 'Ошибка');
                })
                .finally(() => {

                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
}

// Функция для показа модального окна успешной отправки
function showSuccessModal(name, phone, totalPrice, servicesCount) {
    let successModal = document.getElementById('success-modal');
    
    if (!successModal) {
        successModal = document.createElement('div');
        successModal.id = 'success-modal';
        successModal.className = 'modal';
        successModal.innerHTML = `
            <div class="modal-content success-modal-content">
                <span class="close">&times;</span>
                <div class="success-icon">✓</div>
                <h3>Заявка отправлена!</h3>
                <div class="success-message">
                    <p><strong>Спасибо, ${name}!</strong></p>
                    <p>Ваша заявка на ${servicesCount} услуг успешно отправлена.</p>
                    <p>Общая стоимость: <strong>${totalPrice} руб.</strong></p>
                    <p>Скоро с вами свяжется наш сотрудник для подтверждения заявки.</p>
                </div>
                <div class="contact-info">
                    <p><strong>Ваши контактные данные:</strong></p>
                    <p>Телефон: ${phone}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" id="success-ok">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(successModal);
        
        // Добавляем стили для модального окна успеха
        if (!document.querySelector('#success-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'success-modal-styles';
            styles.textContent = `
                .success-modal-content {
                    text-align: center;
                    max-width: 500px;
                    z-index: 1002;
                }
                .success-icon {
                    width: 80px;
                    height: 80px;
                    background: #27ae60;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    margin: 0 auto 20px;
                    animation: bounceIn 0.6s;
                }
                .success-message {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: left;
                }
                .success-message p {
                    margin-bottom: 10px;
                    line-height: 1.5;
                }
                .contact-info {
                    background: #e8f5e8;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                    border-left: 4px solid #27ae60;
                }
                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Обработчик закрытия модального окна
        const okButton = successModal.querySelector('#success-ok');
        okButton.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
        
        const closeButton = successModal.querySelector('.close');
        closeButton.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
        
        // Закрытие при клике вне окна
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }
    
    successModal.style.display = 'block';
}

// Функция отправки заявки на услугу
async function sendServiceRequest(requestData) {
    try {
        // Сохранение в localStorage
        saveServiceRequest(requestData);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Заявка на услугу отправлена:', requestData);
        
        return {
            success: true,
            message: 'Заявка успешно отправлена',
            requestId: Date.now()
        };
    } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        throw error;
    }
}

// Функция сохранения заявки на услугу
function saveServiceRequest(requestData) {
    let serviceRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    serviceRequests.push(requestData);
    localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
}

// Функция показа сообщения 
function showServiceMessage(message, title = '') {

    if (typeof window.showMessage === 'function' && window.showMessage !== showServiceMessage) {
        window.showMessage(message, title);
    } else {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 1003;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
        `;
        
        let messageHTML = '';
        if (title) {
            messageHTML += `<strong>${title}</strong><br>`;
        }
        messageHTML += message;
        
        notification.innerHTML = messageHTML;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
}