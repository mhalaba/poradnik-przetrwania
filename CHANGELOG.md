# Historia zmian

Wszystkie istotne zmiany w serwisie **Poradnik przetrwania – szkolenie i gra 3D**.
Format oparty na [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/).
Numer bieżącej wersji siedzi w `assets/analytics.js` (`window.WERSJA_SERWISU`), widać go
na ekranie powitalnym gry i leci z każdym zdarzeniem pomiaru jako parametr `wydanie`.

---

## [1.3.0] – 7 września 2026

Pierwsze poprawki po testach z prawdziwym graczem. Gracz zgubił się w miasteczku, nie zdążył
przeczytać pierwszej wskazówki i potknął się o kilka niejasnych sformułowań.

### Naprawione — błąd merytoryczny

- **Syreny alarmowe: rozdział 1 zaprzeczał rozdziałowi 6.** Rozdział 1 twierdził, że
  trzyminutowy dźwięk *ciągły* ogłasza alarm powietrzny, a rozdział 6 i minigra w grze mówiły
  odwrotnie. Quiz w rozdziale 1 nagradzał złą odpowiedź. Ujednolicone zgodnie ze stanem
  faktycznym: dźwięk **modulowany** (falujący) przez 3 minuty **ogłasza** alarm, dźwięk
  **ciągły** (jednostajny) przez 3 minuty **odwołuje** alarm.

### Dodane

- **Trwała wskazówka nawigacyjna.** Zamiast komunikatu, który znikał po kilku sekundach,
  na ekranie stoi cel: numer i nazwa następnej misji, kierunek świata i odległość w metrach.
  Odległość przelicza się na bieżąco, a po wejściu w strefę znacznika tekst zmienia się
  w „Jesteś na miejscu – wciśnij E". Wskazówka wraca po każdej ukończonej misji.
- **Cel widoczny na mapie.** Bieżąca misja to pulsująca gwiazdka zamiast bladej kropki.
  Gdy cel jest poza zasięgiem minimapy, na jej krawędzi pojawia się strzałka kierunkowa.
- **Strzałka 3D nad znacznikiem** bieżącej misji, obracająca się i unosząca.
- Nazwa bieżącej misji czytelna ze 170 m zamiast z 46 m.
- Numer wersji serwisu na ekranie powitalnym gry, z odnośnikiem do tej historii zmian.
- Parametr `wydanie` w każdym zdarzeniu pomiaru.

### Zmienione

- **Książka zeszła do tła.** Blok po każdej misji nazywał się „Z książki – rozdział X",
  wracał za każdym razem i czytał się jak reklama. Teraz nazywa się „Zapamiętaj z tej misji"
  i zawiera samą treść do zapamiętania. Wzmianka o książce dopisuje się pod nim najwyżej
  **raz na 30 minut**. Tytuł zniknął też z ekranu powitalnego.
- **Matryca ryzyka** zamiast mglistego polecenia „ułóż od najpilniejszego" tłumaczy zadanie:
  oceń prawdopodobieństwo (P) i skalę skutków dla rodziny (S) w skali 1–5, uszereguj po P × S.
  Każda pozycja ma uzasadnienie liczb.
- **Program 1 Polskiego Radia** z częstotliwością: fale długie 225 kHz, nadajnik Solec
  Kujawski, plus zachęta do zapisania własnej częstotliwości UKF.
- Spolszczone „Safe word z szablonu Family Emergency Plan".
- Rozwinięty skrót „plan łączności PACE" (podstawowy, zapasowy, awaryjny, ostateczny).
- „dokumenty i media" → „dokumenty i zakręcenie mediów (gaz, woda, prąd)".
- „nienudne pudełko" → „pudełko z zabawkami", z wyjaśnieniem w treści szkolenia.

### Naprawione

- **Ucinane nazwy misji.** Etykiety rysowały się na tabliczce o stałej szerokości, więc dłuższe
  nazwy wychodziły poza nią z obu stron — „Schronienie – pokój bezpieczeństwa" wyświetlało się
  jako „ronienie-pokoj bezpie", bez numeru misji. Tabliczka najpierw zmniejsza pismo, potem
  poszerza się do treści.

---

## [1.2.0] – 6 września 2026

Dwie osobne gry wjeżdżają do miasteczka jako budynki, a nie jako linki na zewnątrz.

### Dodane

- **Karetka przed punktem medycznym** (współrzędne 50 / 30) prowadzi do **Akademii 112** –
  gry o pierwszej pomocy, numerze 112 i AED. Gra leży w katalogu `akademia-112/` i działa
  pod `/akademia-112/` na tym samym certyfikacie co poradnik.
