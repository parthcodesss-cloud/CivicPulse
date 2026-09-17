/* ============================================
   CivicPulse — Theme Manager
   Dark/light mode toggle with persistence.
   ============================================ */

const ThemeManager = (() => {
    'use strict';

    const THEME_KEY = 'theme';
    let currentTheme = 'light';

    function init() {
        // Check user preference
        const user = DataService.getCurrentUser();
        const saved = user.preferences?.theme;

        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        currentTheme = saved || (prefersDark ? 'dark' : 'light');
        applyTheme(currentTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!saved) {
                currentTheme = e.matches ? 'dark' : 'light';
                applyTheme(currentTheme);
            }
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;
        updateToggleIcon();
    }

    function toggle() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        DataService.updateUserPreferences({ theme: currentTheme });
        return currentTheme;
    }

    function getTheme() {
        return currentTheme;
    }

    function updateToggleIcon() {
        const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
        toggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = currentTheme === 'light'
                    ? 'fa-solid fa-moon'
                    : 'fa-solid fa-sun';
            }
            btn.setAttribute('aria-label', `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`);
        });
    }

    return { init, toggle, getTheme, applyTheme };
})();
