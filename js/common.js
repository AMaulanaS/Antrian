const $ = s => document.querySelector(s);
const L = CONFIG.LOKET;
const fmt = (p, n) => (n > 0 ? p + String(n).padStart(3, "0") : "-");

function toast(msg) {
  const t = $("#toastNotification"); if (!t) return;
  $("#toastMessage").textContent = msg;
  t.classList.remove("opacity-0", "pointer-events-none");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.add("opacity-0", "pointer-events-none"), 3000);
}
function startClock() {
  const tick = () => {
    const n = new Date();
    $("#clockTime").textContent = n.toLocaleTimeString("id-ID", { hour12: false }).replace(/\./g, ":");
    $("#clockDate").textContent = n.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
  };
  tick(); setInterval(tick, 1000);
}
function toggleFullScreen() {
  const b = document.body;
  if (b.classList.contains("simulated-fullscreen")) { b.classList.remove("simulated-fullscreen"); return; }
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => b.classList.add("simulated-fullscreen"));
  } else document.exitFullscreen().catch(() => {});
}
document.addEventListener("keydown", e => { if (e.key === "Escape") document.body.classList.remove("simulated-fullscreen"); });

// ====== Mode DEMO (tanpa Google Sheet): meniru perilaku Apps Script via localStorage ======
const Demo = {
  K: "ptsp_demo",
  get() {
    let s; try { s = JSON.parse(localStorage.getItem(this.K)); } catch (e) {}
    const t = new Date().toLocaleDateString("sv");
    if (!s || s.tgl !== t) s = { tgl: t, seq: 0, calling: 0, lokets: {} };
    L.forEach(l => s.lokets[l.id] = s.lokets[l.id] || { prefix: l.prefix, last: 0, cur: 0 });
    return s;
  },
  call(a, p) {
    const s = this.get(), x = s.lokets[p.loket]; let ticket;
    if (a === "ambil") { x.last++; ticket = { loket: +p.loket, n: x.last }; }
    if (a === "panggil" && x.cur < x.last) { x.cur++; s.seq++; s.calling = +p.loket; }
    if (a === "ulang" && x.cur > 0) { s.seq++; s.calling = +p.loket; }
    if (a === "reset") { Object.values(s.lokets).forEach(v => v.last = v.cur = 0); s.calling = 0; s.seq++; }
    localStorage.setItem(this.K, JSON.stringify(s));
    return Promise.resolve({ ...s, ticket });
  },
};
// ====== API: Google Apps Script (atau Demo bila API_URL kosong) ======
const API = {
  call(action, params = {}) {
    if (!CONFIG.API_URL) return Demo.call(action, params);
    return fetch(CONFIG.API_URL + "?" + new URLSearchParams({ action, ...params })).then(r => r.json());
  },
};
