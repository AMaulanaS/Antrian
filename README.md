# Sistem Antrian PTSP – MTs Negeri 2 Brebes

## Halaman
| File | Dipakai di | Fungsi |
|---|---|---|
| `index.html` | TV / layar tunggu | Tampilan antrian (sama seperti aslinya) + suara panggilan |
| `teller.html` | Komputer tiap loket | Panggil selanjutnya, ulangi panggilan, reset |
| `anjungan.html` | Mesin anjungan (touchscreen) | Ambil nomor antrian + cetak tiket |

Struktur: `css/style.css`, `js/config.js` (pengaturan), `js/common.js` (API), `js/display.js`, `js/teller.js`, `js/anjungan.js`, `apps-script/Code.gs`.

## Coba dulu (Mode Demo)
Buka `anjungan.html`, `teller.html`, `index.html` di browser yang sama (tab berbeda). Selama `API_URL` di `js/config.js` kosong, data disimpan di browser sehingga ketiganya sudah saling terhubung. PIN teller tidak dicek di mode demo.

## Hubungkan ke Google Sheet (agar jalan antar-komputer)
1. Buat Google Sheet baru → menu **Extensions > Apps Script**.
2. Tempel isi `apps-script/Code.gs`, ganti `PIN`, simpan.
3. **Deploy > New deployment > Web app** → *Execute as: Me*, *Who has access: Anyone* → Deploy, izinkan akses.
4. Salin URL Web App ke `API_URL` di `js/config.js`.
5. Upload seluruh folder ke hosting (GitHub Pages / Netlify / hosting sekolah) atau jalankan lokal.

Sheet **Status** = kondisi tiap loket, sheet **Antrian** = riwayat nomor yang diambil + waktu diambil/dipanggil (bisa untuk laporan). Nomor otomatis kembali ke 0 setiap hari. Setelah mengubah kode Apps Script, buat *New deployment / Manage deployments* lagi agar perubahan aktif.

## Catatan
- Suara: klik tombol **Aktifkan Suara** sekali di layar TV (aturan browser).
- Cetak otomatis tiket: set `AUTO_PRINT: true` dan jalankan Chrome dengan `--kiosk-printing` (printer thermal 58 mm).
- Nama loket, awalan nomor (A–F), dan warna diatur di `js/config.js`; awalan juga ada di `Code.gs`.
- Video default masih contoh (Big Buck Bunny); ganti lewat tombol *Ganti Video* atau ubah `<source>` di `index.html`.
