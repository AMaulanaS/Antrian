let lastSeq = null, queue = [], busy = false, soundOn = false, ctx;

function buildCards() {
  $("#cards").innerHTML = L.map(l => `
    <div id="card-${l.id}" class="teller-card bg-white rounded-2xl shadow-md border-4 ${l.border} overflow-hidden flex flex-col">
      <div class="${l.bg} text-white font-extrabold text-center py-2 text-sm sm:text-base tracking-wider uppercase">LOKET ${l.id}</div>
      <div class="flex-grow flex items-center justify-center py-6 sm:py-8 bg-white">
        <span id="num-${l.id}" class="text-6xl sm:text-7xl font-extrabold text-slate-900 tracking-tight">-</span>
      </div>
      <div class="bg-slate-50 border-t border-slate-100 p-2 text-center text-xs text-slate-500 font-semibold">
        ${l.nama} <span id="wait-${l.id}" class="text-slate-400 font-normal"></span>
      </div>
    </div>`).join("");
}

function chime(cb) {
  if (!soundOn) return cb();
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  [[659.25, 0, .8], [523.25, .4, 1.2]].forEach(([f, t, d]) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), n = ctx.currentTime + t;
    o.frequency.value = f; g.gain.setValueAtTime(.3, n); g.gain.exponentialRampToValueAtTime(.001, n + d);
    o.connect(g); g.connect(ctx.destination); o.start(n); o.stop(n + d);
  });
  setTimeout(cb, 1400);
}
function announce(id, x) {
  queue.push({ id, text: `Nomor antrian ${x.prefix} ${x.cur}, silahkan menuju ke Loket ${id}` });
  if (!busy) nextCall();
}
function nextCall() {
  const a = queue.shift(); if (!a) { busy = false; return; }
  busy = true;
  const c = $("#card-" + a.id); c.classList.add("calling"); setTimeout(() => c.classList.remove("calling"), 5000);
  chime(() => {
    if (!soundOn || !("speechSynthesis" in window)) return setTimeout(nextCall, 1500);
    const u = new SpeechSynthesisUtterance(a.text);
    u.lang = "id-ID"; u.rate = .85;
    const v = speechSynthesis.getVoices().find(v => /^id/i.test(v.lang)); if (v) u.voice = v;
    u.onend = u.onerror = nextCall; speechSynthesis.speak(u);
  });
}
function toggleSound() {
  soundOn = !soundOn;
  const b = $("#soundBtn");
  b.innerHTML = soundOn ? '<i class="fa-solid fa-volume-high"></i><span>Suara Aktif</span>' : '<i class="fa-solid fa-volume-xmark"></i><span>Aktifkan Suara</span>';
  b.classList.toggle("animate-pulse", !soundOn);
  if (soundOn) { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); ctx.resume(); }
}
function render(s) {
  L.forEach(l => {
    const x = s.lokets[l.id]; if (!x) return;
    $("#num-" + l.id).textContent = fmt(x.prefix, x.cur);
    $("#wait-" + l.id).textContent = "• Menunggu " + (x.last - x.cur);
  });
  if (lastSeq === null) lastSeq = s.seq;
  else if (s.seq > lastSeq) { lastSeq = s.seq; if (s.calling) announce(s.calling, s.lokets[s.calling]); }
}
async function refresh() {
  try { render(await API.call("state")); $("#conn").className = "w-2 h-2 rounded-full bg-emerald-400"; }
  catch (e) { $("#conn").className = "w-2 h-2 rounded-full bg-red-500"; }
}
function toggleVideoMute() {
  const v = $("#queueVideo"); v.muted = !v.muted;
  $("#muteBtn").innerHTML = `<i class="fa-solid fa-volume-${v.muted ? "xmark" : "high text-emerald-400"} text-base"></i>`;
}
function changeVideoSource(e) {
  const f = e.target.files[0]; if (!f) return;
  const v = $("#queueVideo"); v.src = URL.createObjectURL(f); v.play();
}
window.onload = () => {
  buildCards(); startClock(); refresh(); setInterval(refresh, CONFIG.POLL_MS);
  if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
};
