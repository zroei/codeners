const STORAGE = {
    KEYS: {
        FILES: 'codeners_files_v2',
        SETTINGS: 'codeners_settings_v1',
        PWA_PREF: 'codeners_pwa_install_preference',
        ERROR_LOGS: 'codeners_error_logs',
        UI_STATE: 'codeners_ui_state_v1'
    },
    
    save(key, data) {
        try {
            const serialized = JSON.stringify(data, null, 2);
            localStorage.setItem(key, serialized);
            return { success: true, key };
        } catch (e) {
            return ErrorHandler.handle(e, 'storage-save');
        }
    },
    
    load(key, defaultValue = null) {
        try {
            const saved = localStorage.getItem(key);
            if (saved === null) return defaultValue;
            
            return JSON.parse(saved);
        } catch (e) {
            ErrorHandler.handle(e, 'storage-load');
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return { success: true };
        } catch (e) {
            return ErrorHandler.handle(e, 'storage-remove');
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return { success: true };
        } catch (e) {
            return ErrorHandler.handle(e, 'storage-clear');
        }
    },
    
    // Storage info
    getInfo() {
        try {
            const total = localStorage.length;
            const size = JSON.stringify(localStorage).length;
            
            return {
                total,
                size: (size / 1024).toFixed(2) + ' KB',
                keys: Object.keys(localStorage)
            };
        } catch (e) {
            return ErrorHandler.handle(e, 'storage-info');
        }
    },
    
    // Export all data
    exportData() {
        try {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = JSON.parse(localStorage.getItem(key));
            }
            return data;
        } catch (e) {
            return ErrorHandler.handle(e, 'storage-export');
        }
    },
    
    // Import data
    importData(data) {
        try {
            this.clear();
            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(key, JSON.stringify(value));
            });
            return { success: true };
        } catch (e) {
            return ErrorHandler.handle(e, 'storage-import');
        }
    }
};
