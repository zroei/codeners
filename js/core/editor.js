const editor = {
    textarea: document.getElementById('editing-area'),
    highlighting: document.getElementById('highlighting-content'),
    highlightingArea: document.getElementById('highlighting-area'),
    langSelect: document.getElementById('lang-select'),
    
    init() {
        try {
            if (!this.textarea) return;
            
            // Load settings
            const settings = STORAGE.load(STORAGE.KEYS.SETTINGS, {});
            if (settings.fontSize) {
                this.textarea.style.fontSize = settings.fontSize + 'px';
                this.highlightingArea.style.fontSize = settings.fontSize + 'px';
            }
            
            this.textarea.value = '';
            this.highlight();
            
            // Auto save setiap 2 detik
            if (settings.autoSave) {
                setInterval(() => this.autoSave(), 2000);
            }
            
        } catch (error) {
            ErrorHandler.handle(error, 'editor-init');
        }
    },
    
    handleInput(e) {
        try {
            const code = e.target.value;
            const f = app.getActiveFile();
            if (f) {
                f.code = code;
                if (app.settings.autoSave) {
                    STORAGE.save(STORAGE.KEYS.FILES, app.files);
                }
            }
            this.highlight();
        } catch (error) {
            ErrorHandler.handle(error, 'editor-input');
        }
    },
    
    autoSave() {
        try {
            if (app.files && app.activeId) {
                STORAGE.save(STORAGE.KEYS.FILES, app.files);
            }
        } catch (error) {
            // Silent error for autosave
            console.error('Autosave failed:', error);
        }
    },
    
    handleTabs(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            try {
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                e.target.value = e.target.value.substring(0, start) + "    " + e.target.value.substring(end);
                e.target.selectionStart = e.target.selectionEnd = start + 4;
                this.handleInput(e);
            } catch (error) {
                ErrorHandler.handle(error, 'editor-tab');
            }
        }
    },
    
    highlight() {
        try {
            if (!this.textarea || !this.highlighting) return;
            
            const code = this.textarea.value || '';
            const lang = this.langSelect.value;
            
            this.highlighting.className = `language-${lang}`;
            this.highlighting.textContent = code + (code.endsWith('\n') ? ' ' : '');
            
            if (typeof Prism !== 'undefined') {
                Prism.highlightElement(this.highlighting);
            }
        } catch (error) {
            console.error('Highlight error:', error);
        }
    },
    
    syncScroll() {
        try {
            const ed = document.getElementById('editing-area');
            const hi = document.getElementById('highlighting-area');
            if (ed && hi) {
                hi.scrollTop = ed.scrollTop;
                hi.scrollLeft = ed.scrollLeft;
            }
        } catch (error) {
            ErrorHandler.handle(error, 'editor-scroll');
        }
    },
    
    changeLang() {
        try {
            const f = app.getActiveFile();
            if (f) {
                f.lang = this.langSelect.value;
                this.highlight();
                fileManager.renderTabs();
                STORAGE.save(STORAGE.KEYS.FILES, app.files);
                preview.render();
            }
        } catch (error) {
            ErrorHandler.handle(error, 'editor-change-lang');
        }
    },
    
    setContent(code, lang) {
        try {
            this.textarea.value = code || '';
            this.langSelect.value = lang || 'html';
            this.highlight();
        } catch (error) {
            ErrorHandler.handle(error, 'editor-set-content');
        }
    },
    
    setFontSize(size) {
        try {
            this.textarea.style.fontSize = size + 'px';
            this.highlightingArea.style.fontSize = size + 'px';
            
            app.settings.fontSize = size;
            STORAGE.save(STORAGE.KEYS.SETTINGS, app.settings);
        } catch (error) {
            ErrorHandler.handle(error, 'editor-font-size');
        }
    },
    
    getCode() {
        return this.textarea ? this.textarea.value : '';
    }
};
