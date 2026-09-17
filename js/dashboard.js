/* ============================================
   CivicPulse — Dashboard Controller
   ============================================ */

const DashboardPage = (() => {
    'use strict';

    function init() {
        renderPrimaryStats();
        renderSecondaryStats();
        renderRecentReports();
        renderCategoryBreakdown();
    }

    function renderPrimaryStats() {
        const container = document.getElementById('dashboardStats');
        if (!container) return;
        const stats = DataService.getStatistics();

        container.innerHTML = `
            ${Components.renderStatCard('fa-file-lines', stats.total, 'Total Reports', 'accent')}
            ${Components.renderStatCard('fa-exclamation-circle', stats.openIssues, 'Open Issues', 'warning')}
            ${Components.renderStatCard('fa-spinner', stats.inProgress, 'In Progress', 'info')}
            ${Components.renderStatCard('fa-circle-check', stats.resolved, 'Resolved', 'success')}
        `;
    }

    function renderSecondaryStats() {
        const container = document.getElementById('dashboardSecondaryStats');
        if (!container) return;
        const stats = DataService.getStatistics();

        const mostCategory = stats.mostReportedCategory
            ? CivicUtils.getCategoryById(stats.mostReportedCategory.id)
            : null;

        container.innerHTML = `
            <div class="stat-card" style="display:flex;align-items:center;gap:var(--space-4);">
                <div class="stat-card__icon stat-card__icon--danger" style="margin-bottom:0;flex-shrink:0;">
                    <i class="fa-solid fa-fire"></i>
                </div>
                <div>
                    <div class="stat-card__value" style="font-size:var(--text-xl);">${mostCategory ? mostCategory.label : 'N/A'}</div>
                    <div class="stat-card__label">Most Reported</div>
                </div>
            </div>
            <div class="stat-card" style="display:flex;align-items:center;gap:var(--space-4);">
                <div class="stat-card__icon stat-card__icon--warning" style="margin-bottom:0;flex-shrink:0;">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <div>
                    <div class="stat-card__value" style="font-size:var(--text-xl);">${stats.mostAffectedArea ? stats.mostAffectedArea.name : 'N/A'}</div>
                    <div class="stat-card__label">Most Affected Area</div>
                </div>
            </div>
            <div class="stat-card" style="display:flex;align-items:center;gap:var(--space-4);">
                <div class="stat-card__icon stat-card__icon--accent" style="margin-bottom:0;flex-shrink:0;">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div>
                    <div class="stat-card__value" style="font-size:var(--text-xl);">${CivicUtils.formatNumber(stats.totalConfirmations)}</div>
                    <div class="stat-card__label">Confirmations</div>
                </div>
            </div>
            <div class="stat-card" style="display:flex;align-items:center;gap:var(--space-4);">
                <div class="stat-card__icon stat-card__icon--success" style="margin-bottom:0;flex-shrink:0;">
                    <i class="fa-solid fa-percent"></i>
                </div>
                <div>
                    <div class="stat-card__value" style="font-size:var(--text-xl);">${stats.resolutionRate}%</div>
                    <div class="stat-card__label">Resolution Rate</div>
                </div>
            </div>
        `;
    }

    function renderRecentReports() {
        const container = document.getElementById('dashboardRecentReports');
        if (!container) return;

        const reports = DataService.getRecentReports(8);

        if (reports.length === 0) {
            container.innerHTML = Components.renderEmptyState(
                'fa-file-circle-plus',
                'No reports yet',
                'Be the first to report a civic issue.',
                '<a href="report-new.html" class="btn btn--primary btn--sm">Report Issue</a>'
            );
            return;
        }

        container.innerHTML = reports.map(report => {
            const cat = CivicUtils.getCategoryById(report.category);
            const status = CivicUtils.getStatusById(report.status);
            const sev = CivicUtils.getSeverityById(report.severity);
            return `
                <a href="report-detail.html?id=${report.id}" class="dashboard-report-item">
                    <div class="dashboard-report-item__icon">
                        <i class="fa-solid ${cat.icon}"></i>
                    </div>
                    <div class="dashboard-report-item__content">
                        <div class="dashboard-report-item__title">${CivicUtils.sanitizeText(report.title)}</div>
                        <div class="dashboard-report-item__meta">
                            <span><i class="fa-solid fa-location-dot"></i> ${CivicUtils.sanitizeText(report.location)}</span>
                            <span>${CivicUtils.timeAgo(report.createdAt)}</span>
                        </div>
                    </div>
                    <div class="dashboard-report-item__badges">
                        <span class="badge badge--${sev.id}" title="Severity: ${sev.label}">
                            <i class="fa-solid ${sev.icon}"></i> ${sev.label}
                        </span>
                        <span class="badge badge--${status.cssClass}" title="Status: ${status.label}">
                            ${status.label}
                        </span>
                    </div>
                </a>
            `;
        }).join('');
    }

    function renderCategoryBreakdown() {
        const container = document.getElementById('dashboardCategories');
        if (!container) return;

        const stats = DataService.getStatistics();
        const total = stats.total || 1;

        // Sort categories by count
        const sorted = Object.entries(stats.byCategory)
            .filter(([, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        if (sorted.length === 0) {
            container.innerHTML = '<p class="text-secondary text-center" style="padding: var(--space-6);">No data yet</p>';
            return;
        }

        container.innerHTML = sorted.map(([catId, count]) => {
            const cat = CivicUtils.getCategoryById(catId);
            const percent = Math.round((count / total) * 100);
            return `
                <div class="category-breakdown-item">
                    <div class="category-breakdown-item__icon" style="color: ${cat.color};">
                        <i class="fa-solid ${cat.icon}"></i>
                    </div>
                    <div class="category-breakdown-item__info">
                        <div class="category-breakdown-item__label">${cat.label}</div>
                        <div class="category-breakdown-item__bar">
                            <div class="category-breakdown-item__fill" style="width: ${percent}%; background: ${cat.color};"></div>
                        </div>
                    </div>
                    <div class="category-breakdown-item__count">${count}</div>
                </div>
            `;
        }).join('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 10);
    }

    return { init };
})();
