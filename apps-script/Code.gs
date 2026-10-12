/**
 * BACKEND ANTRIAN PTSP - Google Apps Script
 * Pasang di Google Sheet: Extensions > Apps Script, tempel kode ini, lalu Deploy > Web app
 * (Execute as: Me, Who has access: Anyone). Salin URL Web App ke js/config.js (API_URL).
 */
const PIN = '1234';                                   // GANTI PIN teller
const LOKET = {1:'A', 2:'B', 3:'C', 4:'D', 5:'E', 6:'F'}; // nomor loket -> awalan nomor
const TZ = 'Asia/Jakarta';

const today_ = () => Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
const pad_ = n => ('00' + n).slice(-3);
function sheet_(name, header) {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(name);
  if (!s) { s = ss.insertSheet(name); s.appendRow(header); s.setFrozenRows(1); }
  return s;
}
function status_() {
  const s = sheet_('Status', ['Loket','Awalan','Terakhir Diambil','Sedang Dipanggil','Tanggal']);
  if (s.getLastRow() < 7) Object.keys(LOKET).forEach(k => s.appendRow([+k, LOKET[k], 0, 0, '']));
  s.getRange('E2:E7').setNumberFormat('@');
  return s;
}
function read_() {
  const s = status_(), t = today_(), p = PropertiesService.getScriptProperties();
  const rows = s.getRange(2, 1, 6, 5).getValues(), lokets = {};
  rows.forEach((r, i) => {
    if (String(r[4]) !== t) { r[2] = 0; r[3] = 0; s.getRange(i + 2, 3, 1, 3).setValues([[0, 0, t]]); } // reset otomatis tiap hari
    lokets[r[0]] = { prefix: r[1], last: r[2], cur: r[3] };
  });
  return { tgl: t, seq: +p.getProperty('seq') || 0, calling: +p.getProperty('calling') || 0, lokets };
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet(e) {
  const a = (e && e.parameter) || {}, id = +a.loket, lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (['panggil','ulang','reset'].indexOf(a.action) >= 0 && a.pin !== PIN) return out_({ error: 'PIN salah' });
    const s = status_(), p = PropertiesService.getScriptProperties();
    const log = sheet_('Antrian', ['Tanggal','Loket','Nomor','Waktu Ambil','Waktu Dipanggil']);
    log.getRange('A:A').setNumberFormat('@');
    let st = read_(), ticket;
    const x = st.lokets[id];
    if (a.action === 'ambil' && x) {
      x.last++; s.getRange(id + 1, 3).setValue(x.last);
      log.appendRow([st.tgl, id, x.prefix + pad_(x.last), new Date(), '']);
      ticket = { loket: id, n: x.last };
    } else if (a.action === 'panggil' && x && x.cur < x.last) {
      x.cur++; s.getRange(id + 1, 4).setValue(x.cur);
      p.setProperties({ seq: String(st.seq + 1), calling: String(id) });
      const no = x.prefix + pad_(x.cur), v = log.getDataRange().getValues();
      for (let i = v.length - 1; i > 0; i--) if (v[i][2] === no && String(v[i][0]) === st.tgl) { log.getRange(i + 1, 5).setValue(new Date()); break; }
    } else if (a.action === 'ulang' && x && x.cur > 0) {
      p.setProperties({ seq: String(st.seq + 1), calling: String(id) });
    } else if (a.action === 'reset') {
      s.getRange(2, 3, 6, 2).setValue(0);
      p.setProperties({ seq: String(st.seq + 1), calling: '0' });
    }
    st = read_(); st.ticket = ticket;
    return out_(st);
  } catch (err) {
    return out_({ error: String(err) });
  } finally { lock.releaseLock(); }
}
