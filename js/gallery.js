// Gallery Enhancements
class GalleryEnhancer {
    constructor() {
        this.galleryContainer = document.querySelector('.gallery-container');
        this.filterButtons = document.querySelectorAll('.gallery-filter');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // Initialize Masonry layout
        this.initMasonry();
        
        // Initialize lazy loading
        this.initLazyLoading();
        
        // Initialize filtering
        this.initFiltering();
        
        // Initialize lightbox
        this.initLightbox();
        
        // Initialize infinite scroll
        this.initInfiniteScroll();
        
        // Initialize image optimization
        this.initImageOptimization();
    }

    initMasonry() {
        if (this.galleryContainer) {
            const masonry = new Masonry(this.galleryContainer, {
                itemSelector: '.gallery-item',
                columnWidth: '.gallery-sizer',
                percentPosition: true,
                gutter: 20
            });

            // Refresh layout after images load
            imagesLoaded(this.galleryContainer).on('progress', () => {
                masonry.layout();
            });
        }
    }

    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
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

    initFiltering() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get filter value
                this.currentFilter = button.dataset.filter;
                
                // Filter items
                this.filterItems();
            });
        });
    }

    filterItems() {
        this.galleryItems.forEach(item => {
            if (this.currentFilter === 'all' || item.dataset.category === this.currentFilter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Refresh masonry layout
        if (this.galleryContainer) {
            const masonry = Masonry.data(this.galleryContainer);
            if (masonry) {
                masonry.layout();
            }
        }
    }

    initLightbox() {
        // Initialize lightbox with custom options
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': 'Image %1 of %2',
            'fadeDuration': 300,
            'imageFadeDuration': 300,
            'disableScrolling': true
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                lightbox.close();
            }
        });
    }

    initInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadMoreItems();
                }
            });
        }, {
            rootMargin: '100px'
        });

        const loadTrigger = document.querySelector('.load-more-trigger');
        if (loadTrigger) {
            observer.observe(loadTrigger);
        }
    }

    async loadMoreItems() {
        try {
            // Show loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.galleryContainer.appendChild(loadingIndicator);

            // Simulate API call (replace with actual API endpoint)
            const response = await fetch('/api/gallery/load-more');
            const newItems = await response.json();

            // Add new items to gallery
            newItems.forEach(item => {
                const galleryItem = this.createGalleryItem(item);
                this.galleryContainer.appendChild(galleryItem);
            });

            // Remove loading indicator
            loadingIndicator.remove();

            // Refresh masonry layout
            const masonry = Masonry.data(this.galleryContainer);
            if (masonry) {
                masonry.layout();
            }
        } catch (error) {
            console.error('Error loading more items:', error);
        }
    }

    createGalleryItem(item) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.category = item.category;
        
        div.innerHTML = `
            <a href="${item.fullSize}" data-lightbox="gallery" data-title="${item.title}">
                <img src="${item.thumbnail}" alt="${item.title}" class="lazy" data-src="${item.thumbnail}">
                <div class="gallery-overlay">
                    <h5>${item.title}</h5>
                    <p>${item.date}</p>
                    <div class="gallery-meta">
                        <span><i class="fas fa-heart"></i> ${item.likes}</span>
                        <span><i class="fas fa-comment"></i> ${item.comments}</span>
                    </div>
                </div>
            </a>
        `;
        
        return div;
    }

    initImageOptimization() {
        // Add responsive image sizes
        const images = document.querySelectorAll('.gallery-item img');
        images.forEach(img => {
            img.sizes = '(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw';
            img.srcset = `
                ${img.dataset.src}-small.jpg 300w,
                ${img.dataset.src}-medium.jpg 600w,
                ${img.dataset.src}-large.jpg 900w
            `;
        });
    }
}

// Initialize gallery enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryEnhancer();
}); 