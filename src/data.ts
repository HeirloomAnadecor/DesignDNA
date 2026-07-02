import { ElementInfo, Project } from "./types";

export const PYTH: Record<string, number> = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
  J:1, K:2, L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
  S:1, T:2, U:3, V:4, W:5, X:6, Y:7, Z:8,
  Ă:1, Â:1, Î:9, Ș:1, Ț:2, Ş:1, Ţ:2
};

export const VOWELS = new Set(['A','E','I','O','U','Ă','Â','Î']);
export const MASTER = new Set([11, 22, 33]);

export const EL: Record<string, ElementInfo> = {
  apa:    { label: 'Apă',    icon: '💧', color: '#5B9BD5', dark: '#060D18', nums: '1 · 11' },
  lemn:   { label: 'Lemn',   icon: '🌿', color: '#6B9E5E', dark: '#060F04', nums: '3 · 4 · 33' },
  foc:    { label: 'Foc',    icon: '🔥', color: '#D4542A', dark: '#180600', nums: '9' },
  pamant: { label: 'Pământ', icon: '⛰️', color: '#C4A26A', dark: '#140E00', nums: '2 · 5 · 8 · 22' },
  cristal:{ label: 'Cristal',icon: '💎', color: '#8EB8D0', dark: '#040C12', nums: '6 · 7' },
};

export const CYCLE = ['apa', 'lemn', 'foc', 'pamant', 'cristal'];
export const CYCLE_VERB: Record<string, string> = {
  apa: 'hrănește',
  lemn: 'alimentează',
  foc: 'naște',
  pamant: 'cristalizează',
  cristal: 'colectează'
};

export const CYCLE_DESIGN: Record<string, string> = {
  apa: 'Fluiditatea deschide spațiul organic',
  lemn: 'Vitalitatea aprinde căldura',
  foc: 'Energia se ancorează în soliditate',
  pamant: 'Stabilitatea se rafinează în precizie',
  cristal: 'Puritatea se topește în fluiditate'
};

