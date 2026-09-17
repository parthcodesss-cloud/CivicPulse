/* ============================================
   CivicPulse — Shared UI Components
   Navbar, footer, modals, toasts, report cards.
   These are injected into every page via JS.
   ============================================ */

const Components = (() => {
    'use strict';

    // ══════════════════════════════════════
    // NAVBAR
    // ══════════════════════════════════════

    function renderNavbar() {
        const isAdmin = Auth.isAdmin();
        const nav = document.getElementById('navbar');
        if (!nav) return;

        nav.className = 'navbar';
        nav.innerHTML = `
            <div class="navbar__inner">
                <a href="index.html" class="navbar__brand">
                    <div class="navbar__brand-icon">
                        <i class="fa-solid fa-tower-broadcast"></i>
                    </div>
                    CivicPulse
                </a>

                <nav class="navbar__links" id="navLinks" aria-label="Main navigation">
                    <a href="dashboard.html" class="navbar__link">
                        <i class="fa-solid fa-chart-line"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="reports.html" class="navbar__link">
                        <i class="fa-solid fa-list-check"></i>
                        <span>Issues</span>
                    </a>
                    <a href="report-new.html" class="navbar__link">
                        <i class="fa-solid fa-circle-plus"></i>
                        <span>Report</span>
                    </a>
                    <a href="analytics.html" class="navbar__link">
                        <i class="fa-solid fa-chart-pie"></i>
                        <span>Analytics</span>
                    </a>
                    ${isAdmin ? `
                    <a href="admin.html" class="navbar__link">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>Admin</span>
                    </a>` : ''}
                </nav>

                <div class="navbar__actions">
                    <button class="navbar__theme-toggle theme-toggle-btn" id="themeToggle" aria-label="Toggle theme">
                        <i class="fa-solid fa-moon"></i>
                    </button>
                    <a href="profile.html" class="navbar__link" id="profileLink" title="Profile">
                        <i class="fa-solid fa-user-circle"></i>
                    </a>
                    <button class="navbar__menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu" aria-expanded="false">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
        `;

        // Mobile nav
        let mobileNav = document.getElementById('mobileNav');
        if (!mobileNav) {
            mobileNav = document.createElement('div');
            mobileNav.id = 'mobileNav';
            mobileNav.className = 'mobile-nav';
            document.body.appendChild(mobileNav);
        }

        mobileNav.innerHTML = `
            <a href="index.html" class="mobile-nav__link">
                <i class="fa-solid fa-home"></i> Home
            </a>
            <a href="dashboard.html" class="mobile-nav__link">
                <i class="fa-solid fa-chart-line"></i> Dashboard
            </a>
            <a href="reports.html" class="mobile-nav__link">
                <i class="fa-solid fa-list-check"></i> Browse Issues
            </a>
            <a href="report-new.html" class="mobile-nav__link">
                <i class="fa-solid fa-circle-plus"></i> Report an Issue
            </a>
            <a href="analytics.html" class="mobile-nav__link">
                <i class="fa-solid fa-chart-pie"></i> Analytics
            </a>
            <div class="mobile-nav__divider"></div>
            <a href="profile.html" class="mobile-nav__link">
                <i class="fa-solid fa-user-circle"></i> My Profile
            </a>
            ${isAdmin ? `
            <a href="admin.html" class="mobile-nav__link">
                <i class="fa-solid fa-shield-halved"></i> Admin Panel
            </a>` : ''}
            <a href="settings.html" class="mobile-nav__link">
                <i class="fa-solid fa-gear"></i> Settings
            </a>
        `;

        // Event listeners
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => ThemeManager.toggle());
        }

        const menuToggle = document.getElementById('mobileMenuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const isOpen = mobileNav.classList.toggle('open');
                menuToggle.setAttribute('aria-expanded', isOpen);
                const icon = menuToggle.querySelector('i');
                icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            });
        }

        Router.highlightActiveNav();
    }

    // ══════════════════════════════════════
    // FOOTER
    // ══════════════════════════════════════

    function renderFooter() {
        const footer = document.getElementById('footer');
        if (!footer) return;

        footer.className = 'footer';
        footer.innerHTML = `
            <div class="container">
                <div class="footer__grid">
                    <div>
                        <div class="footer__brand">
                            <div class="footer__brand-icon">
                                <i class="fa-solid fa-tower-broadcast"></i>
                            </div>
                            CivicPulse
                        </div>
                        <p class="footer__description">
                            Empowering citizens to report, track, and resolve civic issues. 
                            Together, we build better communities.
                        </p>
                    </div>
                    <div>
                        <h4 class="footer__heading">Platform</h4>
                        <div class="footer__links">
                            <a href="dashboard.html" class="footer__link">Dashboard</a>
                            <a href="reports.html" class="footer__link">Browse Issues</a>
                            <a href="report-new.html" class="footer__link">Report Issue</a>
                            <a href="analytics.html" class="footer__link">Analytics</a>
                        </div>
                    </div>
                    <div>
                        <h4 class="footer__heading">Account</h4>
                        <div class="footer__links">
                            <a href="profile.html" class="footer__link">My Profile</a>
                            <a href="settings.html" class="footer__link">Settings</a>
                            <a href="admin.html" class="footer__link">Admin</a>
                        </div>
                    </div>
                    <div>
                        <h4 class="footer__heading">About</h4>
                        <div class="footer__links">
                            <a href="#" class="footer__link">How It Works</a>
                            <a href="#" class="footer__link">Privacy</a>
                            <a href="#" class="footer__link">Terms</a>
                            <a href="#" class="footer__link">Contact</a>
                        </div>
                    </div>
                </div>
                <div class="footer__bottom">
                    <p class="footer__copyright">
                        &copy; ${new Date().getFullYear()} CivicPulse. Built for a better community.
                    </p>
                    <div class="footer__social">
                        <a href="#" class="footer__social-link" aria-label="GitHub">
                            <i class="fa-brands fa-github"></i>
                        </a>
                        <a href="#" class="footer__social-link" aria-label="Twitter">
                            <i class="fa-brands fa-twitter"></i>
                        </a>
                        <a href="#" class="footer__social-link" aria-label="LinkedIn">
                            <i class="fa-brands fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // ══════════════════════════════════════
    // REPORT CARD
    // ══════════════════════════════════════

    function renderReportCard(report, options = {}) {
        const { compact = false } = options;
        const cat = CivicUtils.getCategoryById(report.category);
        const sev = CivicUtils.getSeverityById(report.severity);
        const status = CivicUtils.getStatusById(report.status);

        const card = document.createElement('div');
        card.className = 'card card--hover report-card';
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
        card.dataset.reportId = report.id;

        card.innerHTML = `
            <div class="card__header">
                <div class="report-card__category">
                    <span class="badge badge--category">
                        <i class="fa-solid ${cat.icon}"></i>
                        ${CivicUtils.sanitizeText(cat.label)}
                    </span>
                </div>
                <div class="report-card__badges">
                    <span class="badge badge--${sev.id}" title="Severity: ${sev.label}">
                        <i class="fa-solid ${sev.icon}"></i>
                        ${sev.label}
                    </span>
                    <span class="badge badge--${status.cssClass}" title="Status: ${status.label}">
                        <i class="fa-solid ${status.icon}"></i>
                        ${status.label}
                    </span>
                </div>
            </div>
            <div class="card__body">
                <h3 class="card__title report-card__title">${CivicUtils.sanitizeText(report.title)}</h3>
                ${!compact ? `<p class="report-card__description">${CivicUtils.sanitizeText(CivicUtils.truncateText(report.description, 120))}</p>` : ''}
                <div class="report-card__meta">
                    <span class="report-card__location" title="Location">
                        <i class="fa-solid fa-location-dot"></i>
                        ${CivicUtils.sanitizeText(report.location)}
                    </span>
                    <span class="report-card__date" title="Reported ${CivicUtils.formatDate(report.createdAt)}">
                        <i class="fa-regular fa-clock"></i>
                        ${CivicUtils.timeAgo(report.createdAt)}
                    </span>
                </div>
            </div>
            <div class="card__footer">
                <div class="report-card__confirmations" title="${report.confirmations} people confirmed this issue">
                    <i class="fa-solid fa-users"></i>
                    <span>${report.confirmations} confirmed</span>
                </div>
                <a href="report-detail.html?id=${report.id}" class="btn btn--sm btn--accent-ghost report-card__view-btn">
                    View Details
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;

        // Click entire card to navigate
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a, button')) {
                Router.goToReportDetail(report.id);
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                Router.goToReportDetail(report.id);
            }
        });

        return card;
    }

    // ══════════════════════════════════════
    // STAT CARD
    // ══════════════════════════════════════

    function renderStatCard(icon, value, label, colorClass = 'accent') {
        return `
            <div class="stat-card">
                <div class="stat-card__icon stat-card__icon--${colorClass}">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="stat-card__value">${CivicUtils.formatNumber(value)}</div>
                <div class="stat-card__label">${label}</div>
            </div>
        `;
    }

    // ══════════════════════════════════════
    // TOAST NOTIFICATIONS
    // ══════════════════════════════════════

    function showToast(message, type = 'info', title = '', duration = 4000) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="fa-solid ${icons[type] || icons.info}"></i>
            </div>
            <div class="toast__content">
                ${title ? `<div class="toast__title">${CivicUtils.sanitizeText(title)}</div>` : ''}
                <p class="toast__message">${CivicUtils.sanitizeText(message)}</p>
            </div>
            <button class="toast__close" aria-label="Close notification">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        const closeBtn = toast.querySelector('.toast__close');
        closeBtn.addEventListener('click', () => removeToast(toast));

        container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => removeToast(toast), duration);
        }

        return toast;
    }

    function removeToast(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }

    // ══════════════════════════════════════
    // MODAL
    // ══════════════════════════════════════

    function showModal(options = {}) {
        const { title = '', body = '', footer = '', onClose } = options;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true" aria-label="${CivicUtils.sanitizeText(title)}">
                <div class="modal__header">
                    <h3 class="modal__title">${CivicUtils.sanitizeText(title)}</h3>
                    <button class="modal__close" aria-label="Close modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="modal__body">${body}</div>
                ${footer ? `<div class="modal__footer">${footer}</div>` : ''}
            </div>
        `;

        const close = () => {
            overlay.classList.remove('open');
            setTimeout(() => {
                overlay.remove();
                if (onClose) onClose();
            }, 200);
        };

        overlay.querySelector('.modal__close').addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', escHandler);
            }
        });

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));

        return { overlay, close };
    }

    // ══════════════════════════════════════
    // EMPTY STATE
    // ══════════════════════════════════════

    function renderEmptyState(icon, title, description, actionHtml = '') {
        return `
            <div class="empty-state">
                <div class="empty-state__icon">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <h3 class="empty-state__title">${CivicUtils.sanitizeText(title)}</h3>
                <p class="empty-state__description">${CivicUtils.sanitizeText(description)}</p>
                ${actionHtml}
            </div>
        `;
    }

    // ══════════════════════════════════════
    // LOADING STATE
    // ══════════════════════════════════════

    function renderLoadingState(text = 'Loading...') {
        return `
            <div class="loading-spinner">
                <div class="loading-spinner__circle"></div>
                <div class="loading-spinner__text">${CivicUtils.sanitizeText(text)}</div>
            </div>
        `;
    }

    // ══════════════════════════════════════
    // STATUS TIMELINE
    // ══════════════════════════════════════

    function renderStatusTimeline(report) {
        const allStatuses = ['Pending', 'Verified', 'In Progress', 'Resolved'];
        const historyMap = {};
        report.statusHistory.forEach(h => {
            historyMap[h.status] = h;
        });

        let reachedCurrent = false;

        return `
            <div class="status-timeline">
                ${allStatuses.map((status, index) => {
                    const entry = historyMap[status];
                    const isCompleted = !!entry && status !== report.status;
                    const isActive = status === report.status && report.status !== 'Rejected';

                    if (isActive) reachedCurrent = true;

                    const stepClass = isCompleted ? 'timeline-step--completed'
                        : isActive ? 'timeline-step--active' : '';

                    const isLast = index === allStatuses.length - 1;

                    return `
                        <div class="timeline-step ${stepClass}">
                            <div class="timeline-step__indicator">
                                <div class="timeline-step__dot">
                                    ${isCompleted ? '<i class="fa-solid fa-check"></i>'
                                        : isActive ? '<i class="fa-solid fa-circle"></i>'
                                        : ''}
                                </div>
                                ${!isLast ? '<div class="timeline-step__line"></div>' : ''}
                            </div>
                            <div class="timeline-step__content">
                                <div class="timeline-step__label">${status}</div>
                                ${entry ? `<div class="timeline-step__date">${CivicUtils.formatDateTime(entry.timestamp)}</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
                ${report.status === 'Rejected' ? `
                    <div class="timeline-step timeline-step--active">
                        <div class="timeline-step__indicator">
                            <div class="timeline-step__dot" style="background: var(--color-danger); border-color: var(--color-danger); color: white;">
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                        <div class="timeline-step__content">
                            <div class="timeline-step__label">Rejected</div>
                            ${historyMap['Rejected'] ? `<div class="timeline-step__date">${CivicUtils.formatDateTime(historyMap['Rejected'].timestamp)}</div>` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ══════════════════════════════════════
    // CONFIRMATION BUTTON
    // ══════════════════════════════════════

    function renderConfirmButton(report) {
        const hasConfirmed = DataService.hasUserConfirmed(report.id);

        const btn = document.createElement('button');
        btn.className = `confirm-btn ${hasConfirmed ? 'confirmed' : ''}`;
        btn.setAttribute('aria-label', hasConfirmed ? 'You have confirmed this issue' : 'Confirm you are experiencing this issue');
        btn.innerHTML = `
            <i class="fa-solid ${hasConfirmed ? 'fa-check-circle' : 'fa-thumbs-up'}"></i>
            <span>${hasConfirmed ? 'Confirmed' : 'I Have This Problem Too'}</span>
            <span class="confirm-btn__count">${report.confirmations}</span>
        `;

        if (!hasConfirmed) {
            btn.addEventListener('click', () => {
                const result = DataService.confirmReport(report.id);
                if (result.success) {
                    btn.classList.add('confirmed');
                    btn.querySelector('i').className = 'fa-solid fa-check-circle';
                    btn.querySelector('span:first-of-type').textContent = 'Confirmed';
                    btn.querySelector('.confirm-btn__count').textContent = result.report.confirmations;
                    showToast('Thank you for confirming this issue!', 'success', 'Issue Confirmed');
                } else {
                    showToast(result.message, 'warning');
                }
            });
        }

        return btn;
    }

    return {
        renderNavbar,
        renderFooter,
        renderReportCard,
        renderStatCard,
        showToast,
        showModal,
        removeToast,
        renderEmptyState,
        renderLoadingState,
        renderStatusTimeline,
        renderConfirmButton
    };
})();
