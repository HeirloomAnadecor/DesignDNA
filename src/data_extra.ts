import { Project } from "./types";

export const POS_INFO: Record<string, {
  title: string;
  icon: string;
  lens: string;
  calc: string;
  impact: string;
  posLens: (n: number) => string;
}> = {
  drumVietii:{
    title:'Drumul Vieții',
    icon:'🛤',
    lens:'Misiunea centrală a vieții tale — provocările și darurile principale',
    calc:'Se calculează adunând toate cifrele din data nașterii (zi + lună + an) și reducând la o singură cifră sau număr master.',
    impact:'Cel mai important număr din hartă. Definește călătoria centrală — ce ai venit să înveți, ce obstacole vei întâlni și ce daruri vei oferi lumii.',
    posLens:n=>`Drumul tău de viață poartă energia lui ${n} — principalele lecții, provocări și daruri ale vieții tale sunt filtrate prin esența acestui număr.`
  },
  expresie:{
    title:'Expresia',
    icon:'🎭',
    lens:'Cum te exprimi în lume — talentele și abilitățile tale naturale',
    calc:'Se calculează atribuind valori numerice tuturor literelor din numele complet (tabla Pitagora) și reducând suma.',
    impact:'Revelează cum comunici, ce talente ai și cum ești perceput în plan profesional și creativ.',
    posLens:n=>`Expresia ta ${n} arată cum îți manifești talentele în lume. Este instrumentul tău de comunicare cu realitatea.`
  },
  suflet:{
    title:'Sufletul',
    icon:'💫',
    lens:'Dorința profundă a sufletului — motivația interioară ascunsă',
    calc:'Se calculează din valorile numerice ale vocalelor din numele complet.',
    impact:'Arată ce îți dorești cu adevărat dincolo de aparențe. Când spațiul reflectă această energie, te simți acasă.',
    posLens:n=>`Sufletul tău rezonează cu energia lui ${n}. Aceasta e vocea ta interioară cea mai pură — ceea ce cauți fără să știi mereu că îl cauți.`
  },
  personalit:{
    title:'Personalitatea',
    icon:'🎩',
    lens:'Masca exterioară — cum te percep ceilalți la prima vedere',
    calc:'Se calculează din valorile numerice ale consoanelor din numele complet.',
    impact:'Descrie impresia pe care o lași în lume — energia vizibilă înainte ca oamenii să te cunoască în profunzime.',
    posLens:n=>`Personalitatea ta de ${n} este masca pe care o porți în lume — prima pagină a cărții tale și primul limbaj pe care spațiul tău îl vorbește cu vizitatorii.`
  },
  psihic:{
    title:'Psihic · Ziua',
    icon:'🧠',
    lens:'Filtrul mental zilnic — cum percepi și procesezi realitatea',
    calc:'Se calculează reducând ziua nașterii la o singură cifră sau număr master.',
    impact:'Modul în care îți procesezi realitatea cotidian. Dictează prima reacție viscerală la un spațiu nou.',
    posLens:n=>`Psihicul tău funcționează prin filtrul lui ${n}. Aceasta e lentila prin care privești fiecare zi — ce observi primul într-un spațiu nou.`
  },
  maturitate:{
    title:'Maturitatea',
    icon:'🌳',
    lens:'Cine devii — energia în care crești după 35-40 de ani',
    calc:'Se calculează adunând Numărul Expresiei cu Drumul Vieții.',
    impact:'Potențialul complet al persoanei — versiunea matură, înțeleaptă, integrată. Dominant în a doua jumătate a vieții.',
    posLens:n=>`Numărul maturității tale este ${n}. Spațiul tău ar putea anticipa această versiune a ta, pregătindu-te pentru ea.`
  },
  atitudine:{
    title:'Atitudinea',
    icon:'🧭',
    lens:'Abordarea ta instinctivă față de situații noi',
    calc:'Se calculează reducând luna și ziua nașterii la o singură cifră sau număr master.',
    impact:'Energia cu care intri în orice situație nouă. Camera de intrare trebuie să o reflecte.',
    posLens:n=>`Atitudinea ta de ${n} e prima energie pe care o emite ființa ta când întâlnește ceva nou — tonul tău de bază.`
  },
  generatie:{
    title:'Generația',
    icon:'🌍',
    lens:'Energia colectivă a generației tale — viziunea comună',
    calc:'Se calculează adunând cifrele anului nașterii și reducând la o singură cifră sau număr master.',
    impact:'Conectează profilul individual cu energia generației — valorile colective, estetica epocii.',
    posLens:n=>`Generația ta poartă energia lui ${n} — fondul cultural și energetic în care ai crescut, care explică de ce anumite stiluri te atrag instinctiv.`
  },
};

