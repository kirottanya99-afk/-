// Функционал для страницы автотоваров

// Данные товаров
const productsData = [
    {
        id: 1,
        name: "Моторное масло Castrol 5W-40",
        category: "oil",
        brand: "castrol",
        price: 2500,
        oldPrice: 2800,
        image: "img/products6.jpg",
        inStock: true,
        popular: true
    },
    {
        id: 2,
        name: "Тормозные колодки Bosch",
        category: "brakes",
        brand: "bosch",
        price: 4200,
        oldPrice: 0,
        image: "img/products10.jpg",
        inStock: true,
        popular: true
    },
    {
        id: 3,
        name: "Свечи зажигания NGK",
        category: "engine",
        brand: "ngk",
        price: 1800,
        oldPrice: 0,
        image: "img/products7.jpeg",
        inStock: true,
        popular: false
    },
    {
        id: 4,
        name: "Воздушный фильтр Mann",
        category: "engine",
        brand: "mann",
        price: 1200,
        oldPrice: 1500,
        image: "img/products3.jpeg",
        inStock: true,
        popular: true
    },
    {
        id: 5,
        name: "Амортизаторы Febi Bilstein",
        category: "suspension",
        brand: "febi",
        price: 8500,
        oldPrice: 0,
        image: "img/products2.jpg",
        inStock: true,
        popular: false
    },
    {
        id: 6,
        name: "Аккумулятор Bosch S4",
        category: "electrics",
        brand: "bosch",
        price: 7200,
        oldPrice: 8000,
        image: "img/products1.jpeg",
        inStock: true,
        popular: true
    },
    {
        id: 7,
        name: "Тормозная жидкость Castrol",
        category: "brakes",
        brand: "castrol",
        price: 900,
        oldPrice: 0,
        image: "img/products9.jpg",
        inStock: true,
        popular: false
    },
    {
        id: 8,
        name: "Щетки стеклоочистителя Bosch",
        category: "accessories",
        brand: "bosch",
        price: 1500,
        oldPrice: 1800,
        image: "img/products11.jpg",
        inStock: true,
        popular: true
    },
    {
        id: 9,
        name: "Масляный фильтр Mann",
        category: "engine",
        brand: "mann",
        price: 800,
        oldPrice: 0,
        image: "img/products5.jpeg",
        inStock: true,
        popular: false
    },
    {
        id: 10,
        name: "Стойка стабилизатора Febi",
        category: "suspension",
        brand: "febi",
        price: 2200,
        oldPrice: 0,
        image: "img/products8.jpg",
        inStock: true,
        popular: false
    },
    {
        id: 11,
        name: "Лампа головного света H7",
        category: "electrics",
        brand: "bosch",
        price: 600,
        oldPrice: 0,
        image: "img/products4.jpeg",
        inStock: true,
        popular: true
    },
];

// Глобальные переменные для корзины
let cart = [];
let currentOrderData = null;

// Функция загрузки корзины
function loadCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

// Функция сохранения корзины
function saveCart(cartData) {
    localStorage.setItem('cart', JSON.stringify(cartData));
}

// Функция обновления счетчика корзины
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalCount;
    });
}

// Функция показа сообщения
function showMessage(message) {
    if (typeof window.showMessage === 'function' && window.showMessage !== showMessage) {
        window.showMessage(message);
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
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
}

// Функция получения названия бренда
function getBrandName(brand) {
    const brands = {
        'bosch': 'Bosch',
        'castrol': 'Castrol',
        'ngk': 'NGK',
        'mann': 'Mann',
        'febi': 'Febi Bilstein',
        'other': 'Другой'
    };
    return brands[brand] || brand;
}

// Функция получения названия категории
function getCategoryName(category) {
    const categories = {
        'engine': 'Двигатель',
        'brakes': 'Тормозная система',
        'suspension': 'Подвеска',
        'electrics': 'Электрика',
        'oil': 'Масла и жидкости',
        'accessories': 'Аксессуары'
    };
    return categories[category] || category;
}

// Функция добавления товара в корзину
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= 100) {
            showMessage(`Максимальное количество товара "${product.name}" - 100 штук`);
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartDisplay(); 
    updateCartCount();
    
    const addButton = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
    if (addButton) {
        addButton.textContent = 'Добавлено!';
        addButton.classList.add('added');
        
        setTimeout(() => {
            addButton.textContent = 'Добавить в корзину';
            addButton.classList.remove('added');
        }, 2000);
    }
    
    showMessage(`Товар "${product.name}" добавлен в корзину!`);
}

