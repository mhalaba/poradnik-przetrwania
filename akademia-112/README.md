# Akademia 112 (kopia grywalna)

Gra 3D dla dzieci o pierwszej pomocy: **oceń → zadzwoń 112 → uciskaj + AED**.

Kod pochodzi z repozytorium [mhalaba/akademia-112](https://github.com/mhalaba/akademia-112).
Tutaj leży kopia plików potrzebnych do grania, żeby gra działała pod adresem
`https://poradnik.punktodpornosci.pl/akademia-112/`, na tym samym certyfikacie co poradnik.
W miasteczku prowadzi do niej **karetka** stojąca przed punktem medycznym.

Jedyna zmiana względem oryginału: na końcu `index.html` dopięty jest `../assets/analytics.js`,
żeby pomiar i zgoda RODO były wspólne dla całej domeny. Reszta plików jest skopiowana bez zmian.

Po zmianach w repozytorium źródłowym skopiuj tu ponownie `index.html`, `game.js` i `three.min.js`,
i przywróć tę jedną linijkę ze skryptem pomiaru.

Licencja: MIT (plik `LICENSE`).