export const NUM_META = [
  { key: 'drumVietii' },
  { key: 'expresie' },
  { key: 'suflet' },
  { key: 'personalit' },
  { key: 'psihic' },
  { key: 'maturitate' },
  { key: 'atitudine' },
  { key: 'generatie' }
];

export const NUM_STYLES: Record<number, string[]> = {
  1:['Minimalism','Bauhaus','Scandinavian Design','Japanese Minimalism','De Stijl','Contemporary','Ultra-Modern','Deconstructivism','High-Tech','Streamline Moderne','Capsule Interiors','Futurism','Neo-Minimalism','Avant-Garde','Monochromatic Minimal'],
  2:['Romantic','French Provincial','Shabby Chic','Gustavian','Soft Contemporary','Transitional','New Romantic','Cottagecore','Biedermeier','Swedish Grace','Quiet Luxury','Feminine Modern'],
  3:['Bohemian','Maximalist','Eclectic','Pop Art','Memphis Design','Artsy Loft','Funky Retro','Dopamine Décor','New Maximalism','Creative Studio','Colorful Contemporary','Retro Futurism'],
  4:['Craftsman','Arts & Crafts','Rustic','Farmhouse','Mission Style','Tudor Revival','Shaker','Traditional','Colonial','Prairie Style','Heritage Cottage','Log Cabin Luxe','New Craftsman'],
  5:['Coastal','Mediterranean','Moroccan','Tropical','Global Nomad','Bohemian Coastal','Caribbean','Resort Style','Nautical','Wanderlust','Lagom','Tiki Modern','Eclectic Coastal'],
  6:['French Country','Provençal','Neoclassical','Georgian','Regency','Italian Renaissance','Belle Époque','Parisian Chic','Old Hollywood Glamour','Greek Revival','Tuscan Villa','Romantic Neoclassical','Haussmann','Feminine Classical'],
  7:['Japandi','Wabi-Sabi','Zen','Hygge','Kinfolk','Nordic Minimalism','Silent Luxury','Monastic','Spa Aesthetic','Slow Living','Buddhist Inspired','Contemplative Modern','Forest Bathing Interiors'],
  8:['Art Deco','Hollywood Regency','Luxury Contemporary','Empire','Baroque','Dark Luxury','Power Interiors','Grand Hotel','Maximalist Luxury','Versailles-Inspired','Opulent Modern','Palatial','Dark Academia Luxe'],
  9:['World Fusion','Global Fusion','Boho Luxe','Tribal Modern','African Modern','Artisan','Cultural Mosaic','Folk Art Modern','Chinoiserie','Indo-Chic','Worldly Collector','Ethnobotanical','Orientalist','Eclectic Global','Universal Bohemian'],
  11:['Sacred Geometry','Ethereal Minimalism','Celestial Interiors','Spiritual Modernism','Light Architecture','Luminescent Design','Transcendent Space','Angelic Aesthetic','Mystical Minimalism','Divine Proportion'],
  22:['Monumental Neoclassical','Brutalist Luxury','Architectural Statement','Timeless Grand','Imperial Design','UNESCO Aesthetic','Master Builder Style','Landmark Interiors','Eternal Architecture','Grand Manifesto'],
  33:['Biophilic Design','Living Architecture','Regenerative Interior','Organic Architecture','Symbiotic Design','Eden Aesthetic','Verdant Luxury','Forest Interior','Moss & Stone','Sacred Garden Interiors'],
};

