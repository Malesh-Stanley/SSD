// Interactive Features and Analytics Tracking

// Image Gallery with Lightbox
class ImageGallery {
    constructor() {
        this.gallery = document.querySelector('.gallery-grid');
        this.lightbox = this.createLightbox();
        this.currentIndex = 0;
        this.images = [];
        
        if (this.gallery) {
            this.init();
        }
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-prev" aria-label="Previous image">&lt;</button>
                <button class="lightbox-next" aria-label="Next image">&gt;</button>
                <img src="" alt="" class="lightbox-image">
            </div>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    }

    init() {
        this.images = Array.from(this.gallery.querySelectorAll('img'));
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => this.openLightbox(index));
            // Track image clicks
            img.addEventListener('click', () => this.trackEvent('gallery_image_click', {
                image_index: index,
                image_src: img.src
            }));
        });

        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prevImage());
        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.nextImage());
    }

    openLightbox(index) {
        this.currentIndex = index;
        const img = this.images[index];
        this.lightbox.querySelector('.lightbox-image').src = img.src;
        this.lightbox.querySelector('.lightbox-image').alt = img.alt;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const img = this.images[this.currentIndex];
        this.lightbox.querySelector('.lightbox-image').src = img.src;
        this.lightbox.querySelector('.lightbox-image').alt = img.alt;
    }
}

// Accordion Component
class Accordion {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        const headers = this.element.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isOpen = header.classList.contains('active');

                // Close all other sections
                headers.forEach(h => {
                    if (h !== header) {
                        h.classList.remove('active');
                        h.nextElementSibling.style.maxHeight = null;
                    }
                });

                // Toggle current section
                header.classList.toggle('active');
                content.style.maxHeight = isOpen ? null : content.scrollHeight + 'px';

                // Track accordion interactions
                this.trackEvent('accordion_toggle', {
                    section: header.textContent.trim(),
                    action: isOpen ? 'close' : 'open'
                });
            });
        });
    }

    trackEvent(eventName, eventData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }
}

// Enhanced Analytics Tracking
class Analytics {
    constructor() {
        this.init();
    }

    init() {
        // Track page views
        this.trackPageView();

        // Track user interactions
        this.trackUserInteractions();

        // Track form submissions
        this.trackFormSubmissions();

        // Track scroll depth
        this.trackScrollDepth();

        // Track time on page
        this.trackTimeOnPage();
    }

    trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn, a');
            if (button) {
                this.trackEvent('button_click', {
                    button_text: button.textContent.trim(),
                    button_id: button.id,
                    button_class: button.className
                });
            }
        });

        // Track navigation clicks
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('navigation_click', {
                    link_text: link.textContent.trim(),
                    link_href: link.href
                });
            });
        });
    }

    trackFormSubmissions() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                this.trackEvent('form_submission', {
                    form_id: form.id,
                    form_action: form.action
                });
            });
        });
    }

    trackScrollDepth() {
        let maxScroll = 0;
        const scrollThresholds = [25, 50, 75, 100];

        window.addEventListener('scroll', throttle(() => {
            const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track when user reaches certain scroll depths
                scrollThresholds.forEach(threshold => {
                    if (maxScroll >= threshold && maxScroll < threshold + 25) {
                        this.trackEvent('scroll_depth', {
                            depth: threshold
                        });
                    }
                });
            }
        }, 1000));
    }

    trackTimeOnPage() {
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('time_on_page', {
                seconds: timeSpent
            });
        });
    }

    trackEvent(eventName, eventData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize image gallery
    new ImageGallery();

    // Initialize accordions
    document.querySelectorAll('.accordion').forEach(accordion => {
        new Accordion(accordion);
    });

    // Initialize analytics
    new Analytics();
}); 