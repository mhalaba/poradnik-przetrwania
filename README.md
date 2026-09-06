# Poradnik przetrwania – szkolenie i gra 3D (strona WWW)

Strona edukacyjna na podstawie książki **„Poradnik przetrwania w sytuacjach kryzysowych”** (Matthew Halaba, Bezdroża / Helion 2026).
Działa w każdej nowoczesnej przeglądarce, bez backendu – to zwykłe pliki HTML/JS/CSS.

## Co jest w środku

| Plik | Opis |
|---|---|
| `index.html` | Strona główna – wybór wersji (dzieci / dorośli), link do sklepu |
| `szkolenie.html` | Szkolenie krok po kroku (17 rozdziałów + wstęp + podsumowanie/aneksy), quizy, certyfikat |
| `gra.html` | Gra 3D „Miasteczko” – 18 misji (Three.js) |
| `assets/content.js` | Treść wersji dla dorosłych (rozdział po rozdziale) |
| `assets/content-kids.js` | Treść wersji dla dzieci (misje, odznaki) |
| `assets/szkolenie.js` | Silnik szkolenia |
| `assets/game.js` | Silnik gry 3D v2: fabuła rodziny Nowaków, questy w świecie 3D (zbieranie, dojście, dialogi z dylematami), mini-gry (pakowanie na czas, syreny, SOS, RKO, oddech 4-7-8), tryb nocny z latarką, deszcz, powódź, wskaźnik spokoju |
| `assets/ads.js` | Konfiguracja Google AdSense |
| `assets/style.css` | Style (motyw dorosły + motyw dziecięcy) |
| `ads.txt` | Plik wymagany przez AdSense |

Adresy:
- Dorośli: `szkolenie.html?wersja=dorosli`, `gra.html?wersja=dorosli`
- Dzieci: `szkolenie.html?wersja=dzieci`, `gra.html?wersja=dzieci`

Postępy (quizy, misje, punkty) zapisują się w przeglądarce użytkownika (localStorage).

## Uruchomienie lokalne

```bash
cd /Users/tas/szkolenie && python3 -m http.server 8765
```

Potem otwórz http://localhost:8765 (gra wymaga uruchomienia przez `http://`, nie przez `file://`, bo ładuje Three.js z CDN).

## Gdzie strona stoi i jak ją aktualizować

Strona działa pod adresem **https://poradnik.punktodpornosci.pl** na **GitHub Pages**, z repozytorium [mhalaba/poradnik-przetrwania](https://github.com/mhalaba/poradnik-przetrwania). Hosting i certyfikat Let's Encrypt są bezpłatne, certyfikat odnawia się sam.

Aktualizacja strony to jedno polecenie:

```bash
git add -A && git commit -m "aktualizacja" && git push
```

Zmiany pojawiają się na żywo po około minucie.

### Jak to jest połączone

- Domena `punktodpornosci.pl` jest utrzymywana w home.pl. Subdomena `poradnik` ma tam cztery rekordy A wskazujące na serwery GitHub Pages: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.
- Plik `CNAME` w repozytorium mówi GitHubowi, pod jaką domeną ma serwować stronę. Nie usuwaj go.
- Wymuszone jest HTTPS, więc adresy `http://` przekierowują na `https://` kodem 301.
- Plik `ads.txt` leży dodatkowo w katalogu głównej strony w home.pl, bo Google czyta go z domeny głównej: `https://punktodpornosci.pl/ads.txt`.
- W home.pl zostały nieużywane kopie plików w katalogu `/public_html/poradnik` oraz subdomena przypisana do serwera. Nie przeszkadzają, bo DNS kieruje ruch na GitHub. Możesz je usunąć, gdy uznasz wdrożenie za stabilne.

### Gdyby trzeba było wrócić na home.pl

Wystarczy w panelu home.pl zmienić cztery rekordy A subdomeny z powrotem na adres 46.242.242.147. Pliki tam czekają.

## Pomiar (analityka)

Cały pomiar przechodzi przez jedną funkcję `window.track(nazwa, dane)` z pliku `assets/analytics.js`. Reszta kodu nie wie, jaki dostawca jest podpięty.

