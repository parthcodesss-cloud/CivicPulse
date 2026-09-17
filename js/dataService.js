/* ============================================
   CivicPulse — Data Service
   Business logic layer. All CRUD and statistics
   operations go through this module.
   ============================================ */

const DataService = (() => {
    'use strict';

    const REPORTS_KEY = 'reports';
    const USER_KEY = 'current_user';

    // ── Initialize ──
    function init() {
        if (!StorageAdapter.has(REPORTS_KEY)) {
            StorageAdapter.set(REPORTS_KEY, []);
        }
    }

    // ══════════════════════════════════════
    // REPORT CRUD
    // ══════════════════════════════════════

    function getReports() {
        return StorageAdapter.get(REPORTS_KEY) || [];
    }

    function getReportById(id) {
        const reports = getReports();
        return reports.find(r => r.id === id) || null;
    }

    function addReport(data) {
        const reports = getReports();
        const user = getCurrentUser();
        const now = new Date().toISOString();

        const report = {
            id: CivicUtils.generateReportId(),
            title: data.title.trim(),
            category: data.category,
            location: data.location,
            description: data.description.trim(),
            severity: data.severity,
            status: 'Pending',
            createdAt: now,
            updatedAt: now,
            reportedBy: user.userId,
            confirmations: 1, // Reporter auto-confirms
            confirmedBy: [user.userId],
            verified: false,
            verifiedAt: null,
            resolvedAt: null,
            image: data.image || null,
            statusHistory: [
                { status: 'Pending', timestamp: now, by: user.userId }
            ],
            isDemo: false
        };

        reports.unshift(report); // newest first
        StorageAdapter.set(REPORTS_KEY, reports);

        // Add to user's reportIds
        if (!user.reportIds.includes(report.id)) {
            user.reportIds.push(report.id);
            saveCurrentUser(user);
        }

        CivicUtils.eventBus.emit('reportAdded', report);
        return report;
    }

    function updateReport(id, updates) {
        const reports = getReports();
        const index = reports.findIndex(r => r.id === id);
        if (index === -1) return null;

        reports[index] = {
            ...reports[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        StorageAdapter.set(REPORTS_KEY, reports);
        CivicUtils.eventBus.emit('reportUpdated', reports[index]);
        return reports[index];
    }

    function deleteReport(id) {
        let reports = getReports();
        const report = reports.find(r => r.id === id);
        if (!report) return false;

        reports = reports.filter(r => r.id !== id);
        StorageAdapter.set(REPORTS_KEY, reports);
        CivicUtils.eventBus.emit('reportDeleted', { id });
        return true;
    }

    function changeReportStatus(id, newStatus, changedBy = 'admin') {
        const report = getReportById(id);
        if (!report) return null;

        const now = new Date().toISOString();
        const statusEntry = { status: newStatus, timestamp: now, by: changedBy };

        const updates = {
            status: newStatus,
            statusHistory: [...report.statusHistory, statusEntry]
        };

        if (newStatus === 'Verified') {
            updates.verified = true;
            updates.verifiedAt = now;
        }

        if (newStatus === 'Resolved') {
            updates.resolvedAt = now;
        }

        return updateReport(id, updates);
    }

    // ══════════════════════════════════════
    // COMMUNITY CONFIRMATION
    // ══════════════════════════════════════

    function confirmReport(id) {
        const report = getReportById(id);
        if (!report) return { success: false, message: 'Report not found' };

        const user = getCurrentUser();

        if (report.confirmedBy.includes(user.userId)) {
            return { success: false, message: 'You have already confirmed this issue' };
        }

        const updates = {
            confirmations: report.confirmations + 1,
            confirmedBy: [...report.confirmedBy, user.userId]
        };

        const updated = updateReport(id, updates);

        // Add to user's confirmed list
        if (!user.confirmedIds.includes(id)) {
            user.confirmedIds.push(id);
            saveCurrentUser(user);
        }

        return { success: true, report: updated };
    }

    function hasUserConfirmed(id) {
        const report = getReportById(id);
        const user = getCurrentUser();
        if (!report) return false;
        return report.confirmedBy.includes(user.userId);
    }

    // ══════════════════════════════════════
    // SEARCH, FILTER, SORT
    // ══════════════════════════════════════

    function searchReports(query, filters = {}, sortBy = 'newest') {
        let reports = getReports();

        // Text search
        if (query && query.trim()) {
            const q = query.toLowerCase().trim();
            reports = reports.filter(r =>
                r.title.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q) ||
                r.location.toLowerCase().includes(q) ||
                r.id.toLowerCase().includes(q) ||
                r.category.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
            reports = reports.filter(r => r.category === filters.category);
        }

        // Area filter
        if (filters.area && filters.area !== 'all') {
            reports = reports.filter(r => r.location === filters.area);
        }

        // Severity filter
        if (filters.severity && filters.severity !== 'all') {
            reports = reports.filter(r => r.severity === filters.severity);
        }

        // Status filter
        if (filters.status && filters.status !== 'all') {
            reports = reports.filter(r => r.status === filters.status);
        }

        // Date filter
        if (filters.dateRange) {
            switch (filters.dateRange) {
                case '7days':
                    reports = reports.filter(r => CivicUtils.isWithinDays(r.createdAt, 7));
                    break;
                case '30days':
                    reports = reports.filter(r => CivicUtils.isWithinDays(r.createdAt, 30));
                    break;
                case '6months':
                    reports = reports.filter(r => CivicUtils.isWithinDays(r.createdAt, 180));
                    break;
            }
        }

        // Sorting
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        switch (sortBy) {
            case 'newest':
                reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                reports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'most-confirmed':
                reports.sort((a, b) => b.confirmations - a.confirmations);
                break;
            case 'highest-severity':
                reports.sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));
                break;
        }

        return reports;
    }

    // ══════════════════════════════════════
    // STATISTICS
    // ══════════════════════════════════════

    function getStatistics() {
        const reports = getReports();
        const total = reports.length;
        const byStatus = {};
        const byCategory = {};
        const bySeverity = {};
        const byArea = {};
        let totalConfirmations = 0;

        CivicUtils.STATUSES.forEach(s => byStatus[s.id] = 0);
        CivicUtils.CATEGORIES.forEach(c => byCategory[c.id] = 0);
        CivicUtils.SEVERITY_LEVELS.forEach(s => bySeverity[s.id] = 0);

        reports.forEach(r => {
            // Status
            if (byStatus[r.status] !== undefined) {
                byStatus[r.status]++;
            }

            // Category
            if (byCategory[r.category] !== undefined) {
                byCategory[r.category]++;
            }

            // Severity
            if (bySeverity[r.severity] !== undefined) {
                bySeverity[r.severity]++;
            }

            // Area
            if (!byArea[r.location]) byArea[r.location] = 0;
            byArea[r.location]++;

            // Confirmations
            totalConfirmations += r.confirmations;
        });

        const resolved = byStatus['Resolved'] || 0;
        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        // Most reported category
        const mostReportedCategory = Object.entries(byCategory)
            .sort((a, b) => b[1] - a[1])[0];

        // Most affected area
        const mostAffectedArea = Object.entries(byArea)
            .sort((a, b) => b[1] - a[1])[0];

        // Open issues (Pending + Verified + In Progress)
        const openIssues = (byStatus['Pending'] || 0) + (byStatus['Verified'] || 0) + (byStatus['In Progress'] || 0);

        return {
            total,
            openIssues,
            inProgress: byStatus['In Progress'] || 0,
            resolved,
            pending: byStatus['Pending'] || 0,
            verified: byStatus['Verified'] || 0,
            rejected: byStatus['Rejected'] || 0,
            resolutionRate,
            totalConfirmations,
            byStatus,
            byCategory,
            bySeverity,
            byArea,
            mostReportedCategory: mostReportedCategory ? {
                id: mostReportedCategory[0],
                count: mostReportedCategory[1]
            } : null,
            mostAffectedArea: mostAffectedArea ? {
                name: mostAffectedArea[0],
                count: mostAffectedArea[1]
            } : null
        };
    }

    function getAreaStatistics(area) {
        const reports = getReports().filter(r => r.location === area);
        const total = reports.length;
        const byCategory = {};
        const byStatus = {};
        let totalConfirmations = 0;

        CivicUtils.CATEGORIES.forEach(c => byCategory[c.id] = 0);
        CivicUtils.STATUSES.forEach(s => byStatus[s.id] = 0);

        reports.forEach(r => {
            if (byCategory[r.category] !== undefined) byCategory[r.category]++;
            if (byStatus[r.status] !== undefined) byStatus[r.status]++;
            totalConfirmations += r.confirmations;
        });

        const openIssues = (byStatus['Pending'] || 0) + (byStatus['Verified'] || 0) + (byStatus['In Progress'] || 0);
        const resolved = byStatus['Resolved'] || 0;

        return {
            area,
            total,
            openIssues,
            resolved,
            totalConfirmations,
            byCategory,
            byStatus,
            resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
        };
    }

    function getTimeTrends(days = 30) {
        const reports = getReports();
        const trends = {};
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            trends[key] = 0;
        }

        reports.forEach(r => {
            const key = r.createdAt.split('T')[0];
            if (trends[key] !== undefined) {
                trends[key]++;
            }
        });

        return trends;
    }

    function getRecentReports(limit = 5) {
        const reports = getReports();
        return reports.slice(0, limit);
    }

    function getReportsByUser(userId) {
        return getReports().filter(r => r.reportedBy === userId);
    }

    // ══════════════════════════════════════
    // USER MANAGEMENT
    // ══════════════════════════════════════

    function getCurrentUser() {
        let user = StorageAdapter.get(USER_KEY);
        if (!user) {
            user = createDefaultUser();
            saveCurrentUser(user);
        }
        return user;
    }

    function createDefaultUser() {
        return {
            userId: CivicUtils.generateUserId(),
            displayName: 'Citizen',
            role: 'citizen',
            createdAt: new Date().toISOString(),
            reportIds: [],
            confirmedIds: [],
            preferences: {
                theme: 'light',
                notifications: true
            }
        };
    }

    function saveCurrentUser(user) {
        StorageAdapter.set(USER_KEY, user);
    }

    function updateUserPreferences(prefs) {
        const user = getCurrentUser();
        user.preferences = { ...user.preferences, ...prefs };
        saveCurrentUser(user);
        return user;
    }

    function setUserRole(role) {
        const user = getCurrentUser();
        user.role = role;
        saveCurrentUser(user);
        return user;
    }

    function setDisplayName(name) {
        const user = getCurrentUser();
        user.displayName = name.trim().substring(0, 50);
        saveCurrentUser(user);
        return user;
    }

    function isAdmin() {
        const user = getCurrentUser();
        return user.role === 'admin';
    }

    function getUserStats() {
        const user = getCurrentUser();
        const reports = getReportsByUser(user.userId);
        const verified = reports.filter(r => r.verified).length;
        const resolved = reports.filter(r => r.status === 'Resolved').length;

        return {
            totalReports: reports.length,
            verified,
            resolved,
            totalConfirmations: user.confirmedIds.length
        };
    }

    // ══════════════════════════════════════
    // SEED DATA
    // ══════════════════════════════════════

    function isSeedDataLoaded() {
        return StorageAdapter.has('seed_loaded');
    }

    function markSeedDataLoaded() {
        StorageAdapter.set('seed_loaded', true);
    }

    function loadSeedData(seedReports) {
        if (isSeedDataLoaded()) return;

        const reports = getReports();
        const allReports = [...seedReports, ...reports];
        StorageAdapter.set(REPORTS_KEY, allReports);
        markSeedDataLoaded();

        // Update counter to be above highest seed ID
        let maxCounter = 1000;
        seedReports.forEach(r => {
            const num = parseInt(r.id.replace('CP-', ''), 10);
            if (num > maxCounter) maxCounter = num;
        });
        localStorage.setItem('cp_report_counter', maxCounter.toString());
    }

    // ══════════════════════════════════════
    // CLEAR DATA
    // ══════════════════════════════════════

    function clearAllData() {
        StorageAdapter.clearAll();
        localStorage.removeItem('cp_report_counter');
    }

    function clearUserReports() {
        const user = getCurrentUser();
        let reports = getReports();
        reports = reports.filter(r => r.reportedBy !== user.userId || r.isDemo);
        StorageAdapter.set(REPORTS_KEY, reports);
        user.reportIds = [];
        saveCurrentUser(user);
    }

    // ── Get unique areas from existing reports ──
    function getActiveAreas() {
        const reports = getReports();
        const areas = new Set();
        reports.forEach(r => areas.add(r.location));
        // Also add known areas
        CivicUtils.AREAS.forEach(a => areas.add(a));
        return Array.from(areas).sort();
    }

    return {
        init,
        // CRUD
        getReports,
        getReportById,
        addReport,
        updateReport,
        deleteReport,
        changeReportStatus,
        // Confirmation
        confirmReport,
        hasUserConfirmed,
        // Search & Filter
        searchReports,
        // Statistics
        getStatistics,
        getAreaStatistics,
        getTimeTrends,
        getRecentReports,
        getReportsByUser,
        // User
        getCurrentUser,
        saveCurrentUser,
        updateUserPreferences,
        setUserRole,
        setDisplayName,
        isAdmin,
        getUserStats,
        // Seed
        isSeedDataLoaded,
        loadSeedData,
        // Data management
        clearAllData,
        clearUserReports,
        getActiveAreas
    };
})();
