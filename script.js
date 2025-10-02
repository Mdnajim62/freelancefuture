document.addEventListener('DOMContentLoaded', function() {
    
    // --- CONFIGURATION ---
    const WHATSAPP_NUMBER = "8801829994457";
    const COUNTDOWN_DURATION = (2 * 3600 + 37 * 60 + 59) * 1000;
    // IMPORTANT: You MUST replace this with a real endpoint for the form to work.
    // For GitHub pages, you can use a service like Formspree, Getform, or a serverless function.
    const FORM_ACTION_URL = "REPLACE_WITH_YOUR_FORM_ENDPOINT_URL"; 

    // --- ELEMENTS ---
    const countdownEl = document.getElementById('countdown');
    const priceEl = document.getElementById('price-main');
    const orderForm = document.getElementById('order-form');
    const submitButton = document.getElementById('submit-button');
    const paymentWrapper = document.querySelector('.payment-wrapper');
    const thankYouPanel = document.getElementById('thank-you-panel');
    const fallbackPanel = document.getElementById('fallback-panel');
    const whatsappSupportSuccess = document.getElementById('whatsapp-support-link-success');
    const whatsappSupportFallback = document.getElementById('whatsapp-support-link-fallback');

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
                // Optionally disable CTAs
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

    // --- FORM SUBMISSION LOGIC ---
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitButton.disabled = true;
            submitButton.textContent = 'প্রসেসিং...';

            const formData = new FormData(orderForm);
            const data = Object.fromEntries(formData.entries());

            fetch(FORM_ACTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    paymentWrapper.style.display = 'none';
                    thankYouPanel.style.display = 'block';
                    localStorage.removeItem('failed_submission');
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(error => {
                console.error('Submission Error:', error);
                localStorage.setItem('failed_submission', JSON.stringify(data));
                paymentWrapper.style.display = 'none';
                fallbackPanel.style.display = 'block';
            });
        });
    }

    // --- WHATSAPP LINKS ---
    if (whatsappSupportSuccess && whatsappSupportFallback) {
         const whatsappLinkBase = `https://wa.me/${WHATSAPP_NUMBER}`;
         whatsappSupportSuccess.href = whatsappLinkBase;
         whatsappSupportFallback.href = whatsappLinkBase;
    }
   
    // --- INITIALIZATION ---
    startCountdown();
    // Check for a previously failed submission
    if (localStorage.getItem('failed_submission')) {
        paymentWrapper.style.display = 'none';
        fallbackPanel.style.display = 'block';
    }
});
