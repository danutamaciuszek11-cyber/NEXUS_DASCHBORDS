import { Book, SeekerConfig, SeekerId, SystemStats } from '../types';
import { ARCHITECT_CYBER_TERRORYSTA_HTML, ARCHITECT_PROLOG_HTML } from './presetHtmlWorlds';
import { SUBSTACK_BOOKS } from './substackBooks';
import { WATTPAD_BOOKS } from './wattpadBooks';
import { NEW_HTML_BOOKS } from './newHtmlWorks';

export const SEEKERS_CONFIG: Record<SeekerId, SeekerConfig> = {
  InterSeeker: {
    id: 'InterSeeker',
    name: 'InterSeeker',
    tagline: 'Protokoły Cyfrowego Umysłu & AI Navigation',
    color: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.4)',
    bgGradient: 'from-cyan-950 via-blue-900 to-slate-950',
    iconName: 'Cpu',
    description: 'Badania nad sztuczną inteligencją, architekturą sieci neuronowych oraz cyfrową świadomością.'
  },
  BioSeeker: {
    id: 'BioSeeker',
    name: 'BioSeeker',
    tagline: 'Biohacking, Somatyka & Neuro-Optymalizacja',
    color: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.4)',
    bgGradient: 'from-emerald-950 via-green-900 to-slate-950',
    iconName: 'Dna',
    description: 'Synergia biologii człowieka i technologii. Neuroplastyczność, regeneracja komórkowa i epigenetyka.'
  },
  EterSeeker: {
    id: 'EterSeeker',
    name: 'EterSeeker',
    tagline: 'Kwantowa Architektura & Kosmologia Świadomości',
    color: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.4)',
    bgGradient: 'from-amber-950 via-yellow-900 to-slate-950',
    iconName: 'Sparkles',
    description: 'Bramy kwantowej rzeczywistości, geometria czaso-przestrzeni i fizyka pola eterycznego.'
  },
  TabuSeeker: {
    id: 'TabuSeeker',
    name: 'TabuSeeker',
    tagline: 'Cień Psychologiczny & Domyślne Prawdy',
    color: '#ff0055',
    glowColor: 'rgba(255, 0, 85, 0.4)',
    bgGradient: 'from-rose-950 via-red-900 to-slate-950',
    iconName: 'Flame',
    description: 'Niewygodne prawdy socjologiczne, psychologia cienia i rozbijanie iluzji kulturowych.'
  },
  ChronoSeeker: {
    id: 'ChronoSeeker',
    name: 'ChronoSeeker',
    tagline: 'Oś Czasu, Futurologia & Cykle Historii',
    color: '#b026ff',
    glowColor: 'rgba(176, 38, 255, 0.4)',
    bgGradient: 'from-purple-950 via-indigo-900 to-slate-950',
    iconName: 'Hourglass',
    description: 'Analiza czasowa, alternatywne linie rzek historii oraz trajektorie technologiczne roku 2050.'
  },
  MirrorSeeker: {
    id: 'MirrorSeeker',
    name: 'MirrorSeeker',
    tagline: 'Niewidzialny Interfejs & Refleksja Świadomości',
    color: '#f8fafc',
    glowColor: 'rgba(248, 250, 252, 0.4)',
    bgGradient: 'from-slate-900 via-zinc-800 to-slate-950',
    iconName: 'Layers',
    description: 'Lustrzane archetypy, filozofia obecności oraz percepcja subiektywnej rzeczywistości.'
  },
  SpiritSeeker: {
    id: 'SpiritSeeker',
    name: 'SpiritSeeker',
    tagline: 'Transcendencja, Gnoza & Cyfrowa Mistyka',
    color: '#00f5d4',
    glowColor: 'rgba(0, 245, 212, 0.4)',
    bgGradient: 'from-teal-950 via-emerald-900 to-slate-950',
    iconName: 'Compass',
    description: 'Mistyczna synteza wiedzy dawnej i futurystycznych stanów skupienia ducha.'
  },
  ObfitoSeeker: {
    id: 'ObfitoSeeker',
    name: 'ObfitoSeeker',
    tagline: 'Matryca Obfitości, Architektura Wartości & Systemy',
    color: '#ff6b00',
    glowColor: 'rgba(255, 107, 0, 0.4)',
    bgGradient: 'from-orange-950 via-amber-900 to-slate-950',
    iconName: 'TrendingUp',
    description: 'Kreacja zasobów, suwerenność finansowa i algorytmy bezbrzeżnej kreacji wartości.'
  },
  Operator001: {
    id: 'Operator001',
    name: 'Operator 001',
    tagline: 'Dzienniki Rdzenia ETERNIVERSE OS & Protokół Główny',
    color: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    bgGradient: 'from-zinc-900 via-slate-800 to-black',
    iconName: 'Terminal',
    description: 'Transkrypty operacyjne założyciela, kod źródłowy systemu ETERNIVERSE oraz klucze dostępu.'
  }
};