export const NUM_COLORS: Record<number, { c: string; n: string }[]> = {
  1: [{c:'#A8C8E8',n:'Albastru celest'},{c:'#4A7A9B',n:'Albastru marin'},{c:'#E8EEF5',n:'Alb lunar'},{c:'#C0C8D4',n:'Argintiu'},{c:'#7EC8D0',n:'Turcoaz palid'}],
  2: [{c:'#F0D8D0',n:'Blushing Rose'},{c:'#E8C4B4',n:'Blush'},{c:'#F8F0E8',n:'Ivory'},{c:'#C8A098',n:'Dusty Pink'},{c:'#F4E4DC',n:'Petal'}],
  3: [{c:'#F0C040',n:'Saffron'},{c:'#E84838',n:'Coral viu'},{c:'#40B8C0',n:'Turcoaz'},{c:'#F07048',n:'Portocaliu'},{c:'#88D048',n:'Lime'}],
  4: [{c:'#7A4E30',n:'Nuc'},{c:'#A07850',n:'Caramel'},{c:'#8CA870',n:'Salvie'},{c:'#C8B898',n:'Nisip'},{c:'#5A4030',n:'Maro profund'}],
  5: [{c:'#38B8A8',n:'Turcoaz coastal'},{c:'#C07848',n:'Teracotă'},{c:'#E8D4A0',n:'Nisip auriu'},{c:'#88A8A0',n:'Sare marină'},{c:'#F0E8D8',n:'Coral pal'}],
  6: [{c:'#C8A8CC',n:'Lavandă'},{c:'#C8A96E',n:'Auriu'},{c:'#F0E8D8',n:'Crem'},{c:'#A89080',n:'Rose beige'},{c:'#D8C0B8',n:'Poudré'}],
  7: [{c:'#B8B5B0',n:'Gri columbar'},{c:'#7A9A7A',n:'Verde ceai'},{c:'#D8D5D0',n:'Ceață'},{c:'#4A5848',n:'Forest'},{c:'#E8E5E0',n:'Linen'}],
  8: [{c:'#C8A030',n:'Auriu imperial'},{c:'#181818',n:'Negru profund'},{c:'#1A5C38',n:'Emerald'},{c:'#884820',n:'Bronz'},{c:'#C0B090',n:'Champagne'}],
  9: [{c:'#884070',n:'Prune profund'},{c:'#C47840',n:'Copper'},{c:'#D4A030',n:'Amber'},{c:'#5A3870',n:'Violet noapte'},{c:'#C08040',n:'Ocru'}],
  11:[{c:'#C8DCF0',n:'Albastru divin'},{c:'#E8EEF5',n:'Alb lunar'},{c:'#90B8D8',n:'Argint celest'},{c:'#D8E8F4',n:'Aqua eteric'},{c:'#B0C8E0',n:'Perlă albastră'}],
  22:[{c:'#C8B898',n:'Piatră caldă'},{c:'#8B7050',n:'Lut'},{c:'#4A3830',n:'Pământ închis'},{c:'#D8C8A8',n:'Ocru deschis'},{c:'#6A5040',n:'Sienna'}],
  33:[{c:'#4A7A4A',n:'Verde profund'},{c:'#8FAF5A',n:'Lime natural'},{c:'#2A5A2A',n:'Pădure'},{c:'#B0D080',n:'Verde deschis'},{c:'#3A6030',n:'Moss'}],
};

export const EL_FORMS: Record<string, { forms: string[]; textures: string[]; shape: string }> = {
  apa:    {forms:['Curbe fluide','Forme organice','Cercuri concentrice','Spirale','Valuri line'],textures:['Sticlă','Marmură lustruită','Mătase','Lacquer','Tencuială netedă'],shape:'wave'},
  lemn:   {forms:['Forme botanice','Asimetrie naturală','Linii organice','Nervuri foliare','Volume rotunjite'],textures:['Lemn natural','In','Bumbac','Ratan','Bambus'],shape:'leaf'},
  foc:    {forms:['Triunghiuri','Unghiuri dinamice','Forme radiante','Diagonale','Zigzag'],textures:['Cărămidă aparentă','Piele','Catifea','Cupru','Teracotă'],shape:'triangle'},
  pamant: {forms:['Dreptunghiuri','Arcade','Volume solide','Forme stabile','Proporții clasice'],textures:['Piatră naturală','Beton','Argilă','Lână','Iută'],shape:'arch'},
  cristal:{forms:['Hexagoane','Geometrie precisă','Linii pure','Repetiție ritmică','Forme clare'],textures:['Metal','Marmură albă','Ceramică glazurată','Oțel periat','Sticlă mat'],shape:'hex'},
};

