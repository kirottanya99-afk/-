// Функционал для страницы "О нас"

// Анимация счетчиков статистики
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const duration = 2000; 
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
    
    // Запуск анимации при прокрутке до секции
    function checkScroll() {
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;
        
        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 100) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });

            window.removeEventListener('scroll', checkScroll);
        }
    }
    
    window.addEventListener('scroll', checkScroll);

    checkScroll();
}

// Анимация появления элементов при прокрутке
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.about-section, .advantages-section, .team-section, .certificates-section');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Устанавливаем начальные стили для анимированных элементов
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s, transform 0.8s';
    });
    
    // Проверяем положение элементов при загрузке и прокрутке
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeStatsCounter();
    initializeScrollAnimations();
});