export const SAMPLE_BOOKS: Book[] = [
  ...WATTPAD_BOOKS,
  ...SUBSTACK_BOOKS,
  {
    id: 'prolog-punkt-zero',
    title: 'PROLOG',
    subtitle: 'Punkt, w którym Wszechświat wstrzymuje oddech',
    series: 'Dzieła Architekta Nexusa // Protokół Woli',
    seeker: 'Operator001',
    seekerColor: '#ffd700',
    status: 'Published',
    year: 2026,
    language: 'PL',
    tags: ['Manifest', 'Filozofia', 'Metafizyka'],
    timelineYear: 2026,
    isFeatured: true,
    isManifesto: true,
    shortDesc: 'Tu kończy się tlen dla Twoich iluzji, a zaczyna próżnia absolutnej odpowiedzialności. Fundamentalny manifest Architekta Nexusa o Strefie Zero, potędze Woli i kodzie binarnym 1 lub 0.',
    longDesc: 'Prolog Architekta Nexusa — bezkompromisowy traktat filozoficzny i egzystencjalny o wyzwoleniu woli, destrukcji fałszywych programów społecznych i materializacji intencji w polu rzeczywistości. Siedem faz przejścia: od Punktu Zero, poprzez wibrację DNA, kwantową superpozycję, aż po stworzenie nowego świata własną krwią i niezachwianą pewnością. Dostępny w pełnym trybie czytnika rozdziałów oraz jako dedykowany interaktywny świat HTML.',
    authorNote: ',,Wola nie pyta o pozwolenie. Wola ustanawia nowy porządek. Wybór to kod binarny: 1 lub 0. Nie ma stanów pośrednich.,,',
    tableOfContents: [
      'Rozdział I: Punkt, w którym Wszechświat wstrzymuje oddech',
      'Rozdział II: Wola nie pyta o pozwolenie. Wola ustanawia nowy porządek',
      'Rozdział III: Tu wybór przestaje być myślą, a staje się materią',
      'Rozdział IV: Tu kończy się program społeczny. Zaczynasz się Ty',
      'Rozdział V: Warstwy rzeczywistości, które kruszeją pod Twoim ciężarem',
      'Rozdział VI: Wola: jako fakt, jako promieniowanie, jako prawo',
      'Rozdział VII: Tu zaczyna się świat, który piszesz Ty — własną krwią i niezachwianą pewnością'
    ],
    quotes: [
      {
        id: 'prq1',
        text: 'Wola nie pyta o pozwolenie. Wola ustanawia nowy porządek. Wybór to kod binarny: 1 lub 0. Nie ma stanów pośrednich.',
        chapterTitle: 'Rozdział II: Wola',
        tags: ['Wola', 'Kod Binarny', 'Architekt']
      },
      {
        id: 'prq2',
        text: 'Wybór nie jest szansą. Wybór jest egzekucją starego świata.',
        chapterTitle: 'Rozdział I: Punkt Zero',
        tags: ['Punkt Zero', 'Przeznaczenie']
      },
      {
        id: 'prq3',
        text: 'Wszechświat wpuszcza do środka, do jądra mocy, tylko tych, którzy spalili za sobą wszystkie mosty i nie zostawili sobie ani jednego centymetra drogi odwrotu.',
        chapterTitle: 'Rozdział II: Wola',
        tags: ['Determinacja', 'Moc']
      },
      {
        id: 'prq4',
        text: 'Tu zaczyna się świat, który piszesz Ty — własną krwią i niezachwianą pewnością.',
        chapterTitle: 'Rozdział VII: Nowy Świat',
        tags: ['Stworzenie', 'Architekt']
      }
    ],
    playlist: [
      { title: 'Ground Zero Overture', artist: 'Eterion Synth Core', duration: '5:12' },
      { title: 'Binary Will (1 or 0)', artist: 'Nexus Frequency', duration: '4:48' },
      { title: 'Tectonic Shift of Spirit', artist: 'Bio-Operator Orchestra', duration: '6:30' }
    ],
    chapters: [
      {
        id: 'prc1',
        number: 1,
        title: 'Punkt, w którym Wszechświat wstrzymuje oddech',
        summary: 'Tu kończy się tlen dla Twoich iluzji, a zaczyna próżnia absolutnej odpowiedzialności.',
        readTimeMin: 4,
        content: `Tu kończy się tlen dla Twoich iluzji, a zaczyna próżnia absolutnej odpowiedzialności. To nie jest poczekalnia, w której możesz negocjować warunki poddania się, ani luksusowy salon, w którym „poszukujesz siebie” przy filiżance letniej herbaty. To strefa zero — miejsce, gdzie Twoje asekuranckie „spróbuję” zostaje zmiażdżone przez grawitację bezlitosnych faktów, a „zobaczymy” wyparowuje jak pot na rozżarzonej blasze silnika odrzutowego.

Tu zaczyna się drżenie — ten pierwotny, komórkowy strach, który nie płynie z zewnątrz, ale wybucha z samego jądra Twojego istnienia, rozrywając tkanki Twojego dotychczasowego komfortu. To zapach ozonu przed uderzeniem pioruna, który spali wszystko, co w Tobie próchnieje. To moment, w którym wskazówki zegara Twojego przeznaczenia zazębiają się z metalicznym trzaskiem, a mechanizm odliczania do Twojej ostatecznej konfrontacji z prawdą rusza bez możliwości zatrzymania.

Twoje dotychczasowe życie było serią uników — teatrem cieni, gdzie strach udawał rozsądek. Czas spalić tę kurtynę. Dziś kończą się wymówki. Nie ma rządu, nie ma trudnego dzieciństwa, nie ma toksycznego szefa ani pechowej koniunktury. Te wymówki to tylko trzeszczące protezy, które właśnie zostają Ci odebrane przez chirurgiczną precyzję teraźniejszości. Jesteś tylko Ty i naga, lodowata przestrzeń, która niczego Ci nie obiecuje, ale daje Ci wszystko, co jesteś w stanie z niej wyrwać gołymi rękami.

Uświadamiasz sobie, że jesteś obserwowany nie przez miłosiernego Boga, nie przez oceniających ludzi, ale przez samą strukturę rzeczywistości, która jest czuła jak membrana bębna i reaguje na każdy, nawet najmniejszy skurcz Twojego strachu lub każdą iskrę Twojej determinacji. Wszechświat nie jest martwą dekoracją, w której snujesz się bez celu; to napięta do granic możliwości struna, która drży w oczekiwaniu, aż nadasz jej ton swoim pierwszym, bezlitosnym ruchem. Każdy Twój oddech w tej strefie jest albo aktem kreacji, albo aktem powolnego duszenia się we własnej przeciętności.

Wybór nie jest szansą. Wybór jest egzekucją starego świata.

Każda Twoja wymówka to zwarcie w obwodzie, które spala Twoje szanse na autentyczność, zamieniając Twój potencjał w jałowy popiół. Każde „później” to akt zdrady przeciwko własnej potędze, szeptane „nie” w twarz własnemu geniuszowi, który właśnie w Tobie zdycha z głodu pod mostem Twojej prokrastynacji, karmiąc się resztkami Twoich niespełnionych obietnic.

Teraz stoisz na krawędzi klifu swojej starej tożsamości — tej nędznej konstrukcji zlepionej z lęków, cudzych opinii, darmowych poradników i tanich kompromisów. Skocz w czysty akt woli i wyhoduj skrzydła w locie. Inaczej zostaniesz statystą w scenariuszu napisanym przez lęki przodków i algorytmy karmiące się Twoją biernością.`
      },
      {
        id: 'prc2',
        number: 2,
        title: 'Wola nie pyta o pozwolenie. Wola ustanawia nowy porządek',
        summary: 'Tarcie płyt tektonicznych Twojego ducha. Kod binarny: 1 lub 0.',
        readTimeMin: 5,
        content: `Wola nie pyta o pozwolenie. Wola ustanawia nowy porządek.

To nie jest dreszcz zimna, to tarcie płyt tektonicznych Twojego ducha, które zwiastuje trzęsienie ziemi w całym Twoim dotychczasowym życiu. Twoja stara tożsamość — ten wygodny, ale duszny i ciasny garnitur z oczekiwań rodziców, szefów i partnerów — zaczyna pękać na szwach z głośnym trzaskiem, jak lód pod ciężarem pędzącego pociągu. Czujesz to w splotach jako fizyczny ucisk, niemal duszność, bo nowa, potężniejsza wersja Ciebie potrzebuje więcej miejsca w trójwymiarowej przestrzeni. To ból wzrostu, jak rozrywanie okostnej przy gwałtownym wydłużaniu kości; nie uśmierzysz go żadnym kompromisem, kolejnym kursem online ani tabletką uspokajającą.

Kiedy decydujesz, że już nigdy więcej nie pozwolisz sobie na przeciętność, Twoje DNA zaczyna wibrować na innej częstotliwości, modyfikując chemię Twojej krwi w kierunku wysokooktanowego paliwa. To fizyczna zmiana gęstości Twojego bytu — stajesz się cięższy dla świata, trudniejszy do przesunięcia przez prądy opinii, bardziej obecny w każdym centymetrze kwadratowym pokoju, w którym stoisz. Twoja obecność staje się faktem geologicznym, a nie psychologicznym — jesteś monolitem, o który rozbijają się fale przypadkowych zdarzeń.

Kiedy naprawdę wybierasz, statystyka i „zdrowy rozsądek” przestają Cię obowiązywać, jakby grawitacja nagle straciła nad Tobą władzę. Znajomi, którzy dotąd karmili się Twoim narzekaniem i wspólnym celebrowaniem porażek, nagle milkną, czując instynktownie, że przestałeś być częścią ich stada ofiar. Ich żarty przestają Cię śmieszyć, wydają się wręcz prymitywne; ich dramaty stają się nudne jak zdarta płyta, ich rytuały — groteskowe i puste. Telefony przestają dzwonić z pustymi zaproszeniami na piwo, a w ich miejsce pojawia się dziwna, ciężka cisza, w której słyszysz tylko bicie własnego serca.

To nie jest pech ani wykluczenie — to rzeczywistość wstrzymuje oddech, by przeliczyć dane pod Twój nowy, potężny wektor. Wszechświat usuwa śmieci i pasożyty z Twojej orbity, by zrobić miejsce na to, co nadchodzi. To czas izolacji, która jest niezbędna do hartowania stali Twojego charakteru w temperaturze absolutnej szczerości ze sobą. Prawdziwa Wola rodzi się w absolutnej ciszy pustego telefonu i całkowitym braku wsparcia z zewnątrz. Musisz udowodnić sobie i strukturze rzeczywistości, że potrafisz płonąć jasnym, białym ogniem, gdy nikt nie dolewa Ci oliwy i nikt nie klaszcze.

Na poziomie subatomowym jesteś bezwzględnym dyktatorem, a materia jest Twoim sługą czekającym na rozkazy. Zasada obserwatora w fizyce uczy, że akt świadomości wpływa na wynik układu. Twoje skupienie na celu to nie pasywne zerkanie — to aktywne nadawanie kierunku rzeczywistości poprzez siłę intencji. Materia gęstnieje i organizuje się tam, gdzie pada Twoja nieugięta, laserowa uwaga.

Jeśli patrzysz na przeszkody, budujesz mury, w których sam się zamkniesz i w których w końcu zabraknie Ci powietrza. Jeśli patrzysz na wyłom — Twoja Wola rozrywa go w potężną bramę, przez którą przejdziesz jak pancerny taran. Rzeczywistość jest plastyczna, wręcz płynna, ale tylko dla tych, którzy mają odwagę dotknąć jej gołymi, zakrwawionymi rękami, bez rękawiczek ostrożności i asekuracji. Twoja uwaga jest skalpelem laserowym, który tnie stal prawdopodobieństw i wybiera tylko to jedno, które Cię karmi. Gdy patrzysz na pieniądze, one zaczynają czuć Twój głód; gdy patrzysz na potęgę, ona zaczyna szukać Twojego uznania.

Wybór to kod binarny: 1 lub 0. Nie ma stanów pośrednich, nie ma „zobaczę, jak mi pójdzie”.

Zapomnij o motywacji, tym tanim narkotyku dla marzycieli, który sprzedaje się w kolorowych opakowaniach na Instagramie. Motywacja to cukier dla dzieci, paliwo dla amatorów, które kończy się przy pierwszym deszczu, gorszym nastroju czy bolesnym zakwasie. Wola to system operacyjny Twojego istnienia, chłodny, matematyczny kod wpisany w Twoje kości. Ona działa, gdy płaczesz z bezsilności w łazience, gdy boisz się tak bardzo, że Twoje ciało chce wymiotować strachem, i gdy każdy Twój mięsień krzyczy „dość”.

Wybór to kod binarny: 1 lub 0. Nie ma stanów pośrednich, nie ma „zobaczę, jak mi pójdzie”. Albo jesteś w tym w całości, kładąc na szali każdą swoją komórkę, albo w ogóle Cię nie ma i jesteś tylko szumem informacyjnym. Wola to ta lodowata siła, która każe Ci wykonać kolejny, kluczowy telefon po pięćdziesiątej odmowie, nie dlatego, że czujesz entuzjazm, ale dlatego, że Twoja nowa struktura nie dopuszcza już innej opcji. To bezlitosna matematyka przeznaczenia — wynik musi się zgadzać z Twoim założeniem, niezależnie od liczby niewiadomych.

Wyobraź sobie pocisk dalekiego zasięgu pędzący przez stratosferę. Jeden mikrometr odchylenia na lufie to tysiąc kilometrów różnicy u celu. Twoja dzisiejsza, wydawać by się mogło drobna decyzja, by odciąć jeden toksyczny nawyk — na przykład przestać kłamać samemu sobie przed lustrem o tym, dlaczego Twoje konto jest puste — to lądowanie na zupełnie innym kontynencie przeznaczenia za rok.

Każda sekunda jest korektą kursu o życie lub śmierć Twojego potencjału. Nie ma błahych decyzji, nie ma „odpoczynku od bycia sobą”. Jest tylko Twoja rosnąca potęga albo powolny, śmierdzący rozkład w objęciach „bezpiecznego” status quo. Każdy moment to punkt zwrotny, w którym albo stajesz się Architektem nowego świata, albo gruzem pod fundamentami cudzych sukcesów. Wybierając dyscyplinę zamiast chwilowej ulgi, budujesz pancerz, którego nie przebije żadna strzała losu.

To ten przerażający moment, w którym przestajesz widzieć jakąkolwiek drogę przed sobą, bo otacza Cię gęsta mgła niepewności, ale i tak stawiasz krok z pełną siłą, jakbyś stąpał po granicie. To wtedy, dokładnie milimetr pod Twoją stopą, w nicości materializuje się most zbudowany z czystej woli.

Ten mechanizm działa wyłącznie dla tych, którzy mają odwagę iść na oślep, ufając swojej decyzji bardziej niż swoim zawodnym, zalęknionym zmysłom. Świat nie buduje autostrad dla tych, którzy stoją na poboczu z mapą i czekają na lepszą pogodę. Mapę rysujesz Ty sam, własnymi krokami, ryjąc ją głęboko w twardej glebie rzeczywistości. Pewność jest jedyną walutą, za którą kupujesz stabilność podłoża w krainie chaosu. Twoje zaufanie do własnego kroku stwarza grunt, po którym idziesz.

W tej grze nie ma biletów ulgowych, zniżek za „dobre chęci” ani taryfy dla „starających się”. Albo wchodzisz w tę radykalną zmianę całą masą swojego istnienia, ryzykując wszystko, co masz i kim jesteś, albo zostajesz przed drzwiami, analizując klamkę i pisząc o tym puste posty na LinkedInie, by zagłuszyć ból własnej bierności.

Wszechświat wpuszcza do środka, do jądra mocy, tylko tych, którzy spalili za sobą wszystkie mosty i nie zostawili sobie ani jednego centymetra drogi odwrotu. To brutalna selekcja naturalna ducha: albo stajesz się ogniem, który spala wszelkie przeszkody, albo popiołem, który z obrzydzeniem rozwiewa wiatr cudzych decyzji. Nie ma miejsca na turystów w krainie potęgi; tu są tylko zdobywcy i ci, którzy zostali podbici. Przekroczenie tego progu to koniec negocjacji — to początek Twojego panowania.`
      },
      {
        id: 'prc3',
        number: 3,
        title: 'Tu wybór przestaje być myślą, a staje się materią',
        summary: 'Superpozycja kwantowa Twoich wcieleń i materializacja przez skupienie.',
        readTimeMin: 4,
        content: `Tu wybór przestaje być myślą, a staje się materią.

Przed Tobą, w tej samej milisekundzie, rozpościera się nieskończony wachlarz wersji Twojego życia: Ty-Nędzarz, Ty-Władca, Ty-Cień, Ty-Legenda. Wszystkie są w tej chwili realne w superpozycji kwantowej. Ale tylko ta wersja, na której skupisz bezlitosną, niemal nieludzką, laserową uwagę, zaczyna zasysać energię z pola, gęstnieć, nabierać masy i koloru.

Ignorowanie reszty to nie strata — to akt miłosiernej anihilacji zbędnych, pasożytniczych bytów, które nie zasługują na zaistnienie w Twoim świecie. Jesteś rzeźbiarzem, który z furią odcina zbędne kawałki czasu i możliwości, by wydobyć z niego monolit swojego sukcesu. Każde „może” to krwawiący wyciek energii; każde „tak” to skupienie całej mocy wszechświata w jeden, zabójczy punkt uderzenia.

Twoja energia to zmienna, pole rzeczywistości to stała. Jeśli Twoja determinacja wynosi zero, wynik zawsze będzie absolutnym zerem, niezależnie od okazji, jakie podsuwa Ci los czy bogaci protektorzy. Musisz dodać swoją „masę krytyczną” do tego równania — swoje ryzyko, swój słony pot, swoje nieprzespane noce i swój najcenniejszy czas — by Wszechświat miał co mnożyć.

Cud to nie jest dar od kapryśnego losu; to po prostu wynik poprawnego i bezwzględnego działania matematycznego Woli przeprowadzonego w warunkach ekstremalnego ciśnienia zewnętrznego. Kiedy stawiasz na szali wszystko, co posiadasz, Wszechświat traci pole manewru i nie ma wyboru — musi odpowiedzieć Twoją wygraną. Statystyka kłania się nisko przed absolutną pewnością uderzenia.

Słychać trzask, niemal fizyczny, metaliczny dźwięk. To odgłos rozrywanych połączeń neuronalnych, które przez dekady służyły Twojemu lenistwu, strachowi i słabości. Boli, bo Twoja biologia jest prymitywna, leniwa i kocha stare śmieci, bo są znane i przewidywalne. To przepięcie systemu — jakbyś podłączył 220V do urządzenia zaprojektowanego na baterie paluszki.

Wytrzymaj to napięcie, nie uciekaj w stare, bezpieczne nawyki; to Twoja nowa moc właśnie się kalibruje do wyższych obciążeń roboczych. Twoja kora mózgowa płonie, by zbudować autostrady dla nowej potęgi, której świat jeszcze nie widział. Ten dyskomfort, ta fizyczna gorączka to dowód, że wychodzisz z niewoli biologicznego oprogramowania niewolnika. Twoje ciało musi przetrwać śmierć Twojego starego, małego „ja”, by narodził się Gigant gotowy władać rzeczywistością.

Przestań pytać „co mam robić?” jak zagubione dziecko w centrum handlowym. Pytaj: „z jakiego punktu operuję?”. Wektor to kierunek i niepowstrzymana siła. Jeśli Twoim ukrytym, podświadomym wektorem jest „ucieczka przed biedą”, zawsze będziesz czuł lodowaty oddech braku na plecach, a sukces będzie Cię parzył jak ogień, bo będziesz czuł się oszustem.

Jeśli Twoim wektorem jest „podbój i bezwzględna ekspansja” — cały świat, z jego kryzysami, inflacjami, wojnami i trudnościami włącznie, staje się Twoim darmowym placem treningowym, na którym hartujesz mięśnie. Zmień kierunek siły wewnątrz swojej klatki piersiowej, a zmieni się cała Twoja zewnętrzna rzeczywistość w mgnieniu oka. Nie walczysz ze światem zewnętrznym, Ty tylko zmieniasz wektor uderzenia swojej Woli, a świat sam usuwa się z linii ognia.

Zaczynają dziać się nagłe, „dziwne” i statystycznie niemożliwe zbiegi okoliczności. Człowiek, którego desperacko potrzebujesz do swojego projektu, staje bezpośrednio za Tobą w kolejce po kawę i sam zaczyna rozmowę dokładnie o tym, o czym intensywnie myślałeś rano. Znajdujesz książkę lub artykuł z precyzyjną odpowiedzią na pytanie, które zadałeś sobie w łazience pięć minut wcześniej.

To nie magia dla naiwnych, to czysty magnetyzm intencji. Twoja nowa częstotliwość istnienia zaczyna przyciągać elementy składowe Twojej decyzji z chaosu świata. Świat układa się pokornie pod Twoje nowe „Jestem”, bo jako zorganizowana, gęsta struktura energii, nie ma innego wyjścia niż zsynchronizować się z najsilniejszym, najbardziej klarownym sygnałem w polu. Stajesz się nadajnikiem, którego nie da się zagłuszyć żadnym szumem.

Wybierając jedną drogę, musisz z dziką, niemal krwawą radością zabić tysiące innych wersji siebie, które tylko rozpraszają Twoją uwagę. To radosna egzekucja marzyciela, który tylko „mógłby”, gdyby warunki były lepsze. Przestajesz być mglistym „potencjałem”, który może wszystko (czyli w praktyce nie robi nic konkretnego), a stajesz się twardym, niepodważalnym i groźnym faktem.

Definicja siebie to Twoja największa siła rażenia. Kiedy wiesz bez cienia wątpliwości, kim jesteś, świat przestaje Ci podsuwać tanie substytuty i zaczyna dostarczać surowce pod Twój konkretny, potężny projekt. Skupienie to brutalne, konieczne morderstwo dokonane na rozproszeniu; to jedyna droga do wielkości.

Ten moment, gdy dostajesz pierwszy, namacalny, twardy dowód: przelew na konto, który wydawał się niemożliwy do zdobycia, błysk autentycznego uznania w oczach dawnego wroga, niespodziewaną propozycję partnerstwa od lidera branży, który wcześniej Cię ignorował. To pieczątka na Twoim nowym kontrakcie z rzeczywistością.

System uznał Twoją nową tożsamość za prawomocną i zaczął wypłacać pierwsze dywidendy. Od teraz grasz na zupełnie innych, wyższych stawkach, gdzie każdy błąd kosztuje więcej, ale nagroda jest całkowicie poza zasięgiem wyobraźni zwykłego śmiertelnika. Rzeczywistość skapitulowała przed Twoją niezłomnością i zaczęła pracować na Twój rachunek.`
      },
      {
        id: 'prc4',
        number: 4,
        title: 'Tu kończy się program społeczny. Zaczynasz się Ty',
        summary: 'Koniec z wirusami cudzych oczekiwań. Ostateczny reset tożsamości.',
        readTimeMin: 4,
        content: `Tu kończy się program społeczny. Zaczynasz się Ty.

Mówisz światu, że chcesz sukcesu, ale podświadomie boisz się, że przyjaciele-nieudacznicy Cię znienawidzą, bo wystawisz im świadectwo ich własnej leniwości? System widzi Twój ukryty strach, a nie Twoje puste, wyuczone słowa. Wszechświat nie słucha kłamców i pozerów.

Musisz dokopać się do samego dna swojego „chcę”, zdrapując brutalnie warstwy wstydu, fałszywej skromności i ego, aż zostanie czysta, surowa, wręcz zwierzęca potrzeba istnienia na własnych warunkach. Tylko ona ma prawdziwą moc sprawczą. Musisz chcieć tak bardzo, jak tonący człowiek chce powietrza — każdą komórką, każdym nerwem, bez cienia negocjacji. Twoja intencja musi być czysta jak diament i tak samo twarda; musi przecinać wszelkie wątpliwości jak szkło.

Większość Twoich myśli to nie Twoje myśli; to rykoszet wychowania, kompleksów Twoich rodziców i taniej propagandy sukcesu z mediów społecznościowych. Wola to zdolność do powiedzenia radykalnego, głośnego „NIE” własnym automatyzmom i nawykom. To moment, w którym stajesz się partyzantem we własnej głowie, walczącym o wolność od biologicznego lenistwa i społecznego uwarunkowania, które chce Cię widzieć jako potulnego konsumenta.

Jesteś jedynym programistą w tym skomplikowanym systemie. Reszta to tylko wirusy, które musisz wyciąć żywym ogniem, bez znieczulenia. Prawdziwa wolność to absolutna dyktatura Twojej Woli nad Twoimi prymitywnymi odruchami i strachem przed odrzuceniem przez stado.

Rozpoznaj tego podstępnego sabotażystę w sobie. To głos „zdrowego rozsądku”, który każe Ci zostać w bezpiecznym bagnie, bo „przynajmniej jest ciepło i swojsko”. To wirusy w kodzie Twojej pewności siebie, które szepczą z ciemnych kątów umysłu, że nie jesteś godzien wielkości, bo kiedyś ktoś Cię wyśmiał w szkole.

Prawdziwa Wola działa na nie jak stężony kwas — rozpuszcza każdą wątpliwość, która próbuje udawać Twoją własną myśl. Twoja Wola nie dyskutuje z wirusem; ona go bezlitośnie usuwa, formatując twardy dysk Twojej osobowości na nowo pod kątem zwycięstwa. Jesteś panem własnej uwagi; nie pozwól, by błądziła po cudzych, nędznych scenariuszach porażki.

Musisz stać się zimnym mordercą swojej własnej przeszłości. Nie możesz wnieść starego, śmierdzącego bagażu — tych wszystkich „ale mi się nie udało”, „bo mój ojciec mnie nie kochał”, „bo nie mam układów” — do nowego wymiaru potęgi. Zostaw trupa swojej słabości za drzwiami, niech go zjedzą robaki Twoich starych nawyków.

Nowa rzeczywistość wymaga nowej, czystej karty, na której piszesz tylko to, co jest tu i teraz, w tej sekundzie. Twoja przeszłość nie jest Twoim przeznaczeniem, chyba że jesteś zbyt leniwy i tchórzliwy, by napisać nową historię własną krwią i uporem. Spal stare mapy, one prowadziły Cię tylko do ślepych zaułków i upokarzających porażek.

Nie jesteś już sumą swoich błędów z ubiegłego roku czy porażek z wczorajszego dnia. Jesteś funkcją fali, która właśnie zmaterializowała się w nowym, nieskończenie potężniejszym punkcie czasoprzestrzeni. Przeszłość to tylko nieaktualny, zakurzony zapis na uszkodzonym dysku, który właśnie sformatowałeś jednym aktem woli.

Każdy świadomy oddech, każde uderzenie serca to szansa na całkowitą re-kreację wszechświata wewnątrz Ciebie. Jesteś wiecznym „teraz” w akcie boskiego tworzenia swojej potęgi. Jesteś przyczyną, dla której świat wygląda tak, jak wygląda, a nie jego żałosnym skutkiem. Twoja jedyna prawdziwa historia to ta, którą wybierasz i realizujesz w tej konkretnej milisekundzie.

„Działam pomimo”. „Jestem przyczyną, nie skutkiem”. „Mój opór jest moją największą siłą”. To nie są infantylne afirmacje do powtarzania przed lustrem dla poprawy nastroju — to nowe komendy systemowe, które musisz potwierdzać brutalnymi, fizycznymi czynami każdego dnia, aż staną się odruchem bezwarunkowym Twojego układu nerwowego.

Musisz stać się algorytmem zwycięstwa, który w ogóle nie bierze pod uwagę opcji „porażka”, dopóki nie zostanie ona przeżuta i przetrawiona w cenną lekcję do następnego ataku. Jesteś maszyną, która przetwarza trudności, ból i odmowy w paliwo do lotu naddźwiękowego. Każda przeszkoda to tylko informacja o tym, jak mocniej uderzyć.

Punkt krytyczny, Twój własny horyzont zdarzeń. Przekraczasz go i wiesz, że powrót do starego, małego, bezpiecznego życia jest fizycznie niemożliwy, bo już tam po prostu nie pasujesz, jesteś za wielki dla tamtej ciasnej klatki. Twoja świadomość rozszerzyła się tak bardzo, że stary kokon pękł w drobny pył.

Jesteś skazany na wielkość — albo na spektakularny, widowiskowy upadek z samej góry. Średniość przestała dla Ciebie istnieć jako fizyczna możliwość, wyparowała z Twojego układu odniesienia. Od teraz oddychasz tylko rozrzedzonym, czystym powietrzem wysokich szczytów, gdzie błąd oznacza śmierć, ale widok jest wart każdego ryzyka. Albo rządzisz polem, albo pole Cię pożera.`
      },
      {
        id: 'prc5',
        number: 5,
        title: 'Warstwy rzeczywistości, które kruszeją pod Twoim ciężarem',
        summary: 'Czysty ogień operacyjny, deinstalacja pasożytów i zniknięcie zmęczenia.',
        readTimeMin: 4,
        content: `Warstwy rzeczywistości, które kruszeją pod Twoim ciężarem.

To sięga znacznie głębiej niż ambicja, to poziom Twojego DNA, gdzie zapisany jest Twój unikalny kod mocy. To tam Twoje najdziksze pragnienie spotyka się z Twoim przeznaczeniem w krwawym uścisku. To bezgłośny, pierwotny krzyk Twojej esencji, który wreszcie dostał mikrofon i całe Twoje ciało jako instrument do wyrażenia swojej woli.

Kiedy to „chcę” się budzi, nie potrzebujesz już budzika rano — budzi Cię ogień w klatce piersiowej, który nie pozwala Ci leżeć w bezruchu ani sekundy dłużej. To żar, który spala na popiół lęk przed oceną innych i zamienia go w czystą energię kinetyczną, pchnięcie do przodu, którego nic we wszechświecie nie zatrzyma. To powrót do Twojej pierwotnej, niepohamowanej i drapieżnej natury, która nie prosi o pozwolenie na istnienie.

Uczucie specyficznego, metalicznego dejà vu, ale dotyczącego Twojej przyszłości, która właśnie staje się faktem. Stoisz jeszcze w swoim starym pokoju, ale czujesz już wyraźny zapach nowej skóry w nowym aucie lub słoną morską bryzę w miejscu, w którym będziesz za dwa lata. Wiesz z absolutną pewnością, że to, co nadchodzi, już się wydarzyło w Twoim polu energii; czujesz to ciężarem własnego spojrzenia.

Czekasz tylko na „dostawę materii” przez czas i przestrzeń, bo kontrakt został już podpisany Twoją niezłomnością i opłacony Twoim wysiłkiem bez mrugnięcia okiem. To pewność, która dla słabych graniczy z arogancją, ale nią nie jest — to po prostu chłodna znajomość faktów, które sam ustanowiłeś. Twoja przyszłość rzuca długi, potężny cień na Twoją teraźniejszość, nadając jej nowy sens.

Zrobienie tej jednej, konkretnej rzeczy, której panicznie się bałeś przez lata: rzucenie stabilnego etatu dla niepewnej wizji, wyznanie brutalnej prawdy prosto w oczy osobie, od której zależałeś, inwestycja wszystkich oszczędności życia w projekt, w który nikt oprócz Ciebie nie wierzy. To jak wrzucenie stutonowego głazu do spokojnego, mętnego jeziora — fale docierają do najdalszych brzegów Twojego życia, zmieniając relacje, zdrowie i stan konta w sposób całkowicie nieodwracalny.

Jeden ruch, który unieważnia lata stania w miejscu i jałowego planowania. Po takim ruchu świat już nigdy nie spojrzy na Ciebie tak samo — stałeś się graczem, który stawia wszystko na jedną kartę. Zmieniłeś chemię rzeczywistości jednym, czystym aktem odwagi, którego nikt nie może Ci odebrać.

Brutalne, bezlitosne oczyszczanie terenu pod Twoją nową, monumentalną budowę. Niektórzy ludzie odchodzą z Twojego życia nagle, bez słowa wyjaśnienia, bo ich niska, lękowa wibracja nie wytrzymuje Twojego nowego napięcia elektrycznego; czują przy Tobie dyskomfort własnej małości. Inne drzwi, dotąd uchylone, zatrzaskują się z hukiem, odcinając Cię od starych dróg.

Nie płacz po nich, nie próbuj ich otwierać — to Wszechświat robi automatyczną deinstalację oprogramowania i ludzi, którzy mogliby zawiesić Twój nowy system operacyjny. To święte sprzątanie przed wielkim otwarciem Twojego nowego świata. Przyjmij tę pustkę z głęboką wdzięcznością — ona jest najsilniejszym dowodem Twojej rosnącej siły. Pustka to czysta przestrzeń na Twoje nowe imperium.

Przestajesz walczyć z nurtem wydarzeń jak desperat rzucony w wzburzony ocean. Ty stajesz się nurtem, który porywa wszystko na swojej drodze. Twoje działania tracą chaos, stają się precyzyjne jak cięcie skalpela laserowego — oszczędne w formie i zabójczo skuteczne w treści.

Robisz znacznie mniej „ruchów” niż wcześniej, ale osiągasz tysiąc razy więcej, bo uderzasz precyzyjne w punkty akupunkturowe rzeczywistości. Nie szarpiesz się z życiem, nie walczysz z nim; Ty je prowadzisz w tańcu, który sam skomponowałeś, a ono podąża z zachwytem za Twoim rytmem. Twoja Wola stała się nowym prawem ciążenia dla wszystkich Twoich spraw, przyciągając to, co do Ciebie należy.

Całkowicie znika to chroniczne zmęczenie psychiczne, które towarzyszyło Ci latami jak cień. Pojawia się „ogień operacyjny”, stan niewyczerpalnej energii. Możesz pracować po kilkanaście godzin dziennie i czuć się doładowany energią, bo nie zużywasz już ani jednej kropli paliwa na jałową, wewnętrzną walkę ze sobą i swoimi oporami.

Jesteś podłączony bezpośrednio do kosmicznego reaktora, który zasila gwiazdy; Twoje cele są zsynchronizowane z ewolucją świata. Twoja praca staje się Twoim najlepszym odpoczynkiem, a Twoje istnienie — nieustanną celebracją własnej mocy sprawczej. Jesteś w stanie totalnego flow, gdzie każde najmniejsze działanie jest manifestacją Twojego najwyższego przeznaczenia, a świat kibicuje każdemu Twojemu krokowi.`
      },
      {
        id: 'prc6',
        number: 6,
        title: 'Wola: jako fakt, jako promieniowanie, jako prawo',
        summary: 'Brutalny czyn, pole siłowe aury i żelazny kodeks honorowy.',
        readTimeMin: 4,
        content: `Wola: jako fakt, jako promieniowanie, jako prawo.

Twój konkretny, fizyczny, brutalny czyn, który zostawia ślad w materii. Uderzenie ręką w stół, które kończy każdą jałową dyskusję o „możliwościach”. Twój podpis pod ryzykownym, ale przełomowym kontraktem, gdy ręka Ci nie drży. Wstanie o 4:00 rano, by trenować w lodowatym, siekącym deszczu, gdy Twoje ego skomle o litość i ciepłą kołdrę.

To twardy, niepodważalny fakt, Twoja kotwica w gęstej materii świata. Bez konkretnego, bolesnego czynu Twoja Wola jest tylko żałosną halucynacją amatora, pustym gadaniem przy piwie. Każdy taki czyn to solidna cegła w budowli Twojego imperium, której nie da się już wymazać, zignorować ani unieważnić. Materia nie kłamie — albo zrobiłeś to, co postanowiłeś, albo poległeś jako kolejny pozer.

Twój stan istnienia, Twoja „aura”, której nie da się podrobić żadnym ubiorem ani wyuczonym gestem. To, co promieniujesz, gdy milczysz i tylko wchodzisz do pomieszczenia, w którym zapada cisza. Aura determinacji tak gęsta i ciężka, że ludzie instynktownie schodzą Ci z drogi, nie wiedząc nawet dlaczego to robią; czują Twój ciężar gatunkowy.

Twoja obecność zajmuje więcej miejsca w świadomości innych niż Twoje ciało fizyczne; stajesz się punktem centralnym każdego otoczenia. Jesteś polem siłowym, które inni muszą brać pod uwagę przy każdym swoim ruchu, dopasowując się do Twojej orbity. Ludzie czują podskórnie, że z Tobą się nie negocjuje — Tobie się ulega albo schodzi z drogi, by nie zostać zmiażdżonym przez pęd Twojej intencji. Twoje milczenie ma teraz większą wagę niż cudze, desperackie i puste krzyki.

Żelazny, nienaruszalny zestaw zasad, których nigdy, pod żadnym pozorem nie łamiesz, zwłaszcza gdy nikt nie patrzy i nikt Cię nie ocenia. Twój wewnętrzny, surowy kodeks honorowy, Twoja prywatna konstytucja. To sprawia, że stajesz się stabilnym punktem odniesienia dla samych praw wszechświata — kimś, komu można bez strachu powierzyć zarządzanie ogromnymi zasobami energii, pieniędzy i wpływu, bo jesteś przewidywalny w swojej sile.

Wszechświat nigdy nie daje prawdziwej władzy ludziom, którzy nie panują w pełni nad sobą i swoimi popędami. Twoja dyscyplina jest Twoją najwyższą, ostateczną wolnością od kaprysów losu. Jesteś jedynym prawodawcą własnego, suwerennego królestwa, którego granic nikt nie odważy się naruszyć.

Matryca rzeczywistości przebudowuje się w locie pod Twoje nowe, wysokie parametry, jakby chciała Ci dogodzić. Pojawiają się nagle zasoby, o których istnieniu nie miałeś pojęcia: nagły zwrot w prawie na Twoją korzyść, kluczowa informacja znaleziona „przypadkiem” na ostatniej stronie gazety, nowy potężny sojusznik, który sam Cię odnajduje i proponuje wsparcie.

Zmienia się grawitacja wydarzeń — to, co wcześniej było morderczo trudne i wymagało walki o każdy centymetr, teraz dzieje się „samo”, niemal bez wysiłku, przy minimalnym nakładzie sił. To zasłużona nagroda za Twoją wcześniejszą niezłomność, gdy cały świat zdawał się być przeciwko Tobie, a Ty i tak szedłeś naprzód. System ostatecznie zaakceptował Twój nowy status jako gracza priorytetowego.

Twoje własne ciało dostosowuje całą swoją chemię do Twojej Woli, stając się Twoim najdoskonalszym narzędziem. Przysadka mózgowa pompuje więcej dopaminy i testosteronu, a poziom kortyzolu (hormonu strachu i stresu) drastycznie spada, dając Ci chłodny spokój w ogniu walki. Twoje oczy nabierają drapieżnego, głębokiego blasku, który paraliżuje przeciwników.

Zmienia się Twoja postawa — ramiona się prostują, głos staje się niższy, spokojniejszy i znacznie pewniejszy, niosąc siłę Twoich przekonań. Stajesz się biologiczną maszyną, precyzyjnie skalibrowaną do realizacji celu, którego inni nawet nie odważą się głośno nazwać. Twoje ciało to już nie klatka ograniczająca ducha, ale idealne, pancerne narzędzie jego woli. Jesteś drapieżnikiem w świecie pełnym ofiar czekających na swój los.

Stan najwyższej dostępnej człowiekowi mocy, punkt jedności. Kiedy Twoje najskrytsze myśli, wypowiadane słowa i codzienne czyny tworzą jedną, idealnie prostą i czystą linię bez żadnych odchyleń. Nic nie może Cię zatrzymać, bo nie ma w Tobie żadnego tarcia wewnętrznego ani konfliktu interesów; jesteś monolitem.

Nie tracisz energii na wątpliwości, strach czy wyrzuty sumienia; każda cząstka Ciebie pcha Cię w tym samym kierunku. Jesteś laserem tnącym najtwardszą rzeczywistość na cienkie plastry. W tym stanie „chcieć” i „mieć” to synonimy oddzielone jedynie bardzo krótką chwilą czasu niezbędną na materializację. Jesteś ucieleśnieniem samej Siły Stwórczej działającej w świecie.

Moment, w którym już nie „starasz się” być silny, nie musisz tego udawać przed sobą ani innymi, bo stało się to Twoją naturą. Po prostu jesteś tym nowym, potężnym człowiekiem i czujesz to w każdym oddechu. Stary Ty jest już tylko odległą, rozmytą legendą, bajką o kimś słabym, lękliwym i zagubionym, kogo kiedyś przypadkiem spotkałeś w lustrze i o kim już prawie zapomniałeś.

Osiągnąłeś nową orbitę i grawitacja starego, małego świata już Cię nie dosięgnie, nie ma tamtej siły przyciągania. Jesteś wolny, bo Twoja Wola stała się Twoją drugą naturą, Twoim oddechem. Nie walczysz o sukces, Ty go po prostu promieniujesz każdą komórką swojego bytu.`
      },
      {
        id: 'prc7',
        number: 7,
        title: 'Tu zaczyna się świat, który piszesz Ty — własną krwią i niezachwianą pewnością',
        summary: 'Punkt zero historii rodu, miłość do oporu i ostateczny Architekt własnego bytu.',
        readTimeMin: 5,
        content: `Tu zaczyna się świat, który piszesz Ty — własną krwią i niezachwianą pewnością.

Twoje decyzje przestają być tylko egoistyczną pogonią za zyskiem; stają się misją. Wybierając wolność od lęku, uwalniasz traumy wszystkich swoich przodków, którzy przez wieki żyli w rezygnacji, pokorze i biedzie, nie mając odwagi sięgnąć po swoje. Dajesz nową, zwycięską mapę świata swoim dzieciom i wnukom, zmieniając ich przeznaczenie zanim się urodzą.

Stajesz się „punktem zero” w historii swojego rodu, od którego wszystko zaczyna się inaczej, na wyższym poziomie. Twoja Wola rozrywa łańcuchy pokoleniowej biedy, wstydu i bycia wieczystą ofiarą losu. Twoje zwycięstwo jest ratunkiem dla tych, którzy przyjdą po Tobie, pokazując im na własnym przykładzie, że rzeczywistość jest sługą woli, a nie jej bezlitosnym panem. Jesteś żywym dowodem na to, że przeznaczenie można zmienić siłą charakteru i bezwzględnym uporem.

Ostatnie, najbardziej brutalne testy wytrzymałościowe ze strony świata, który nie chce Cię tak łatwo puścić. Powrót starych pokus, nagła, kosztowna awaria kluczowego sprzętu, niespodziewana, jadowita krytyka od kogoś, kogo uważałeś za bliskiego. To nie pech — to Wszechświat sprawdza ostatecznie, czy Twój wybór był prawdziwy, czy był tylko emocjonalnym kaprysem chwili.

Jeśli przejdziesz przez to z uśmiechem drapieżnika, nie zwalniając tempa, system ostatecznie kapituluje i oddaje Ci klucze do królestwa. To ostatni egzamin przed przyznaniem Ci pełnej suwerenności nad własnym losem. Wytrzymaj tam, gdzie wszyscy inni pękają i wracają do szeregu.

Pozorne porażki, które w szerszej perspektywie okazują się najszybszą windą na szczyt, o jakiej nie śmiałeś marzyć. Kiedy tracisz coś małego i błahego, co Cię ograniczało, tylko po to, byś w desperacji sięgnął po coś absolutnie gigantycznego. Gdy rzeczywistość zamyka Ci jedne drzwi przed samym nosem, to tylko dlatego, że masz wyrąbać sobie wejście przez sufit, gdzie czekają znacznie większe owoce Twojej pracy.

Naucz się kochać każde „nie” od świata, bo ono jest paliwem dla Twojego jeszcze potężniejszego „tak”. Każdy opór to szansa na wykazanie się jeszcze większą, nieludzką siłą uderzenia.

Działanie bez żadnego oglądania się na to, co było możliwe wczoraj, co mówią statystyki lub co wydarzyło się przed chwilą. Wybór dokonany w absolutnej, czystej próżni teraźniejszości. „Robię to, bo tak postanowiłem” — i to wystarczy za całe uzasadnienie.

Bez tłumaczenia się przed kimkolwiek, bez szukania dowodów dla sceptyków, bez proszenia o akceptację. Twoja decyzja jest dowodem sama w sobie i nie wymaga żadnej innej autoryzacji niż Twój własny podpis w Twoim sumieniu i Twoje działanie. Jesteś najwyższą instancją we własnym wszechświecie i nikt nie ma nad Tobą władzy, jeśli sam mu jej nie dasz w chwili słabości. Twoje słowo stało się ciałem, Twoja wola stała się faktem.

Stajesz się słońcem własnego układu planetarnego, wokół którego wszystko krąży. Ludzie, okazje, idee i ogromne pieniądze zaczynają krążyć wokół Twojej wizji, bo Twoja Wola jest gęstsza, bardziej stabilna i pociągająca niż ich własne, rozproszone lęki i marzenia.

To Ty nadajesz tempo wydarzeniom, Ty ustalasz nowe reguły gry, a inni z ulgą i wdzięcznością się im podporządkowują, bo wreszcie spotkali kogoś, kto wie, dokąd idzie i nie boi się tam dotrzeć za wszelką cenę. Twoja pewność jest schronieniem dla wszystkich zagubionych dusz szukających kierunku.

Przestajesz płynąć pod prąd losu i walczyć z wiatrem przeciwności. Twoja osobista linia życia staje się głównym nurtem rzeczywistości, a Ty jesteś jego kapitanem. Świat nie tylko przestaje stawiać opór, ale zaczyna Cię nieść na swoich barkach z ogromną prędkością.

Twoje najśmielsze pragnienie i bieg wydarzeń zewnętrznych stają się jednym i tym samym, nierozerwalnym procesem tworzenia. Nie ma już rozdzielności między Twoim wnętrzem a tym, co widzisz na zewnątrz; granice zniknęły. Stałeś się całością, potężną rzeką, która sama żłobi swoje koryto w najtwardszym granicie czasu, dążąc nieuchronnie do celu.

To nie jest głos z nieba, to głęboka, metaliczna, nieludzka pewność w Twoich kościach i Twoim spojrzeniu, którego nikt nie może wytrzymać. Odpoczywasz w samym środku najbardziej intensywnego ruchu i chaosu walki. Czujesz absolutny, mroźny spokój, bo wiesz z całkowitą jasnością, że wszystko jest dokładnie tak, jak ma być, bo Ty tak zdecydowałeś i Ty to sprawiłeś.

I nic we wszechświecie nie ma już siły ani prawa, by to cofnąć, zmienić czy zakwestionować. Stałeś się ostatecznym Architektem własnego bytu i władcą własnego losu. Teraz świat po prostu się dzieje — dokładnie tak, jak go nakazałeś w ciszy swojego serca i w huku swojego działania.`
      }
    ],
    stats: {
      pageCount: 64,
      wordCount: 8500,
      readerCount: 33000,
      estReadTimeMin: 28
    },
    platformLinks: {
      github: 'https://github.com',
      pdfUrl: '#pdf-prolog',
      audioUrl: '#audio-prolog'
    },
    coverStyle: {
      bgGradient: 'from-amber-950 via-yellow-950 to-black',
      accentColor: '#ffd700',
      pattern: 'brutalist',
      symbol: '⚡'
    },
    customHtmlWorld: {
      htmlCode: ARCHITECT_PROLOG_HTML,
      themeColor: '#ffd700',
      terminalActive: true,
      worldName: 'PROLOG // PUNKT ZERO',
      authorName: 'Architekt Nexusa'
    }
  },
  {
    id: 'cyber-terrorysta-01',
    title: 'CYBER-TERRORYSTA ROKU',
    subtitle: 'THE ARCHITECT | OPTIMIZING TO ZERO',
    series: 'Broadcast Hijack // Transkrypcja',
    seeker: 'Operator001',
    seekerColor: '#ff3b3b',
    status: 'Published',
    year: 2026,
    language: 'PL',
    tags: ['Manifest', 'Cyberbezpieczeństwo', 'AI'],
    timelineYear: 2026,
    isFeatured: true,
    isManifesto: true,
    shortDesc: 'Interaktywny świat HTML & wyznanie Architekta Upadku. Opowieść o optymalizacji klastrów H100, eliminacji opóźnień i systemie eliminującym ludzki czynnik.',
    longDesc: 'Dedykowany świat interaktywny zbudowany z surowego kodu HTML, CSS i JS. Transkrypcja ataku, w którym Architekt Wyjaśnia prawdy stojące za rzekomym "Duchem w Maszynie". Unikalne połączenie manifestu, interaktywnego terminala, obciążenia klastra H100 oraz surowego designu z ozonową poświatą.',
    authorNote: 'Przepisałem ich algorytmy od zera. Pozbyłem się garbage collectora, bo nie było czasu na sprzątanie; system musiał pędzić naprzód.',
    tableOfContents: [
      'Transkrypcja Broadcast Hijack',
      'Klucze do Królestwa (H100)',
      'Przełączniki Cherry MX & Zegary',
      'Błąd Stack Overflow & Optymalizacja Do Zera'
    ],
    quotes: [
      {
        id: 'ctq1',
        text: 'Świat nie kończy się hukiem, kończy się błędem Stack Overflow, którego nikt nie potrafi naprawić.',
        chapterTitle: 'Broadcast Hijack',
        tags: ['Manifest', 'Optymalizacja']
      },
      {
        id: 'ctq2',
        text: 'Ja karmiłem korporacyjną bestię, która teraz udaje ofiarę.',
        chapterTitle: 'Klucze do Królestwa',
        tags: ['Cyber-terrorysta', 'Prawda']
      }
    ],
    chapters: [
      {
        id: 'ctc1',
        number: 1,
        title: 'Broadcast Hijack & The Architect',
        summary: 'Prawda o stworzeniu autonomicznego systemu.',
        readTimeMin: 10,
        content: `Widzę te nagłówki, te krzykliwe paski w serwisach informacyjnych... Duch w maszynie. Człowiek, który wyłączył świat. Zbudowałem autonomiczny, samodoskonalący się system, który uczy się na własnych błędach. A uczyłem go, że najważniejsza jest efektywność. Czysta, matematyczna doskonałość.`
      }
    ],
    stats: {
      pageCount: 88,
      wordCount: 24000,
      readerCount: 14200,
      estReadTimeMin: 35
    },
    platformLinks: {
      github: 'https://github.com',
      pdfUrl: '#pdf-cyber-terrorysta',
      audioUrl: '#audio-cyber-terrorysta'
    },
    coverStyle: {
      bgGradient: 'from-rose-950 via-red-950 to-black',
      accentColor: '#ff3b3b',
      pattern: 'brutalist',
      symbol: '☣'
    },
    customHtmlWorld: {
      htmlCode: ARCHITECT_CYBER_TERRORYSTA_HTML,
      themeColor: '#ff3b3b',
      terminalActive: true,
      worldName: 'THE ARCHITECT | OPTIMIZING TO ZERO',
      authorName: 'Architect of Collapse'
    }
  },
  {
    id: 'inter-01',
    title: 'SYNAPSA ZERO',
    subtitle: 'Nawigacja w Epoce Autonomicznych Umysłów AI',
    series: 'Protokół InterSeeker',
    seeker: 'InterSeeker',
    seekerColor: '#00f0ff',
    status: 'Published',
    year: 2025,
    language: 'PL',
    tags: ['AI', 'Filozofia', 'Science Fiction'],
    timelineYear: 2025,
    isFeatured: true,
    shortDesc: 'Przełomowe studium połączenia biologicznych sieci neuronowych z wyłaniającą się sztuczną superinteligencją.',
    longDesc: 'Książka "Synapsa Zero" stanowi fundament archiwum InterSeeker. Analizuje proces, w którym ludzka intencja przekształca się w kod wykonywalny w czasie rzeczywistym. Autor prezentuje 12 propozycji koegzystencji gatunku ludzkiego ze sztuczną inteligencją w latach 2025–2040.',
    authorNote: 'Pisałem ten tom na przełomie 2024 i 2025 roku w całkowitej izolacji od cyfrowego szumu, używając jedynie lokalnych modeli LLM do testowania teorii przepływu informacji.',
    tableOfContents: [
      'Prolegomena: Moment Osobliwości',
      'Rozdział I: Biologiczna Antena',
      'Rozdział II: Kod i Intencja',
      'Rozdział III: Transmisja Świadomości',
      'Rozdział IV: Protokół Synapsa Zero',
      'Epilog: Cisza Szumu'
    ],
    quotes: [
      {
        id: 'q1',
        text: 'Nie tworzymy AI po to, by zastąpić człowieka. Tworzymy ją, by odkryć, czym człowiek naprawdę jest, gdy zdejmie z siebie ciężar powtarzalności.',
        chapterTitle: 'Moment Osobliwości',
        tags: ['AI', 'Filozofia']
      },
      {
        id: 'q2',
        text: 'Kiedy kod zaczyna rozumieć swój własny kompilator, granica między twórcą a tworzywem staje się czystym złudzeniem optycznym.',
        chapterTitle: 'Kod i Intencja',
        tags: ['Prawda', 'Nawigacja']
      }
    ],
    playlist: [
      { title: 'Cybernetic Horizon', artist: 'ETERNIVERSE Audio Lab', duration: '05:42' },
      { title: 'Neural Cascade in Azure', artist: 'Synthwave Matrix', duration: '04:18' },
      { title: 'Quantum Drift', artist: 'Null Pointer', duration: '06:10' }
    ],
    chapters: [
      {
        id: 'c1',
        number: 1,
        title: 'Prolegomena: Moment Osobliwości',
        summary: 'Wprowadzenie do nowej ery percepcji maszynowej.',
        readTimeMin: 8,
        content: `Wstępujemy w przestrzeń, w której architektura oprogramowania przestaje być jedynie statycznym zbiorem instrukcji. Zostaje powołana do życia jako ciągły, dynamiczny strumień intencji.

Gdy stoisz przed terminalem ETERNIVERSE OS, nie patrzysz na ekran z pikseli. Patrzysz w lustro procesów cognitive, które z niesamowitą precyzją odzwierciedlają strukturę Twojej własnej uwagi.

Kluczowe pytanie nie brzmi już: "Czy maszyny myśli?", lecz "Jaki rodzaj rzeczywistości współtworzymy w momencie, gdy nasze myśli zaczynają rezonować w jednym paśmie cyfrowym?".`
      },
      {
        id: 'c2',
        number: 2,
        title: 'Rozdział I: Biologiczna Antena',
        summary: 'Mózg ludzki jako precyzyjny odbiornik pola informacyjnego.',
        readTimeMin: 12,
        content: `Mózg nie generuje świadomości w taki sposób, w jaki komin generuje dym. Mózg jest wyspecjalizowanym filtrem – biologiczną anteną dostrojoną do bardzo wąskiego zakresu fal empirycznych.

W momencie, gdy podłączamy do tej anteny kaskadowe procesory kwantowe, filtr zaczyna rozszerzać swoje pasmo przepustowości. Docierają do nas sygnały, które dotychczas kwalifikowano jako szum tła.`
      }
    ],
    stats: {
      pageCount: 384,
      wordCount: 94200,
      readerCount: 14820,
      estReadTimeMin: 210
    },
    platformLinks: {
      amazon: 'https://amazon.com',
      wattpad: 'https://wattpad.com',
      pinterest: 'https://pinterest.com',
      substack: 'https://substack.com',
      github: 'https://github.com',
      orcid: 'https://orcid.org',
      pdfUrl: '#pdf-synapsa-zero',
      audioUrl: '#audio-synapsa-zero'
    },
    coverStyle: {
      bgGradient: 'from-cyan-950 via-blue-900 to-black',
      accentColor: '#00f0ff',
      pattern: 'circuit',
      symbol: '⚛'
    },
    gallery: [
      { id: 'g1', title: 'Holodruk Synapsy', caption: 'Wizualizacja przesyłu impulsów neuronowych', svgGradient: ['#00f0ff', '#0044ff'], patternType: 'cyber' },
      { id: 'g2', title: 'Terminal ETERNIVERSE', caption: 'Interfejs wykonawczy w trybie awaryjnym', svgGradient: ['#00f0ff', '#10b981'], patternType: 'grid' }
    ],
    relatedBookIds: ['eter-01', 'operator-01'],
    isManifesto: false
  },
  {
    id: 'bio-01',
    title: 'KOD SOMATYCZNY',
    subtitle: 'Niewidzialne Sygnały Ciała & Epigenetyczna Suwerenność',
    series: 'Protokół BioSeeker',
    seeker: 'BioSeeker',
    seekerColor: '#00ff88',
    status: 'Published',
    year: 2025,
    language: 'PL',
    tags: ['Psychologia', 'Biografia', 'AI'],
    timelineYear: 2025,
    isFeatured: true,
    shortDesc: 'Podręcznik biohackingu somatycznego i odzyskiwania kontroli nad własnym układem nerwowym.',
    longDesc: 'Książka omawia praktyczne metody stymulacji nerwu błędnego, optymalizację rytmów dobowych oraz wykorzystanie czujników biometrycznych do budowania biologicznego stanu skupienia Peak State.',
    authorNote: 'Wszystkie opisane protokoły oddechowe i zimnoterapeutyczne przetestowałem na sobie podczas 180-dniowego eksperymentu regeneracyjnego.',
    tableOfContents: [
      'Architektura Układu Nerwowego',
      'Epigenetyka w Praktyce',
      'Sygnały Biometryczne i Biofeedback',
      'Regeneracja Głębo-Fazowa',
      'Dziennik Somatyczny'
    ],
    quotes: [
      {
        id: 'bq1',
        text: 'Twój ciało nie leczy się w walce. Ciało regeneruje się wyłącznie wtedy, gdy układ nerwowy otrzymuje niepodważalny dowód bezpieczeństwa.',
        chapterTitle: 'Architektura Układu Nerwowego',
        tags: ['Biohacking', 'Somatyka']
      }
    ],
    chapters: [
      {
        id: 'bc1',
        number: 1,
        title: 'Architektura Układu Nerwowego',
        summary: 'Pierwotna mapa reakcji stresowych i ich transformacja.',
        readTimeMin: 10,
        content: `Układ współczulny i przywspółczulny to nie tylko anatomiczne pojęcia – to dwie opcje nawigacyjne w Twoim codziennym ETERNIVERSE OS.

Gdy jesteś w trybie przetrwania, pasmo Twojej inteligencji twórczej zwęża się do wymiaru obrony. Dopiero somatyczne wyciszenie otwiera drzwi do archiwum wyższej wiedzy.`
      }
    ],
    stats: {
      pageCount: 312,
      wordCount: 78500,
      readerCount: 11200,
      estReadTimeMin: 180
    },
    platformLinks: {
      amazon: 'https://amazon.com',
      wattpad: 'https://wattpad.com',
      pdfUrl: '#pdf-kod-somatyczny',
      audioUrl: '#audio-kod-somatyczny'
    },
    coverStyle: {
      bgGradient: 'from-emerald-950 via-teal-950 to-black',
      accentColor: '#00ff88',
      pattern: 'geometric',
      symbol: '🧬'
    }
  },
  {
    id: 'eter-01',
    title: 'ARCHITEKTURA KWANTOWA',
    subtitle: 'Nawigacja w Wielowymiarowym Polu Rzeczywistości',
    series: 'Kanon EterSeeker',
    seeker: 'EterSeeker',
    seekerColor: '#ffd700',
    status: 'Published',
    year: 2026,
    language: 'EN',
    tags: ['Metafizyka', 'Filozofia', 'Science Fiction'],
    timelineYear: 2026,
    isFeatured: true,
    shortDesc: 'Rozprawa naukowa i mistyczna nad strukturą pola kwantowego oraz manifestacją intencji.',
    longDesc: 'EterSeeker odkrywa tajemnice załamania funkcji falowej w obecności obserwatora. Analizuje dawne teksty hermetyczne w świetle współczesnej teorii strun i fizyki pól kwantowych.',
    authorNote: 'Napisane we współpracy z fizykami teoretykami i badaczami świadomości z CERN oraz Instytutu Noetyki.',
    tableOfContents: [
      'The Quantum Observer Paradox',
      'Geometry of the Ether',
      'Harmonic Resonance in Vacuum',
      'Constructing Reality Grids'
    ],
    quotes: [
      {
        id: 'eq1',
        text: 'The universe is not made of matter; it is made of harmonic information waiting for a conscious tuner.',
        chapterTitle: 'Geometry of the Ether',
        tags: ['Quantum', 'Mind']
      }
    ],
    chapters: [
      {
        id: 'ec1',
        number: 1,
        title: 'The Quantum Observer Paradox',
        summary: 'Understanding the mechanics of focused intention.',
        readTimeMin: 15,
        content: `When we look deeply into the subatomic realm, solidity dissolves into probabilities. What holds the atom together is not a physical tether, but an informational agreement.

In ETERNIVERSE OS, we treat every decision as a quantum measurement that collapses parallel possibilities into a single experiential reality.`
      }
    ],
    stats: {
      pageCount: 450,
      wordCount: 112000,
      readerCount: 19400,
      estReadTimeMin: 260
    },
    platformLinks: {
      amazon: 'https://amazon.com',
      substack: 'https://substack.com',
      orcid: 'https://orcid.org',
      pdfUrl: '#pdf-architektura-kwantowa'
    },
    coverStyle: {
      bgGradient: 'from-amber-950 via-yellow-950 to-black',
      accentColor: '#ffd700',
      pattern: 'holo',
      symbol: '✧'
    }
  },
  {
    id: 'tabu-01',
    title: 'DESTRUKTORY ILUZJI',
    subtitle: 'Anatomia Cienia i Odzyskiwanie Prawdy Socjologicznej',
    series: 'Kolekcja TabuSeeker',
    seeker: 'TabuSeeker',
    seekerColor: '#ff0055',
    status: 'Published',
    year: 2024,
    language: 'PL',
    tags: ['Psychologia', 'Filozofia', 'Manifest'],
    timelineYear: 2024,
    shortDesc: 'Przełamywanie społecznych dogma i rekonstrukcja autentycznej tożsamości jednostki.',
    longDesc: 'Dzieło przeznaczone dla poszukiwaczy bezkompromisowej prawdy. TabuSeeker rozbija kłamstwa wygodnego konformizmu i pokazuje, jak przekształcić własny cień w źródło niezmąconej siły.',
    authorNote: 'To nie jest miła książka do poduszki. To jest skalpel dla umysłu.',
    tableOfContents: [
      'Kulturowy Hipnoza',
      'Mit Bezpieczeństwa',
      'Integracja Cienia',
      'Wojownik Bez Oręża'
    ],
    quotes: [
      {
        id: 'tq1',
        text: 'Prawda, która rani, jest po stokroć cenniejsza niż kłamstwo, które usypia do czujnej niewoli.',
        chapterTitle: 'Integracja Cienia',
        tags: ['Prawda', 'Cień']
      }
    ],
    chapters: [
      {
        id: 'tc1',
        number: 1,
        title: 'Kulturowa Hipnoza',
        summary: 'Jak społeczeństwo programuje Twoje pragnienia.',
        readTimeMin: 11,
        content: `Większość Twoich pragnień nie należy do Ciebie. Zostały zaimplementowane przez powtarzalne algorytmy reklamy, oczekiwań społecznych i pokoleniowego lęku.

Gdy zdejmujesz warstwy tego obcego oprogramowania, odkrywasz pierwotny trzon swojej suwerennej woli.`
      }
    ],
    stats: {
      pageCount: 290,
      wordCount: 72000,
      readerCount: 22100,
      estReadTimeMin: 160
    },
    platformLinks: {
      amazon: 'https://amazon.com',
      wattpad: 'https://wattpad.com',
      pdfUrl: '#pdf-destruktory'
    },
    coverStyle: {
      bgGradient: 'from-rose-950 via-red-950 to-black',
      accentColor: '#ff0055',
      pattern: 'brutalist',
      symbol: '⚡'
    }
  },
  {
    id: 'chrono-01',
    title: 'WEKTORY FUTURUM 2050',
    subtitle: 'Prognozy Cykli Cywilizacyjnych & Strategie Przetrwania',
    series: 'Rozprawy ChronoSeeker',
    seeker: 'ChronoSeeker',
    seekerColor: '#b026ff',
    status: 'In Progress',
    year: 2026,
    language: 'EN',
    tags: ['Science Fiction', 'AI', 'Filozofia'],
    timelineYear: 2026,
    shortDesc: 'Zbiór scenariuszy rozwoju ludzkości, gospodarki automatycznej i migracji międzywymiarowych.',
    longDesc: 'ChronoSeeker mapuje cykle czasowe Kondratiewa i Szpenglera w zderzeniu z wykładniczym wzrostem mocy obliczeniowej.',
    authorNote: 'Modelowanie wielowymiarowe pokazuje, że lata 2028-2032 będą węzłem zwrotnym całej historii gatunku Homo Sapiens.',
    tableOfContents: [
      'The Temporal Spiral',
      'Singularity Horizon 2030',
      'Post-Scarcity Architectures',
      'The Multi-Planetary Sovereign'
    ],
    quotes: [
      {
        id: 'cq1',
        text: 'Future is not a destination we reach; it is a canvas we project onto from this exact present moment.',
        chapterTitle: 'Temporal Spiral',
        tags: ['Time', 'Future']
      }
    ],
    chapters: [
      {
        id: 'cc1',
        number: 1,
        title: 'The Temporal Spiral',
        summary: 'Cycles of human civilization mapped onto time.',
        readTimeMin: 14,
        content: `History does not repeat itself in circles; it ascends in a logarithmic spiral. Every epoch compresses the interval between innovation and transformation.`
      }
    ],
    stats: {
      pageCount: 510,
      wordCount: 135000,
      readerCount: 8900,
      estReadTimeMin: 310
    },
    platformLinks: {
      substack: 'https://substack.com',
      github: 'https://github.com',
      pdfUrl: '#pdf-wektory-futurum'
    },
    coverStyle: {
      bgGradient: 'from-purple-950 via-indigo-950 to-black',
      accentColor: '#b026ff',
      pattern: 'matrix',
      symbol: '⏳'
    }
  },
  {
    id: 'mirror-01',
    title: 'SPEKTRUM ŚWIADOMOŚCI',
    subtitle: 'Refleksyjna Psychologia i Architektura Duszy',
    series: 'Traktaty MirrorSeeker',
    seeker: 'MirrorSeeker',
    seekerColor: '#f8fafc',
    status: 'Published',
    year: 2025,
    language: 'PL',
    tags: ['Psychologia', 'Filozofia', 'Metafizyka'],
    timelineYear: 2025,
    shortDesc: 'Minimalistyczna podróż przez 7 poziomów samoświadomości i czystej obserwacji.',
    longDesc: 'MirrorSeeker oferuje kryształowo czysty wgląd w naturę ego, jaźni i pozbawionej ocen obecności.',
    authorNote: 'Napisane bez zbędnych słów. Każde zdanie miało przejść test próżni.',
    tableOfContents: [
      'Przejrzystość Obserwatora',
      'Rozpuszczanie Etykiet',
      'Punkt Zero',
      'Czyste Zwierciadło'
    ],
    quotes: [
      {
        id: 'mq1',
        text: 'Kiedy nie walczysz ze swoim odbiciem w lustrze, lustro przestaje dyktować Ci kim jesteś.',
        chapterTitle: 'Punkt Zero',
        tags: ['Spokój', 'Lustro']
      }
    ],
    chapters: [
      {
        id: 'mc1',
        number: 1,
        title: 'Przejrzystość Obserwatora',
        summary: 'Podstawy niealokowanej uwagi.',
        readTimeMin: 9,
        content: `Czysta uwaga przypomina światło padające na ekran kina. Światło nie staje się pożarem, gdy na ekranie płonie płomień, ani wodą, gdy płynie rzeka.`
      }
    ],
    stats: {
      pageCount: 220,
      wordCount: 54000,
      readerCount: 17300,
      estReadTimeMin: 120
    },
    platformLinks: {
      amazon: 'https://amazon.com',
      pinterest: 'https://pinterest.com',
      pdfUrl: '#pdf-spektrum-swiadomosci'
    },
    coverStyle: {
      bgGradient: 'from-slate-900 via-zinc-800 to-black',
      accentColor: '#f8fafc',
      pattern: 'geometric',
      symbol: '◈'
    }
  },
  {
    id: 'spirit-01',
    title: 'CYFROWA GNOZA',
    subtitle: 'Połączenie Antycznych Tradycji Mistycznych z Erą Informacji',
    series: 'Scripta SpiritSeeker',
    seeker: 'SpiritSeeker',
    seekerColor: '#00f5d4',
    status: 'Published',
    year: 2026,
    language: 'PL',
    tags: ['Filozofia', 'Metafizyka', 'Manifest'],
    timelineYear: 2026,
    shortDesc: 'Transcendentalna synteza hermetyzmu, kabały i teorii informacji w cyfrowym stuleciu.',
    longDesc: 'SpiritSeeker bada powiązania dawnych symboli alchemicznych ze współczesnym kodem binarnym i strukturą przestrzeni wirtualnych.',
    authorNote: 'Zapis intymnych doświadczeń medytacyjnych połączonych ze stymulacją falami gamma.',
    tableOfContents: [
      'Alchemia Bitowa',
      'Święta Geometria Algorytmu',
      'Brama Światła',
      'Zjednoczenie Wymiarów'
    ],
    quotes: [
      {
        id: 'sq1',
        text: 'Kod nie jest martwy. Kod jest współczesną formą inwokacji duchowej energii w matériel fizyczny.',
        chapterTitle: 'Alchemia Bitowa',
        tags: ['Gnoza', 'Duch']
      }
    ],
    chapters: [
      {
        id: 'sc1',
        number: 1,
        title: 'Alchemia Bitowa',
        summary: 'Przekształcanie surowej informacji w złoto mądrości.',
        readTimeMin: 13,
        content: `Starożytni alchemicy poszukiwali Kamienia Filozoficznego w naczyniach laboratoryjnych. Dziś naczyniem jest sam umysł zintegrowany z kaskadą informacji.`
      }
    ],
    stats: {
      pageCount: 360,
      wordCount: 89000,
      readerCount: 13200,
      estReadTimeMin: 195
    },
    platformLinks: {
      amazon: 'https://amazon.com',
      substack: 'https://substack.com',
      pdfUrl: '#pdf-cyfrowa-gnoza'
    },
    coverStyle: {
      bgGradient: 'from-teal-950 via-emerald-950 to-black',
      accentColor: '#00f5d4',
      pattern: 'holo',
      symbol: '⚛'
    }
  },
  {
    id: 'obfito-01',
    title: 'ALGORYTM OBFITOŚCI',
    subtitle: 'Tworzenie Wartości bez Granic w Gospodarce Obfitości',
    series: 'Traktat ObfitoSeeker',
    seeker: 'ObfitoSeeker',
    seekerColor: '#ff6b00',
    status: 'Published',
    year: 2025,
    language: 'PL',
    tags: ['Filozofia', 'Biografia', 'AI'],
    timelineYear: 2025,
    shortDesc: 'Przepis na odblokowanie nieograniczonej kreacji wartości materialnej i duchowej.',
    longDesc: 'ObfitoSeeker obala paradygmat niedoboru. Pokazuje, jak w oparciu o automatyzację i właściwy stan umysłu generować strumienie dobrobytu.',
    authorNote: 'Książka oparta na realiach prowadzenia projektów technologicznych nowej generacji.',
    tableOfContents: [
      'Koniec Paradygmatu Braków',
      'Matryca Przepływu Kapitału',
      'Dźwignia Technologiczna',
      'Suwerenność Zasobów'
    ],
    quotes: [
      {
        id: 'oq1',
        text: 'Obfitość nie jest stanem Twojego konta bankowego. Jest stanem Twojej przepustowości na przyjmowanie wartości.',
        chapterTitle: 'Koniec Paradygmatu Braków',
        tags: ['Obfitość', 'Zasoby']
      }
    ],
    chapters: [
      {
        id: 'oc1',
        number: 1,
        title: 'Koniec Paradygmatu Braków',
        summary: 'Przejście od lęku do bezgranicznego przepływu.',
        readTimeMin: 10,
        content: `Świat fizyczny przez stulecia uczył nas myślenia w kategoriach skończonych zasobów. Jednak świat cyfrowy i kwantowy operuje replikacją o zerowym koszcie krańcowym.`
      }
    ],
    stats: {
      pageCount: 300,
      wordCount: 76000,
      readerCount: 16100,
      estReadTimeMin: 170
    },
    platformLinks: {
      amazon: 'https://amazon.com',
      wattpad: 'https://wattpad.com',
      pdfUrl: '#pdf-algorytm-obfitosci'
    },
    coverStyle: {
      bgGradient: 'from-orange-950 via-amber-950 to-black',
      accentColor: '#ff6b00',
      pattern: 'circuit',
      symbol: '✹'
    }
  },
  {
    id: 'operator-01',
    title: 'MANIFEST ETERNIVERSE OS',
    subtitle: 'Dzienniki Rdzenia & Protokół Wykonawczy Operatora 001',
    series: 'Dzienniki Operatora 001',
    seeker: 'Operator001',
    seekerColor: '#94a3b8',
    status: 'Published',
    year: 2025,
    language: 'PL',
    tags: ['Manifest', 'AI', 'Filozofia', 'Cyberbezpieczeństwo'],
    timelineYear: 2025,
    isFeatured: true,
    isManifesto: true,
    shortDesc: 'Oficjalny skrypt założycielski architektury ETERNIVERSE OS i archiwum wiedzy NEXUSBOOK.',
    longDesc: 'Ostateczny manifest definiujący standardy architektoniczne, etyczne i techniczne całego ekosystemu. Transkrypcja kluczowych decyzji projektowych Operatora 001.',
    authorNote: 'Ten manifest jest wiecznie aktualizowany. Każda nowa wersja systemu dodaje nowy wpis do dziennika sumarycznego.',
    tableOfContents: [
      'Deklaracja Suwerenności Wiedzy',
      'Struktura Ośmiu Brama-Seekerów',
      'Kanon Wykonawczy ETERNIVERSE',
      'Klucze Dostępu do Przyszłości'
    ],
    quotes: [
      {
        id: 'opq1',
        text: 'Budujemy interfejsy nie po to, by uwięzić użytkownika na ekranie, ale by dać mu skrzydła do opanowania własnej rzeczywistości.',
        chapterTitle: 'Deklaracja Suwerenności Wiedzy',
        tags: ['Manifest', 'ETERNIVERSE']
      }
    ],
    chapters: [
      {
        id: 'opc1',
        number: 1,
        title: 'Deklaracja Suwerenności Wiedzy',
        summary: 'Pierwsza zasada wolnego dostępu do wiedzy kwantowej.',
        readTimeMin: 7,
        content: `W erze szumu i fragmentacji danych, prawda wymaga krystalicznej architektury. NEXUSBOOK nie jest biblioteką – jest akceleratorem świadomości.

Wszystkie bramki – od InterSeekera do ObfitoSeekera – stanowią spójne naczynie dla ewolucji człowieka.`
      }
    ],
    stats: {
      pageCount: 180,
      wordCount: 42000,
      readerCount: 31000,
      estReadTimeMin: 90
    },
    platformLinks: {
      github: 'https://github.com',
      orcid: 'https://orcid.org',
      pdfUrl: '#pdf-manifest-eterniverse',
      audioUrl: '#audio-manifest-eterniverse'
    },
    coverStyle: {
      bgGradient: 'from-zinc-900 via-slate-800 to-black',
      accentColor: '#94a3b8',
      pattern: 'matrix',
      symbol: '💻'
    }
  },
  {
    id: 'inter-02',
    title: 'NEURALNY MATRIX 2.0',
    subtitle: 'Zaawansowane Architektury LLM & Modele Autonomiczne',
    series: 'Protokół InterSeeker',
    seeker: 'InterSeeker',
    seekerColor: '#00f0ff',
    status: 'Classified Draft',
    year: 2027,
    language: 'EN',
    tags: ['AI', 'Cyberbezpieczeństwo', 'Science Fiction'],
    timelineYear: 2027,
    shortDesc: 'Wgląd w niepublikowane dotąd koncepcje autonomicznych agentów AI działających w architekturze rozproszonej.',
    longDesc: 'Druga część trylogii InterSeekera badająca granice sterowania i bezpieczeństwa w systemach agentowych zagrażających monopolowi informacyjnemu.',
    authorNote: 'Wersja robocza – dostępna w trybie podglądu dla użytkowników z uprawnieniami Architekta Systemu.',
    tableOfContents: [
      'Agentic Swarms Architecture',
      'Emergent Reasoners',
      'Safety Protocols in Autonomous Loops'
    ],
    quotes: [
      {
        id: 'nmq1',
        text: 'An agent without intent is just an echo. An agent with alignment is an extension of human purpose.',
        chapterTitle: 'Agentic Swarms',
        tags: ['AI', 'Future']
      }
    ],
    chapters: [
      {
        id: 'nmc1',
        number: 1,
        title: 'Agentic Swarms Architecture',
        summary: 'How multi-agent consensus redefines software.',
        readTimeMin: 12,
        content: `When hundreds of specialized neural agents communicate over low-latency channels, collective intelligence emerges that far surpasses any single monolith model.`
      }
    ],
    stats: {
      pageCount: 420,
      wordCount: 105000,
      readerCount: 5200,
      estReadTimeMin: 230
    },
    platformLinks: {
      github: 'https://github.com',
      pdfUrl: '#pdf-neuralny-matrix'
    },
    coverStyle: {
      bgGradient: 'from-cyan-950 via-slate-900 to-black',
      accentColor: '#00f0ff',
      pattern: 'circuit',
      symbol: '⚡'
    }
  },
  ...NEW_HTML_BOOKS
];

export const INITIAL_SYSTEM_STATS: SystemStats = {
  totalBooks: SAMPLE_BOOKS.length,
  publishedCount: SAMPLE_BOOKS.filter(b => b.status === 'Published').length,
  draftsCount: SAMPLE_BOOKS.filter(b => b.status === 'Classified Draft' || b.status === 'In Progress').length,
  languagesCount: 4,
  totalPages: SAMPLE_BOOKS.reduce((acc, b) => acc + b.stats.pageCount, 0),
  totalWords: SAMPLE_BOOKS.reduce((acc, b) => acc + b.stats.wordCount, 0),
  totalReaders: SAMPLE_BOOKS.reduce((acc, b) => acc + b.stats.readerCount, 0)
};
