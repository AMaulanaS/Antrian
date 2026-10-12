// ====== KONFIGURASI ======
window.CONFIG = {
  // Isi dengan URL Web App Google Apps Script (lihat README.md).
  // Dikosongkan = MODE DEMO (data disimpan di browser, cocok untuk uji coba satu komputer).
  API_URL: "https://script.google.com/macros/s/AKfycbxJ83-KSzGGp2l3V6NJ2IE_ygTcxXJLJ04T5R3m6ZaHwvptxNO5vvLzuJ7tl_tiMnHs-Q/exec",
  POLL_MS: 2000,        // interval refresh data (milidetik)
  AUTO_PRINT: false,    // true = langsung cetak tiket setelah ambil nomor (butuh Chrome --kiosk-printing)
  INSTANSI: "MTs Negeri 2 Brebes",
  LOKET: [
    { id: 1, prefix: "A", nama: "Layanan Akademik",            bg: "bg-sky-400",     border: "border-sky-400" },
    { id: 2, prefix: "B", nama: "Layanan Kesiswaan",           bg: "bg-emerald-500", border: "border-emerald-500" },
    { id: 3, prefix: "C", nama: "Layanan Kepegawaian",         bg: "bg-orange-500",  border: "border-orange-500" },
    { id: 4, prefix: "D", nama: "Layanan Persuratan dan Umum", bg: "bg-purple-500",  border: "border-purple-500" },
    { id: 5, prefix: "E", nama: "Kesiswaan & Bimbingan",       bg: "bg-slate-600",   border: "border-slate-600" },
    { id: 6, prefix: "F", nama: "Layanan Administrasi",        bg: "bg-red-500",     border: "border-red-500" },
  ],
};
