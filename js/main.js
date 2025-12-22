// ============================================
// Sasuni Delicacies - Main JavaScript
// ============================================

// ========== Configuration ==========
const CONFIG = {
    // Update this with your actual WhatsApp number (include country code, no + or spaces)
    // Example: For +91 9876543210, use: 919876543210
    whatsappNumber: '919876543210', // CHANGE THIS TO YOUR WHATSAPP NUMBER
    whatsappMessage: 'Hi! I would like to know more about Sasuni Delicacies products.',
    productsFile: 'products.json',
    // Analytics Configuration
    googleAnalyticsId: '', // Add your GA4 Measurement ID (e.g., 'G-XXXXXXXXXX')
    facebookPixelId: ''    // Add your Facebook Pixel ID (optional)
};

// ========== Global Variables ==========
let allProducts = [];

// ========== Mobile Navigation Toggle ==========
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Load products if on products page or homepage
    loadProducts();

    // Setup product filters if on products page
    setupProductFilters();
});

// ========== WhatsApp Integration ==========
function openWhatsApp(productName = '') {
    let message = CONFIG.whatsappMessage;

    if (productName) {
        message = `Hi! I'm interested in ordering ${productName}. Can you provide more details?`;
    }

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ========== Load Products from JSON ==========
async function loadProducts() {
    try {
        const response = await fetch(CONFIG.productsFile);
        if (!response.ok) {
            throw new Error('Failed to load products');
        }

        const products = await response.json();

        // Load featured products on homepage
        const featuredContainer = document.getElementById('featuredProducts');
        if (featuredContainer) {
            displayFeaturedProducts(products, featuredContainer);
        }

        // Load all products on products page
        const bakingContainer = document.getElementById('bakingProducts');
        const powdersContainer = document.getElementById('powdersProducts');

        if (bakingContainer && powdersContainer) {
            displayProductsByCategory(products, bakingContainer, powdersContainer);
        }

    } catch (error) {
        console.error('Error loading products:', error);
        // Display a friendly message to users
        const containers = [
            document.getElementById('featuredProducts'),
            document.getElementById('bakingProducts'),
            document.getElementById('powdersProducts')
        ];

        containers.forEach(container => {
            if (container) {
                container.innerHTML = '<p style="text-align: center; color: #666;">Products will be displayed here. Please add your products to products.json file.</p>';
            }
        });
    }
}

// ========== Display Featured Products (Homepage) ==========
function displayFeaturedProducts(products, container) {
    // Show first 3 products as featured
    const featured = products.slice(0, 3);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// ========== Display Products by Category (Products Page) ==========
function displayProductsByCategory(products, bakingContainer, powdersContainer) {
    const bakingProducts = products.filter(p => p.category === 'Gluten-Free Baking');
    const powderProducts = products.filter(p => p.category === 'Traditional Powders');

    bakingContainer.innerHTML = bakingProducts.length > 0
        ? bakingProducts.map(product => createProductCard(product)).join('')
        : '<p style="text-align: center; color: #666;">No products in this category yet.</p>';

    powdersContainer.innerHTML = powderProducts.length > 0
        ? powderProducts.map(product => createProductCard(product)).join('')
        : '<p style="text-align: center; color: #666;">No products in this category yet.</p>';
}

// ========== Create Product Card HTML ==========
function createProductCard(product) {
    const features = product.features && product.features.length > 0
        ? `<ul class="product-features">
            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
           </ul>`
        : '';

    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${product.image
                    ? `<img src="${product.image}" alt="${product.name}">`
                    : `<p>Add product image</p>`
                }
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                ${features}
                ${product.price ? `<p class="product-price">${product.price}</p>` : ''}
                <button class="btn btn-primary" onclick="openWhatsApp('${product.name}')">
                    Order Now
                </button>
            </div>
        </div>
    `;
}

// ========== Product Filters (Products Page) ==========
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Get selected category
            const category = this.getAttribute('data-category');

            // Filter products
            filterProductCards(category);
        });
    });
}

function filterProductCards(category) {
    const categorySections = document.querySelectorAll('.category-section');

    if (category === 'all') {
        categorySections.forEach(section => {
            section.style.display = 'block';
        });
    } else {
        categorySections.forEach(section => {
            const heading = section.querySelector('h2').textContent;
            if (heading.includes(category)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }
}

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ========== Form Validation (Contact Form) ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Basic validation is handled by HTML5 required attributes
        // You can add custom validation here if needed
        console.log('Form submitted');
    });
}

// ========== Scroll to Top on Page Load ==========
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// ========== Add Animation on Scroll (Optional Enhancement) ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation (optional)
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.product-card, .highlight-card, .why-card, .testimonial-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ========== Back to Top Button ==========
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== Product Search ==========
function initProductSearch() {
    const searchInput = document.getElementById('productSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterProducts(searchTerm);
    });
}

function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    const categorySections = document.querySelectorAll('.category-section');
    let visibleCount = 0;

    productCards.forEach(card => {
        const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const productDesc = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        const productFeatures = Array.from(card.querySelectorAll('.product-features li'))
            .map(li => li.textContent.toLowerCase()).join(' ');

        const matches = productName.includes(searchTerm) ||
                       productDesc.includes(searchTerm) ||
                       productFeatures.includes(searchTerm);

        if (matches || searchTerm === '') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show "No results" message if no products match
    let noResultsMsg = document.querySelector('.no-results');
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = '<p>No products found matching your search. Try different keywords!</p>';
            document.querySelector('.products-section .container').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
        categorySections.forEach(section => section.style.display = 'none');
    } else {
        if (noResultsMsg) noResultsMsg.style.display = 'none';
        categorySections.forEach(section => section.style.display = 'block');
    }
}

// ========== Newsletter Form ==========
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;

        // Track newsletter signup
        trackEvent('Newsletter', 'Subscribe', email);

        // Show success message
        const submitBtn = newsletterForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribed! ✓';
        submitBtn.disabled = true;

        // Reset after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            emailInput.value = '';
        }, 3000);
    });
}

// ========== Loading Overlay ==========
function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => overlay.remove(), 500);
        }, 500);
    }
}

// ========== Lazy Loading Images ==========
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => img.classList.add('loaded'));
    }
}

// ========== Scroll Animations ==========
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');

    if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback - show all elements
        animatedElements.forEach(el => el.classList.add('visible'));
    }
}

// ========== Analytics Integration ==========
function initAnalytics() {
    // Google Analytics
    if (CONFIG.googleAnalyticsId) {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', CONFIG.googleAnalyticsId);
    }

    // Facebook Pixel
    if (CONFIG.facebookPixelId) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', CONFIG.facebookPixelId);
        fbq('track', 'PageView');
    }
}

function trackEvent(category, action, label) {
    // Google Analytics Event Tracking
    if (CONFIG.googleAnalyticsId && typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }

    // Facebook Pixel Event Tracking
    if (CONFIG.facebookPixelId && typeof fbq !== 'undefined') {
        fbq('trackCustom', category + '_' + action, {label: label});
    }
}

// Track WhatsApp clicks
const originalOpenWhatsApp = openWhatsApp;
openWhatsApp = function(productName = '') {
    trackEvent('Engagement', 'WhatsApp_Click', productName || 'General');
    originalOpenWhatsApp(productName);
};

// ========== Performance Monitoring ==========
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                    console.log(`Page loaded in ${(loadTime / 1000).toFixed(2)}s`);

                    // Track page load time
                    trackEvent('Performance', 'Page_Load_Time', `${Math.round(loadTime / 1000)}s`);
                }
            }, 0);
        });
    }
}

// ========== Initialize All Features ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize analytics first
    initAnalytics();

    // Initialize all features
    initBackToTop();
    initProductSearch();
    initNewsletterForm();
    initLazyLoading();
    initScrollAnimations();
    measurePerformance();

    // Hide loading overlay
    hideLoadingOverlay();

    // Track page view
    const pageName = document.title;
    trackEvent('Navigation', 'Page_View', pageName);
});

// ========== Service Worker Registration (PWA) ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// ========== Console Message ==========
console.log('%c🌾 Sasuni Delicacies Website', 'color: #8B6F47; font-size: 20px; font-weight: bold;');
console.log('%cRemember to update your WhatsApp number in js/main.js!', 'color: #C17A5C; font-size: 14px;');
console.log('%cEnhanced with SEO, Performance & Analytics', 'color: #8B9D83; font-size: 12px;');
