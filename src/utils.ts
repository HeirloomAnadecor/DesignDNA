import { NumerologyResults, Project } from "./types";
import { PYTH, VOWELS, MASTER } from "./data";
import { PROJECTS, POS_INFO, SW } from "./data_extra";

export const isMaster = (n: number) => MASTER.has(n);

export const reduce = (n: number): number => {
  let x = n;
  while (x > 9 && !MASTER.has(x)) {
    x = [...String(x)].reduce((a, b) => a + Number(b), 0);
  }
  return x || 1;
};

export const lv = (ch: string) => PYTH[ch.toUpperCase()] || 0;

export const calcNumerology = (name: string, d: number, m: number, y: number): NumerologyResults => {
  const L = name.toUpperCase().replace(/[^A-ZĂÂÎȘȚŞŢ]/g, '');
  const drumVietii = reduce([...String(d), ...String(m), ...String(y)].reduce((a, b) => a + Number(b), 0));
  const expresie = reduce([...L].reduce((a, c) => a + lv(c), 0));
  const suflet = reduce([...L].filter(c => VOWELS.has(c)).reduce((a, c) => a + lv(c), 0) || 1);
  const personalit = reduce([...L].filter(c => !VOWELS.has(c)).reduce((a, c) => a + lv(c), 0) || 1);
  const psihic = reduce(d);
  const maturitate = reduce(expresie + drumVietii);
  const atitudine = reduce(reduce(m) + reduce(d));
  const generatie = reduce([...String(y)].reduce((a, b) => a + Number(b), 0));
  return { drumVietii, expresie, suflet, personalit, psihic, maturitate, atitudine, generatie };
};

export const numToEl = (n: number): string => {
  if (n === 11) return 'apa';
  if (n === 22) return 'pamant';
  if (n === 33) return 'lemn';
  if (n === 1) return 'apa';
  if (n === 3 || n === 4) return 'lemn';
  if (n === 9) return 'foc';
  if (n === 2 || n === 5 || n === 8) return 'pamant';
  return 'cristal';
};

export const getSortedNums = (nums: NumerologyResults) => {
  const freq: Record<number, number> = {};
  Object.values(nums).forEach(n => {
    freq[n] = (freq[n] || 0) + 1;
  });
  
  const NUM_META = [
    { key: 'drumVietii' },
    { key: 'expresie' },
    { key: 'suflet' },
    { key: 'personalit' },
    { key: 'psihic' },
    { key: 'maturitate' },
    { key: 'atitudine' },
    { key: 'generatie' }
  ];

  return [...NUM_META].sort((a, b) => {
    const keyA = a.key as keyof NumerologyResults;
    const keyB = b.key as keyof NumerologyResults;
    const d = (freq[nums[keyB]] || 0) - (freq[nums[keyA]] || 0);
    return d !== 0 ? d : nums[keyB] - nums[keyA];
  });
};

export const getElemRanking = (nums: NumerologyResults): [string, number][] => {
  const c: Record<string, number> = {};
  Object.values(nums).forEach(n => {
    const e = numToEl(n);
    c[e] = (c[e] || 0) + 1;
  });
  return Object.entries(c).sort((a, b) => b[1] - a[1]);
};

export const getDominants = (nums: NumerologyResults): string[] => {
  const r = getElemRanking(nums);
  if (r.length === 0) return [];
  
  // Elements with count >= 2 are considered dominant
  const doms = r.filter(([, c]) => c >= 2).map(([e]) => e);
  
  // Fallback if somehow no element has count >= 2 (mathematically impossible with 8 positions and 5 elements)
  if (doms.length === 0) {
    return [r[0][0]];
  }
  
  return doms;
};

export const getMissingElements = (nums: NumerologyResults): string[] => {
  const present = new Set(Object.values(nums).map(n => numToEl(n)));
  const CYCLE = ['apa', 'lemn', 'foc', 'pamant', 'cristal'];
  return CYCLE.filter(el => !present.has(el));
};

interface ElementDesc {
  adj: string;
  noun: string;
  concept: string;
}

