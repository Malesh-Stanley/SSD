// Gallery Enhancements
class GalleryEnhancer {
    constructor() {
        this.galleryContainer = document.querySelector('.gallery-container');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.filters = document.querySelectorAll('.gallery-filter');
        this.loadMoreTrigger = document.querySelector('.load-more-trigger');
        this.observer = null;
        this.masonry = null;
        this.init();
    }

    init() {
        this.setupMasonry();
        this.setupLazyLoading();
        this.setupFilters();
        this.setupInfiniteScroll();
        this.setupLightbox();
        this.setupImageOptimization();
        this.setupPerformanceOptimizations();
    }

    setupMasonry() {
        if (typeof Masonry !== 'undefined') {
            this.masonry = new Masonry(this.galleryContainer, {
                itemSelector: '.gallery-item',
                columnWidth: '.gallery-sizer',
                percentPosition: true,
                gutter: 10,
                transitionDuration: '0.3s',
                stagger: 30,
                initLayout: false
            });

            // Initialize layout after images are loaded
            imagesLoaded(this.galleryContainer).on('progress', () => {
                this.masonry.layout();
            });
        }
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            img.src = src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            
                            // Trigger masonry layout after image loads
                            img.onload = () => {
                                if (this.masonry) {
                                    this.masonry.layout();
                                }
                            };
                        }
                        
                        this.observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            document.querySelectorAll('.gallery-item img.lazy').forEach(img => {
                this.observer.observe(img);
            });
        }
    }

    setupFilters() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.dataset.filter;
                
                // Update active state
                this.filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                // Filter items
                this.galleryItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'block';
                        item.classList.add('visible');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('visible');
                    }
                });
                
                // Re-layout masonry
                if (this.masonry) {
                    this.masonry.layout();
                }
            });
        });
    }

    setupInfiniteScroll() {
        if (this.loadMoreTrigger && 'IntersectionObserver' in window) {
            const loadMoreObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadMoreItems();
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });

            loadMoreObserver.observe(this.loadMoreTrigger);
        }
    }

    async loadMoreItems() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator visible';
        loadingIndicator.textContent = 'Loading more items...';
        this.galleryContainer.appendChild(loadingIndicator);

        try {
            // Simulate API call
            const newItems = await this.fetchMoreItems();
            
            // Remove loading indicator
            loadingIndicator.remove();
            
            // Add new items
            newItems.forEach(item => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.dataset.category = item.category;
                galleryItem.innerHTML = `
                    <a href="${item.image}" data-lightbox="gallery" data-title="${item.title}">
                        <img src="${item.thumbnail}" alt="${item.title}" class="lazy" data-src="${item.image}">
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
                
                this.galleryContainer.appendChild(galleryItem);
                
                // Observe new images for lazy loading
                const img = galleryItem.querySelector('img');
                if (this.observer) {
                    this.observer.observe(img);
                }
            });
            
            // Re-layout masonry
            if (this.masonry) {
                this.masonry.reloadItems();
                this.masonry.layout();
            }
        } catch (error) {
            console.error('Error loading more items:', error);
            loadingIndicator.textContent = 'Error loading items. Please try again.';
        }
    }

    setupLightbox() {
        if (typeof lightbox !== 'undefined') {
            lightbox.option({
                'resizeDuration': 200,
                'wrapAround': true,
                'albumLabel': 'Image %1 of %2',
                'fadeDuration': 300,
                'imageFadeDuration': 300
            });
        }
    }

    setupImageOptimization() {
        // Add responsive image sizes
        this.galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                const srcset = `
                    ${img.dataset.src}?w=300 300w,
                    ${img.dataset.src}?w=600 600w,
                    ${img.dataset.src}?w=900 900w
                `;
                img.setAttribute('srcset', srcset);
                img.setAttribute('sizes', '(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw');
            }
        });
    }

    setupPerformanceOptimizations() {
        // Debounce scroll and resize events
        let timeout;
        window.addEventListener('scroll', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.masonry) {
                    this.masonry.layout();
                }
            }, 100);
        });

        window.addEventListener('resize', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.masonry) {
                    this.masonry.layout();
                }
            }, 100);
        });
    }

    async fetchMoreItems() {
        // Simulate API call with timeout
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        image: 'img/gallery/cultural-2.jpg',
                        thumbnail: 'img/gallery/cultural-2-thumb.jpg',
                        title: 'Cultural Festival',
                        date: 'April 2024',
                        category: 'cultural',
                        likes: 156,
                        comments: 23
                    },
                    // Add more sample items as needed
                ]);
            }, 1000);
        });
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryEnhancer();
}); 