// Функция инициализации кнопок добавления в корзину
function initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// Функция удаления товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartDisplay();
    showMessage('Товар удален из корзины');
}

// Функция обновления отображения корзины - ИСПРАВЛЕННАЯ
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartItems) cartItems.innerHTML = '';

    if (cart.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
            emptyCartMessage.innerHTML = `
                <p>Ваша корзина пуста</p>
                <a href="#" class="btn-primary" id="go-to-products">Перейти к товарам</a>
            `;
            
            // Инициализация кнопки перехода к товарам
            const goToProductsBtn = document.getElementById('go-to-products');
            if (goToProductsBtn) {
                goToProductsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productsFilters = document.querySelector('.products-filters');
                    if (productsFilters) {
                        productsFilters.scrollIntoView({ 
                            behavior: 'smooth' 
                        });
                    }
                });
            }
        }
        if (cartSummary) cartSummary.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
        updateCartCount();
        return;
    }

    // Показываем корзину и скрываем сообщение о пустой корзине
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = false;

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-brand">${getBrandName(item.brand)}</div>
                <div class="cart-item-price">${item.price} руб. × ${item.quantity} = ${itemTotal} руб.</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="100" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `;

        if (cartItems) cartItems.appendChild(cartItem);
    });

    // Расчет стоимости доставки
    const shipping = subtotal > 5000 ? 0 : 500;
    const total = subtotal + shipping;

    // Обновление итогов
    if (subtotalElement) subtotalElement.textContent = `${subtotal} руб.`;
    if (shippingElement) shippingElement.textContent = `${shipping} руб.`;
    if (totalElement) totalElement.textContent = `${total} руб.`;

    // Инициализация обработчиков для элементов корзины
    initializeCartItemControls();
    updateCartCount();
}

// Функция инициализации обработчиков для элементов корзины
function initializeCartItemControls() {
    // Обработчики для кнопок минус
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            updateQuantity(productId, -1);
        });
    });
    
    // Обработчики для кнопок плюс
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            updateQuantity(productId, 1);
        });
    });
    
    // Обработчики для полей ввода количества
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.dataset.id);
            const newQuantity = parseInt(this.value);
            
            if (newQuantity < 1) {
                this.value = 1;
                updateQuantity(productId, 0, 1);
                return;
            }
            
            if (newQuantity > 100) {
                this.value = 100;
                updateQuantity(productId, 0, 100);
                showMessage('Максимальное количество товара - 100 штук');
                return;
            }
            
            updateQuantity(productId, 0, newQuantity);
        });
    });
    
    // Обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Функция обновления количества товара
function updateQuantity(productId, change, newQuantity = null) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (newQuantity !== null) {
        item.quantity = newQuantity;
    } else {
        item.quantity += change;
    }
    
    // Ограничение максимального количества
    if (item.quantity > 100) {
        item.quantity = 100;
        showMessage('Максимальное количество товара - 100 штук');
    }
    
    if (item.quantity < 1) {
        removeFromCart(productId);
    } else {
        saveCart(cart);
        updateCartDisplay();
    }
}

// Инициализация каталога товаров
function initializeProductsCatalog() {
    const productsGrid = document.getElementById('products-grid');
    const sortSelect = document.getElementById('sort-by');

    let filteredProducts = [...productsData];

    // Функция отрисовки товаров
    function renderProducts(products) {
        if (!productsGrid) return;
        
        productsGrid.innerHTML = '';

        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products-message">
                    <p>Товары не найдены. Попробуйте изменить параметры фильтрации.</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });

        // Инициализация кнопок добавления в корзину
        initializeAddToCartButtons();
    }

    // Функция создания карточки товара
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        card.dataset.category = product.category;
        card.dataset.brand = product.brand;
        card.dataset.price = product.price;

        const badge = product.oldPrice ? '<div class="product-badge">Акция</div>' : '';
        const oldPrice = product.oldPrice ? `<div class="old-price">${product.oldPrice} руб.</div>` : '';

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${badge}
            </div>
            <div class="product-content">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-brand">${getBrandName(product.brand)}</div>
                <div class="product-price">
                    <div class="current-price">${product.price} руб.</div>
                    ${oldPrice}
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Добавить в корзину
                </button>
            </div>
        `;

        return card;
    }

    // Функция фильтрации товаров
    function filterProducts() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);

        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(checkbox => checkbox.value);

        const minPrice = parseInt(document.getElementById('min-price').value) || 0;
        const maxPrice = parseInt(document.getElementById('max-price').value) || 100000;

        filteredProducts = productsData.filter(product => {
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
            const priceMatch = product.price >= minPrice && product.price <= maxPrice;

            return categoryMatch && brandMatch && priceMatch;
        });

        sortProducts();
    }

    // Функция сортировки товаров
    function sortProducts() {
        const sortBy = sortSelect ? sortSelect.value : 'name';

        switch (sortBy) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filteredProducts.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
                break;
            case 'name':
            default:
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        renderProducts(filteredProducts);
    }

    // Обработчик изменения сортировки
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }

    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', filterProducts);
    }

    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Сброс чекбоксов
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = true;
            });

            // Сброс цен
            const minPriceInput = document.getElementById('min-price');
            const maxPriceInput = document.getElementById('max-price');
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';

            filterProducts();
        });
    }

    // Первоначальная загрузка товаров
    filterProducts();
}