const mapDesc: Record<string, Record<number, ElementDesc>> = {
  apa: {
    0: { adj: "Siccativ", noun: "Ariditate", concept: "Eter Arid" },
    1: { adj: "Diafan", noun: "Rouă", concept: "Curgere Subtilă" },
    2: { adj: "Fluid", noun: "Reflexie", concept: "Fluiditate Meditativă" },
    3: { adj: "Profund", noun: "Cascade", concept: "Abisul Nocturn" },
    4: { adj: "Oceanic", noun: "Maree", concept: "Maree Cosmică" },
    5: { adj: "Absolut", noun: "Diluviu", concept: "Diluviu Poetic" },
    6: { adj: "Cosmic", noun: "Abis", concept: "Absolutul Eteric" },
    7: { adj: "Infinit", noun: "Ocean", concept: "Sursă Primordială" },
    8: { adj: "Primordial", noun: "Geneză", concept: "Geneză Cosmică" }
  },
  lemn: {
    0: { adj: "Abstract", noun: "Sinteză", concept: "Geometrie Pură" },
    1: { adj: "Organic", noun: "Mugur", concept: "Accent Vegetal" },
    2: { adj: "Biofilic", noun: "Suflu", concept: "Ritm Silvatic" },
    3: { adj: "Verdant", noun: "Canopee", concept: "Pădure Șoptitoare" },
    4: { adj: "Viguros", noun: "Sanctuar", concept: "Canopee Sacră" },
    5: { adj: "Edenic", noun: "Eden", concept: "Sălbăticie Cultivată" },
    6: { adj: "Primitiv", noun: "Arbore", concept: "Arborele Cosmic" },
    7: { adj: "Ancestral", noun: "Vigoare", concept: "Templu Vegetal" },
    8: { adj: "Cosmic", noun: "Eden", concept: "Eden Primordial" }
  },
  foc: {
    0: { adj: "Lunar", noun: "Temperare", concept: "Liniște Umbrită" },
    1: { adj: "Ardent", noun: "Scânteie", concept: "Căldură Șoptită" },
    2: { adj: "Solaire", noun: "Flacără", concept: "Temperament Solaire" },
    3: { adj: "Intens", noun: "Vatră", concept: "Contrast Teatral" },
    4: { adj: "Incandescent", noun: "Magmă", concept: "Alchimie Ardentă" },
    5: { adj: "Imperial", noun: "Solar", concept: "Foc Imperial" },
    6: { adj: "Cosmic", noun: "Supernovă", concept: "Supernovă Estetică" },
    7: { adj: "Sacru", noun: "Incandescență", concept: "Foc Sacru" },
    8: { adj: "Primordial", noun: "Vatră", concept: "Cosmogeneză Solară" }
  },
  pamant: {
    0: { adj: "Aerian", noun: "Volatilitate", concept: "Eter Volatil" },
    1: { adj: "Ancorat", noun: "Lut", concept: "Ancorare Subtilă" },
    2: { adj: "Terestru", noun: "Monolit", concept: "Teracotă Arhitecturală" },
    3: { adj: "Solid", noun: "Catedrală", concept: "Sanctuar Mineral" },
    4: { adj: "Ancestral", noun: "Sanctuar", concept: "Catedrală de Piatră" },
    5: { adj: "Etern", noun: "Fundație", concept: "Maison Monolithe" },
    6: { adj: "Cosmic", noun: "Lut Ancestral", concept: "Fundație Ancestrală" },
    7: { adj: "Arhitectural", noun: "Argilă", concept: "Cosmogeneză Terestră" },
    8: { adj: "Primordial", noun: "Monolit", concept: "Rădăcini Cosmice" }
  },
  cristal: {
    0: { adj: "Fluid", noun: "Reflexie", concept: "Organic Subtil" },
    1: { adj: "Serein", noun: "Liniuță", concept: "Claritate Pură" },
    2: { adj: "Cristalin", noun: "Silex", concept: "Structură Cristalină" },
    3: { adj: "Precis", noun: "Zénith", concept: "Eleganță Distilată" },
    4: { adj: "Distilat", noun: "Prismă", concept: "Zénith Geometric" },
    5: { adj: "Minimalist", noun: "Simetrie", concept: "Catedrală de Geometrie" },
    6: { adj: "Cosmic", noun: "Silex", concept: "Minimalism Monolitic" },
    7: { adj: "Sacru", noun: "Prismă Sacră", concept: "Puritate Absolută" },
    8: { adj: "Primordial", noun: "Silex Primordial", concept: "Claritate Cosmică" }
  }
};

