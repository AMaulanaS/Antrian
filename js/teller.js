const sel = $("#loket");
let state = null;
sel.innerHTML = L.map(l => `<option value="${l.id}">Loket ${l.id} – ${l.nama}</option>`).join("");
sel.value = localStorage.getItem("ptsp_loket") || 1;
$("#pin").value = sessionStorage.getItem("ptsp_pin") || "";
sel.onchange = () => { localStorage.setItem("ptsp_loket", sel.value); render(); };

function render(s) {
  state = s || state; if (!state) return;
  const l = L.find(x => x.id == sel.value), x = state.lokets[l.id], w = x.last - x.cur;
  $("#curNum").textContent = fmt(x.prefix, x.cur);
  $("#waitNum").textContent = w;
  $("#btnNext").disabled = w <= 0;
  $("#btnNext").classList.toggle("opacity-40", w <= 0);
  $("#summary").innerHTML = L.map(k => {
    const y = state.lokets[k.id];
    return `<tr class="${k.id == l.id ? "bg-emerald-50 font-bold" : ""}"><td class="py-1.5 px-2">Loket ${k.id}</td><td class="px-2">${k.nama}</td><td class="px-2 text-center">${fmt(y.prefix, y.cur)}</td><td class="px-2 text-center">${y.last - y.cur}</td></tr>`;
  }).join("");
}
async function act(a) {
  const pin = $("#pin").value; sessionStorage.setItem("ptsp_pin", pin);
  if (a === "reset" && !confirm("Reset SEMUA antrian di semua loket menjadi 0?")) return;
  try {
    const r = await API.call(a, { loket: sel.value, pin });
    if (r.error) toast(r.error); else { render(r); if (a === "panggil") toast("Memanggil nomor berikutnya"); }
  } catch (e) { toast("Gagal terhubung ke server"); }
}
async function refresh() { try { render(await API.call("state")); } catch (e) {} }
startClock(); refresh(); setInterval(refresh, CONFIG.POLL_MS);