**Podgląd bez konta.** Dopisz `?debug=1` do adresu dowolnej strony. Zdarzenia wypiszą się w konsoli i w małym oknie w rogu ekranu. Przykład: `https://poradnik.punktodpornosci.pl/gra.html?wersja=dzieci&debug=1`

**Google Analytics jest podpięty.** Usługa „Poradnik przetrwania” w koncie halabaeu, identyfikator `G-G61R23XN76`, wpisany w `assets/analytics.js` w polu `ga4`. Raporty: analytics.google.com, zdarzenia widać w podglądzie na żywo po kilku minutach od wejścia na stronę.

**Mierzone zdarzenia**

| Zdarzenie | Kiedy | Najważniejsze dane |
|---|---|---|
| `gra_start` | kliknięcie „Graj” w grze | liczba wcześniej ukończonych misji |
| `misja_start` | rozpoczęcie misji | numer i nazwa misji, czy to powtórka |
| `misja_koniec` | zaliczenie misji | gwiazdki, poziom spokoju, łącznie ukończonych |
| `misja_przerwana` | rezygnacja po nieudanej próbie | numer misji |
| `zobowiazanie` | zaznaczenie planu „jeśli–to” | numer misji |
| `gra_ukonczona` | wszystkie misje zaliczone | gwiazdki, punkty |
| `rozdzial_otwarty` | wejście w rozdział szkolenia | numer i tytuł rozdziału |
| `quiz_zakonczony` | odpowiedź na ostatnie pytanie | wynik, czy zaliczony |
| `certyfikat` | wygenerowanie certyfikatu | liczba ukończonych rozdziałów |
| `powrot` | pierwsza wizyta w nowym dniu | ile dni od pierwszej wizyty, która to wizyta |

Powroty liczone są lokalnie w przeglądarce, bez ciasteczek. Analytics startuje w trybie zgody z odmową przechowywania danych, czyli bez plików cookie. Pole `cookieless` w `assets/analytics.js` przełącza to zachowanie.

## Po edycji plików podbij numer wersji

Odwołania do skryptów mają na końcu `?v=3`. Po każdej zmianie plików w `assets/` podnieś ten numer we wszystkich trzech plikach HTML, na przykład:

```bash
sed -i '' 's/?v=3/?v=4/g' index.html szkolenie.html gra.html
```

Bez tego przeglądarki odwiedzających będą jeszcze przez jakiś czas używać starych, zapisanych w pamięci podręcznej wersji.

## Reklamy Google (AdSense)

Konto jest już podpięte. Identyfikator wydawcy: `ca-pub-1001856704695653`.

Co jest zrobione:
- Skrypt Google znajduje się w sekcji `<head>` wszystkich trzech stron. Tego szuka Google przy weryfikacji witryny.
- Plik `ads.txt` w katalogu głównym zawiera wpis `google.com, pub-1001856704695653, DIRECT, f08c47fec0942fa0`. Musi być dostępny pod adresem `twojadomena.pl/ads.txt`.
- Wersja dla dzieci wysyła wyłącznie reklamy niespersonalizowane i oznaczenie treści kierowanych do dzieci.

Co zostało do zrobienia po Twojej stronie:
1. W panelu AdSense dodaj swoją domenę i poczekaj na zatwierdzenie, zwykle od 1 do 14 dni. Na `localhost` reklamy się nie wyświetlają, to normalne.
2. Włącz reklamy automatyczne, jeśli chcesz, żeby Google samo dobierało miejsca.
3. Jeśli wolisz reklamy w konkretnych, zarezerwowanych miejscach: utwórz trzy jednostki displayowe, skopiuj numery `data-ad-slot` i wpisz je w `assets/ads.js` w polu `slots`. Dopóki pola są puste, zarezerwowane miejsca są ukrywane, żeby nie zostawiać pustych ramek.

**Wersja dla dzieci:** skrypt ustawia flagę `tag_for_child_directed_treatment` (wymóg Google dla treści kierowanych do dzieci – reklamy niespersonalizowane). Zgodnie z polityką AdSense warto dodatkowo w panelu oznaczyć podstrony `?wersja=dzieci` jako treści dla dzieci.

## Link do książki

Wszystkie przyciski „Kup książkę” / „Chcesz wiedzieć więcej?” prowadzą do oficjalnego sklepu Bezdroża:
https://bezdroza.pl/ksiazki/poradnik-przetrwania-w-sytuacjach-kryzysowych-matthew-halaba,bepprz.htm
Adres zmienisz w jednym miejscu: `assets/content.js` → `KSIAZKA.sklep`.

