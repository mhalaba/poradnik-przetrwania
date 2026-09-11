# Wdrożenie, pomiar, zgoda i reklamy

## Gdzie strona stoi

Serwis działa pod adresem **https://poradnik.punktodpornosci.pl** na **GitHub Pages**,
z repozytorium [mhalaba/poradnik-przetrwania](https://github.com/mhalaba/poradnik-przetrwania).
Hosting i certyfikat Let's Encrypt są bezpłatne, certyfikat odnawia się sam, HTTPS jest wymuszone
(adresy `http://` przekierowują kodem 301).

Aktualizacja to jedno polecenie:

```bash
git add -A && git commit -m "opis zmiany" && git push
```

Zmiany pojawiają się na żywo po około minucie.

### Jak to jest połączone

- Domena `punktodpornosci.pl` jest utrzymywana w home.pl. Subdomena `poradnik` ma tam cztery
  rekordy A wskazujące na serwery GitHub Pages: `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153`.
- Plik `CNAME` w repozytorium mówi GitHubowi, pod jaką domeną ma serwować stronę.
  **Nie usuwaj go** — bez niego Pages przestaje odpowiadać na własnej domenie.
- Plik `ads.txt` leży dodatkowo w katalogu głównej strony w home.pl, bo Google czyta go
  z domeny głównej: `https://punktodpornosci.pl/ads.txt`.
- W home.pl zostały nieużywane kopie plików w katalogu `/public_html/poradnik` oraz subdomena
  przypisana do serwera. Nie przeszkadzają, bo DNS kieruje ruch na GitHub.

### Gdyby trzeba było wrócić na home.pl

W panelu home.pl zmień cztery rekordy A subdomeny z powrotem na `46.242.242.147`. Pliki tam czekają.

## Po edycji plików podbij numer wersji

Odwołania do plików w `assets/` mają na końcu `?v=` i numer (obecnie `?v=20`). Po każdej zmianie
w `assets/` podnieś ten numer we wszystkich plikach HTML:

```bash
sed -i '' 's/?v=20/?v=21/g' index.html szkolenie.html gra.html akademia-112/index.html akademia-dyszy/index.html
```

Bez tego przeglądarki odwiedzających będą jeszcze przez jakiś czas używać starych wersji
z pamięci podręcznej.

## Pomiar

Cały pomiar przechodzi przez jedną funkcję `window.track(nazwa, dane)` z pliku
[`assets/analytics.js`](../assets/analytics.js). Reszta kodu nie wie, jaki dostawca jest podpięty —
wymiana Analytics na cokolwiek innego to zmiana w jednym pliku.

**Google Analytics 4** – usługa „Poradnik przetrwania" w koncie `halabaeu`, identyfikator
`G-G61R23XN76`, wpisany w polu `ga4`.

**Podgląd bez konta.** Dopisz `?debug=1` do adresu dowolnej strony. Zdarzenia wypiszą się
w konsoli i w małym oknie w rogu ekranu, a dodatkowo trafią do widoku DebugView w Analytics.
Przykład: `https://poradnik.punktodpornosci.pl/gra.html?wersja=dzieci&debug=1`

### Mierzone zdarzenia

| Zdarzenie | Kiedy | Najważniejsze dane |
|---|---|---|
| `gra_start` | kliknięcie „Graj" | liczba wcześniej ukończonych misji |
| `misja_start` | rozpoczęcie misji | numer i nazwa misji, czy to powtórka |
| `misja_koniec` | zaliczenie misji | gwiazdki, poziom spokoju, łącznie ukończonych |
| `misja_przerwana` | rezygnacja po nieudanej próbie | numer misji |
| `zobowiazanie` | zaznaczenie planu „jeśli–to" | numer misji |
| `gra_ukonczona` | wszystkie misje zaliczone | gwiazdki, punkty |
| `dodatkowa_gra` | podejście do dowolnej z pięciu stacji | która stacja, czy jest dostępna |
| `stacja_koniec` | ukończenie stacji z własnym ćwiczeniem | nazwa stacji, gwiazdki, czy pierwsze przejście |
| `rozdzial_otwarty` | wejście w rozdział szkolenia | numer i tytuł rozdziału |
| `quiz_zakonczony` | odpowiedź na ostatnie pytanie | wynik, czy zaliczony |
| `certyfikat` | wygenerowanie certyfikatu | liczba ukończonych rozdziałów |
| `zgoda` | decyzja w banerze zgody | `tak` albo `nie` |
| `powrot` | pierwsza wizyta w nowym dniu | ile dni od pierwszej wizyty, która to wizyta |

Do każdego zdarzenia dokładane są automatycznie: `wersja` (dorośli / dzieci), `strona`
i `wydanie` (numer wersji serwisu z `window.WERSJA_SERWISU`).

Powroty liczone są lokalnie w przeglądarce, bez ciasteczek.

## Zgoda na ciasteczka (RODO)

Analytics startuje w trybie zgody Google z **odmową** przechowywania danych — działa wtedy bez
plików cookie i bez rozpoznawania użytkownika między wizytami. Dopiero decyzja gracza to zmienia.

### Własny baner

Pyta baner z `assets/analytics.js`. Zapisuje decyzję w `localStorage` pod kluczem `pp_zgoda`
(nie w ciasteczku) i wysyła `gtag('consent','update')`. Odmowa ma ten sam rozmiar i kontrast
co zgoda. W wersji dla dzieci nawet po zgodzie zostają wyłączone `ad_user_data`
i `ad_personalization`.

Baner istnieje, bo komunikat Google z panelu AdSense zacznie się wyświetlać dopiero po
zatwierdzeniu konta wydawcy. Do tego czasu nikt nie miałby jak wyrazić zgody, a Analytics
zbierałby wyłącznie dane zbiorcze. Przed pokazaniem się baner czeka 2,5 sekundy i sprawdza,
czy komunikat Google się nie pojawił — gdy AdSense zatwierdzi konto, wystarczy nic nie robić.

### Komunikat Google

W AdSense → Prywatność i wiadomości → Przepisy europejskie stoi opublikowana wiadomość
**„Zgoda RODO – punktodpornosci.pl"**: język domyślny polski, dodatkowo angielski, przycisk
„Nie wyrażam zgody" włączony we wszystkich krajach, logo `assets/logo.png`, polityka prywatności
pod `https://punktodpornosci.pl/prywatnosc`.

### Link do zmiany decyzji

Na każdej stronie jest „Ustawienia prywatności" (w grze pigułka „🔒 Prywatność"), która otwiera
okno zgody ponownie: komunikat Google, jeśli działa, w przeciwnym razie własny baner.

