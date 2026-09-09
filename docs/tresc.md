# Treść szkolenia – jak ją edytować

Cała treść merytoryczna siedzi w dwóch plikach i nie wymaga dotykania kodu gry:

| Plik | Co zawiera |
|---|---|
| [`assets/content.js`](../assets/content.js) | `window.ROZDZIALY` – 19 rozdziałów dla dorosłych (id 0–18) |
| [`assets/content-kids.js`](../assets/content-kids.js) | `window.ROZDZIALY_DZIECI` – te same 19 tematów dla dzieci |

Numery `id` w obu plikach muszą się zgadzać ze sobą **i** z `id` misji w `assets/game.js`,
bo gra bierze z nich tytuł rozdziału i treść podsumowania po ukończeniu misji.

## Rozdział dla dorosłych

```js
{
  id: 1,
  nr: "Rozdział 1",
  tytul: "Analiza ryzyka i ocena zagrożeń",
  motto: "Zanim kupisz latarkę, zadaj sobie jedno pytanie: czego naprawdę się obawiam?",
  intro: "Akapit wprowadzający, dwa–cztery zdania.",
  sekcje: [
    { t: "Nagłówek sekcji", p: ["Punkt pierwszy.", "Punkt drugi."] }
  ],
  tip: "Uwaga praktyczna albo relacja autora.",
  cwiczenie: "Konkretne zadanie do wykonania w tym tygodniu.",
  quiz: [
    { q: "Treść pytania?",
      o: ["Odpowiedź A", "Odpowiedź B", "Odpowiedź C"],
      a: 0,
      w: "Wyjaśnienie pokazywane po odpowiedzi – i po dobrej, i po złej." }
  ]
}
```

Pola `motto`, `tip` i `cwiczenie` są opcjonalne. `a` to indeks poprawnej odpowiedzi, liczony
od zera. Pole `w` (wyjaśnienie) jest technicznie opcjonalne, ale **pisz je zawsze** — quiz bez
wyjaśnienia sprawdza pamięć zamiast uczyć.

## Rozdział dla dzieci

```js
{
  id: 1,
  nr: "Misja 1",
  tytul: "Detektyw zagrożeń",
  odznaka: "🔍",
  emoji: "🗺️",
  intro: "Krótkie wprowadzenie prostym językiem.",
  punkty: ["Co musisz wiedzieć – zdanie pierwsze.", "Zdanie drugie."],
  zabawa: "Zabawa do zrobienia z rodzicami.",
  quiz: [ /* jak wyżej */ ]
}
```

`odznaka` to emoji zbierane na pasku postępu i na certyfikacie.

## Zasady pisania

Kilka reguł, które wyszły z testów z graczami:

- **Nie zostawiaj skrótów bez rozwinięcia.** „Plan łączności PACE" albo „Safe word z szablonu
  Family Emergency Plan" wyglądają fachowo, a czytelnik nie wie, o co chodzi. Rozwiń przy
  pierwszym użyciu albo napisz po polsku.
- **Nazwa musi mówić, czym rzecz jest.** „Nienudne pudełko" nikomu nic nie mówi; „pudełko na
  nudę: kredki, karty, zabawki sensoryczne" mówi wszystko.
- **Pisz wprost, co się zaczyna, a co kończy.** Przy sygnałach alarmowych czy procedurach
  nie wystarczy wymienić wariantów — czytelnik musi wiedzieć, który oznacza „chowaj się",
  a który „już po wszystkim".
- **Polecenia w zadaniach muszą zawierać kryterium.** „Ułóż od najpilniejszego" jest puste.
  „Oceń prawdopodobieństwo (P) i skalę skutków (S) w skali 1–5, uszereguj po P × S" da się wykonać.
- **Sprawdzaj spójność między rozdziałami.** Rozdział 1 potrafił zaprzeczać rozdziałowi 6 —
  ten sam fakt opisany dwa razy to dwa miejsca do pomylenia.
- **Krótkie zdania.** Wersja dla dzieci: jedno zdanie, jedna myśl.

## Książka

Dane wydania są w jednym miejscu, na górze `assets/content.js`:

```js
window.KSIAZKA = {
  tytul: "Poradnik przetrwania w sytuacjach kryzysowych",
  autor: "Matthew Halaba",
  sklep: "https://bezdroza.pl/ksiazki/…",
  opinie: "https://bezdroza.pl/user/opinie/bepprz",
  wydawca: "Bezdroża (Helion S.A.)"
};
```

Książka jest **tłem, nie reklamą**. W grze wzmianka o niej pojawia się najwyżej raz na
30 minut (`wzmiankaOksiazce()` w `assets/game.js`), poza tym zostaje atrybucja w stopce stron
i na ekranie końcowym. Jeśli dokładasz nowe miejsce, w którym pada tytuł, przemyśl to dwa razy —
gracze testowi zgłaszali, że powtarzana wzmianka wprowadza zamieszanie.

## Po edycji

Podbij numer wersji zasobów, inaczej odwiedzający zobaczą starą treść z pamięci podręcznej:

```bash
sed -i '' 's/?v=19/?v=20/g' index.html szkolenie.html gra.html akademia-112/index.html akademia-dyszy/index.html
```

Potem zwykłe `git add -A && git commit && git push` — szczegóły w
[dokumentacji wdrożenia](wdrozenie.md).
