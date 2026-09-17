/* ============================================
   CivicPulse — Router Utilities
   Simple page-level routing helpers.
   ============================================ */

const Router = (() => {
    'use strict';

    const pages = {
        home: 'index.html',
        dashboard: 'dashboard.html',
        'report-new': 'report-new.html',
        reports: 'reports.html',
        'report-detail': 'report-detail.html',
        analytics: 'analytics.html',
        profile: 'profile.html',
        admin: 'admin.html',
        settings: 'settings.html'
    };

    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '') || 'index';
    }

    function navigateTo(page, params = {}) {
        let url = pages[page] || page;
        if (!url.includes('.html')) url += '.html';

        const queryString = Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');

        if (queryString) {
            url += '?' + queryString;
        }

        window.location.href = url;
    }

    function goToReportDetail(reportId) {
        navigateTo('report-detail', { id: reportId });
    }

    function goToReports(filters = {}) {
        navigateTo('reports', filters);
    }

    function highlightActiveNav() {
        const current = getCurrentPage();
        const navLinks = document.querySelectorAll('.navbar__link, .mobile-nav__link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            const linkPage = href.replace('.html', '').split('?')[0];

            if (linkPage === current ||
                (current === 'index' && (linkPage === 'index' || linkPage === '')) ||
                (current === 'report-detail' && linkPage === 'reports')) {
                link.classList.add('active');
            }
        });
    }

    return {
        getCurrentPage,
        navigateTo,
        goToReportDetail,
        goToReports,
        highlightActiveNav
    };
})();
