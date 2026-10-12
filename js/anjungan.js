let busy = false, closeTimer;

function buildButtons() {
  $("#services").innerHTML = L.map(l => `
    <button data-id="${l.id}" class="kiosk-btn ${l.bg} text-white rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center gap-2 border-4 border-white">
      <span class="text-xs font-bold uppercase tracking-widest opacity-90">Loket ${l.id}</span>
      <span class="text-3xl md:text-4xl font-extrabold leading-tight text-center">${l.nama}</span>
      <span class="text-sm bg-black/20 rounded-full px-3 py-1 font-semibold">Menunggu: <b id="w-${l.id}">0</b></span>
    </button>`).join("");
  $("#services").querySelectorAll("button").forEach(b => b.onclick = () => ambil(+b.dataset.id));
}
async function refresh() {
  try {
    const s = await API.call("state");
    L.forEach(l => { const x = s.lokets[l.id]; if (x) $("#w-" + l.id).textContent = x.last - x.cur; });
  } catch (e) {}
}
async function ambil(id) {
  if (busy) return; busy = true;
  try {
    const r = await API.call("ambil", { loket: id });
    if (r.error || !r.ticket) throw new Error(r.error || "gagal");
    const l = L.find(x => x.id === id), x = r.lokets[id], n = r.ticket.n;
    $("#tkNum").textContent = fmt(x.prefix, n);
    $("#tkLoket").textContent = `Loket ${id} – ${l.nama}`;
    $("#tkWaktu").textContent = new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
    $("#tkDepan").textContent = Math.max(0, n - x.cur - 1);
    $("#ticket").classList.remove("hidden");
    clearTimeout(closeTimer); closeTimer = setTimeout(closeTicket, 12000);
    if (CONFIG.AUTO_PRINT) setTimeout(() => window.print(), 300);
    refresh();
  } catch (e) { toast("Gagal mengambil nomor, coba lagi"); }
  busy = false;
}
function closeTicket() { $("#ticket").classList.add("hidden"); }
window.onload = () => { buildButtons(); startClock(); refresh(); setInterval(refresh, CONFIG.POLL_MS); };
