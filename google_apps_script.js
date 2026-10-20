/**
 * 🏨 AUTOMATICKÁ SPRÁVA ÚKLIDŮ & NOTIFIKACE (Airbnb & Booking.com -> Google Sheets, Calendar & Telegram)
 * 
 * Návod k použití:
 * 1. Otevřete vaši Google Tabulku správy úklidů.
 * 2. V horním menu zvolte: Rozšíření -> Apps Script.
 * 3. Nahraďte veškerý kód tímto novým kódem a uložte (Ctrl + S).
 * 4. Vyberte funkci: testTelegramNotifikace() a klikněte na "Spustit" pro ověření Telegramu.
 * 5. Nastavte si automatický Trigger (Spouštěč):
 *    - V levém menu klikněte na ikonu hodin (Spouštěče / Triggers).
 *    - Klikněte na "+ Přidat spouštěč".
 *    - Zvolte funkci: updateHarmonogramUklidu
 *    - Zdroj události: Časový spouštěč (Time-driven)
 *    - Typ: Denní časovač (např. mezi 7:00 a 8:00 ráno).
 */

// ==========================================
// 📱 NASTAVENÍ TELEGRAM NOTIFIKACÍ
// ==========================================
const TELEGRAM_CONFIG = {
  enabled: true,
  botToken: "8642002052:AAE9AJU3uv9o1R-BXiji45BXPowiMFx3sDo", // @spravce_uklidu_bot
  chatId: "712260133",                                        // Vaše Telegram Chat ID
  notifyTomorrow: true, // Posílat upozornění den předem (zítra je úklid)
  notifyToday: true     // Posílat upozornění v den úklidu (dnes je úklid)
};

// ==========================================
// 📅 NASTAVENÍ KALENDÁŘE & APARTMÁNŮ
// ==========================================
const CLEANING_CALENDAR_ID = "4996cb62ba3e278681c44a9ae531740a34e5904330981ac6644d8197bc4b2b02@group.calendar.google.com";

const CALENDARS = [
  { name: "Konšelská", source: "Airbnb", url: "https://www.airbnb.cz/calendar/ical/1728523339636013855.ics?t=31a8c02041084ffeba36c8cef6a7012a" },
  { name: "Ječná", source: "Airbnb", url: "https://www.airbnb.cz/calendar/ical/888522950732498714.ics?t=7d7724be44f2431ab7f37b8577c1cb11" },
  { name: "Konšelská", source: "Booking.com", url: "https://ical.booking.com/v1/export?t=89d4d309-b948-4761-85f8-9a00c2eb0829" },
  { name: "Ječná", source: "Booking.com", url: "https://ical.booking.com/v1/export?t=2695a350-6fb6-4237-ade8-1ce6cfd88bac" }
];

/**
 * 🧪 TESTOVACÍ FUNKCE PRO TELEGRAM
 * Spusťte tuto funkci v Apps Scriptu tlačítkem "Spustit" pro otestování notifikace.
 */
function testTelegramNotifikace() {
  const msg = "🤖 *TEST NOTIFIKACE (Reservix Úklidy)*\n\n" +
              "✅ Spojení s Telegram botem funguje bezchybně!\n" +
              "Odteď vám sem budou automaticky chodit zprávy o úklidech (den předem i v den úklidu).";
  const ok = odeslatTelegramZpravu(msg);
  if (ok) {
    Logger.log("✅ Testovací zpráva byla úspěšně odeslána na Telegram.");
  } else {
    Logger.log("❌ Chyba při odesílání testovací zprávy. Zkontrolujte token a chat ID.");
  }
}

/**
 * 🚀 JEDNÍM KLIKNUTÍM VYČISTÍ A NAHRAJE VŠECHNY ÚKLIDY NAČISTO
 */
function resetAObnovitVseNaCisto() {
  vymazatVsechnyUdalostiVKalendari();
  updateHarmonogramUklidu();
}

/**
 * 🔄 HLAVNÍ SYNCHRONIZACE (Plní Tabulku, Google Kalendář a posílá Telegram Notifikace)
 */
