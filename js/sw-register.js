// Service Worker Registration with PWA support
const swRegister = {
    init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                this.register();
            });
        } else {
            console.log('Service Worker tidak didukung browser ini');
        }
    },
    
    register() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Service Worker update found');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            this.showUpdatePrompt(registration);
                        }
                    });
                });
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
            
        // Handle controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker controller changed');
        });
    },
    
    showUpdatePrompt(registration) {
        // Tampilkan notifikasi update tersedia
        uiManager.showConfirm(
            'Update Tersedia! 🚀',
            'Versi baru Codeners tersedia. Refresh untuk update?',
            () => {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            },
            () => {
                // User declined update
                console.log('Update ditunda');
            }
        );
    },
    
    async unregister() {
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
            }
            console.log('Service Worker unregistered');
            return true;
        } catch (error) {
            console.error('Failed to unregister SW:', error);
            return false;
        }
    }
};

// Initialize
swRegister.init();

// Export for debugging
window.swRegister = swRegister;