- **Hala w kształcie drukarki 3D „OMNI 200"** obok szkoły (24 / −46) prowadzi do
  **Akademii Dyszy** – gry-kampusu o druku 3D. Katalog `akademia-dyszy/`, adres
  `/akademia-dyszy/`. Repozytorium źródłowe to aplikacja z serwerem i bazą, więc powstał
  osobny statyczny build bez routera, logowania i serwera – sama gra ich nie potrzebowała.
- Zdarzenie pomiaru `dodatkowa_gra`.
- Logo serwisu (tarcza z punktem odporności) jako favikona wszystkich stron.

### Zmienione

- Obiekty reagują tylko wtedy, gdy nie trwa misja i gracz nie stoi na znaczniku misji.
  Sterowanie gry pozostało nietknięte.

---

## [1.1.0] – 6 września 2026

Pomiar i zgoda na ciasteczka.

### Dodane

- **Warstwa pomiaru** niezależna od dostawcy: cały kod woła wyłącznie `window.track()`.
  Google Analytics 4, usługa „Poradnik przetrwania", identyfikator `G-G61R23XN76`.
- Zdarzenia: `gra_start`, `misja_start`, `misja_koniec`, `misja_przerwana`, `zobowiazanie`,
  `gra_ukonczona`, `rozdzial_otwarty`, `quiz_zakonczony`, `certyfikat`, `powrot`.
- **Podgląd bez konta**: `?debug=1` wypisuje zdarzenia w konsoli i w okienku na ekranie.
  Ten sam przełącznik kieruje zdarzenia do DebugView w Analytics.
- **Własny baner zgody RODO.** Komunikat Google z panelu AdSense pojawi się dopiero po
  zatwierdzeniu konta wydawcy, a do tego czasu nikt nie miałby jak wyrazić zgody i Analytics
  zbierałby wyłącznie dane zbiorcze. Baner ustępuje miejsca komunikatowi Google, gdy ten
  zacznie działać. Odmowa ma ten sam rozmiar i kontrast co zgoda.
- Link „Ustawienia prywatności" na każdej stronie, w grze jako pigułka „🔒 Prywatność".
- Komunikat zgody Google skonfigurowany i opublikowany w AdSense (polski, przycisk odmowy
  włączony we wszystkich krajach).

### Zmienione

- **Mniej promocji książki.** Przyciski „Kup książkę" usunięte ze stron i z gry, zostaje
  atrybucja w stopce i na ekranie końcowym.
- Wersja dla dzieci wysyła wyłącznie reklamy niespersonalizowane, także po wyrażeniu zgody.

---

## [1.0.0] – 5 września 2026

Pierwsza działająca wersja: szkolenie i gra 3D, dwie wersje wiekowe, wdrożenie.

### Dodane

- **Szkolenie krok po kroku**, 19 rozdziałów na podstawie książki „Poradnik przetrwania
  w sytuacjach kryzysowych" (Matthew Halaba, Bezdroża / Helion 2026): od analizy ryzyka,
  przez zapasy, syreny, ewakuację, blackout i powódź, aż po odbudowę. Quiz po każdym
  rozdziale, certyfikat na koniec, postępy w pamięci przeglądarki.
- **Gra 3D „Miasteczko"** (Three.js) z fabułą rodziny Nowaków: 19 misji wykonywanych
  w świecie 3D, a nie w formularzu. Zbieranie przedmiotów, dojścia, dialogi z dylematami,
  minigry (pakowanie na czas, rozpoznawanie syren, SOS, RKO, oddech 4-7-8), tryb nocny
  z latarką, deszcz, powódź, wskaźnik spokoju.
- **Dwie wersje wiekowe**: dla dorosłych i dla dzieci (odznaki, łagodniejsze scenariusze,
  inny motyw graficzny).
- Reklamy Google AdSense, plik `ads.txt`.
- Wdrożenie na GitHub Pages pod `poradnik.punktodpornosci.pl`, bezpłatny certyfikat
  Let's Encrypt, wymuszone HTTPS.

### Naprawione w trakcie pierwszego dnia

- Gra renderowała się w rogu ekranu na ekranach Retina: `renderer.setSize()` z trzecim
  argumentem `false` zostawiał rozmiar CSS równy rozmiarowi bufora, więc przy dpr=2 widać
  było tylko lewą górną ćwiartkę.
- Etykiety zasłaniały świat – doszło wygaszanie zależne od odległości.
- Przeglądarki serwowały stare skrypty z pamięci podręcznej – doszedł numer `?v=` przy
  każdym odwołaniu do plików w `assets/`.