const getElementPhrase = (el: string, count: number): string => {
  if (count <= 0) return "";
  if (el === 'apa') {
    if (count === 1) return "Curgere Șoptită (1 de Apă)";
    if (count === 2) return "Fluiditate Meditativă (2 de Apă)";
    if (count === 3) return "Abis Nocturn (3 de Apă)";
    if (count === 4) return "Maree Cosmică (4 de Apă)";
    if (count === 5) return "Diluviu Poetic (5 de Apă)";
    return `Ocean Absolut (${count} de Apă)`;
  }
  if (el === 'lemn') {
    if (count === 1) return "Accent Vegetal (1 de Lemn)";
    if (count === 2) return "Ritm Silvatic (2 de Lemn)";
    if (count === 3) return "Pădure Șoptitoare (3 de Lemn)";
    if (count === 4) return "Canopee Sacră (4 de Lemn)";
    if (count === 5) return "Eden Cultivat (5 de Lemn)";
    return `Eden Primordial (${count} de Lemn)`;
  }
  if (el === 'foc') {
    if (count === 1) return "Căldură Șoptită (1 de Foc)";
    if (count === 2) return "Temperament Solaire (2 de Foc)";
    if (count === 3) return "Contrast Teatral (3 de Foc)";
    if (count === 4) return "Alchimie Ardentă (4 de Foc)";
    if (count === 5) return "Foc Imperial (5 de Foc)";
    return `Cosmogeneză Solară (${count} de Foc)`;
  }
  if (el === 'pamant') {
    if (count === 1) return "Ancorare Subtilă (1 de Pământ)";
    if (count === 2) return "Teracotă Arhitecturală (2 de Pământ)";
    if (count === 3) return "Sanctuar Mineral (3 de Pământ)";
    if (count === 4) return "Catedrală de Piatră (4 de Pământ)";
    if (count === 5) return "Fundație Ancestrală (5 de Pământ)";
    return `Rădăcini Cosmice (${count} de Pământ)`;
  }
  if (el === 'cristal') {
    if (count === 1) return "Claritate Pură (1 de Cristal)";
    if (count === 2) return "Structură Cristalină (2 de Cristal)";
    if (count === 3) return "Eleganță Distilată (3 de Cristal)";
    if (count === 4) return "Zénith Geometric (4 de Cristal)";
    if (count === 5) return "Simetrie Sacră (5 de Cristal)";
    return `Claritate Cosmică (${count} de Cristal)`;
  }
  return "";
};

const NOUNS: Record<string, Record<number, { word: string; gender: "M" | "F" }>> = {
  apa: {
    1: { word: "Rouă", gender: "F" },
    2: { word: "Reflexie", gender: "F" },
    3: { word: "Abis", gender: "M" },
    4: { word: "Maree", gender: "F" },
    5: { word: "Cascadă", gender: "F" },
    6: { word: "Ocean", gender: "M" },
    7: { word: "Ocean", gender: "M" },
    8: { word: "Ocean", gender: "M" }
  },
  lemn: {
    1: { word: "Mugur", gender: "M" },
    2: { word: "Suflu", gender: "M" },
    3: { word: "Ritm", gender: "M" },
    4: { word: "Sanctuar", gender: "M" },
    5: { word: "Eden", gender: "M" },
    6: { word: "Arbore", gender: "M" },
    7: { word: "Arbore", gender: "M" },
    8: { word: "Arbore", gender: "M" }
  },
  foc: {
    1: { word: "Scânteie", gender: "F" },
    2: { word: "Temperament", gender: "M" },
    3: { word: "Ardoare", gender: "F" },
    4: { word: "Vatră", gender: "F" },
    5: { word: "Supernovă", gender: "F" },
    6: { word: "Supernovă", gender: "F" },
    7: { word: "Supernovă", gender: "F" },
    8: { word: "Supernovă", gender: "F" }
  },
  pamant: {
    1: { word: "Lut", gender: "M" },
    2: { word: "Teracotă", gender: "F" },
    3: { word: "Monolit", gender: "M" },
    4: { word: "Catedrală", gender: "F" },
    5: { word: "Fundație", gender: "F" },
    6: { word: "Fundație", gender: "F" },
    7: { word: "Fundație", gender: "F" },
    8: { word: "Fundație", gender: "F" }
  },
  cristal: {
    1: { word: "Claritate", gender: "F" },
    2: { word: "Prismă", gender: "F" },
    3: { word: "Zenit", gender: "M" },
    4: { word: "Silex", gender: "M" },
    5: { word: "Simetrie", gender: "F" },
    6: { word: "Simetrie", gender: "F" },
    7: { word: "Simetrie", gender: "F" },
    8: { word: "Simetrie", gender: "F" }
  }
};

