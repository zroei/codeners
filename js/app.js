const app = {
    files: [],
    activeId: null,
    settings: {},
    
    async init() {
        try {
            // Load settings
            this.settings = STORAGE.load(STORAGE.KEYS.SETTINGS, {
                theme: 'dark',
                fontSize: 14,
                autoSave: true
            });
            
            // Load files
            const saved = STORAGE.load(STORAGE.KEYS.FILES);
            
            if (saved && saved.length > 0) {
                this.files = saved;
                if (this.files.length > 0) {
                    fileManager.renderTabs();
                    this.openFile(this.files[0].id);
                }
            } else {
                // Default file
                this.createDefaultFile();
            }
            
            // Save to storage
            STORAGE.save(STORAGE.KEYS.FILES, this.files);
            
            // Initialize PWA manager
            pwaManager.init();
            
            uiManager.showToast('Codeners siap digunakan!', 'success');
            
        } catch (error) {
            ErrorHandler.handle(error, 'app-init');
        }
    },
    
    createDefaultFile() {
        this.files = [{
            id: 'f' + Date.now(),
            name: 'index',
            lang: 'html',
            code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Saya</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
        }
        h1 {
            color: #2ea043;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>✨ Selamat Datang di Codeners!</h1>
    <p>Editor kode profesional dengan dukungan multi-bahasa.</p>
    <p>Fitur-fitur:</p>
    <ul>
        <li>Multi-language (HTML, CSS, JS, Python, JSON)</li>
        <li>Live preview</li>
        <li>PWA - bisa digunakan offline</li>
        <li>Syntax highlighting</li>
    </ul>
</body>
</html>`
        }];
        
        fileManager.renderTabs();
        this.openFile(this.files[0].id);
    },
    
    openFile(id) {
        try {
            this.activeId = id;
            const f = this.getActiveFile();
            
            if (f) {
                editor.setContent(f.code, f.lang);
                fileManager.fileLabel.innerText = `EDITING: ${f.name}.${f.lang}`;
                fileManager.renderTabs();
                preview.render();
            }
        } catch (error) {
            ErrorHandler.handle(error, 'open-file');
        }
    },
    
    getActiveFile() {
        return this.files.find(f => f.id === this.activeId);
    },
    
    updateFile(id, updates) {
        try {
            const index = this.files.findIndex(f => f.id === id);
            if (index !== -1) {
                this.files[index] = { ...this.files[index], ...updates };
                STORAGE.save(STORAGE.KEYS.FILES, this.files);
                return true;
            }
            return false;
        } catch (error) {
            ErrorHandler.handle(error, 'update-file');
            return false;
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    editor.init();
    app.init();
});