export const NUM_ESSENCE: Record<number, {
  kw: string;
  pers: string;
  strengths: string[];
  shadow: string[];
  lifeTheme: string;
  symbolism: string;
  relationships: string;
  career: string;
  design: string;
  colors: string[];
  forms: string[];
  materials: string[];
}> = {
  1:{
    kw:'Pionier · Lider · Creator · Independent · Originar',
    pers:'Numărul 1 este forța primordială a existenței — energia care deschide, inițiază și trasează direcții acolo unde nu există încă drum. Persoana cu 1 în hartă este un spirit profund independent, cu o voință interioară de neînfrânt. Nu urmează — creează. Nu imită — inventează. Are o calitate solară rară: capacitatea de a lumina o cameră, o situație, o viață înaintea oricui altcuiva. Există un foc interior care nu se stinge, o dorință de a fi primul, de a stabili standardele, de a lăsa o amprentă vizibilă în lume.',
    strengths:['Leadership natural și carismatic','Originalitate și gândire pionieră','Curaj în fața necunoscutului','Independență și autosuficiență','Energie inițiatoare și vizionară','Determinare și voință excepționale','Creativitate aplicată și practică'],
    shadow:['Tendință spre dominanță și autoritarism','Dificultate în colaborare și delegare','Izolare prin exces de independență','Rigiditate și dificultate de a accepta ajutor','Aroganță sau sentiment de superioritate','Impatiență cu ritmul celorlalți'],
    lifeTheme:'Autocunoaștere profundă și exprimare autentică a sinelui unic. Lecția centrală: a fi lider fără a domina, a fi independent fără a fi izolat.',
    symbolism:'Soarele, Magicianul (Tarot), energia Yang pură, cifra unității absolute, alpha — începutul tuturor lucrurilor. În geometria sacră, punctul din care radiază totul.',
    relationships:'Relațiile cu 1 sunt intense și stimulante. Caută un partener egal, nu un urmaș. Admirația îl activează, dependența îl sufocă. Iubește profund dar are nevoie de spațiu pentru a rămâne el însuși.',
    career:'Antreprenoriat, leadership executiv, pionierat în domenii noi, invenție, arhitectură, sport de performanță — orice domeniu unde poate fi primul sau singurul.',
    design:'Linii pure și decisive. Spații cu un centru de putere clar. Alb imaculat sau negru absolut. Accente bold, unice. Piesa de rezistență care domină întregul spațiu — niciodată dezordine, întotdeauna intenție.',
    colors:['Alb pur','Negru absolut','Roșu putere','Auriu','Argintiu','Albastru electric'],
    forms:['Linii drepte decisive','Geometrie pură','Verticalitate','Forme solitare puternice','Puncte focale clare'],
    materials:['Metal lustruit','Beton aparent','Sticlă clară','Piatră neagră','Lemn alb'],
  },
  2:{
    kw:'Diplomat · Sensibil · Armonios · Intuitiv · Cooperant · Receptiv',
    pers:'Numărul 2 este forța care leagă, vindecă și armonizează — energia Lunii care reflectă, nu iradiază direct. Persoana cu 2 în hartă simte energiile celor din jur cu o profunzime pe care alții rar o ating. Este maestrul echilibrului — vede ambele fețe ale oricărei situații cu o claritate aproape supranaturală. Are un dar înnăscut pentru diplomație: știe exact ce cuvânt vindecă și ce cuvânt rănește. Relațiile sunt hrana sa sufletească — fără conexiune autentică, 2 se ofilește ca o floare fără apă.',
    strengths:['Empatie profundă și abilitate de vindecare emoțională','Diplomație naturală și medierea conflictelor','Intuiție fină aproape de percepție extrasenzorială','Răbdare și abilitate de a asculta cu adevărat','Cooperare și spirit de echipă excepțional','Sensibilitate estetică rafinată','Loialitate și devotament profund'],
    shadow:['Dependență emoțională și nevoie excesivă de aprobare','Indecisivitate prin vederea prea multor fețe','Evitarea conflictului în detrimentul adevărului','Autoanulare și sacrificiu excesiv','Manipulare subtilă prin victimizare','Hipersensibilitate la critică'],
    lifeTheme:'Parteneriat și găsirea echilibrului perfect între sine și celălalt. Lecția centrală: a fi pentru alții fără a se pierde pe sine.',
    symbolism:'Luna, Preoteasa Înaltă (Tarot), dualitatea Yin-Yang, oglinda, ecoul — principiul receptivității și al reflexiei. Doi stâlpi care susțin un portal.',
    relationships:'Relațiile sunt esența vieții pentru 2. Iubește profund, devotat, uneori excesiv. Are nevoie de un partener care să îi recunoască sensibilitatea ca forță, nu ca slăbiciune. Fuge de conflict dar are nevoie de adevăr pentru a crește.',
    career:'Consiliere, terapie, diplomație, design interior, muzică, îngrijire, mediator, asistent executiv de elită — orice rol unde empatia și cooperarea sunt valori centrale.',
    design:'Simetrie delicată și curbe blânde care îmbrățișează. Palete duale — niciodată un singur ton, întotdeauna un dialog cromatic. Materiale moi la atingere, textile care cheamă mângâiatul. Spații care respiră perechi.',
    colors:['Roz palid','Ivory','Blush','Argintiu lună','Lavandă','Gri perlat','Alb cald'],
    forms:['Curbe blânde','Simetrie delicată','Forme perechi','Arcuri ușoare','Volumuri rotunjite'],
    materials:['Mătase','Catifea moale','Plușuri fine','Marmură roz','Sticlă mată','Stofă texturată'],
  },
  3:{
    kw:'Creativ · Expresiv · Jovial · Comunicator · Artistic · Exuberant',
    pers:'Numărul 3 este explozie de culoare, râs, idei și conexiuni neașteptate. Este energia Venusului și a Jovialității unite — forța care transformă orice moment în artă și orice conversație în spectacol. Persoana cu 3 în hartă are un dar rar: poate vedea frumusețea acolo unde alții văd banalitate și poate crea legături acolo unde alții văd separare. Energia sa este contagioasă, optimismul său este o resursă pentru toți cei din jur. Există o lumină particulară în ochii celor cu 3 — o bucurie de a trăi care nu se stinge ușor.',
    strengths:['Creativitate abundentă și multidisciplinară','Comunicare carismatică și inspirațională','Optimism robust și reziliență emoțională','Umor inteligent și capacitate de a aduce bucurie','Abilitate artistică nativă în multiple forme','Spirit social și conectarea rapidă a oamenilor','Imaginație bogată și gândire laterală'],
    shadow:['Împrăștiere energetică și dificultate de focalizare','Superficialitate în relații și proiecte','Tendință de exagerare și dramatizare','Evitarea responsabilităților prin umor','Cheltuire impulsivă a energiei și resurselor','Nevoie excesivă de atenție și validare'],
    lifeTheme:'Exprimarea autentică a sinelui creativ și bucuria de a aduce frumusețe și conexiune în lume. Lecția centrală: adâncimea alături de strălucire.',
    symbolism:'Jupiter, Împărăteasa (Tarot), Trinitatea, triunghiul creației, Muzele — principiul creativității divine care se manifestă în formă.',
    relationships:'Iubește intens dar uneori superficial. Are nevoie de un partener care să îi ofere libertate expresivă și care să poată ține ritmul cu energia sa. Monogamia emoțională poate fi provocatoare — are iubire pentru toți.',
    career:'Arte vizuale, scriere creativă, actorie, muzică, marketing creativ, design, publicitate, terapie prin artă, coaching motivațional, entertainment.',
    design:'Culori care cântă împreună — niciodată o singură voce. Layere de texturi, obiecte cu poveste, arta ca element structural. Spațiile sale sunt galerii de viață trăită. Fiecare colț are personalitate proprie.',
    colors:['Galben solar','Portocaliu bucuros','Turcoaz electric','Verde lime','Coral','Magenta','Auriu viu'],
    forms:['Forme organice jucăușe','Curbe dinamice','Straturi vizuale','Compoziții asimetrice','Elemente surpriză'],
    materials:['Ceramică pictată manual','Textile imprimate','Lemn pictat','Sticlă colorată','Ratan','Țesături artizanale'],
  },
  4:{
    kw:'Structurat · Loial · Constructor · Disciplinat · Pragmatic · Perseverent',
    pers:'Numărul 4 este piatra de temelie a existenței — energia care transformă visele în realitate prin muncă, disciplină și perseverență. Persoana cu 4 în hartă are o calitate rară în lumea modernă: spune ce face și face ce spune. Integritatea sa este indestructibilă. Are o răbdare extraordinară — poate construi timp de ani întregi fără să vadă rezultate imediate, știind cu certitudine că fundația solidă va purta în final orice structură. Ordinea nu este pentru 4 o constrângere — este limbajul său natural de gândire.',
    strengths:['Disciplină și perseverență excepționale','Integritate absolută și onestitate directă','Abilitate organizatorică și sistematică','Loialitate profundă față de persoanele iubite','Răbdare și capacitate de muncă susținută','Simț practic și abordare realistă','Abilitate de a materializa proiecte pe termen lung'],
    shadow:['Rigiditate și rezistență la schimbare','Workaholism și neglijarea nevoilor emoționale','Perfecționism paralizant','Dificultate de a vedea imaginea de ansamblu','Conservatorism excesiv','Tendință de a judeca pe alții după standardele proprii'],
    lifeTheme:'Construirea de fundații solide și durabile în toate dimensiunile vieții. Lecția centrală: flexibilitate în metodă, nu doar în obiectiv.',
    symbolism:'Saturn, Împăratul (Tarot), cele patru elemente, crucea cardinală, cubul — stabilitate perfectă în toate direcțiile.',
    relationships:'Partener stabil, de încredere, loial până la sacrificiu. Poate fi rigid în așteptările sale. Are nevoie de un partener care apreciază consecvența mai mult decât spontaneitatea. Iubirea sa se exprimă prin fapte, nu prin cuvinte.',
    career:'Arhitectură, inginerie, contabilitate, management de proiect, construcții, drept, medicină, orice domeniu care necesită precizie și durabilitate.',
    design:'Structuri clare unde fiecare element are un rol bine definit. Materiale care durează generații — lemn masiv, piatră naturală, metale nobile. Frumusețea vine din execuție impecabilă, nu din ornament.',
    colors:['Maro nuc','Gri piatră','Verde salvie','Bej natural','Teracotă arsă','Negru mat','Ocru'],
    forms:['Dreptunghiuri precise','Structuri clare','Proporții matematice','Grilă riguroasă','Simetrie funcțională'],
    materials:['Lemn masiv de esență nobilă','Piatră naturală','Fier forjat','Piele naturală','In gros','Lut ars'],
  },
  5:{
    kw:'Liber · Aventurier · Senzorial · Adaptabil · Dinamic · Cameleon',
    pers:'Numărul 5 este vântul — nu poate fi prins, nu poate fi oprit, nu poate rămâne prea mult în același loc fără să își piardă esența. Persoana cu 5 în hartă este un explorator al experienței umane în toate formele sale. Are simțurile cele mai ascuțite dintre toate numerele — miroase mai fin, aude mai subtil, gustă mai complex, atinge mai conștient. Schimbarea nu o sperie — o hrănește. Monotonia este pentru 5 ceea ce este privarea de oxigen pentru oricine altcineva.',
    strengths:['Adaptabilitate extraordinară la contexte noi','Simțuri hiper-dezvoltate și percepție senzorială fină','Versatilitate și abilitatea de a excela în multiple domenii','Charismă naturală și magnetism personal','Resourcefulness și creativitate în situații de criză','Deschidere culturală și globală','Capacitate de a se reconecta rapid cu esența vieții'],
    shadow:['Inconsistență și dificultate de a finaliza proiecte','Dependențe senzoriale — mâncare, sex, substanțe','Evitarea angajamentelor pe termen lung','Impulsivitate și decizii necugetate','Superficialitate prin căutarea constantă a noului','Instabilitate emoțională și relațională'],
    lifeTheme:'Experiența conștientă a libertății și a diversității vieții. Lecția centrală: libertatea responsabilă — a fi liber fără a fi iresponsabil.',
    symbolism:'Mercur, Hierofantul (Tarot), cele cinci simțuri, steaua cu cinci colțuri, schimbarea ca singură constantă.',
    relationships:'Partener fascinant, impredictibil, stimulant. Are nevoie de libertate în relație — gelozia sau posesivitatea îl asfixiază. Poate iubi profund dacă i se dă spațiu să se întoarcă singur.',
    career:'Jurnalism, călătorie, marketing, vânzări, entertainment, traducere, turism, sport, fotografie, orice rol care combină varietatea cu mișcarea.',
    design:'Spații care se pot reconfigura — nimic fixat permanent. Mix de culturi, epoci și stiluri fără jenă. Fiecare obiect are o poveste din altă parte a lumii. Texturile invită atingerea.',
    colors:['Turcoaz tropical','Portocaliu spice','Galben curcuma','Roșu chili','Albastru cobalt','Verde junglă','Magenta'],
    forms:['Forme în mișcare','Asimetrie dinamică','Curbe senzuale','Suprapuneri','Volume în conversație'],
    materials:['Ratan','Bambus','Piele exotică','Ceramică glazurată','Textile brodate','Lemn tropical'],
  },
  6:{
    kw:'Responsabil · Armonios · Estetic · Devotat · Vindecător · Frumos',
    pers:'Numărul 6 este întruchiparea frumuseții ca principiu spiritual — nu frumusețea superficială, ci cea profundă, a lucrurilor bine făcute, a relațiilor îngrijite, a spațiilor care vindecă. Persoana cu 6 în hartă simte că mediul formează omul cu o certitudine pe care alții o înțeleg abia intelectual, dar 6 o trăiește fizic. Intră într-o cameră și imediat vede ce trebuie ajustat, ce culoare lipsește, unde lumina ar trebui să cadă altfel. Responsabilitatea nu este o povară pentru 6 — este identitatea sa.',
    strengths:['Simț estetic înnăscut și rafinat','Responsabilitate și fiabilitate excepționale','Capacitate de vindecare și îngrijire','Armonie și echilibru în relații și spații','Devotament profund față de familie și comunitate','Creativitate practică aplicată în viața de zi cu zi','Abilitate de a transforma un spațiu în cămin'],
    shadow:['Perfecționism care paralizează și judecă','Martirologie — sacrificiul de sine excesiv','Interferență în viețile celorlalți din dorința de a ajuta','Posesivitate în relații de iubire','Anxietate estetică — disconfort în medii dezordonate','Dificultate de a accepta imperfecțiunea'],
    lifeTheme:'Serviciul prin frumusețe și armonie. Lecția centrală: a îngriji fără a controla, a oferi fără a epuiza.',
    symbolism:'Venus, Îndrăgostiții (Tarot), Steaua lui David, floarea vieții — principiul frumuseții perfecte și al iubirii universale.',
    relationships:'Cel mai devotat și îngrijitor partener. Pune nevoile celuilalt înaintea propriilor nevoi — uneori în detrimentul său. Are nevoie de reciprocitate și de a fi văzut în profunzimea devotamentului său.',
    career:'Design interior, arte, medicină, terapie, educație, consiliere, nutriție, modă, arhitectură peisagistică — orice domeniu unde frumusețea și îngrijirea se intersectează.',
    design:'Proporții care satisfac ochiul fără să explice de ce. Palete calde și îngrijite cu accent pe nuanțe, nu pe culori primare. Fiecare detaliu are intenție și grijă. Florile reale sunt obligatorii.',
    colors:['Lavandă','Roz praf','Auriu cald','Crem de ivory','Verde salvie','Roz pudrat','Piersică'],
    forms:['Curbe armonioase','Proporții clasice','Simetrie rafinată','Detalii ornamentale subtile','Forme care îmbrățișează'],
    materials:['Catifea premium','Mătase naturală','Marmură roz','Aurit','Ceramică fină','Flori uscate','Lemn alb vopsit'],
  },
  7:{
    kw:'Înțelept · Introspectiv · Mistic · Analist · Căutător · Filosof',
    pers:'Numărul 7 este ochiul care vede dincolo de suprafața lucrurilor — mereu. Persoana cu 7 în hartă nu se mulțumește cu răspunsuri de suprafață. Caută mereu stratul de sub strat, sensul ascuns, adevărul care nu se vede cu ochii obișnuiți. Are o minte analitică excepțională combinată cu o intuiție mistică rară — o combinație care face din 7 cel mai profund căutător al adevărului dintre toate numerele. Singurătatea nu este pentru 7 o pedeapsă — este un sanctuar necesar pentru regenerare.',
    strengths:['Minte analitică de excepție','Intuiție mistică și percepție a subtilului','Înțelepciune profundă și gândire filosofică','Capacitate de cercetare și investigare aprofundată','Spiritualitate autentică, nu de suprafață','Abilitate de a distila esența din complexitate','Profunzime psihologică și înțelegerea naturii umane'],
    shadow:['Tendință spre izolare și detașare emoțională','Cinism și neîncredere în motivele altora','Secretomanie și dificultate de a se deschide','Paralizie prin analiză excesivă','Critică interioară severă','Melancolie și perioade de retragere totală'],
    lifeTheme:'Căutarea adevărului și a înțelepciunii dincolo de aparențe. Lecția centrală: a integra înțelepciunea interioară în relații reale.',
    symbolism:'Neptun, Carul (Tarot), spada adevărului, labirintul interior, cele șapte zile ale creației — principiul cunoașterii sacre.',
    relationships:'Partener profund, misterios, fascinant. Dificil de cunoscut cu adevărat — deschide straturile lent, cu mare selectivitate. Are nevoie de un partener care respectă tăcerea și profunzimea.',
    career:'Filosofie, cercetare, psihologie, fizică, matematică, astrologie, teologie, scriitură profundă, investigare, detectiv, analist.',
    design:'Spații care comunică fără să vorbească. Tăcerea vizuală este un element de design. Materiale naturale cu textură profundă. Lumina cade deliberat, umbra este la fel de importantă ca lumina.',
    colors:['Albastru indigo profund','Violet noapte','Gri ceață','Verde pădure','Negru profund','Argintiu','Alb pur'],
    forms:['Geometrie sacră','Spații negative deliberate','Linii care dispar','Profunzime vizuală','Detalii ascunse de descoperit'],
    materials:['Piatră neagră','Lemn îmbătrânit','In natural','Lut','Sticlă fumurie','Metal oxidat','Piele naturală'],
  },
  8:{
    kw:'Ambițios · Autoritar · Abundent · Strategic · Manifestant · Puternic',
    pers:'Numărul 8 este simbolul infinitului pus în mișcare — energia care nu se oprește până când viziunea nu devine realitate tangibilă. Persoana cu 8 în hartă are o relație specială cu puterea și abundența: nu le dorește ca scopuri în sine, ci ca instrumente de realizare la scară mare. Are o viziune pe termen lung pe care alții rareori o înțeleg în momentul prezent dar o admiră retrospectiv. Știe că timpul, efortul și resursele sunt interdependente și le gestionează cu o precizie aproape matematică.',
    strengths:['Viziune strategică pe termen lung','Abilitate excepțională de manifestare materială','Leadership puternic și autoritate naturală','Gestionarea eficientă a resurselor și oamenilor','Reziliență extraordinară în fața obstacolelor','Determinare și putere de a readuce echilibrul','Simț fin al afacerilor și al oportunităților'],
    shadow:['Workaholism și neglijarea relațiilor personale','Obsesia pentru control și putere','Materialism și judecarea valorii prin succes material','Aroganță față de cei care nu împărtășesc ambițiile sale','Dificultate de a cere ajutor sau de a arăta vulnerabilitate','Karma financiară — câștiguri și pierderi ciclice'],
    lifeTheme:'Mastery-ul lumii materiale și exercitarea puterii în serviciul unui scop mai înalt. Lecția centrală: puterea vine cu responsabilitate.',
    symbolism: 'Forța (Tarot), simbolul infinitului, balanța, doi șerpi încolăciți — principiul echilibrului perfect între forțele opuse.',
    relationships:'Partener puternic, protector, generos material. Poate fi dominant și controlant. Are nevoie de un egal — admirația fără substanță îl plictisește rapid. Iubirea sa se exprimă prin protecție și abundență.',
    career:'CEO, investitor, chirurg, avocat de înaltă performanță, arhitect, politician, orice rol de putere și responsabilitate la scară mare.',
    design:'Materiale care comunică calitatea prin simplă prezență. Proporții mari, simetrie puternică, piese de mobilier care sunt sculptură. Auriu, negru, marmură — nu ca ostentație, ci ca expresie a excelenței.',
    colors:['Auriu imperial','Negru profund','Emerald regal','Bronz','Burgundy','Alb marmurean','Champagne'],
    forms:['Simetrie puternică','Volume mari și decisive','Proporții monumentale','Arcuri triumfale','Detalii aurite'],
    materials:['Marmură premium','Aur și bronz','Piele de birou de lux','Lemn de nuc','Cristal','Oțel periat','Granit'],
  },
  9:{
    kw:'Compasiv · Universal · Finalizator · Vizionar · Filantrop · Cosmic',
    pers:'Numărul 9 poartă în el toate celelalte numere — este suma și încoronarea întregului ciclu. Persoana cu 9 în hartă a venit pe lume cu o înțelepciune care pare uneori mai veche decât vârsta sa biologică. Simte suferința altora ca pe a sa proprie, are o compasiune universală care poate fi copleșitoare. Viziunea sa este globală și temporală — vede conexiuni între lucruri pe care alții le percep ca separate. Când 9 finalizează ceva, o face complet — nu lasă niciodată jumătăți de poveste.',
    strengths:['Compasiune universală și empatie globală','Înțelepciune sintetică — înțelege totul în context','Creativitate bogată alimentată de experiențe variate','Capacitate de vindecare prin prezență și înțelegere','Viziune globală și conștiință umanitară','Abilitate de a finaliza și de a încheia cicluri','Generozitate fără condiții'],
    shadow:['Martirologie și sacrificiu de sine excesiv','Dificultate de a lăsa să plece oameni și situații','Sentiment de superioritate mascat în umilință','Resentiment ascuns față de cei care nu văd ce vede el','Melancolie profundă în fața suferinței lumii','Dificultate de a primi — poate doar dărui'],
    lifeTheme:'Serviciul în favoarea umanității prin compasiune, înțelepciune și creație. Lecția centrală: a lăsa să plece cu grație — oameni, situații, identități.',
    symbolism:'Marte, Pustnicul (Tarot), toate culorile împreună, 9 muze, finalul care conține începutul — principiul completitudinii ciclice.',
    relationships:'Iubitor universal — poate iubi pe toți simultan, ceea ce poate fi confuz pentru parteneri. Are nevoie de un partener care înțelege că iubirea sa nu scade dacă o împarte cu lumea.',
    career:'Arte, activism, terapie, medicină alternativă, scriere, film, teatru, filozofie, religie, orice rol în serviciul umanității la scară largă.',
    design:'Spații bogate în povești și simboluri din culturi multiple. Fiecare obiect are o biografie. Culorile profunde și saturate. Nimic superficial sau decorativ fără scop.',
    colors:['Roșu profund','Burgundy','Violet imperial','Auriu antic','Bronz','Teracotă','Toate nuanțele profunde'],
    forms:['Compoziții circulare','Spirale','Simboluri sacre globale','Suprapuneri de epoci','Forme arhetipale'],
    materials:['Textile din toată lumea','Artizanat manual','Ceramică culturală','Lemn sculptat','Piatră cu istorie','Sticlă Murano'],
  },
  11:{
    kw:'DIVIN · Intuitiv Suprem · Canal · Iluminat · Inspirat · Mistic Avansat',
    pers:'Numărul 11 este primul număr master — un canal direct între planul uman și cel divin. Persoana cu 11 în hartă funcționează prin mecanisme pe care logica obișnuită nu le poate explica. Știe lucruri pe care nu le-a învățat, simte viitorul înainte să se întâmple, primește informații din surse pe care nu le poate numi. Această conexiune divină este atât un dar extraordinar cât și o responsabilitate enormă. Sistemul nervos al lui 11 este calibrat la o frecvență mult mai înaltă decât media — de unde sensibilitatea sa extremă la orice.',
    strengths:['Intuiție care depășește sfera raționalului','Inspirație creativă de nivel superior','Capacitate de a inspira masele prin prezență și cuvânt','Conexiune spirituală autentică și profundă','Percepție psihică și senzitivitate energetică','Abilitate de a canaliza înțelepciune colectivă','Charismă spirituală — oamenii simt ceva special în preajma sa'],
    shadow:['Sistem nervos supraîncărcat și anxietate cronică','Dificultate de a fi practic și de a finaliza lucruri','Trăire între două lumi — nici complet uman, nici complet divin','Înălțime spirituală izolantă','Hipersensibilitate la energii negative','Autocritică devastatoare când nu se ridică la propriile standarde','Perioade de prăbușire după vârfuri de inspirație'],
    lifeTheme:'A fi un canal pentru înțelepciunea divină și a o traduce în forme accesibile oamenilor. Lecția centrală: îngrijirea vasului uman care poartă darul divin.',
    symbolism:'Doi stâlpi — poarta dintre lumi, Judecata (Tarot), numărul revelației și al iluminării, frecvența maestrului intuitiv.',
    relationships:'Partener fascinant, profund, uneori inaccesibil. Iubește cu o intensitate copleșitoare. Are nevoie de un partener care să îl ancoreze fără să îl limiteze.',
    career:'Artă inspirațională, muzică de nivel înalt, scriere mistică sau poetică, terapie spirituală, activare spirituală, canal medianic, creație vizionară.',
    design:'Sacrul fără a-l numi. Spații care simt că aparțin altui plan de existență. Lumina este protagonistul absolut. Materialele par să lumineze din interior.',
    colors:['Alb lunar iridescent','Albastru divin','Argintiu celest','Violet cosmic','Auriu eter','Perlat','Transparente'],
    forms:['Geometrie sacră','Spirala divină Fibonacci','Proporțiile aurului','Forme care par să leviteze','Lumina ca formă'],
    materials:['Cristal natural','Sticlă optică','Metal argintiu','Piatră semiprecioasă','Ceramică irizată','Vopsele perlate'],
  },
  22:{
    kw:'CONSTRUCTOR SUPREM · Vizionar Practic · Arhitect Divin · Manifestant Universal',
    pers:'Numărul 22 este cel mai puternic număr de manifestare din întregul sistem numerologic — forța care traduce viziunile cosmice în realitate concretă. Persoana cu 22 în hartă are o combinație extraordinară de calități: visează la scara unui vizionar și execută cu precizia unui inginer. Nu construiește pentru sine — construiește pentru generații. Proiectele sale durează, instituțiile pe care le creează rezistă, ideile pe care le materializează schimbă felul în care oamenii trăiesc.',
    strengths:['Combinația unică de viziune și execuție practică','Capacitate de manifestare la scară globală','Organizare și sistematizare la cel mai înalt nivel','Reziliență extraordinară — poate purta greutăți enorme','Intuiție maestră combinată cu simț practic superior','Leadership care inspiră și construiește simultan','Longevitate și impact transgenerațional al creațiilor sale'],
    shadow:['Perfecționism care poate paraliza orice proiect','Preluarea responsabilităților altora până la burnout','Dificultate de a delega — nimeni nu face la standardul 22','Izolare prin grandoarea viziunii','Presiunea uriașă a potențialului neîmplinit','Oscilație între grandoare și autocritică devastatoare'],
    lifeTheme:'Construirea de structuri care servesc umanitatea la scară mare. Lecția centrală: nu poți construi pentru lume dacă nu îți construiești mai întâi propriul fundament.',
    symbolism:'Podul dintre lumi, numărul maestrului constructor, 22 de cărți în Arcana Mare a Tarotului — totalitatea înțelepciunii disponibile omului.',
    relationships:'Partener profund loial dar uneori absent — misiunea sa poate consuma tot. Are nevoie de un partener care înțelege că grandoarea sa nu înseamnă că nu iubește.',
    career:'Arhitectură monumentală, urbanistică, politică la nivel înalt, filantropie strategică, crearea de instituții durabile, leadership spiritual și practic simultan.',
    design:'Monumental în spirit, impecabil în execuție. Materialele vorbesc prin calitate absolută — piatră naturală extrasă din cariere specifice, lemn masiv cu decenii de viață, metale nobile. Construit pentru eternitate.',
    colors:['Piatră caldă','Auriu imperial','Ocru profund','Alb monument','Sienna','Negru absolut','Gri granit'],
    forms:['Arcuri triumfale','Coloane clasice','Proporții matematice perfecte','Volume care impresionează','Simetrie absolută'],
    materials:['Travertin și marmură','Lemn masiv de 100+ ani','Bronz și aur','Piatră de carieră','Sticlă arhitecturală','Oțel structural'],
  },
  33:{
    kw:'MANIFESTARE DIVINĂ · Maestru Vindecător · Transformator · Iubire Universală Activă',
    pers:'Numărul 33 este cel mai rar și mai înalt număr master — forța iubirii universale active, nu pasive. Persoana cu 33 în hartă nu transmite înțelepciune prin cuvinte sau structuri, ci prin prezența sa directă. Tot ce atinge înflorește — nu prin efort sau tehnică, ci prin alinierea sa la forța creatoare universală. Este un maestru al manifestării organice: semănând intenție, cultivând cu iubire și culegând roadele naturale ale unui spațiu energetic ridicat.',
    strengths:['Prezență energetică transformatoare','Iubire universală exprimată activ în orice situație','Vindecare prin simpla prezență sau atingere','Creativitate divină — creează din loc de inspirație pură','Capacitate de a ridica vibrația oricărei persoane sau spațiu','Compasiune fără judecată sau condiție','Manifestare fluentă — intenție + iubire = realitate'],
    shadow:['Complexul salvatorului — simte că trebuie să salveze pe toți','Autodepreciere prin dăruire fără limite','Dificultate de a pune limite — iubirea totală poate fi exploatată','Izolare prin raritatea propriei frecvențe','Suferință acută în contact cu energii negative sau spații reci','Presiunea potențialului neexprimat complet'],
    lifeTheme:'Ridicarea vibrației umanității prin iubire creativă activă. Lecția centrală: nu poți vindeca lumea dacă nu te vindeci mai întâi pe tine.',
    symbolism:'Cristul cosmic, maestrul maeștrilor, focul creator al iubirii divine — suma celor trei triimi, principiul manifestării prin iubire pură.',
    relationships:'Iubitor total, vindecător în relație, transformator al partenerului prin simplă prezență. Pericolul: dispariția de sine în celălalt. Are nevoie de un partener care îl vede și nu îl consumă.',
    career:'Vindecare holistică, artă sacră, muzică terapeutică, dans, educație transformatoare, crearea de comunități, activism prin artă, orice rol unde iubirea este instrumentul principal.',
    design:'Spații care vindecă prin simpla intrare în ele. Natura reală este obligatorie. Fiecare element are intenție spirituală. Vibrația spațiului se simte înainte să se vadă.',
    colors:['Verde profund sacru','Auriu viu','Alb de lotus','Turcoaz vindecare','Verde pădure primară','Roz iubire divină','Translucent'],
    forms:['Forme organice vii','Spirala vieții','Mandale botanice','Volume care îmbrățișează','Geometrie divină naturală'],
    materials:['Plante vii obligatorii','Lemn nobil cu viață','Cristale naturale','Ceramică artizanală','Piatră de râu','Moss și licheni','Materiale vii'],
  },
};