### Do zrobienia po stronie serwisu głównego

Strona `punktodpornosci.pl/prywatnosc` twierdzi, że serwis nie używa cookies do analityki ani
reklamy. Dla subdomeny `poradnik.` to już nieprawda i tekst wymaga poprawki.

## Reklamy Google (AdSense)

Identyfikator wydawcy: `ca-pub-1001856704695653`.

Co jest zrobione:

- Skrypt Google w sekcji `<head>` wszystkich stron — tego szuka Google przy weryfikacji witryny.
- `ads.txt` w katalogu głównym z wpisem
  `google.com, pub-1001856704695653, DIRECT, f08c47fec0942fa0`, dostępny także z domeny głównej.
- Wersja dla dzieci wysyła wyłącznie reklamy niespersonalizowane i oznaczenie treści kierowanych
  do dzieci (`tag_for_child_directed_treatment`).

Co zostało:

1. Witryna `punktodpornosci.pl` ma w AdSense status **Requires review** — do czasu przeglądu
   reklamy się nie pojawią, a komunikat zgody Google nie wystartuje.
2. Reklamy automatyczne albo trzy jednostki displayowe wpisane w `assets/ads.js` w polu `slots`.
   Dopóki pola są puste, zarezerwowane miejsca są ukrywane, żeby nie zostawiać pustych ramek.

## Uruchomienie lokalne

```bash
cd /Users/tas/szkolenie && python3 -m http.server 8765
```

Potem `http://localhost:8765`. Gra wymaga protokołu `http://`, nie `file://`, bo ładuje Three.js
z CDN. Reklam na `localhost` Google nie wyświetla i to jest normalne.
