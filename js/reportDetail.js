/* ============================================
   CivicPulse — Report Detail Controller
   ============================================ */

const ReportDetailPage = (() => {
    'use strict';

    function init() {
        const reportId = CivicUtils.getUrlParam('id');
        if (!reportId) {
            renderNotFound();
            return;
        }

        const report = DataService.getReportById(reportId);
        if (!report) {
            renderNotFound();
            return;
        }

        renderReport(report);
        document.title = `${report.title} — CivicPulse`;
    }

    function renderReport(report) {
        const container = document.getElementById('reportDetail');
        if (!container) return;

        const cat = CivicUtils.getCategoryById(report.category);
        const sev = CivicUtils.getSeverityById(report.severity);
        const status = CivicUtils.getStatusById(report.status);

        container.innerHTML = `
            <div class="report-detail__header animate-fade-in">
                <a href="reports.html" class="report-detail__back">
                    <i class="fa-solid fa-arrow-left"></i> Back to Issues
                </a>
                <div class="report-detail__badges">
                    <span class="badge badge--category">
                        <i class="fa-solid ${cat.icon}"></i> ${CivicUtils.sanitizeText(cat.label)}
                    </span>
                    <span class="badge badge--${sev.id}" title="Severity: ${sev.label}">
                        <i class="fa-solid ${sev.icon}"></i> ${sev.label}
                    </span>
                    <span class="badge badge--${status.cssClass}" title="Status: ${status.label}">
                        <i class="fa-solid ${status.icon}"></i> ${status.label}
                    </span>
                    ${report.isDemo ? '<span class="badge badge--category">Demo Data</span>' : ''}
                </div>
                <h1 class="report-detail__title">${CivicUtils.sanitizeText(report.title)}</h1>
                <div class="report-detail__meta">
                    <div class="report-detail__meta-item">
                        <i class="fa-solid fa-location-dot"></i>
                        ${CivicUtils.sanitizeText(report.location)}
                    </div>
                    <div class="report-detail__meta-item">
                        <i class="fa-regular fa-calendar"></i>
                        Reported ${CivicUtils.formatDate(report.createdAt)}
                    </div>
                    <div class="report-detail__meta-item">
                        <i class="fa-solid fa-hashtag"></i>
                        ${report.id}
                    </div>
                </div>
            </div>

            <div class="report-detail__content">
                <div class="report-detail__main">
                    <!-- Description -->
                    <div class="report-detail__section animate-fade-in">
                        <h2 class="report-detail__section-title">
                            <i class="fa-solid fa-align-left"></i> Description
                        </h2>
                        <p class="report-detail__description">${CivicUtils.sanitizeText(report.description)}</p>
                        ${report.image ? `
                            <div class="report-detail__image">
                                <img src="${report.image}" alt="Report image for ${CivicUtils.sanitizeText(report.title)}">
                            </div>
                        ` : ''}
                    </div>

                    <!-- Community Confirmation -->
                    <div class="report-detail__section animate-fade-in">
                        <h2 class="report-detail__section-title">
                            <i class="fa-solid fa-users"></i> Community Confirmation
                        </h2>
                        <div class="report-detail__confirmation">
                            <div class="report-detail__confirmation-count">
                                <strong>${report.confirmations}</strong>
                                people are experiencing this issue
                            </div>
                            <div id="confirmButtonContainer"></div>
                        </div>
                    </div>
                </div>

                <div class="report-detail__sidebar">
                    <!-- Status Timeline -->
                    <div class="report-detail__section animate-fade-in">
                        <h2 class="report-detail__section-title">
                            <i class="fa-solid fa-timeline"></i> Status Timeline
                        </h2>
                        ${Components.renderStatusTimeline(report)}
                    </div>

                    <!-- Report Info -->
                    <div class="report-detail__section animate-fade-in">
                        <h2 class="report-detail__section-title">
                            <i class="fa-solid fa-circle-info"></i> Report Details
                        </h2>
                        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                                <span style="color: var(--text-tertiary);">Report ID</span>
                                <span style="font-weight: var(--weight-semibold); font-family: var(--font-mono);">${report.id}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                                <span style="color: var(--text-tertiary);">Category</span>
                                <span style="font-weight: var(--weight-medium);">${CivicUtils.sanitizeText(cat.label)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                                <span style="color: var(--text-tertiary);">Severity</span>
                                <span class="badge badge--${sev.id}"><i class="fa-solid ${sev.icon}"></i> ${sev.label}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                                <span style="color: var(--text-tertiary);">Status</span>
                                <span class="badge badge--${status.cssClass}"><i class="fa-solid ${status.icon}"></i> ${status.label}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                                <span style="color: var(--text-tertiary);">Reported</span>
                                <span style="font-weight: var(--weight-medium);">${CivicUtils.formatDate(report.createdAt)}</span>
                            </div>
                            ${report.verifiedAt ? `
                            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                                <span style="color: var(--text-tertiary);">Verified</span>
                                <span style="font-weight: var(--weight-medium);">${CivicUtils.formatDate(report.verifiedAt)}</span>
                            </div>` : ''}
                            ${report.resolvedAt ? `
                            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                                <span style="color: var(--text-tertiary);">Resolved</span>
                                <span style="font-weight: var(--weight-medium);">${CivicUtils.formatDate(report.resolvedAt)}</span>
                            </div>` : ''}
                            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                                <span style="color: var(--text-tertiary);">Confirmations</span>
                                <span style="font-weight: var(--weight-bold); color: var(--color-accent);">${report.confirmations}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render confirm button
        const confirmContainer = document.getElementById('confirmButtonContainer');
        if (confirmContainer) {
            confirmContainer.appendChild(Components.renderConfirmButton(report));
        }
    }

    function renderNotFound() {
        const container = document.getElementById('reportDetail');
        if (!container) return;

        container.innerHTML = Components.renderEmptyState(
            'fa-file-circle-xmark',
            'Report Not Found',
            'This report may have been removed or the link may be incorrect.',
            '<a href="reports.html" class="btn btn--primary"><i class="fa-solid fa-arrow-left"></i> Browse All Issues</a>'
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 10);
    }

    return { init };
})();
