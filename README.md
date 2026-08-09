# FT UGM Executive Data Analytics — Prototype v0.2

Prototype React + Vite untuk **One Gate Data Analytics – Fakultas Teknik UGM**.

## Fitur yang sudah ditambahkan

### Executive Overview
- Sidebar kiri collapsible pada desktop.
- Sidebar mobile drawer.
- Logo UGM dari `/public/logo_ugm.png`.
- Favicon dari `/public/logo_ugm_emas.png`.
- Foto Dekan dari `/public/foto_prof_trias.png`.
- Nama profil: Prof. Ir. Trias Aditya K.M., S.T., M.Sc., Ph.D., IPU., ASEAN Eng.
- Empat strategic domains dalam layout 2 × 2.
- Bar chart SDGs interaktif.
- Indikator GESI/Inklusivitas interaktif.
- Responsive layout.

### Penelitian & Riset
- KPI research portfolio.
- Filter status: Aktif / Selesai / Direncanakan.
- Filter Departemen.
- Filter KBK.
- Search katalog.
- Klik riset untuk membuka detail modal.
- List Departemen dan KBK; satu Departemen dapat mempunyai banyak KBK.
- Collaboration Matrix antar-KBK.
- Contoh strategic intelligence untuk riset Kelistrikan/Energy.
- Top 5 publikasi.
- Top 5% scientists.
- Dummy dataset yang mudah diganti.

## Menjalankan

```bash
npm install
npm run dev
```

## Asset resmi

Letakkan file berikut di folder `public/`:

```text
public/
├── logo_ugm.png
├── logo_ugm_emas.png
└── foto_prof_trias.png
```

Kode memiliki fallback jika gambar belum tersedia.

## Catatan

Semua data pada prototype bersifat dummy. Struktur data sengaja dibuat agar nanti dapat diganti dengan API/database tanpa mengubah pola UI secara besar-besaran.