const ADJECTIVES: Record<string, Record<number, { M: string; F: string }>> = {
  apa: {
    1: { M: "Diafan", F: "Diafană" },
    2: { M: "Fluid", F: "Fluidă" },
    3: { M: "Profund", F: "Profundă" },
    4: { M: "Nocturn", F: "Nocturnă" },
    5: { M: "Oceanic", F: "Oceanică" },
    6: { M: "Absolut", F: "Absolută" },
    7: { M: "Cosmic", F: "Cosmică" },
    8: { M: "Cosmic", F: "Cosmică" }
  },
  lemn: {
    1: { M: "Organic", F: "Organică" },
    2: { M: "Biofilic", F: "Biofilică" },
    3: { M: "Silvatic", F: "Silvatică" },
    4: { M: "Verdant", F: "Verdantă" },
    5: { M: "Ancestral", F: "Ancestrală" },
    6: { M: "Primitiv", F: "Primitivă" },
    7: { M: "Sălbatic", F: "Sălbatică" },
    8: { M: "Sălbatic", F: "Sălbatică" }
  },
  foc: {
    1: { M: "Ardent", F: "Ardentă" },
    2: { M: "Solaire", F: "Solaire" },
    3: { M: "Teatral", F: "Teatrală" },
    4: { M: "Incandescent", F: "Incandescentă" },
    5: { M: "Imperial", F: "Imperială" },
    6: { M: "Vibrant", F: "Vibrantă" },
    7: { M: "Sacru", F: "Sacră" },
    8: { M: "Sacru", F: "Sacră" }
  },
  pamant: {
    1: { M: "Ancorat", F: "Ancorată" },
    2: { M: "Terestru", F: "Terestră" },
    3: { M: "Tectonic", F: "Tectonică" },
    4: { M: "Mineral", F: "Minerală" },
    5: { M: "Solid", F: "Solidă" },
    6: { M: "Ancestral", F: "Ancestrală" },
    7: { M: "Etern", F: "Eternă" },
    8: { M: "Etern", F: "Eternă" }
  },
  cristal: {
    1: { M: "Pur", F: "Pură" },
    2: { M: "Cristalin", F: "Cristalină" },
    3: { M: "Distilat", F: "Distilată" },
    4: { M: "Geometric", F: "Geometrică" },
    5: { M: "Prismatic", F: "Prismatică" },
    6: { M: "Minimalist", F: "Minimalistă" },
    7: { M: "Absolut", F: "Absolută" },
    8: { M: "Absolut", F: "Absolută" }
  }
};

