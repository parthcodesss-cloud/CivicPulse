/* ============================================
   CivicPulse — Analytics Controller
   Charts, visualizations, area intelligence.
   All built with CSS/SVG — no chart libraries.
   ============================================ */

const AnalyticsPage = (() => {
    'use strict';

    let currentTrendDays = 30;

    function init() {
        const stats = DataService.getStatistics();
        renderTopStats(stats);
        renderChartsRow1(stats);
        renderChartsRow2(stats);
        renderAreaMap(stats);
        populateAreaSelector();
        attachListeners();
    }

    function renderTopStats(stats) {
        const container = document.getElementById('analyticsStats');
        if (!container) return;
        container.innerHTML = `
            ${Components.renderStatCard('fa-file-lines', stats.total, 'Total Reports', 'accent')}
            ${Components.renderStatCard('fa-exclamation-circle', stats.openIssues, 'Open Issues', 'warning')}
            ${Components.renderStatCard('fa-circle-check', stats.resolved, 'Resolved', 'success')}
            ${Components.renderStatCard('fa-percent', stats.resolutionRate + '%', 'Resolution Rate', 'info')}
        `;
    }

    function renderChartsRow1(stats) {
        const container = document.getElementById('chartsRow1');
        if (!container) return;

        // Category Distribution
        const catEntries = Object.entries(stats.byCategory)
            .filter(([, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);
        const maxCat = catEntries.length > 0 ? catEntries[0][1] : 1;

        const categoryBars = catEntries.map(([catId, count]) => {
            const cat = CivicUtils.getCategoryById(catId);
            const percent = Math.round((count / maxCat) * 100);
            return `
                <div class="bar-chart__item">
                    <div class="bar-chart__header">
                        <div class="bar-chart__label">
                            <i class="fa-solid ${cat.icon}" style="color: ${cat.color};"></i>
                            ${cat.label}
                        </div>
                        <div class="bar-chart__value">${count}</div>
                    </div>
                    <div class="bar-chart__track">
                        <div class="bar-chart__fill" style="width: ${percent}%; background: ${cat.color};"></div>
                    </div>
                </div>
            `;
        }).join('');

        // Severity Donut
        const sevColors = {
            low: '#3b82f6', medium: '#f59e0b', high: '#f97316', critical: '#ef4444'
        };
        const sevEntries = Object.entries(stats.bySeverity).filter(([, c]) => c > 0);
        const total = stats.total || 1;

        const circumference = 2 * Math.PI * 60;
        let offset = 0;
        const segments = sevEntries.map(([sevId, count]) => {
            const pct = count / total;
            const dashLen = circumference * pct;
            const dashOffset = circumference - offset;
            const seg = `<circle class="donut-chart__segment" cx="90" cy="90" r="60" stroke="${sevColors[sevId]}" stroke-dasharray="${dashLen} ${circumference}" stroke-dashoffset="-${offset}" />`;
            offset += dashLen;
            return seg;
        }).join('');

        const legend = sevEntries.map(([sevId, count]) => {
            const sev = CivicUtils.getSeverityById(sevId);
            return `
                <div class="donut-legend__item">
                    <div class="donut-legend__dot" style="background: ${sevColors[sevId]};"></div>
                    ${sev.label}: ${count}
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="chart-panel">
                <div class="chart-panel__header">
                    <h2 class="chart-panel__title"><i class="fa-solid fa-chart-bar"></i> Category Distribution</h2>
                </div>
                <div class="bar-chart">${categoryBars || '<p style="color:var(--text-tertiary);text-align:center;padding:var(--space-6);">No data available</p>'}</div>
            </div>
            <div class="chart-panel">
                <div class="chart-panel__header">
                    <h2 class="chart-panel__title"><i class="fa-solid fa-chart-pie"></i> Severity Distribution</h2>
                </div>
                <div class="donut-chart">
                    <svg class="donut-chart__svg" viewBox="0 0 180 180">${segments}</svg>
                    <div class="donut-chart__center">
                        <div class="donut-chart__center-value">${stats.total}</div>
                        <div class="donut-chart__center-label">Total</div>
                    </div>
                </div>
                <div class="donut-legend">${legend}</div>
            </div>
        `;
    }

    function renderChartsRow2(stats) {
        const container = document.getElementById('chartsRow2');
        if (!container) return;

        // Area Analysis
        const areaEntries = Object.entries(stats.byArea)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        const areaList = areaEntries.map(([area, count], i) => {
            const areaStats = DataService.getAreaStatistics(area);
            return `
                <div class="area-list-item" data-area="${area}">
                    <div class="area-list-item__rank">${i + 1}</div>
                    <div class="area-list-item__info">
                        <div class="area-list-item__name">${CivicUtils.sanitizeText(area)}</div>
                        <div class="area-list-item__meta">${areaStats.openIssues} open · ${areaStats.resolved} resolved</div>
                    </div>
                    <div class="area-list-item__count">${count}</div>
                </div>
            `;
        }).join('');

        // Resolution Gauge
        const circumference = 2 * Math.PI * 55;
        const fillLength = circumference * (stats.resolutionRate / 100);

        // Time Trends
        const trends = DataService.getTimeTrends(currentTrendDays);
        const trendEntries = Object.entries(trends);
        const maxTrend = Math.max(...Object.values(trends), 1);

        const trendBars = trendEntries.map(([date, count]) => {
            const height = Math.max(2, (count / maxTrend) * 150);
            const d = new Date(date);
            const label = `${d.getDate()}/${d.getMonth() + 1}`;
            return `
                <div class="trend-chart__bar" style="height: ${height}px;" title="${label}: ${count} reports">
                    <div class="trend-chart__bar-tooltip">${label}: ${count}</div>
                </div>
            `;
        }).join('');

        const firstDate = trendEntries.length > 0 ? new Date(trendEntries[0][0]) : new Date();
        const lastDate = trendEntries.length > 0 ? new Date(trendEntries[trendEntries.length - 1][0]) : new Date();

        container.innerHTML = `
            <div class="chart-panel">
                <div class="chart-panel__header">
                    <h2 class="chart-panel__title"><i class="fa-solid fa-location-dot"></i> Top Areas</h2>
                    <a href="reports.html" class="section__link">View all <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div class="area-list">${areaList || '<p style="color:var(--text-tertiary);text-align:center;padding:var(--space-6);">No data available</p>'}</div>
            </div>
            <div class="chart-panel">
                <div class="chart-panel__header">
                    <h2 class="chart-panel__title"><i class="fa-solid fa-bullseye"></i> Resolution Rate</h2>
                </div>
                <div class="resolution-gauge">
                    <div class="resolution-gauge__circle">
                        <svg class="resolution-gauge__svg" viewBox="0 0 120 120">
                            <circle class="resolution-gauge__track" cx="60" cy="60" r="55" />
                            <circle class="resolution-gauge__fill" cx="60" cy="60" r="55"
                                stroke-dasharray="${circumference}"
                                stroke-dashoffset="${circumference - fillLength}" />
                        </svg>
                        <div class="resolution-gauge__value">${stats.resolutionRate}%</div>
                    </div>
                    <div class="resolution-stats">
                        <div class="resolution-stat">
                            <div class="resolution-stat__value">${stats.total}</div>
                            <div class="resolution-stat__label">Total</div>
                        </div>
                        <div class="resolution-stat">
                            <div class="resolution-stat__value" style="color:var(--color-success);">${stats.resolved}</div>
                            <div class="resolution-stat__label">Resolved</div>
                        </div>
                        <div class="resolution-stat">
                            <div class="resolution-stat__value" style="color:var(--color-warning);">${stats.pending}</div>
                            <div class="resolution-stat__label">Pending</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add time trends below
        const trendsPanel = document.createElement('div');
        trendsPanel.className = 'analytics-grid analytics-grid--full';
        trendsPanel.style.marginTop = '0';
        trendsPanel.innerHTML = `
            <div class="chart-panel">
                <div class="chart-panel__header">
                    <h2 class="chart-panel__title"><i class="fa-solid fa-chart-area"></i> Report Trends</h2>
                    <div class="time-range-tabs" id="trendTabs">
                        <button class="time-range-tab ${currentTrendDays === 7 ? 'active' : ''}" data-days="7">7 Days</button>
                        <button class="time-range-tab ${currentTrendDays === 30 ? 'active' : ''}" data-days="30">30 Days</button>
                        <button class="time-range-tab ${currentTrendDays === 180 ? 'active' : ''}" data-days="180">6 Months</button>
                    </div>
                </div>
                <div class="trend-chart">
                    <div class="trend-chart__bars">${trendBars}</div>
                    <div class="trend-chart__labels">
                        <span class="trend-chart__label">${firstDate.toLocaleDateString('en-IN', {day:'numeric',month:'short'})}</span>
                        <span class="trend-chart__label">${lastDate.toLocaleDateString('en-IN', {day:'numeric',month:'short'})}</span>
                    </div>
                </div>
            </div>
        `;
        container.parentNode.insertBefore(trendsPanel, container.nextSibling);

        // Area list clicks
        document.querySelectorAll('.area-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const areaSelect = document.getElementById('areaSelect');
                if (areaSelect) {
                    areaSelect.value = item.dataset.area;
                    renderAreaDetail(item.dataset.area);
                    document.getElementById('areaIntelligence').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    function renderAreaMap(stats) {
        const container = document.getElementById('areaMap');
        if (!container) return;

        const areas = DataService.getActiveAreas();
        const areaData = {};
        areas.forEach(area => {
            areaData[area] = DataService.getAreaStatistics(area);
        });

        // Sort by report count
        const sortedAreas = Object.entries(areaData)
            .filter(([, d]) => d.total > 0)
            .sort((a, b) => b[1].total - a[1].total);

        if (sortedAreas.length === 0) {
            container.innerHTML = '<p style="color:var(--text-tertiary);text-align:center;padding:var(--space-6);">No area data available</p>';
            return;
        }

        const maxCount = sortedAreas[0][1].total;

        function getHeatLevel(count) {
            const ratio = count / maxCount;
            if (ratio >= 0.75) return 'critical';
            if (ratio >= 0.5) return 'high';
            if (ratio >= 0.25) return 'medium';
            return 'low';
        }

        const cells = sortedAreas.map(([area, data]) => `
            <div class="area-map__cell area-map__cell--${getHeatLevel(data.total)}" data-area="${area}" title="${area}: ${data.total} reports">
                <div class="area-map__cell-name">${area}</div>
                <div class="area-map__cell-count">${data.total}</div>
                <div class="area-map__cell-label">reports</div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="area-map__grid">${cells}</div>
            <div class="area-map__legend">
                <div class="area-map__legend-item">
                    <div class="area-map__legend-dot" style="background: rgba(59, 130, 246, 0.15);"></div> Low
                </div>
                <div class="area-map__legend-item">
                    <div class="area-map__legend-dot" style="background: rgba(245, 158, 11, 0.2);"></div> Medium
                </div>
                <div class="area-map__legend-item">
                    <div class="area-map__legend-dot" style="background: rgba(249, 115, 22, 0.25);"></div> High
                </div>
                <div class="area-map__legend-item">
                    <div class="area-map__legend-dot" style="background: rgba(239, 68, 68, 0.3);"></div> Critical
                </div>
            </div>
        `;

        // Click to show area detail
        container.querySelectorAll('.area-map__cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const area = cell.dataset.area;
                const areaSelect = document.getElementById('areaSelect');
                if (areaSelect) areaSelect.value = area;
                renderAreaDetail(area);
                document.getElementById('areaIntelligence').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function populateAreaSelector() {
        const select = document.getElementById('areaSelect');
        if (!select) return;

        const areas = DataService.getActiveAreas();
        areas.forEach(area => {
            const opt = document.createElement('option');
            opt.value = area;
            opt.textContent = area;
            select.appendChild(opt);
        });
    }

    function renderAreaDetail(area) {
        const container = document.getElementById('areaDetail');
        if (!container || !area) return;

        const areaStats = DataService.getAreaStatistics(area);

        // Category breakdown
        const catEntries = Object.entries(areaStats.byCategory)
            .filter(([, c]) => c > 0)
            .sort((a, b) => b[1] - a[1]);

        const catList = catEntries.map(([catId, count]) => {
            const cat = CivicUtils.getCategoryById(catId);
            return `<div style="display:flex;justify-content:space-between;padding:var(--space-2) 0;font-size:var(--text-sm);">
                <span><i class="fa-solid ${cat.icon}" style="color:${cat.color};width:18px;text-align:center;margin-right:var(--space-2);"></i>${cat.label}</span>
                <span style="font-weight:var(--weight-semibold);">${count}</span>
            </div>`;
        }).join('');

        container.innerHTML = `
            <div class="area-detail-grid stagger-children">
                ${Components.renderStatCard('fa-file-lines', areaStats.total, 'Total Reports', 'accent')}
                ${Components.renderStatCard('fa-exclamation-circle', areaStats.openIssues, 'Open Issues', 'warning')}
                ${Components.renderStatCard('fa-circle-check', areaStats.resolved, 'Resolved', 'success')}
            </div>
            <div class="analytics-grid" style="margin-top:var(--space-5);">
                <div class="chart-panel" style="box-shadow:none;border:1px solid var(--border-color);">
                    <h3 style="font-size:var(--text-sm);font-weight:var(--weight-semibold);margin-bottom:var(--space-3);color:var(--text-secondary);">Category Breakdown</h3>
                    ${catList || '<p style="color:var(--text-tertiary);">No data</p>'}
                </div>
                <div class="chart-panel" style="box-shadow:none;border:1px solid var(--border-color);">
                    <h3 style="font-size:var(--text-sm);font-weight:var(--weight-semibold);margin-bottom:var(--space-3);color:var(--text-secondary);">Quick Stats</h3>
                    <div style="display:flex;flex-direction:column;gap:var(--space-2);font-size:var(--text-sm);">
                        <div style="display:flex;justify-content:space-between;">
                            <span style="color:var(--text-tertiary);">Community Confirmations</span>
                            <span style="font-weight:var(--weight-bold);color:var(--color-accent);">${areaStats.totalConfirmations}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;">
                            <span style="color:var(--text-tertiary);">Resolution Rate</span>
                            <span style="font-weight:var(--weight-bold);color:var(--color-success);">${areaStats.resolutionRate}%</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;">
                            <span style="color:var(--text-tertiary);">Pending</span>
                            <span style="font-weight:var(--weight-semibold);">${areaStats.byStatus['Pending'] || 0}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;">
                            <span style="color:var(--text-tertiary);">In Progress</span>
                            <span style="font-weight:var(--weight-semibold);">${areaStats.byStatus['In Progress'] || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top:var(--space-4);">
                <a href="reports.html?area=${encodeURIComponent(area)}" class="btn btn--sm btn--accent-ghost">
                    <i class="fa-solid fa-list-check"></i> View all reports in ${CivicUtils.sanitizeText(area)}
                </a>
            </div>
        `;
    }

    function attachListeners() {
        // Area selector
        const areaSelect = document.getElementById('areaSelect');
        if (areaSelect) {
            areaSelect.addEventListener('change', () => {
                if (areaSelect.value) renderAreaDetail(areaSelect.value);
            });
        }

        // Trend tabs (using event delegation since they're rendered dynamically)
        document.addEventListener('click', (e) => {
            const tab = e.target.closest('.time-range-tab');
            if (!tab) return;
            const days = parseInt(tab.dataset.days);
            if (!days) return;

            currentTrendDays = days;
            document.querySelectorAll('.time-range-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Re-render trends
            const trendsContainer = tab.closest('.chart-panel').querySelector('.trend-chart');
            if (trendsContainer) {
                const trends = DataService.getTimeTrends(days);
                const trendEntries = Object.entries(trends);
                const maxTrend = Math.max(...Object.values(trends), 1);

                const trendBars = trendEntries.map(([date, count]) => {
                    const height = Math.max(2, (count / maxTrend) * 150);
                    const d = new Date(date);
                    const label = `${d.getDate()}/${d.getMonth() + 1}`;
                    return `<div class="trend-chart__bar" style="height: ${height}px;" title="${label}: ${count} reports">
                        <div class="trend-chart__bar-tooltip">${label}: ${count}</div>
                    </div>`;
                }).join('');

                const firstDate = trendEntries.length > 0 ? new Date(trendEntries[0][0]) : new Date();
                const lastDate = trendEntries.length > 0 ? new Date(trendEntries[trendEntries.length - 1][0]) : new Date();

                trendsContainer.innerHTML = `
                    <div class="trend-chart__bars">${trendBars}</div>
                    <div class="trend-chart__labels">
                        <span class="trend-chart__label">${firstDate.toLocaleDateString('en-IN', {day:'numeric',month:'short'})}</span>
                        <span class="trend-chart__label">${lastDate.toLocaleDateString('en-IN', {day:'numeric',month:'short'})}</span>
                    </div>
                `;
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
