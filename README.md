# 🏨 Reservix - Správce Rezervací (Airbnb & Booking Channel Manager)

Profesionální webová aplikace pro centrální správu rezervací ubytování z platforem **Airbnb**, **Booking.com** a **přímých rezervací** bez rizika double-bookingu (přebukování).

---

## 🚀 Rychlé Spuštění

Aplikaci lze spustit dvěma jednoduchými způsoby:

### Možnost A: Otevření přímo v prohlížeči (Doporučeno)
1. Otevřete složku `06_Spravce_Rezervaci`.
2. Dvakrát klikněte na soubor `index.html` (otevře se v Chrome, Edge, Firefoxu či Safari).

### Možnost B: Spuštění přes lokální HTTP Server (Python)
V terminálu v této složce spusťte:
```bash
python -m http.server 3000
```
Poté otevřete v prohlížeči adresu `http://localhost:3000`.

---

## ✨ Klíčové Funkce

1. **Dashboard & KPI Přehled**:
   - Dnešní Check-in a Check-out hosté.
   - Aktuální měsíční tržby a míra obsazenosti (%).
   - Podíl rezervací z Airbnb vs Booking.com.

2. **Interaktivní Kalendář (Timeline / Gantt Grid)**:
   - Vizuální časová osa zobrazující vytížení všech bytů a objektů.
   - Barevně odlišené rezervace (Airbnb - Růžová `#FF385C`, Booking - Modrá `#0066FF`, Přímá - Zelená `#10B981`).
   - Přepínání měsíců a indikace víkendů i dnešního dne.

3. **Kompletní Správa Rezervací (CRUD)**:
   - Přidávání nových rezervací (jméno hosta, kontakt, datum příjezdu/odjezdu, celková cena, poznámky ke klíčům/lockboxu).
   - Filtrování podle nemovitostí, rezervačních kanálů a stavu (Potvrzeno, Ubytováno, Dokončeno, Zrušeno).
   - Vyhledávací lišta v záhlaví.

4. **Úklidy & Housekeeping Harmonogram**:
   - Rozpis úklidových prací po odjezdu hostů.
   - Přiřazování úklidových pracovníků a správa stavu (Čeká -> Provedeno).

5. **Analytika & Grafy Tržeb**:
   - Vizuální SVG grafy prodeje podle měsíců a rozdělení příjmů z kanálů.

6. **iCal Synchronizace**:
   - Správa iCal (.ics) odkazů z Airbnb a Booking.com pro automatickou synchronizaci kalendářů.
   - Generování master iCal odkazů pro export do externích platforem.

7. **Automatická synchronizace úklidů & Telegram notifikace (`google_apps_script.js`)**:
   - **Google Kalendář**: Automatické zakládání událostí úklidu v den odjezdu hosta.
   - **Google Sheets**: Evidence termínů úklidů a jejich stavů.
   - **Telegram Notifikace**:
     - 🔔 **Den předem**: Upozornění, že zítra končí host a proběhne úklid daného bytu.
     - 🧹 **V den úklidu**: Ranní upozornění na dnešní úklid s detaily o Check-outu.
     - *Ochrana proti spamu:* Každé oznámení se odešle pouze jednou.

