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

## Wdrożenie na poradnik.punktodpornosci.pl (home.pl)

Domena `punktodpornosci.pl` jest utrzymywana w home.pl (serwery nazw `dns.home.pl`), a subdomena `poradnik` już rozwiązuje się na ten sam adres IP. Brakuje tylko konfiguracji po stronie serwera.

1. **Utwórz subdomenę.** Panel home.pl → Domeny → `punktodpornosci.pl` → Subdomeny → dodaj `poradnik` i wskaż nowy katalog, na przykład `/poradnik`.
2. **Wystaw certyfikat SSL.** W panelu włącz bezpłatny certyfikat dla `poradnik.punktodpornosci.pl` i wymuś przekierowanie na HTTPS. Bez tego przeglądarki pokażą ostrzeżenie, a AdSense nie wyświetli reklam.
3. **Wgraj pliki.** Przez FTP lub menedżer plików skopiuj całą zawartość tego katalogu do katalogu subdomeny: `index.html`, `szkolenie.html`, `gra.html`, `og.png`, `robots.txt`, `sitemap.xml`, `ads.txt` i cały folder `assets`.
4. **Skopiuj `ads.txt` także do katalogu głównego domeny.** To ważne: Google czyta plik `ads.txt` z domeny głównej, czyli z `https://punktodpornosci.pl/ads.txt`, a nie z subdomeny. Dziś ten adres zwraca błąd 404. Jeśli w przyszłości podepniesz AdSense również do strony głównej, dopisuj kolejne linie zamiast nadpisywać plik.
5. **Sprawdź trzy adresy** po wgraniu: strona główna, `/ads.txt` na domenie głównej i `/sitemap.xml` na subdomenie.
6. **Zgłoś witrynę.** W AdSense dodaj `poradnik.punktodpornosci.pl`. W Google Search Console dodaj tę samą subdomenę jako osobny zasób i prześlij mapę witryny `https://poradnik.punktodpornosci.pl/sitemap.xml`.
7. **Podlinkuj z głównej strony.** Warto dodać odnośnik z `punktodpornosci.pl` do poradnika, żeby Google szybciej znalazł nową subdomenę. W przeciwną stronę odnośnik jest już w stopce.

Alternatywy, jeśli nie chcesz obciążać home.pl: Netlify (przeciągnij folder na netlify.com/drop), Cloudflare Pages, GitHub Pages. W każdej z nich wskazujesz subdomenę rekordem CNAME w panelu DNS home.pl.

### Co jest przygotowane pod tę domenę

- Adresy kanoniczne i znaczniki Open Graph oraz Twitter na wszystkich trzech stronach.
- `og.png` w rozmiarze 1200 na 630 pikseli, czyli obrazek widoczny przy udostępnianiu linku na Facebooku, LinkedIn i w komunikatorach.
- `robots.txt` z odnośnikiem do mapy witryny, przyjazny wyszukiwarkom i modelom językowym, w tej samej konwencji co plik na stronie głównej.
- `sitemap.xml` z pięcioma adresami: strona główna oraz szkolenie i gra w obu wersjach.

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
