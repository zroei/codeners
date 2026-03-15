const uiManager = {
    modalOverlay: document.getElementById('modal-overlay'),
    modalTitle: document.getElementById('m-title'),
    modalText: document.getElementById('m-text'),
    modalConfirm: document.getElementById('m-confirm'),
    toastContainer: document.getElementById('toast-container'),
    
    currentView: 'split',
    toastTimeout: null,
    
    init() {
        // Close modal on outside click
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.style.display === 'flex') {
                this.closeModal();
            }
        });
    },
    
    toggleView(target) {
        try {
            const ed = document.getElementById('pane-editor');
            const pr = document.getElementById('pane-preview');
            
            if (!ed || !pr) return;
            
            if (this.currentView === target) {
                this.currentView = 'split';
                ed.classList.remove('hidden', 'expanded');
                pr.classList.remove('hidden', 'expanded');
                this.showToast('Mode Split View', 'info');
            } else {
                this.currentView = target;
                if (target === 'editor') {
                    ed.classList.add('expanded');
                    pr.classList.add('hidden');
                    this.showToast('Mode Editor (Expanded)', 'info');
                } else {
                    pr.classList.add('expanded');
                    ed.classList.add('hidden');
                    this.showToast('Mode Preview (Expanded)', 'info');
                }
            }
        } catch (error) {
            ErrorHandler.handle(error, 'ui-toggle-view');
        }
    },
    
    showConfirm(title, text, onOk, onCancel = null) {
        try {
            this.modalTitle.innerText = title;
            this.modalText.innerText = text;
            this.modalConfirm.style.display = 'block';
            this.modalConfirm.onclick = () => {
                if (onOk) onOk();
                this.closeModal();
            };
            
            // Set cancel button
            const cancelBtn = document.querySelector('.modal-btn.cancel');
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    if (onCancel) onCancel();
                    this.closeModal();
                };
            }
            
            this.modalOverlay.style.display = 'flex';
        } catch (error) {
            ErrorHandler.handle(error, 'ui-show-confirm');
        }
    },
    
    showAlert(title, text, type = 'info') {
        try {
            this.modalTitle.innerText = title;
            this.modalText.innerText = text;
            this.modalConfirm.style.display = 'none';
            
            // Set cancel button text
            const cancelBtn = document.querySelector('.modal-btn.cancel');
            if (cancelBtn) {
                cancelBtn.textContent = 'TUTUP';
                cancelBtn.onclick = () => this.closeModal();
            }
            
            this.modalOverlay.style.display = 'flex';
            
            // Auto close for success/info alerts
            if (type !== 'error') {
                setTimeout(() => this.closeModal(), 3000);
            }
        } catch (error) {
            ErrorHandler.handle(error, 'ui-show-alert');
        }
    },
    
    showResetConfirm() {
        this.showConfirm(
            '⚠️ RESET SEMUA', 
            'Semua file dan pengaturan akan dihapus. Tindakan ini tidak bisa dibatalkan!',
            () => {
                STORAGE.clear();
                localStorage.removeItem(STORAGE.KEYS.FILES);
                localStorage.removeItem(STORAGE.KEYS.SETTINGS);
                this.showToast('Semua data telah direset', 'warning');
                setTimeout(() => location.reload(), 1000);
            }
        );
    },
    
    closeModal() {
        if (this.modalOverlay) {
            this.modalOverlay.style.display = 'none';
        }
    },
    
    showToast(message, type = 'info', duration = 3000) {
        try {
            if (!this.toastContainer) return;
            
            // Clear existing timeout
            if (this.toastTimeout) {
                clearTimeout(this.toastTimeout);
            }
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            // Add icon based on type
            let icon = 'ri-information-line';
            if (type === 'success') icon = 'ri-checkbox-circle-line';
            if (type === 'error') icon = 'ri-error-warning-line';
            if (type === 'warning') icon = 'ri-alert-line';
            
            toast.innerHTML = `<i class="${icon}" style="margin-right: 8px;"></i>${message}`;
            
            this.toastContainer.appendChild(toast);
            
            // Remove toast after duration
            this.toastTimeout = setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, duration);
            
        } catch (error) {
            console.error('Toast error:', error);
        }
    },
    
    updateFileLabel(name, lang) {
        const label = document.getElementById('file-label');
        if (label) {
            label.innerText = `EDITING: ${name}.${lang}`;
        }
    },
    
    showLoading(show = true) {
        // Optional loading indicator
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }
};

// Initialize UI Manager
document.addEventListener('DOMContentLoaded', () => {
    uiManager.init();
});

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
