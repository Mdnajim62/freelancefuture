document.addEventListener('DOMContentLoaded', function() {
    
    // --- CONFIGURATION ---
    const WHATSAPP_NUMBER = "8801829994457";
    const COUNTDOWN_DURATION = (2 * 3600 + 37 * 60 + 59) * 1000;
    
    // --- NOTE: Form submission is now handled by Web3Forms via HTML action attribute. ---
    // --- No form submission JavaScript is needed anymore. ---

    // --- ELEMENTS ---
    const countdownEl = document.getElementById('countdown');
    const priceEl = document.getElementById('price-main');
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('youtube-video');
    const closeModalButton = document.querySelector('.close-button');
    const videoPlayTriggers = document.querySelectorAll('.video-testimonial');

    // --- SMOOTH SCROLL FOR CTA ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetEl = document.querySelector(this.getAttribute('href'));
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- ON-SCROLL ANIMATION ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });
    animatedElements.forEach(el => observer.observe(el));

    // --- COUNTDOWN TIMER LOGIC ---
    function startCountdown() {
        let endTime = localStorage.getItem('countdownEndTime');
        if (!endTime || new Date().getTime() > endTime) {
            endTime = new Date().getTime() + COUNTDOWN_DURATION;
            localStorage.setItem('countdownEndTime', endTime);
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(interval);
                countdownEl.textContent = "অফার শেষ";
                if(priceEl) priceEl.textContent = "499";
                document.querySelectorAll('.cta-button').forEach(btn => {
                    btn.style.background = '#9ca3af';
                    btn.style.pointerEvents = 'none';
                    btn.textContent = 'অফারটি শেষ হয়ে গেছে';
                });
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownEl.textContent = `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
        }, 1000);
    }
    
    // --- FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // --- VIDEO MODAL LOGIC ---
    if (videoPlayTriggers.length > 0) {
        videoPlayTriggers.forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                const videoId = trigger.getAttribute('data-video-id');
                if (videoId && videoModal && videoIframe) {
                    videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    videoModal.style.display = 'block';
                }
            });
        });
    }

    function closeModal() {
        if(videoModal && videoIframe) {
            videoModal.style.display = 'none';
            videoIframe.src = ''; // Stop the video
        }
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target == videoModal) {
            closeModal();
        }
    });
   
    // --- INITIALIZATION ---
    startCountdown();
});
