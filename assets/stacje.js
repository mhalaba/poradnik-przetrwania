/* ===== Stacje szkoleniowe w miasteczku =====
   Dwie stacje z własnymi grami: kompas (orientacja w terenie) i elektronika.
   Plik jest niezależny od silnika misji — panele quizowe w game.js wymagają
   trwającej misji, a stacje mają działać w dowolnym momencie.

   game.js podaje tu zestaw narzędzi (A) i uruchamia jedną z funkcji z window.STACJE_GRY.
   A = { open, close, T, KIDS, beep, good, bad, toast, marsz, koniec }
     open(html)          – otwiera panel (zatrzymuje ruch gracza)
     close()             – zamyka panel
     T(dorosli, dzieci)  – wybór wariantu tekstu
     marsz(cfg, then)    – marsz na azymut w świecie 3D, then(blad_w_metrach)
     koniec(gw, html)    – zapis wyniku stacji, gwiazdki 1–3 i ekran końcowy
*/

/* ---------- rysowanie kompasu (używane i w panelu, i w HUD podczas marszu) ---------- */
window.KOMPAS_RYSUJ = function(c, S, o){
  const R = S/2 - 4, cx = S/2, cy = S/2;
  const kurs = o.kurs || 0;          // dokąd patrzy gracz, w stopniach
  const cel  = (o.cel === undefined) ? null : o.cel;
  const rad  = d => (d - kurs - 90) * Math.PI/180;   // 0° = góra ekranu

  c.clearRect(0,0,S,S);
  c.beginPath(); c.arc(cx,cy,R,0,6.2832);
  c.fillStyle='rgba(10,18,32,.88)'; c.fill();
  c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=2; c.stroke();

  // podziałka co 15°, dłuższa co 45°
  for(let d=0; d<360; d+=15){
    const a=rad(d), dl=(d%45===0)?R*.18:R*.09;
    c.beginPath();
    c.moveTo(cx+Math.cos(a)*R*.92, cy+Math.sin(a)*R*.92);
    c.lineTo(cx+Math.cos(a)*(R*.92-dl), cy+Math.sin(a)*(R*.92-dl));
    c.strokeStyle='rgba(255,255,255,'+(d%45===0?'.75':'.35')+')'; c.lineWidth=d%45===0?2:1; c.stroke();
  }
  // litery kierunków
  c.font='bold '+Math.round(S*.11)+'px Nunito, Inter, sans-serif';
  c.textAlign='center'; c.textBaseline='middle';
  [['N',0,'#ff6b6b'],['E',90,'#e8eefc'],['S',180,'#e8eefc'],['W',270,'#e8eefc']].forEach(([lit,d,kol])=>{
    const a=rad(d);
    c.fillStyle=kol;
    c.fillText(lit, cx+Math.cos(a)*R*.68, cy+Math.sin(a)*R*.68);
  });
  // igła: czerwony grot na północ, biały na południe
  const an=rad(0), as=rad(180);
  c.lineWidth=Math.max(3,S*.045); c.lineCap='round';
  c.beginPath(); c.moveTo(cx,cy); c.lineTo(cx+Math.cos(an)*R*.5, cy+Math.sin(an)*R*.5);
  c.strokeStyle='#ff3b3b'; c.stroke();
  c.beginPath(); c.moveTo(cx,cy); c.lineTo(cx+Math.cos(as)*R*.5, cy+Math.sin(as)*R*.5);
  c.strokeStyle='#dfe6f5'; c.stroke();
  c.beginPath(); c.arc(cx,cy,S*.035,0,6.2832); c.fillStyle='#0b1424'; c.fill();
  c.strokeStyle='rgba(255,255,255,.5)'; c.lineWidth=1.5; c.stroke();

  // znacznik nastawionego azymutu
  if(cel!==null){
    const a=rad(cel);
    c.beginPath();
    c.moveTo(cx+Math.cos(a)*R*.99, cy+Math.sin(a)*R*.99);
    c.lineTo(cx+Math.cos(a-.13)*R*.78, cy+Math.sin(a-.13)*R*.78);
    c.lineTo(cx+Math.cos(a+.13)*R*.78, cy+Math.sin(a+.13)*R*.78);
    c.closePath(); c.fillStyle='#ffc857'; c.fill();
  }
  // stała strzałka kierunku marszu (zawsze na górze)
  if(o.marsz){
    c.beginPath(); c.moveTo(cx,4); c.lineTo(cx-7,18); c.lineTo(cx+7,18); c.closePath();
    c.fillStyle='#7fe3c0'; c.fill();
  }
};