function updateHarmonogramUklidu() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getActiveSheet();
  
  let data = sheet.getDataRange().getValues();

  let headerRowIndex = -1;
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      if (String(data[r][c]).toLowerCase().includes("nemovitost")) {
        headerRowIndex = r;
        break;
      }
    }
    if (headerRowIndex !== -1) break;
  }

  if (headerRowIndex === -1) {
    const defaultHeaders = ["Nemovitost", "Datum úklidu (Odjezd)", "Stav Úklidu", "Zdroj rezervace", "Datum příjezdu", "Počet dnů", "ID události v kalendáři"];
    const headerRange = sheet.getRange(4, 1, 1, defaultHeaders.length);
    headerRange.setValues([defaultHeaders]);
    headerRange.setBackground("#8B0000");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    data = sheet.getDataRange().getValues();
    headerRowIndex = 3;
  }

  const headers = data[headerRowIndex];
  const colNemovitost = findColumn(headers, ["nemovitost", "apartmán"]);
  const colDatumUklidu = findColumn(headers, ["datum úklidu", "odjezd"]);
  const colStav = findColumn(headers, ["stav úklidu", "stav"]);
  const colZdroj = findColumn(headers, ["zdroj rezervace", "zdroj"]);
  const colDatumPrijezdu = findColumn(headers, ["datum příjezdu", "příjezd"]);
  const colPocetDnu = findColumn(headers, ["počet dnů", "počet nocí"]);
  const colUid = findColumn(headers, ["id události v kalendáři", "uid"]);

  const calendar = CalendarApp.getCalendarById(CLEANING_CALENDAR_ID);
  const existingKeys = new Set();
  
  for (let r = headerRowIndex + 1; r < data.length; r++) {
    const nem = colNemovitost !== -1 ? String(data[r][colNemovitost] || "").trim().toLowerCase() : "";
    const dat = colDatumUklidu !== -1 ? formatDateStandard(parseDateRobust(data[r][colDatumUklidu])) : "";
    if (nem && dat) {
      existingKeys.add(`${nem}_${dat}`);
    }
  }

  const newRows = [];
  const allParsedEvents = [];

  CALENDARS.forEach(cal => {
    try {
      const response = UrlFetchApp.fetch(cal.url, { muteHttpExceptions: true });
      if (response.getResponseCode() !== 200) return;

      const events = parseICalRobust(response.getContentText(), cal.source);

      events.forEach(ev => {
        allParsedEvents.push({
          apartmentName: cal.name,
          source: cal.source,
          ...ev
        });

        const key = `${cal.name.toLowerCase()}_${ev.strOdjezd}`;

        if (!existingKeys.has(key)) {
          existingKeys.add(key);

          if (calendar && ev.dateOdjezd) {
            vytvorUdalostVKalendari(calendar, cal.name, cal.source, ev.strPrijezd, ev.strOdjezd, ev.dateOdjezd, ev.pocetDnu);
          }

          const dnes = new Date();
          dnes.setHours(0,0,0,0);
          const isMinulost = ev.dateOdjezd < dnes;
          const výchozíStav = isMinulost ? "Uklizeno" : "K úklidu";

          const rowData = new Array(headers.length).fill("");
          if (colNemovitost !== -1) rowData[colNemovitost] = cal.name;
          if (colDatumUklidu !== -1) rowData[colDatumUklidu] = ev.strOdjezd;
          if (colStav !== -1) rowData[colStav] = výchozíStav;
          if (colZdroj !== -1) rowData[colZdroj] = cal.source;
          if (colDatumPrijezdu !== -1) rowData[colDatumPrijezdu] = ev.strPrijezd;
          if (colPocetDnu !== -1) rowData[colPocetDnu] = ev.pocetDnu;
          if (colUid !== -1) rowData[colUid] = ev.uid || `${cal.name}_${ev.strOdjezd}`;

          newRows.push(rowData);
        }
      });
    } catch (err) {
      Logger.log(`Chyba iCal: ${err}`);
    }
  });

  if (newRows.length > 0) {
    newRows.sort((a, b) => new Date(a[colDatumUklidu]) - new Date(b[colDatumUklidu]));
    const insertRowStart = Math.max(headerRowIndex + 2, sheet.getLastRow() + 1);
    sheet.getRange(insertRowStart, 1, newRows.length, newRows[0].length).setValues(newRows);
  }

  // ODESLÁNÍ TELEGRAM NOTIFIKACÍ (pro dnešní i zítřejší úklidy)
  if (TELEGRAM_CONFIG.enabled) {
    kontrolaAOdeslaniTelegramNotifikaci(allParsedEvents);
  }
}

/**
 * 📲 KONTROLA A ODESLÁNÍ TELEGRAM NOTIFIKACÍ (DNES & ZÍTRA)
 */
