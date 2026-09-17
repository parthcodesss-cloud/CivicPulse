/* ============================================
   CivicPulse — Reports List Controller
   Search, filter, sort, paginate civic issues.
   ============================================ */

const ReportsListPage = (() => {
    'use strict';

    const ITEMS_PER_PAGE = 9;
    let currentPage = 1;
    let currentResults = [];

    function init() {
        populateAreaFilter();
        applyUrlParams();
        attachListeners();
        performSearch();
    }

    function populateAreaFilter() {
        const filterArea = document.getElementById('filterArea');
        if (!filterArea) return;

        const areas = DataService.getActiveAreas();
        const existing = filterArea.querySelector('option[value="all"]');
        filterArea.innerHTML = '';
        filterArea.appendChild(existing);

        areas.forEach(area => {
            const opt = document.createElement('option');
            opt.value = area;
            opt.textContent = area;
            filterArea.appendChild(opt);
        });
    }

    function applyUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const area = params.get('area');
        const severity = params.get('severity');
        const status = params.get('status');
        const search = params.get('q');

        if (category) document.getElementById('filterCategory').value = category;
        if (area) document.getElementById('filterArea').value = area;
        if (severity) document.getElementById('filterSeverity').value = severity;
        if (status) document.getElementById('filterStatus').value = status;
        if (search) document.getElementById('searchInput').value = search;
    }

    function attachListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        const sortSelect = document.getElementById('sortSelect');
        const filterCategory = document.getElementById('filterCategory');
        const filterArea = document.getElementById('filterArea');
        const filterSeverity = document.getElementById('filterSeverity');
        const filterStatus = document.getElementById('filterStatus');
        const clearFilters = document.getElementById('clearFilters');

        const debouncedSearch = CivicUtils.debounce(() => performSearch(), 300);

        searchInput.addEventListener('input', () => {
            searchClear.classList.toggle('visible', searchInput.value.length > 0);
            debouncedSearch();
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.classList.remove('visible');
            performSearch();
        });

        sortSelect.addEventListener('change', () => performSearch());
        filterCategory.addEventListener('change', () => { currentPage = 1; performSearch(); });
        filterArea.addEventListener('change', () => { currentPage = 1; performSearch(); });
        filterSeverity.addEventListener('change', () => { currentPage = 1; performSearch(); });
        filterStatus.addEventListener('change', () => { currentPage = 1; performSearch(); });

        clearFilters.addEventListener('click', () => {
            filterCategory.value = 'all';
            filterArea.value = 'all';
            filterSeverity.value = 'all';
            filterStatus.value = 'all';
            searchInput.value = '';
            searchClear.classList.remove('visible');
            currentPage = 1;
            performSearch();
        });
    }

    function performSearch() {
        const query = document.getElementById('searchInput').value;
        const sortBy = document.getElementById('sortSelect').value;
        const filters = {
            category: document.getElementById('filterCategory').value,
            area: document.getElementById('filterArea').value,
            severity: document.getElementById('filterSeverity').value,
            status: document.getElementById('filterStatus').value
        };

        currentResults = DataService.searchReports(query, filters, sortBy);
        updateClearFiltersBtn(filters, query);
        renderResults();
        renderPagination();
    }

    function updateClearFiltersBtn(filters, query) {
        const clearBtn = document.getElementById('clearFilters');
        const hasFilters = query ||
            filters.category !== 'all' ||
            filters.area !== 'all' ||
            filters.severity !== 'all' ||
            filters.status !== 'all';

        clearBtn.classList.toggle('hidden', !hasFilters);
    }

    function renderResults() {
        const grid = document.getElementById('reportsGrid');
        const info = document.getElementById('resultsInfo');
        if (!grid || !info) return;

        const total = currentResults.length;
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = Math.min(start + ITEMS_PER_PAGE, total);
        const pageResults = currentResults.slice(start, end);

        // Results info
        info.innerHTML = `
            <div class="reports-results-info__count">
                Showing <strong>${total > 0 ? start + 1 : 0}-${end}</strong> of <strong>${total}</strong> issues
            </div>
        `;

        // Results grid
        if (pageResults.length === 0) {
            grid.innerHTML = Components.renderEmptyState(
                'fa-magnifying-glass',
                'No reports found',
                'Try changing your filters or search terms.',
                '<a href="report-new.html" class="btn btn--primary btn--sm"><i class="fa-solid fa-plus"></i> Report an Issue</a>'
            );
            return;
        }

        grid.innerHTML = '';
        pageResults.forEach((report, index) => {
            const card = Components.renderReportCard(report);
            card.style.animationDelay = `${index * 0.05}s`;
            card.classList.add('animate-fade-in');
            grid.appendChild(card);
        });
    }

    function renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Math.ceil(currentResults.length / ITEMS_PER_PAGE);

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';

        // Previous
        html += `<button class="pagination__btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <i class="fa-solid fa-chevron-left"></i>
        </button>`;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (totalPages > 7 && i > 2 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
                if (i === 3 || i === totalPages - 2) {
                    html += '<span class="pagination__btn" style="cursor:default;">…</span>';
                }
                continue;
            }
            html += `<button class="pagination__btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        // Next
        html += `<button class="pagination__btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <i class="fa-solid fa-chevron-right"></i>
        </button>`;

        container.innerHTML = html;

        container.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page >= 1 && page <= totalPages) {
                    currentPage = page;
                    renderResults();
                    renderPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 10);
    }

    return { init };
})();