(function(){
'use strict';

/* ---------- wspólne klocki paneli ---------- */

function naglowek(tytul, krok, ile){
  return '<div style="color:var(--accent);font-weight:800;font-size:.8rem;text-transform:uppercase">Stacja · krok '+krok+' z '+ile+'</div>'
       + '<h2 style="margin-bottom:6px">'+tytul+'</h2>';
}
function dalej(id, tekst){
  return '<div class="navbtns" style="justify-content:flex-end"><button class="btn primary" id="'+id+'">'+(tekst||'Dalej →')+'</button></div>';
}
const $$ = s => document.querySelector(s);

/* Quiz z wyjaśnieniem po każdej odpowiedzi. Zwraca liczbę trafień. */
function potasuj(n){ const idx=n.map((_,k)=>k); for(let k=idx.length-1;k>0;k--){ const j=Math.floor(Math.random()*(k+1)); const t=idx[k]; idx[k]=idx[j]; idx[j]=t; } return idx; }

function pytania(A, cfg, then){
  let i=0, ok=0;
  const krok=()=>{
    if(i>=cfg.lista.length){ then(ok, cfg.lista.length); return; }
    const zrodlo=cfg.lista[i], kol=potasuj(zrodlo.o);
    const q={ q:zrodlo.q, w:zrodlo.w, o:kol.map(k=>zrodlo.o[k]), a:kol.indexOf(zrodlo.a) };
    A.open(naglowek(cfg.tytul, cfg.krok, cfg.ile)
      + (cfg.wstep && i===0 ? '<p>'+cfg.wstep+'</p>' : '')
      + '<div class="qitem"><div class="q">'+(i+1)+'/'+cfg.lista.length+' · '+q.q+'</div>'
      + q.o.map((o,oi)=>'<button class="opt" data-o="'+oi+'">'+o+'</button>').join('')
      + '</div><div id="fb"></div>');
    document.querySelectorAll('#panelBox .opt').forEach(b=>b.onclick=()=>{
      const dobrze = +b.dataset.o === q.a;
      b.classList.add(dobrze?'correct':'wrong');
      if(dobrze){ ok++; A.beep(880,.1); }
      else { A.bad(); const g=document.querySelector('#panelBox .opt[data-o="'+q.a+'"]'); if(g) g.classList.add('correct'); }
      document.querySelectorAll('#panelBox .opt').forEach(x=>x.onclick=null);
      $$('#fb').innerHTML='<div class="msg '+(dobrze?'good':'badm')+'"><b>'+(dobrze?'✅ Dobrze. ':'💡 Zapamiętaj: ')+'</b>'+q.w+'</div>'+dalej('nx');
      $$('#nx').onclick=()=>{ i++; krok(); };
    });
  };
  krok();
}

/* Zadanie rachunkowe. Po pierwszej pomyłce podpowiedź, po drugiej rozwiązanie. */
function licz(A, cfg, then){
  let proby=0;
  const rysuj=(komunikat)=>{
    A.open(naglowek(cfg.tytul, cfg.krok, cfg.ile)
      + '<div class="tip"><b>Zasada:</b> '+cfg.zasada+'</div>'
      + '<p>'+cfg.pytanie+'</p>'
      + '<div style="display:flex;gap:10px;align-items:center;margin:12px 0">'
      + '<input id="odp" inputmode="decimal" style="flex:1;padding:12px 14px;border-radius:10px;border:1px solid var(--line);background:var(--card2);color:inherit;font:inherit;font-size:1.1rem" placeholder="wpisz liczbę">'
      + '<span style="font-weight:800">'+cfg.jednostka+'</span>'
      + '<button class="btn primary" id="ok">Sprawdź</button></div>'
      + '<div id="fb">'+(komunikat||'')+'</div>');
    const inp=$$('#odp');
    const sprawdz=()=>{
      const v=parseFloat(String(inp.value||'').replace(',','.'));
      if(isNaN(v)){ $$('#fb').innerHTML='<div class="msg badm">Wpisz liczbę.</div>'; return; }
      if(Math.abs(v-cfg.wynik) <= (cfg.tol||0)){
        A.good();
        $$('#fb').innerHTML='<div class="msg good"><b>✅ Dobrze. </b>'+cfg.rozwiazanie+'</div>'+dalej('nx');
        $$('#nx').onclick=()=>then(proby===0);
      } else {
        proby++; A.bad();
        if(proby===1) rysuj('<div class="msg badm"><b>💡 Jeszcze nie. </b>'+cfg.podpowiedz+'</div>');
        else {
          $$('#fb').innerHTML='<div class="msg badm"><b>Rozwiązanie: </b>'+cfg.rozwiazanie+'</div>'+dalej('nx','Rozumiem →');
          $$('#nx').onclick=()=>then(false);
        }
      }
    };
    $$('#ok').onclick=sprawdz;
    inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); sprawdz(); } };
    inp.focus();
  };
  rysuj();
}

/* Tarcza kompasu z suwakiem: ustaw azymut na podany kierunek. */
function tarcza(A, cfg, then){
  let i=0, ok=0;
  const krok=()=>{
    if(i>=cfg.zadania.length){ then(ok, cfg.zadania.length); return; }
    const z=cfg.zadania[i];
    A.open(naglowek(cfg.tytul, cfg.krok, cfg.ile)
      + (i===0?'<p>'+cfg.wstep+'</p>':'')
      + '<p><b>Zadanie '+(i+1)+'/'+cfg.zadania.length+':</b> '+z.polecenie+'</p>'
      + '<div style="display:flex;flex-direction:column;align-items:center;gap:10px">'
      + '<canvas id="tarczaC" width="220" height="220" style="max-width:70vw"></canvas>'
      + '<div style="font:800 1.6rem/1 Nunito,Inter,sans-serif" id="stopnie">0°</div>'
      + '<input type="range" id="suwak" min="0" max="359" value="0" style="width:min(320px,80vw)">'
      + '</div><div id="fb"></div>'
      + '<div class="navbtns" style="justify-content:center"><button class="btn primary" id="ok">Zatwierdź azymut</button></div>');
    const cv=$$('#tarczaC'), ctx=cv.getContext('2d'), suw=$$('#suwak');
    const odswiez=()=>{
      const v=+suw.value;
      $$('#stopnie').textContent=v+'°';
      window.KOMPAS_RYSUJ(ctx, 220, { kurs:0, cel:v, marsz:false });
    };
    suw.oninput=odswiez; odswiez();
    $$('#ok').onclick=()=>{
      const v=+suw.value;
      const roznica=Math.min(Math.abs(v-z.azymut), 360-Math.abs(v-z.azymut));
      const dobrze = roznica <= (z.tol||5);
      if(dobrze){ ok++; A.good(); } else A.bad();
      $$('#ok').disabled=true; suw.disabled=true;
      $$('#fb').innerHTML='<div class="msg '+(dobrze?'good':'badm')+'"><b>'+(dobrze?'✅ Dobrze. ':'💡 Prawidłowo to '+z.azymut+'°. ')+'</b>'+z.w+'</div>'+dalej('nx');
      $$('#nx').onclick=()=>{ i++; krok(); };
    };
  };
  krok();
}

/* ============================================================
   STACJA KOMPASU
   ============================================================ */
window.STACJE_GRY = window.STACJE_GRY || {};

