/* ============================================
   CivicPulse — Utility Functions
   Helpers for IDs, dates, sanitization, validation.
   ============================================ */

const CivicUtils = (() => {
    'use strict';

    // ── Categories ──
    const CATEGORIES = [
        { id: 'pothole', label: 'Pothole / Road Damage', icon: 'fa-road', emoji: '🕳️', color: '#f97316' },
        { id: 'garbage', label: 'Garbage / Waste', icon: 'fa-trash', emoji: '🗑️', color: '#84cc16' },
        { id: 'streetlight', label: 'Broken Streetlight', icon: 'fa-lightbulb', emoji: '💡', color: '#eab308' },
        { id: 'water', label: 'Water Leakage', icon: 'fa-droplet', emoji: '💧', color: '#06b6d4' },
        { id: 'traffic', label: 'Traffic Signal Problem', icon: 'fa-traffic-light', emoji: '🚦', color: '#ef4444' },
        { id: 'obstruction', label: 'Road Obstruction', icon: 'fa-road-barrier', emoji: '🛣️', color: '#f59e0b' },
        { id: 'waterlogging', label: 'Waterlogging', icon: 'fa-cloud-rain', emoji: '🌧️', color: '#3b82f6' },
        { id: 'park', label: 'Public Space / Park Issue', icon: 'fa-tree', emoji: '🌳', color: '#22c55e' },
        { id: 'drainage', label: 'Drainage Problem', icon: 'fa-faucet-drip', emoji: '🚰', color: '#8b5cf6' },
        { id: 'noise', label: 'Noise / Public Disturbance', icon: 'fa-volume-high', emoji: '🔊', color: '#ec4899' },
        { id: 'electrical', label: 'Electrical Infrastructure', icon: 'fa-bolt', emoji: '⚡', color: '#f59e0b' },
        { id: 'other', label: 'Other', icon: 'fa-circle-plus', emoji: '➕', color: '#6b7280' }
    ];

    // ── Severity Levels ──
    const SEVERITY_LEVELS = [
        { id: 'low', label: 'Low', icon: 'fa-circle-info', description: 'Minor inconvenience', color: 'var(--severity-low)' },
        { id: 'medium', label: 'Medium', icon: 'fa-triangle-exclamation', description: 'Noticeable problem', color: 'var(--severity-medium)' },
        { id: 'high', label: 'High', icon: 'fa-exclamation-circle', description: 'Significant problem', color: 'var(--severity-high)' },
        { id: 'critical', label: 'Critical', icon: 'fa-skull-crossbones', description: 'Urgent / dangerous', color: 'var(--severity-critical)' }
    ];

    // ── Statuses ──
    const STATUSES = [
        { id: 'Pending', label: 'Pending', icon: 'fa-clock', cssClass: 'pending' },
        { id: 'Verified', label: 'Verified', icon: 'fa-check-circle', cssClass: 'verified' },
        { id: 'In Progress', label: 'In Progress', icon: 'fa-spinner', cssClass: 'in-progress' },
        { id: 'Resolved', label: 'Resolved', icon: 'fa-circle-check', cssClass: 'resolved' },
        { id: 'Rejected', label: 'Rejected', icon: 'fa-circle-xmark', cssClass: 'rejected' }
    ];

    // ── Areas ──
    const AREAS = [
        'Sector 12', 'Sector 15', 'Sector 18', 'Sector 21', 'Sector 22',
        'Sector 35', 'Sector 44', 'Sector 45', 'Sector 52', 'Sector 56',
        'Sector 62', 'Sector 63', 'Sector 72', 'Sector 78',
        'Civil Lines', 'Model Town', 'Rajpur Road', 'Clock Tower Area',
        'Old City', 'Industrial Area', 'IT Park', 'University Area'
    ];

    // ── ID Generation ──
    let reportCounter = null;

    function generateReportId() {
        if (reportCounter === null) {
            reportCounter = parseInt(localStorage.getItem('cp_report_counter') || '1000', 10);
        }
        reportCounter++;
        localStorage.setItem('cp_report_counter', reportCounter.toString());
        return `CP-${reportCounter}`;
    }

    function generateUserId() {
        return 'user_' + Math.random().toString(36).substring(2, 11);
    }

    // ── Date Formatting ──
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function formatDateTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function timeAgo(dateStr) {
        const now = new Date();
        const date = new Date(dateStr);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return formatDate(dateStr);
    }

    function isWithinDays(dateStr, days) {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = (now - date) / (1000 * 60 * 60 * 24);
        return diff <= days;
    }

    // ── Text Sanitization ──
    function sanitizeText(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function truncateText(text, maxLength = 150) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    // ── Validation ──
    function validateRequired(value, fieldName) {
        if (!value || !value.toString().trim()) {
            return `${fieldName} is required`;
        }
        return null;
    }

    function validateMinLength(value, min, fieldName) {
        if (value && value.length < min) {
            return `${fieldName} must be at least ${min} characters`;
        }
        return null;
    }

    function validateMaxLength(value, max, fieldName) {
        if (value && value.length > max) {
            return `${fieldName} must not exceed ${max} characters`;
        }
        return null;
    }

    function validateReport(data) {
        const errors = {};

        const categoryErr = validateRequired(data.category, 'Category');
        if (categoryErr) errors.category = categoryErr;

        const titleErr = validateRequired(data.title, 'Title') ||
            validateMinLength(data.title, 5, 'Title') ||
            validateMaxLength(data.title, 150, 'Title');
        if (titleErr) errors.title = titleErr;

        const locationErr = validateRequired(data.location, 'Area / Location');
        if (locationErr) errors.location = locationErr;

        const severityErr = validateRequired(data.severity, 'Severity');
        if (severityErr) errors.severity = severityErr;

        const descErr = validateRequired(data.description, 'Description') ||
            validateMinLength(data.description, 10, 'Description') ||
            validateMaxLength(data.description, 2000, 'Description');
        if (descErr) errors.description = descErr;

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // ── Category/Severity/Status Helpers ──
    function getCategoryById(id) {
        return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
    }

    function getSeverityById(id) {
        return SEVERITY_LEVELS.find(s => s.id === id) || SEVERITY_LEVELS[0];
    }

    function getStatusById(id) {
        return STATUSES.find(s => s.id === id) || STATUSES[0];
    }

    // ── Duplicate Detection ──
    function calculateSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        const s1 = str1.toLowerCase().trim();
        const s2 = str2.toLowerCase().trim();
        if (s1 === s2) return 1;

        // Simple word overlap coefficient
        const words1 = new Set(s1.split(/\s+/).filter(w => w.length > 2));
        const words2 = new Set(s2.split(/\s+/).filter(w => w.length > 2));
        if (words1.size === 0 || words2.size === 0) return 0;

        let overlap = 0;
        for (const word of words1) {
            if (words2.has(word)) overlap++;
        }
        return overlap / Math.min(words1.size, words2.size);
    }

    function findPotentialDuplicates(newReport, existingReports, threshold = 0.5) {
        const duplicates = [];
        for (const report of existingReports) {
            // Must be same category and location
            if (report.category !== newReport.category) continue;
            if (report.location !== newReport.location) continue;
            // Must be recent (within 30 days)
            if (!isWithinDays(report.createdAt, 30)) continue;
            // Must not be resolved/rejected
            if (report.status === 'Resolved' || report.status === 'Rejected') continue;

            const titleSim = calculateSimilarity(newReport.title, report.title);
            const descSim = calculateSimilarity(newReport.description, report.description);
            const similarity = Math.max(titleSim, descSim * 0.8);

            if (similarity >= threshold) {
                duplicates.push({ report, similarity });
            }
        }
        return duplicates.sort((a, b) => b.similarity - a.similarity);
    }

    // ── Number Formatting ──
    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    function calculatePercentage(part, total) {
        if (total === 0) return 0;
        return Math.round((part / total) * 100);
    }

    // ── Debounce ──
    function debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ── URL Params ──
    function getUrlParam(key) {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    function setUrlParam(key, value) {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }

    // ── Event Bus (simple pub/sub) ──
    const eventBus = {
        _listeners: {},

        on(event, callback) {
            if (!this._listeners[event]) this._listeners[event] = [];
            this._listeners[event].push(callback);
        },

        off(event, callback) {
            if (!this._listeners[event]) return;
            this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
        },

        emit(event, data) {
            if (!this._listeners[event]) return;
            this._listeners[event].forEach(cb => cb(data));
        }
    };

    return {
        CATEGORIES,
        SEVERITY_LEVELS,
        STATUSES,
        AREAS,
        generateReportId,
        generateUserId,
        formatDate,
        formatDateTime,
        timeAgo,
        isWithinDays,
        sanitizeText,
        truncateText,
        validateRequired,
        validateMinLength,
        validateMaxLength,
        validateReport,
        getCategoryById,
        getSeverityById,
        getStatusById,
        calculateSimilarity,
        findPotentialDuplicates,
        formatNumber,
        calculatePercentage,
        debounce,
        getUrlParam,
        setUrlParam,
        eventBus
    };
})();