const GENITIVES: Record<string, Record<number, string>> = {
  apa: {
    1: "de Rouă",
    2: "de Flux",
    3: "de Abis",
    4: "de Maree",
    5: "de Ocean",
    6: "de Ocean",
    7: "de Ocean",
    8: "de Ocean"
  },
  lemn: {
    1: "de Mugur",
    2: "de Suflu",
    3: "de Pădure",
    4: "de Sanctuar",
    5: "de Eden",
    6: "de Eden",
    7: "de Eden",
    8: "de Eden"
  },
  foc: {
    1: "de Scânteie",
    2: "de Alchimie",
    3: "de Ardoare",
    4: "de Vatră",
    5: "de Supernovă",
    6: "de Supernovă",
    7: "de Supernovă",
    8: "de Supernovă"
  },
  pamant: {
    1: "de Lut",
    2: "de Argilă",
    3: "de Piatră",
    4: "de Monolit",
    5: "de Pământ",
    6: "de Pământ",
    7: "de Pământ",
    8: "de Pământ"
  },
  cristal: {
    1: "de Cristal",
    2: "de Silex",
    3: "de Zenit",
    4: "de Geometrie",
    5: "de Lumină",
    6: "de Lumină",
    7: "de Lumină",
    8: "de Lumină"
  }
};

export const ELEMENT_PSYCHOLOGY = {
  apa: {
    label: "Apă",
    title: "Fluiditate Sentimentală",
    attributes: ["carieră", "curent", "sentimentală", "fluiditate", "transparență", "simte", "are memorie", "conectată"]
  },
  lemn: {
    label: "Lemn",
    title: "Bunăstare Organică",
    attributes: ["bunăstare", "organic", "ciclic", "muncitor", "sezonier", "transformare", "lent", "se face simțit", "natura", "viață", "fertil"]
  },
  foc: {
    label: "Foc",
    title: "Pasiune Incandescentă",
    attributes: ["iubire", "pasiune", "esență", "căldură", "intensitate", "rapiditate", "temperamental"]
  },
  pamant: {
    label: "Pământ",
    title: "Centru Protector",
    attributes: ["protecție", "maturitate", "creștere", "informație", "mentor", "centru", "global", "schimbare", "mult"]
  },
  cristal: {
    label: "Cristal",
    title: "Chintesență Prismatică",
    attributes: ["chintesență", "aprofundare", "transformare prin introspecție și reflexie", "rece", "calculat", "perfecțiune", "loial"]
  }
};