export const MISSING_EL_DESC: Record<string, {
  need: string;
  colors: string[];
  colorHex: string[];
  forms: string[];
  energy: string;
  design: string;
}> = {
  apa:{need:'Cauți fluiditate, reflecție și profunzime. Ești atras de spații care curg și respiră liber, de transparențe și de liniștea apei.',colors:['Albastru celest','Albastru marin','Turcoaz palid','Argintiu','Alb lunar'],colorHex:['#A8C8E8','#4A7A9B','#7EC8D0','#C0C8D4','#E8EEF5'],forms:['Curbe fluide','Spirale','Cercuri','Forme organice'],energy:'Energia Apei îți aduce intuiție, adaptabilitate și liniște interioară profundă. Cauți să simți că spațiul tău respiră și curge.',design:'Adaugă suprafețe reflectorizante, textile fluide, sticlă, oglinzi și nuanțe de albastru sau argintiu.'},
  lemn:{need:'Cauți creștere, vitalitate și conexiune cu natura. Ești atras de organic, de autentic, de ce este viu și în mișcare.',colors:['Verde salvie','Verde pădure','Bej natural','Ocru vegetal','Olive'],colorHex:['#8FAF6A','#4A7A4A','#D4C8A0','#C8A048','#6B7A3A'],forms:['Forme botanice','Linii organice','Asimetrie naturală','Texturi de lemn'],energy:'Energia Lemnului îți aduce vitalitate, creativitate și simțul creșterii continue. Cauți să simți viața în jurul tău.',design:'Integrează plante reale, lemn natural, ratan, bambus și paleta verde-teracotă în spațiu.'},
  foc:{need:'Cauți pasiune, energie și contrast. Ești atras de dramatic, de culorile puternice și de spații cu caracter.',colors:['Roșu profund','Teracotă','Portocaliu ars','Auriu','Bronz'],colorHex:['#A03030','#C47848','#D4541A','#C8A030','#8B5020'],forms:['Triunghiuri','Unghiuri dinamice','Forme radiante','Diagonale'],energy:'Energia Focului îți aduce pasiune, curaj și capacitatea de a transforma orice situație. Cauți intensitate și prezență.',design:'Adaugă accente de roșu sau teracotă, lumânări, lumină caldă direcțională și forme dinamice, ascuțite.'},
  pamant:{need:'Cauți stabilitate, căldură și ancorare. Ești atras de solid, de autentic, de ce durează și rezistă timpului.',colors:['Beige cald','Caramel','Sienna','Ocru','Maro pământiu'],colorHex:['#E8D8C0','#C4904A','#A0522D','#C8962A','#7A5030'],forms:['Dreptunghiuri','Arcade','Volume solide','Proporții echilibrate'],energy:'Energia Pământului îți aduce stabilitate, siguranță și simțul că ești la locul tău. Cauți să te simți înrădăcinat.',design:'Adaugă piatră naturală, ceramică, lut, textile groase de lână sau bumbac și nuanțe de pământ cald.'},
  cristal:{need:'Cauți claritate, precizie și rafinament. Ești atras de pur, de esențial, de ce a trecut prin procesul de distilare.',colors:['Alb mineral','Gri perle','Argintiu','Alb rece','Slate'],colorHex:['#F0EEEA','#C8C4C0','#B0B8C0','#E8E8EC','#8090A0'],forms:['Hexagoane','Geometrie precisă','Linii drepte','Forme pure'],energy:'Energia Cristalului îți aduce claritate mentală, precizie și simțul eleganței distilate. Cauți ordine și claritate.',design:'Adaugă suprafețe metalice, ceramică glazurată, geometrie precisă și o paletă monocromatică clară.'},
};

