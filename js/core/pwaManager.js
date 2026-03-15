const pwaManager = {
    deferredPrompt: null,
    promptElement: document.getElementById('pwa-prompt'),
    installPreference: localStorage.getItem('codeners_pwa_install_preference'),
    
    init() {
        // Cek apakah sudah diinstall
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('App is running in standalone mode');
            return;
        }
        
        // Tampilkan prompt jika belum pernah decline
        if (this.installPreference !== 'declined') {
            // Tampilkan setelah 3 detik
            setTimeout(() => {
                this.showPrompt();
            }, 3000);
        }
        
        // Listen for beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Tampilkan prompt jika belum pernah decline
            if (this.installPreference !== 'declined') {
                this.showPrompt();
            }
        });
        
        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            this.hidePrompt();
            this.deferredPrompt = null;
            localStorage.setItem('codeners_pwa_install_preference', 'installed');
            uiManager.showToast('Codeners berhasil diinstall!', 'success');
        });
    },
    
    showPrompt() {
        if (this.promptElement) {
            this.promptElement.style.display = 'flex';
        }
    },
    
    hidePrompt() {
        if (this.promptElement) {
            this.promptElement.style.display = 'none';
        }
    },
    
    async install() {
        if (!this.deferredPrompt) {
            uiManager.showToast('Installasi tidak tersedia saat ini', 'warning');
            return;
        }
        
        try {
            this.deferredPrompt.prompt();
            const choiceResult = await this.deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                localStorage.setItem('codeners_pwa_install_preference', 'installed');
                uiManager.showToast('Terima kasih telah menginstall Codeners!', 'success');
            } else {
                localStorage.setItem('codeners_pwa_install_preference', 'declined');
            }
            
            this.deferredPrompt = null;
            this.hidePrompt();
            
        } catch (error) {
            ErrorHandler.handle(error, 'pwa-install');
        }
    },
    
    declineInstall() {
        localStorage.setItem('codeners_pwa_install_preference', 'declined');
        this.hidePrompt();
        uiManager.showToast('Anda bisa menginstall nanti melalui menu browser', 'info');
    }
};