export const getStyleDescription = (dominants: string[], nums: NumerologyResults): string => {
  const counts: Record<string, number> = { apa: 0, lemn: 0, foc: 0, pamant: 0, cristal: 0 };
  Object.values(nums).forEach(n => {
    const e = numToEl(n);
    counts[e] = (counts[e] || 0) + 1;
  });

  const sortedByCount = Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .filter(([_, cnt]) => cnt > 0);

  if (sortedByCount.length === 0) {
    return "Arhetipul tău estetic îmbină elementele într-o structură psihologică și estetică precisă. Se bazează pe echilibrul subtil, minimalist și profund al elementelor primordiale.";
  }

  const [domEl, domCnt] = sortedByCount[0];
  const hasSecondary = sortedByCount.length > 1;
  const [secEl, secCnt] = hasSecondary ? sortedByCount[1] : [null, 0];

  let domSentence = "";
  if (domEl === 'apa') {
    if (domCnt === 1) {
      domSentence = "Influența fluidă se manifestă ca un ecou subtil în structura ta psihologică, aducând o sensibilitate fină și o intuiție discretă.";
    } else if (domCnt === 2) {
      domSentence = "Fluxul tău interior este ghidat de o armonie echilibrată și conștientă, îmbinând sensibilitatea profundă cu o fluiditate naturală în viață.";
    } else if (domCnt === 3) {
      domSentence = "Ești animat de o maree emoțională profundă și empatică, unde sentimentele profunde și conexiunile interioare îți ghidează parcursul.";
    } else {
      domSentence = "Trăiești sub semnul unei fluidități absolute și intuitive, fiind complet ghidat de un curent spiritual și emoțional profund integrat.";
    }
  } else if (domEl === 'lemn') {
    if (domCnt === 1) {
      domSentence = "Energia vitală se manifestă ca un accent subtil de bunăstare organică, sprijinind în tăcere regenerarea ta continuă în fundal.";
    } else if (domCnt === 2) {
      domSentence = "Personalitatea ta urmează un ritm natural și ciclic, manifestând o dorință profundă de transformare treptată, dar sigură.";
    } else if (domCnt === 3) {
      domSentence = "Te definește o forță viguroasă orientată spre creștere continuă și autodepășire, reușind să insufli viață în tot ce te înconjoară.";
    } else {
      domSentence = "Ești pilonul de rezistență și vitalitate de neclintit, trăind într-o conexiune ancestrală cu natura și având un potențial colosal de regenerare.";
    }
  } else if (domEl === 'foc') {
    if (domCnt === 1) {
      domSentence = "Pasiunea și entuziasmul mocnesc în tine ca o scânteie caldă, aducând o notă discretă de spirit artistic și intensitate.";
    } else if (domCnt === 2) {
      domSentence = "Manifești o magie solară primitoare și echilibrată, ce aduce căldură și o intensitate vibrantă în mediul tău.";
    } else if (domCnt === 3) {
      domSentence = "Ești marcat de o fervoare deosebită ce trăiește la intensitate maximă fiecare clipă, lăsându-te condus de pasiune și rapiditate.";
    } else {
      domSentence = "Trăiești sub impulsul unei supernove interioare de creativitate arzătoare, atrăgând magnetic totul prin intensitatea ta incandescentă.";
    }
  } else if (domEl === 'pamant') {
    if (domCnt === 1) {
      domSentence = "Stabilitatea reprezintă o chemare fină în viața ta, oferindu-ți un simț discret al maturității fără a te bloca în rutine.";
    } else if (domCnt === 2) {
      domSentence = "Bucurându-te de o ancorare armonioasă în realitate, funcționezi ca un protector natural și aduci siguranță celor din jur.";
    } else if (domCnt === 3) {
      domSentence = "Ești un sanctuar solid de încredere și maturitate deplină, având o capacitate uriașă de a asigura stabilitate și mentorat.";
    } else {
      domSentence = "Forța ta de ancorare este colosală, reprezentând o fundație stabilă de protecție, înțelepciune globală și maturitate profundă.";
    }
  } else if (domEl === 'cristal') {
    if (domCnt === 1) {
      domSentence = "Căutarea clarității este o chemare subtilă în viața ta, oferindu-ți un impuls fin spre introspecție și loialitate.";
    } else if (domCnt === 2) {
      domSentence = "Integrarea clarității îți aduce o gândire structurată și precisă, punând preț pe reflexia interioară și pe loialitate.";
    } else if (domCnt === 3) {
      domSentence = "Te definește o căutare riguroasă a perfecțiunii și a esenței pure, ghidându-ți viziunea prin loialitate de neclintit.";
    } else {
      domSentence = "Structura ta psihologică este guvernată de o căutare absolută a perfecțiunii, oferindu-ți o claritate mentală uimitoare și o loialitate indestructibilă.";
    }
  }

  let secSentence = "";
  if (hasSecondary && secEl) {
    if (secEl === 'apa') {
      secSentence = "Această dinamică este completată armonios de o sensibilitate fluidă, ce îți permite să te adaptezi cu ușurință în viață.";
    } else if (secEl === 'lemn') {
      secSentence = "Această dinamică este îmbogățită de un impuls natural spre creștere și dezvoltare, asigurând o evoluție organică a aspirațiilor tale.";
    } else if (secEl === 'foc') {
      secSentence = "Această dinamică este completată de o scânteie de pasiune și căldură, stimulându-ți dorința de exprimare liberă și creativă.";
    } else if (secEl === 'pamant') {
      secSentence = "Această forță găsește un punct de echilibru prin nevoia de ancorare și protecție, oferindu-ți maturitate și stabilitate.";
    } else if (secEl === 'cristal') {
      secSentence = "Această dinamică se rafinează prin intermediul introspecției și al clarității, ghidându-te spre o ordine interioară impecabilă.";
    }
  } else {
    secSentence = "Acest profil unic îți conferă o prezență remarcabilă, definită de o armonie interioară profundă și autentică.";
  }

  return `Arhetipul tău estetic îmbină elementele într-o structură psihologică și estetică precisă. ${domSentence} ${secSentence}`;
};

