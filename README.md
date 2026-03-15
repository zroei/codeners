🚀 Codeners - Multi-Language Code Editor & Sandbox PWA
Codeners adalah editor kode berbasis web modern yang dirancang untuk kecepatan dan aksesibilitas. Mendukung berbagai bahasa pemrograman dan dapat diinstal sebagai Progressive Web App (PWA) untuk penggunaan secara offline.
✨ Fitur Unggulan
 * 📝 Dukungan Multi-Bahasa – Mendukung HTML, CSS, JavaScript, Python, dan JSON.
 * 👁️ Live Preview – Sistem rendering instan untuk melihat hasil kode secara real-time.
 * 📱 PWA Ready – Instal di desktop atau perangkat seluler dan gunakan tanpa koneksi internet.
 * 🎨 Syntax Highlighting – Menggunakan Prism.js untuk tampilan kode yang tajam dan terbaca.
 * 💾 Auto-save – Kode Anda aman dan tersimpan otomatis secara lokal via localStorage.
 * 📂 Manajemen File – Mendukung pembukaan dan pengeditan banyak file secara simultan.
 * ⬆️ Import/Export – Kemudahan untuk mengunggah atau mengunduh proyek Anda.
 * 🎯 Desain Responsif – UI yang dioptimalkan untuk pengalaman maksimal di layar HP maupun Desktop.
🚀 Demo & Akses Cepat
| Akses | Link |
|---|---|
| Live Demo | https://codeners.nett.to |
| Dokumentasi |
📦 Instalasi
1. Melalui GitHub Pages
 * Fork repository ini.
 * Buka menu Settings > Pages.
 * Pilih branch main dan folder /root (atau /docs jika ada).
 * Klik Save, tunggu beberapa saat hingga situs Anda aktif.
2. Berjalan di Lokal
# Clone repository
git clone [https://github.com/zroei/codeners.git](https://github.com/zroei/codeners.git)

# Masuk ke direktori project
cd codeners

🏗️ Struktur Proyek
codeners/
├── index.html              # Entry point aplikasi
├── sw.js                   # Service Worker untuk dukungan Offline
├── manifest.json           # Konfigurasi PWA
├── styles/
│   └── main.css            # Desain & UI utama
├── js/
│   ├── app.js              # Inisialisasi logika utama
│   ├── core/               # Modul fungsional
│   │   ├── editor.js       # Konfigurasi editor
│   │   ├── preview.js      # Logika live preview
│   │   └── fileManager.js  # Sistem manajemen file
│   └── utils/              # Helper & Utilitas
│       └── storage.js      # Logika penyimpanan lokal
└── assets/                 # Brand assets & Ikon

⌨️ Shortcuts & Penggunaan
| Aksi | Cara |
|---|---|
| File Baru | Klik ikon + atau tekan Ctrl + N |
| Ganti Bahasa | Gunakan dropdown di header editor |
| Preview | Klik tombol SYNC untuk memuat ulang hasil |
| Indentation | Gunakan tombol Tab |
| Highlight | Ctrl + Space untuk memicu pembersihan sintaks |
🔧 Kustomisasi
Mengubah Tema UI
Anda dapat menyesuaikan warna tema melalui variabel CSS di styles/main.css:
:root {
    --bg-primary: #0d1117;  /* Warna latar belakang */
    --accent-green: #2ea043; /* Warna identitas utama */
    --text-main: #c9d1d9;    /* Warna teks */
}

📊 Statistik Performa (Lighthouse)
Kami memprioritaskan kecepatan. Berikut adalah rata-rata skor performa kami:
 * Performance: 🚀 95+
 * Accessibility: ♿ 100
 * Best Practices: ✨ 100
 * SEO: 🔍 100
 * PWA: ✅ Optimized
📝 Roadmap & To-Do
 * [ ] Dukungan render Markdown.
 * [ ] Integrasi langsung dengan GitHub Gist.
 * [ ] Fitur Theme Switcher (Dark/Light mode).
 * [ ] Split View (Vertikal/Horizontal).
 * [ ] Ekspor sebagai Single HTML File.
🤝 Kontribusi
Kontribusi selalu terbuka!
 * Fork Project.
 * Buat Fitur Branch (git checkout -b feature/FiturKeren).
 * Commit Perubahan (git commit -m 'Add some FiturKeren').
 * Push ke Branch (git push origin feature/FiturKeren).
 * Buka Pull Request.
📄 Lisensi
Didistribusikan di bawah lisensi MIT. Lihat LICENSE untuk informasi lebih lanjut.
📞 Hubungi Kami
 * Website: codeners.nett.to
 * GitHub: @zroei
Dibuat dengan ❤️ untuk para pengembang.
