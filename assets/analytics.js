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
   Domyślnie włączony jest tryb zgody Google z odmową przechowywania danych, czyli
   Analytics działa bez plików cookie. Zdarzenia są zliczane, ale użytkownik nie jest
   śledzony między witrynami. Powroty liczymy sami, w pamięci przeglądarki, bez ciasteczek.
*/
window.ANALYTICS = {
  ga4: "",              // <-- wklej tutaj G-XXXXXXXXXX
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
    gtag('config', cfg.ga4, { anonymize_ip: true, send_page_view: true });
  }

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

  if (DEBUG) window.track('podglad_wlaczony', { ga4: ok ? 'skonfigurowane' : 'brak' });
})();