export const SW: Record<string, { adj: string[]; noun: string[] }> = {
  apa:    {adj:['Fluid','Luminos','Eteric','Reflectiv','Diafan','Contemplativ'],noun:['Lumière','Miroir','Céleste','Flow','Aqua','Épure']},
  lemn:   {adj:['Organic','Vital','Arborescant','Radiant','Viu','Verdant'],    noun:['Eden','Verdure','Botanica','Grove','Natura','Foliage']},
  foc:    {adj:['Pasional','Dramatic','Ardent','Intens','Bold','Solaire'],      noun:['Ember','Soleil','Fuoco','Ardore','Braise','Lumina']},
  pamant: {adj:['Ancorat','Cald','Autentic','Solid','Profund','Terran'],        noun:['Terra','Terroir','Ocre','Argile','Humus','Mater']},
  cristal:{adj:['Pur','Rafinat','Esențial','Precis','Clar','Serein'],          noun:['Sérénité','Clarté','Zénith','Crystal','Silice','Épure']},
};

export const PROJECTS: Project[] = [
  {id:'apartment-lumiere',name:'Apartment Lumière',type:'Apartament',elements:['apa','cristal'],nums:[1,6,7],cromatics:['Alb','Crem','Bej','Gri perlat'],style:'Contemporary Rafinat',desc:'Texturi naturale și lumină filtrată cu grație. Eleganță discretă, calm și armonie interioară.',url:'https://anadecor.ro/portofoliu/apartment-lumiere',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fapartment-lumiere%2F1.jpg&w=600&q=75'},
  {id:'apartment-velours',name:'Apartment Velours',type:'Apartament',elements:['pamant'],nums:[2,5,8],cromatics:['Catifea','Caramel','Bronz','Auriu cald'],style:'Lux Urban',desc:'Catifea și nuanțe calde. Intimitate și grandoare în armonie perfectă.',url:'https://anadecor.ro/portofoliu/apartment-velours',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fapartment-velours%2F1.jpg&w=600&q=75'},
  {id:'casa-aurea',name:'Casa Aurea',type:'Casă',elements:['foc','cristal'],nums:[9,6],cromatics:['Auriu','Ivory','Piatră','Bronz'],style:'Eleganță Meditativă',desc:'Accente aurii și materiale naturale. Lumina se reflectă în suprafețe atent alese.',url:'https://anadecor.ro/portofoliu/casa-aurea',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fcasa-aurea%2F1.jpg&w=600&q=75'},
  {id:'casa-nuance',name:'Casa Nuance',type:'Casă',elements:['lemn'],nums:[3,4],cromatics:['Neutru','Verde vegetal','Bej organic','Lut'],style:'Organic Natural',desc:'Nuanțe subtile și tranziții cromatice blânde. Echilibru între formă și funcție.',url:'https://anadecor.ro/portofoliu/casa-nuance',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fcasa-nuance%2F1.jpg&w=600&q=75'},
  {id:'casa-sereno',name:'Casa Sereno',type:'Casă',elements:['cristal','apa'],nums:[6,7,1],cromatics:['Alb','Gri mineral','Albastru palid','Linen'],style:'Zen Contemporan',desc:'Serenitatea ca principiu de design. Linii pure și spații deschise pentru contemplare.',url:'https://anadecor.ro/portofoliu/casa-sereno',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fcasa-sereno%2F1.jpg&w=600&q=75'},
  {id:'loft-cadence',name:'Loft Cadence',type:'Loft',elements:['lemn','pamant'],nums:[4,2,3],cromatics:['Beton aparent','Lemn cald','Negru mat','Ruginit'],style:'Industrial Warm',desc:'Betonul aparent în dialog cu lemnul cald. Energie urbană și confort rafinat.',url:'https://anadecor.ro/portofoliu/loft-cadence',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Floft-cadence%2F1.jpg&w=600&q=75'},
  {id:'loft-celeste',name:'Loft Céleste',type:'Loft',elements:['apa','cristal'],nums:[1,7],cromatics:['Albastru celest','Alb','Argintiu','Natural'],style:'Eteric Luminos',desc:'Albastrul celest și albul pur. Libertatea zborului prinsă în arhitectură.',url:'https://anadecor.ro/portofoliu/loft-celeste',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Floft-celeste%2F1.jpg&w=600&q=75'},
  {id:'loft-serenite',name:'Loft Sérénité',type:'Loft',elements:['cristal','pamant'],nums:[6,7,5],cromatics:['Monocromatic','In','Piatră','Lemn masiv'],style:'Simplitate Rafinată',desc:'Paleta monocromatică animată de texturi variate. Simplitate rafinată.',url:'https://anadecor.ro/portofoliu/loft-serenite',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Floft-serenite%2F1.jpg&w=600&q=75'},
  {id:'residence-vela',name:'Residence Vela',type:'Rezidență',elements:['apa','cristal'],nums:[1,6],cromatics:['Albastru marin','Alb','Auriu subtil','Gri perle'],style:'Clasic Contemporan',desc:'Spații fluide, materiale prețioase. Clasic și contemporan în armonie desăvârșită.',url:'https://anadecor.ro/portofoliu/residence-vela',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fresidence-vela%2F1.jpg&w=600&q=75'},
  {id:'rezidence-epure',name:'Rezidence Épure',type:'Rezidență',elements:['cristal'],nums:[6,7],cromatics:['Alb','Beton','Gri mineral','Negru'],style:'Minimalist Sculptural',desc:'Formele distilate până la esență. Materialele vorbesc prin textură și calitate.',url:'https://anadecor.ro/portofoliu/rezidence-epure',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Frezidence-epure%2F1.jpg&w=600&q=75'},
  {id:'rezidence-harmonia',name:'Rezidence Harmonia',type:'Rezidență',elements:['lemn','apa'],nums:[3,1,4],cromatics:['Paletă unitară','Verde','Bej','Lemn natural'],style:'Armonie Organică',desc:'Armonia dintre spații, culori și materiale. Tranziții fluide ghidate de lumina naturală.',url:'https://anadecor.ro/portofoliu/rezidence-harmonia',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Frezidence-harmonia%2F1.jpg&w=600&q=75'},
  {id:'studio-orea',name:'Studio Oréa',type:'Studio',elements:['pamant','lemn'],nums:[2,8,3],cromatics:['Cald','Teracotă','Miere','Natural'],style:'Compact & Ingenios',desc:'Fiecare centimetru orchestrat cu precizie. Un univers complet în spațiu compact.',url:'https://anadecor.ro/portofoliu/studio-orea',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fstudio-orea%2F1.jpg&w=600&q=75'},
  {id:'villa-meridian',name:'Villa Meridian',type:'Vilă',elements:['lemn','foc'],nums:[4,9,3],cromatics:['Piatră','Lemn','In','Ocru'],style:'Mediterranean Grand',desc:'Lumina meridianului prin ferestre generoase. Materiale naturale în dialog cu peisajul.',url:'https://anadecor.ro/portofoliu/villa-meridian',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fvilla-meridian%2F1.jpg&w=600&q=75'},
  {id:'villa-solstice',name:'Villa Solstice',type:'Vilă',elements:['apa','lemn'],nums:[1,3],cromatics:['Alb pur','Lemn natural','Verde','Azur'],style:'Natural & Luminos',desc:'Alb pur și lemn natural. Conexiunea cu natura, senzația de vacanță permanentă.',url:'https://anadecor.ro/portofoliu/villa-solstice',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fvilla-solstice%2F1.jpg&w=600&q=75'},
  {id:'villa-ethera',name:'Villa Éthera',type:'Vilă',elements:['apa','cristal'],nums:[1,7,6],cromatics:['Transparent','Alb','Gri pal','Argintiu'],style:'Eteric & Poetic',desc:'Spațiul plutește între cer și pământ. Granița dintre interior și exterior dispare.',url:'https://anadecor.ro/portofoliu/villa-ethera',img:'https://anadecor.ro/_next/image?url=%2Fimages%2Fportfolio%2Fvilla-ethera%2F1.jpg&w=600&q=75'},
];

export const STYLE_TAG: Record<number, string> = {
  1:'Minimalist', 2:'Romantic', 3:'Boho', 4:'Rustic', 5:'Coastal', 6:'Clasic',
  7:'Zen', 8:'Art Deco', 9:'Global', 11:'Celest', 22:'Monumental', 33:'Biofilic'
};
