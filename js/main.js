/**
 * Ιερός Ναός Αγίου Παύλου Περιστερίου
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initTabs();

    // Initialize smooth scrolling
    initSmoothScroll();

    // Initialize gallery lightbox
    initGallery();

    // Handle URL hash for direct linking to tabs
    handleUrlHash();
});

/**
 * Tab Navigation System
 */
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Update URL hash without scrolling
            history.pushState(null, null, '#' + targetId);

            // Scroll to top of content smoothly
            window.scrollTo({
                top: document.querySelector('.main-nav').offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Handle URL Hash for Direct Linking
 */
function handleUrlHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const tab = document.querySelector(`.nav-tab[data-tab="${hash}"]`);
        if (tab) {
            tab.click();
        }
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleUrlHash);

/**
 * Smooth Scroll for Internal Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Simple Gallery Lightbox
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
}

function openLightbox(src, alt) {
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${src}" alt="${alt}">
            <p class="lightbox-caption">${alt}</p>
        </div>
    `;

    // Add styles dynamically
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
    `;

    const content = overlay.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        animation: zoomIn 0.3s ease;
    `;

    const closeBtn = overlay.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 36px;
        cursor: pointer;
        padding: 10px;
        line-height: 1;
    `;

    const image = overlay.querySelector('img');
    image.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    `;

    const caption = overlay.querySelector('.lightbox-caption');
    caption.style.cssText = `
        color: white;
        text-align: center;
        padding: 15px;
        font-size: 1.1rem;
    `;

    // Add close functionality
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target === closeBtn) {
            closeLightbox(overlay);
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function closeLightbox(overlay) {
    overlay.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
    }, 300);
}

// Add CSS animations for lightbox
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes zoomIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

/**
 * Lazy Loading for Images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Mobile Navigation Enhancement
 */
function initMobileNav() {
    const nav = document.querySelector('.nav-container');
    let startX;

    nav.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
    }, { passive: true });

    nav.addEventListener('touchmove', (e) => {
        const diff = startX - e.touches[0].pageX;
        nav.scrollLeft += diff * 0.5;
        startX = e.touches[0].pageX;
    }, { passive: true });
}

// Initialize mobile nav if on touch device
if ('ontouchstart' in window) {
    initMobileNav();
}

/**
 * Print functionality
 */
window.printPage = function() {
    window.print();
};
