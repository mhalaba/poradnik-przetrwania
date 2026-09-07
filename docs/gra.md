# Gra 3D „Miasteczko" – jak jest zbudowana

Cały silnik to jeden plik: [`assets/game.js`](../assets/game.js). Bez frameworka, bez procesu
budowania. Jedyna zewnętrzna biblioteka to Three.js r128 wczytywany z CDN w `gra.html`.

Plik jest opakowany w `(function(){ 'use strict'; … })()`, więc nic nie wycieka do globalnego
zakresu poza jednym wyjątkiem opisanym niżej.

## Spis treści

- [Świat](#świat)
- [Misje i kroki](#misje-i-kroki)
- [Panele nauki](#panele-nauki)
- [Prowadzenie gracza](#prowadzenie-gracza)
- [Wskaźnik spokoju](#wskaźnik-spokoju)
- [Sterowanie](#sterowanie)
- [Jak dodać misję](#jak-dodać-misję)
- [Hak do testów](#hak-do-testów)

## Świat

Miasteczko powstaje proceduralnie przy starcie. Nie ma żadnych plików modeli ani tekstur —
wszystko jest liczone w przeglądarce.

| Element | Jak powstaje |
|---|---|
| Trawa, droga, dach, ściana, cegła | `tex(w,h,fn,rep)` rysuje teksturę na `<canvas>` i owija w `THREE.CanvasTexture` |
| Domy, bloki, budynki użyteczne | `house()`, `block()`, `building()` – złożone z `THREE.BoxGeometry` |
| Drzewa, krzaki, kamienie | `tree()` pojedynczo, `scatter()` masowo przez `THREE.InstancedMesh` |
| Niebo | kopuła `SphereGeometry` z własnym shaderem, dwa kolory zależne od pory dnia |
| Rzeka, powódź, deszcz | animowana siatka, płaszczyzna i `THREE.Points` |
| Postacie i pies | `human()` i `dog()` – klocki z animacją chodu |

Kolizje są prostokątne i płaskie: tablica `colliders` z wpisami `{x, z, w, d}`, sprawdzana
w `collides(x, z)`. Tablica `solids` służy do czegoś innego — kamera strzela w nią promieniem
(`camClear()`), żeby nie wchodzić w ściany.

**Ważne przy dodawaniu obiektów:** wpisy do `colliders` muszą powstać *przed* rozsiewaniem
drzew i trawy, bo `freeSpot()` i `scatter()` omijają zajęte miejsca. W praktyce znaczy to:
dopisuj nowe budynki w okolicy definicji samochodu, nie na końcu pliku.

## Misje i kroki

Misji jest 19, po jednej na rozdział szkolenia. Definicja misji jest celowo uboga:

```js
{ id: 0, icon: '🏫', name: T('Wstęp: rozmowa w szkole','Start: Mały Strażnik'), pos: [45,-37] }
```

`T(dorosli, dzieci)` wybiera wariant tekstu zależnie od `?wersja=`.

Scenariusz misji budowany jest dopiero po jej rozpoczęciu, w `buildQuest(m)` — długi `switch`
po `m.id`, który wypełnia tablicę kroków. Krok jest zwykłym obiektem z polem `type`:

| `type` | Co robi | Najważniejsze pola |
|---|---|---|
| `talk` | dialog z postacią, często z wyborem i uzasadnieniem | `npc`, `x`, `z`, `auto`, `lines[]` |
| `goto` | idź w miejsce i potwierdź | `x`, `z`, `r`, `obj`, `action`, `msg` |
| `collect` | zbierz właściwe przedmioty, omiń pułapki | `items[{name, good, why}]`, `obj` |
| `panel` | otwiera panel nauki | `run()` |
| `timed` | zbieranie w narzuconej kolejności, na czas | `points[]`, `sec` |
| `flood` | podnosi się woda, trzeba uciec na wzgórze | — |
| `drop` | „padnij i osłoń się" na sygnał | — |
| `night` / `dusk` | zmienia porę dnia, włącza latarkę | `on` |
| `rain` | włącza deszcz | `on` |
| `end` | podsumowanie, gwiazdki, plan „jeśli–to" | `summary`, `plan` |

Rozdziela je `runStep()`, a `nextStep()` przesuwa wskaźnik `quest.i`.

Gwiazdki liczą się z dwóch rzeczy: błędów w zbieraniu (`quest.stars`) i trafności odpowiedzi
w dialogach (`quest.ok / quest.total`). Poniżej połowy trafień zostaje jedna gwiazdka.

## Panele nauki

Panele to okna HTML wstrzykiwane przez `open(html)` i zamykane przez `close()`. Otwarcie panelu
ustawia `panelOpen = true`, co zatrzymuje ruch gracza i czyści wciśnięte klawisze.

| Funkcja | Czego uczy |
|---|---|
| `quizPanel` | pytania zamknięte z wyjaśnieniem po odpowiedzi |
| `calcPanel` | rachunek na liczbach (litry wody, dni leków) z podpowiedzią i rozwiązaniem |
| `orderPanel` | uszeregowanie, np. matryca ryzyka P × S |
| `packPanel` | co wchodzi do plecaka, a co nie |
| `fifoPanel` | rotacja zapasów, pierwsze weszło – pierwsze wyszło |
| `budgetPanel` | podział budżetu na przygotowania |
| `selfCheckPanel` | samoocena gotowości |
| `sirenPanel` | rozpoznawanie sygnałów syren ze słuchu |
| `fakePanel` | rozpoznawanie dezinformacji |
| `sosPanel` | sygnał SOS |
| `rkoPanel` | rytm uciśnięć 100–120 na minutę |
| `breathPanel` | oddech 4-7-8, obniża wskaźnik stresu |

Wzorzec dydaktyczny jest wszędzie ten sam: **pokaż zasadę → daj spróbować → wyjaśnij, dlaczego**.
Zła odpowiedź nigdy nie kończy misji — wraca `failStep()` z podpowiedzią i można próbować dalej.

## Prowadzenie gracza

Za to odpowiada `wskazowka()`, wołana z pętli gry co 0,3 sekundy, tylko gdy nie trwa misja
i nie jest otwarty panel.

- `nastepnaMisja()` zwraca pierwszą nieukończoną misję, której wszystkie poprzedniczki są zrobione.
- `kierunek(dx, dz)` zamienia wektor na słowo z róży wiatrów (oś −Z to północ, +X to wschód).
- `pokazCel(html)` wypisuje wskazówkę, pomijając zapis, jeśli treść się nie zmieniła.

Na minimapie `gwiazdka()` rysuje pulsujący cel, a gdy cel wypada poza promień `MMR`, na krawędzi
pojawia się trójkątna strzałka. W świecie 3D nad znacznikiem bieżącej misji wisi stożek
(`m.strzalka`), a jej etykieta ma podniesiony `maxDist` do 170 metrów.

## Wskaźnik spokoju

`state.calm` startuje z 80. Złe decyzje w dialogach odejmują, ćwiczenie oddechu i ukończenie
misji dodają. Wartość wchodzi do wyniku końcowego i do zdarzeń pomiaru. To nie jest pasek
zdrowia — chodzi o pokazanie, że panika jest kosztem, którym da się zarządzać.

## Sterowanie

| Wejście | Działanie |
|---|---|
| WASD / strzałki | ruch względem kamery |
| przeciąganie myszą, `Q` | obrót kamery |
| kółko myszy, `+` / `−`, przyciski z boku | przybliżanie, `0` wraca do domyślnego |
| `E` albo przycisk akcji | działanie |
| joystick, przeciąganie, szczypanie dwoma palcami | to samo na telefonie |

Kamera trzyma się za graczem i cofa się, gdy między nią a graczem stanie ściana
(`camClear()` strzela promieniem w `solids`).

## Jak dodać misję

1. Dopisz wpis do tablicy `MISSIONS` — `id` musi odpowiadać numerowi rozdziału w
   `assets/content.js`, bo z niego brany jest tytuł i treść podsumowania.
2. Dopisz `case <id>:` w `buildQuest()` i zbuduj kroki.
3. Zadbaj o miejsce: `pos` nie może leżeć bliżej niż ~8 metrów od innego znacznika ani wewnątrz
   budynku. Uwaga na trzy misje z pozycją liczoną od `HOME` — przesunięcie domu przesuwa i je.
4. Dopisz rozdział w `content.js` i `content-kids.js` — patrz [dokumentacja treści](tresc.md).
5. Podbij numer `?v=` w plikach HTML.

## Hak do testów

Na końcu pliku jest jedyne wyjście na zewnątrz:

```js
window.__pp = { startMission, MISSIONS, player, camera, close, nextStep,
                setNight, setDusk, get quest(){…}, state, pickups, interact, solids, debug };
```

Pozwala w konsoli przeskoczyć do misji, przestawić gracza (`__pp.player.position.set(x,0,z)`),
włączyć noc albo podejrzeć stan kamery. Wygodne przy sprawdzaniu odległych zakątków mapy bez
przechodzenia przez pół miasteczka.