export const getStyleTitle = (dominants: string[], nums: NumerologyResults, name: string = "", day: number = 1): string => {
  const clean = (str: string) => str.replace(/^[^\p{L}\p{N}]+/gu, '').trim();
  const variants = getPoeticStyleVariants(dominants);
  if (variants.length > 0) {
    let hash = day;
    const cleanName = name.trim();
    for (let i = 0; i < cleanName.length; i++) {
      hash += cleanName.charCodeAt(i);
    }
    const idx = Math.abs(hash) % variants.length;
    return clean(variants[idx]);
  }

  const counts: Record<string, number> = { apa: 0, lemn: 0, foc: 0, pamant: 0, cristal: 0 };
  Object.values(nums).forEach(n => {
    const e = numToEl(n);
    counts[e] = (counts[e] || 0) + 1;
  });

  const sortedByCount = Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .filter(([_, cnt]) => cnt > 0);

  if (sortedByCount.length === 0) return "Atelier Minimal";

  const d1 = sortedByCount[0][0];
  const t1 = ELEMENT_PSYCHOLOGY[d1 as keyof typeof ELEMENT_PSYCHOLOGY]?.title || "Stil Personal";

  if (sortedByCount.length === 1) {
    return clean(t1);
  }

  const d2 = sortedByCount[1][0];
  const t2 = ELEMENT_PSYCHOLOGY[d2 as keyof typeof ELEMENT_PSYCHOLOGY]?.title || "";

  if (sortedByCount.length === 2) {
    return clean(`${t1} & ${t2}`);
  }

  const d3 = sortedByCount[2][0];
  const t3 = ELEMENT_PSYCHOLOGY[d3 as keyof typeof ELEMENT_PSYCHOLOGY]?.title || "";
  
  return clean(`${t1}, ${t2} & ${t3}`);
};

export const getStyleName = (dominants: string[], nums: NumerologyResults, name: string = "", day: number = 1): string => {
  return getStyleTitle(dominants, nums, name, day);
};