function kontrolaAOdeslaniTelegramNotifikaci(events) {
  if (!events || events.length === 0) return;

  const scriptProperties = PropertiesService.getScriptProperties();

  const dnes = new Date();
  dnes.setHours(0, 0, 0, 0);
  const strDnes = formatDateStandard(dnes);

  const zitra = new Date(dnes);
  zitra.setDate(zitra.getDate() + 1);
  const strZitra = formatDateStandard(zitra);

  const deduplicated = {};
  events.forEach(ev => {
    const key = `${ev.apartmentName.toLowerCase()}_${ev.strOdjezd}`;
    if (!deduplicated[key]) {
      deduplicated[key] = ev;
    }
  });

  Object.values(deduplicated).forEach(ev => {
    const apt = ev.apartmentName;
    const datumOdjezdu = ev.strOdjezd;
    const zdroj = ev.source || "Rezervace";
    const pocetNoci = ev.pocetDnu || 1;

    // 1. NOTIFIKACE: ZÍTRA JE ÚKLID
    if (TELEGRAM_CONFIG.notifyTomorrow && datumOdjezdu === strZitra) {
      const lockKey = `TG_TOMORROW_${apt.toLowerCase()}_${datumOdjezdu}`;
      if (!scriptProperties.getProperty(lockKey)) {
        const msgZitra = 
          `🔔 *UPOZORNĚNÍ: ZÍTRA JE ÚKLID!*\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          `🏠 *Apartmán:* ${apt}\n` +
          `📅 *Datum úklidu:* ${formatDateCzech(zitra)} (Zítra)\n` +
          `🛎️ *Odjezd hosta:* Check-out do 10:00–11:00\n` +
          `🌐 *Zdroj:* ${zdroj}\n` +
          `🛏️ *Pobyt:* ${pocetNoci} ${pocetNoci === 1 ? 'noc' : (pocetNoci < 5 ? 'noci' : 'nocí')}\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          `💡 Nezapomeňte připravit čisté ložní prádlo a ručníky.`;

        if (odeslatTelegramZpravu(msgZitra)) {
          scriptProperties.setProperty(lockKey, new Date().toISOString());
          Logger.log(`Telegram notifikace (ZÍTRA) odeslána: ${apt} na ${datumOdjezdu}`);
        }
      }
    }

    // 2. NOTIFIKACE: DNES JE ÚKLID
    if (TELEGRAM_CONFIG.notifyToday && datumOdjezdu === strDnes) {
      const lockKey = `TG_TODAY_${apt.toLowerCase()}_${datumOdjezdu}`;
      if (!scriptProperties.getProperty(lockKey)) {
        const msgDnes = 
          `🧹 *DNES PROBÍHÁ ÚKLID!*\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          `🏠 *Apartmán:* ${apt}\n` +
          `📅 *Datum:* ${formatDateCzech(dnes)} (Dnes)\n` +
          `⏰ *Čas:* cca od 10:00 – 14:00 (po Check-outu)\n` +
          `🌐 *Zdroj:* ${zdroj}\n` +
          `🛏️ *Předchozí pobyt:* ${pocetNoci} ${pocetNoci === 1 ? 'noc' : (pocetNoci < 5 ? 'noci' : 'nocí')}\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          `✅ Po provedení úklidu prosím nezapomeňte označit stav v tabulce.`;

        if (odeslatTelegramZpravu(msgDnes)) {
          scriptProperties.setProperty(lockKey, new Date().toISOString());
          Logger.log(`Telegram notifikace (DNES) odeslána: ${apt} na ${datumOdjezdu}`);
        }
      }
    }
  });
}

/**
 * 📡 ODESLÁNÍ ZPRÁVY PŘES TELEGRAM BOT API
 */
function odeslatTelegramZpravu(text) {
  if (!TELEGRAM_CONFIG.enabled || !TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) {
    Logger.log("Telegram není nakonfigurován nebo je vypnutý.");
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CONFIG.chatId,
    text: text,
    parse_mode: "Markdown"
  };

  try {
    const res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    return res.getResponseCode() === 200;
  } catch (err) {
    Logger.log(`Chyba při odesílání Telegram zprávy: ${err}`);
    return false;
  }
}

