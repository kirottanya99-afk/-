// Данные для админ панели
        let adminData = {
            repairRequests: [],
            serviceRequests: [],
            productOrders: [],
            reviews: []
        };
        
        // Загрузка данных из localStorage
        function loadAdminData() {
            try {
                // Загрузка заявок на ремонт с главной страницы
                const repairData = localStorage.getItem('repairRequests');
                adminData.repairRequests = repairData ? JSON.parse(repairData) : [];
                
                // Загрузка заявок на услуги
                const serviceData = localStorage.getItem('serviceRequests');
                adminData.serviceRequests = serviceData ? JSON.parse(serviceData) : [];
                
                // Загрузка заказов товаров
                const orderData = localStorage.getItem('productOrders');
                adminData.productOrders = orderData ? JSON.parse(orderData) : [];
                
                // Загрузка отзывов
                const reviewData = localStorage.getItem('reviews');
                adminData.reviews = reviewData ? JSON.parse(reviewData) : [];
                
                updateStats();
                renderTables();
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        }
        
        // Обновление статистики
        function updateStats() {
            const totalRequests = adminData.repairRequests.length + adminData.serviceRequests.length;
            const newRequests = adminData.repairRequests.filter(req => req.status === 'new').length +
                              adminData.serviceRequests.filter(req => req.status === 'new').length;
            const totalOrders = adminData.productOrders.length;
            
            // Расчет общей выручки из заказов товаров
            const totalRevenue = adminData.productOrders.reduce((sum, order) => {
                if (order.total && typeof order.total === 'string') {
                    const orderTotal = parseInt(order.total.replace(/\D/g, ''));
                    return sum + (isNaN(orderTotal) ? 0 : orderTotal);
                }
                return sum;
            }, 0);
            
            document.getElementById('total-requests').textContent = totalRequests;
            document.getElementById('new-requests').textContent = newRequests;
            document.getElementById('total-orders').textContent = totalOrders;
            document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString();
        }
        
        // Рендеринг таблиц
        function renderTables() {
            renderRepairRequests();
            renderServiceRequests();
            renderProductOrders();
            renderReviews();
        }
        
        // Рендеринг заявок на ремонт
        function renderRepairRequests() {
            const tbody = document.getElementById('requests-table-body');
            const statusFilter = document.getElementById('request-status').value;
            const dateFilter = document.getElementById('request-date').value;
            
            let filteredRequests = adminData.repairRequests;
            
            if (statusFilter !== 'all') {
                filteredRequests = filteredRequests.filter(req => req.status === statusFilter);
            }
            
            if (dateFilter) {
                filteredRequests = filteredRequests.filter(req => req.date === dateFilter);
            }
            
            if (filteredRequests.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="empty-data">Нет данных о заявках</td></tr>';
                return;
            }
            
            tbody.innerHTML = filteredRequests.map(request => `
                <tr>
                    <td class="cell-limited">${request.id || 'N/A'}</td>
                    <td>${request.name || 'Не указано'}</td>
                    <td>${request.phone || 'Не указано'}</td>
                    <td>${request.car || 'Не указано'}</td>
                    <td class="cell-description">
                        <div class="truncate-text" title="${request.problem || ''}">
                            ${request.problem || ''}
                        </div>
                    </td>
                    <td>${request.date || new Date().toLocaleDateString('ru-RU')}</td>
                    <td><span class="status-badge status-${request.status || 'new'}">${getStatusText(request.status)}</span></td>
                    <td class="cell-actions">
                        ${request.status !== 'completed' ? `
                            <button class="btn btn-primary btn-small" onclick="changeRequestStatus('${request.id}', 'processed')">В работу</button>
                            <button class="btn btn-success btn-small" onclick="changeRequestStatus('${request.id}', 'completed')">Завершить</button>
                        ` : ''}
                        <button class="btn btn-danger btn-small" onclick="deleteRequest('${request.id}')">Удалить</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Рендеринг заявок на услуги
        function renderServiceRequests() {
            const tbody = document.getElementById('services-table-body');
            
            if (adminData.serviceRequests.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="empty-data">Нет данных о заявках на услуги</td></tr>';
                return;
            }
            
            tbody.innerHTML = adminData.serviceRequests.map(request => `
                <tr>
                    <td class="cell-limited">${request.id || 'N/A'}</td>
                    <td>${request.name || 'Не указано'}</td>
                    <td>${request.phone || 'Не указано'}</td>
                    <td>${request.car || 'Не указано'}</td>
                    <td class="cell-products">
                        <div class="products-list">
                            ${request.services ? request.services.map(service => `
                                <div class="product-item">
                                    ${service.name} (${service.quantity} шт.) - ${service.price} руб.
                                </div>
                            `).join('') : 'N/A'}
                        </div>
                    </td>
                    <td>${request.totalPrice || 0} руб.</td>
                    <td>${request.date || new Date().toLocaleDateString('ru-RU')}</td>
                    <td><span class="status-badge status-${request.status || 'new'}">${getStatusText(request.status)}</span></td>
                    <td class="cell-actions">
                        ${request.status !== 'completed' ? `
                            <button class="btn btn-primary btn-small" onclick="changeServiceStatus('${request.id}', 'processed')">В работу</button>
                            <button class="btn btn-success btn-small" onclick="changeServiceStatus('${request.id}', 'completed')">Завершить</button>
                        ` : ''}
                        <button class="btn btn-danger btn-small" onclick="deleteServiceRequest('${request.id}')">Удалить</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Рендеринг заказов товаров
        function renderProductOrders() {
            const tbody = document.getElementById('orders-table-body');
            
            if (adminData.productOrders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="empty-data">Нет данных о заказах</td></tr>';
                return;
            }
            
            tbody.innerHTML = adminData.productOrders.map(order => `
                <tr>
                    <td class="cell-limited">${order.id || 'N/A'}</td>
                    <td>${order.name || 'Не указано'}</td>
                    <td>${order.phone || 'Не указано'}</td>
                    <td>${order.email || 'Не указано'}</td>
                    <td class="cell-products">
                        <div class="products-list">
                            ${order.items ? order.items.map(item => `
                                <div class="product-item">
                                    ${item.name} (${item.quantity} шт.) - ${item.price} руб.
                                </div>
                            `).join('') : 'N/A'}
                        </div>
                    </td>
                    <td>${order.total || '0 руб.'}</td>
                    <td>${order.date || new Date().toLocaleDateString('ru-RU')}</td>
                    <td><span class="status-badge status-${order.status || 'new'}">${getStatusText(order.status)}</span></td>
                    <td class="cell-actions">
                        ${order.status !== 'completed' ? `
                            <button class="btn btn-primary btn-small" onclick="changeOrderStatus('${order.id}', 'processed')">В работу</button>
                            <button class="btn btn-success btn-small" onclick="changeOrderStatus('${order.id}', 'completed')">Завершить</button>
                        ` : ''}
                        <button class="btn btn-danger btn-small" onclick="deleteOrder('${order.id}')">Удалить</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Рендеринг отзывов
        function renderReviews() {
            const tbody = document.getElementById('reviews-table-body');
            
            if (adminData.reviews.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="empty-data">Нет данных об отзывах</td></tr>';
                return;
            }
            
            tbody.innerHTML = adminData.reviews.map(review => `
                <tr>
                    <td class="cell-limited">${review.id || 'N/A'}</td>
                    <td>${review.name || 'Аноним'}</td>
                    <td>${'★'.repeat(review.rating || 5)}${'☆'.repeat(5 - (review.rating || 5))}</td>
                    <td class="cell-description">
                        <div class="truncate-text" title="${review.text || ''}">
                            ${review.text || ''}
                        </div>
                    </td>
                    <td>${review.date || new Date().toLocaleDateString('ru-RU')}</td>
                    <td><span class="status-badge status-${review.status || 'new'}">${getStatusText(review.status)}</span></td>
                    <td class="cell-actions">
                        ${review.status !== 'completed' ? `
                            <button class="btn btn-primary btn-small" onclick="publishReview('${review.id}')">Опубликовать</button>
                            <button class="btn btn-success btn-small" onclick="completeReview('${review.id}')">Завершить</button>
                        ` : ''}
                        <button class="btn btn-danger btn-small" onclick="deleteReview('${review.id}')">Удалить</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Вспомогательные функции
        function getStatusText(status) {
            const statusMap = {
                'new': 'Новый',
                'processed': 'В обработке',
                'completed': 'Завершен',
                'published': 'Опубликован'
            };
            return statusMap[status] || 'Новый';
        }
        
        function filterRequests() {
            renderRepairRequests();
        }
        
        function resetFilters() {
            document.getElementById('request-status').value = 'all';
            document.getElementById('request-date').value = '';
            renderRepairRequests();
        }
        
        // Функции изменения статусов
        function changeRequestStatus(requestId, newStatus) {
            const request = adminData.repairRequests.find(req => req.id === requestId);
            if (request) {
                request.status = newStatus;
                localStorage.setItem('repairRequests', JSON.stringify(adminData.repairRequests));
                loadAdminData();
            }
        }
        
        function changeServiceStatus(requestId, newStatus) {
            const request = adminData.serviceRequests.find(req => req.id === requestId);
            if (request) {
                request.status = newStatus;
                localStorage.setItem('serviceRequests', JSON.stringify(adminData.serviceRequests));
                loadAdminData();
            }
        }
        
        function changeOrderStatus(orderId, newStatus) {
            const order = adminData.productOrders.find(ord => ord.id === orderId);
            if (order) {
                order.status = newStatus;
                localStorage.setItem('productOrders', JSON.stringify(adminData.productOrders));
                loadAdminData();
            }
        }
        
        function publishReview(reviewId) {
            const review = adminData.reviews.find(rev => rev.id === reviewId);
            if (review) {
                review.status = 'published';
                localStorage.setItem('reviews', JSON.stringify(adminData.reviews));
                loadAdminData();
            }
        }
        
        function completeReview(reviewId) {
            const review = adminData.reviews.find(rev => rev.id === reviewId);
            if (review) {
                review.status = 'completed';
                localStorage.setItem('reviews', JSON.stringify(adminData.reviews));
                loadAdminData();
            }
        }
        
        // Функции удаления
        function deleteRequest(requestId) {
            if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
                adminData.repairRequests = adminData.repairRequests.filter(req => req.id !== requestId);
                localStorage.setItem('repairRequests', JSON.stringify(adminData.repairRequests));
                loadAdminData();
            }
        }
        
        function deleteServiceRequest(requestId) {
            if (confirm('Вы уверены, что хотите удалить эту заявку на услугу?')) {
                adminData.serviceRequests = adminData.serviceRequests.filter(req => req.id !== requestId);
                localStorage.setItem('serviceRequests', JSON.stringify(adminData.serviceRequests));
                loadAdminData();
            }
        }
        
        function deleteOrder(orderId) {
            if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
                adminData.productOrders = adminData.productOrders.filter(ord => ord.id !== orderId);
                localStorage.setItem('productOrders', JSON.stringify(adminData.productOrders));
                loadAdminData();
            }
        }
        
        function deleteReview(reviewId) {
            if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
                adminData.reviews = adminData.reviews.filter(rev => rev.id !== reviewId);
                localStorage.setItem('reviews', JSON.stringify(adminData.reviews));
                loadAdminData();
            }
        }
        
        // Инициализация админ панели
        document.addEventListener('DOMContentLoaded', function() {
            loadAdminData();
            
            setInterval(loadAdminData, 5000);
        });