// Функция сохранения заказа
function saveProductOrder(orderData) {
    let productOrders = JSON.parse(localStorage.getItem('productOrders') || '[]');
    productOrders.push(orderData);
    localStorage.setItem('productOrders', JSON.stringify(productOrders));
}

// Функция оформления заказа
function initializeCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const orderModal = document.getElementById('order-modal');
    const orderForm = document.getElementById('order-form');
    const paymentModal = document.getElementById('payment-modal');
    const paymentForm = document.getElementById('payment-form');
    const receiptModal = document.getElementById('receipt-modal');
    const closeReceiptBtn = document.getElementById('close-receipt');
    
    if (!checkoutBtn) return;
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        // Заполнение данных заказа
        const orderItemsList = document.getElementById('order-items-list');
        const orderTotalPrice = document.getElementById('order-total-price');
        
        if (orderItemsList) orderItemsList.innerHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span>${item.name} (${item.quantity} шт.)</span>
                <span>${itemTotal} руб.</span>
            `;
            if (orderItemsList) orderItemsList.appendChild(orderItem);
        });
        
        const shipping = subtotal > 5000 ? 0 : 500;
        const total = subtotal + shipping;
        
        if (orderTotalPrice) orderTotalPrice.textContent = `${total} руб.`;
        
        // Показываем модальное окно заказа
        if (orderModal) orderModal.style.display = 'block';
    });
    
    // Обработка формы заказа
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('order-name').value;
            const phone = document.getElementById('order-phone').value;
            const email = document.getElementById('order-email').value;
            const address = document.getElementById('order-address').value;
            const comment = document.getElementById('order-comment').value;
            
            // Сохраняем данные заказа
            currentOrderData = {
                id: 'ord_' + Date.now(),
                name,
                phone,
                email,
                address,
                comment,
                items: [...cart],
                total: document.getElementById('order-total-price').textContent,
                date: new Date().toLocaleDateString('ru-RU'),
                time: new Date().toLocaleTimeString('ru-RU'),
                status: 'new',
                timestamp: new Date().toISOString()
            };
            
            // Сохраняем заказ в localStorage
            saveProductOrder(currentOrderData);
            
            // Закрываем модальное окно заказа
            if (orderModal) orderModal.style.display = 'none';
            
            // Показываем модальное окно оплаты
            const paymentAmount = document.getElementById('payment-amount');
            if (paymentAmount) paymentAmount.textContent = currentOrderData.total;
            if (paymentModal) paymentModal.style.display = 'block';
            
            // Обработка формы оплаты
            if (paymentForm) {
                paymentForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Имитация обработки платежа
                    setTimeout(() => {
                        if (paymentModal) paymentModal.style.display = 'none';
                        generateReceipt(currentOrderData);
                        if (receiptModal) receiptModal.style.display = 'block';
                        
                        // Очистка корзины после успешной оплаты
                        cart = [];
                        saveCart(cart);
                        updateCartDisplay();
                    }, 2000);
                };
            }
        });
    }

    // Закрытие чека
    if (closeReceiptBtn) {
        closeReceiptBtn.addEventListener('click', function() {
            if (receiptModal) receiptModal.style.display = 'none';
        });
    }
    
    // Функция генерации чека
    function generateReceipt(orderData) {
        const receiptContent = document.getElementById('receipt-content');
        if (!receiptContent) return;
        
        let itemsHtml = '';
        
        orderData.items.forEach(item => {
            itemsHtml += `
                <div class="receipt-item">
                    <div>${item.name} (${item.quantity} шт.)</div>
                    <div>${item.price * item.quantity} руб.</div>
                </div>
            `;
        });
        
        const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal > 5000 ? 0 : 500;
        
        receiptContent.innerHTML = `
            <div class="receipt-header">
                <h3>Автосервис</h3>
                <p>г. Красноярск, ул. Водопьянова, д. 15</p>
                <p>Телефон: +7 (988) 888-88-88</p>
                <p>Дата: ${orderData.date}</p>
                <p>Время: ${orderData.time}</p>
            </div>
            <div class="receipt-customer">
                <p><strong>Клиент:</strong> ${orderData.name}</p>
                <p><strong>Телефон:</strong> ${orderData.phone}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Адрес:</strong> ${orderData.address}</p>
                ${orderData.comment ? `<p><strong>Комментарий:</strong> ${orderData.comment}</p>` : ''}
            </div>
            <div class="receipt-items">
                <h4>Товары:</h4>
                ${itemsHtml}
            </div>
            <div class="receipt-total">
                <div class="receipt-row">
                    <span>Товары:</span>
                    <span>${subtotal} руб.</span>
                </div>
                <div class="receipt-row">
                    <span>Доставка:</span>
                    <span>${shipping} руб.</span>
                </div>
                <div class="receipt-row total">
                    <span>Итого:</span>
                    <span>${orderData.total}</span>
                </div>
            </div>
            <div class="receipt-footer">
                <p><em>Обязательно сохраните чек!</em></p>
                <p>Спасибо за покупку!</p>
            </div>
        `;
        
        // Инициализация кнопки сохранения чека
        const saveReceiptBtn = document.getElementById('print-receipt');
        if (saveReceiptBtn) {
            saveReceiptBtn.textContent = 'Сохранить чек (PDF)';
            saveReceiptBtn.onclick = function() {
                generatePDFReceipt(orderData);
            };
        }
    }
}

// Инициализация маски для поля имени владельца карты
function initializeCardHolderMask() {
    const cardHolderInput = document.getElementById('card-holder');
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

// Функция для генерации PDF чека с использованием pdfmake
function generatePDFReceipt(orderData) {
    try {
        // Проверка наличия библиотеки
        if (typeof pdfMake === 'undefined') {
            throw new Error('PDF библиотека не загружена');
        }

        // Создание таблицы товаров
        const tableBody = [
            [
                { text: 'Товар', style: 'tableHeader', alignment: 'left' },
                { text: 'Кол-во', style: 'tableHeader', alignment: 'center' },
                { text: 'Цена', style: 'tableHeader', alignment: 'right' },
                { text: 'Сумма', style: 'tableHeader', alignment: 'right' }
            ]
        ];

        // Добавление товаров в таблицу
        orderData.items.forEach(item => {
            tableBody.push([
                { text: item.name, style: 'itemName', alignment: 'left' },
                { text: item.quantity.toString(), alignment: 'center' },
                { text: `${item.price} руб.`, alignment: 'right' },
                { text: `${item.price * item.quantity} руб.`, alignment: 'right' }
            ]);
        });

        // Расчет итогов
        const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 500;
        const total = subtotal + shipping;

        // Определение документа
        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 40, 40, 40],
            content: [
                // Заголовок
                {
                    text: 'АВТОСЕРВИС',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                {
                    text: [
                        { text: 'г. Красноярск, ул. Водопьянова, д. 15\n', style: 'subheader' },
                        { text: 'Телефон: +7 (988) 888-88-88\n', style: 'subheader' },
                        { text: `Дата: ${orderData.date}`, style: 'subheader' },
                        { text: '  ', style: 'subheader' },
                        { text: `Время: ${orderData.time}`, style: 'subheader' }
                    ],
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },

                // Разделитель
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 515, y2: 0,
                            lineWidth: 1,
                            lineColor: '#cccccc'
                        }
                    ],
                    margin: [0, 0, 0, 20]
                },

                // Информация о клиенте
                {
                    text: 'ИНФОРМАЦИЯ О КЛИЕНТЕ',
                    style: 'sectionHeader',
                    margin: [0, 0, 0, 10]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            stack: [
                                { text: `Имя: ${orderData.name}`, style: 'customerInfo' },
                                { text: `Телефон: ${orderData.phone}`, style: 'customerInfo' }
                            ]
                        },
                        {
                            width: '50%',
                            stack: [
                                { text: `Email: ${orderData.email}`, style: 'customerInfo' },
                                { text: `Адрес: ${orderData.address}`, style: 'customerInfo' }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 20]
                },

                // Комментарий
                ...(orderData.comment ? [{
                    text: `Комментарий: ${orderData.comment}`,
                    style: 'comment',
                    margin: [0, 0, 0, 20]
                }] : []),

                // Товары
                {
                    text: 'ТОВАРЫ',
                    style: 'sectionHeader',
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto', 'auto'],
                        body: tableBody
                    },
                    layout: {
                        fillColor: function (rowIndex) {
                            return (rowIndex === 0) ? '#2980b9' : 
                                   (rowIndex % 2 === 0) ? '#f8f9fa' : null;
                        },
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
                        },
                        vLineWidth: function () {
                            return 0.5;
                        },
                        hLineColor: function () {
                            return '#cccccc';
                        },
                        vLineColor: function () {
                            return '#cccccc';
                        }
                    },
                    margin: [0, 0, 0, 20]
                },

                // Итоги
                {
                    stack: [
                        {
                            canvas: [
                                {
                                    type: 'line',
                                    x1: 0, y1: 0,
                                    x2: 200, y2: 0,
                                    lineWidth: 1,
                                    lineColor: '#666666'
                                }
                            ],
                            alignment: 'right',
                            margin: [0, 0, 0, 10]
                        },
                        {
                            columns: [
                                { text: '', width: '*' },
                                {
                                    width: 'auto',
                                    stack: [
                                        { text: `Товары: ${subtotal} руб.`, alignment: 'right', margin: [0, 0, 0, 5] },
                                        { text: `Доставка: ${shipping} руб.`, alignment: 'right', margin: [0, 0, 0, 5] },
                                        { 
                                            text: `ИТОГО: ${total} руб.`, 
                                            alignment: 'right', 
                                            style: 'total',
                                            margin: [0, 0, 0, 10] 
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },

                // Футер
                {
                    text: [
                        { text: 'Спасибо за покупку в нашем магазине!\n', style: 'footer' },
                        { text: 'Гарантия на товары: 14 дней с момента покупки\n', style: 'footer' },
                        { text: `Чек сгенерирован автоматически ${new Date().toLocaleString('ru-RU')}`, style: 'footer' }
                    ],
                    alignment: 'center',
                    margin: [0, 30, 0, 0]
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    color: '#2c3e50'
                },
                subheader: {
                    fontSize: 10,
                    color: '#7f8c8d'
                },
                sectionHeader: {
                    fontSize: 12,
                    bold: true,
                    color: '#2c3e50'
                },
                customerInfo: {
                    fontSize: 10,
                    margin: [0, 2, 0, 2]
                },
                comment: {
                    fontSize: 10,
                    italic: true,
                    color: '#7f8c8d'
                },
                tableHeader: {
                    fontSize: 10,
                    bold: true,
                    color: 'white',
                    fillColor: '#2980b9'
                },
                itemName: {
                    fontSize: 9
                },
                total: {
                    fontSize: 12,
                    bold: true,
                    color: '#e74c3c'
                },
                footer: {
                    fontSize: 8,
                    color: '#95a5a6'
                }
            },
            defaultStyle: {
                font: 'Roboto'
            }
        };

        // Генерация имени файла
        const fileName = `чек_автосервис_${orderData.date.replace(/\./g, '-')}.pdf`;

        // Создание и скачивание PDF
        pdfMake.createPdf(docDefinition).download(fileName);

        // Уведомление пользователя
        showMessage('Чек успешно сохранен в формате PDF!');

    } catch (error) {
        console.error('Ошибка при создании PDF:', error);
        
        // Запасной вариант - текстовый файл
        generateTextReceiptFallback(orderData);
    }
}

// Запасной вариант генерации текстового чека
function generateTextReceiptFallback(orderData) {
    try {
        const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 500;
        const total = subtotal + shipping;

        let receiptText = 'АВТОСЕРВИС\n';
        receiptText += 'г. Красноярск, ул. Водопьянова, д. 15\n';
        receiptText += 'Телефон: +7 (988) 888-88-88\n';
        receiptText += `Дата: ${orderData.date} Время: ${orderData.time}\n\n`;
        
        receiptText += 'ИНФОРМАЦИЯ О КЛИЕНТЕ:\n';
        receiptText += `Имя: ${orderData.name}\n`;
        receiptText += `Телефон: ${orderData.phone}\n`;
        receiptText += `Email: ${orderData.email}\n`;
        receiptText += `Адрес: ${orderData.address}\n`;
        
        if (orderData.comment) {
            receiptText += `Комментарий: ${orderData.comment}\n`;
        }
        
        receiptText += '\nТОВАРЫ:\n';
        receiptText += '----------------------------------------\n';
        
        orderData.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            receiptText += `${item.name}\n`;
            receiptText += `  Кол-во: ${item.quantity} x ${item.price} руб. = ${itemTotal} руб.\n`;
        });
        
        receiptText += '----------------------------------------\n';
        receiptText += `Товары: ${subtotal} руб.\n`;
        receiptText += `Доставка: ${shipping} руб.\n`;
        receiptText += `ИТОГО: ${total} руб.\n\n`;
        
        receiptText += 'Спасибо за покупку!\n';
        receiptText += 'Гарантия на товары: 14 дней\n';
        receiptText += `Чек создан: ${new Date().toLocaleString('ru-RU')}`;

        // Создание и скачивание текстового файла
        const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const fileName = `чек_автосервис_${orderData.date.replace(/\./g, '-')}.txt`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Освобождение памяти
        setTimeout(() => URL.revokeObjectURL(url), 100);

        showMessage('Чек сохранен в формате TXT!');

    } catch (fallbackError) {
        console.error('Ошибка в запасном варианте:', fallbackError);
        showMessage('Не удалось создать файл чека. Пожалуйста, сделайте скриншот этого окна.');
        
        // Показываем чек для скриншота
        showReceiptForScreenshot(orderData);
    }
}

// Функция для отображения чека в модальном окне для скриншота
function showReceiptForScreenshot(orderData) {
    const receiptContent = document.getElementById('receipt-content');
    if (!receiptContent) return;

    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 500;
    const total = subtotal + shipping;

    let receiptHTML = `
        <div style="border: 2px solid #333; padding: 20px; background: white; color: black;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #2c3e50;">АВТОСЕРВИС</h2>
                <p style="margin: 5px 0; color: #7f8c8d;">г. Красноярск, ул. Водопьянова, д. 15</p>
                <p style="margin: 5px 0; color: #7f8c8d;">Телефон: +7 (988) 888-88-88</p>
                <p style="margin: 5px 0; color: #7f8c8d;">Дата: ${orderData.date} Время: ${orderData.time}</p>
            </div>
            
            <hr style="border: 1px solid #ccc; margin: 20px 0;">
            
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #2c3e50;">ИНФОРМАЦИЯ О КЛИЕНТЕ</h3>
                <p style="margin: 5px 0;"><strong>Имя:</strong> ${orderData.name}</p>
                <p style="margin: 5px 0;"><strong>Телефон:</strong> ${orderData.phone}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.email}</p>
                <p style="margin: 5px 0;"><strong>Адрес:</strong> ${orderData.address}</p>
                ${orderData.comment ? `<p style="margin: 5px 0;"><strong>Комментарий:</strong> ${orderData.comment}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #2c3e50;">ТОВАРЫ</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #2980b9; color: white;">
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Товар</th>
                            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Кол-во</th>
                            <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Цена</th>
                            <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    orderData.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        const rowColor = index % 2 === 0 ? '#f8f9fa' : 'white';
        receiptHTML += `
            <tr style="background: ${rowColor};">
                <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${item.price} руб.</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${itemTotal} руб.</td>
            </tr>
        `;
    });

    receiptHTML += `
                    </tbody>
                </table>
            </div>
            
            <div style="text-align: right; margin-top: 20px;">
                <hr style="border: 1px solid #666; margin: 10px 0;">
                <p style="margin: 5px 0;">Товары: ${subtotal} руб.</p>
                <p style="margin: 5px 0;">Доставка: ${shipping} руб.</p>
                <p style="margin: 10px 0; font-size: 18px; font-weight: bold; color: #e74c3c;">
                    ИТОГО: ${total} руб.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #95a5a6; font-size: 12px;">
                <p>Спасибо за покупку в нашем магазине!</p>
                <p>Гарантия на товары: 14 дней с момента покупки</p>
                <p>Чек создан: ${new Date().toLocaleString('ru-RU')}</p>
            </div>
        </div>
        <div style="text-align: center; margin-top: 20px; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7;">
            <p style="margin: 0; color: #856404;">Сделайте скриншот этого окна для сохранения чека</p>
        </div>
    `;

    receiptContent.innerHTML = receiptHTML;
}

// Функционал корзины
function initializeCart() {
    // Загрузка корзины из localStorage
    cart = loadCart();

    // Инициализация кнопки перехода к товарам
    const goToProductsBtn = document.getElementById('go-to-products');
    if (goToProductsBtn) {
        goToProductsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const productsFilters = document.querySelector('.products-filters');
            if (productsFilters) {
                productsFilters.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }

    // Инициализация оформления заказа
    initializeCheckout();
    
    // Обновление отображения корзины
    updateCartDisplay();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация каталога товаров
    initializeProductsCatalog();
    
    // Инициализация корзины
    initializeCart();
    
    // Инициализация масок для форм
    if (typeof initializePhoneMasks === 'function') initializePhoneMasks();
    if (typeof initializeDateInputs === 'function') initializeDateInputs();
    if (typeof initializeCardMasks === 'function') initializeCardMasks();
    
    // Инициализация маски для поля имени владельца карты
    initializeCardHolderMask();
});