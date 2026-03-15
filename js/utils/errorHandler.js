const ErrorHandler = {
    errors: [],
    maxLogs: 50,
    
    handle(error, context = 'general') {
        // Buat error object
        const errorObj = {
            id: Date.now() + Math.random().toString(36),
            timestamp: new Date().toISOString(),
            context,
            message: error?.message || 'Unknown error',
            stack: error?.stack,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Log ke console
        console.error(`[${context}] Error:`, errorObj.message);
        if (error?.stack) {
            console.debug(error.stack);
        }
        
        // Simpan ke memory
        this.errors.push(errorObj);
        if (this.errors.length > this.maxLogs) {
            this.errors.shift();
        }
        
        // Simpan ke storage
        this.saveToStorage(errorObj);
        
        // Tampilkan ke user (kecuali silent error)
        if (error && !error.silent) {
            this.showToUser(errorObj);
        }
        
        return {
            success: false,
            error: errorObj.message,
            context,
            errorId: errorObj.id
        };
    },
    
    saveToStorage(errorObj) {
        try {
            const logs = STORAGE.load(STORAGE.KEYS.ERROR_LOGS, []);
            logs.push(errorObj);
            
            // Simpan maksimal 50 log
            if (logs.length > 50) logs.shift();
            
            STORAGE.save(STORAGE.KEYS.ERROR_LOGS, logs);
        } catch (e) {
            console.error('Failed to save error log:', e);
        }
    },
    
    showToUser(errorObj) {
        // Jangan tampilkan terlalu banyak error dalam waktu singkat
        if (this.lastShowTime && Date.now() - this.lastShowTime < 5000) {
            return;
        }
        
        this.lastShowTime = Date.now();
        
        let message = errorObj.message;
        if (message.length > 100) {
            message = message.substring(0, 100) + '...';
        }
        
        // Gunakan uiManager jika tersedia
        if (window.uiManager) {
            uiManager.showToast(`Error: ${message}`, 'error');
        } else {
            alert(`Error: ${message}\nContext: ${errorObj.context}`);
        }
    },
    
    wrap(fn, context) {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                return this.handle(error, context);
            }
        };
    },
    
    getLogs() {
        return this.errors;
    },
    
    getStorageLogs() {
        return STORAGE.load(STORAGE.KEYS.ERROR_LOGS, []);
    },
    
    clearLogs() {
        this.errors = [];
        STORAGE.remove(STORAGE.KEYS.ERROR_LOGS);
    },
    
    // Method untuk testing
    test() {
        try {
            throw new Error('Test error');
        } catch (e) {
            return this.handle(e, 'test');
        }
    }
};

// Global error handlers
window.addEventListener('error', (event) => {
    ErrorHandler.handle(event.error, 'uncaught');
    return false;
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handle(event.reason, 'unhandledrejection');
});

// Export untuk debugging
window.ErrorHandler = ErrorHandler;
