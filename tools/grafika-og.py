# -*- coding: utf-8 -*-
"""Grafika tytulowa w stylu retro. Rysowana proceduralnie piksel po pikselu,
   w scisle ograniczonej palecie, z ditheringiem Bayera na niebie i wlasnym
   fontem bitmapowym 5x7. Skalowana calkowita liczba razy, wiec piksele
   zostaja twarde - to jest rozpoznawalny wyglad gry retro, a nie obrazka
   z generatora."""
import sys, zlib, struct, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from font5x7 import rysuj_tekst, szerokosc

W, H, S = 240, 126, 5          # logicznie 240x126, po skalowaniu 1200x630

def rgb(h): h=h.lstrip('#'); return (int(h[0:2],16), int(h[2:4],16), int(h[4:6],16))

P = {
 'noc':      rgb('#1b1436'), 'noc2':   rgb('#2e1f52'), 'fiolet': rgb('#58306a'),
 'rozowy':   rgb('#9c4a5c'), 'zorza':  rgb('#d8764a'), 'slonce': rgb('#f2b25c'),
 'gwiazda':  rgb('#f6f0d8'), 'wzgorze':rgb('#241c3e'), 'wzgorze2':rgb('#18233a'),
 'sciana':   rgb('#e3d6b8'), 'sciana2':rgb('#b8a688'), 'dach':   rgb('#a63f3f'),
 'dach2':    rgb('#7a2c2c'),  'okno':  rgb('#ffd166'), 'okno2':  rgb('#3c4a66'),
 'beton':    rgb('#8d8f99'), 'beton2': rgb('#6a6c77'),
 'droga':    rgb('#44444f'), 'droga2': rgb('#585866'), 'pas':    rgb('#d8d4c4'),
 'trawa':    rgb('#4f7a3a'), 'trawa2': rgb('#3a5c2b'), 'woda':   rgb('#2f6f8e'),
 'woda2':    rgb('#24576f'), 'tusz':   rgb('#100e1a'), 'tekst':  rgb('#f6f0d8'),
 'akcent':   rgb('#ffc857'), 'czerw':  rgb('#e0483c'), 'skora':  rgb('#e8b48c'),
 'koszula':  rgb('#f5b400'), 'spodnie':rgb('#3a4a7a'), 'plecak': rgb('#5a6b3a'),
 'cien':     rgb('#2a2b36'),
}

buf = [[P['noc'] for _ in range(W)] for _ in range(H)]
def px(x, y, kol):
    if 0 <= x < W and 0 <= y < H: buf[y][x] = kol
def prost(x, y, w, h, kol):
    for j in range(y, y+h):
        for i in range(x, x+w): px(i, j, kol)

BAYER = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
def mieszaj(x, y, a, b, t):
    """Dithering zamiast gradientu - nieba w grach 8-bitowych nie mialy plynnych przejsc."""
    return b if t*16 > BAYER[y % 4][x % 4] else a

# ---------- niebo ----------
STOPNIE = [(0.00,'noc'), (0.34,'noc2'), (0.58,'fiolet'), (0.80,'rozowy'), (1.00,'zorza')]
HORYZONT = 62
for y in range(HORYZONT):
    t = y / (HORYZONT-1)
    for k in range(len(STOPNIE)-1):
        t0, a = STOPNIE[k]; t1, b = STOPNIE[k+1]
        if t0 <= t <= t1:
            f = (t-t0)/(t1-t0)
            for x in range(W): px(x, y, mieszaj(x, y, P[a], P[b], f))
            break

# ---------- gwiazdy (wlasny generator, zeby obrazek byl powtarzalny) ----------
ziarno = 20260911
def losowa():
    global ziarno
    ziarno = (ziarno*1103515245 + 12345) & 0x7fffffff
    return ziarno / 0x7fffffff
for _ in range(85):
    gx, gy = int(losowa()*W), int(losowa()*34)
    if losowa() < .25: px(gx, gy, P['tekst'])
    else: px(gx, gy, P['gwiazda'])

# ---------- slonce nisko nad horyzontem ----------
sx, sy, sr = 184, 64, 11
for y in range(sy-sr, sy+sr+1):
    for x in range(sx-sr, sx+sr+1):
        if (x-sx)**2 + (y-sy)**2 <= sr*sr and y < HORYZONT:
            px(x, y, P['slonce'] if (y-sy) < 4 else P['zorza'])

