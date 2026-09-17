/* ============================================
   CivicPulse — Admin Dashboard Controller
   ============================================ */

const AdminPage = (() => {
    'use strict';

    let currentFilter = 'all';

    function init() {
        if (!Auth.isAdmin()) {
            renderAccessDenied();
            return;
        }
        render();
    }

    function renderAccessDenied() {
        const container = document.getElementById('adminContent');
        if (!container) return;

        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-header__title">Admin Dashboard</h1>
            </div>
            ${Components.renderEmptyState(
                'fa-shield-halved',
                'Admin Access Required',
                'You need admin privileges to access this page. Go to Settings to enable admin mode.',
                '<a href="settings.html" class="btn btn--primary"><i class="fa-solid fa-gear"></i> Go to Settings</a>'
            )}
        `;
    }

    function render() {
        const container = document.getElementById('adminContent');
        if (!container) return;

        const stats = DataService.getStatistics();

        container.innerHTML = `
            <div class="page-header">
                <div class="page-header__row">
                    <div>
                        <h1 class="page-header__title">Admin Dashboard</h1>
                        <p class="page-header__subtitle">Manage and moderate community reports</p>
                    </div>
                </div>
            </div>

            <!-- Admin Stats -->
            <div class="admin-stats stagger-children">
                ${renderAdminStat('fa-file-lines', stats.total, 'Total Reports', 'accent')}
                ${renderAdminStat('fa-clock', stats.pending, 'Pending', 'warning')}
                ${renderAdminStat('fa-check-circle', stats.verified, 'Verified', 'info')}
                ${renderAdminStat('fa-spinner', stats.inProgress, 'In Progress', 'info')}
                ${renderAdminStat('fa-circle-check', stats.resolved, 'Resolved', 'success')}
            </div>

            <!-- Filter Tabs -->
            <div class="tabs admin-tabs" id="adminTabs">
                <button class="tab active" data-filter="all">All Reports</button>
                <button class="tab" data-filter="Pending">Pending (${stats.pending})</button>
                <button class="tab" data-filter="Verified">Verified (${stats.verified})</button>
                <button class="tab" data-filter="In Progress">In Progress (${stats.inProgress})</button>
                <button class="tab" data-filter="Resolved">Resolved (${stats.resolved})</button>
                <button class="tab" data-filter="Rejected">Rejected (${stats.rejected})</button>
            </div>

            <!-- Reports Table -->
            <div class="admin-panel">
                <div class="admin-panel__header">
                    <h2 class="admin-panel__title" id="adminPanelTitle">All Reports</h2>
                    <span class="badge badge--count" id="adminCount">${stats.total}</span>
                </div>
                <div class="admin-table-wrapper">
                    <table class="admin-table" id="adminTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Issue</th>
                                <th>Category</th>
                                <th>Area</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Confirmed</th>
                                <th>Reported</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminTableBody">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        renderTableBody();
        attachListeners();
    }

    function renderAdminStat(icon, value, label, color) {
        return `
            <div class="stat-card">
                <div class="stat-card__icon stat-card__icon--${color}">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="stat-card__value">${value}</div>
                <div class="stat-card__label">${label}</div>
            </div>
        `;
    }

    function renderTableBody() {
        const tbody = document.getElementById('adminTableBody');
        const title = document.getElementById('adminPanelTitle');
        const count = document.getElementById('adminCount');
        if (!tbody) return;

        let reports = DataService.getReports();

        if (currentFilter !== 'all') {
            reports = reports.filter(r => r.status === currentFilter);
        }

        if (title) title.textContent = currentFilter === 'all' ? 'All Reports' : `${currentFilter} Reports`;
        if (count) count.textContent = reports.length;

        if (reports.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:var(--space-8);color:var(--text-tertiary);">
                <i class="fa-solid fa-inbox" style="font-size:var(--text-2xl);display:block;margin-bottom:var(--space-2);"></i>
                No reports found
            </td></tr>`;
            return;
        }

        tbody.innerHTML = reports.map(report => {
            const cat = CivicUtils.getCategoryById(report.category);
            const sev = CivicUtils.getSeverityById(report.severity);
            const status = CivicUtils.getStatusById(report.status);

            return `
                <tr data-report-id="${report.id}">
                    <td><span style="font-family:var(--font-mono);font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--text-tertiary);">${report.id}</span></td>
                    <td><div class="admin-table__title"><a href="report-detail.html?id=${report.id}">${CivicUtils.sanitizeText(report.title)}</a></div></td>
                    <td><span class="badge badge--category"><i class="fa-solid ${cat.icon}"></i> ${CivicUtils.sanitizeText(cat.label)}</span></td>
                    <td style="font-size:var(--text-sm);">${CivicUtils.sanitizeText(report.location)}</td>
                    <td><span class="badge badge--${sev.id}"><i class="fa-solid ${sev.icon}"></i> ${sev.label}</span></td>
                    <td><span class="badge badge--${status.cssClass}"><i class="fa-solid ${status.icon}"></i> ${status.label}</span></td>
                    <td style="text-align:center;font-weight:var(--weight-semibold);">${report.confirmations}</td>
                    <td style="font-size:var(--text-xs);color:var(--text-tertiary);white-space:nowrap;">${CivicUtils.timeAgo(report.createdAt)}</td>
                    <td>
                        <div class="admin-actions">
                            ${getActionButtons(report)}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function getActionButtons(report) {
        const btns = [];

        switch (report.status) {
            case 'Pending':
                btns.push(`<button class="admin-action-btn admin-action-btn--verify" data-action="Verified" data-id="${report.id}" title="Verify report"><i class="fa-solid fa-check"></i> Verify</button>`);
                btns.push(`<button class="admin-action-btn admin-action-btn--reject" data-action="Rejected" data-id="${report.id}" title="Reject report"><i class="fa-solid fa-xmark"></i> Reject</button>`);
                break;
            case 'Verified':
                btns.push(`<button class="admin-action-btn admin-action-btn--progress" data-action="In Progress" data-id="${report.id}" title="Mark as in progress"><i class="fa-solid fa-spinner"></i> In Progress</button>`);
                break;
            case 'In Progress':
                btns.push(`<button class="admin-action-btn admin-action-btn--resolve" data-action="Resolved" data-id="${report.id}" title="Mark as resolved"><i class="fa-solid fa-check-double"></i> Resolve</button>`);
                break;
            case 'Resolved':
                btns.push(`<span style="font-size:var(--text-xs);color:var(--color-success);"><i class="fa-solid fa-check-circle"></i> Done</span>`);
                break;
            case 'Rejected':
                btns.push(`<button class="admin-action-btn" data-action="Pending" data-id="${report.id}" title="Re-open report"><i class="fa-solid fa-rotate-left"></i> Reopen</button>`);
                break;
        }

        return btns.join('');
    }

    function attachListeners() {
        // Tab filters
        const tabs = document.querySelectorAll('#adminTabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentFilter = tab.dataset.filter;
                renderTableBody();
            });
        });

        // Action buttons (event delegation)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const reportId = btn.dataset.id;
            const newStatus = btn.dataset.action;

            if (!reportId || !newStatus) return;

            const result = DataService.changeReportStatus(reportId, newStatus, 'admin');
            if (result) {
                Components.showToast(`Report ${reportId} status changed to ${newStatus}`, 'success', 'Status Updated');
                render(); // Re-render entire admin view
            } else {
                Components.showToast('Failed to update report status.', 'error');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 10);
    }

    return { init };
})();
