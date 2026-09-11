# Narzędzia

## `grafika-og.py` — grafika tytułowa do social mediów

Generuje `og-miasteczko.png` (1200×630): ekran tytułowy w stylu retro, którym serwis
przedstawia się na X, Facebooku i w każdym podglądzie linku.

```bash
python3 tools/grafika-og.py og-miasteczko.png
```

Grafika jest **rysowana kodem, piksel po pikselu** — nie pochodzi z generatora obrazów.
Stąd jej wygląd: ściśle ograniczona paleta, dithering Bayera zamiast płynnego gradientu na
niebie, własny font bitmapowy 5×7 z `font5x7.py` (z polskimi znakami diakrytycznymi
dorysowywanymi osobno) i skalowanie całkowitą liczbą razy, dzięki któremu piksele zostają
twarde. Na koniec co trzeci wiersz jest przyciemniany o 12%, co daje delikatne linie obrazu
jak na kineskopie.

Kompozycja od góry: dithering nieba o zachodzie ze gwiazdami, słońce schodzące za zabudowę,
wzgórza, panorama miasteczka z syreną na maszcie (ten sam znak rozpoznawczy co w grze),
rzeka, droga w perspektywie z postacią widzianą od tyłu, róża wiatrów w lewym dolnym rogu
jako nawiązanie do stacji kompasu, i pasek jak na ekranie tytułowym automatu.

Jeśli zmieniasz grafikę, zmień też nazwę pliku i odnośniki `og:image` oraz `twitter:image`
w `index.html`, `szkolenie.html` i `gra.html`. Facebook i X zapamiętują podglądy po adresie,
więc nowa nazwa to najprostszy sposób, żeby zobaczyli nową wersję od razu.

## `font5x7.py`

Font bitmapowy 5×7 pisany ręcznie: 44 glify plus mechanizm znaków diakrytycznych
(kreska, kropka, ogonek, przekreślenie), więc `Ś`, `Ż`, `Ą`, `Ł` i reszta wychodzą poprawnie.
