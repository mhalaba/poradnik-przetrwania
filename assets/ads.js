/* ===== Google AdSense =====
   Identyfikator wydawcy jest już wpisany. Skrypt ładujący Google znajduje się
   bezpośrednio w sekcji <head> plików index.html, szkolenie.html i gra.html –
   tego właśnie szuka Google przy weryfikacji witryny.

   Ten plik odpowiada tylko za wstawianie jednostek reklamowych w miejscach
   oznaczonych jako <div class="ad-slot" data-ad="top|inChapter|bottom">.

   JAK WŁĄCZYĆ REKLAMY W TYCH KONKRETNYCH MIEJSCACH:
   1. W panelu AdSense: Reklamy → Według jednostki reklamowej → Displayowa.
   2. Utwórz trzy jednostki (np. „gora”, „w tresci”, „dol”) i skopiuj numery
      z pola data-ad-slot (same cyfry).
   3. Wklej je poniżej w polu slots.
   Dopóki pola są puste, strona korzysta wyłącznie z reklam automatycznych
   (Auto ads), a zarezerwowane miejsca pozostają ukryte, żeby nie robić pustych ramek.

   Reklamy pojawią się dopiero po zatwierdzeniu witryny przez Google (zwykle 1–14 dni)
   i tylko na prawdziwej domenie – na localhost Google ich nie wyświetla.
*/
window.ADS_CONFIG = {
  enabled: true,
  publisherId: "ca-pub-1001856704695653",
  slots: {
    top: "",        // np. "1234567890"
    inChapter: "",  // np. "2345678901"
    bottom: ""      // np. "3456789012"
  },
  // Wersja dla dzieci: reklamy niespersonalizowane i oznaczenie treści kierowanych do dzieci.
  childDirectedForKids: true
};

(function(){
  const cfg = window.ADS_CONFIG;
  const isKids = document.body.classList.contains('kids');
  const configured = cfg.enabled && /^ca-pub-\d{10,}$/.test(cfg.publisherId);
  const kidSafe = isKids && cfg.childDirectedForKids;

  if (configured) {
    // Skrypt Google jest w <head>. Gdyby go zabrakło (np. w nowej podstronie), dołóż go.
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + cfg.publisherId;
      document.head.appendChild(s);
    }
    // Reklamy niespersonalizowane dla dzieci ustawia krótki skrypt w <head> każdej strony,
    // bo biblioteka Google podmienia obiekt adsbygoogle zaraz po starcie.
    // Tutaj tylko zabezpieczenie, gdyby biblioteka jeszcze nie wystartowała.
    if (kidSafe && Array.isArray(window.adsbygoogle)) window.adsbygoogle.requestNonPersonalizedAds = 1;
  }

  function render(){
    document.querySelectorAll('.ad-slot[data-ad]').forEach(el => {
      if (el.dataset.rendered) return;
      el.dataset.rendered = '1';
      const slot = cfg.slots[el.dataset.ad] || '';

      if (!configured) {
        el.innerHTML = '<span>Miejsce na reklamę Google AdSense – wpisz identyfikator w assets/ads.js</span>';
        return;
      }
      if (!slot) {
        // Brak numeru jednostki: zostawiamy pole reklamom automatycznym i ukrywamy pustą ramkę.
        el.style.display = 'none';
        return;
      }
      el.innerHTML = '';
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', cfg.publisherId);
      ins.setAttribute('data-ad-slot', slot);
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      if (kidSafe) {
        ins.setAttribute('data-tag-for-child-directed-treatment', '1');
        ins.setAttribute('data-tag-for-under-age-of-consent', '1');
      }
      el.appendChild(ins);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e){}
    });
  }
  window.renderAds = render;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
