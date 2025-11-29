// Функционал для главной страницы

// Инициализация слайдера
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Функция для показа слайда
    function showSlide(n) {

        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        

        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        

        if (n >= slides.length) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = n;
        }
        

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Функция для перехода к следующему слайду
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Функция для перехода к предыдущему слайду
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Автоматическое переключение слайдов
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Остановка автоматического переключения
    function stopSlideShow() {
        clearInterval(slideInterval);
    }


    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideShow();
            startSlideShow();
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideShow();
            startSlideShow();
        });
    }


    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
            stopSlideShow();
            startSlideShow();
        });
    });


    showSlide(0);
    

    startSlideShow();


    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopSlideShow);
        slider.addEventListener('mouseleave', startSlideShow);
    }
}

// Инициализация анимаций при прокрутке
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.welcome-section, .request-section, .reviews-section');
    
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
    

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s, transform 0.8s';
    });
    

    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeScrollAnimations();
});