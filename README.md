# Poradnik przetrwania — szkolenie i gra 3D

Bezpłatny serwis edukacyjny o przygotowaniu na sytuacje kryzysowe, na podstawie książki
**„Poradnik przetrwania w sytuacjach kryzysowych"** (Matthew Halaba, Bezdroża / Helion 2026).

**→ https://poradnik.punktodpornosci.pl**

Dwie ścieżki nauki tej samej treści: szkolenie krok po kroku i gra 3D, w której zadania wykonuje
się naprawdę — idziesz, szukasz, decydujesz, ćwiczysz refleks i oddech. Każda w wersji dla
dorosłych i dla dzieci. Wszystko działa w przeglądarce, bez logowania i bez serwera: to zwykłe
pliki HTML, CSS i JavaScript. Postępy zapisują się w pamięci przeglądarki gracza.

## Co można robić

| Adres | Co to |
|---|---|
| [`/`](https://poradnik.punktodpornosci.pl/) | strona główna, wybór wersji |
| [`/szkolenie.html?wersja=dorosli`](https://poradnik.punktodpornosci.pl/szkolenie.html?wersja=dorosli) | 19 rozdziałów, quizy, certyfikat |
| [`/szkolenie.html?wersja=dzieci`](https://poradnik.punktodpornosci.pl/szkolenie.html?wersja=dzieci) | 19 misji Małego Strażnika, odznaki |
| [`/gra.html?wersja=dorosli`](https://poradnik.punktodpornosci.pl/gra.html?wersja=dorosli) | gra 3D „Miasteczko", 19 misji |
| [`/gra.html?wersja=dzieci`](https://poradnik.punktodpornosci.pl/gra.html?wersja=dzieci) | ta sama gra, łagodniejsza i kolorowa |
| [`/akademia-112/`](https://poradnik.punktodpornosci.pl/akademia-112/) | osobna gra: pierwsza pomoc, 112, AED |
| [`/akademia-dyszy/`](https://poradnik.punktodpornosci.pl/akademia-dyszy/) | osobna gra: kampus druku 3D |

## Dokumentacja

| Dokument | O czym |
|---|---|
| [`docs/gra.md`](docs/gra.md) | budowa silnika gry: świat, misje, kroki, panele nauki, sterowanie, jak dodać misję |
| [`docs/tresc.md`](docs/tresc.md) | struktura rozdziałów, format quizów, zasady pisania treści |
| [`docs/wdrozenie.md`](docs/wdrozenie.md) | hosting, DNS, pomiar, zgoda RODO, reklamy, uruchomienie lokalne |
| [`CHANGELOG.md`](CHANGELOG.md) | historia zmian wersja po wersji |

## Co jest w środku

| Ścieżka | Opis |
|---|---|
| `index.html` | strona główna |
| `szkolenie.html` | szkolenie: rozdziały, quizy, certyfikat |
| `gra.html` | gra 3D „Miasteczko" |
| `assets/content.js` | treść dla dorosłych + dane książki (`KSIAZKA`) |
| `assets/content-kids.js` | treść dla dzieci |
| `assets/szkolenie.js` | silnik szkolenia |
| `assets/game.js` | silnik gry 3D — cała gra w jednym pliku |
| `assets/stacje.js` | ćwiczenia stacji kompasu i elektroniki, niezależne od silnika misji |
| `assets/analytics.js` | pomiar, zgoda RODO, numer wersji serwisu |
| `assets/ads.js` | jednostki reklamowe AdSense |
| `assets/style.css` | motyw dorosły i dziecięcy |
| `assets/logo.png` | logo serwisu, favikona, logo w oknie zgody |
| `akademia-112/`, `akademia-dyszy/` | dwie osobne gry, każda z własnym README |
| `ads.txt`, `robots.txt`, `sitemap.xml`, `CNAME` | pliki obsługowe — `CNAME` jest niezbędny |

## Jak to jest zrobione

Bez frameworka i bez procesu budowania. Jedyna zewnętrzna biblioteka to **Three.js r128**
wczytywany z CDN w `gra.html`. Miasteczko powstaje proceduralnie przy starcie: tekstury są
rysowane na `<canvas>`, budynki złożone z brył, drzewa i trawa rozsiane przez `InstancedMesh`,
niebo to kopuła z własnym shaderem. Nie ma żadnych plików modeli.

Wdrożenie: **GitHub Pages** + własna domena + bezpłatny certyfikat Let's Encrypt. Publikacja
zmiany to `git push`. Szczegóły — [`docs/wdrozenie.md`](docs/wdrozenie.md).

**Po każdej zmianie w `assets/` podbij numer `?v=` w plikach HTML**, inaczej odwiedzający zobaczą
starą wersję z pamięci podręcznej.

## Uruchomienie lokalne

```bash
python3 -m http.server 8765
```

Potem `http://localhost:8765`. Gra wymaga `http://`, nie `file://`, bo ładuje Three.js z CDN.

## Zasady dydaktyczne

Gra jest zaprojektowana pod psychologię uczenia się, nie pod punkty:

- **Zagrożenie zawsze razem z wykonalnym działaniem** (model EPPM). Nie ma ekranu „przegrałeś" —
  jest „spróbuj jeszcze raz, oto podpowiedź".
- **Poczucie sprawczości**: zadania wykonuje się fizycznie w świecie 3D — idź, znajdź, zakręć,
  zabierz psa — a nie klikając w formularzu.
- **Narracja i relacje**: stała rodzina (Ania, Zosia, dziadek Józef, pies Burek) i sąsiedzi.
  Każda misja pomaga konkretnej osobie.
- **Wskaźnik spokoju**: złe decyzje podnoszą stres, oddech 4-7-8 go obniża. Panika jest kosztem,
  którym da się zarządzać.
- **Intencje implementacyjne**: każda misja kończy się planem „jeśli X, to Y" z dobrowolnym
  zobowiązaniem.
- **Stopniowanie presji**: najpierw rozmowy i wybory, potem zadania na czas, finał to fizyczne
  „wyjście w 5 minut" w nocy.
- **Zadania uczą, a nie odpytują.** Żadnych pytań o autora ani o książkę. Każda odpowiedź
  w quizie kończy się wyjaśnieniem, dlaczego jest właśnie tak.
- **Rachunki robi gracz**: zapas wody, drewna, dni terapii lekami, rezerwa gotówkowa, budżet
  zestawu awaryjnego, rotacja zapasów według dat ważności. Po dwóch próbach pojawia się
  rozpisane rozwiązanie, bo celem jest metoda, nie wynik.
- **Samoocena na starcie**, której wynikiem jest osobista lista zadań na tydzień, a nie ocena.

## Prowadzenie gracza

Wskazówka, dokąd iść, **stoi na ekranie** dopóki gracz nie zacznie misji: numer i nazwa
następnej misji, kierunek świata i odległość w metrach, przeliczana na bieżąco. Wraca po każdej
ukończonej misji. Na mapie cel to pulsująca gwiazdka, a gdy wypada poza zasięg mapki — strzałka
na jej krawędzi. W świecie 3D nad celem obraca się strzałka, a nazwę bieżącej misji widać
ze 170 metrów.

## Sterowanie

| Czynność | Klawiatura i mysz | Dotyk |
|---|---|---|
| Ruch | WASD albo strzałki | joystick w lewym dolnym rogu |
| Obrót kamery | przeciągnij myszą, `Q` | przeciągnij jednym palcem |
| Przybliżanie | kółko myszy, `+` / `−`, przyciski z prawej | szczypanie dwoma palcami |
| Widok domyślny | `0` albo przycisk ⟲ | przycisk ⟲ |
| Działanie, rozmowa, podniesienie | `E` albo przycisk na dole | przycisk na dole |
| Refleks w ćwiczeniach | spacja | dotknięcie ekranu |

Kamera stoi wysoko nad postacią, ma szeroki kąt (66°) i sama podjeżdża bliżej, gdy budynek
zasłania gracza. Minimapa pokazuje drogi, rzekę, budynki, cele misji i kierunek patrzenia.
Przycisk „? Pomoc" przywraca ekran z instrukcją i listą misji.

## Cztery stacje w miasteczku

Poza 19 misjami z książki w miasteczku stoją cztery obiekty. Podchodzisz, wciskasz **E**,
działają w dowolnym momencie i nie przerywają misji — jeśli akurat trwa, ma ona pierwszeństwo.

**Dwie stacje z własnymi ćwiczeniami**, rozgrywanymi na miejscu, bez wychodzenia z miasteczka:

| Stacja | Gdzie | Czego uczy |
|---|---|---|
| 🧭 Stacja kompasu | róża wiatrów, −30 / −50 | budowa kompasu, azymut, azymut powrotny, deklinacja, **marsz na azymut w terenie**, orientacja bez sprzętu |
| ⚡ Warsztat elektroniki | wiata przy stacji energetycznej, −60 / −24 | prawo Ohma, zapas energii w watogodzinach, szeregowo i równolegle, **składanie obwodu**, bezpieczeństwo zasilania awaryjnego |

Treść ćwiczeń leży w [`assets/stacje.js`](assets/stacje.js), osobno od silnika gry.
Wyniki zapisują się niezależnie od misji, stacje można powtarzać, a kolejność odpowiedzi
losuje się za każdym razem.

**Dwie stacje prowadzące do osobnych gier**, obu na tym samym serwerze:

| Obiekt | Gdzie | Dokąd |
|---|---|---|
| 🚑 Karetka | przed punktem medycznym, 50 / 30 | `/akademia-112/` — pierwsza pomoc, 112, AED |
| 🖨️ Hala w kształcie drukarki „OMNI 200" | obok szkoły, 24 / −46 | `/akademia-dyszy/` — kampus druku 3D |

Gracz podchodzi, wciska **E** i dostaje okienko z opisem gry oraz przyciskiem otwierającym ją
w nowej karcie — miasteczko zostaje tam, gdzie było. Obiekty reagują tylko wtedy, gdy nie trwa
misja i gracz nie stoi na znaczniku misji; misja zawsze ma pierwszeństwo.

Adresy ustawia się w jednym miejscu: `assets/game.js`, obiekt `GRY`, pole `url`. Dopóki pole jest
puste, obiekt stoi w miasteczku i mówi, że gra jeszcze nie ruszyła — nikt nie trafia w martwy link.

Źródła: [mhalaba/akademia-112](https://github.com/mhalaba/akademia-112) i
[mhalaba/akademia-dyszy](https://github.com/mhalaba/akademia-dyszy). Szczegóły kopiowania
i budowania opisują README w obu katalogach.

## Książka

Książka jest **tłem, nie reklamą**. W grze wzmianka o niej pojawia się najwyżej raz na 30 minut,
poza tym zostaje atrybucja w stopce stron i na ekranie końcowym. Dane wydania są w jednym
miejscu: `assets/content.js` → `KSIAZKA`.

## Zastrzeżenie

Materiał edukacyjny. Nie zastępuje komunikatów służb ratunkowych ani szkolenia z pierwszej pomocy
na fantomie. W nagłych wypadkach dzwoń **112**.

## Prawa

Treść merytoryczna pochodzi z książki „Poradnik przetrwania w sytuacjach kryzysowych"
Matthew Halaby (Bezdroża, Helion S.A.) i jest wykorzystana za wiedzą autora.
