/* ============================================
   CivicPulse — Storage Adapter
   Abstraction over localStorage. Replace this
   file to connect a real database.
   ============================================ */

const StorageAdapter = (() => {
    'use strict';

    const STORAGE_PREFIX = 'civicpulse_';

    function _getKey(key) {
        return STORAGE_PREFIX + key;
    }

    function get(key) {
        try {
            const raw = localStorage.getItem(_getKey(key));
            if (raw === null) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.error(`StorageAdapter.get error for key "${key}":`, e);
            return null;
        }
    }

    function set(key, value) {
        try {
            localStorage.setItem(_getKey(key), JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`StorageAdapter.set error for key "${key}":`, e);
            // Could be quota exceeded
            if (e.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded. Consider clearing old data.');
            }
            return false;
        }
    }

    function remove(key) {
        try {
            localStorage.removeItem(_getKey(key));
            return true;
        } catch (e) {
            console.error(`StorageAdapter.remove error for key "${key}":`, e);
            return false;
        }
    }

    function has(key) {
        return localStorage.getItem(_getKey(key)) !== null;
    }

    function clearAll() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) {
                keys.push(key);
            }
        }
        keys.forEach(key => localStorage.removeItem(key));
    }

    function getStorageSize() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) {
                total += localStorage.getItem(key).length * 2; // UTF-16 bytes
            }
        }
        return total;
    }

    return {
        get,
        set,
        remove,
        has,
        clearAll,
        getStorageSize
    };
})();
