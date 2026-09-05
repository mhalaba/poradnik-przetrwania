/* Treść szkolenia – WERSJA DLA DOROSŁYCH
   Na podstawie książki „Poradnik przetrwania w sytuacjach kryzysowych” (Matthew Halaba, Bezdroża/Helion 2026).
   Każdy rozdział: id, tytuł, motto, wprowadzenie, sekcje (kroki), tip autora, ćwiczenie, quiz. */
window.KSIAZKA = {
  tytul: "Poradnik przetrwania w sytuacjach kryzysowych",
  autor: "Matthew Halaba",
  sklep: "https://bezdroza.pl/ksiazki/poradnik-przetrwania-w-sytuacjach-kryzysowych-matthew-halaba,bepprz.htm",
  opinie: "https://bezdroza.pl/user/opinie/bepprz",
  wydawca: "Bezdroża (Helion S.A.)"
};

window.ROZDZIALY = [
{
  id: 0, nr: "Wstęp", tytul: "Dlaczego ta książka powstała?",
  motto: "Lepiej mieć i nie potrzebować, niż potrzebować i nie mieć. (powiedzenie wojskowe)",
  intro: "W świecie pełnym nieprzewidywalnych wydarzeń – od pandemii, przez blackouty, aż po konflikty zbrojne – coraz trudniej udawać, że „to się u nas nie zdarzy”. Autor pojechał jako wolontariusz do Mariupola i tam zrozumiał, że przetrwanie nie zależy od heroizmu, ale od prostych przygotowań i solidarności sąsiedzkiej.",
  sekcje: [
    { t: "Polska w obliczu zagrożeń (ostatnie 20 lat)", p: ["Powodzie tysiąclecia – 1997, 2010 (Sandomierz, Wrocław, Bogatynia).", "Gwałtowne burze i pożary – susze, trąby powietrzne, zniszczenia infrastruktury.", "Przerwy w dostawach energii – w tym blackout w 2021 w rejonie śląskim i podlaskim.", "Cyberataki na infrastrukturę – szpitale i systemy informatyczne gmin.", "Pandemia – społeczeństwo bez przygotowania traci zdolność funkcjonowania w kilka dni."] },
    { t: "Dane Rządowego Centrum Bezpieczeństwa", p: ["Ponad 60% Polaków nie posiada zapasów na więcej niż 72 godziny.", "Aż 78% nie ma ustalonego planu ewakuacji ani kontaktów awaryjnych."] },
    { t: "Dla kogo to wszystko?", p: ["Dla każdego, kto mieszka w Polsce: singla w kawalerce, rodzica małych dzieci, seniora, osoby z niepełnosprawnością.", "Każdy element przygotowań, który wdrożysz, to jeden powód mniej do zmartwień w przyszłości."] }
  ],
  tip: "PRZYGOTOWANIE NIE OZNACZA PANIKI. OZNACZA ODPOWIEDZIALNOŚĆ.",
  cwiczenie: "Zapisz na kartce trzy sytuacje kryzysowe, których realnie obawiasz się w swojej okolicy. Wrócisz do tej listy w rozdziale 1.",
  quiz: [
    { q: "Na ile godzin samodzielności powinno wystarczyć podstawowe przygotowanie gospodarstwa domowego?", o: ["Na 12 godzin", "Na 72 godziny", "Na 30 dni"], a: 1, w: "72 godziny to czas, w którym służby zwykle docierają do poszkodowanych po dużej katastrofie. Ponad 60% gospodarstw w Polsce nie ma nawet tyle." },
    { q: "Od czego zacząć przygotowania?", o: ["Od zakupu latarki i konserw", "Od sprawdzenia, jakie zagrożenia realnie występują w twojej okolicy", "Od kupna agregatu"], a: 1, w: "Zakupy bez analizy to pieniądze wyrzucone w błoto. Mieszkanie nad rzeką wymaga czego innego niż 10. piętro w bloku." },
    { q: "Sąsiad mówi: „U nas nigdy nic się nie działo”. Co jest tu błędem?", o: ["Nic, to rozsądne podejście", "Brak zdarzeń w przeszłości nie znaczy, że ryzyko nie istnieje", "Trzeba się kłócić i straszyć"], a: 1, w: "Powódź 1997 i 2010, blackout 2021, pandemia. Ryzyko ocenia się po tym, co MOŻE się zdarzyć, nie po tym, co akurat się nie zdarzyło." }
  ]
},
{
  id: 1, nr: "Rozdział 1", tytul: "Analiza ryzyka i ocena zagrożeń",
  motto: "Zanim kupisz latarkę, namiot czy zestaw konserw, zadaj sobie jedno pytanie: czego naprawdę się obawiam?",
  intro: "Każda osoba, rodzina i lokalizacja mają inną strukturę zagrożeń. Analiza ryzyka nie jest pesymizmem, ale narzędziem do uniknięcia paniki, gdy coś się stanie. Powodzie 1997 i 2010 pokazały, że ponad połowa obszaru Polski jest narażona na ryzyko zalania.",
  sekcje: [
    { t: "Mapa zagrożeń w Polsce", p: ["Powodzie – największe zagrożenie naturalne: ponad 1/3 terytorium w dorzeczu Odry, ponad połowa w dorzeczu Wisły; 253 rzeki (ok. 15 000 km) uznano za obszary ryzyka.", "Powódź 2010: 25 ofiar, 23 000 ewakuowanych, ponad 8000 ha zniszczeń, straty ok. 2,5 mld.", "Inne: susze, wichury, trąby powietrzne, ulewy, pożary lasów, ekstremalne temperatury, osuwiska, śnieżyce, epidemie.", "Technologiczne: blackout, przerwy w dostawie gazu/wody, skażenie chemiczne, pożar w zakładzie.", "Cybernetyczne i informacyjne: atak na sieci energetyczne, dezinformacja. Ekonomiczne: hiperinflacja, kryzys bankowy, przerwy w łańcuchach dostaw."] },
    { t: "Najczęstsze lokalne zagrożenia", p: ["Powodzie – dorzecza Odry, Wisły, Warty (Opolszczyzna, Małopolska, Dolny Śląsk).", "Trąby powietrzne i burze – Kujawy, Mazowsze, Pomorze.", "Blackouty – aglomeracja śląska, tereny górskie.", "Zagrożenia przemysłowe – Śląsk, Łódzkie. Militarne – Podlasie, Lubelszczyzna. Cyberataki – miasta, samorządy, szpitale."] },
    { t: "Systemy ostrzegania (skrót)", p: ["Syreny: 3-minutowy ciągły – alarm powietrzny; 3-minutowy przerywany – alarm ogólny.", "RCB/RSO: SMS-y alarmowe. Radio: Polskie Radio Program I (Solec Kujawski).", "Aplikacje: Alert RCB, Schrony, MeteoAlert, Alarm112, RSO."] },
    { t: "Metody oceny ryzyka – matryca", p: ["Prawdopodobieństwo (1–5) × Skutki (1–5) = Priorytet.", "Przykład: Powódź 4×5=20, Cyberatak 5×3=15, Blackout 3×4=12, Zamieszki 2×5=10.", "Uwzględnij podatność (wiek, zdrowie, budynek) i zdolność do przeciwdziałania (zapasy, ubezpieczenie, sieć wsparcia)."] },
    { t: "Matryca podatności osobistej", p: ["Rodzina z dziećmi – ewakuacja, leki, pożywienie, komfort psychiczny dzieci.", "Osoba samotna – bezpieczeństwo mieszkania, sieć sąsiedzka.", "Seniorzy – mobilność, leki, ogrzewanie, komunikacja alternatywna.", "Osoby z niepełnosprawnościami – transport specjalistyczny, leki, opiekun.", "Osoby chore przewlekle – chłodzenie leków, aparatura (inhalator, tlen)."] },
    { t: "Kwestionariusz samooceny", p: ["Czy jesteś jedynym opiekunem dzieci lub osoby starszej?", "Czy przeżyjesz 72 godziny bez prądu, gazu i wody?", "Czy masz zapas leków na minimum 7 dni?", "Czy wiesz, jak opuścić mieszkanie w ciągu 10 minut?", "Czy masz alternatywne źródła informacji (radio, aplikacje)?"] },
    { t: "Mapa mentalna okolicy", p: ["Zaznacz: szpital, przychodnię, aptekę; najbliższy punkt ewakuacyjny; alternatywne trasy ucieczki; budynki z agregatem."] },
    { t: "Własna matryca krok po kroku", p: ["1. Zidentyfikuj zagrożenia (mapy IMGW, mapy powodziowe, obserwacje sąsiadów, zagrożenia globalne i osobiste).", "2. Określ podatność i ekspozycję (kto narażony, jaki budynek, jakie zasoby).", "3. Oceń prawdopodobieństwo i skutek.", "4. Ustal priorytety – skup się na najwyższych wynikach.", "5. Aktualizuj co najmniej raz w roku lub po każdym poważnym wydarzeniu."] },
    { t: "Kalendarz przygotowań", p: ["Styczeń–marzec: zapasy zimowe, ogrzewanie, oświetlenie.", "Kwiecień–czerwiec: plan ewakuacji, odświeżenie map, lekka odzież.", "Lipiec–wrzesień: test systemu informacyjnego, agregat, ćwiczenia w rodzinie.", "Październik–grudzień: aktualizacja kontaktów, przegląd apteczki i dokumentów."] },
    { t: "Psychologia i sieć sąsiedzka", p: ["Stres: ćwiczenia oddechowe, ograniczenie wiadomości, rozmowy o planach bez paniki.", "Z dziećmi: prosto, bez straszenia, przez zabawę (plecak jak na przygodę), nadaj rolę („strażnik latarek”).", "Sąsiedzi: spotkanie klatki/ulicy, komunikacja awaryjna (kartka na drzwiach), lokalny koordynator z radiem i apteczką."] }
  ],
  tip: "Im więcej ćwiczysz przed, tym mniej się boisz w trakcie. Gotówka, zapasowa karta SIM, sieć sąsiedzka – to twoje finansowo-społeczne koło ratunkowe.",
  cwiczenie: "SYMULACJA: „Jest godzina 21:00. Nie ma prądu, internetu, wody. Masz 10 minut, żeby podjąć decyzję: zostać czy ewakuować się?” Zostaję – sprawdzam zapasy, ogrzewanie, komunikację. Ewakuuję się – pakuję plecak, zostawiam wiadomość, ruszam zgodnie z planem.",
  quiz: [
    { q: "Jak liczy się priorytet w matrycy ryzyka?", o: ["Prawdopodobieństwo + skutki", "Prawdopodobieństwo × skutki", "Skutki − prawdopodobieństwo"], a: 1 },
    { q: "Co oznacza 3-minutowy ciągły dźwięk syreny (wg skrótu z rozdziału 1)?", o: ["Alarm powietrzny", "Test syren", "Koniec zagrożenia"], a: 0 },
    { q: "Jak często minimum należy aktualizować matrycę ryzyka?", o: ["Raz na 5 lat", "Co najmniej raz w roku lub po poważnym wydarzeniu", "Nigdy – to dokument jednorazowy"], a: 1 },
    { q: "Rodzina 4 osób planuje zapas wody na 3 dni. Ile to minimum litrów?", o: ["12 litrów", "36 litrów", "4 litry"], a: 1, w: "Licz 3 litry na osobę na dzień: 4 osoby × 3 dni × 3 l = 36 l. Przy upale, ciąży lub chorobie potrzeba więcej." }
  ]
},
{
  id: 2, nr: "Rozdział 2", tytul: "Rodzinny plan awaryjny",
  motto: "Kiedy masz plan, nawet najgorsza wiadomość jest tylko zadaniem do wykonania, a nie wyrokiem.",
  intro: "Plan awaryjny to nie tylko instrukcja postępowania, ale sposób, by każdy czuł się odpowiedzialny, a nie bezradny. Zaczyna się od rozmowy przy kuchennym stole. Brak planu prowadzi do chaosu, paniki i niebezpiecznych decyzji.",
  sekcje: [
    { t: "Fundamenty planu", p: ["Dwa miejsca spotkań: jedno blisko domu (pożar, awaria budynku), drugie poza okolicą (większa ewakuacja).", "Spisane numery telefonów – bliskich i instytucji (straż, pogotowie, przychodnia).", "Przemyślana trasa ucieczki – główna droga może być nieprzejezdna.", "Role: kto pakuje apteczkę, kto bierze dokumenty, kto prowadzi auto, kto zajmuje się zwierzętami.", "Plan zapisany na papierze, powieszony w widocznym miejscu i zapisany w telefonie."] },
    { t: "Plan na różne scenariusze", p: ["Pozostanie w domu: zabezpieczenie okien i drzwi, dostęp do wody, żywności i ciepła, przestrzeń na dłuższy pobyt.", "Ewakuacja: spakowany plecak, miejsca zbiórek, trasy i punkty kontrolne.", "Dzieci, seniorzy, osoby zależne: opiekun zapasowy, lista leków, procedura powiadamiania."] },
    { t: "Komunikacja alternatywna", p: ["CB/PMR radio: zasięg 1–5 km, kanał awaryjny 9 (CB) lub 3 (PMR).", "Krótkofalówki 446 MHz (PMR), procedura 15/45 – nasłuch 15 minut po każdej pełnej godzinie.", "Sygnały wizualne: czerwony materiał na dachu = potrzebna pomoc.", "W sytuacjach ekstremalnych: kurierzy piesi, ludzie zaufania."] },
    { t: "Aspekty prawne i finansowe", p: ["Pełnomocnictwa awaryjne: kto odbiera dzieci ze szkoły, kto decyduje o leczeniu.", "Testament i dyspozycje w miejscu znanym bliskim; kopie cyfrowe zaszyfrowane, dostępne offline.", "Ubezpieczenia + dokumentacja fotograficzna mienia.", "Gotówka awaryjna w nominałach 10–50 zł, skrytka domowa + zapas w pojeździe; waluty twarde (EUR, USD), srebro, karty przedpłacone."] },
    { t: "Psychologia kryzysu w rodzinie", p: ["Oddech 4–7–8 (wdech 4 s, wstrzymanie 7 s, wydech 8 s), technika uziemienia (5 rzeczy, które widzisz, 4, które słyszysz…).", "PTSD u dzieci: zmiany nastroju, regresja, agresja – nie ignoruj, rozmawiaj spokojnie.", "Rytuały stabilizujące: wspólne posiłki, zabawa, plan dnia nawet w schronie.", "Pomoc: Telefon Zaufania 116 123, psychologowie kryzysowi przy urzędach miast."] },
    { t: "Scenariusze sytuacyjne", p: ["Zaginięcie członka rodziny: ostatnie miejsce pobytu, zdjęcie, ubranie, punkt zbiórki.", "Atak terrorystyczny: zasada RUN – HIDE – TELL (uciekaj, ukryj się, poinformuj).", "Pandemia: osobne strefy w domu, maski, dezynfekcja, izolacja chorych.", "Uchodźctwo: plecak = dokumenty + gotówka + lekki śpiwór + tabletki do uzdatniania wody."] },
    { t: "Cztery kroki kompleksowego planu", p: ["Krok 1: wspólna rozmowa – jak odbierzecie ostrzeżenia, gdzie schronienie, jakie trasy, jak komunikacja.", "Krok 2: specyficzne potrzeby – wiek, szkoła, obowiązki wobec innych, diety i alergie, choroby, niepełnosprawność, zwierzęta.", "Krok 3: zapisz i udostępnij – numery (w tym łącznik poza miastem), dwa miejsca spotkań, role; kopie w portfelach, plecakach dzieci, samochodzie.", "Krok 4: ćwiczcie co najmniej dwa razy w roku – próbna ewakuacja, wyłączenie prądu, latarka i radio na korbę."] },
    { t: "Symbole dla dzieci", p: ["„Nie wchodź” – czerwony krzyż.", "„Tu czekamy” – zielone kółko."] }
  ],
  tip: "Dzieciom można uczynić z ćwiczeń grę, w której liczy się czas i współpraca, a zwycięzcą jest cały zespół.",
  cwiczenie: "ĆWICZENIE „AWARIA WIECZOREM” (30 min): brak prądu, dzieci w szkole, jedno z rodziców nie odbiera. Cel: komunikacja, plan ewakuacji, współpraca. ĆWICZENIE „ZNIKAJĄCY PLECAK” (15 min): spakuj drugi zestaw w innym miejscu domu. Stopniowanie: poziom 1 – brak prądu, poziom 2 – ewakuacja, poziom 3 – rozdzielenie rodziny.",
  quiz: [
    { q: "Ile miejsc spotkań powinna ustalić rodzina?", o: ["Jedno – przed domem", "Dwa – blisko domu i poza okolicą", "Pięć"], a: 1, w: "Miejsce A blisko domu działa przy pożarze lub awarii budynku. Miejsce B poza dzielnicą działa, gdy cała okolica jest ewakuowana." },
    { q: "Który kanał CB radio jest kanałem awaryjnym?", o: ["Kanał 9", "Kanał 1", "Kanał 19"], a: 0, w: "CB kanał 9 to kanał ratunkowy, w PMR umawiamy się na kanał 3. Zapisz to na kartce w plecaku, bo w stresie pamięć zawodzi." },
    { q: "Zasada RUN – HIDE – TELL dotyczy:", o: ["Powodzi", "Ataku terrorystycznego", "Blackoutu"], a: 1, w: "Najpierw uciekaj, jeśli masz drogę. Jeśli nie, ukryj się za solidną przeszkodą i wycisz telefon. Dopiero potem informuj służby." },
    { q: "Jak wygląda oddech 4–7–8?", o: ["4 s wdech, 7 s wstrzymanie, 8 s wydech", "4 wdechy, 7 wydechów, 8 sekund przerwy", "4 minuty oddychania"], a: 0 },
    { q: "Jaki numer ma Telefon Zaufania?", o: ["112", "116 123", "999"], a: 1 }
  ]
},
{
  id: 3, nr: "Rozdział 3", tytul: "Przygotowanie zapasów",
  motto: "Przygotowanie zapasów to nie gromadzenie bez sensu, ale strategiczne planowanie.",
  intro: "Gdy pewnego zimowego wieczoru zniknie prąd, w sklepie półki będą już puste. Zapas wody, baterii, leków i konserw wydaje się zbędny, dopóki nie stanie się jedyną gwarancją przetrwania. Bez zapasów nawet najlepszy plan nie zadziała.",
  sekcje: [
    { t: "Woda", p: ["Minimum 1 galon (ok. 3,8 l) na osobę dziennie, zapas na 3 dni, najlepiej na tydzień (a nawet 2 tygodnie).", "Butelki lub kanistry z kranikiem; wodę domowej produkcji wymieniaj co 6 miesięcy.", "Filtracja: filtry grawitacyjne, tabletki lub krople chloru/jodu, wybielacz bez zapachu.", "Kalkulator: 3 l/os./dzień = 9 l/os./3 dni."] },
    { t: "Żywność", p: ["Trwałe produkty bez gotowania: konserwy, suszone owoce, miód, batony; kasze, ryż, makaron, strączkowe, liofilizaty, mleko w proszku.", "Zapasy dla dzieci (kaszki, mleko modyfikowane) i zwierząt.", "Ręczny otwieracz do puszek i przyprawy – smak wpływa na morale.", "Kalorie: 2000–2500 kcal/os./dzień. Przepisy z zapasów: zupy z konserw, naleśniki z mleka w proszku."] },
    { t: "Energia, światło, ciepło", p: ["Latarka czołowa, latarki na dynamo, lampy LED, baterie, powerbank 20 000 mAh, mata solarna.", "Generator: min. 2000 W dla lodówki i światła, zużycie ok. 0,5–1 l/h; TYLKO na zewnątrz.", "Ogrzewanie: piecyki gazowe/naftowe z czujnikiem CO, ogrzewacze chemiczne, koce NRC, namiot termiczny w pokoju.", "Kuchenka turystyczna na kartusze – tylko przy dobrej wentylacji."] },
    { t: "Zdrowie, higiena, dokumenty", p: ["Apteczka: przeciwbólowe, przeciwgorączkowe, przeciwbiegunkowe, opatrunki, antyseptyki, termometr, nożyce; leki na choroby przewlekłe (dłuższa recepta).", "Higiena: chusteczki, papier toaletowy (2 rolki/os./tydzień), mydło, żel, worki, wiadro sanitarne, maski, pulsoksymetr.", "Dokumenty w wodoodpornym etui i w chmurze; krótkofalówki PMR, radio z dynamem; multitool, taśma, koc termiczny, wodoodporne zapałki."] },
    { t: "Budżet i strategia", p: ["Plan 52 tygodnie: co tydzień jeden element zestawu.", "Koszt: minimum ok. 500 zł/os. (3 dni); optymalnie 1500–2000 zł.", "Priorytety przy małym budżecie: woda → światło i ciepło → żywność → apteczka → komunikacja i dokumenty.", "Oszczędzanie: zakupy hurtowe z sąsiadami, promocje, zamienniki."] },
    { t: "Organizacja i rotacja", p: ["Trzy zestawy: dom, praca, samochód.", "Etykiety kolorami: zielony – spożywcze, czerwony – apteczka, niebieski – higiena, żółty – energia.", "Małe mieszkanie: pudełka pod łóżkiem, szafki nad drzwiami, pawlacze. Worki próżniowe, pochłaniacze wilgoci, kontrola co 3 miesiące.", "FIFO (pierwsze weszło, pierwsze wychodzi): rotacja co 3–6 miesięcy, daty na opakowaniach; aplikacje: FoodKeeper, MyPantry, Listonic.", "Decentralizacja: część w aucie, u rodziny, plecak w pracy."] },
    { t: "Zwierzęta", p: ["Minimum 7 dni karmy, woda oznaczona dla pupila, leki (antykleszczowe, odrobaczające) z notatką dawkowania.", "Kuweta i żwirek, worki, środek odkażający do transportera.", "Ewakuacja: transporter, smycz, adresówka, kopia szczepień, karma w plecaku."] },
    { t: "Prawo, etyka, psychologia", p: ["Paliwo – maksymalnie 60 l w bańkach homologowanych; gaz – maksymalnie 2 butle po 11 kg w mieszkaniu.", "Dziel się nadwyżką, nie bazą zapasów; pamiętaj o seniorach i samotnych sąsiadach.", "Umiejętności to też zapasy (naprawa roweru, obsługa agregatu).", "Nie popadaj w paranoję: plan = spokój, nie obsesja. Zapasy = troska, nie strach."] }
  ],
  tip: "Studia przypadków: „Przeżyliśmy tylko dzięki temu, że miałam puszki i świeczki z zeszłego lata” (Sandomierz 2010). „Bez zapasowego powerbanka nie zadzwoniłbym po pomoc” (Tatry 2022).",
  cwiczenie: "Policz zapas wody w domu i podziel przez liczbę domowników × 3 l. Ile dni wytrzymacie? Zaplanuj pierwsze 4 tygodnie planu 52-tygodniowego.",
  quiz: [
    { q: "Ile wody minimum na osobę dziennie?", o: ["Ok. 1 litr", "Ok. 3,8 litra", "Ok. 10 litrów"], a: 1 },
    { q: "Co oznacza zasada FIFO?", o: ["Kupuj tylko w piątki", "Pierwsze weszło, pierwsze wychodzi", "Zamrażaj wszystko"], a: 1 },
    { q: "Jaki jest limit paliwa w domu w bańkach homologowanych?", o: ["Maksymalnie 60 l", "200 l", "Bez limitu"], a: 0 },
    { q: "Który kolor etykiety oznacza apteczkę?", o: ["Zielony", "Czerwony", "Żółty"], a: 1 },
    { q: "Co jest priorytetem numer 1 przy ograniczonym budżecie?", o: ["Woda i środki uzdatniania", "Gry planszowe", "Generator"], a: 0 }
  ]
},
{
  id: 4, nr: "Rozdział 4", tytul: "Przygotowanie domu i mieszkania",
  motto: "Dom może być zarówno schronieniem, jak i pułapką – wszystko zależy od przygotowania.",
  intro: "Ten rozdział to audyt domowych zabezpieczeń: drzwi, okna, instalacje, alternatywne źródła energii. Twój dom to twoja twierdza – upewnij się, że będzie schronieniem, a nie zagrożeniem, gdy kryzys zapuka do drzwi.",
  sekcje: [
    { t: "Przegląd konstrukcji i instalacji", p: ["Strefa powodziowa: pompa w piwnicy, zapory, ubezpieczenie od powodzi.", "Stary dach – wzmocnienie więźby; w wieżowcach rolety antyhuraganowe lub folia przeciw odłamkom.", "Wyłącznik prądu i gazu w dostępnym miejscu; czujnik czadu i dymu; listwy przepięciowe."] },
    { t: "Typy mieszkań", p: ["Domy jednorodzinne: studnia, agregat, alarm; większe ryzyko powodzi i wichur.", "Bloki: zabezpieczenia ppoż. i przepięciowe, folia antywłamaniowa, zapasy w wysokich szafkach.", "Kamienice i poddasza: stan instalacji i wentylacji, izolacja, uszczelnienie starych okien."] },
    { t: "Prawo i formalności", p: ["Sprawdź polisę – czy obejmuje katastrofy naturalne (powódź, wichura, piorun, pożar).", "Wynajem: konsultuj zmiany z właścicielem, zachowaj korespondencję.", "Materiały niebezpieczne: max 60 l paliwa; max 2 butle gazowe po 11 kg."] },
    { t: "Psychologia i komunikacja", p: ["Codzienne rytuały, strefa relaksu, planszówki, audiobooki offline, dziennik.", "Prywatność: zasłony, parawany, strefy (sen, odpoczynek, jedzenie).", "Walkie-talkie PMR (do 3 km), sygnały: latarka na balkonie = „OK”, świeczka w oknie = „pomoc”; tablica ogłoszeń; „cichy patrol”."] },
    { t: "Zabezpieczenia cyfrowe", p: ["Hasła WPA2, aktualizacje routera, lista podłączonych urządzeń.", "Folder „Awaria” fizyczny i cyfrowy: kopia dowodu, recepty, numery kont; kody QR offline."] },
    { t: "Koszty i testy", p: ["Czujniki dymu 40–150 zł; folia antywłamaniowa 80–200 zł; gaśnica 50–100 zł; generator 800–4000 zł.", "Kwartalnie – test czujników, zamków, agregatu; co pół roku – kontrola zapasów; raz do roku – ćwiczenie ewakuacji."] },
    { t: "Współpraca sąsiedzka", p: ["Spotkania raz na kwartał, tablica informacyjna, dzielone zasoby.", "Grupa wsparcia: minimum 3 gospodarstwa, role: łącznik, opiekun, techniczny; kontakt codziennie lub co 2 dni."] },
    { t: "Sezonowość", p: ["Zima: test ogrzewania awaryjnego, uszczelnienie, agregat.", "Wiosna: odpływy, zapas wody i tabletek, trening ewakuacji.", "Lato: moskitiery, apteczka (terminy!), balkon/dach.", "Jesień: świece, baterie, opał, przegląd grzewczy."] },
    { t: "Zaawansowane zabezpieczenia", p: ["Powódź: instalacja elektryczna ponad poziomem wody, pompa z zasilaniem awaryjnym.", "Wiatr: lżejsze pokrycie dachu, rolety zewnętrzne, wzmocnione krokwie.", "Pożar: czujniki w każdym pomieszczeniu, gaśnice, strefa wolna od roślin min. 30 m przy lasach.", "PV z magazynem energii, pompa ciepła z agregatem, kominek/piec; inteligentne czujniki, zamki z mechanicznym obejściem.", "Audyt raz w roku (elektryka, komin, gaz), szkolenia domowników z gaśnicy i pierwszej pomocy."] },
    { t: "Szczególne potrzeby", p: ["Seniorzy: uchwyty w łazience, apteczka z dużymi napisami, notatka z lekami na lodówce.", "Małe dzieci: pieluchy, mleko, kącik zabaw, maskotki.", "Niepełnosprawność: alternatywna trasa, ładowarka do wózka/respiratora, piktogramy."] }
  ],
  tip: "TWÓJ DOM TO TWOJA TWIERDZA. UPEWNIJ SIĘ, ŻE BĘDZIE SCHRONIENIEM – A NIE ZAGROŻENIEM – GDY KRYZYS ZAPUKA DO DRZWI.",
  cwiczenie: "POŻAR NOCĄ: ewakuacja bez światła; dzieci: chusteczka na twarz, nisko przy podłodze. BLACKOUT ZIMOWY: 12 godzin bez prądu, gotowanie i spanie w jednym pomieszczeniu. SYMULACJA POWODZI: 30 minut na zabezpieczenie dokumentów i zapasów.",
  quiz: [
    { q: "Ile butli gazowych po 11 kg wolno trzymać w mieszkaniu?", o: ["Maksymalnie 2", "5", "Bez limitu"], a: 0 },
    { q: "Sygnał „świeczka w oknie” w umówionym systemie sąsiedzkim oznacza:", o: ["OK", "Pomoc", "Impreza"], a: 1 },
    { q: "Jak często testować czujniki, zamki i agregat?", o: ["Raz na kwartał", "Raz na 10 lat", "Tylko po awarii"], a: 0 },
    { q: "Ile domostw minimum tworzy grupę wsparcia?", o: ["1", "3", "20"], a: 1 }
  ]
},
{
  id: 5, nr: "Rozdział 5", tytul: "Aspekty finansowe i dokumentacja",
  motto: "Pieniądze w kryzysie to nie tylko liczby – to bezpieczeństwo, kontrola i spokój ducha.",
  intro: "Wyobraź sobie, że system bankowy pada na kilka dni: bankomaty nie działają, karty są bez wartości, kasjerka mówi „płatność tylko gotówką”. Właściwe planowanie finansowe to niewidzialna tarcza.",
  sekcje: [
    { t: "Gotówka awaryjna", p: ["Minimum: równowartość 1–2 tygodniowych kosztów życia.", "Małe nominały (10–50 zł) i waluty obce (euro, dolar).", "Minimum dwa miejsca: dom i miejsce ewakuacyjne.", "Alternatywy: karty prepaid, karty kryptowalutowe, przedmioty do wymiany (alkohol, baterie, mydło, kawa, konserwy)."] },
    { t: "Kryptowaluty i barter", p: ["BTC i ETH; portfele sprzętowe (Ledger, Trezor); seed phrase w bezpiecznym fizycznym miejscu; instrukcje dla zaufanej osoby.", "Barter: konserwy, leki bez recepty, świeczki, higiena; usługi techniczne, medyczne, naprawcze.", "Lokalne sieci wymiany: uczciwość, przejrzystość, umowy słowne + pisemne potwierdzenia."] },
    { t: "Dokumenty", p: ["Co: dowody, paszporty, akty urodzenia, polisy, akty własności, książeczki zdrowia, zdjęcia mienia.", "Jak: wodoodporne koperty, sejf, kopie u rodziny; pendrive + szyfrowany folder (VeraCrypt); chmura z 2FA.", "Lista kont, numerów polis i kontaktów w jednym miejscu dostępnym dla zaufanej osoby."] },
    { t: "Prawo i spadek", p: ["Testament kryzysowy – własnoręczny z datą i podpisem; notarialny pewniejszy.", "Pełnomocnictwa awaryjne: decyzje medyczne i finansowe; dokumenty uznawane za granicą.", "Zabezpieczenie małoletnich: opiekunowie tymczasowi, notatka z kontaktami."] },
    { t: "Psychologia i edukacja dzieci", p: ["Oddziel decyzje logiczne od emocjonalnych; regularny przegląd finansów redukuje niepokój.", "Dzieci: liczenie gotówki, oszczędzanie na „czarną godzinę”, gra „co kupisz za 20 zł?”."] },
    { t: "Dywersyfikacja i zagranica", p: ["Limity przewozu gotówki (UE: do 10 000 euro bez deklaracji); konta Revolut, N26.", "Proporcje: gotówka 30–40%, kryptowaluty 10–20%, wartości rzeczowe (złoto, srebro) 20%, karty i konta zagraniczne 10–20%."] },
    { t: "Długoterminowo", p: ["Fundusz awaryjny na 3 miesiące wydatków; część w banku (oddalonym oddziale), część w domu.", "Automatyczne oszczędzanie – stałe zlecenie np. 10% wynagrodzenia.", "Ubezpieczenia na życie i zdrowotne; obligacje skarbowe, fundusze indeksowe, metale szlachetne; twarde waluty.", "Zgłaszanie szkód: wzory formularzy, zdjęcia natychmiast, dziennik kosztów, paragony.", "Zadłużenie: negocjuj wakacje kredytowe, spłacaj najpierw najwyżej oprocentowane, nie zaciągaj pożyczek konsumpcyjnych."] }
  ],
  tip: "Zadbaj o to, by móc działać, a nie panikować.",
  cwiczenie: "SYMULACJA: weekend bez dostępu do konta bankowego (tylko gotówka). Scenariusz: „Bank zablokował środki – co robisz?”. Ewaluacja: co zadziałało, gdzie zabrakło zasobu, jak poprawić system?",
  quiz: [
    { q: "Twoje tygodniowe koszty życia to 900 zł. Ile gotówki trzymać w kopercie awaryjnej?", o: ["Około 100 zł", "900–1800 zł, czyli koszty 1–2 tygodni", "Wszystkie oszczędności"], a: 1, w: "Rezerwa ma pokryć 1–2 tygodnie życia w małych nominałach. Reszta oszczędności zostaje na koncie i w innych formach." },
    { q: "Jaki jest limit przewozu gotówki w UE bez deklaracji?", o: ["1 000 euro", "10 000 euro", "100 000 euro"], a: 1 },
    { q: "Fundusz awaryjny powinien pokrywać wydatki na:", o: ["3 miesiące", "3 dni", "3 lata"], a: 0 },
    { q: "Testament kryzysowy własnoręczny wymaga:", o: ["Daty i podpisu", "Pieczęci urzędu", "Świadka z policji"], a: 0 }
  ]
},
{
  id: 6, nr: "Rozdział 6", tytul: "System alarmowania i ostrzegania w Polsce",
  motto: "Alarm to nie powód do paniki. To sygnał, że czas zaczać działać.",
  intro: "Czasem mamy tylko sekundy. System w Polsce jest wielowarstwowy: syreny, alerty RCB, Regionalny System Ostrzegania, radio, TV, aplikacje. Nie polegaj na jednym źródle – używaj kilku kanałów równolegle.",
  sekcje: [
    { t: "Rodzaje sygnałów syren", p: ["Alarm powietrzny: modulowany dźwięk przez 3 minuty.", "Odwołanie alarmu: ciągły dźwięk przez 3 minuty.", "Testy syren: zazwyczaj w pierwsze poniedziałki miesiąca – krótkie, przerywane sygnały (np. 1 min zamiast 3), zapowiadane w mediach."] },
    { t: "Alerty RCB i źródła", p: ["SMS z Rządowego Centrum Bezpieczeństwa bez rejestracji; lokalne alerty gminy wymagają rejestracji.", "Strony i aplikacje: gov.pl/web/rcb, Alarm112, Bezpieczna Polska, RSO, IMGW, mObywatel.", "Radio: Polskie Radio (Solec Kujawski) działa w warunkach awaryjnych.", "Media społecznościowe – tylko oficjalne konta, jako uzupełnienie."] },
    { t: "Osoby z niepełnosprawnościami i zagranica", p: ["Niesłyszący: systemy wibracyjne, lampy alarmowe, powiadomienia wizualne.", "EU-Alert – europejski system; przed podróżą sprawdź lokalne sygnały, korzystaj z aplikacji i ambasad."] },
    { t: "Obiekty specjalne", p: ["Szkoły: ewakuacja, „lockdown”, regularne ćwiczenia.", "Centra handlowe: komunikaty głosowe i świetlne, ochrona.", "Zakłady pracy: obowiązkowe procedury, sygnalizatory."] },
    { t: "Psychologia alarmu", p: ["Naturalne: lęk, panika, szok – działaj według planu; oddech 4–7–8, fraza „Jestem przygotowany”.", "Dzieci: sygnały to „dźwięki ochrony”; zamień ćwiczenie w grę.", "Seniorzy: kartka z instrukcją blisko telefonu."] },
    { t: "Społeczność i prawo", p: ["Sąsiedzkie sieci: grupa SMS, Zello, osoba informująca seniorów; znajomość lokalnego planu kryzysowego (BIP).", "Fałszywy alarm podlega karze grzywny lub więzienia.", "Obowiązki: reaguj na sygnały, przestrzegaj poleceń służb, nie przeszkadzaj ratownikom.", "Przyszłość: drony z głośnikami, aplikacje z geolokalizacją do schronów, IoT."] },
    { t: "Zawsze bądź na bieżąco", p: ["Zarejestruj numer w Alert RCB i gminnym systemie SMS.", "Zainstaluj IMGW, MeteoAlarm, mObywatel; przygotuj powerbank.", "Monitoruj wiele źródeł; ustaw alerty na hasła „ewakuacja”, „powódź”, „blackout”.", "Własna sieć informacji: kto nasłuchuje radia, kto monitoruje aplikacje, kto pilnuje osób niesłyszących."] }
  ],
  tip: "Podczas testów syren w pierwszy poniedziałek miesiąca zwróć uwagę na różnicę między sygnałem alarmu a testem. Zepsutą syrenę zgłoś do gminy.",
  cwiczenie: "QUIZ ALARMOWY z rodziną: „co robisz, gdy usłyszysz X?”. Symulacja alarmu w domu: gasimy światła, włączamy radio, sprawdzamy zapasy; zmiana ról – dziecko jako lider. Raz na kwartał test planu, raz na miesiąc przypomnienie sygnałów.",
  quiz: [
    { q: "Modulowany dźwięk syreny przez 3 minuty to:", o: ["Alarm powietrzny", "Odwołanie alarmu", "Test"], a: 0 },
    { q: "Ciągły dźwięk przez 3 minuty to:", o: ["Alarm powietrzny", "Odwołanie alarmu", "Pożar"], a: 1 },
    { q: "Kiedy zazwyczaj odbywają się testy syren?", o: ["W pierwsze poniedziałki miesiąca", "W każdą niedzielę", "Nigdy"], a: 0 },
    { q: "Fałszywy alarm:", o: ["Jest dozwolony", "Podlega karze grzywny lub więzienia", "Jest tylko upomnieniem"], a: 1 }
  ]
},
{
  id: 7, nr: "Rozdział 7", tytul: "Ewakuacja",
  motto: "Ewakuacja to nie „ucieczka w panice”. To przemyślana decyzja, która może uratować życie.",
  intro: "Nie każdy kryzys wymaga opuszczenia domu, ale każdy może do tego zmusić. Najważniejsza jest torba ewakuacyjna spakowana z wyprzedzeniem i plan: dokąd, którędy, z kim.",
  sekcje: [
    { t: "Decyzja: zostać czy jechać?", p: ["Ewakuuj się samodzielnie: sygnał o nieuchronnym zagrożeniu (fala powodziowa, ostrzał); znikają media i zagrożenie narasta; pożar, awaria chemiczna w pobliżu.", "Czekaj na ewakuację zorganizowaną: brak transportu, dzieci, osoby z niepełnosprawnością; brak wiedzy o trasach; oczekiwanie na eskortę.", "Jeśli czekasz – nie czekaj biernie: szykuj torby, planuj wyjście, przygotuj dzieci."] },
    { t: "Ostatnie czynności przed wyjściem", p: ["Zgarnij plecak i dokumenty.", "Odłącz prąd i gaz (jeśli to możliwe). Zgaś światła i świece.", "Zostaw wiadomość na drzwiach (np. „Ewakuowano: 4 osoby, kierunek – Gliwice”).", "Weź zwierzęta – z miską, paszportem, karmą na 3 dni.", "Przy drzwiach trzymaj kopertę z planem i papierową mapą – bez prądu Google Maps nie pomoże."] },
    { t: "Trasy i nawigacja", p: ["Główna trasa + minimum 2 alternatywne; omijaj mosty, wiadukty, osiedla zamknięte.", "Punkty odpoczynku: szkoły, kościoły, OSP, stacje benzynowe.", "Bez GPS: papierowa mapa + kompas; aplikacje offline (Maps.me, OsmAnd)."] },
    { t: "Przemieszczanie się", p: ["Pieszo: 3–5 km/h z dziećmi; dobre buty, ochrona przeciwdeszczowa, kamizelka odblaskowa.", "Samochód: zawsze minimum ½ baku; kanister; torba z wodą, jedzeniem i apteczką przy kierowcy.", "Transport publiczny: bilety awaryjne, notuj godziny, unikaj zatłoczonych węzłów.", "LIFE HACK: rower – najlepszy kompromis między pieszą ewakuacją a brakiem paliwa.", "Zasada „3 × S”: SCHOWAJ SIĘ, SŁUCHAJ, SPRAWDŹ."] },
    { t: "Dzieci i osoby wymagające opieki", p: ["„Nienudne pudełko” – kredki, karty, zabawki sensoryczne.", "Dziecko ma przy sobie: imię i nazwisko, grupę krwi, kontakt do opiekuna, kartę ICE.", "Gry: „Tajemnicze plecaki” (losuje przedmiot i opowiada, do czego się przyda), „Misja Czerwona Latarka” (chroni bazę nocą, oswaja ciemność).", "Playlista bajek offline, nagrania głosowe rodziców."] },
    { t: "Specyfika zagrożeń", p: ["Powódź: omijaj doliny, podziemia, mosty; nie wchodź do wody powyżej kolan.", "Konflikt zbrojny: z dala od głównych dróg i infrastruktury; nic przypominającego mundur; unikaj obcych oddziałów.", "Chemia/pożar: maseczka FFP3 lub improwizowana; kieruj się pod wiatr; nie siadaj na ziemi."] },
    { t: "Przed, podczas i po", p: ["Przed: alternatywne miejsca schronienia w różnych kierunkach, osoba kontaktowa spoza strefy, samochód z ½ baku i zapasową oponą.", "Podczas: aplikacja z wykazem schronisk, radio bateryjne, wyjedź wcześnie, zabezpiecz dom, nigdy nie wjeżdżaj w zalane ulice.", "Po: nie wracaj, dopóki władze nie potwierdzą bezpieczeństwa; generator tylko na zewnątrz; omijaj linie energetyczne; nie pij wody z kranu do czasu przebadania."] }
  ],
  tip: "Zgierz, pożar składowiska 2018: „Dopiero gdy zadzwoniła córka z Warszawy, zaczęliśmy się pakować. Służby przyszły 3 godziny później”.",
  cwiczenie: "CHECKLISTA przed opuszczeniem domu: odłączony prąd/gaz; plecak i dokumenty; kartka na drzwiach; woda i jedzenie na 3 dni; apteczka i leki stałe; zwierzęta zabezpieczone; mapa i trasy.",
  quiz: [
    { q: "Ile paliwa minimum powinno być zawsze w baku?", o: ["Pełny bak", "Co najmniej ½ baku", "Rezerwa"], a: 1 },
    { q: "Do jakiej wysokości wody można wejść podczas powodzi?", o: ["Nie powyżej kolan", "Do pasa", "Do szyi"], a: 0 },
    { q: "Ile alternatywnych tras planujemy oprócz głównej?", o: ["Minimum 2", "Żadnej", "10"], a: 0 },
    { q: "Zasada „3 × S” to:", o: ["Schowaj się, Słuchaj, Sprawdź", "Szybko, Sprawnie, Skutecznie", "Spakuj, Startuj, Spiesz się"], a: 0 },
    { q: "Przy skażeniu chemicznym kierujesz się:", o: ["Z wiatrem", "Pod wiatr, z dala od dymu", "Do piwnicy na ziemię"], a: 1 }
  ]
},
{
  id: 8, nr: "Rozdział 8", tytul: "Schronienie się w miejscu",
  motto: "Nie zawsze można uciec. Czasem najbezpieczniejsze miejsce to twój dom.",
  intro: "„Nie wychodź z domu, zamknij okna, wyłącz wentylację” – w takim momencie mieszkanie staje się fortecą. Izolacja może trwać kilka godzin albo kilka dni. Kluczowe są przygotowanie, opanowanie i organizacja.",
  sekcje: [
    { t: "Kiedy zostać?", p: ["Brak informacji o konieczności ewakuacji.", "Drogi zablokowane, pogoda skrajnie niebezpieczna.", "Masz schronienie o dobrej lokalizacji i zapasach.", "Ewakuacja zwiększa ryzyko – ostrzał, zamieszki, blackout.", "LIFE HACK: nawet planując ewakuację, miej gotowy pokój schronienia."] },
    { t: "Publiczne schrony i ukrycia", p: ["Schrony obrony cywilnej (szkoły, urzędy, stacje), ukrycia doraźne (piwnice, garaże, tunele), punkty gminne.", "Aplikacja „Schrony” pokazuje najbliższy punkt.", "W schronie: cisza, współpraca z opiekunem/OSP, porządek."] },
    { t: "Wybór i adaptacja pomieszczenia", p: ["Brak okien lub maksymalnie jedno; grube ściany; środkowa część budynku (łazienka, spiżarnia, korytarz).", "Zasłoń okna (koce, karimaty, folie), oznacz strefy: spania, sanitarna, żywnościowa, komunikacyjna.", "Oświetlenie awaryjne czerwone lub zielone – nie męczy wzroku, nie przyciąga uwagi.", "Dzwonek przy wejściu (puszka z kapslami) – prosty alarm.", "„Zestaw schronowy”: materac, koc termiczny, apteczka, radio, latarka, baterie, jedzenie i woda na 48 h, dokumenty, powerbank."] },
    { t: "Ostrzał / bombardowanie", p: ["Zasada „dwóch ścian” – minimum 2 ściany nośne między tobą a zewnętrzem.", "Meble jako osłony odłamkowe; pozycja ochronna: na boku, ręce przy głowie, nogi lekko ugięte."] },
    { t: "Skażenie CBRN", p: ["Uszczelnij okna i drzwi (taśma malarska, folia, mokre koce); wyłącz wentylację mechaniczną.", "Maski FFP3, chirurgiczne lub improwizowane; filtry z węgla aktywnego.", "Butelka PET + wata + węgiel aktywny = prowizoryczny filtr powietrza.", "Co jakiś czas wymień powietrze – uniknij zatrucia CO₂."] },
    { t: "Pogoda ekstremalna", p: ["Burze: z dala od instalacji elektrycznych i okien.", "Mrozy: „namiot termiczny” – koce wokół jednej strefy spania.", "Wichury: rolety, meble z dala od okien."] },
    { t: "Higiena i psychologia", p: ["Toaleta sucha: wiadro + worek biodegradowalny + trociny; odpady w szczelnych workach na zewnątrz; olejki (lawenda, mięta).", "Harmonogram dnia: posiłki, odpoczynek, rozmowy, cisza; licz godziny, nie dni.", "Role dla dzieci: „strażnik światła”, „kontroler zapasów”.", "Oddech 4–7–8, dziennik, nagrania głosów bliskich.", "Sygnały rodzinne (np. trzy uderzenia w ścianę), interkom z walkie-talkie."] }
  ],
  tip: "Mariupol 2022: „Mieliśmy mały zeszyt, gdzie każdy zapisywał jedną rzecz dziennie. Dla nas to był dowód, że żyjemy”.",
  cwiczenie: "Wybierz w swoim domu pomieszczenie schronienia według kryteriów (bez okien, środek budynku, 2 ściany). Przenieś tam zestaw schronowy w 10 minut. Zmierz czas.",
  quiz: [
    { q: "Zasada „dwóch ścian” oznacza:", o: ["Dom musi mieć dwa piętra", "Minimum 2 ściany nośne między tobą a zewnętrzem", "Dwa wyjścia ewakuacyjne"], a: 1 },
    { q: "Jaki kolor światła zaleca się w schronieniu?", o: ["Białe, jak najjaśniejsze", "Czerwone lub zielone", "Niebieskie"], a: 1 },
    { q: "Przy skażeniu chemicznym wentylację mechaniczną:", o: ["Włączasz na maksimum", "Wyłączasz", "Nie ma znaczenia"], a: 1 },
    { q: "Zestaw schronowy zawiera jedzenie i wodę na:", o: ["48 godzin", "2 godziny", "30 dni"], a: 0 }
  ]
},
{
  id: 9, nr: "Rozdział 9", tytul: "Przetrwanie bez mediów",
  motto: "Blackout nie zabija. Ale wyłącza społeczeństwo.",
  intro: "Nagle znika prąd, a z nim internet, bankowość, ogrzewanie, bieżąca woda, telefon. To najbardziej prawdopodobny kryzys współczesnej Polski. Naucz się żyć „w offlinie” – przez 1 dzień, 3 dni, a może dłużej.",
  sekcje: [
    { t: "Organizacja dnia", p: ["Wstawaj i kładź się z naturalnym światłem; bloki: gotowanie, praca, odpoczynek, higiena.", "Po zmroku ogranicz ruch i używaj czerwonego światła – oszczędza wzrok i baterie.", "Wyznacz osoby odpowiedzialne za wodę, jedzenie i komunikację."] },
    { t: "Oświetlenie", p: ["Latarki czołowe, lampki LED na USB, świece tylko pod nadzorem, lampy naftowe tylko w wentylowanych pomieszczeniach.", "„Latarka butelkowa”: butelka PET z wodą + latarka = rozproszone światło w całym pomieszczeniu.", "Nigdy nie włączaj generatora w domu – tlenek węgla zabija."] },
    { t: "Żywność bez chłodzenia", p: ["Chłodne, ciemne miejsce: piwnica, skrzynia z lodem, balkon zimą.", "Mięso i mleko zjadaj jako pierwsze.", "Chłodziarka improwizowana: wiadro + glina + mokry piasek („lodówka pustynna”)."] },
    { t: "Gotowanie", p: ["Kuchenka turystyczna, palnik spirytusowy, kuchenka rakietowa z cegieł lub puszek, ognisko na zewnątrz.", "Dania jednogarnkowe, kasze, makarony, konserwy z wrzątkiem, zupy instant.", "Zapas 2 kg drewna i rozpałki; 3 posiłki dziennie dla 2 osób = ok. 1,5 kg drewna."] },
    { t: "Woda – pozyskanie i uzdatnianie", p: ["Źródła: studnia, deszczówka (do celów technicznych), fontanny i cieki (ostrożnie – skażenie!).", "Gotowanie min. 5 min – bakterie i wirusy, bez ochrony przed chemikaliami.", "Filtracja improwizowana (węgiel aktywny + tkanina + piasek) – osady i część bakterii.", "Tabletki (chlor/jod) – pełne oczyszczanie. Destylacja – pełne, ale czasochłonne.", "Filtr domowy: butelka PET, tkanina, węgiel, piasek, żwir. Po filtracji ZAWSZE gotuj lub użyj tabletki."] },
    { t: "Higiena", p: ["Toaleta sucha: wiadro + worek + trociny lub popiół; worki w zamykanym pojemniku.", "Mycie: 1–2 l wody dziennie na osobę; chusteczki, spirytus salicylowy; mycie rąk po każdej czynności „zewnętrznej”.", "„Prysznic” z butelki z dziurkami. Pranie w misce lub worku próżniowym, płukanie w 2–3 etapach."] },
    { t: "Komunikacja bez sieci", p: ["Radio na korbkę/baterie – RCB i PR1; CB/krótkofalówki do 3 km.", "Kody świetlne: czerwone = niebezpieczeństwo, zielone = zgoda, pomarańczowe = ostrzeżenie.", "SOS: trzy krótkie – trzy długie – trzy krótkie.", "Flagi: czerwona – „ranny, potrzebna pomoc”; biała – „pokój/kapitulacja”; pomarańczowa – „chcę być odnaleziony” (lotnictwo); zielona – „w porządku”."] }
  ],
  tip: "Naucz dzieci rozróżniania świateł i prostych gestów alarmowych – to zwiększa ich poczucie sprawczości i bezpieczeństwa.",
  cwiczenie: "Wieczór bez prądu: wyłącz bezpieczniki na 3 godziny. Przygotuj posiłek bez prądu, zrób „latarkę butelkową”, przećwicz sygnał SOS latarką.",
  quiz: [
    { q: "Sygnał SOS to:", o: ["Trzy krótkie – trzy długie – trzy krótkie", "Jeden długi", "Pięć krótkich"], a: 0 },
    { q: "Ile minut minimum należy gotować wodę?", o: ["1 minutę", "Minimum 5 minut", "30 sekund"], a: 1 },
    { q: "Pomarańczowa tkanina oznacza:", o: ["W porządku", "Chcę być odnaleziony", "Kapitulacja"], a: 1 },
    { q: "Generator uruchamiamy:", o: ["W kuchni", "W piwnicy", "Tylko na zewnątrz"], a: 2 },
    { q: "Po filtracji improwizowanej wodę należy:", o: ["Pić od razu", "Zawsze przegotować lub użyć tabletki", "Zamrozić"], a: 1 }
  ]
},
{
  id: 10, nr: "Rozdział 10", tytul: "Postępowanie w sytuacjach wojennych",
  motto: "Wojna to chaos, nieprzewidywalność i zaskoczenie. Ten rozdział pomoże ci przeżyć – jako świadomy i przygotowany cywil.",
  intro: "W 2022 roku sąsiedzi z Ukrainy dowiedzieli się, jak niewyobrażalne może stać się codziennością w jeden poranek. Podczas wojny liczą się sekundy po syrenie, miejsce schronienia i minimalizacja ekspozycji.",
  sekcje: [
    { t: "Podstawowa zasada: „padnij i osłoń się”", p: ["Po eksplozji upadaj na ziemię, zakryj głowę, czekaj kilka sekund – kolejna może nastąpić zaraz.", "Po alarmie zejdź na najniższą kondygnację lub do piwnicy; miejsce między dwiema ścianami nośnymi, bez okien.", "Nie używaj telefonu przy oknie; nie wychylaj się, by filmować.", "Ćwicz z dziećmi „padnij i osłoń się” raz w tygodniu – jak zapięcie pasów."] },
    { t: "Rodzaje ostrzałów", p: ["Artyleryjski – wolniejszy, słychać nadlatujący pocisk.", "Lotniczy – huk i wybuch niemal równocześnie.", "Rakietowy/dronowy – szybki, bez ostrzeżenia.", "Pozycja ochronna: na boku, dłonie na karku, kolana ugięte, usta otwarte (redukcja ciśnienia akustycznego). Czas reakcji 5–15 sekund."] },
    { t: "Skażenia CBRN", p: ["Rozpoznanie: dziwny zapach (migdałowy, chlorowy), mdłości, pieczenie oczu, ptaki spadające z drzew, cisza zwierząt.", "Uszczelnij się; zmień odzież (do worka); oddychaj przez filtr (węgiel aktywny, wilgotna tkanina).", "Dezynfekcja: mycie skóry wodą z mydłem (nie gorącą), płukanie oczu, wyrzucenie butów, rękawic, czapek."] },
    { t: "Miny, niewybuchy, pułapki", p: ["Nigdy nie dotykaj porzuconego sprzętu, paczek, telefonów.", "Oznacz strefę (sznurek, taśma, spray), zapamiętaj lokalizację, zgłoś służbom."] },
    { t: "Sytuacje zakładnicze i kontrole", p: ["Neutralny wzrok, krótkie spokojne wypowiedzi, bez emocji.", "Dokumenty w przezroczystej koszulce – nie grzeb w plecaku bez pytania.", "W niewoli: zapamiętuj nazwiska, miejsca, daty; dbaj o relacje; nie fantazjuj, nie graj bohatera."] },
    { t: "Okupacja i opór cywilny", p: ["Nie wychylaj się, przestrzegaj zakazów (godzina policyjna), unikaj skupisk.", "Fałszywa „torba cywilna” z książką i kubkiem; nie noś wartościowych rzeczy w widocznym plecaku.", "Bierny opór, pomoc sąsiedzka, dokumentowanie zbrodni (zdjęcia, notatki).", "ZAWSZE działaj tak, jakbyś miał wrócić do swojego życia po wojnie. Prowadź dziennik, dbaj o etykę."] },
    { t: "Informacja", p: ["Wybieraj oficjalne źródła: rząd, wojsko, lokalne władze; radio na baterie.", "Nie ufaj plotkom na WhatsAppie i w mediach społecznościowych."] }
  ],
  tip: "Helena, lat 83, Lwów 1939: „Nagle ktoś krzyknął: ‘Samoloty!’. Biegliśmy pod most, a potem do lasu. Nic nie zabraliśmy. Ojciec został. Przepadł”.",
  cwiczenie: "Przećwicz z rodziną komendę „padnij i osłoń się” oraz przejście do miejsca spełniającego zasadę dwóch ścian. Cel: poniżej 15 sekund.",
  quiz: [
    { q: "Ile sekund reakcji może uratować życie przy ostrzale?", o: ["5–15 sekund", "5 minut", "Godzina"], a: 0 },
    { q: "Co robisz z porzuconym sprzętem wojskowym lub paczką?", o: ["Sprawdzam, co w środku", "Nie dotykam, oznaczam strefę, zgłaszam", "Zabieram do domu"], a: 1 },
    { q: "Pozycja ochronna przy wybuchu:", o: ["Na plecach z zamkniętymi ustami", "Na boku, dłonie na karku, kolana ugięte, usta otwarte", "Na stojąco przy oknie"], a: 1 },
    { q: "Podczas kontroli wojskowej:", o: ["Patrzysz wyzywająco", "Zachowujesz neutralność, mówisz krótko i spokojnie", "Uciekasz"], a: 1 }
  ]
},
{
  id: 11, nr: "Rozdział 11", tytul: "Klęski żywiołowe w Polsce",
  motto: "Nie potrzeba wojny, by stracić dom. Wystarczy kilkadziesiąt minut silnego deszczu.",
  intro: "Powódź 1997: ponad 160 tysięcy ewakuowanych, straty w miliardach. 2010 – woda znów wdarła się do miast. Susze, wichury, tornada, pożary lasów, fale upałów, osuwiska, gradobicia i śnieżyce – Polska nie jest wolna od katastrof.",
  sekcje: [
    { t: "Powodzie", p: ["Fazy: ostrzeżenie hydrologiczne → stan alarmowy → zalanie.", "Zabezpieczenie: piasek, worki, deski; odłączenie prądu i gazu na głównym zaworze; dokumenty i elektronika w workach strunowych.", "Nie chodź po wodzie – 15 cm wystarczy, by porwać dorosłego. Nie przejeżdżaj przez zalane drogi.", "Powrót: ocena techniczna budynku, osuszanie warstwowe, myjka parowa i środki grzybobójcze – wilgoć = pleśń.", "Zainstaluj aplikację IMGW lub gminne alerty SMS."] },
    { t: "Wichury i huragany", p: ["Sprawdź dach, anteny, kominy, rynny – jesienią; przytnij drzewa.", "Jedno pomieszczenie bez okien do ukrycia.", "„Pakiet wichurowy”: folia budowlana, gwoździe, taśma naprawcza do łatania dachu."] },
    { t: "Burze z gradem i piorunami", p: ["Nie używaj telefonu przewodowego, nie dotykaj metalu; unikaj szyb i okien.", "Na otwartej przestrzeni: kucnij, nie kładź się.", "Instalacja odgromowa; tymczasowe uziemienie (pręt w ziemi)."] },
    { t: "Śnieżyce i mrozy", p: ["Zaizoluj rury przy fundamentach i na poddaszach.", "Opał lub alternatywne ciepło (koza, grzejnik olejowy, namiot termiczny); powerbank i światło.", "Bieszczady 2021: „Trzy dni bez prądu… Bez sąsiadów nie przetrwalibyśmy”."] },
    { t: "Pożary", p: ["Budynki: przećwicz drogę ewakuacyjną z dziećmi z zasłoniętymi oczami; nisko przy podłodze; nigdy nie otwieraj gorących drzwi.", "„Maska przeciwdymna”: mokry ręcznik + torebka strunowa z otworami.", "Lasy i łąki: obserwuj wiatr i dym – uciekaj prostopadle; nie chowaj się w zaroślach; jeśli nie możesz uciec – połóż się na spalonym terenie, osłoń głowę, oddychaj przez mokrą tkaninę."] },
    { t: "Osuwiska", p: ["Rozpoznanie: pęknięcia w ziemi, pochylone drzewa i płoty, woda sącząca się w nietypowych miejscach.", "Opuść budynek przy pierwszych oznakach; unikaj zboczy po deszczach; dokumentuj zmiany."] },
    { t: "Sezonowe zagrożenia w Polsce", p: ["Styczeń–luty: mrozy, śnieżyce, awarie sieci.", "Marzec–kwiecień: powodzie roztopowe, burze.", "Maj–czerwiec: nawałnice, pożary traw.", "Lipiec–sierpień: susze, burze z gradem.", "Wrzesień–październik: huragany, osuwiska, mgły.", "Listopad–grudzień: gołoledź, przerwy w dostawie prądu."] }
  ],
  tip: "Bogatynia 2010: „Woda wchodziła do domu szybciej, niż mogliśmy wynosić rzeczy. Zabraliśmy tylko dzieci i dokumenty. Po godzinie nie było już nic”.",
  cwiczenie: "Sprawdź, czy twoja gmina ma mapę zagrożeń powodziowych i gdzie jest twoja strefa ewakuacyjna. Przygotuj „pakiet wichurowy”.",
  quiz: [
    { q: "Ile cm wody wystarczy, by porwać dorosłą osobę?", o: ["15 cm", "1 metr", "2 metry"], a: 0 },
    { q: "Podczas burzy na otwartej przestrzeni:", o: ["Kładziesz się na ziemi", "Kucasz", "Stajesz pod drzewem"], a: 1 },
    { q: "Przed pożarem lasu uciekasz:", o: ["Z wiatrem", "Prostopadle do kierunku wiatru", "W gęste zarośla"], a: 1 },
    { q: "Gorących drzwi podczas pożaru:", o: ["Nigdy nie otwierasz", "Otwierasz szybko", "Otwierasz kopnięciem"], a: 0 },
    { q: "Osuwisko zapowiadają m.in.:", o: ["Pochylone drzewa i płoty, pęknięcia w ziemi", "Silny wiatr", "Spadek temperatury"], a: 0 }
  ]
},
{
  id: 12, nr: "Rozdział 12", tytul: "Pierwsza pomoc w warunkach kryzysowych",
  motto: "Pogotowie może nie dojechać. Apteki mogą być zamknięte. To twoje decyzje decydują o życiu.",
  intro: "W kryzysie możesz być jedyną osobą zdolną do udzielenia pomocy. Nie musisz być lekarzem – czasem wystarczy kilka chwil i zdrowy rozsądek. Ratuj życie, nie diagnozuj.",
  sekcje: [
    { t: "Algorytm ABCDE", p: ["A – Airway: udrożnij drogi oddechowe (odgięcie głowy, usunięcie ciała obcego).", "B – Breathing: sprawdź oddech (ruch klatki, dźwięk, ciepło na policzku).", "C – Circulation: krwawienia, puls – uciśnij ranę lub załóż opaskę.", "D – Disability: świadomość, reakcja źrenic.", "E – Exposure: obejrzyj całe ciało; chroń przed hipotermią (folia NRC)."] },
    { t: "RKO – resuscytacja", p: ["Dorośli: sprawdź oddech 10 s; brak → 30 uciśnięć + 2 wdechy, tempo 100–120/min, głębokość 5–6 cm.", "Dzieci: najpierw 5 wdechów ratowniczych, potem 15 uciśnięć + 2 wdechy.", "AED: włącz, usuń ubranie, przyklej elektrody, słuchaj komunikatów.", "Bez maseczki – skup się tylko na uciśnięciach. To też działa."] },
    { t: "Krwotoki", p: ["Tętniczy – jasna, pulsująca; żylny – ciemna, sącząca; kapilarny – powierzchniowy.", "Ucisk bezpośredni → opatrunek uciskowy (bandaż + twardy przedmiot) → opaska uciskowa tylko przy masywnych krwotokach kończyn (zapisz godzinę!).", "Zamiast stazy: pas, szalik, sznurek – NIE taśma izolacyjna (przecina skórę)."] },
    { t: "Rany", p: ["Przemyj wodą z mydłem lub przegotowaną z solą; ciała obce usuwaj tylko z powierzchni.", "Dezynfekcja: spirytus salicylowy, woda utleniona, jodyna.", "Improwizowane opatrunki: bawełna, chusteczki; podpaski – sterylne i chłonne."] },
    { t: "Złamania", p: ["Ból, obrzęk, zniekształcenie – nie nastawiaj.", "Szyny: listwy, karton, książki; bez szyny – unieruchom do drugiej kończyny lub tułowia; nie uciskaj za mocno."] },
    { t: "Oparzenia", p: ["I° zaczerwienienie, II° pęcherze, III° martwica i brak czucia.", "Schładzaj zimną wodą (nie lodem!) min. 15 minut; nie przebijaj pęcherzy; czysty opatrunek.", "Bez opatrunku – folia spożywcza: jałowa, nie przykleja się."] },
    { t: "Hipotermia i odmrożenia", p: ["Hipotermia: dygotanie → spowolnienie → utrata świadomości. Ogrzewaj od tułowia, ciepłe napoje bez alkoholu.", "Odmrożenia: nie pocieraj! Ogrzewaj powoli (ciepłe dłonie, letnia woda).", "„Namiot termiczny” z koców lub folii wokół osoby."] },
    { t: "Apteczka rozszerzona", p: ["Opatrunkowe: gaza, bandaże, plastry, kompresy.", "Leki: paracetamol, ibuprofen, przeciwbiegunkowe.", "Narzędzia: nożyczki, pęseta, rękawiczki, termometr.", "Antyseptyki: woda utleniona, spirytus, jodyna. Inne: koc ratunkowy, agrafki, taśma."] }
  ],
  tip: "Pamiętaj – ratuj życie, nie diagnozuj. Twoim celem jest utrzymać funkcje życiowe do momentu przekazania służbom.",
  cwiczenie: "Zapisz się na kurs pierwszej pomocy. W domu przećwicz na poduszce tempo uciśnięć 100–120/min (rytm piosenki „Stayin’ Alive”). Skompletuj apteczkę według tabeli.",
  quiz: [
    { q: "RKO u dorosłego:", o: ["30 uciśnięć + 2 wdechy", "15 uciśnięć + 2 wdechy", "5 uciśnięć + 5 wdechów"], a: 0 },
    { q: "RKO u dziecka zaczynasz od:", o: ["5 wdechów ratowniczych", "30 uciśnięć", "Podania wody"], a: 0 },
    { q: "Oparzenie schładzasz:", o: ["Lodem 1 minutę", "Zimną wodą min. 15 minut", "Gorącą wodą"], a: 1 },
    { q: "Odmrożone miejsce:", o: ["Mocno pocierasz", "Nie pocierasz, ogrzewasz powoli", "Polewasz wrzątkiem"], a: 1 },
    { q: "Litera „A” w ABCDE oznacza:", o: ["Airway – drogi oddechowe", "Alarm", "Ambulans"], a: 0 }
  ]
},
{
  id: 13, nr: "Rozdział 13", tytul: "Zdrowie i higiena w długotrwałym kryzysie",
  motto: "Pierwsze dni kryzysu to adrenalina. Prawdziwym testem są dni piąty, dziesiąty, dwudziesty…",
  intro: "Największym wrogiem higieny jest brak wody – trzeba nauczyć się ją oszczędzać i wykorzystywać wielokrotnie. Zdrowie psychiczne jest równie ważne: rutyna, ruch, dziennik, kontakt z ludźmi.",
  sekcje: [
    { t: "Profilaktyka chorób zakaźnych", p: ["Woda do picia przegotowana lub uzdatniona; pitna i techniczna w osobnych pojemnikach.", "Chorzy izolowani w osobnych strefach; przedmioty chorego oznacz kolorową taśmą.", "Środki dezynfekcyjne: spirytus 70%, ocet, sól; wybielacz 5 ml na 1 l wody; popiół z ogniska do rąk i toalet suchych."] },
    { t: "Choroby przewlekłe", p: ["Przed kryzysem: większy zapas leków od lekarza, zamienniki bez recepty, wydrukowana lista leków i dawek.", "Nigdy nie gromadź leków na własną rękę bez wiedzy lekarza.", "Monitorowanie: termometr, notatnik zdrowia, oznaczenie osób ryzyka (cukrzyca, padaczka, astma, serce)."] },
    { t: "Osoby szczególnej troski", p: ["Dzieci: mleko modyfikowane, kaszki, syropy przeciwgorączkowe, „nienudne pudełko”.", "Zabawy bez technologii: zgadywanki z dźwięków, teatr cieni z latarką.", "Seniorzy: ryzyko odwodnienia, leki nasercowe, witamina D, toaleta blisko.", "Niepełnosprawność: wózki, aparaty, inhalatory, baterie, asystent w rodzinie/sąsiedztwie."] },
    { t: "Żywienie w niedoborach", p: ["2000–2500 kcal dorosły, 1200–1800 kcal dziecko; kaloryczne produkty o małej objętości: orzechy, płatki, mleko w proszku, kasze.", "Białko: fasola, groch, konserwy; węglowodany: makaron, ryż, kasza, suchary; tłuszcze: olej, smalec, orzechy; witaminy: suszone owoce, tabletki.", "10 słoików „posiłków instant” – kasza z soczewicą i suszonymi warzywami, zalać wrzątkiem."] },
    { t: "Higiena w ograniczonych warunkach", p: ["2–3 l wody na osobę dziennie do wszystkiego; mycie „punktowe”; pranie w misce.", "Mydło kryzysowe: popiół + tłuszcz + woda; lub woda + soda + olejek.", "Odpady: toaleta sucha, kompostownik, spalanie tylko na zewnątrz."] },
    { t: "Zdrowie psychiczne", p: ["PTSD: bezsenność, lęk, wybuchy złości, apatia; dzieci – moczenie nocne, regres, wycofanie.", "Rytuały dnia, cisza jako przestrzeń bezpieczeństwa (nie każ mówić – bądź), aktywność fizyczna.", "Bucza 2022: „Dziecko nie mówiło przez tydzień. Dopiero kiedy zaczęliśmy rysować razem zwierzęta, zaczęła mówić po cichu”."] }
  ],
  tip: "Dzieci w kryzysie bardziej niż kiedykolwiek potrzebują rytmu dnia, przytulenia, bezpiecznej przestrzeni.",
  cwiczenie: "Przygotuj roztwór dezynfekujący (5 ml wybielacza na 1 l wody) i oznacz pojemniki „pitna” / „techniczna”. Wydrukuj listę leków domowników.",
  quiz: [
    { q: "Roztwór dezynfekujący z wybielacza to:", o: ["5 ml na 1 l wody", "500 ml na 1 l wody", "1 kropla na 100 l"], a: 0 },
    { q: "Ile wody na osobę dziennie „do wszystkiego” w trudnych warunkach?", o: ["2–3 litry", "20 litrów", "0,2 litra"], a: 0 },
    { q: "Objaw PTSD u dzieci to m.in.:", o: ["Moczenie nocne i regres", "Lepszy apetyt", "Więcej energii"], a: 0 },
    { q: "Leki na własną rękę bez lekarza:", o: ["Gromadź jak najwięcej", "Nigdy nie gromadź", "Tylko antybiotyki"], a: 1 }
  ]
},
{
  id: 14, nr: "Rozdział 14", tytul: "Dezinformacja i bezpieczeństwo informacyjne",
  motto: "W kryzysie najgroźniejszą bronią nie zawsze są bomby. To lęk, plotka i manipulacja.",
  intro: "Post o „rozbitym samolocie z chemikaliami” udostępniony przez setki osób w kilka minut wywołuje chaos na ulicach – po pół godzinie służby dementują. Dezinformacja rozprzestrzenia się szybciej niż wirus, bo bazuje na emocjach.",
  sekcje: [
    { t: "Higiena informacyjna – 4 zasady", p: ["1. Zawsze weryfikuj źródło (IMGW, RCB, policja vs anonimowe konto).", "2. Sprawdzaj datę publikacji.", "3. Szukaj potwierdzenia w innych mediach.", "4. Nie udostępniaj impulsowo treści wzbudzających silne emocje."] },
    { t: "Cechy fake newsów", p: ["Brak źródła lub „tajne źródła”; sensacyjne nagłówki, CAPS LOCK, wykrzykniki.", "Wezwania do natychmiastowej reakcji („Podaj dalej!”, „Ratuj dzieci!”); emocjonalny przekaz.", "Czerwone flagi: fałszywe zdjęcia z innych konfliktów, deepfake, cytaty bez kontekstu.", "Zadaj pytanie: kto na tym zyskuje? Kto chce, żebym w to uwierzył?"] },
    { t: "Schemat SWIAT", p: ["S – Sprawdź źródło (czy istnieje?)", "W – Wyszukaj w Google", "I – Ile osób to udostępnia?", "A – Autor – czy jest znany?", "T – Treść – czy brzmi jak manipulacja?"] },
    { t: "Wiarygodne źródła", p: ["RCB (rcb.gov.pl, alerty SMS), IMGW, MSWiA, urzędy wojewódzkie i gminne, radio publiczne (PR1 z Solca Kujawskiego).", "Międzynarodowe: BBC, Deutsche Welle, Euronews; Starlink poza zasięgiem sieci."] },
    { t: "Bezpieczna komunikacja", p: ["Aktualizuj oprogramowanie, unikaj publicznych Wi-Fi, nie klikaj nieznanych linków (nawet od znajomych); w kryzysie wyłącz automatyczną synchronizację.", "Aplikacje: Signal (szyfrowanie), Session i Briar (bez internetu – Bluetooth/Wi-Fi), Threema.", "Awaryjne hasło do notatek z wiadomością dla bliskich."] },
    { t: "Prywatność i odporność na propagandę", p: ["Wyłącz GPS w ruchu; nie udostępniaj zdjęć z lokalizacją; szyfrowane kopie na pendrivie; kasuj historię czatów w strefach okupacji.", "Mechanizmy wpływu: przeciążenie poznawcze, „powtarzalność = prawda”, dramatyzacja.", "Zasada „zamrożenia”: wycofaj się na 1 godzinę, zrób coś fizycznego, wróć z dystansem.", "Ogranicz źródła do 2–3 sprawdzonych dziennie; notatki z faktami; „cisza informacyjna” 1 godzina dziennie."] }
  ],
  tip: "Ukraina 2022: „Ktoś rozesłał wiadomość, że będą ostrzeliwać przedszkola. Matki w panice porzucały wszystko. To była manipulacja. Nie było żadnego ataku”.",
  cwiczenie: "CHECKLISTA „Moja tarcza informacyjna”: alerty RCB ustawione; wiem, gdzie odbierać komunikaty radiowe; mam 2–3 zaufane źródła; znam szyfrowanie wiadomości; rozpoznaję manipulację.",
  quiz: [
    { q: "Litera „S” w schemacie SWIAT oznacza:", o: ["Sprawdź źródło", "Skopiuj", "Skomentuj"], a: 0 },
    { q: "Która aplikacja działa bez internetu (Bluetooth/Wi-Fi)?", o: ["Briar", "Facebook", "TikTok"], a: 0 },
    { q: "Typowa cecha fake newsa:", o: ["Podane źródło i autor", "Sensacyjny nagłówek i „Podaj dalej!”", "Spokojny ton"], a: 1 },
    { q: "Zasada „zamrożenia” to:", o: ["Wyłączenie lodówki", "Wycofanie się na godzinę od zalewu informacji", "Kasowanie kont"], a: 1 }
  ]
},
{
  id: 15, nr: "Rozdział 15", tytul: "Organizacja pomocy wzajemnej",
  motto: "Po każdym kataklizmie to nie państwo przychodzi z pomocą jako pierwsze. To sąsiad.",
  intro: "Gdy systemy zawodzą, wspólnota staje się twoim najważniejszym zasobem. Organizacja pomocy wzajemnej zaczyna się od poznania sąsiadów i ich potrzeb oraz stworzenia mapy zasobów i kompetencji.",
  sekcje: [
    { t: "Budowanie sieci sąsiedzkiej", p: ["Poznaj sąsiadów – także z sąsiednich budynków; wymień numery, adresy, specjalizacje (auto, elektryka, leki).", "Minipunkt informacyjny: tablica na klatce, WhatsApp, krótkofalówka z kodem grupy.", "POD – grupa 3–5 domów kontaktująca się w sytuacjach awaryjnych.", "Wspólna mapka ulicy/bloku z zasobami i osobami wymagającymi pomocy."] },
    { t: "Koordynacja", p: ["Punkt koordynacyjny (garaż, altana, piwnica): informacje, zapasy wspólne, zgłoszenia potrzeb.", "Role: koordynator, dystrybutor, patrol, pomoc medyczna.", "Skrzynka „Pomoc sąsiedzka” z listą zadań do wykonania."] },
    { t: "Sprawiedliwy podział zasobów", p: ["Transparentność – codzienne podsumowanie; rotacja osób; priorytety: dzieci, chorzy, seniorzy pierwsi.", "Zawsze zapisuj, kto co dostał i dlaczego – to ogranicza napięcia."] },
    { t: "Osoby wymagające szczególnej opieki", p: ["Kto ma problemy z mobilnością? Kto wymaga leków? Kto nie zgłasza się od 2 dni?", "Listy kontrolne (czy osoba A otwiera okno, zapala światło); dyżury rotacyjne; system par."] },
    { t: "Bezpieczeństwo społeczności", p: ["Patrole: minimum 2 osoby, zmiany co kilka godzin, notowanie zdarzeń, czerwona latarka.", "Kolory światła: białe – praca; czerwone – patrole; zielone – „bezpiecznie”; niebieskie – ostrzeżenie/alarm; pomarańczowe – miejsce interwencji.", "Barierki, taśmy, godziny ciszy, hasła dla mieszkańców („zielony klucz”).", "Wrocław 1997: „Dopiero gdy strażacy postawili patrole i wydali opaski, zrobiło się spokojniej”."] },
    { t: "Narzędzia organizacji", p: ["Informacja – tablica, kartki, megafon, krótkofalówka.", "Kontakt – lista telefonów, kartki na drzwiach.", "Rozdzielanie – pudełka oznaczone kolorami.", "Opieka – system par. Patrole – latarki, gwizdki, hasła."] }
  ],
  tip: "Ukraina 2022: „Starsza pani obok była samotna. Zaczęliśmy zostawiać jej jedzenie pod drzwiami. Po tygodniu wyszła i się rozpłakała. Nie wiedziała, że ktoś o niej pamięta”.",
  cwiczenie: "Zrób listę 5 sąsiadów z numerami telefonów i ich umiejętnościami. Wskaż jednego, który może potrzebować pomocy jako pierwszy.",
  quiz: [
    { q: "POD to grupa:", o: ["3–5 domów", "500 domów", "Jednej osoby"], a: 0 },
    { q: "Kto ma priorytet przy podziale zasobów?", o: ["Dzieci, chorzy, seniorzy", "Kto pierwszy przyjdzie", "Koordynator"], a: 0 },
    { q: "Patrol sąsiedzki to minimum:", o: ["2 osoby", "1 osoba", "10 osób"], a: 0 },
    { q: "Niebieskie światło w systemie sąsiedzkim oznacza:", o: ["Bezpiecznie", "Ostrzeżenie lub alarm", "Praca w pomieszczeniu"], a: 1 }
  ]
},
{
  id: 16, nr: "Rozdział 16", tytul: "Aspekty prawne sytuacji kryzysowych",
  motto: "Świadomy obywatel to trudniejszy cel – także dla nadużyć.",
  intro: "Kiedy zaczyna się kryzys, zmieniają się reguły gry. Konstytucja przewiduje trzy stany nadzwyczajne. Stan wojenny w 1981 roku pokazał, że warto znać swoje prawa i obowiązki.",
  sekcje: [
    { t: "Stany nadzwyczajne w Polsce", p: ["Stan klęski żywiołowej – powódź, skażenie, awaria elektrowni; użycie prywatnych maszyn, ograniczenie cen.", "Stan wyjątkowy – zamieszki, masowe protesty, ataki hybrydowe, epidemia; ograniczenie praw, nakaz ewakuacji, cenzura części mediów.", "Stan wojenny – zagrożenie zewnętrzne (decyzja prezydenta na wniosek rządu); ograniczenie zgromadzeń, prawa do strajku.", "Stan wojny – ogłasza parlament w razie agresji zbrojnej (mobilizacja, obrona terytorialna).", "W praktyce: zakaz zgromadzeń i przemieszczania, kontrola korespondencji i internetu, przejęcie mienia, świadczenia osobiste."] },
    { t: "Rekwizycje i świadczenia osobiste", p: ["Rekwizycja – czasowe przejęcie mienia (samochód, agregat). Świadczenia osobiste – obowiązek pracy (rozładunek pomocy, ewakuacja).", "Decyzje wojewody, burmistrza, wojska lub policji. Brak dokumentacji = brak podstaw do odzyskania mienia.", "Zrób zdjęcia mienia przed oddaniem (przebieg, paliwo, wyposażenie); zapisz datę, godzinę, miejsce.", "Decyzje mogą być wydawane ustnie – zapisuj, nagrywaj, proś o imię, nazwisko i jednostkę."] },
    { t: "Prawa poszkodowanych", p: ["Zasiłki celowe, zapomogi – po zgłoszeniu szkód w gminie; miej PESEL każdego członka rodziny.", "Odszkodowania tylko na podstawie dokumentacji fotograficznej, zeznań świadków, ekspertyz.", "Zdjęcia z datą i lokalizacją GPS – nawet offline.", "Prawo do informacji – urzędy muszą odpowiadać nawet w stanie wyjątkowym."] },
    { t: "Dokumenty w 3 kopiach", p: ["Oryginały w wodoodpornej teczce (plecak ewakuacyjny).", "Skany na zaszyfrowanym pendrivie.", "Kopia w chmurze z bezpiecznym hasłem.", "Spisz numery seryjne i wartości; ustal, kto zna hasła do kont; arkusz „co jeśli mnie zabraknie” w dwóch miejscach."] },
    { t: "Obywatel wobec prawa", p: ["Nieposłuszeństwo wobec decyzji w stanie wyjątkowym: mandat, areszt lub przymus fizyczny. Dotyczy też cudzoziemców.", "Godzina policyjna – wyjście wymaga zaświadczenia."] }
  ],
  tip: "Sandomierz 2010: „Kazali nam oddać łódź do akcji ratunkowej. Później nie mogliśmy jej odzyskać. Bez papierów – nic nie zrobisz”.",
  cwiczenie: "CHECKLISTA: kopie dokumentów osobistych i majątkowych; kto w rodzinie dokumentuje straty; kontakt do urzędu gminy/województwa; formularze zgłoszenia szkody i przekazania mienia; znam prawa i obowiązki w stanie nadzwyczajnym.",
  quiz: [
    { q: "Ile stanów nadzwyczajnych przewiduje Konstytucja RP?", o: ["Trzy", "Jeden", "Siedem"], a: 0, w: "Stan klęski żywiołowej, stan wyjątkowy i stan wojenny. Każdy inaczej ogranicza prawa i każdy wprowadza kto inny." },
    { q: "Rekwizycja to:", o: ["Czasowe przejęcie mienia na potrzeby państwa", "Kara pieniężna", "Rodzaj ubezpieczenia"], a: 0, w: "Czasowe, więc mienie ma wrócić lub należy się odszkodowanie. Warunkiem jest dokumentacja: zdjęcia, data, kto wydał decyzję." },
    { q: "Dokumenty przechowujemy w:", o: ["3 kopiach", "1 kopii", "Tylko w telefonie"], a: 0, w: "Zasada 3-2-1: trzy kopie, na dwóch różnych nośnikach, jedna poza domem. Telefon sam w sobie nie jest kopią zapasową." },
    { q: "Przed oddaniem samochodu do rekwizycji:", o: ["Nic nie robisz", "Fotografujesz stan, przebieg, paliwo, zapisujesz datę", "Zdejmujesz tablice"], a: 1, w: "Bez zdjęć i nazwiska osoby wydającej decyzję nie udowodnisz, w jakim stanie oddawałeś auto ani komu." }
  ]
},
{
  id: 17, nr: "Rozdział 17", tytul: "Odbudowa po katastrofie",
  motto: "Odbudować to nie znaczy tylko naprawić – to znaczy też zrozumieć, co się stało i jak iść dalej.",
  intro: "Kryzys nie kończy się, gdy opada woda albo włącza się prąd. Zostawia ślady – w ścianach, dokumentach, w głowie. Powrót do domu wymaga planu, nie emocji.",
  sekcje: [
    { t: "Ocena bezpieczeństwa powrotu", p: ["Sprawdź konstrukcję: pęknięcia, osunięcia, podmycia fundamentów. Nie wchodź sam.", "Zapach gazu → otwórz okna, zamknij zawór, wyjdź. Wietrz min. pół godziny.", "Zalany dom – nie podłączaj prądu bez przeglądu; do wody wchodź tylko z elektrykiem.", "Zagrożenia wtórne: przemieszczenia gruntu, pożary od zwarć, trujące opary, plądrowanie."] },
    { t: "Usuwanie skutków", p: ["Kolejność: ocena (z fotografią) → usuwanie wody i błota → suszenie (wentylacja, nagrzewnice, osuszacze) → dezynfekcja → odbudowa (instalacje, ściany, wykończenie).", "Wyrzuć wszystko, co miało kontakt z wodą powodziową: meble tapicerowane, materace, zabawki.", "Generator na zewnątrz, min. 6 m od domu.", "Maska, rękawice, buty z grubą podeszwą – pleśń i brud powodują choroby."] },
    { t: "Dokumentacja i formularze", p: ["Zdjęcia przed sprzątaniem, w trakcie i po; nazwy sprzętu, daty zakupu, wartości.", "Zgłoś szkody do gminy, ubezpieczyciela, organizacji pomocowych.", "Wniosek o jednorazową pomoc, refundację osuszania, protokół strat komisji gminnej.", "Zamość 2016: „Największy błąd? Nie zrobiłem zdjęć”."] },
    { t: "Odbudowa psychiczna", p: ["Bezsenność, lęk przed powtórką, obojętność; dzieci – lęki nocne, agresja, regres.", "Rytm dnia, rozmowa (bliscy, psycholog), zaangażowanie – pomaganie innym przywraca sprawczość.", "PTSD może pojawić się po kilku tygodniach – dotyczy też dzieci."] },
    { t: "Odbudowa relacji", p: ["Małe spotkania sąsiedzkie, wspólne sadzenie, malowanie, zabawy dla dzieci.", "Pomagaj tym, którzy stracili więcej – solidarność cementuje społeczność na lata."] }
  ],
  tip: "Wspólna odbudowa to nie tylko cegły i zaprawa – to odbudowa zaufania, nadziei i przynależności.",
  cwiczenie: "Ustal z rodziną: kto robi zdjęcia, kto dzwoni do ubezpieczyciela, kto sprawdza instalacje. Zapisz numery infolinii szkodowych już dziś.",
  quiz: [
    { q: "Generator po powrocie stawiasz:", o: ["Min. 6 m od domu, na zewnątrz", "W garażu", "W kuchni"], a: 0 },
    { q: "Co robisz, gdy czujesz gaz w domu?", o: ["Zapalasz światło", "Otwierasz okna, zamykasz zawór, wychodzisz", "Czekasz w środku"], a: 1 },
    { q: "Meble tapicerowane po powodzi:", o: ["Suszysz i używasz", "Wyrzucasz", "Pierzesz"], a: 1 },
    { q: "Zdjęcia zniszczeń robisz:", o: ["Tylko po sprzątaniu", "Przed, w trakcie i po", "Nie są potrzebne"], a: 1 }
  ]
},
{
  id: 18, nr: "Podsumowanie i aneksy", tytul: "Ostatni, ale najważniejszy rozdział + narzędzia",
  motto: "Proszenie o pomoc to oznaka siły, nie słabości.",
  intro: "Wspólny mianownik wszystkich etapów kryzysu to zdrowie psychiczne. PTSD może dotknąć każdego. Aneksy to gotowe narzędzia: matryca ryzyka, plecak 72 h, procedura 5 minut, drzewo decyzyjne, plan łączności PACE, karta ICE.",
  sekcje: [
    { t: "PTSD – kiedy i gdzie szukać pomocy", p: ["Kiedy: po miesiącu wciąż nie funkcjonujesz normalnie; dzieci wykazują regres; nie panujesz nad emocjami.", "Gdzie: Telefon Zaufania 116 123 (bezpłatnie, całodobowo); Ośrodki Interwencji Kryzysowej; psycholodzy NFZ; Caritas, PCK, Fundacja Dajemy Dzieciom Siłę."] },
    { t: "Aneks: matryca ryzyka (wzór)", p: ["Wichury 4×3=12; powódź błyskawiczna 3×5=15; blackout >24 h 4×4=16; skażenie chemiczne 2×5=10; cyberatak na banki 4×3=12; zakłócenia dostaw 3×4=12; pożar PV 2×5=10.", "Wynik powyżej 12 = obszar krytyczny wymagający natychmiastowych zasobów."] },
    { t: "Aneks: bezpieczeństwo PV i mapa mediów", p: ["Instalacja >6,5 kW uzgodniona z rzeczoznawcą ppoż. i zgłoszona do PSP; wyłącznik PWP i Rapid Shutdown; oznakowanie; gaśnice ABC min. 4 kg; czujki dymu i czadu.", "Mapa mediów: zawór wody (niebieski), zawór gazu (żółty, klucz przy zaworze), wyłącznik prądu (czerwony, „w dół = wyłączone”), wyłącznik PV (pomarańczowy)."] },
    { t: "Aneks: MDS i cyfrowa twierdza", p: ["Miejsce Doraźnego Schronienia: strop żelbetowy min. 20 cm, wentylacja z odcięciem, wyjście zapasowe, toalety suche.", "Zasada 3-2-1: 3 kopie danych, 2 nośniki, 1 poza domem. Szyfrowany pendrive (VeraCrypt/BitLocker), chmura zaszyfrowana (Cryptomator), klucz U2F lub 2FA (nie SMS!), telefon w klatce Faradaya z mapami offline (OsmAnd) i Wikipedią offline (Kiwix); zalaminowane kserokopie."] },
    { t: "Aneks: FIFO/FEFO i leki", p: ["Rejestr: ID, nazwa, data zakupu (FIFO), data ważności (FEFO), ilość, lokalizacja, status; rotacja co 3–6 miesięcy.", "Karta leków: członek rodziny, lek, dawkowanie, wskazania, dni terapii, ważność, przechowywanie (np. insulina – etui Frio). Jodek potasu tylko przy skażeniu I-131 zgodnie z komunikatem. Fizyczne kopie recept!"] },
    { t: "Aneks: plecak 72 h (na osobę)", p: ["Hydracja: 1,5 l wody, filtr osobisty (Sawyer/LifeStraw) lub tabletki NaDCC, kubek metalowy.", "Żywienie: racje wysokokaloryczne (NRG-5), liofilizaty/MRE, comfort food.", "Termika: 2× folia NRC, ponczo, bielizna merino (nie bawełna!), 3 pary skarpet, śpiwór/bivy.", "Higiena: chusteczki, żel, papier, mydło biodegradowalne.", "Narzędzia: czołówka + baterie litowe, multitool, powerbank 10 000 mAh, zapalniczka, zapałki sztormowe, krzesiwo.", "Medyczne: leki indywidualne, staza, opatrunki, plastry na pęcherze."] },
    { t: "Aneks: procedura „wyjście w 5 minut”", p: ["1. KOMENDA („ALARM WYJŚCIE”). 2. EDC – buty i kurtka. 3. GOTOWOŚĆ – plecaki 72 h. 4. DOKUMENTY – teczka/pendrive. 5. LEKI – półka ratunkowa z lodówki do torby termicznej. 6. ZWIERZĘTA – smycz/transporter (lub otwarcie drzwi). 7. MEDIA – gaz i prąd, jeśli bezpieczne. 8. SYGNAŁ – kartka z godziną i kierunkiem."] },
    { t: "Aneks: drzewo decyzyjne „zostaję czy uciekam”", p: ["Węzeł 1: czy zagrożenie zagraża strukturze domu (pożar, woda w środku, skażenie wentylacją)? TAK → ewakuacja natychmiastowa.", "Węzeł 2: czy dom bezpieczny i mamy zasoby na czas kryzysu? TAK → zostaję (shelter-in-place).", "Węzeł 3: czy trasa do punktu B przejezdna i bezpieczniejsza niż dom? TAK → ewakuacja planowa. NIE → zostaję, przetrwanie awaryjne, czerwone płótno."] },
    { t: "Aneks: łączność PACE i plan rodziny", p: ["Poziom 0: fizycznie w punkcie zbiórki A. Poziom 1: SMS „JESTEM BEZPIECZNY. IDĘ DO PUNKTU B.” Poziom 2: łącznik z innego województwa. Poziom 3: PR1 fale długie 225 kHz, PMR kanał 3, CB kanał 9, prześcieradło białe = OK, czerwone = POMOC.", "Plan rodziny (format karty kredytowej): miejsca A i B, kto odbiera dzieci + HASŁO BEZPIECZEŃSTWA, kontakty ICE, dane medyczne, mapa mediów.", "Karta ICE w portfelu: kontakt, grupa krwi, alergie, leki, zgoda na zabieg. Karta „Mój zwierzak” przy transporterze."] },
    { t: "Wnioski i rekomendacje", p: ["1. Fizyczna materializacja planów – wydrukuj i zalaminuj.", "2. Regularne ćwiczenia – próbne ewakuacje co 6 miesięcy.", "3. Monitorowanie prawa – Ustawa o ochronie ludności, dopłaty do ukryć.", "4. Adaptacja ciągła – aktualizuj matrycę i zapasy."] }
  ],
  tip: "OCALENIE SIEBIE I SWOICH BLISKICH TO NIE TYLKO PRZETRWANIE FIZYCZNE – TO TAKŻE POWRÓT DO RÓWNOWAGI WEWNĘTRZNEJ.",
  cwiczenie: "Wypełnij dziś: Plan bezpieczeństwa rodziny (miejsca A i B, hasło bezpieczeństwa, łącznik zewnętrzny) i kartę ICE dla każdego domownika. Wydrukuj i zalaminuj.",
  quiz: [
    { q: "Zasada 3-2-1 w danych to:", o: ["3 kopie, 2 nośniki, 1 poza domem", "3 hasła, 2 telefony, 1 laptop", "3 dni, 2 tygodnie, 1 miesiąc"], a: 0 },
    { q: "Pierwszy krok procedury „wyjście w 5 minut” po komendzie to:", o: ["Założenie butów i kurtki", "Pakowanie ubrań", "Sprzątanie"], a: 0 },
    { q: "Polskie Radio Program I na falach długich nadaje na:", o: ["225 kHz", "100 MHz", "5 GHz"], a: 0 },
    { q: "Hasło bezpieczeństwa (safe word) służy do:", o: ["Logowania do banku", "Sprawdzenia, czy osoba odbierająca dziecko jest upoważniona", "Otwierania sejfu"], a: 1 },
    { q: "Bielizna do plecaka 72 h powinna być z:", o: ["Bawełny", "Wełny merino", "Jedwabiu"], a: 1 }
  ]
}
];
