/* ===== Pomiar =====
   Warstwa niezależna od dostawcy. Cała reszta kodu woła tylko window.track(nazwa, dane).

   JAK WŁĄCZYĆ GOOGLE ANALYTICS:
   1. https://analytics.google.com → Administracja → Utwórz usługę (typ: sieć WWW).
   2. Strumień danych → adres https://poradnik.punktodpornosci.pl
   3. Skopiuj identyfikator pomiaru w formacie G-XXXXXXXXXX i wklej niżej w polu ga4.

   PODGLĄD BEZ KONTA:
   Dopisz ?debug=1 do adresu strony. Każde zdarzenie wypisze się w konsoli przeglądarki,
   a na dole ekranu pojawi się licznik zdarzeń. Działa też, gdy pole ga4 jest puste.

   PRYWATNOŚĆ:
   Start jest zawsze w trybie zgody Google z odmową przechowywania danych, czyli bez
   plików cookie. Dopiero decyzja użytkownika może to zmienić. Powroty liczymy sami,
   w pamięci przeglądarki, bez ciasteczek.

   Pytanie o zgodę zadaje własny baner z tego pliku. Jest tu, bo komunikat Google
   z panelu AdSense pojawi się dopiero po zatwierdzeniu konta wydawcy, a do tego czasu
   nikt nie miałby jak wyrazić zgody i Analytics zbierałby wyłącznie dane zbiorcze.
   Gdy komunikat Google zacznie działać, nasz baner sam ustępuje mu miejsca.
*/
window.ANALYTICS = {
  ga4: "G-G61R23XN76",  // usluga "Poradnik przetrwania" w koncie halabaeu
  cookieless: true      // false = pełny tryb GA z ciasteczkami (wymaga zgody użytkownika)
};