export const getPoeticStyleVariants = (dominants: string[]): string[] => {
  const domSet = new Set(dominants);
  
  // 1. lemn, foc, apa
  if (domSet.has('lemn') && domSet.has('foc') && domSet.has('apa')) {
    return [
      "✨ Armonie Pasională",
      "✨ Esență Magnetică",
      "✨ Prosperitate Afectivă",
      "✨ Plenitudine Emoțională",
      "✨ Vitalitate Senzorială",
      "✨ Iubire Abundentă",
      "✨ Flux Magnetic",
      "✨ Abundență Sufletească"
    ];
  }
  
  // 2. cristal, lemn, pamant
  if (domSet.has('cristal') && domSet.has('lemn') && domSet.has('pamant')) {
    return [
      "🌿 Plenitudine Protectoare",
      "💎 Esență Regeneratoare",
      "✨ Nucleu Armonic",
      "🌌 Esență Tutelară",
      "🌱 Abundență Centrată",
      "💫 Echilibru Prismatic",
      "🛡️ Sanctuar Organic",
      "✨ Esență Integrată"
    ];
  }
  
  // 3. apa, foc, pamant
  if (domSet.has('apa') && domSet.has('foc') && domSet.has('pamant')) {
    return [
      "❤️🔥 Pasiune Protejată",
      "🌊 Armonie Pătimașă",
      "🛡️ Intimitate Magnetică",
      "✨ Esență Afectivă",
      "💫 Căldură Tutelară",
      "🌹 Fervoare Echilibrată",
      "🔥🌊 Flux Pasional",
      "🛡️❤️ Iubire Tutelară"
    ];
  }

  // Fallbacks for other dynamic combinations
  if (dominants.length === 1) {
    const d = dominants[0];
    if (d === 'apa') {
      return ["🌊 Fluiditate Sentimentală", "💧 Transparență Conectată", "✨ Memorie Afectivă", "🌊 Flux de Carieră"];
    } else if (d === 'lemn') {
      return ["🌿 Bunăstare Organică", "🌱 Transformare Lentă", "🍃 Ciclu Fertil", "🌳 Viață Organică"];
    } else if (d === 'foc') {
      return ["🔥 Pasiune Incandescentă", "✨ Intensitate Sacră", "❤️ Iubire Temperamentală", "⚡ Rapiditate Cosmică"];
    } else if (d === 'pamant') {
      return ["🛡️ Centru Protector", "🌍 Maturitate Globală", "🌱 Creștere Mentor", "🧱 Protecție Stabilă"];
    } else if (d === 'cristal') {
      return ["💎 Chintesență Prismatică", "✨ Perfecțiune Prismatică", "🔮 Introspecție Profundă", "🛡️ Loialitate Rece"];
    }
  }

  const primary = dominants[0] || 'pamant';
  const secondary = dominants[1] || 'lemn';

  const pairs: Record<string, string[]> = {
    "apa_foc": ["🔥🌊 Flux Pasional", "❤️ Intimitate Fluidă", "✨ Esență Afectivă", "🌊 Pasiune Sentimentală"],
    "apa_lemn": ["🌿 Bunăstare Fluidă", "🌊 Conexiune Organică", "🌱 Viață Sentimentală", "✨ Rezonanță Ciclică"],
    "apa_pamant": ["🛡️ Protecție Fluidă", "🌊 Centru Sentimental", "🌍 Maturitate Afectivă", "✨ Flux Mentor"],
    "apa_cristal": ["💎 Transparență Prismatică", "🔮 Introspecție Fluidă", "🌊 Simțire Profundă", "✨ Esență Loială"],
    "lemn_foc": ["🔥 Plenitudine Pasională", "🌿 Vitalitate Senzorială", "🌱 Transformare Rapidă", "✨ Căldură Organică"],
    "lemn_pamant": ["🛡️ Sanctuar Organic", "🌿 Abundență Centrată", "🌱 Protecție Fertilă", "🌍 Creștere Ciclică"],
    "lemn_cristal": ["💎 Esență Regeneratoare", "🌿 Echilibru Prismatic", "✨ Bunăstare Prismatică", "🔮 Transformare Reflexivă"],
    "foc_pamant": ["🛡️ Căldură Tutelară", "🔥 Pasiune Protejată", "✨ Intensitate Centrată", "🌹 Fervoare Matură"],
    "foc_cristal": ["💎 Esență Prismatică", "🔥 Pasiune Calculată", "🔮 Introspecție Incandescentă", "✨ Perfecțiune Sacră"],
    "pamant_cristal": ["🛡️ Sanctuar Prismatic", "💎 Esență Tutelară", "✨ Nucleu Armonic", "🌍 Protecție Introspectivă"]
  };

  const key1 = `${primary}_${secondary}`;
  const key2 = `${secondary}_${primary}`;
  if (pairs[key1]) return pairs[key1];
  if (pairs[key2]) return pairs[key2];

  return [
    "✨ Esență Integrată",
    "🌿 Echilibru Armonic",
    "💫 Sinergie Cosmică",
    "🛡️ Sanctuar Personal"
  ];
};

export const matchProjects = (nums: NumerologyResults): (Project & { score: number })[] => {
  const arr = Object.values(nums);
  const elC: Record<string, number> = {};
  arr.forEach(n => {
    const e = numToEl(n);
    elC[e] = (elC[e] || 0) + 1;
  });
  const dominants = getDominants(nums);
  return PROJECTS.map(p => {
    let s = arr.filter(n => p.nums.includes(n)).length;
    dominants.forEach(d => {
      if (p.elements.includes(d)) s += 3;
    });
    p.elements.forEach(e => {
      if (elC[e]) s += elC[e];
    });
    return { ...p, score: s };
  }).sort((a, b) => b.score - a.score);
};

export const storage = {
  get: async (key: string) => {
    if (typeof window !== 'undefined' && (window as any).storage?.get) {
      return await (window as any).storage.get(key);
    }
    const val = localStorage.getItem(key);
    return val ? { value: val } : null;
  },
  set: async (key: string, value: string) => {
    if (typeof window !== 'undefined' && (window as any).storage?.set) {
      return await (window as any).storage.set(key, value);
    }
    localStorage.setItem(key, value);
  }
};
