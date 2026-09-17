/* ============================================
   CivicPulse — Landing Page Controller
   ============================================ */

const LandingPage = (() => {
    'use strict';

    function init() {
        renderHeroStats();
        renderCategories();
        renderStatsPreview();
        renderRecentReports();
    }

    function renderHeroStats() {
        const container = document.getElementById('heroStats');
        if (!container) return;

        const stats = DataService.getStatistics();

        container.innerHTML = `
            <div class="hero__stat">
                <div class="hero__stat-value counter-value" data-counter="${stats.total}">${stats.total}</div>
                <div class="hero__stat-label">Reports Filed</div>
            </div>
            <div class="hero__stat">
                <div class="hero__stat-value counter-value" data-counter="${stats.resolved}">${stats.resolved}</div>
                <div class="hero__stat-label">Issues Resolved</div>
            </div>
            <div class="hero__stat">
                <div class="hero__stat-value counter-value" data-counter="${stats.totalConfirmations}">${stats.totalConfirmations}</div>
                <div class="hero__stat-label">Community Confirmations</div>
            </div>
            <div class="hero__stat">
                <div class="hero__stat-value counter-value" data-counter="${stats.resolutionRate}" data-counter-suffix="%">${stats.resolutionRate}%</div>
                <div class="hero__stat-label">Resolution Rate</div>
            </div>
        `;
    }

    function renderCategories() {
        const container = document.getElementById('categoriesGrid');
        if (!container) return;

        container.innerHTML = CivicUtils.CATEGORIES.map(cat => `
            <a href="reports.html?category=${cat.id}" class="category-card">
                <div class="category-card__icon">${cat.emoji}</div>
                <div class="category-card__label">${cat.label}</div>
            </a>
        `).join('');
    }

    function renderStatsPreview() {
        const container = document.getElementById('statsPreview');
        if (!container) return;

        const stats = DataService.getStatistics();
        const mostCategory = stats.mostReportedCategory
            ? CivicUtils.getCategoryById(stats.mostReportedCategory.id)
            : null;

        container.innerHTML = `
            ${Components.renderStatCard('fa-file-lines', stats.total, 'Total Reports', 'accent')}
            ${Components.renderStatCard('fa-exclamation-circle', stats.openIssues, 'Open Issues', 'warning')}
            ${Components.renderStatCard('fa-circle-check', stats.resolved, 'Resolved', 'success')}
            ${Components.renderStatCard('fa-users', stats.totalConfirmations, 'Confirmations', 'info')}
        `;
    }

    function renderRecentReports() {
        const container = document.getElementById('recentReports');
        if (!container) return;

        const reports = DataService.getRecentReports(3);

        if (reports.length === 0) {
            container.innerHTML = Components.renderEmptyState(
                'fa-file-circle-plus',
                'No reports yet',
                'Be the first to report a civic issue in your community.',
                '<a href="report-new.html" class="btn btn--primary">Report an Issue</a>'
            );
            return;
        }

        container.innerHTML = '';
        reports.forEach(report => {
            container.appendChild(Components.renderReportCard(report));
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Small delay to ensure App.init() has run
        setTimeout(init, 10);
    }

    return { init };
})();
