/* Silnik szkolenia: rozdział po rozdziale, quizy, postępy w localStorage */
(function(){
  const params = new URLSearchParams(location.search);
  const wersja = params.get('wersja') === 'dzieci' ? 'dzieci' : 'dorosli';
  const kids = wersja === 'dzieci';
  if (kids) document.body.classList.add('kids');
  const DATA = kids ? window.ROZDZIALY_DZIECI : window.ROZDZIALY;
  const KEY = 'pp_progress_' + wersja;
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ progress = {}; }
  let idx = Math.min(parseInt(params.get('r') || '0', 10) || 0, DATA.length - 1);

  const $ = s => document.querySelector(s);
  document.querySelectorAll('.buy').forEach(a => a.href = KSIAZKA.sklep);
  $('#switchVer').href = 'szkolenie.html?wersja=' + (kids ? 'dorosli' : 'dzieci');
  $('#switchVer').textContent = kids ? '🧭 Wersja dla dorosłych' : '🧒 Wersja dla dzieci';
  $('#toGame').href = 'gra.html?wersja=' + wersja;
  $('#verTitle').textContent = kids ? '⭐ Misje Małego Strażnika' : '📚 Szkolenie dla dorosłych';
  document.title = (kids ? 'Misje dla dzieci' : 'Szkolenie dla dorosłych') + ' – Poradnik przetrwania';

  const TR = (n,d) => { try { (window.track||function(){})(n, d||{}); } catch(e){} };
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch(e){} }
  function doneCount(){ return DATA.filter(c => progress[c.id] && progress[c.id].done).length; }

  function renderToc(){
    const toc = $('#toc'); toc.innerHTML = '';
    DATA.forEach((c, i) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '?wersja=' + wersja + '&r=' + i;
      a.className = (i === idx ? 'active ' : '') + (progress[c.id] && progress[c.id].done ? 'done' : '');
      a.innerHTML = '<span class="num">' + (kids ? (c.odznaka || i) : i) + '</span><span>' + c.tytul + '</span>';
      a.onclick = e => { e.preventDefault(); idx = i; render(); window.scrollTo({top:0,behavior:'smooth'}); };
      li.appendChild(a); toc.appendChild(li);
    });
    const d = doneCount();
    $('#progBar').style.width = Math.round(d / DATA.length * 100) + '%';
    $('#progText').textContent = d + ' / ' + DATA.length + (kids ? ' misji ukończonych' : ' rozdziałów ukończonych');
    const b = $('#badges'); b.innerHTML = '';
    if (kids) DATA.forEach(c => { if (progress[c.id] && progress[c.id].done) { const s = document.createElement('span'); s.className='badge'; s.title=c.tytul; s.textContent = c.odznaka; b.appendChild(s);} });
  }

  function render(){
    const c = DATA[idx];
    TR('rozdzial_otwarty', { rozdzial_id: c.id, rozdzial: c.tytul });
    history.replaceState(null, '', '?wersja=' + wersja + '&r=' + idx);
    const el = $('#chapter');
    let html = '';
    html += '<div class="nr">' + c.nr + (kids ? ' · odznaka ' + c.odznaka : '') + '</div>';
    html += '<h1>' + c.tytul + '</h1>';
    if (kids) {
      html += '<div class="kid-intro"><div class="kids-emoji">' + c.emoji + '</div><p class="intro">' + c.intro + '</p></div>';
      html += '<div class="steps"><div class="step"><h3>Co musisz wiedzieć</h3><ul>' + c.punkty.map(p => '<li>' + p + '</li>').join('') + '</ul></div></div>';
      html += '<div class="exercise"><b>🎲 Zabawa z rodzicami:</b> ' + c.zabawa + '</div>';
    } else {
      if (c.motto) html += '<div class="motto">' + c.motto + '</div>';
      html += '<p class="intro">' + c.intro + '</p>';
      html += '<div class="steps">' + c.sekcje.map(s => '<div class="step"><h3>' + s.t + '</h3><ul>' + s.p.map(p => '<li>' + p + '</li>').join('') + '</ul></div>').join('') + '</div>';
      if (c.tip) html += '<div class="tip"><b>💡 Tip autora / relacja:</b> ' + c.tip + '</div>';
      if (c.cwiczenie) html += '<div class="exercise"><b>🧪 Ćwiczenie i plan działania:</b> ' + c.cwiczenie + '</div>';
    }
    // quiz
    html += '<div class="quiz"><h2>' + (kids ? '⭐ Sprawdź się i zdobądź odznakę' : '✅ Quiz sprawdzający') + '</h2>';
    c.quiz.forEach((q, qi) => {
      html += '<div class="qitem" data-q="' + qi + '"><div class="q">' + (qi+1) + '. ' + q.q + '</div>';
      q.o.forEach((o, oi) => html += '<button class="opt" data-q="' + qi + '" data-o="' + oi + '">' + o + '</button>');
      html += '</div>';
    });
    html += '<div class="result" id="qres"></div></div>';
    html += '<div class="navbtns"><button class="btn ghost" id="prevBtn"' + (idx === 0 ? ' disabled' : '') + '>← Poprzedni</button><button class="btn primary" id="nextBtn">' + (idx === DATA.length - 1 ? '🏁 Zakończ' : 'Następny →') + '</button></div>';
    el.innerHTML = html;

    const answers = {};
    const total = c.quiz.length;
    el.querySelectorAll('.opt').forEach(btn => btn.onclick = () => {
      const qi = +btn.dataset.q, oi = +btn.dataset.o;
      if (answers[qi] !== undefined) return;
      answers[qi] = oi;
      const ok = oi === c.quiz[qi].a;
      btn.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) el.querySelector('.opt[data-q="' + qi + '"][data-o="' + c.quiz[qi].a + '"]').classList.add('correct');
      const wyj = c.quiz[qi].w;
      if (wyj) { const d = document.createElement('div'); d.style.cssText = 'margin:8px 0 0;padding:10px 14px;border-radius:10px;background:var(--card2);border-left:4px solid ' + (ok ? 'var(--ok)' : 'var(--accent)'); d.innerHTML = '<b>' + (ok ? '✅ Dobrze. ' : '💡 Zapamiętaj: ') + '</b>' + wyj; el.querySelector('.qitem[data-q="' + qi + '"]').appendChild(d); }
      const answered = Object.keys(answers).length;
      if (answered === total) {
        const score = Object.keys(answers).filter(k => answers[k] === c.quiz[k].a).length;
        const pass = score >= Math.ceil(total * 0.6);
        $('#qres').innerHTML = (pass ? '🎉 ' : '🙂 ') + 'Wynik: ' + score + ' / ' + total + (pass ? (kids ? ' – odznaka ' + c.odznaka + ' zdobyta!' : ' – rozdział zaliczony!') : ' – przeczytaj jeszcze raz i spróbuj ponownie. <button class="btn sm ghost" id="retry">Spróbuj ponownie</button>');
        TR('quiz_zakonczony', { rozdzial_id: c.id, wynik: score, z: total, zaliczony: pass });
        if (pass) { progress[c.id] = { done: true, score, total }; save(); renderToc(); }
        const r = $('#retry'); if (r) r.onclick = () => render();
      }
    });
    $('#prevBtn').onclick = () => { idx = Math.max(0, idx - 1); render(); window.scrollTo({top:0,behavior:'smooth'}); };
    $('#nextBtn').onclick = () => {
      if (idx === DATA.length - 1) { finish(); return; }
      idx++; render(); window.scrollTo({top:0,behavior:'smooth'});
    };
    renderToc();
    if (window.renderAds) window.renderAds();
  }

  function finish(){
    const d = doneCount();
    TR('certyfikat', { ukonczone: d, wszystkich: DATA.length });
    const el = $('#chapter');
    const name = (prompt(kids ? 'Jak masz na imię, Strażniku?' : 'Podaj imię i nazwisko do certyfikatu:') || '').trim() || (kids ? 'Mały Strażnik' : 'Uczestnik');
    el.innerHTML = '<div class="cert">' +
      '<div style="font-size:3rem">' + (kids ? '🏆' : '🎓') + '</div>' +
      '<h2>' + (kids ? 'Certyfikat Małego Strażnika Bezpieczeństwa' : 'Certyfikat ukończenia szkolenia') + '</h2>' +
      '<p style="font-size:1.3rem"><b>' + name.replace(/</g,'&lt;') + '</b></p>' +
      '<p>' + (kids ? 'ukończył(a) ' + d + ' z ' + DATA.length + ' misji' : 'ukończył(a) ' + d + ' z ' + DATA.length + ' rozdziałów szkolenia') + ' na podstawie książki<br>„' + KSIAZKA.tytul + '” – ' + KSIAZKA.autor + '</p>' +
      (kids ? '<div class="badges" style="justify-content:center">' + DATA.filter(c=>progress[c.id]&&progress[c.id].done).map(c=>'<span class="badge">'+c.odznaka+'</span>').join('') + '</div>' : '') +
      '<p class="small">Data: ' + new Date().toLocaleDateString('pl-PL') + '</p>' +
      '<div class="navbtns" style="justify-content:center"><button class="btn primary" onclick="window.print()">🖨️ Drukuj</button><a class="btn ghost" href="gra.html?wersja=' + wersja + '">🎮 Zagraj w grę 3D</a></div>' +
      (d < DATA.length ? '<p class="small">Nie wszystkie rozdziały zaliczone – wróć do spisu po lewej i uzupełnij quizy.</p>' : '') +
      '</div>';
    window.scrollTo({top:0,behavior:'smooth'});
  }

  $('#resetBtn').onclick = () => { if (confirm('Wyczyścić zapisane postępy?')) { progress = {}; save(); render(); } };
  render();
})();
