/* ============================================
   CivicPulse — Auth Module
   User identity and role management.
   ============================================ */

const Auth = (() => {
    'use strict';

    const ADMIN_CODE = 'civicadmin';

    function init() {
        DataService.getCurrentUser();
    }

    function getCurrentUser() {
        return DataService.getCurrentUser();
    }

    function isAdmin() {
        return DataService.isAdmin();
    }

    function toggleAdmin(code) {
        if (isAdmin()) {
            DataService.setUserRole('citizen');
            return { success: true, role: 'citizen', message: 'Switched to Citizen mode' };
        }

        if (code && code.toLowerCase() === ADMIN_CODE) {
            DataService.setUserRole('admin');
            return { success: true, role: 'admin', message: 'Admin access granted' };
        }

        return { success: false, message: 'Invalid admin code' };
    }

    function setDisplayName(name) {
        if (!name || !name.trim()) {
            return { success: false, message: 'Name cannot be empty' };
        }
        DataService.setDisplayName(name);
        return { success: true, message: 'Display name updated' };
    }

    function getDisplayName() {
        return DataService.getCurrentUser().displayName || 'Citizen';
    }

    return {
        init,
        getCurrentUser,
        isAdmin,
        toggleAdmin,
        setDisplayName,
        getDisplayName
    };
})();
