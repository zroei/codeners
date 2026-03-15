const fileManager = {
    glider: document.getElementById('glider'),
    fileInput: document.getElementById('file-input'),
    fileLabel: document.getElementById('file-label'),
    
    init() {
        // Handle drag and drop
        this.initDragAndDrop();
    },
    
    initDragAndDrop() {
        const workspace = document.querySelector('.workspace');
        
        if (!workspace) return;
        
        workspace.addEventListener('dragover', (e) => {
            e.preventDefault();
            workspace.style.opacity = '0.7';
        });
        
        workspace.addEventListener('dragleave', () => {
            workspace.style.opacity = '1';
        });
        
        workspace.addEventListener('drop', (e) => {
            e.preventDefault();
            workspace.style.opacity = '1';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleDrop(files[0]);
            }
        });
    },
    
    handleDrop(file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const ext = file.name.split('.').pop().toLowerCase();
            const lang = this.getLangFromExt(ext);
            const name = file.name.replace(`.${ext}`, '');
            
            this.addNewFile(name, lang, ev.target.result);
            uiManager.showToast(`File ${file.name} berhasil di-drop`, 'success');
        };
        reader.readAsText(file);
    },
    
    getLangFromExt(ext) {
        const map = {
            'html': 'html',
            'htm': 'html',
            'css': 'css',
            'js': 'javascript',
            'jsx': 'javascript',
            'py': 'python',
            'json': 'json',
            'txt': 'text'
        };
        return map[ext] || 'text';
    },
    
    renderTabs() {
        try {
            if (!this.glider) return;
            
            this.glider.innerHTML = '';
            
            app.files.forEach(f => {
                const tab = document.createElement('div');
                tab.className = `tab ${f.id === app.activeId ? 'active' : ''}`;
                tab.setAttribute('data-id', f.id);
                tab.onclick = () => app.openFile(f.id);
                
                const icons = {
                    html: 'ri-html5-fill',
                    css: 'ri-css3-fill',
                    javascript: 'ri-javascript-fill',
                    python: 'ri-terminal-box-fill',
                    json: 'ri-file-json-fill',
                    text: 'ri-file-text-line'
                };
                
                tab.innerHTML = `
                    <i class="${icons[f.lang] || 'ri-file-code-line'}"></i>
                    <span>${f.name}</span>
                    <i class="ri-close-line" onclick="fileManager.closeFile('${f.id}', event)" title="Close file"></i>
                `;
                
                this.glider.appendChild(tab);
            });
            
            // Scroll active tab into view
            const activeTab = this.glider.querySelector('.tab.active');
            if (activeTab) {
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
        } catch (error) {
            ErrorHandler.handle(error, 'filemanager-render-tabs');
        }
    },
    
    addNewFile(name = null, lang = 'html', code = '') {
        try {
            if (app.files.length >= 15) {
                uiManager.showToast('Maksimal 15 file', 'warning');
                return;
            }
            
            if (!name) {
                const baseName = lang === 'json' ? 'data' : 'file';
                const existing = app.files.filter(f => f.name.startsWith(baseName)).length;
                name = `${baseName}${existing + 1}`;
            }
            
            const id = 'f' + Date.now() + Math.random().toString(36).substr(2, 5);
            
            // Template code based on language
            if (!code) {
                code = this.getTemplate(lang);
            }
            
            app.files.push({ id, name, lang, code });
            
            this.renderTabs();
            app.openFile(id);
            STORAGE.save(STORAGE.KEYS.FILES, app.files);
            
            uiManager.showToast(`File ${name}.${lang} berhasil dibuat`, 'success');
            
        } catch (error) {
            ErrorHandler.handle(error, 'filemanager-add-file');
        }
    },
    
    getTemplate(lang) {
        const templates = {
            html: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Baru</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
    </style>
</head>
<body>
    <h1>Halo Dunia!</h1>
    <p>Selamat datang di halaman baru.</p>
</body>
</html>`,
            
            css: `/* CSS Styles */
body {
    font-family: system-ui, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
    color: #2ea043;
    text-align: center;
}`,
            
            javascript: `// JavaScript Code
console.log('Hello from Codeners!');

// Function example
function greet(name) {
    return \`Hello, \${name}!\`;
}

// Test the function
console.log(greet('World'));

// Array example
const fruits = ['apple', 'banana', 'orange'];
fruits.forEach(fruit => {
    console.log('Fruit:', fruit);
});`,
            
            python: `# Python Code
print("Hello from Codeners!")

# Function example
def greet(name):
    return f"Hello, {name}!"

# Test the function
print(greet("World"))

# List example
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(f"Fruit: {fruit}")`,
            
            json: `{
    "name": "Codeners",
    "version": "1.0.0",
    "description": "Multi-Language Code Editor",
    "features": [
        "HTML",
        "CSS",
        "JavaScript",
        "Python",
        "JSON"
    ],
    "pwa": true,
    "offline": true
}`
        };
        
        return templates[lang] || '';
    },
    
    closeFile(id, e) {
        e.stopPropagation();
        
        try {
            if (app.files.length <= 1) {
                uiManager.showToast('Tidak bisa menghapus file terakhir', 'warning');
                return;
            }
            
            const file = app.files.find(f => f.id === id);
            
            uiManager.showConfirm(
                'Hapus File', 
                `Yakin ingin menghapus file "${file.name}.${file.lang}"?`,
                () => {
                    app.files = app.files.filter(f => f.id !== id);
                    
                    if (app.activeId === id) {
                        app.openFile(app.files[0].id);
                    }
                    
                    this.renderTabs();
                    STORAGE.save(STORAGE.KEYS.FILES, app.files);
                    uiManager.showToast(`File ${file.name} berhasil dihapus`, 'success');
                }
            );
            
        } catch (error) {
            ErrorHandler.handle(error, 'filemanager-close-file');
        }
    },
    
    triggerImport() {
        this.fileInput.click();
    },
    
    handleImport(e) {
        try {
            const file = e.target.files[0];
            if (!file) return;
            
            // Check file size (max 1MB)
            if (file.size > 1024 * 1024) {
                uiManager.showToast('File terlalu besar (maks 1MB)', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                const ext = file.name.split('.').pop().toLowerCase();
                const lang = this.getLangFromExt(ext);
                const name = file.name.replace(`.${ext}`, '');
                
                this.addNewFile(name, lang, ev.target.result);
            };
            reader.onerror = () => {
                uiManager.showToast('Gagal membaca file', 'error');
            };
            reader.readAsText(file);
            
            // Reset input
            e.target.value = '';
            
        } catch (error) {
            ErrorHandler.handle(error, 'filemanager-import');
        }
    },
    
    exportFile() {
        try {
            const f = app.getActiveFile();
            if (!f) return;
            
            const ext = f.lang === 'javascript' ? 'js' : f.lang;
            const content = f.code || '';
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${f.name}.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            uiManager.showToast(`File ${f.name}.${ext} berhasil diekspor`, 'success');
            
        } catch (error) {
            ErrorHandler.handle(error, 'filemanager-export');
        }
    },
    
    renameFile(id, newName) {
        try {
            const file = app.files.find(f => f.id === id);
            if (file) {
                const oldName = file.name;
                file.name = newName;
                this.renderTabs();
                if (id === app.activeId) {
                    uiManager.updateFileLabel(file.name, file.lang);
                }
                STORAGE.save(STORAGE.KEYS.FILES, app.files);
                uiManager.showToast(`File ${oldName} → ${newName}`, 'success');
            }
        } catch (error) {
            ErrorHandler.handle(error, 'filemanager-rename');
        }
    }
};

// Initialize file manager
document.addEventListener('DOMContentLoaded', () => {
    fileManager.init();
});