(function(){
  const cfg = window.ANALYTICS;
  const params = new URLSearchParams(location.search);
  const DEBUG = params.has('debug');
  const WERSJA = params.get('wersja') === 'dzieci' ? 'dzieci' : (params.get('wersja') === 'dorosli' ? 'dorosli' : 'brak');
  const STRONA = (location.pathname.split('/').pop() || 'index.html').replace('.html','');
  const ok = /^G-[A-Z0-9]{6,}$/i.test(cfg.ga4 || '');

  /* --- Google Analytics, tylko gdy podano identyfikator --- */
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  if (ok) {
    if (cfg.cookieless) {
      gtag('consent', 'default', {
        ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
        analytics_storage: 'denied', wait_for_update: 500
      });
    }
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4;
    document.head.appendChild(s);
    gtag('js', new Date());
    // debug_mode kieruje zdarzenia do widoku DebugView w Analytics – tylko przy ?debug=1
    gtag('config', cfg.ga4, { anonymize_ip: true, send_page_view: true, debug_mode: DEBUG });
  }

  /* ===== Zgoda użytkownika =====
     Wybór zapisujemy w pamięci przeglądarki, nie w ciasteczku. Odmowa jest tak samo
     łatwa jak zgoda: oba przyciski mają ten sam rozmiar i ten sam kontrast. */
  const KLUCZ_ZGODY = 'pp_zgoda';
  const DZIECI = document.documentElement.dataset.wersja === 'dzieci' || WERSJA === 'dzieci';

  function zapisanaZgoda(){
    try { return JSON.parse(localStorage.getItem(KLUCZ_ZGODY) || 'null'); } catch(e){ return null; }
  }
  function ustawZgode(zgoda, zapisz){
    // W wersji dla dzieci nie personalizujemy reklam nawet po zgodzie.
    const reklamy = (zgoda && !DZIECI) ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: zgoda ? 'granted' : 'denied',
      ad_storage: zgoda ? 'granted' : 'denied',
      ad_user_data: reklamy,
      ad_personalization: reklamy
    });
    if (zapisz) {
      try { localStorage.setItem(KLUCZ_ZGODY, JSON.stringify({ zgoda: !!zgoda, data: new Date().toISOString().slice(0,10) })); } catch(e){}
      window.track('zgoda', { decyzja: zgoda ? 'tak' : 'nie' });
    }
  }

  const wybor = zapisanaZgoda();
  if (ok && wybor) ustawZgode(wybor.zgoda, false);

  /* Czy Google pokazał już własny komunikat? Wtedy nie wtrącamy się. */
  function googleJuzPyta(){
    try {
      if (document.querySelector('.fc-consent-root, .fc-dialog-container')) return true;
      const g = window.googlefc;
      if (g && typeof g.getConsentStatus === 'function' && g.getConsentStatus() !== 0) return true;
    } catch(e){}
    return false;
  }

  let baner = null;
  function pokazBanerZgody(){
    if (baner) { baner.hidden = false; return; }
    baner = document.createElement('div');
    baner.className = 'pp-zgoda';
    baner.setAttribute('role', 'dialog');
    baner.setAttribute('aria-label', 'Zgoda na pliki cookie');
    baner.innerHTML =
      '<div class="pp-zgoda-tresc">' +
        '<p><b>Ta strona chciałaby liczyć, jak Ci idzie nauka.</b> Analityka pokazuje nam, które rozdziały ' +
        'są porzucane i wymagają poprawy, a reklamy Google opłacają hosting. Bez Twojej zgody liczymy tylko ' +
        'zbiorczo, bez plików cookie i bez rozpoznawania Cię między wizytami.</p>' +
        '<p class="pp-zgoda-drobne">Decyzję zmienisz w każdej chwili linkiem „Ustawienia prywatności”. ' +
        '<a href="https://punktodpornosci.pl/prywatnosc" target="_blank" rel="noopener">Polityka prywatności</a></p>' +
      '</div>' +
      '<div class="pp-zgoda-guziki">' +
        '<button type="button" data-wybor="nie">Nie zgadzam się</button>' +
        '<button type="button" data-wybor="tak">Zgadzam się</button>' +
      '</div>';
    baner.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){
        ustawZgode(b.dataset.wybor === 'tak', true);
        baner.hidden = true;
      });
    });
    document.body.appendChild(baner);
  }

  function stylZgody(){
    if (document.getElementById('pp-zgoda-styl')) return;
    const st = document.createElement('style');
    st.id = 'pp-zgoda-styl';
    st.textContent =
      '.pp-zgoda{position:fixed;left:12px;right:12px;bottom:12px;z-index:99998;max-width:640px;margin:0 auto;' +
      'display:flex;flex-direction:column;gap:12px;padding:16px 18px;border-radius:14px;' +
      'background:#0e1a2d;color:#e8eefc;border:1px solid rgba(255,255,255,.16);' +
      'box-shadow:0 18px 44px rgba(0,0,0,.45);font:400 .92rem/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
      '.pp-zgoda p{margin:0 0 6px}' +
      '.pp-zgoda-drobne{font-size:.82rem;color:#9fb2d4}' +
      '.pp-zgoda-drobne a{color:#ffc857}' +
      '.pp-zgoda-guziki{display:flex;gap:10px}' +
      '.pp-zgoda-guziki button{flex:1;padding:11px 14px;border-radius:10px;font:inherit;font-weight:700;cursor:pointer;' +
      'border:1px solid #ffc857;background:transparent;color:#ffc857}' +
      '.pp-zgoda-guziki button[data-wybor="tak"]{background:#ffc857;color:#12233d}' +
      '.pp-zgoda-guziki button:focus-visible{outline:3px solid #7fb2ff;outline-offset:2px}' +
      '@media(min-width:620px){.pp-zgoda{flex-direction:row;align-items:center}.pp-zgoda-guziki{flex:0 0 300px}}';
    document.head.appendChild(st);
  }

  function zgodaStart(){
    stylZgody();
    // Link „Ustawienia prywatności” działa zawsze – albo przez Google, albo przez nasz baner.
    document.querySelectorAll('[data-zgoda]').forEach(function(a){
      a.hidden = false;
      a.addEventListener('click', function(e){
        e.preventDefault();
        if (googleJuzPyta() && window.googlefc && window.googlefc.showRevocationMessage) {
          window.ustawieniaPrywatnosci();
        } else {
          pokazBanerZgody();
        }
      });
    });
    if (!ok || zapisanaZgoda()) return;
    // Dajemy Google chwilę na własny komunikat, dopiero potem pokazujemy swój.
    setTimeout(function(){ if (!googleJuzPyta() && !zapisanaZgoda()) pokazBanerZgody(); }, 2500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', zgodaStart); else zgodaStart();

  /* --- podgląd na ekranie przy ?debug=1 --- */
  let box = null, licznik = 0;
  function debugBox(name, data){
    if (!box) {
      box = document.createElement('div');
      box.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;max-width:min(420px,90vw);max-height:40vh;overflow:auto;'
        + 'background:rgba(8,14,24,.92);color:#cfe3ff;font:12px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;'
        + 'padding:10px 12px;border:1px solid #2a3a5c;border-radius:8px;pointer-events:auto';
      document.body.appendChild(box);
    }
    licznik++;
    const line = document.createElement('div');
    line.textContent = licznik + '. ' + name + ' ' + JSON.stringify(data);
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  }

  /* --- jedna funkcja dla całej strony --- */
  window.track = function(name, data){
    const d = Object.assign({ wersja: WERSJA, strona: STRONA }, data || {});
    try { if (ok) gtag('event', name, d); } catch(e){}
    if (DEBUG) { try { console.log('[pomiar]', name, d); debugBox(name, d); } catch(e){} }
  };

  /* --- powroty liczone lokalnie, bez ciasteczek --- */
  try {
    const KEY = 'pp_wizyty';
    const dzis = new Date().toISOString().slice(0,10);
    let w = {};
    try { w = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){}
    if (!w.pierwsza) { w.pierwsza = dzis; w.dni = [dzis]; w.wizyt = 1; }
    else if (w.ostatnia !== dzis) {
      w.wizyt = (w.wizyt || 1) + 1;
      w.dni = (w.dni || []).concat(dzis).slice(-30);
      const roznica = Math.round((Date.parse(dzis) - Date.parse(w.pierwsza)) / 86400000);
      window.track('powrot', { dni_od_pierwszej: roznica, wizyta: w.wizyt });
    }
    w.ostatnia = dzis;
    localStorage.setItem(KEY, JSON.stringify(w));
  } catch(e){}

  /* --- ponowne otwarcie okna zgody Google (link „Ustawienia prywatności”) --- */
  window.ustawieniaPrywatnosci = function(){
    try {
      window.googlefc = window.googlefc || {};
      window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
      window.googlefc.callbackQueue.push({ CONSENT_DATA_READY: function(){
        try { window.googlefc.showRevocationMessage(); } catch(e){}
      }});
    } catch(e){}
  };

  if (DEBUG) window.track('podglad_wlaczony', { ga4: ok ? 'skonfigurowane' : 'brak' });
})();
