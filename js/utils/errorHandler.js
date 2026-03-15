const ErrorHandler = {
    handle(error, context = 'general') {
        console.error(`[${context}] Error:`, error);
        
        // Log ke storage untuk debugging
        this.logError(error, context);
        
        // Tampilkan ke user jika perlu
        if (error.message && !error.silent) {
            uiManager.showToast(`Error: ${error.message}`, 'error');
        }
        
        return {
            success: false,
            error: error.message || 'Terjadi kesalahan',
            context
        };
    },
    
    logError(error, context) {
        try {
            const logs = JSON.parse(localStorage.getItem('codeners_error_logs') || '[]');
            logs.push({
                timestamp: new Date().toISOString(),
                context,
                message: error.message,
                stack: error.stack
            });
            
            // Simpan maksimal 50 log
            if (logs.length > 50) logs.shift();
            
            localStorage.setItem('codeners_error_logs', JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to log error:', e);
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
    }
};

// Global error handler
window.addEventListener('error', (event) => {
    ErrorHandler.handle(event.error, 'uncaught');
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handle(event.reason, 'unhandledrejection');
});
