# Dinul Iman — Portfolio

Portofolio responsif dengan React, TypeScript, Vite, dan Spline 3D. Tema putih–biru dengan tipografi navy, permukaan ringan, dan dekorasi minimal. Konten berfokus pada pengalaman backend dan payroll/HRIS Dinul Iman.

## Menjalankan

Gunakan Node.js 22.12+ atau 20.19+.

```sh
npm install
npm run dev
```

Buka URL lokal yang ditampilkan Vite, biasanya `http://localhost:5173`.

```sh
npm run build
npm run preview
```

Hasil produksi berada di `dist/` dan bisa dihosting sebagai situs statis.

## Personalisasi

- **Profil, pengalaman, dan keahlian:** `src/data.ts`. Narasi halaman di `src/App.tsx`.
- **Warna, tipografi, dan tata letak:** `src/styles.css`. Token tema utama berada di `:root`: `--bg`, `--text`, `--muted`, `--line`, dan `--accent`.
- **Laboratorium 3D:** `src/Scene.tsx`, `src/scene.css`, dan `src/scene-config.ts` untuk mode, warna, serta narasi hotspot.
- **Kontak dan scene 3D:** salin `.env.example` menjadi `.env.local`, lalu isi variabel yang diperlukan. Restart server setelah mengubah konfigurasi.

```dotenv
VITE_CONTACT_EMAIL=alamat-email-publik-anda
VITE_GITHUB_URL=https://github.com/dinulimann
VITE_LINKEDIN_URL=https://www.linkedin.com/in/username-anda/
VITE_SPLINE_SCENE_URL=https://prod.spline.design/id-scene-anda/scene.splinecode
```

Variabel `VITE_*` bersifat publik. Jangan isi dengan password atau API key. URL sosial harus berupa URL `https://` lengkap.

### Spline

Scene bawaan adalah **demo robot interaktif eksternal**, bukan karya Dinul. Sumber URL demo: [contoh Spline pada Motion Primitives](https://github.com/itsjwill/motion-primitives-website). Sesuaikan dengan scene milik sendiri sebelum menggunakan visual tersebut sebagai identitas final.

Untuk mengganti, buka scene milikmu di Spline → Export → Code → React, kemudian isi `VITE_SPLINE_SCENE_URL` dengan URL `.splinecode`. Integrasi mengikuti [dokumentasi resmi React Spline](https://github.com/splinetool/react-spline).

Scene dimuat lewat modul terpisah. Animasi bisa dijeda dan berhenti ketika berada di luar layar atau tab tidak aktif. Preferensi `prefers-reduced-motion` menonaktifkan pemuatan awal 3D. Tampilan CSS tetap tersedia jika jaringan/WebGL bermasalah; tersedia tombol untuk mencoba lagi. Model eksternal dan aset runtime tertentu memerlukan internet.

#### The Builder’s Lab

Area hero memadukan robot Spline dengan tampilan putih–biru yang dibangun di React/CSS:

- Tiga mode **Core, Data, AI** mengubah nuansa biru, narasi, dan sudut robot.
- Dua orbit tipis dalam perspektif 3D, platform halus, serta hotspot dengan parallax mengikuti kursor. Terminal, partikel, dan indikator dekoratif dihilangkan agar tampilannya lebih tenang.
- Hotspot bisa diklik atau diakses dengan keyboard untuk menjelajahi keahlian.
- Zoom **75–125%** menggunakan `Application.setZoom()`. Rotasi 360° mengubah `rotation.y` pada grup `Bot` di scene Spline, bukan hanya memutar elemen HTML.
- Efek scan visual, reset, kontrol jeda, serta layar penuh melalui Fullscreen API pada browser yang mendukung.
- Satu tombol jeda menghentikan robot, rotasi tambahan, dan animasi dekoratif. Animasi juga berhenti ketika area 3D tidak terlihat atau tab browser tidak aktif.

Model robot `.splinecode` sumber tetap scene demo eksternal. Orbit, panel, dan efek hologram merupakan komposisi frontend tambahan; tidak mengubah berkas sumber di editor Spline. Scene kustom tetap dapat dimuat, tetapi kontrol rotasi hanya aktif bila scene memiliki grup bernama `Bot`.

### Kontak

GitHub sudah mengarah ke [dinulimann](https://github.com/dinulimann) dan tampil di bagian kontak. URL dapat diganti melalui `VITE_GITHUB_URL`. Email dan LinkedIn belum diisi; tautannya hanya muncul setelah dikonfigurasi.

- Dengan email: formulir membuka aplikasi email dengan draft pesan. Pengguna mengirimkannya dari aplikasi email.
- Tanpa email: formulir mengunduh brief `.txt` dan menyatakan dengan jelas bahwa **tidak ada pesan yang dikirim**.
- Tidak ada backend formulir, penyimpanan pesan, atau pengiriman email otomatis.

### Konten profesional

Payroll PELNI ditampilkan sebagai kontribusi profesional di PT Solusi Integrasi Utama. Database/reporting merupakan area pengalaman; AI tooling merupakan eksplorasi. Tampilan diagram hanya ilustrasi konseptual tanpa data internal. Tidak ada klaim metrik, tanggal kerja, atau proyek tambahan yang dibuat-buat.

## Pengujian

```sh
npx playwright install chromium
npm run test:e2e
```

Pengujian mencakup modal detail dan pengembalian fokus, navigasi keyboard kategori keahlian, unduhan brief, menu mobile, overflow horizontal, fallback saat scene gagal, pemuatan Spline, mode lab, zoom, rotasi, scan, reset, fullscreen, serta reduced motion. Pengujian scene langsung memerlukan koneksi ke `prod.spline.design` dan dukungan WebGL. Screenshot disimpan di `test-results/`.

Jika memakai Chromium yang sudah tersedia di lokasi lain, isi `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` dengan path executable-nya.
