/* ============================================
   CivicPulse — App Initialization
   Global bootstrap. Runs on every page.
   ============================================ */

const App = (() => {
    'use strict';

    function init() {
        // 1. Initialize data layer
        DataService.init();

        // 2. Load seed data if first visit
        SeedData.loadIfNeeded();

        // 3. Initialize auth
        Auth.init();

        // 4. Initialize theme
        ThemeManager.init();

        // 5. Render shared components
        Components.renderNavbar();
        Components.renderFooter();

        // 6. Highlight active nav
        Router.highlightActiveNav();

        // 7. Close mobile nav on link click
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.mobile-nav__link');
            if (link) {
                const mobileNav = document.getElementById('mobileNav');
                if (mobileNav) mobileNav.classList.remove('open');
            }
        });

        // 8. Close mobile nav on window resize
        window.addEventListener('resize', CivicUtils.debounce(() => {
            if (window.innerWidth > 768) {
                const mobileNav = document.getElementById('mobileNav');
                if (mobileNav) mobileNav.classList.remove('open');
                const toggle = document.getElementById('mobileMenuToggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    const icon = toggle.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-bars';
                }
            }
        }, 200));

        // 9. Register Service Worker (for PWA Installability)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker registered', reg))
                .catch(err => console.error('Service Worker registration failed', err));
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { init };
})();