## Edycja treści

Rozdziały to zwykłe obiekty JavaScript w `assets/content.js` (dorośli) i `assets/content-kids.js` (dzieci): tytuł, motto, wprowadzenie, sekcje (kroki), tip autora, ćwiczenie, quiz (`a` = indeks poprawnej odpowiedzi). Gra pobiera stamtąd quizy i podsumowania; mini-gry (pakowanie, kolejności, scenariusze) są w `assets/game.js` w obiektach `PACKS`, `ORDERS` oraz funkcjach `runStayOrGo`, `runFake`, `runRoom`.

## Zastrzeżenie

Materiał edukacyjny; nie zastępuje komunikatów służb ratunkowych. W nagłych wypadkach dzwoń **112**.

## Zasady psychologiczne w grze (v2)

- Model EPPM: zagrożenie zawsze łączone z wykonalnym działaniem; brak ekranu „przegrałeś” – zawsze „spróbuj z podpowiedzią”.
- Samoskuteczność: zadania wykonywane fizycznie w świecie 3D (idź, znajdź, zakręć, zabierz psa), nie tylko klikanie.
- Narracja i relacje: stała rodzina (Ania, Zosia, dziadek Józef, Burek) i sąsiedzi; każda misja pomaga konkretnej osobie.
- Wskaźnik spokoju: złe decyzje podnoszą stres, ćwiczenie oddechu 4-7-8 go obniża; przy niskim spokoju ekran ciemnieje na brzegach.
- Intencje implementacyjne: każda misja kończy się planem „jeśli X, to Y” z dobrowolnym zobowiązaniem (+20 pkt).
- Stopniowanie presji: najpierw rozmowy i wybory, potem zadania na czas, finał – fizyczne „wyjście w 5 minut” w nocy.
- Zadania uczą, a nie odpytują: żadnych pytań o autora ani o książkę. Każda odpowiedź w quizie kończy się wyjaśnieniem, dlaczego tak jest.
- Ćwiczenia rachunkowe: gracz sam liczy zapas wody, drewna, dni terapii lekami i rezerwę gotówkową. Po dwóch próbach dostaje rozpisane rozwiązanie, bo celem jest metoda, nie wynik.
- Samoocena na starcie: pięć pytań o własne przygotowanie, a wynikiem jest osobista lista zadań na tydzień, nie ocena.
- Ćwiczenie budżetowe: zestaw awaryjny za 500 zł (150 zł w wersji dla dzieci) z kolejnością priorytetów z książki i pułapkami w postaci drogiego sprzętu.
- Ćwiczenie rotacji zapasów: wybór produktu według daty ważności (FEFO), z rundą-pułapką, gdzie najstarszy zakup nie jest tym do zjedzenia.
- Misje odblokowują się po kolei (złoty znacznik = następna), postępy zapisują się w przeglądarce.

## Sterowanie w grze

| Czynność | Klawiatura / mysz | Dotyk |
|---|---|---|
| Ruch | WASD lub strzałki | joystick w lewym dolnym rogu |
| Obrót kamery | przeciągnij myszą, Q | przeciągnij jednym palcem |
| Przybliżanie / oddalanie | kółko myszy, klawisze + / − (Z / X), przyciski ＋ − z prawej | szczypanie dwoma palcami |
| Widok domyślny | klawisz 0 lub przycisk ⟲ | przycisk ⟲ |
| Działanie / rozmowa / podniesienie | E lub duży przycisk na dole | duży przycisk na dole |
| Reakcja w ćwiczeniach refleksu | spacja | dotknięcie ekranu |

Kamera jest ustawiona jak w grach survivalowych: wysoko nad postacią, z szerokim kątem widzenia (66°), i sama podjeżdża bliżej, gdy budynek zasłania gracza.

Dodatkowo: minimapa (prawy górny róg na desktopie, prawy dolny na telefonie) pokazuje drogi, rzekę, budynki, cele misji i kierunek patrzenia; podpowiedź sterowania znika po pierwszym ruchu, a przycisk „? Pomoc” przywraca ekran z instrukcją i listą misji.
