# Akademia Dyszy (build grywalny)

Gra-kampus o druku 3D dla uczniów 10–14 lat: lekcje, laboratoria, quizy, egzamin i dyplom.
Działa pod adresem `https://poradnik.punktodpornosci.pl/akademia-dyszy/`. W miasteczku prowadzi
do niej **hala w kształcie drukarki „OMNI 200”**, która stoi obok szkoły.

Źródło: [mhalaba/akademia-dyszy](https://github.com/mhalaba/akademia-dyszy).

## Dlaczego tu leży zbudowana wersja, a nie kod

Repozytorium źródłowe to aplikacja TanStack Start z serwerem Nitro, logowaniem (better-auth)
i bazą (kysely, pg, PGLite). Takiej aplikacji nie da się postawić na GitHub Pages, bo Pages
serwuje wyłącznie pliki statyczne.

Sama gra tego wszystkiego nie potrzebuje: katalogi `src/game` i `src/components/hud` nie sięgają
ani do logowania, ani do bazy, a postęp gracza i tak zapisuje się w `localStorage`. Dlatego
zbudowana jest osobna, statyczna wersja: React montuje bezpośrednio komponent `Game`, bez
routera, bez serwera i bez logowania. Nic z gry nie ubyło — odpadła tylko warstwa aplikacyjna,
z której gra nie korzysta.

## Jak zbudować ponownie po zmianach w źródle

Pliki konfiguracyjne buildu leżą w `_zrodlo-builda/`. Cała procedura:

```bash
git clone --depth 1 https://github.com/mhalaba/akademia-dyszy.git /tmp/dyszy
```

```bash
mkdir -p /tmp/build && cp -R akademia-dyszy/_zrodlo-builda/. /tmp/build/ && cp -R /tmp/dyszy/src /tmp/build/zrodlo
```

```bash
cd /tmp/build && npm install && npm run build
```

Potem zawartość `/tmp/build/dist/` skopiuj do `akademia-dyszy/` (nadpisując `index.html`
i katalog `assets/`) i dopisz na końcu `index.html`, tuż przed `</body>`:

```html
<script src="../assets/analytics.js?v=19"></script>
```

Ta jedna linijka podpina pomiar i zgodę RODO wspólne dla całej domeny. Numer wersji `?v=` musi
się zgadzać z tym, którego używają pozostałe strony.

## Co jest w katalogu

| Ścieżka | Co to |
|---|---|
| `index.html`, `assets/` | zbudowana gra, to serwuje GitHub Pages |
| `_zrodlo-builda/` | pięć plików potrzebnych do powtórzenia buildu: `package.json`, `vite.config.mjs`, `index.html`, `src/main.jsx`, `src/app.css` |