window.STACJE_GRY.kompas = function(A){
  const KIDS=A.KIDS;
  let punkty=0, maks=0;
  const zalicz=(ok,ile)=>{ punkty+=ok; maks+=ile; };

  const ILE = KIDS ? 4 : 6;

  /* --- wersja dla dzieci --- */
  if(KIDS){
    const k1=()=>pytania(A,{ tytul:'Igła zawsze wie, gdzie jest północ', krok:1, ile:ILE,
      wstep:'Kompas to mały pomocnik, który zawsze pokazuje ten sam kierunek — północ. Dzięki temu wiesz, w którą stronę idziesz.',
      lista:[
        { q:'Czerwony koniec igły pokazuje:', o:['Północ','Twój dom','Najbliższy sklep'], a:0,
          w:'Czerwony grot zawsze pokazuje północ. Nieważne, jak obrócisz kompas — igła sama się ustawi.' },
        { q:'Jak trzymać kompas, żeby dobrze działał?', o:['Płasko na dłoni, z dala od telefonu','Pionowo przy uchu','W kieszeni'], a:0,
          w:'Igła musi się swobodnie kręcić. Telefon i metalowe rzeczy potrafią ją oszukać.' },
        { q:'Jeśli północ jest przed tobą, to wschód jest:', o:['Po prawej','Po lewej','Za tobą'], a:0,
          w:'Kolejność jak na zegarze: północ, wschód, południe, zachód. Wschód zawsze na prawo od północy.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); k2(); });

    const k2=()=>tarcza(A,{ tytul:'Cztery kierunki', krok:2, ile:ILE,
      wstep:'Przekręć suwak i ustaw żółtą strzałkę na właściwy kierunek. Czerwona igła cały czas pokazuje północ.',
      zadania:[
        { polecenie:'Ustaw <b>wschód</b>.', azymut:90, tol:8, w:'Wschód to 90°. Tam rano wschodzi słońce.' },
        { polecenie:'Ustaw <b>południe</b>.', azymut:180, tol:8, w:'Południe to 180°. W samo południe słońce jest właśnie tam.' },
        { polecenie:'Ustaw <b>zachód</b>.', azymut:270, tol:8, w:'Zachód to 270°. Tam wieczorem chowa się słońce.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); k3(); });

    const k3=()=>{
      A.open(naglowek('Idź w teren', 3, ILE)
        + '<p>Teraz naprawdę: kompas pojawi się w rogu ekranu. Obróć się tak, żeby <b>żółta strzałka była na samej górze</b> — wtedy idziesz w dobrą stronę. Przejdź <b>25 metrów</b> i wciśnij przycisk „Tu jestem".</p>'
        + '<div class="msg">Kompas pokaże ci też, ile metrów już przeszedłeś.</div>'
        + '<div class="navbtns" style="justify-content:center"><button class="btn primary" id="idz">Ruszam →</button></div>');
      $$('#idz').onclick=()=>A.marsz({ azymut:90, dystans:25, opis:'Idź na wschód (azymut 90°) i przejdź 25 m.' }, (blad)=>{
        const ok = blad<=8 ? 1 : 0; zalicz(ok,1);
        A.open(naglowek('Jak ci poszło?', 3, ILE)
          + '<div class="msg '+(ok?'good':'badm')+'"><b>'+(ok?'✅ Świetnie! ':'🙂 Prawie. ')+'</b>Minąłeś się z celem o <b>'+Math.round(blad)+' m</b>. '
          + (ok?'Trzymałeś kierunek jak prawdziwy zwiadowca.':'Następnym razem częściej zerkaj na kompas — łatwo zejść z kursu, gdy omijasz drzewo.')+'</div>'
          + dalej('nx'));
        $$('#nx').onclick=k4;
      });
    };

    const k4=()=>pytania(A,{ tytul:'Kompas ze słońca', krok:4, ile:ILE,
      wstep:'Nie masz kompasu? Słońce też pokazuje kierunki.',
      lista:[
        { q:'Rano słońce jest na:', o:['Wschodzie','Zachodzie','Północy'], a:0, w:'Rano na wschodzie, w południe na południu, wieczorem na zachodzie. Trzy razy dziennie masz darmowy kompas.' },
        { q:'Czy mech na drzewie zawsze rośnie od północy?', o:['Nie, to bajka','Tak, zawsze','Tylko w lesie'], a:0, w:'Mech rośnie tam, gdzie jest wilgotno i cień — czasem od północy, czasem nie. Lepiej zaufaj słońcu albo kompasowi.' },
        { q:'Zgubiłeś się w lesie. Co robisz najpierw?', o:['Zatrzymuję się i wołam dorosłego','Biegnę szukać drogi','Chowam się'], a:0, w:'Stop, zostań w widocznym miejscu, wołaj. Osoba, która stoi w miejscu, jest dużo łatwiejsza do znalezienia niż taka, która biega.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); koniec(); });

    k1();
  }

  /* --- wersja dla dorosłych --- */
  else {
    const k1=()=>pytania(A,{ tytul:'Kompas: co jest czym', krok:1, ile:ILE,
      wstep:'Kompas nie pokazuje drogi. Pokazuje jeden kierunek odniesienia — resztę liczysz od niego. Zacznijmy od budowy.',
      lista:[
        { q:'Czerwony koniec igły wskazuje:', o:['Północ magnetyczną','Kierunek marszu','Najbliższą drogę'], a:0,
          w:'Igła ustawia się wzdłuż pola magnetycznego Ziemi. To jedyny stały punkt odniesienia, jaki masz w terenie bez map i sieci.' },
        { q:'Do czego służy obrotowa podziałka (limbus)?', o:['Do nastawienia azymutu, czyli kąta marszu','Do mierzenia odległości','Do podświetlenia mapy'], a:0,
          w:'Na limbusie ustawiasz kąt liczony od północy zgodnie z ruchem wskazówek zegara. Potem obracasz się całym ciałem, aż igła wejdzie w strzałkę orientacyjną — wtedy strzałka marszu pokazuje twój kierunek.' },
        { q:'Jak trzymać kompas?', o:['Poziomo, z dala od telefonu, kluczy i maski auta','Pionowo, na wysokości oczu','Przyłożony do telefonu, żeby porównać'], a:0,
          w:'Igła musi się swobodnie obracać w poziomie. Telefon, klucze, karabińczyk czy maska samochodu odchylają ją nawet o kilkanaście stopni — a to na dystansie kilometra daje setki metrów błędu.' },
        { q:'Azymut to:', o:['Kąt od północy do celu, mierzony zgodnie z ruchem wskazówek zegara','Odległość do celu','Wysokość nad poziomem morza'], a:0,
          w:'Azymut liczymy zawsze od północy w prawo: 0° północ, 90° wschód, 180° południe, 270° zachód. Zawsze trzy cyfry w meldunku, żeby nie pomylić 45 z 450.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); k2(); });

    const k2=()=>tarcza(A,{ tytul:'Nastaw azymut', krok:2, ile:ILE,
      wstep:'Suwak obraca limbus. Żółta strzałka to nastawiony azymut, czerwona igła to północ. Ustaw wartość i zatwierdź.',
      zadania:[
        { polecenie:'Nastaw azymut na <b>wschód</b>.', azymut:90, tol:4, w:'Wschód to równe 90°.' },
        { polecenie:'Nastaw azymut na <b>południowy zachód</b>.', azymut:225, tol:4, w:'Kierunki pośrednie leżą dokładnie w połowie: SW to 225°, NE to 45°, SE 135°, NW 315°.' },
        { polecenie:'Nastaw <b>340°</b>.', azymut:340, tol:4, w:'340° to niemal północ, odchylone 20° na zachód. Przy takich wartościach łatwo pomylić się o 360 — dlatego meldunek zawsze podaje trzy cyfry: „trzy cztery zero".' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); k3(); });

    const k3=()=>licz(A,{ tytul:'Azymut powrotny', krok:3, ile:ILE,
      zasada:'Droga powrotna ma azymut różniący się o 180°. Jeśli azymut jest mniejszy niż 180 — dodaj 180. Jeśli większy lub równy — odejmij 180.',
      pytanie:'Szedłeś do źródła azymutem <b>70°</b>. Jakim azymutem wrócisz do obozu?',
      jednostka:'°', wynik:250, tol:0,
      podpowiedz:'70 jest mniejsze niż 180, więc dodajesz.',
      rozwiazanie:'70 + 180 = <b>250°</b>. Azymut powrotny liczy się od razu przy wyjściu i zapisuje obok pierwszego — po zmroku albo we mgle nie ma czasu na rachunki.'
    }, (bezbledu)=>{ zalicz(bezbledu?1:0,1); k4(); });

    const k4=()=>licz(A,{ tytul:'Deklinacja magnetyczna', krok:4, ile:ILE,
      zasada:'Kompas pokazuje północ <b>magnetyczną</b>, a mapa jest rysowana względem północy <b>geograficznej</b>. Różnica to deklinacja. W Polsce igła odchyla się o kilka stopni na wschód — około 4° na zachodzie kraju, około 8° przy wschodniej granicy. Idąc z mapy na kompas, deklinację wschodnią <b>odejmujesz</b>.',
      pytanie:'Z mapy odczytałeś azymut geograficzny <b>100°</b>. Deklinacja w twojej okolicy wynosi <b>6° na wschód</b>. Jaki azymut nastawiasz na kompasie?',
      jednostka:'°', wynik:94, tol:0,
      podpowiedz:'Z mapy na kompas: odejmij deklinację wschodnią.',
      rozwiazanie:'100 − 6 = <b>94°</b>. W drugą stronę, z kompasu na mapę, deklinację dodajesz. Na 10 km różnica 6° to około kilometra w bok — dokładną wartość dla swojej okolicy sprawdź w kalkulatorze deklinacji i zapisz na mapie.'
    }, (bezbledu)=>{ zalicz(bezbledu?1:0,1); k5(); });

    const k5=()=>{
      const az = [55, 120, 200, 290][Math.floor(Math.random()*4)];
      A.open(naglowek('Marsz na azymut', 5, ILE)
        + '<p>Teraz w terenie. W rogu ekranu pojawi się kompas: <b>czerwona igła to północ</b>, <b>żółta strzałka to nastawiony azymut</b>, zielony grot na górze to twój kierunek marszu.</p>'
        + '<div class="tip"><b>Technika:</b> obróć się tak, żeby żółta strzałka stanęła na samej górze. Wtedy idziesz dokładnie azymutem. Wybierz sobie punkt na wprost — drzewo, słup — dojdź do niego i dopiero wtedy znów sprawdź kompas. Patrzenie pod nogi na tarczę to najczęstsza przyczyna zejścia z kursu.</p></div>'
        + '<p><b>Zadanie:</b> azymut <b>'+az+'°</b>, odległość <b>45 metrów</b>. Kompas liczy ci przebyty dystans zamiast kroków. Gdy uznasz, że jesteś na miejscu, wciśnij „Tu jestem".</p>'
        + '<div class="navbtns" style="justify-content:center"><button class="btn primary" id="idz">Ruszam w teren →</button></div>');
      $$('#idz').onclick=()=>A.marsz({ azymut:az, dystans:45, opis:'Marsz na azymut '+az+'°, odległość 45 m.' }, (blad)=>{
        const gw = blad<=6 ? 2 : blad<=14 ? 1 : 0; zalicz(gw,2);
        A.open(naglowek('Pomiar błędu', 5, ILE)
          + '<div class="msg '+(gw===2?'good':'badm')+'"><b>'+(gw===2?'✅ Bardzo dobrze. ':gw===1?'🙂 Nieźle. ':'💡 Do poprawki. ')+'</b>'
          + 'Minąłeś się z punktem o <b>'+Math.round(blad)+' m</b> na 45 m marszu.</div>'
          + '<div class="tip">W terenie przyjmuje się, że błąd rośnie o mniej więcej <b>1 metr na każde 60 metrów marszu za każdy stopień odchylenia</b>. Jeden stopień na kilometrze to około 17 metrów w bok. Dlatego przy dłuższych odcinkach dzieli się trasę na etapy i po każdym sprawdza kompas.</div>'
          + dalej('nx'));
        $$('#nx').onclick=k6;
      });
    };

    const k6=()=>pytania(A,{ tytul:'Orientacja bez sprzętu', krok:6, ile:ILE,
      wstep:'Kompas potrafi się zgubić albo zamoknąć. Te sposoby działają zawsze.',
      lista:[
        { q:'Jest równo południe czasu słonecznego. Cień pionowego patyka wskazuje:', o:['Północ','Południe','Wschód'], a:0,
          w:'W południe słońce jest na południu, więc cień pada na północ. Uwaga na czas letni: wtedy „słoneczne południe" wypada około 13:30, a nie 12:00.' },
        { q:'Gwiazda Polarna wskazuje północ. Jak ją znaleźć?', o:['Przedłużyć pięciokrotnie tylną ścianę Wielkiego Wozu','Znaleźć najjaśniejszą gwiazdę na niebie','Szukać przy horyzoncie na zachodzie'], a:0,
          w:'Dwie tylne gwiazdy Wielkiego Wozu wyznaczają linię — odmierz na niej pięć takich odcinków i trafisz w Gwiazdę Polarną. Nie jest najjaśniejsza, ale stoi prawie nieruchomo nad północą.' },
        { q:'Zorientować mapę to znaczy:', o:['Obrócić ją tak, żeby jej północ pokrywała się z północą w terenie','Rozłożyć ją na kolanach','Zaznaczyć na niej cel'], a:0,
          w:'Zorientowana mapa czyta się sama: co jest na niej po prawej, to jest po prawej też w terenie. Bez tego łatwo pomylić kierunek marszu o 180°.' },
        { q:'Idziesz do odległej wsi. Lepiej celować:', o:['Świadomie kilkadziesiąt metrów obok, na drogę prowadzącą do celu','Dokładnie w środek wsi','Byle w tamtą stronę'], a:0,
          w:'To celowanie z zapasem. Jeśli wymierzysz idealnie i chybisz, nie wiesz, w którą stronę skręcić. Jeśli celujesz świadomie na lewo od celu, po dojściu do drogi wiesz na pewno, że masz iść w prawo.' },
        { q:'Zgubiłeś orientację w terenie. Pierwsza rzecz:', o:['Zatrzymać się i odtworzyć ostatni pewny punkt','Iść dalej, aż coś się znajdzie','Zejść ze szlaku w dolinę'], a:0,
          w:'Zasada STOP: Stój, ThINK czyli pomyśl, Obserwuj, Planuj. Marsz w panice oddala cię od miejsca, w którym ktoś będzie cię szukał, i zużywa wodę oraz światło dnia.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); koniec(); });

    k1();
  }

  function koniec(){
    const proc = maks ? punkty/maks : 0;
    const gw = proc>=.85 ? 3 : proc>=.6 ? 2 : 1;
    A.koniec('kompas', gw,
      '<p>Wynik: <b>'+punkty+' / '+maks+'</b></p>'
      + '<div class="msg"><b>📌 Zapamiętaj</b><ul>'
      + '<li>Azymut liczysz od północy w prawo. Powrót to ta sama liczba ±180°.</li>'
      + (KIDS?'':'<li>Kompas pokazuje północ magnetyczną, mapa geograficzną. W Polsce różnica to kilka stopni na wschód.</li>')
      + '<li>Idź od punktu do punktu, a nie ze wzrokiem na tarczy.</li>'
      + '<li>Celuj świadomie obok celu, jeśli obok jest droga, rzeka albo linia lasu — wtedy zawsze wiesz, w którą stronę skręcić.</li>'
      + '<li>Bez kompasu: słońce rano na wschodzie, w południe na południu, wieczorem na zachodzie.</li>'
      + '</ul></div>');
  }
};

/* ============================================================
   STACJA ELEKTRONIKI
   ============================================================ */

window.STACJE_GRY.elektronika = function(A){
  const KIDS=A.KIDS;
  let punkty=0, maks=0;
  const zalicz=(ok,ile)=>{ punkty+=ok; maks+=ile; };
  const ILE = KIDS ? 4 : 6;

  /* --- obwód: wybierz element w każde gniazdo --- */
  function obwod(A, cfg, then){
    // kolejnosc opcji losujemy raz, na starcie - inaczej przyciski skakalyby przy kazdym kliknieciu
    cfg.gniazda.forEach(g=>{ if(!g._tas){ g._tas=true; for(let k=g.opcje.length-1;k>0;k--){ const j=Math.floor(Math.random()*(k+1)); const t=g.opcje[k]; g.opcje[k]=g.opcje[j]; g.opcje[j]=t; } } });
    let wybor = cfg.gniazda.map(()=>null);
    const rysuj=(fb)=>{
      A.open(naglowek(cfg.tytul, cfg.krok, cfg.ile)
        + '<p>'+cfg.wstep+'</p>'
        + '<div class="msg" style="font:700 1rem/1.9 ui-monospace,Menlo,monospace;text-align:center">'
        + cfg.gniazda.map((g,i)=>(wybor[i]===null?'[ '+g.etykieta+' ]':'[ '+g.opcje[wybor[i]].t+' ]')).join(' —— ')
        + '</div>'
        + cfg.gniazda.map((g,i)=>'<div class="qitem" data-g="'+i+'"><div class="q">'+(i+1)+'. '+g.pytanie+'</div>'
            + g.opcje.map((o,oi)=>'<button class="opt'+(wybor[i]===oi?' correct':'')+'" data-g="'+i+'" data-o="'+oi+'">'+o.t+'</button>').join('')
            + '</div>').join('')
        + '<div id="fb">'+(fb||'')+'</div>'
        + '<div class="navbtns" style="justify-content:center"><button class="btn primary" id="wl">🔌 Włącz zasilanie</button></div>');
      document.querySelectorAll('#panelBox .opt').forEach(b=>b.onclick=()=>{
        wybor[+b.dataset.g] = +b.dataset.o; A.beep(700,.06); rysuj();
      });
      $$('#wl').onclick=()=>{
        if(wybor.some(w=>w===null)){ $$('#fb').innerHTML='<div class="msg badm">Najpierw wybierz element w każdym miejscu obwodu.</div>'; return; }
        const zle = cfg.gniazda.map((g,i)=>g.opcje[wybor[i]]).filter(o=>!o.ok);
        if(zle.length===0){
          A.good();
          $$('#fb').innerHTML='<div class="msg good"><b>💡 Świeci! </b>'+cfg.sukces+'</div>'+dalej('nx');
          $$('#nx').onclick=()=>then(true);
        } else {
          A.bad();
          $$('#fb').innerHTML='<div class="msg badm"><b>⚡ Nie działa. </b>'+zle.map(o=>o.w).join(' ')+'</div>';
        }
      };
    };
    rysuj();
  }

  /* --- wersja dla dzieci --- */
  if(KIDS){
    const k1=()=>pytania(A,{ tytul:'Prąd lubi zamknięte kółko', krok:1, ile:ILE,
      wstep:'Prąd płynie tylko wtedy, gdy ma drogę tam i z powrotem. Taka droga to obwód.',
      lista:[
        { q:'Żeby żarówka świeciła, obwód musi być:', o:['Zamknięty, czyli bez przerwy','Otwarty','Mokry'], a:0,
          w:'Prąd wypływa z jednego bieguna baterii i musi wrócić do drugiego. Przerwa w dowolnym miejscu i koniec — jak przerwana kolejka.' },
        { q:'Co robi wyłącznik?', o:['Robi przerwę w obwodzie','Dodaje prądu','Chłodzi żarówkę'], a:0,
          w:'Wyłącznik to zwyczajna, sterowana przerwa. Naciskasz i droga dla prądu się zamyka albo otwiera.' },
        { q:'Który materiał przewodzi prąd?', o:['Metal','Drewno','Plastik'], a:0,
          w:'Metale przewodzą, dlatego przewody są miedziane. Plastik i drewno nie przewodzą — dlatego przewód ma plastikową osłonkę.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); k2(); });

    const k2=()=>obwod(A,{ tytul:'Zbuduj latarkę', krok:2, ile:ILE,
      wstep:'Ułóż obwód, żeby żarówka zaświeciła. Wybierz jeden element w każdym miejscu.',
      gniazda:[
        { etykieta:'źródło', pytanie:'Co da prąd?', opcje:[
          {t:'Bateria', ok:true}, {t:'Kamień', ok:false, w:'Kamień nie ma w sobie prądu.'}, {t:'Gumka', ok:false, w:'Gumka nie przewodzi i nie daje prądu.'} ] },
        { etykieta:'przewód', pytanie:'Czym połączyć?', opcje:[
          {t:'Przewód miedziany', ok:true}, {t:'Sznurek', ok:false, w:'Sznurek nie przewodzi prądu.'}, {t:'Słomka', ok:false, w:'Plastik nie przewodzi prądu.'} ] },
        { etykieta:'odbiornik', pytanie:'Co ma świecić?', opcje:[
          {t:'Żarówka', ok:true}, {t:'Klocek', ok:false, w:'Klocek nie zamieni prądu w światło.'}, {t:'Nic', ok:false, w:'Bez odbiornika obwód jest zwarty i bateria szybko się zepsuje.'} ] }
      ],
      sukces:'Bateria, przewód i żarówka — kółko zamknięte, prąd płynie, jest światło. Dokładnie tak działa latarka w twoim plecaku.'
    }, (ok)=>{ zalicz(ok?2:0,2); k3(); });

    const k3=()=>pytania(A,{ tytul:'Bateria ma dwie strony', krok:3, ile:ILE,
      wstep:'Na baterii są znaki + i −. To nie ozdoba.',
      lista:[
        { q:'Co znaczą + i − na baterii?', o:['Dwa bieguny, prąd płynie od jednego do drugiego','Że jest nowa','Rozmiar baterii'], a:0,
          w:'Prąd wypływa z plusa i wraca do minusa. Włożysz baterię odwrotnie i urządzenie nie zadziała.' },
        { q:'Gdzie wyrzucasz zużyte baterie?', o:['Do pojemnika na baterie w sklepie lub szkole','Do zwykłego kosza','Do ogniska'], a:0,
          w:'W bateriach są substancje szkodliwe dla wody i gleby. W ogniu potrafią wybuchnąć. Pojemniki stoją w sklepach i szkołach.' },
        { q:'Powerbank to:', o:['Duża bateria do ładowania telefonu','Rodzaj latarki','Radio'], a:0,
          w:'To zapas prądu w kieszeni. W czasie blackoutu naładowany powerbank pozwala zadzwonić po pomoc.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); k4(); });

    const k4=()=>pytania(A,{ tytul:'Zasady bezpieczeństwa', krok:4, ile:ILE,
      wstep:'Prąd z baterii jest bezpieczny. Prąd z gniazdka nie jest.',
      lista:[
        { q:'Co wolno wkładać do gniazdka?', o:['Tylko wtyczkę urządzenia','Nożyczki','Palec'], a:0,
          w:'W gniazdku jest 230 woltów. To napięcie zabija. Do gniazdka wchodzi wyłącznie wtyczka, i to sucha.' },
        { q:'Mokre ręce i urządzenie elektryczne to:', o:['Bardzo zły pomysł','Bez różnicy','Dobry sposób na chłodzenie'], a:0,
          w:'Woda przewodzi prąd. Mokra ręka zamienia bezpieczną sytuację w groźną.' },
        { q:'Widzisz przewód z uszkodzoną osłonką. Co robisz?', o:['Nie dotykam i mówię dorosłemu','Zaklejam taśmą','Sprawdzam palcem, czy działa'], a:0,
          w:'Osłonka to jedyna rzecz, która oddziela cię od prądu. Uszkodzony przewód wymienia dorosły, po odłączeniu zasilania.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); koniec(); });

    k1();
  }

  /* --- wersja dla dorosłych --- */
  else {
    const k1=()=>pytania(A,{ tytul:'Trzy wielkości, które musisz czuć', krok:1, ile:ILE,
      wstep:'Wyobraź sobie rurę z wodą. Napięcie to ciśnienie, prąd to ile wody płynie, opór to zwężenie rury. Cała elektronika użytkowa mieści się w tej analogii.',
      lista:[
        { q:'Napięcie (wolty) odpowiada w tej analogii:', o:['Ciśnieniu, które popycha wodę','Ilości wody na sekundę','Średnicy rury'], a:0,
          w:'Napięcie to różnica potencjałów — siła popychająca ładunki. Bateria 12 V „pcha" mocniej niż paluszek 1,5 V.' },
        { q:'Prąd (ampery) to:', o:['Ile ładunku przepływa w sekundę','Siła popychająca','Opór przewodu'], a:0,
          w:'Amper to ilość przepływu. Urządzenie samo pobiera tyle prądu, ile potrzebuje — zasilacz go nie „wpycha".' },
        { q:'Co się stanie, gdy zwiększysz opór przy stałym napięciu?', o:['Popłynie mniejszy prąd','Popłynie większy prąd','Nic się nie zmieni'], a:0,
          w:'Węższa rura, mniejszy przepływ. To jest prawo Ohma i za chwilę je policzysz.' },
        { q:'Do czego służy bezpiecznik?', o:['Przerywa obwód, gdy prąd przekroczy wartość bezpieczną dla przewodów','Obniża napięcie','Ładuje akumulator'], a:0,
          w:'Bezpiecznik chroni instalację, nie urządzenie. Przepala się celowo, zanim zapali się przewód. Zastąpienie go gwoździem albo grubszym drutem to najprostszy sposób na pożar.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); k2(); });

    const k2=()=>licz(A,{ tytul:'Prawo Ohma', krok:2, ile:ILE,
      zasada:'U = I × R. Napięcie równa się prąd razy opór. Przekształcenia: I = U / R oraz R = U / I.',
      pytanie:'Żarówka samochodowa ma opór <b>24 Ω</b> i pracuje przy napięciu <b>12 V</b>. Jaki prąd przez nią płynie?',
      jednostka:'A', wynik:0.5, tol:0.01,
      podpowiedz:'Szukasz prądu, więc dzielisz napięcie przez opór.',
      rozwiazanie:'I = U / R = 12 / 24 = <b>0,5 A</b>. Ta jedna formuła wystarcza, żeby dobrać przewód, bezpiecznik i ocenić, czy zasilacz wyrobi.'
    }, (bezbledu)=>{ zalicz(bezbledu?1:0,1); k3(); });

    const k3=()=>licz(A,{ tytul:'Ile realnie wytrzyma powerbank', krok:3, ile:ILE,
      zasada:'Pojemność w miliamperogodzinach nie mówi nic, dopóki nie znasz napięcia. Energia w watogodzinach: <b>Wh = (mAh ÷ 1000) × V</b>. Czas pracy: <b>godziny = Wh ÷ moc odbiornika w W</b>. Ogniwa w powerbanku mają 3,7 V, nawet jeśli gniazdo USB daje 5 V.',
      pytanie:'Powerbank <b>20 000 mAh</b> (ogniwa 3,7 V) zasila radio o poborze <b>2 W</b>. Po drodze przetwornica gubi około 20% energii. Ile godzin pogra radio? Podaj z dokładnością do godziny.',
      jednostka:'h', wynik:29, tol:2,
      podpowiedz:'Najpierw energia: 20 × 3,7 = 74 Wh. Potem odejmij 20% strat. Na koniec podziel przez 2 W.',
      rozwiazanie:'20 Ah × 3,7 V = 74 Wh. Po stratach zostaje około 59 Wh. 59 ÷ 2 W ≈ <b>29 godzin</b>. Gdyby liczyć naiwnie „20 000 mAh przy 5 V", wyszłoby 100 Wh i 50 godzin — prawie dwa razy za dużo. Dlatego zapas energii planuje się w watogodzinach, nie w mAh.'
    }, (bezbledu)=>{ zalicz(bezbledu?1:0,1); k4(); });

    const k4=()=>pytania(A,{ tytul:'Szeregowo czy równolegle', krok:4, ile:ILE,
      wstep:'Dwa sposoby łączenia ogniw dają zupełnie różne efekty. Pomyłka kosztuje spalone urządzenie.',
      lista:[
        { q:'Cztery ogniwa 1,5 V połączone szeregowo dają:', o:['6 V, pojemność jak jednego ogniwa','1,5 V, poczwórną pojemność','6 V, poczwórną pojemność'], a:0,
          w:'Szeregowo napięcia się dodają, pojemność zostaje. Tak działa zwykła latarka na cztery paluszki.' },
        { q:'Te same cztery ogniwa połączone równolegle dają:', o:['1,5 V i czterokrotny zapas energii','6 V','Nic, to zwarcie'], a:0,
          w:'Równolegle dodaje się pojemność przy tym samym napięciu. Uwaga: równolegle łączy się wyłącznie ogniwa identyczne i jednakowo naładowane, inaczej silniejsze rozładują się w słabsze.' },
        { q:'Dlaczego dioda LED prawie nigdy nie jest podłączana wprost do baterii?', o:['Bo pobierze prąd aż do spalenia — potrzebuje rezystora ograniczającego','Bo świeci za słabo','Bo wymaga prądu przemiennego'], a:0,
          w:'LED ma bardzo mały opór własny po przekroczeniu napięcia przewodzenia. Bez rezystora prąd rośnie lawinowo i złącze się przepala, czasem po sekundzie.' },
        { q:'Mieszanie starych i nowych baterii w jednym urządzeniu:', o:['Skraca czas pracy i grozi wyciekiem','Nie ma znaczenia','Wydłuża czas pracy'], a:0,
          w:'Słabsze ogniwo zostaje „dociążone" przez mocniejsze, przegrzewa się i wylewa. Wymienia się cały komplet naraz, tej samej marki i typu.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); k5(); });

    const k5=()=>obwod(A,{ tytul:'Zbuduj obwód, który nie spali diody', krok:5, ile:ILE,
      wstep:'Masz zasilanie 9 V i diodę LED. Złóż obwód tak, żeby zaświeciła i przeżyła. Wybierz element w każdym miejscu, potem włącz zasilanie.',
      gniazda:[
        { etykieta:'źródło', pytanie:'Czym zasilić obwód?', opcje:[
          {t:'Bateria 9 V', ok:true},
          {t:'Gniazdko 230 V', ok:false, w:'230 V zamieni diodę w błysk, a ciebie narazi na porażenie. Do eksperymentów używa się wyłącznie niskiego napięcia z baterii.'},
          {t:'Dwa przewody wprost do akumulatora auta', ok:false, w:'Akumulator samochodowy potrafi oddać setki amperów. Przy zwarciu przewód rozgrzewa się do czerwoności w sekundy.'} ] },
        { etykieta:'zabezpieczenie', pytanie:'Co ograniczy prąd?', opcje:[
          {t:'Rezystor 470 Ω', ok:true},
          {t:'Nic, prosto do diody', ok:false, w:'Bez rezystora prąd przez diodę rośnie, aż złącze się przepali. To najczęstszy błąd początkującego.'},
          {t:'Drugi przewód', ok:false, w:'Przewód niczego nie ogranicza — jego opór jest bliski zeru.'} ] },
        { etykieta:'sterowanie', pytanie:'Czym włączać?', opcje:[
          {t:'Wyłącznik w szereg z obwodem', ok:true},
          {t:'Wyłącznik równolegle do diody', ok:false, w:'Wyłącznik równolegle do odbiornika po zamknięciu zwiera diodę i tworzy zwarcie. Sterowanie zawsze wpina się szeregowo.'},
          {t:'Wyjmowanie baterii', ok:false, w:'Zadziała, ale styki baterii szybko się zużyją, a w ciemności trudno trafić. Od tego jest wyłącznik.'} ] },
        { etykieta:'odbiornik', pytanie:'Jak wpiąć diodę?', opcje:[
          {t:'Zgodnie z polaryzacją: dłuższa nóżka do plusa', ok:true},
          {t:'Dowolnie, dioda nie ma kierunku', ok:false, w:'LED to dioda — przewodzi tylko w jedną stronę. Odwrotnie wpięta po prostu nie zaświeci.'},
          {t:'Obie nóżki do plusa', ok:false, w:'Obie nóżki na tym samym potencjale to brak obwodu. Prąd nie ma dokąd płynąć.'} ] }
      ],
      sukces:'Bateria → wyłącznik → rezystor → dioda i z powrotem do minusa. Rezystor 470 Ω przy 9 V i spadku 2 V na diodzie daje około 15 mA — dokładnie tyle, ile LED lubi. Ten sam schemat, tylko z większymi elementami, to każde zasilanie awaryjne, jakie zbudujesz.'
    }, (ok)=>{ zalicz(ok?2:0,2); k6(); });

    const k6=()=>pytania(A,{ tytul:'Bezpieczeństwo i zasilanie awaryjne', krok:6, ile:ILE,
      wstep:'Wiedza, która przydaje się dokładnie wtedy, gdy nie ma prądu.',
      lista:[
        { q:'Akumulator litowo-jonowy spuchł. Co robisz?', o:['Odkładam w miejsce niepalne, nie ładuję, oddaję do punktu zbiórki','Ładuję ostrożnie i obserwuję','Przekłuwam, żeby zszedł gaz'], a:0,
          w:'Spuchnięte ogniwo ma uszkodzony separator. Ładowanie albo przekłucie kończy się pożarem, którego nie gasi się wodą. Do punktu zbiórki, w metalowym pojemniku.' },
        { q:'Do czego służy przetwornica (inwerter) 12 V → 230 V?', o:['Zamienia prąd stały z akumulatora na przemienny sieciowy','Ładuje akumulator z sieci','Obniża napięcie do 5 V'], a:0,
          w:'Inwerter podnosi i zamienia napięcie na sieciowe. W drugą stronę działa prostownik albo ładowarka. Przy inwerterze pilnuj mocy: 300 W to czajnik odpada, ale radio, lampa i ładowarka do telefonu — bez problemu.' },
        { q:'Ładowanie telefonu z gniazda zapalniczki przy zgaszonym silniku:', o:['Rozładowuje akumulator rozruchowy, którym potem nie odpalisz auta','Jest niemożliwe','Nie ma wpływu na akumulator'], a:0,
          w:'Akumulator rozruchowy nie jest zaprojektowany do głębokiego rozładowania. Zejście poniżej około 12 V oznacza, że rano samochód nie ruszy. Ładuj przy pracującym silniku albo z osobnego powerbanku.' },
        { q:'Agregat prądotwórczy w czasie blackoutu ustawiasz:', o:['Na zewnątrz, nigdy w garażu ani w domu','W garażu, żeby nie ukradli','W przedpokoju, blisko gniazdka'], a:0,
          w:'Spaliny zawierają tlenek węgla — bezwonny i śmiertelny. Agregat pracuje wyłącznie na otwartym powietrzu, z dala od okien, a w domu warto mieć czujnik czadu.' },
        { q:'Panel słoneczny 100 W w pochmurny grudniowy dzień w Polsce da w praktyce:', o:['Kilkanaście procent mocy nominalnej','Pełne 100 W','Nic'], a:0,
          w:'Moc nominalna dotyczy pełnego słońca. Zimą, przy zachmurzeniu i niskim słońcu, realnie zostaje kilkanaście procent. Zapas energii planuj na najgorszy, a nie na najlepszy dzień.' }
      ]}, (ok,ile)=>{ zalicz(ok,ile); koniec(); });

    k1();
  }

  function koniec(){
    const proc = maks ? punkty/maks : 0;
    const gw = proc>=.85 ? 3 : proc>=.6 ? 2 : 1;
    A.koniec('elektronika', gw,
      '<p>Wynik: <b>'+punkty+' / '+maks+'</b></p>'
      + '<div class="msg"><b>📌 Zapamiętaj</b><ul>'
      + (KIDS
        ? '<li>Prąd płynie tylko w zamkniętym obwodzie.</li><li>Metal przewodzi, plastik i drewno nie.</li><li>Do gniazdka wchodzi wyłącznie wtyczka.</li><li>Zużyte baterie do pojemnika, nigdy do kosza ani do ognia.</li>'
        : '<li>U = I × R. Z tego jednego wzoru wynika dobór przewodu, bezpiecznika i zasilacza.</li>'
          + '<li>Zapas energii licz w watogodzinach, nie w mAh. Wh = (mAh ÷ 1000) × napięcie ogniw.</li>'
          + '<li>Szeregowo rośnie napięcie, równolegle pojemność. Równolegle tylko ogniwa identyczne.</li>'
          + '<li>Dioda zawsze z rezystorem, wyłącznik zawsze szeregowo.</li>'
          + '<li>Agregat wyłącznie na zewnątrz. Spuchniętego ogniwa nie ładuje się nigdy.</li>')
      + '</ul></div>');
  }
};

})();
