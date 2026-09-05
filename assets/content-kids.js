/* Treść szkolenia – WERSJA DLA DZIECI (ok. 7–12 lat)
   Ta sama kolejność rozdziałów co w książce „Poradnik przetrwania w sytuacjach kryzysowych” (Matthew Halaba),
   ale prostym językiem, z misjami i odznakami. Rozdział o wojnie jest złagodzony (bez drastycznych opisów). */
window.ROZDZIALY_DZIECI = [
{
  id: 0, nr: "Start", tytul: "Zostań Małym Strażnikiem Bezpieczeństwa", odznaka: "🛡️", emoji: "🏠",
  intro: "Cześć! Czasem na świecie dzieją się trudne rzeczy: gaśnie prąd, pada wielki deszcz albo wieje bardzo mocny wiatr. Nie musisz się bać – wystarczy być PRZYGOTOWANYM. Przygotowanie to nie strach. To odwaga i mądrość!",
  punkty: ["Przygotowana rodzina jest spokojna, bo wie, co robić.", "W Polsce zdarzają się powodzie, burze i przerwy w prądzie – dlatego warto się uczyć.", "Każdy w rodzinie może mieć swoje ważne zadanie. Nawet ty!"],
  zabawa: "Zapytaj rodziców: „Co byśmy zrobili, gdyby zgasło światło na całą noc?”. Narysuj odpowiedź.",
  quiz: [
    { q: "Po co ćwiczymy, co robić w kryzysie?", o: ["Żeby się bać", "Żeby w razie czego wiedzieć, co robić, i się nie bać", "Żeby nie chodzić do szkoły"], a: 1, w: "Tak jak ćwiczysz alarm pożarowy w szkole. Kto wie, co robić, ten się mniej boi." },
    { q: "Gdy zgaśnie światło w całym domu, najpierw:", o: ["Krzyczę i biegam", "Zostaję na miejscu i wołam dorosłego", "Wychodzę sam na dwór"], a: 1, w: "W ciemności łatwo się przewrócić. Najpierw dorosły i światło, dopiero potem chodzenie po domu." },
    { q: "Kto w rodzinie powinien mieć swoje zadanie na wypadek kłopotów?", o: ["Tylko tata", "Każdy, także dzieci", "Nikt"], a: 1, w: "Dziecko z zadaniem, na przykład Strażnik Latarek, czuje się pewniej i naprawdę pomaga." }
  ]
},
{
  id: 1, nr: "Misja 1", tytul: "Detektyw zagrożeń", odznaka: "🔍", emoji: "🗺️",
  intro: "Zanim spakujemy plecak, trzeba wiedzieć, CO może się zdarzyć tam, gdzie mieszkasz. Nad rzeką? Uwaga na powódź. W bloku? Winda może stanąć, gdy nie ma prądu. Prawdziwy detektyw najpierw patrzy i myśli!",
  punkty: ["Zagrożenia w Polsce to: powódź, wichura, burza, brak prądu, pożar, mróz.", "Syrena wyjąca ciągle 3 minuty = alarm. Trzeba iść do rodziców i słuchać.", "Narysuj mapę okolicy: gdzie jest szpital, apteka, szkoła, dom babci.", "Możesz dostać rolę: „Strażnik Latarek” – pilnujesz, żeby latarki miały baterie!", "Gdy się boisz: oddychaj powoli. Wdech… i długi wydech. Jak dmuchanie na gorącą zupę."],
  zabawa: "Zabawa „Mapa Skarbów Bezpieczeństwa”: narysuj swoją ulicę i zaznacz 3 bezpieczne miejsca.",
  quiz: [
    { q: "Co robi detektyw zagrożeń najpierw?", o: ["Patrzy i myśli, co może się zdarzyć", "Ucieka", "Kupuje namiot"], a: 0, w: "Najpierw się rozglądasz: czy blisko jest rzeka, las, ruchliwa droga. Potem wiesz, na co się przygotować." },
    { q: "Mieszkasz na 8. piętrze. Co będzie problemem, gdy zabraknie prądu?", o: ["Nie będzie działać winda i światło na klatce", "Trawnik przed blokiem", "Kolor drzwi"], a: 0, w: "Bez prądu winda staje, a klatka jest ciemna. Dlatego latarka leży w miejscu, które znasz na pamięć." },
    { q: "Jak się uspokoić, gdy się boisz?", o: ["Krzyczeć", "Oddychać powoli jak na gorącą zupę", "Biegać"], a: 1, w: "Wolny wydech uspokaja serce. Policz: wdech na 4, zatrzymaj na 7, wydech na 8." }
  ]
},
{
  id: 2, nr: "Misja 2", tytul: "Rodzinny plan – nasza drużyna", odznaka: "👨‍👩‍👧", emoji: "📋",
  intro: "Drużyna wygrywa, gdy ma plan! W rodzinie ustalamy: gdzie się spotkamy, jeśli nie możemy wrócić do domu, do kogo zadzwonić i kto co robi.",
  punkty: ["Mamy DWA miejsca spotkań: jedno blisko domu (np. ławka przed blokiem) i jedno daleko (np. dom cioci).", "Numer alarmowy to 112. Naucz się go na pamięć!", "Każdy ma zadanie: ktoś bierze apteczkę, ktoś dokumenty, ktoś opiekuje się psem.", "Znaki dla dzieci: czerwony krzyż = „nie wchodź”, zielone kółko = „tu czekamy”.", "Raz w roku robimy ćwiczenia jak grę: kto szybciej spakuje plecak i dotrze na miejsce zbiórki?", "HASŁO BEZPIECZEŃSTWA: nie idziesz z nikim, kto nie zna waszego tajnego hasła rodzinnego."],
  zabawa: "Wymyślcie z rodzicami tajne hasło rodzinne i zapamiętaj je. Nikomu obcemu nie zdradzaj!",
  quiz: [
    { q: "Dzwonisz pod 112. Co mówisz najpierw?", o: ["Gdzie jesteś i co się stało", "Ile masz lat", "Że się boisz"], a: 0, w: "Ratownik musi wiedzieć, dokąd jechać. Adres albo charakterystyczne miejsce, potem co się stało." },
    { q: "Ile miejsc spotkań ma rodzina?", o: ["Jedno", "Dwa", "Dziesięć"], a: 1, w: "Jedno blisko domu, na przykład ławka przed blokiem. Drugie daleko, na przykład u babci, gdyby trzeba było wyjechać." },
    { q: "Zielone kółko oznacza:", o: ["Nie wchodź", "Tu czekamy", "Biegnij"], a: 1, w: "Czerwony krzyż to „nie wchodź”, a zielone kółko to „tu się spotykamy”. Proste znaki działają, gdy nie da się rozmawiać." },
    { q: "Ktoś obcy mówi: „Mama mnie przysłała”, ale nie zna hasła. Co robisz?", o: ["Idę z nim", "Nie idę i wołam dorosłego, któremu ufam", "Daję mu telefon"], a: 1 }
  ]
},
{
  id: 3, nr: "Misja 3", tytul: "Spiżarnia superbohatera", odznaka: "🥫", emoji: "💧",
  intro: "Gdy nie ma prądu, sklep może być zamknięty. Dlatego mądra rodzina ma zapasy: wodę, jedzenie w puszkach, latarki i baterie. To nie strach – to troska!",
  punkty: ["Woda to najważniejsze: około 3 butelki (3 litry) na osobę na jeden dzień.", "Jedzenie, które nie psuje się i nie trzeba go gotować: konserwy, suszone owoce, miód, batoniki.", "Nie zapomnij o otwieraczu do puszek!", "Kolory pudełek: zielony – jedzenie, czerwony – apteczka, niebieski – mydło i higiena, żółty – baterie i latarki.", "Zasada „pierwsze weszło – pierwsze wychodzi”: najpierw zjadamy starsze rzeczy.", "Zwierzak też potrzebuje zapasów: karma na 7 dni i miska.", "Do zapasów włóż też coś na nudę: kredki, książkę, grę planszową."],
  zabawa: "Zabawa „Liczydło zapasów”: policz z rodzicami butelki wody w domu. Na ile dni wystarczą?",
  quiz: [
    { q: "Ile wody na osobę na jeden dzień?", o: ["1 łyżka", "Około 3 litry", "100 litrów"], a: 1 },
    { q: "Który kolor pudełka to apteczka?", o: ["Zielony", "Czerwony", "Żółty"], a: 1 },
    { q: "Co jemy najpierw z zapasów?", o: ["Najnowsze", "Najstarsze", "Losowe"], a: 1 }
  ]
},
{
  id: 4, nr: "Misja 4", tytul: "Nasz dom – nasza twierdza", odznaka: "🏰", emoji: "🔥",
  intro: "Dom chroni nas przed deszczem, wiatrem i ciemnością. Ale trzeba go przygotować! Czujnik dymu, gaśnica, latarki w znanym miejscu – to tarcze naszej twierdzy.",
  punkty: ["W domu powinien być czujnik dymu i czujnik czadu – piszczą, gdy jest niebezpiecznie.", "Wiesz, gdzie leży gaśnica, apteczka i latarki? Zapytaj rodziców i zapamiętaj.", "Umówiony sygnał z sąsiadami: latarka w oknie = „u nas OK”, świeczka = „potrzebujemy pomocy”.", "Ćwiczenie „Pożar nocą”: wychodzimy z domu bez światła, nisko przy podłodze, z chusteczką na buzi.", "Ćwiczenie „Zimowy wieczór bez prądu”: wszyscy śpimy w jednym pokoju pod kocami – jak na biwaku!"],
  zabawa: "Zrób z rodzicami „obchód twierdzy”: znajdź czujnik dymu, gaśnicę i główny wyłącznik prądu.",
  quiz: [
    { q: "Co robi czujnik dymu?", o: ["Gra muzykę", "Piszczy, gdy jest dym", "Świeci"], a: 1 },
    { q: "Jak wychodzimy z zadymionego domu?", o: ["Nisko przy podłodze", "Skacząc", "Na palcach"], a: 0 },
    { q: "Świeczka w oknie w umówionym sygnale znaczy:", o: ["Urodziny", "Potrzebujemy pomocy", "Wszystko OK"], a: 1 }
  ]
},
{
  id: 5, nr: "Misja 5", tytul: "Skarbonka na czarną godzinę", odznaka: "💰", emoji: "📄",
  intro: "Czasem bankomaty i karty nie działają. Wtedy przydają się prawdziwe pieniądze schowane w bezpiecznym miejscu i ważne dokumenty w wodoodpornej kopercie.",
  punkty: ["Rodzina ma trochę gotówki w małych banknotach na wypadek, gdy karty nie działają.", "Ważne papiery (dowody, paszporty) są w wodoodpornej kopercie – i mają kopie.", "Gra „Co kupisz za 20 zł?” – ucz się liczyć pieniądze.", "Możesz mieć swoją skarbonkę „na czarną godzinę”.", "Zdjęcia rzeczy w domu pomagają, gdy coś się zniszczy."],
  zabawa: "Zagraj z rodzicami w „sklep bez karty”: masz 20 zł w monetach – co kupisz na jeden dzień bez prądu?",
  quiz: [
    { q: "Co się przydaje, gdy nie działają karty?", o: ["Gotówka w małych banknotach", "Więcej kart", "Nic"], a: 0 },
    { q: "Gdzie trzymamy ważne dokumenty?", o: ["W wodoodpornej kopercie", "W zlewie", "Na balkonie"], a: 0 }
  ]
},
{
  id: 6, nr: "Misja 6", tytul: "Dźwięki ochrony – co mówi syrena?", odznaka: "📢", emoji: "🚨",
  intro: "Syrena to „dźwięk ochrony”. Nie jest po to, żeby straszyć – jest po to, żeby ostrzec. Gdy ją słyszysz, idziesz do dorosłego i słuchasz, co robić.",
  punkty: ["Dźwięk falujący (w górę i w dół) przez 3 minuty = ALARM. Uwaga!", "Dźwięk równy, ciągły przez 3 minuty = KONIEC alarmu. Już bezpiecznie.", "Krótkie, przerywane dźwięki w pierwszy poniedziałek miesiąca = TEST. To tylko sprawdzanie.", "Rodzice dostają SMS-y z ostrzeżeniami (Alert RCB). Radio na baterie też mówi, co się dzieje.", "Nigdy nie rób fałszywego alarmu – to poważna sprawa i można za to zostać ukaranym."],
  zabawa: "Zabawa „Jaka to syrena?”: rodzic naśladuje dźwięk, a ty mówisz: alarm, koniec alarmu czy test.",
  quiz: [
    { q: "Falujący dźwięk syreny przez 3 minuty to:", o: ["Alarm", "Koniec alarmu", "Muzyka"], a: 0 },
    { q: "Równy, ciągły dźwięk 3 minuty to:", o: ["Alarm", "Koniec alarmu", "Test"], a: 1 },
    { q: "Co robisz, gdy słyszysz syrenę?", o: ["Idę do dorosłego i słucham", "Chowam się sam w szafie", "Wybiegam na ulicę"], a: 0 }
  ]
},
{
  id: 7, nr: "Misja 7", tytul: "Plecak na przygodę – ewakuacja", odznaka: "🎒", emoji: "🚶",
  intro: "Czasem trzeba szybko wyjść z domu, np. gdy zbliża się woda. To nie ucieczka w panice – to wyprawa według planu. Plecak jest spakowany wcześniej i stoi zawsze w tym samym miejscu.",
  punkty: ["W plecaku: woda, jedzenie na 3 dni, ubranie, latarka, apteczka, dokumenty, ładowarka.", "Masz przy sobie kartkę z imieniem, nazwiskiem i numerem telefonu do rodziców (karta ICE).", "Przed wyjściem rodzice zostawiają kartkę na drzwiach: „Wyszliśmy, jedziemy do babci”.", "Zwierzak jedzie z nami – w transporterze, z karmą i miską.", "Przy powodzi NIE wchodzimy do wody – nawet płytka woda może porwać.", "Gry na drogę: „Tajemniczy plecak” (losujesz przedmiot i mówisz, do czego się przyda) i „Misja Czerwona Latarka” (chronisz bazę nocą).", "Naucz się kierunków świata – pomaga zachować spokój bez telefonu."],
  zabawa: "Spakuj z rodzicami swój mały plecak: ulubiona maskotka, kredki, butelka wody, kartka z numerem do rodziców.",
  quiz: [
    { q: "Gdzie stoi plecak ewakuacyjny?", o: ["Zawsze w tym samym miejscu", "Za każdym razem gdzie indziej", "U sąsiada"], a: 0 },
    { q: "Co ma przy sobie dziecko podczas ewakuacji?", o: ["Kartkę z imieniem i telefonem rodziców", "Tablet", "Klucze do auta"], a: 0 },
    { q: "Czy wchodzimy do wody podczas powodzi?", o: ["Tak, jeśli jest ciepła", "Nie – nawet płytka woda może porwać", "Tylko w kaloszach"], a: 1 }
  ]
},
{
  id: 8, nr: "Misja 8", tytul: "Bezpieczny pokój – zostajemy w domu", odznaka: "🚪", emoji: "🕯️",
  intro: "Czasem najbezpieczniej jest zostać w domu, np. gdy na dworze jest bardzo mocny wiatr albo dym. Wybieramy najbezpieczniejszy pokój i urządzamy tam bazę.",
  punkty: ["Najlepszy pokój: bez okien albo z jednym, w środku domu, np. łazienka lub korytarz.", "W bazie mamy: koce, wodę, jedzenie, latarkę, radio, apteczkę.", "Czerwone lub zielone światło latarki nie męczy oczu i jest przyjazne dla bazy.", "Robimy plan dnia: posiłek, zabawa, odpoczynek, cisza. Czas mija szybciej!", "Twoja rola: „Strażnik Światła” albo „Kontroler Zapasów”.", "Zabawa w bazie: dziennik – każdy zapisuje lub rysuje jedną rzecz dziennie."],
  zabawa: "Zbuduj z kocami „bazę” w najbezpieczniejszym pokoju. Przenieś tam koc, wodę i latarkę w 10 minut. Rodzic mierzy czas!",
  quiz: [
    { q: "Jaki pokój jest najlepszy na bezpieczną bazę?", o: ["Z wielkim oknem", "Bez okien, w środku domu", "Balkon"], a: 1 },
    { q: "Jakie światło jest przyjazne dla bazy?", o: ["Czerwone lub zielone", "Bardzo jasne białe", "Migające"], a: 0 }
  ]
},
{
  id: 9, nr: "Misja 9", tytul: "Życie bez prądu – jak na biwaku", odznaka: "🔦", emoji: "🌙",
  intro: "Gdy zgaśnie prąd, znika też internet, telewizor, czasem woda i ogrzewanie. Ale możemy poradzić sobie jak na biwaku: latarki, gry planszowe, gotowanie na kuchence turystycznej (tylko z dorosłymi!).",
  punkty: ["Wstajemy i kładziemy się razem ze słońcem.", "Trik: postaw latarkę na butelce z wodą – zaświeci cały pokój!", "Wodę z nieznanego miejsca ZAWSZE trzeba przegotować (5 minut) albo dodać tabletkę – robią to dorośli.", "Świeczki tylko przy dorosłych. Generator NIGDY w domu.", "Sygnał SOS latarką: 3 krótkie, 3 długie, 3 krótkie błyski.", "Kolory tkanin: czerwona = „potrzebujemy pomocy”, zielona = „u nas w porządku”, pomarańczowa = „znajdźcie nas”."],
  zabawa: "Wieczór bez prądu: zgaście światła na godzinę, zróbcie latarkę butelkową i zagrajcie w planszówkę. Wyślij SOS latarką!",
  quiz: [
    { q: "SOS latarką to:", o: ["3 krótkie, 3 długie, 3 krótkie", "1 długi błysk", "Ciągłe świecenie"], a: 0 },
    { q: "Czerwona tkanina w oknie oznacza:", o: ["Potrzebujemy pomocy", "Wszystko w porządku", "Sklep"], a: 0 },
    { q: "Jak sprawić, żeby latarka oświetliła cały pokój?", o: ["Postawić ją na butelce z wodą", "Schować pod kocem", "Wyłączyć"], a: 0 }
  ]
},
{
  id: 10, nr: "Misja 10", tytul: "Gdy jest bardzo głośno – „padnij i osłoń się”", odznaka: "🦺", emoji: "🛡️",
  intro: "W niektórych krajach zdarzają się bardzo niebezpieczne czasy, gdy słychać wybuchy. Dorośli chcą, żebyś umiał jedną prostą rzecz: gdy jest nagły, ogromny huk – padnij na ziemię i osłoń głowę rękami. Potem idź z dorosłymi do piwnicy lub schronu.",
  punkty: ["Nagły wielki huk → padnij, zakryj głowę rękami, poczekaj chwilę.", "Syrena → idziemy szybko do schronu lub piwnicy, nie oglądamy przez okno.", "Najbezpieczniej jest za dwiema ścianami, z dala od okien.", "Nigdy nie dotykaj dziwnych przedmiotów znalezionych na ulicy (paczek, zabawek, telefonów). Powiedz dorosłemu!", "Słuchamy tylko prawdziwych informacji od dorosłych i z radia, nie plotek.", "Ćwiczymy „padnij i osłoń się” jak zapinanie pasów – żeby weszło w nawyk."],
  zabawa: "Zabawa „Żółw”: rodzic klaszcze głośno, a ty jak najszybciej kładziesz się na boku i osłaniasz głowę. Kto szybciej?",
  quiz: [
    { q: "Co robisz przy nagłym wielkim huku?", o: ["Padam i osłaniam głowę", "Biegnę do okna", "Skaczę"], a: 0 },
    { q: "Znalazłeś dziwną paczkę na ulicy. Co robisz?", o: ["Otwieram", "Nie dotykam i mówię dorosłemu", "Zabieram do domu"], a: 1 },
    { q: "Gdzie jest najbezpieczniej podczas alarmu?", o: ["Przy oknie", "Za dwiema ścianami, w piwnicy lub schronie", "Na dachu"], a: 1 }
  ]
},
{
  id: 11, nr: "Misja 11", tytul: "Żywioły: woda, wiatr, ogień, mróz", odznaka: "🌊", emoji: "⛈️",
  intro: "Natura bywa silna: powódź, wichura, burza, pożar, śnieżyca. Każdy żywioł ma swoje zasady. Poznaj je jak superbohater poznaje moce przeciwnika!",
  punkty: ["POWÓDŹ: nie chodzimy po wodzie – nawet 15 cm może porwać dorosłego. Nie wracamy do domu, aż dorośli sprawdzą, czy jest bezpiecznie.", "BURZA: nie stoimy przy oknie, nie dotykamy metalu. Na dworze – kucamy, nie kładziemy się, nie chowamy pod drzewem.", "WICHURA: idziemy do pokoju bez okien.", "POŻAR W DOMU: nisko przy podłodze, nie otwieramy gorących drzwi. Mokry ręcznik na buzię.", "POŻAR LASU: uciekamy w bok od dymu (prostopadle do wiatru), nie w krzaki.", "MRÓZ: ciepłe koce, „namiot” z koców, latarka i powerbank naładowane."],
  zabawa: "Zabawa „Żywioł mówi”: rodzic mówi nazwę żywiołu, a ty pokazujesz właściwą pozycję: kucnięcie (burza), nisko przy podłodze (pożar), pokój bez okien (wichura).",
  quiz: [
    { q: "Podczas burzy na dworze:", o: ["Kucam", "Kładę się", "Chowam się pod drzewem"], a: 0 },
    { q: "Gorące drzwi podczas pożaru:", o: ["Otwieram szybko", "Nie otwieram", "Kopię"], a: 1 },
    { q: "Przed dymem z pożaru lasu uciekam:", o: ["W bok od dymu", "Prosto w dym", "W krzaki"], a: 0 }
  ]
},
{
  id: 12, nr: "Misja 12", tytul: "Mały ratownik – pierwsza pomoc", odznaka: "🚑", emoji: "🩹",
  intro: "Nawet dziecko może pomóc! Najważniejsze: zawołać dorosłego i zadzwonić pod 112. Możesz też przycisnąć ranę czystą szmatką i przynieść koc.",
  punkty: ["Ktoś jest ranny? 1. Zawołaj dorosłego. 2. Zadzwoń 112 i powiedz, gdzie jesteś i co się stało.", "Krwawienie: przyciśnij czystą szmatką i trzymaj.", "Oparzenie: polej zimną wodą (nie lodem!) przez długi czas, około 15 minut. Nie przebijaj pęcherzy.", "Ktoś zmarzł: przykryj kocem, daj ciepły napój. Nie pocieraj odmrożonych palców.", "Złamanie: nie ruszaj ręki ani nogi, zawołaj dorosłego.", "Apteczka: plastry, bandaże, chusteczki, rękawiczki, termometr."],
  zabawa: "Zabawa „Telefon 112”: rodzic udaje dyspozytora. Powiedz: jak się nazywasz, gdzie jesteś, co się stało. Trenujcie!",
  quiz: [
    { q: "Co najpierw, gdy ktoś jest ranny?", o: ["Zawołać dorosłego i zadzwonić 112", "Uciec", "Zrobić zdjęcie"], a: 0 },
    { q: "Oparzenie polewamy:", o: ["Zimną wodą około 15 minut", "Gorącą wodą", "Lodem"], a: 0 },
    { q: "Odmrożone palce:", o: ["Mocno pocieramy", "Ogrzewamy powoli, nie pocieramy", "Wkładamy do wrzątku"], a: 1 }
  ]
},
{
  id: 13, nr: "Misja 13", tytul: "Czyste ręce, zdrowa głowa", odznaka: "🧼", emoji: "💪",
  intro: "Gdy trudny czas trwa długo, ważne jest zdrowie: mycie rąk, czysta woda, jedzenie i… dobry humor! Rytm dnia i zabawa pomagają nie smucić się.",
  punkty: ["Myj ręce po każdym wyjściu i przed jedzeniem – nawet jedną butelką wody.", "Woda do picia osobno, woda do mycia osobno. Pijemy tylko przegotowaną lub z butelki.", "Chory ma swój kącik i swoje rzeczy oznaczone kolorową taśmą.", "Codziennie: pobudka o tej samej porze, posiłki, trochę ruchu (pajacyki!), zabawa.", "Zabawy bez prądu: zgadywanki z dźwięków (zamknij oczy – co to za dźwięk?), teatr cieni z latarką.", "Jeśli jest ci smutno lub boisz się – powiedz o tym. To bardzo odważne."],
  zabawa: "Zrób teatr cieni z latarką i rękami. Zagraj bajkę o rodzinie, która świetnie sobie poradziła bez prądu.",
  quiz: [
    { q: "Jaką wodę pijemy w kryzysie?", o: ["Z kałuży", "Przegotowaną lub z butelki", "Z rzeki"], a: 1 },
    { q: "Co pomaga, gdy jest smutno?", o: ["Rytm dnia, zabawa i rozmowa", "Milczenie na zawsze", "Nic"], a: 0 }
  ]
},
{
  id: 14, nr: "Misja 14", tytul: "Łowca fałszywych wiadomości", odznaka: "🕵️", emoji: "📱",
  intro: "W internecie ktoś może napisać nieprawdę, żeby ludzi przestraszyć. Łowca fałszywych wiadomości ZAWSZE sprawdza: kto to napisał, kiedy i czy inni też o tym mówią.",
  punkty: ["Wiadomość z wielkimi literami, wykrzyknikami i „PODAJ DALEJ!!!” – to często fałszywka.", "Zapytaj: kto to napisał? Czy to prawdziwa instytucja (np. straż pożarna, RCB)?", "Sprawdź datę – stare zdjęcie może udawać nowe.", "Nie przesyłaj dalej niczego, co wzbudza strach, zanim dorosły nie sprawdzi.", "Nie klikaj w dziwne linki, nawet od kolegów.", "Nie podawaj nikomu w internecie adresu, hasła ani zdjęć z miejscem, gdzie jesteś.", "Zasada SWIAT: Sprawdź źródło, Wyszukaj, Ile osób udostępnia, Autor, Treść."],
  zabawa: "Gra „Prawda czy fałsz?”: rodzic czyta dwie wiadomości – jedną prawdziwą, jedną zmyśloną z wykrzyknikami. Zgadnij, która jest fałszywa i powiedz dlaczego.",
  quiz: [
    { q: "Wiadomość „UWAGA!!! PODAJ DALEJ!!!” bez podanego źródła to najpewniej:", o: ["Prawda", "Fałszywka", "Reklama"], a: 1 },
    { q: "Co robisz z dziwnym linkiem od kolegi?", o: ["Klikam", "Nie klikam, pytam dorosłego", "Wysyłam wszystkim"], a: 1 },
    { q: "Litera „S” w SWIAT to:", o: ["Sprawdź źródło", "Skacz", "Spać"], a: 0 }
  ]
},
{
  id: 15, nr: "Misja 15", tytul: "Sąsiedzi – drużyna z całej ulicy", odznaka: "🤝", emoji: "🏘️",
  intro: "Gdy dzieje się coś trudnego, pierwszy pomaga sąsiad! Dlatego warto znać ludzi z klatki i z ulicy. Razem jest łatwiej: ktoś ma agregat, ktoś zna się na pierwszej pomocy, ktoś robi najlepszą zupę.",
  punkty: ["Poznaj sąsiadów. Rodzice mają ich numery telefonów.", "W drużynie każdy ma rolę: koordynator, rozdający zapasy, patrol, pomoc medyczna.", "Najpierw pomagamy dzieciom, chorym i starszym.", "Sprawdzamy, czy starsza sąsiadka ma wszystko – czasem wystarczy zostawić jedzenie pod drzwiami.", "Kolory latarek: czerwone – patrol, zielone – „bezpiecznie”, niebieskie – ostrzeżenie."],
  zabawa: "Narysuj mapę swojego bloku lub ulicy. Zaznacz, kto może potrzebować pomocy i kto może pomóc.",
  quiz: [
    { q: "Kto zwykle pomaga jako pierwszy w kryzysie?", o: ["Sąsiad", "Nikt", "Telewizja"], a: 0 },
    { q: "Komu pomagamy najpierw?", o: ["Dzieciom, chorym i starszym", "Najsilniejszym", "Tym, którzy krzyczą"], a: 0 }
  ]
},
{
  id: 16, nr: "Misja 16", tytul: "Zasady i prawa – co wolno, a co nie", odznaka: "⚖️", emoji: "📜",
  intro: "W bardzo trudnych czasach dorośli (rząd) mogą wprowadzić specjalne zasady, np. że wieczorem nie wolno wychodzić. Trzeba ich słuchać. Ważne dokumenty trzeba mieć w trzech kopiach, a zniszczenia fotografować.",
  punkty: ["Specjalne zasady w kryzysie to np. zakaz wychodzenia wieczorem (godzina policyjna). Słuchamy dorosłych i służb.", "Dokumenty rodziny są w 3 miejscach: w teczce, na pendrivie i w chmurze.", "Gdy coś się zniszczy, robimy zdjęcia – to dowód, żeby dostać pomoc.", "Strażacy, policjanci i ratownicy pomagają – nie przeszkadzamy im."],
  zabawa: "Zabawa „Fotoreporter”: zrób zdjęcia 5 ważnych rzeczy w swoim pokoju (jak dokumentacja mienia).",
  quiz: [
    { q: "W ilu kopiach trzymamy dokumenty?", o: ["W 3", "W 1", "W 100"], a: 0, w: "Jedne papierowe w teczce, drugie na pendrivie, trzecie w internecie. Gdy jedno zginie, zostają dwa." },
    { q: "Po co robimy zdjęcia zniszczeń?", o: ["To dowód, żeby dostać pomoc", "Dla zabawy", "Nie robimy"], a: 0, w: "Bez zdjęcia trudno udowodnić, co było zniszczone. Zdjęcie robi się przed sprzątaniem." }
  ]
},
{
  id: 17, nr: "Misja 17", tytul: "Odbudowa – wracamy do domu", odznaka: "🌱", emoji: "🏡",
  intro: "Gdy trudny czas mija, wracamy do domu. Ale ostrożnie! Dorośli sprawdzają, czy dom jest bezpieczny. Potem sprzątamy, naprawiamy i… pomagamy sąsiadom. A jeśli nadal jest ci smutno – to normalne. Można o tym rozmawiać.",
  punkty: ["Do domu wchodzimy dopiero, gdy dorośli sprawdzą ściany, prąd i czy nie pachnie gazem.", "Gdy pachnie gazem: otwieramy okna i wychodzimy.", "Rzeczy zalane wodą powodziową (materace, pluszaki) niestety trzeba wyrzucić.", "Sprzątamy w masce i rękawiczkach.", "Wracamy do rytmu dnia: szkoła, posiłki, zabawa. To pomaga poczuć się bezpiecznie.", "Pomaganie innym sprawia, że czujemy się silni.", "Telefon zaufania dla dzieci: 116 111. Można zadzwonić, gdy jest ci źle."],
  zabawa: "Zaplanujcie z sąsiadami wspólne sadzenie kwiatów lub malowanie płotu – odbudowa to też przyjaźń.",
  quiz: [
    { q: "Kiedy wchodzimy do domu po powodzi?", o: ["Gdy dorośli sprawdzą, że jest bezpiecznie", "Od razu", "W nocy"], a: 0 },
    { q: "Co robimy, gdy w domu pachnie gazem?", o: ["Otwieramy okna i wychodzimy", "Zapalamy światło", "Zostajemy"], a: 0 },
    { q: "Co pomaga po trudnym czasie?", o: ["Rytm dnia i pomaganie innym", "Siedzenie samemu w ciemności", "Nic"], a: 0 }
  ]
},
{
  id: 18, nr: "Finał", tytul: "Plecak 72 h i Karta Bohatera", odznaka: "🏆", emoji: "🎉",
  intro: "Brawo! Znasz już wszystkie misje. Na koniec dwie super ważne rzeczy: plecak na 3 dni (72 godziny) i Karta Bohatera z twoimi danymi.",
  punkty: ["Plecak 72 h: woda, filtr lub tabletki, batoniki, folia ratunkowa (błyszczący koc), 3 pary skarpet, latarka czołowa, plastry, ulubiona drobna rzecz na pocieszenie (czekolada!).", "Wyjście w 5 minut: 1. hasło „ALARM WYJŚCIE”, 2. buty i kurtka, 3. plecak, 4. dokumenty, 5. leki, 6. zwierzak, 7. dorośli wyłączają gaz i prąd, 8. kartka na drzwiach.", "Karta Bohatera (ICE): imię, nazwisko, telefon do rodziców, alergie. Noś ją w plecaku.", "Zostać czy wyjść? Jeśli niebezpieczeństwo jest W domu (ogień, woda w środku) – wychodzimy natychmiast. Jeśli dom jest bezpieczny i mamy zapasy – zostajemy.", "Gdy telefony nie działają: spotykamy się w miejscu A, potem SMS „JESTEM BEZPIECZNY”, potem dzwonimy do cioci z innego miasta.", "Proszenie o pomoc to oznaka siły, nie słabości!"],
  zabawa: "Wypełnij Kartę Bohatera z rodzicami i włóż do plecaka. Zrób ćwiczenie „wyjście w 5 minut” – rodzic mierzy czas!",
  quiz: [
    { q: "Plecak 72 h to plecak na:", o: ["3 dni", "3 godziny", "3 lata"], a: 0 },
    { q: "Pierwsza rzecz po haśle „ALARM WYJŚCIE”:", o: ["Buty i kurtka", "Zabawki", "Telewizor"], a: 0 },
    { q: "Ogień jest w domu. Zostajemy czy wychodzimy?", o: ["Wychodzimy natychmiast", "Zostajemy", "Oglądamy"], a: 0 },
    { q: "Proszenie o pomoc to:", o: ["Oznaka siły", "Wstyd", "Zabronione"], a: 0 }
  ]
}
];
