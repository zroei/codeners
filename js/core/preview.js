const preview = {
    frame: document.getElementById('preview-frame'),
    lastRender: 0,
    
    render() {
        try {
            const f = app.getActiveFile();
            if (!f || !this.frame) return;
            
            // Throttle rendering (max every 300ms)
            const now = Date.now();
            if (now - this.lastRender < 300) {
                return;
            }
            this.lastRender = now;
            
            let content = this.generatePreviewContent(f);
            
            // Use srcdoc for better security and performance
            this.frame.srcdoc = content;
            
        } catch (error) {
            ErrorHandler.handle(error, 'preview-render');
            this.showError(error.message);
        }
    },
    
    generatePreviewContent(file) {
        const baseStyle = `
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #ffffff;
                    color: #24292e;
                }
                .preview-header {
                    border-bottom: 1px solid #e1e4e8;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                    color: #586069;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .error-message {
                    color: #cb2431;
                    background: #ffeef0;
                    border: 1px solid #f97583;
                    border-radius: 6px;
                    padding: 16px;
                    margin: 20px;
                    font-family: monospace;
                }
            </style>
        `;
        
        try {
            if (file.lang === 'html') {
                return file.code || '<body style="padding:20px;">✨ File HTML kosong</body>';
                
            } else if (file.lang === 'css') {
                return `<!DOCTYPE html>
<html>
<head>
    <title>CSS Preview</title>
    ${baseStyle}
    <style>${file.code || ''}</style>
</head>
<body>
    <div class="preview-header">🎨 CSS Preview Mode</div>
    <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2ea043;">Halo Dunia!</h1>
        <p>Ini adalah paragraf dengan <a href="#">tautan</a> dan <strong>teks tebal</strong>.</p>
        <button style="padding: 8px 16px; background: #2ea043; color: white; border: none; border-radius: 4px;">Tombol</button>
        <div style="margin-top: 20px; padding: 20px; background: #f6f8fa; border-radius: 6px;">
            <p>Elemen dengan background abu-abu untuk test styling CSS Anda.</p>
        </div>
    </div>
</body>
</html>`;
                
            } else if (file.lang === 'javascript') {
                return `<!DOCTYPE html>
<html>
<head>
    <title>JavaScript Preview</title>
    ${baseStyle}
</head>
<body>
    <div class="preview-header">🚀 JavaScript Preview Mode</div>
    <div style="max-width: 800px; margin: 0 auto;">
        <div id="output" style="background: #f6f8fa; padding: 16px; border-radius: 6px; border: 1px solid #e1e4e8; min-height: 200px; font-family: monospace; white-space: pre-wrap;"></div>
    </div>
    
    <script>
        try {
            // Capture console.log
            const output = document.getElementById('output');
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.log = function(...args) {
                originalLog.apply(console, args);
                if (output) {
                    const line = document.createElement('div');
                    line.style.color = '#2ea043';
                    line.innerHTML = '📋 ' + args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ');
                    output.appendChild(line);
                }
            };
            
            console.error = function(...args) {
                originalError.apply(console, args);
                if (output) {
                    const line = document.createElement('div');
                    line.style.color = '#cb2431';
                    line.innerHTML = '❌ ' + args.join(' ');
                    output.appendChild(line);
                }
            };
            
            console.warn = function(...args) {
                originalWarn.apply(console, args);
                if (output) {
                    const line = document.createElement('div');
                    line.style.color = '#d29922';
                    line.innerHTML = '⚠️ ' + args.join(' ');
                    output.appendChild(line);
                }
            };
            
            // Execute user code
            ${file.code || '// No code to execute'}
            
        } catch(e) {
            document.getElementById('output').innerHTML += '<div style="color:#cb2431;">❌ Error: ' + e.message + '</div>';
        }
    <\/script>
</body>
</html>`;
                
            } else if (file.lang === 'json') {
                try {
                    const jsonData = file.code ? JSON.parse(file.code) : {};
                    const formatted = JSON.stringify(jsonData, null, 2);
                    return `<!DOCTYPE html>
<html>
<head>
    <title>JSON Preview</title>
    ${baseStyle}
    <style>
        pre { 
            background: #f6f8fa; 
            padding: 16px; 
            border-radius: 6px; 
            border: 1px solid #e1e4e8;
            overflow: auto;
            font-family: 'SF Mono', Monaco, 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
        }
        .json-key { color: #d73a49; }
        .json-string { color: #032f62; }
        .json-number { color: #005cc5; }
        .json-boolean { color: #005cc5; }
    </style>
</head>
<body>
    <div class="preview-header">📋 JSON Preview</div>
    <pre>${this.syntaxHighlightJSON(formatted)}</pre>
</body>
</html>`;
                } catch(e) {
                    return `<!DOCTYPE html>
<html>
<head><title>JSON Error</title>${baseStyle}</head>
<body>
    <div class="error-message">
        <strong>❌ Invalid JSON:</strong> ${e.message}
    </div>
    <pre style="background:#f6f8fa; padding:16px; border-radius:6px;">${file.code || ''}</pre>
</body>
</html>`;
                }
                
            } else if (file.lang === 'python') {
                return `<!DOCTYPE html>
<html>
<head>
    <title>Python Preview</title>
    ${baseStyle}
</head>
<body>
    <div class="preview-header">🐍 Python Preview Mode</div>
    <div style="background: #f6f8fa; padding: 20px; border-radius: 6px;">
        <p><strong>File:</strong> ${file.name}.py</p>
        <p><strong>Baris kode:</strong> ${(file.code || '').split('\n').length}</p>
        <p><strong>Status:</strong> <span style="color: #2ea043;">✓ Siap dieksekusi</span></p>
        <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 15px 0;">
        <p>📝 Kode Python Anda:</p>
        <pre style="background: #24292e; color: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto;">${file.code || '# Tidak ada kode'}</pre>
        <p><em>Catatan: Preview Python hanya menampilkan kode, tidak mengeksekusi karena keterbatasan browser.</em></p>
    </div>
</body>
</html>`;
            }
            
            return `<body style="padding:20px;">Preview tidak tersedia</body>`;
            
        } catch (error) {
            ErrorHandler.handle(error, 'preview-generate');
            return this.getErrorContent(error.message);
        }
    },
    
    syntaxHighlightJSON(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
            function(match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-boolean';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            }
        );
    },
    
    showError(message) {
        if (this.frame) {
            this.frame.srcdoc = this.getErrorContent(message);
        }
    },
    
    getErrorContent(message) {
        return `<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: monospace; 
            padding: 20px; 
            background: #0d1117; 
            color: #f85149;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .error-box {
            background: #161b22;
            border: 1px solid #f85149;
            border-radius: 8px;
            padding: 24px;
            max-width: 500px;
            text-align: center;
        }
        .error-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        .error-message {
            color: #f85149;
            font-size: 14px;
            margin-top: 8px;
            word-break: break-word;
        }
    </style>
</head>
<body>
    <div class="error-box">
        <div class="error-icon">⚠️</div>
        <h3 style="color: #f85149; margin:0;">Preview Error</h3>
        <div class="error-message">${message || 'Terjadi kesalahan saat merender preview'}</div>
    </div>
</body>
</html>`;
    }
};
