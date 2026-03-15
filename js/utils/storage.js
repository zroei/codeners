const STORAGE = {
    KEYS: {
        FILES: 'codeners_files_v2',
        SETTINGS: 'codeners_settings_v1',
        PWA_PREF: 'codeners_pwa_install_preference',
        ERROR_LOGS: 'codeners_error_logs'
    },
    
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return { success: true };
        } catch (e) {
            return ErrorHandler.handle(e, 'storage-save');
        }
    },
    
    load(key, defaultValue = null) {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
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
    }
};
