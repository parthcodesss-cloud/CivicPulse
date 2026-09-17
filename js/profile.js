/* ============================================
   CivicPulse — Profile Controller
   ============================================ */

const ProfilePage = (() => {
    'use strict';

    function init() {
        render();
    }

    function render() {
        const container = document.getElementById('profileContent');
        if (!container) return;

        const user = Auth.getCurrentUser();
        const stats = DataService.getUserStats();
        const userReports = DataService.getReportsByUser(user.userId);

        container.innerHTML = `
            <!-- Profile Header -->
            <div class="profile-header animate-fade-in">
                <div class="profile-avatar">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="profile-info">
                    <h1 class="profile-name">${CivicUtils.sanitizeText(user.displayName)}</h1>
                    <span class="profile-role">
                        <i class="fa-solid ${user.role === 'admin' ? 'fa-shield-halved' : 'fa-user'}"></i>
                        ${user.role === 'admin' ? 'Admin' : 'Citizen'}
                    </span>
                </div>
                <a href="settings.html" class="btn btn--secondary btn--sm">
                    <i class="fa-solid fa-gear"></i> Settings
                </a>
            </div>

            <!-- Stats -->
            <div class="profile-stats stagger-children">
                ${Components.renderStatCard('fa-file-lines', stats.totalReports, 'Reports Submitted', 'accent')}
                ${Components.renderStatCard('fa-check-circle', stats.verified, 'Verified Reports', 'info')}
                ${Components.renderStatCard('fa-circle-check', stats.resolved, 'Resolved Reports', 'success')}
                ${Components.renderStatCard('fa-thumbs-up', stats.totalConfirmations, 'Confirmations Made', 'warning')}
            </div>

            <!-- My Reports -->
            <div class="profile-section">
                <div class="profile-section__header">
                    <h2 class="profile-section__title">
                        <i class="fa-solid fa-file-lines"></i> My Reports
                    </h2>
                    <a href="report-new.html" class="btn btn--primary btn--sm">
                        <i class="fa-solid fa-plus"></i> New Report
                    </a>
                </div>
                <div class="profile-reports-list" id="myReportsList">
                    ${renderReportsList(userReports)}
                </div>
            </div>
        `;
    }

    function renderReportsList(reports) {
        if (reports.length === 0) {
            return Components.renderEmptyState(
                'fa-file-circle-plus',
                'No reports yet',
                "You haven't submitted any civic reports yet. Help your community by reporting an issue.",
                '<a href="report-new.html" class="btn btn--primary btn--sm"><i class="fa-solid fa-plus"></i> Report an Issue</a>'
            );
        }

        return reports.map(report => {
            const cat = CivicUtils.getCategoryById(report.category);
            const sev = CivicUtils.getSeverityById(report.severity);
            const status = CivicUtils.getStatusById(report.status);

            return `
                <div class="profile-report-item" onclick="window.location.href='report-detail.html?id=${report.id}'">
                    <div class="profile-report-item__icon" style="color: ${cat.color};">
                        <i class="fa-solid ${cat.icon}"></i>
                    </div>
                    <div class="profile-report-item__content">
                        <div class="profile-report-item__title">${CivicUtils.sanitizeText(report.title)}</div>
                        <div class="profile-report-item__meta">
                            <span><i class="fa-solid fa-location-dot"></i> ${CivicUtils.sanitizeText(report.location)}</span>
                            <span><i class="fa-regular fa-clock"></i> ${CivicUtils.timeAgo(report.createdAt)}</span>
                            <span><i class="fa-solid fa-users"></i> ${report.confirmations} confirmed</span>
                        </div>
                    </div>
                    <div class="profile-report-item__badges">
                        <span class="badge badge--${sev.id}"><i class="fa-solid ${sev.icon}"></i> ${sev.label}</span>
                        <span class="badge badge--${status.cssClass}"><i class="fa-solid ${status.icon}"></i> ${status.label}</span>
                    </div>
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
