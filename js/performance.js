// Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimize Scroll Events
const scrollHandler = throttle(() => {
    // Your scroll handling code here
}, 100);

window.addEventListener('scroll', scrollHandler, { passive: true });

// Optimize Resize Events
const resizeHandler = debounce(() => {
    // Your resize handling code here
}, 250);

window.addEventListener('resize', resizeHandler, { passive: true });

// Preload Critical Resources
function preloadResources() {
    const resources = [
        'css/styles.css',
        'css/accessibility.css',
        'js/main.js',
        'js/form-handling.js'
    ];

    resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Initialize Performance Optimizations
document.addEventListener('DOMContentLoaded', () => {
    preloadResources();
    
    // Add loading state to forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...';
            }
        });
    });

    // Optimize Images
    document.querySelectorAll('img').forEach(img => {
        // Add loading="lazy" to images below the fold
        if (img.getBoundingClientRect().top > window.innerHeight) {
            img.loading = 'lazy';
        }

        // Add width and height attributes to prevent layout shifts
        if (!img.width && !img.height) {
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;
        }
    });

    // Cache DOM Elements
    const cache = new Map();
    function getElement(selector) {
        if (!cache.has(selector)) {
            cache.set(selector, document.querySelector(selector));
        }
        return cache.get(selector);
    }

    // Optimize Event Listeners
    document.addEventListener('click', (e) => {
        // Use event delegation for better performance
        const target = e.target;
        if (target.matches('.btn')) {
            // Handle button clicks
        }
    });

    // Add Resource Hints
    const hints = [
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];

    hints.forEach(hint => {
        const link = document.createElement('link');
        Object.entries(hint).forEach(([key, value]) => {
            link[key] = value;
        });
        document.head.appendChild(link);
    });
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Performance Monitoring
if (window.performance) {
    window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);

        // Send performance metrics to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance', {
                'page_load_time': pageLoadTime,
                'dom_content_loaded': timing.domContentLoadedEventEnd - timing.navigationStart,
                'first_paint': performance.getEntriesByType('paint')[0]?.startTime
            });
        }
    });
} 