function vytvorUdalostVKalendari(calendar, nemovitost, zdroj, strPrijezd, strOdjezd, datumOdjezduDate, pocetDnu) {
  try {
    const title = `ÚKLID ${nemovitost.toUpperCase()}`;
    const description = `Nemovitost: ${nemovitost}\nZdroj: ${zdroj}\nDatum úklidu (Odjezd): ${strOdjezd}\nPříjezd hosta: ${strPrijezd}\nPočet nocí: ${pocetDnu}`;

    const eventsOnDay = calendar.getEventsForDay(datumOdjezduDate);
    const alreadyExists = eventsOnDay.some(e => e.getTitle().toUpperCase().includes(nemovitost.toUpperCase()));
    if (alreadyExists) return null;

    const eventDate = new Date(datumOdjezduDate.getFullYear(), datumOdjezduDate.getMonth(), datumOdjezduDate.getDate(), 0, 0, 0);

    return calendar.createAllDayEvent(title, eventDate, {
      description: description,
      location: nemovitost
    });
  } catch (e) {
    return null;
  }
}

function vymazatVsechnyUdalostiVKalendari() {
  const calendar = CalendarApp.getCalendarById(CLEANING_CALENDAR_ID);
  if (!calendar) return;

  const events = calendar.getEvents(new Date(2025, 0, 1), new Date(2027, 11, 31));
  events.forEach(e => e.deleteEvent());
}

function parseICalRobust(icalText, source) {
  const unfoldedText = icalText.replace(/\r?\n[ \t]/g, "");
  const events = [];
  const blocks = unfoldedText.split("BEGIN:VEVENT");

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split("END:VEVENT")[0];
    if (/STATUS:CANCELLED/i.test(block)) continue;

    const summaryRaw = extractICalValue(block, "SUMMARY") || "";
    const descRaw = extractICalValue(block, "DESCRIPTION") || "";

    // POKUD JDE O AIRBNB: Ignorujeme automatické synchro blokace s Bookingem ("Na základě Booking" / "Airbnb (Not available)")
    if (source === "Airbnb") {
      if (/booking|not available|closed/i.test(summaryRaw) || /booking|not available|closed/i.test(descRaw)) {
        continue;
      }
    }

    const dtstartRaw = extractICalValue(block, "DTSTART");
    const dtendRaw = extractICalValue(block, "DTEND");
    const uidRaw = extractICalValue(block, "UID");

    if (!dtstartRaw || !dtendRaw) continue;

    const startDate = parseICalDateStrict(dtstartRaw);
    const endDate = parseICalDateStrict(dtendRaw);

    if (!startDate || !endDate) continue;

    const pocetDnu = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    if (pocetDnu > 30) continue;

    events.push({
      strPrijezd: formatDateStandard(startDate),
      strOdjezd: formatDateStandard(endDate),
      dateOdjezd: endDate,
      pocetDnu: pocetDnu,
      uid: uidRaw ? uidRaw.trim() : ""
    });
  }
  return events;
}

function extractICalValue(block, key) {
  const reg = new RegExp(`${key}(?:;[^:]+)?:([^\\r\\n]+)`, "i");
  const m = block.match(reg);
  return m ? m[1].trim() : null;
}

function parseICalDateStrict(str) {
  if (!str) return null;
  const clean = str.replace(/[^0-9]/g, "");
  if (clean.length < 8) return null;
  const y = parseInt(clean.substring(0, 4), 10);
  const m = parseInt(clean.substring(4, 6), 10) - 1;
  const d = parseInt(clean.substring(6, 8), 10);
  return new Date(y, m, d, 0, 0, 0);
}

function parseDateRobust(dVal) {
  if (!dVal) return null;
  if (dVal instanceof Date && !isNaN(dVal.getTime())) return new Date(dVal.getFullYear(), dVal.getMonth(), dVal.getDate(), 0, 0, 0);
  const str = String(dVal).trim();
  const isoMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) return new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10), 0, 0, 0);
  const czMatch = str.match(/^(\d{1,2})[./\s]+(\d{1,2})[./\s]+(\d{4})/);
  if (czMatch) return new Date(parseInt(czMatch[3], 10), parseInt(czMatch[2], 10) - 1, parseInt(czMatch[1], 10), 0, 0, 0);
  return null;
}

function formatDateStandard(d) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateCzech(d) {
  if (!d) return "";
  const day = d.getDate();
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  return `${day}. ${m}. ${y}`;
}

function findColumn(headers, candidates) {
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i]).trim().toLowerCase();
    for (const c of candidates) {
      if (h === c.toLowerCase() || h.includes(c.toLowerCase())) return i;
    }
  }
  return -1;
}