# ---------- dalekie wzgorza ----------
def wzgorze(cx, cy, szer, wys, kol):
    for x in range(cx-szer, cx+szer+1):
        t = 1 - abs(x-cx)/szer
        for y in range(cy - int(wys*t*t), HORYZONT+4): px(x, y, kol)
wzgorze(44, 66, 56, 13, P['wzgorze'])
wzgorze(214, 68, 44, 8, P['wzgorze'])
wzgorze(122, 69, 74, 7, P['wzgorze2'])

# ---------- miasteczko ----------
def dom(x, szer, wys, dach_kol=None, okna=True):
    """Domek z dwuspadowym dachem i swiecacymi oknami."""
    podstawa = 84
    prost(x, podstawa-wys, szer, wys, P['sciana'])
    prost(x, podstawa-wys, 1, wys, P['sciana2'])
    prost(x+szer-1, podstawa-wys, 1, wys, P['sciana2'])
    dk = dach_kol or P['dach']
    for i in range(szer//2 + 1):
        y = podstawa-wys-1-i
        prost(x+i, y, szer-2*i, 1, dk if i % 2 == 0 else P['dach2'])
    if okna:
        for oy in range(podstawa-wys+2, podstawa-3, 5):
            for ox in range(x+2, x+szer-2, 4):
                px(ox, oy, P['okno'] if losowa() < .62 else P['okno2'])
                px(ox, oy+1, P['okno'] if losowa() < .45 else P['okno2'])
    prost(x, podstawa, szer, 1, P['tusz'])

def blok(x, szer, wys):
    podstawa = 84
    prost(x, podstawa-wys, szer, wys, P['beton'])
    prost(x+szer-1, podstawa-wys, 1, wys, P['beton2'])
    prost(x, podstawa-wys-1, szer, 1, P['beton2'])
    for oy in range(podstawa-wys+3, podstawa-2, 4):
        for ox in range(x+2, x+szer-2, 3):
            px(ox, oy, P['okno'] if losowa() < .5 else P['okno2'])
    prost(x, podstawa, szer, 1, P['tusz'])

# szyk zabudowy: od lewej do prawej, z blokiem i wieza cisnien
dom(4, 18, 15)
blok(34, 16, 30)
dom(52, 18, 13, P['dach2'])
dom(74, 26, 19)
dom(104, 20, 14, P['dach2'])
blok(128, 14, 24)
dom(146, 24, 17)
dom(176, 18, 13, P['dach2'])
dom(198, 26, 18)
prost(0, 84, W, 1, P['tusz'])

# syrena na masztie - ten sam znak rozpoznawczy co w grze
mx = 27
prost(mx, 60, 2, 24, P['beton2'])
prost(mx-3, 56, 8, 5, P['czerw'])
prost(mx-3, 56, 8, 1, P['tusz'])
for r in (7, 11):                       # fala dzwiekowa
    for k in range(-2, 3):
        px(mx+1+r, 58+k, P['akcent'])
        px(mx+1-r, 58+k, P['akcent'])

# ---------- rzeka ----------
prost(0, 85, W, 6, P['woda'])
for x in range(W):
    if (x + (x//7)) % 5 == 0: px(x, 86, P['woda2'])
    if (x*3) % 11 == 0: px(x, 89, P['woda2'])
prost(0, 84, W, 1, P['tusz']); prost(0, 91, W, 1, P['tusz'])

# ---------- trawa i droga w perspektywie ----------
GRUNT, PASEK = 92, 112
prost(0, GRUNT, W, PASEK-GRUNT, P['trawa'])
for y in range(GRUNT, PASEK):
    for x in range(W):
        if (x*7 + y*3) % 23 == 0: px(x, y, P['trawa2'])
for y in range(GRUNT, PASEK):
    t = (y-GRUNT)/(PASEK-1-GRUNT)
    polowa = int(8 + t*46)
    prost(120-polowa, y, polowa*2, 1, P['droga'])
    px(120-polowa, y, P['droga2']); px(120+polowa-1, y, P['droga2'])
for y in range(GRUNT+2, PASEK-2, 6):        # przerywana linia
    t = (y-GRUNT)/(PASEK-1-GRUNT)
    gr = 1 + int(t*2)
    prost(120-gr//2, y, max(1,gr), min(3, PASEK-2-y), P['pas'])

# ---------- roza wiatrow w lewym dolnym rogu (nawiazanie do stacji) ----------
rx, ry, rr = 30, 103, 13
for y in range(ry-8, ry+9):
    for x in range(rx-rr-1, rx+rr+2):
        e = ((x-rx)/(rr+1.0))**2 + ((y-ry)/6.5)**2
        if e <= 1.0: px(x, y, P['beton'] if e < .78 else P['beton2'])
        elif e <= 1.25: px(x, y, P['tusz'])
for k in range(-rr+3, rr-2):            # kreski kierunkow
    if k % 4 == 0: px(rx+k, ry, P['beton2'])
prost(rx, ry-5, 1, 10, P['beton2'])
prost(rx-1, ry-5, 2, 5, P['czerw'])     # igla na polnoc
px(rx, ry-7, P['czerw']); px(rx-1, ry-6, P['czerw']); px(rx+1, ry-6, P['czerw'])

# ---------- postac gracza, widok od tylu ----------
gx, gy = 120, 90
prost(gx-6, gy+20, 12, 2, P['cien'])        # cien pod stopami
prost(gx-4, gy+9, 10, 10, P['koszula'])     # tulow
prost(gx-3, gy+10, 8, 7, P['plecak'])       # plecak
prost(gx-3, gy+10, 8, 1, P['tusz'])
prost(gx-4, gy+19, 4, 3, P['spodnie'])      # nogi
prost(gx+1, gy+19, 4, 3, P['spodnie'])
prost(gx-5, gy+11, 1, 8, P['koszula'])      # rece
prost(gx+6, gy+11, 1, 8, P['koszula'])
prost(gx-4, gy+2, 10, 7, P['skora'])        # glowa od tylu
prost(gx-4, gy+1, 10, 3, P['tusz'])         # wlosy
prost(gx-5, gy+1, 1, 8, P['tusz']); prost(gx+6, gy+1, 1, 8, P['tusz'])
prost(gx-4, gy+9, 10, 1, P['tusz'])

# ---------- napisy ----------
def tekst(txt, y, s, kol, x=None):
    szer = szerokosc(txt, s)
    rysuj_tekst(px, txt, (W-szer)//2 if x is None else x, y, s, kol)
    return szer

def tekst_z_cieniem(txt, y, s):
    szer = szerokosc(txt, s)
    x = (W-szer)//2
    rysuj_tekst(px, txt, x+s, y+s, s, P['tusz'])
    rysuj_tekst(px, txt, x, y, s, P['akcent'])

tekst_z_cieniem('PORADNIK', 7, 2)
tekst_z_cieniem('PRZETRWANIA', 24, 2)
prost((W-96)//2, 42, 96, 1, P['akcent'])
tekst('SZKOLENIE I GRA 3D', 47, 1, P['tekst'])

# dolny pasek jak na ekranie tytulowym automatu
prost(0, PASEK, W, H-PASEK, P['tusz'])
prost(0, PASEK-1, W, 1, P['akcent'])
tekst('WCIŚNIJ START', PASEK+4, 1, P['akcent'])
rysuj_tekst(px, 'DARMOWE', 6, PASEK+4, 1, P['beton'])
rysuj_tekst(px, 'PL 1.5', W-42, PASEK+4, 1, P['beton'])

# ramka
prost(0, 0, W, 1, P['tusz']); prost(0, H-1, W, 1, P['tusz'])
prost(0, 0, 1, H, P['tusz']); prost(W-1, 0, 1, H, P['tusz'])

# ---------- skalowanie calkowite + delikatne linie obrazu ----------
OW, OH = W*S, H*S
wiersze = []
for oy in range(OH):
    zrodlo = buf[oy//S]
    skan = (oy % 3 == 2)
    rzad = bytearray()
    for ox in range(OW):
        r, g, b = zrodlo[ox//S]
        if skan: r, g, b = int(r*.88), int(g*.88), int(b*.88)
        rzad += bytes((r, g, b))
    wiersze.append(rzad)

surowe = b''.join(b'\x00' + bytes(r) for r in wiersze)
def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t+d) & 0xffffffff)
png = (b'\x89PNG\r\n\x1a\n'
       + chunk(b'IHDR', struct.pack('>IIBBBBB', OW, OH, 8, 2, 0, 0, 0))
       + chunk(b'IDAT', zlib.compress(surowe, 9))
       + chunk(b'IEND', b''))
cel = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'og-retro.png')
cel.write_bytes(png)
print('zapisane:', cel, OW, 'x', OH, '|', len(png)//1024, 'kB')
