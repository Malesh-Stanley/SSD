// Active Navigation Link
document.addEventListener('DOMContentLoaded', () => {
    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu close on click
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});

// Add animation to elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .quick-link-item').forEach(element => {
    observer.observe(element);
});

// Cookie Consent
function showCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="btn btn-primary btn-sm" onclick="acceptCookies()">Accept</button>
                    <button class="btn btn-outline-primary btn-sm" onclick="declineCookies()">Decline</button>
                </div>
            </div>
        `;
        document.body.appendChild(cookieBanner);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.querySelector('.cookie-banner').remove();
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.querySelector('.cookie-banner').remove();
}

// Initialize cookie consent on page load
document.addEventListener('DOMContentLoaded', showCookieConsent);

// Add cookie banner styles
const style = document.createElement('style');
style.textContent = `
    .cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem;
        z-index: 1000;
    }
    .cookie-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    .cookie-buttons {
        display: flex;
        gap: 0.5rem;
    }
    @media (max-width: 768px) {
        .cookie-content {
            flex-direction: column;
            text-align: center;
        }
        .cookie-buttons {
            margin-top: 1rem;
        }
    }
`;
document.head.appendChild(style); 