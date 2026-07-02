import React from "react";
import { SavedProfile, NumerologyResults } from "../types";
import { EL, NUM_ESSENCE, CYCLE } from "../data";
import { isMaster, numToEl, getDominants, getElemRanking } from "../utils";

interface ProfileCompareProps {
  profileA: SavedProfile;
  profileB: SavedProfile;
  onClose: () => void;
}

const G = '#d4af37';

const POS_LABELS: Record<keyof NumerologyResults, string> = {
  drumVietii: "Drumul Vieții",
  expresie: "Expresie",
  suflet: "Suflet",
  personalit: "Personalitate",
  psihic: "Psihic",
  maturitate: "Maturitate",
  atitudine: "Atitudine",
  generatie: "Generație"
};

const cycle = ['apa', 'lemn', 'foc', 'pamant', 'cristal'];

const getElementRelation = (elA: string, elB: string, nameA: string, nameB: string) => {
  if (elA === elB) {
    const idx = cycle.indexOf(elA);
    const chargingEl = idx !== -1 ? cycle[(idx - 1 + 5) % 5] : '';
    const chargingLabel = chargingEl && EL[chargingEl] ? EL[chargingEl].label : '';
    return {
      type: 'resonance',
      score: 55,
      labelRelation: "Element identic (Fără creștere)",
      icon: "⚖️",
      desc: `Amândoi aveți același element (${EL[elA]?.label || elA}) pe această poziție. Deoarece amândoi vreți și aveți nevoie de același lucru – elementul care vă încarcă (${chargingLabel}) – creșterea energetică și susținerea reciprocă se anulează.`
    };
  }

  const idxA = cycle.indexOf(elA);
  const idxB = cycle.indexOf(elB);

  if (idxA === -1 || idxB === -1) {
    return {
      type: 'neutral',
      score: 55,
      labelRelation: "Interacțiune neutră",
      icon: "⚪",
      desc: "Interacțiune neutră din punct de vedere energetic."
    };
  }

  const diff = (idxB - idxA + 5) % 5;

  if (diff === 1) {
    // elA feeds elB (e.g. apa -> lemn)
    return {
      type: 'constructive',
      score: 85,
      labelRelation: "Canal deschis (Susținere)",
      icon: "💫",
      desc: `Relație de susținere (Ciclu Constructiv): ${nameA} (${EL[elA]?.label}) oferă energie și susține natural pe ${nameB} (${EL[elB]?.label}). Un canal de comunicare deschis și curgere fluidă.`
    };
  } else if (diff === 4) {
    // elB feeds elA (e.g. lemn <- apa)
    return {
      type: 'constructive',
      score: 85,
      labelRelation: "Canal deschis (Susținere)",
      icon: "💫",
      desc: `Relație de susținere (Ciclu Constructiv): ${nameB} (${EL[elB]?.label}) oferă energie și susține natural pe ${nameA} (${EL[elA]?.label}). Un canal de comunicare deschis și curgere fluidă.`
    };
  } else {
    // Distances 2 and 3 are opposite/frictional
    const sortedPair = [elA, elB].sort().join('-');
    let desc = "Fricțiune și dominare între elemente opuse. Cere adaptare și atenție conștientă pentru echilibrare.";
    if (sortedPair === "apa-foc") {
      desc = "Fricțiune și dominare: Apa stinge Focul, iar Focul evaporă Apa. Această opoziție generează un dinamism puternic sau atracție, dar și risc crescut de tensiune.";
    } else if (sortedPair === "apa-pamant") {
      desc = "Fricțiune și dominare: Pământul absoarbe și limitează Apa, iar Apa inundă Pământul. Este nevoie de stabilirea unor granițe clare în exprimare.";
    } else if (sortedPair === "lemn-pamant") {
      desc = "Fricțiune și dominare: Lemnul transformă Pământul în rădăcini (îl consumă pentru a crește), iar Pământul dezrădăcinează Lemnul. Cere multă răbdare reciprocă.";
    } else if (sortedPair === "cristal-lemn") {
      desc = "Fricțiune structurală: Cristalul finisează sau limitează Lemnul (aduce rigoare și ordine), dar prea mult control poate bloca libertatea și creșterea Lemnului.";
    } else if (sortedPair === "cristal-foc") {
      desc = "Fricțiune și dominare: Focul topește Cristalul (îi schimbă structura), iar Cristalul consumă energia Focului.";
    }

    return {
      type: 'friction',
      score: 45,
      labelRelation: "Fricțiune & Dominare",
      icon: "⚡",
      desc
    };
  }
};

export const ProfileCompare: React.FC<ProfileCompareProps> = ({
  profileA,
  profileB,
  onClose
}) => {
  const domA = getDominants(profileA.nums);
  const domB = getDominants(profileB.nums);

  const rankA = getElemRanking(profileA.nums);
  const rankB = getElemRanking(profileB.nums);
  const rankAMap = Object.fromEntries(rankA);
  const rankBMap = Object.fromEntries(rankB);

  // Find shared numbers across all 8 positions
  const valsA = Object.values(profileA.nums) as number[];
  const valsB = Object.values(profileB.nums) as number[];
  const sharedNumbers = Array.from(new Set(valsA.filter(n => valsB.includes(n)))).sort((a, b) => a - b);

  // Find which specific positions share the same number
  const sharedPositions: { posKey: keyof NumerologyResults; num: number }[] = [];
  (Object.keys(profileA.nums) as (keyof NumerologyResults)[]).forEach(key => {
    if (profileA.nums[key] === profileB.nums[key]) {
      sharedPositions.push({ posKey: key, num: profileA.nums[key] });
    }
  });

  // Calculate synergy/compatibility percentage based on the compatibility of numbers on the same position
  const sharedDominants = domA.filter(e => domB.includes(e));
  const posKeys = Object.keys(profileA.nums) as (keyof NumerologyResults)[];
  let totalScore = 0;
  const posRelations = posKeys.map(key => {
    const valA = profileA.nums[key];
    const valB = profileB.nums[key];
    const elA = numToEl(valA);
    const elB = numToEl(valB);
    const rel = getElementRelation(elA, elB, profileA.name, profileB.name);
    totalScore += rel.score;
    return {
      posKey: key,
      label: POS_LABELS[key],
      valA,
      valB,
      elA,
      elB,
      ...rel
    };
  });
  const percent = Math.round(totalScore / posKeys.length);

  // Generate relationship dynamic / complement analysis
  const getDynamicAnalysis = () => {
    const lines: string[] = [];

    // Shared dominants
    if (sharedDominants.length > 0) {
      const elNames = sharedDominants.map(e => EL[e]?.label).join(' & ');
      lines.push(`Rezonanță Elementară: Amândoi împărtășiți dominanta de **${elNames}**. Aceasta oferă un limbaj estetic comun, o înțelegere intuitivă a spațiului și o stare vibratorie similară în cămin.`);
    }

    // Complementarity (what A has that B is missing, and vice versa)
    const missingA = CYCLE.filter(e => !valsA.map(n => numToEl(n)).includes(e));
    const missingB = CYCLE.filter(e => !valsB.map(n => numToEl(n)).includes(e));

    const complementBtoA = domB.filter(e => missingA.includes(e));
    const complementAtoB = domA.filter(e => missingB.includes(e));

    if (complementBtoA.length > 0) {
      const elNames = complementBtoA.map(e => EL[e]?.label).join(' & ');
      lines.push(`Grijă Estetică: **${profileB.name}** aduce elementul **${elNames}** în ecuație, o energie care lipsește din harta lui ${profileA.name}. Prezența acestor elemente în decorul comun va completa ciclul personal pentru ${profileA.name}, aducând echilibru.`);
    }
    if (complementAtoB.length > 0) {
      const elNames = complementAtoB.map(e => EL[e]?.label).join(' & ');
      lines.push(`Echilibrare Reciprocă: **${profileA.name}** completează harta lui ${profileB.name} prin elementul **${elNames}**. Un design comun armonios va pune accent pe integrarea subtilă a acestor elemente complementare.`);
    }

    // Shared numbers
    if (sharedNumbers.length > 0) {
      lines.push(`Sinergie Numerologică: Conexiunea este întărită de vibrațiile comune ale numerelor **${sharedNumbers.join(', ')}**. Aceste frecvențe rezonante sugerează valori de viață aliniate și o viziune estetică convergentă.`);
    }

    if (sharedPositions.length > 0) {
      const posDetails = sharedPositions.map(sp => `${POS_LABELS[sp.posKey]} (${sp.num})`).join(', ');
      lines.push(`Aliniere de Destin: Împărtășiți exact același număr pe poziția de: **${posDetails}**. Aceasta este o rezonanță rară, care arată o sincronizare puternică în modurile în care percepeți sau acționați în lume.`);
    }

    if (lines.length === 0) {
      lines.push("Echilibru prin Diversitate: Nu aveți elemente dominante comune sau numere identice, ceea ce indică o relație extrem de complementară. Sunteți yin și yang — fiecare aduce o perspectivă complet nouă, creând un spațiu bogat în nuanțe și texturi contrastante.");
    }

    return lines;
  };

  const dynamicLines = getDynamicAnalysis();

  // Combine their active numbers to find a Combined Design Style
  const combinedNums: NumerologyResults = {
    drumVietii: Math.round((profileA.nums.drumVietii + profileB.nums.drumVietii) / 2),
    expresie: Math.round((profileA.nums.expresie + profileB.nums.expresie) / 2),
    suflet: Math.round((profileA.nums.suflet + profileB.nums.suflet) / 2),
    personalit: Math.round((profileA.nums.personalit + profileB.nums.personalit) / 2),
    psihic: Math.round((profileA.nums.psihic + profileB.nums.psihic) / 2),
    maturitate: Math.round((profileA.nums.maturitate + profileB.nums.maturitate) / 2),
    atitudine: Math.round((profileA.nums.atitudine + profileB.nums.atitudine) / 2),
    generatie: Math.round((profileA.nums.generatie + profileB.nums.generatie) / 2)
  };
  const combinedDominants = getDominants(combinedNums);

  return (
    <div style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', padding: '24px', margin: '24px 0' }} className="no-print" id="profile-split-view-container">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '4px', color: G, textTransform: 'uppercase', marginBottom: '4px' }}>SINASTRIE ȘI ARMONIE DE DESIGN</div>
          <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: '300', color: '#FFF', margin: 0, fontFamily: "Georgia, serif" }}>Comparare Profile saved (Split-View Lateral)</h3>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}
          className="hb"
          id="btn-close-profile-split"
        >
          Închide Compararea ×
        </button>
      </div>

      {/* COMPATIBILITY OVERVIEW */}
      <div style={{ background: 'rgba(212, 175, 55, 0.02)', border: '1px solid rgba(212, 175, 55, 0.08)', padding: '16px 20px', borderRadius: '3px', marginBottom: '28px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '4px' }}>SINERGIE ENERGETICĂ</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: G, fontFamily: "Georgia, serif" }}>{percent}%</div>
        </div>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ height: '100%', background: G, width: `${percent}%` }} />
          </div>
          <p style={{ fontSize: 'clamp(11.5px, 1.5vw, 13px)', color: '#AAA', margin: 0, lineHeight: '1.6' }}>
            Această analiză laterală evidențiază cum rezonează amprentele voastre numerologice și elementare. Un cămin conceput pentru amândoi va trebui să exprime un echilibru fin între aceste forțe complementare.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUMN A - PROFILE A */}
        <div className="border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: G, textTransform: 'uppercase', marginBottom: '4px' }}>PROFIL A</div>
              <h4 style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: '300', color: '#FFF', margin: 0, fontFamily: "Georgia, serif" }}>{profileA.name}</h4>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Născut(ă) pe: {profileA.day}/{profileA.month}/{profileA.year}</div>
            </div>
          </div>

          {/* DOMINANTS */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
              {domA.length === 2 ? 'Duo Elementar' : domA.length === 3 ? 'Trio Elementar' : domA.length === 1 ? 'Element Dominant' : 'Elemente Dominante'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {domA.map(e => {
                const el = EL[e];
                return (
                  <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${el?.color}11`, border: `1px solid ${el?.color}33`, padding: '5px 12px', borderRadius: '2px' }}>
                    <span style={{ fontSize: '14px' }}>{el?.icon}</span>
                    <span style={{ fontSize: '11px', color: el?.color, letterSpacing: '1px', fontWeight: '500' }}>{el?.label.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ELEMENTS RATIO CHART */}
          <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.01)', padding: '12px 14px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '9px', letterSpacing: '1px', color: '#666', textTransform: 'uppercase', marginBottom: '10px' }}>Raportul Elementelor</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CYCLE.map(e => {
                const val = rankAMap[e] || 0;
                const el = EL[e];
                const pct = Math.min(100, (val / 5) * 100);
                return (
                  <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#888', width: '60px' }}>{el?.label}</span>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: el?.color, width: `${pct}%` }} />
                    </div>
                    <span style={{ fontSize: '10px', color: el?.color, width: '24px', textAlign: 'right', fontFamily: 'monospace' }}>{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NUMEROLOGY GRID */}
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '10px' }}>Poziții Numerologice Active</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(Object.keys(profileA.nums) as (keyof NumerologyResults)[]).map(key => {
                const n = profileA.nums[key];
                const label = POS_LABELS[key];
                const isShared = profileA.nums[key] === profileB.nums[key];
                const e = numToEl(n);
                const el = EL[e];

                return (
                  <div 
                    key={key} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 12px', 
                      background: isShared ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.01)', 
                      border: isShared ? `1px solid ${G}44` : '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '2px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', color: '#EEE' }}>{label}</div>
                      <div style={{ fontSize: '9px', color: el?.color, marginTop: '2px' }}>{el?.label} {el?.icon}</div>
                    </div>
                    <div 
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '14px', 
                        fontWeight: 'bold',
                        background: isShared ? G : `${el?.color}11`,
                        color: isShared ? '#000' : (isMaster(n) ? '#FFD700' : el?.color),
                        border: isShared ? `1px solid ${G}` : `1px solid ${el?.color}33`,
                        boxShadow: isShared ? `0 0 10px ${G}33` : 'none'
                      }}
                      title={isShared ? "Număr identic în ambele profile!" : ""}
                    >
                      {n}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN B - PROFILE B */}
        <div className="md:pl-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: G, textTransform: 'uppercase', marginBottom: '4px' }}>PROFIL B</div>
              <h4 style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: '300', color: '#FFF', margin: 0, fontFamily: "Georgia, serif" }}>{profileB.name}</h4>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Născut(ă) pe: {profileB.day}/{profileB.month}/{profileB.year}</div>
            </div>
          </div>

          {/* DOMINANTS */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
              {domB.length === 2 ? 'Duo Elementar' : domB.length === 3 ? 'Trio Elementar' : domB.length === 1 ? 'Element Dominant' : 'Elemente Dominante'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {domB.map(e => {
                const el = EL[e];
                return (
                  <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${el?.color}11`, border: `1px solid ${el?.color}33`, padding: '5px 12px', borderRadius: '2px' }}>
                    <span style={{ fontSize: '14px' }}>{el?.icon}</span>
                    <span style={{ fontSize: '11px', color: el?.color, letterSpacing: '1px', fontWeight: '500' }}>{el?.label.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ELEMENTS RATIO CHART */}
          <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.01)', padding: '12px 14px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '9px', letterSpacing: '1px', color: '#666', textTransform: 'uppercase', marginBottom: '10px' }}>Raportul Elementelor</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CYCLE.map(e => {
                const val = rankBMap[e] || 0;
                const el = EL[e];
                const pct = Math.min(100, (val / 5) * 100);
                return (
                  <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#888', width: '60px' }}>{el?.label}</span>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: el?.color, width: `${pct}%` }} />
                    </div>
                    <span style={{ fontSize: '10px', color: el?.color, width: '24px', textAlign: 'right', fontFamily: 'monospace' }}>{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NUMEROLOGY GRID */}
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '10px' }}>Poziții Numerologice Active</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(Object.keys(profileB.nums) as (keyof NumerologyResults)[]).map(key => {
                const n = profileB.nums[key];
                const label = POS_LABELS[key];
                const isShared = profileA.nums[key] === profileB.nums[key];
                const e = numToEl(n);
                const el = EL[e];

                return (
                  <div 
                    key={key} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 12px', 
                      background: isShared ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.01)', 
                      border: isShared ? `1px solid ${G}44` : '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '2px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', color: '#EEE' }}>{label}</div>
                      <div style={{ fontSize: '9px', color: el?.color, marginTop: '2px' }}>{el?.label} {el?.icon}</div>
                    </div>
                    <div 
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '14px', 
                        fontWeight: 'bold',
                        background: isShared ? G : `${el?.color}11`,
                        color: isShared ? '#000' : (isMaster(n) ? '#FFD700' : el?.color),
                        border: isShared ? `1px solid ${G}` : `1px solid ${el?.color}33`,
                        boxShadow: isShared ? `0 0 10px ${G}33` : 'none'
                      }}
                      title={isShared ? "Număr identic în ambele profile!" : ""}
                    >
                      {n}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* DYNAMIC COMPLEMENT & SYNERGY DETAILS */}
      <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '3px', color: G, textTransform: 'uppercase', marginBottom: '14px' }}>DINAMICA RELAȚIEI ȘI HARMONIZAREA SPAȚIULUI</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {dynamicLines.map((line, idx) => {
            const parts = line.split('**');
            return (
              <p key={idx} style={{ fontSize: '13.5px', color: '#BBB', margin: 0, lineHeight: '1.7', background: 'rgba(255,255,255,0.01)', padding: '12px 16px', borderRadius: '3px', borderLeft: `2px solid ${idx % 2 === 0 ? G : 'rgba(255,255,255,0.2)'}` }}>
                {parts.map((pText, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: '#FFF' }}>{pText}</strong> : pText)}
              </p>
            );
          })}
        </div>
      </div>

      {/* DETAILED POSITION SYNERGY GRID */}
      <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '3px', color: G, textTransform: 'uppercase', marginBottom: '14px' }}>COMPATIBILITATE DETALIATĂ PE POZIȚII (SINERGIE ENERGETICĂ)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {posRelations.map((rel) => {
            const elAData = EL[rel.elA];
            const elBData = EL[rel.elB];
            
            let badgeBg = 'rgba(255, 255, 255, 0.05)';
            let badgeColor = '#AAA';
            if (rel.type === 'resonance') {
              badgeBg = 'rgba(255, 255, 255, 0.08)';
              badgeColor = '#BBB';
            } else if (rel.type === 'constructive') {
              badgeBg = 'rgba(46, 139, 87, 0.12)';
              badgeColor = '#4ADE80';
            } else if (rel.type === 'friction') {
              badgeBg = 'rgba(220, 38, 38, 0.08)';
              badgeColor = '#FCA5A5';
            }

            return (
              <div 
                key={rel.posKey} 
                style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid rgba(255,255,255,0.04)', 
                  borderRadius: '4px', 
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontWeight: '500', color: '#FFF', fontSize: '14px', fontFamily: "Georgia, serif" }}>{rel.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', background: badgeBg, color: badgeColor, padding: '4px 10px', borderRadius: '3px', letterSpacing: '1px' }}>
                    <span>{rel.icon}</span>
                    <span style={{ fontWeight: '600' }}>{rel.labelRelation.toUpperCase()}</span>
                    <span>({rel.score}%)</span>
                  </div>
                </div>

                {/* Profiles detail row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <span style={{ color: '#888' }}>{profileA.name}:</span>
                    <strong style={{ color: elAData?.color, background: `${elAData?.color}11`, padding: '2px 6px', borderRadius: '3px', fontSize: '11px' }}>
                      {rel.valA} {elAData?.icon} {elAData?.label}
                    </strong>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.1)' }}>|</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px' }}>
                    <span style={{ color: '#888' }}>{profileB.name}:</span>
                    <strong style={{ color: elBData?.color, background: `${elBData?.color}11`, padding: '2px 6px', borderRadius: '3px', fontSize: '11px' }}>
                      {rel.valB} {elBData?.icon} {elBData?.label}
                    </strong>
                  </div>
                </div>

                {/* Description of interaction */}
                <p style={{ fontSize: 'clamp(11.5px, 1.5vw, 13px)', color: '#AAA', margin: 0, lineHeight: '1.6' }}>
                  {rel.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMBINED DESIGN SYSTEM RECOMMENDATION */}
      <div style={{ marginTop: '24px', background: 'rgba(212, 175, 55, 0.03)', border: `1px solid ${G}33`, padding: '20px', borderRadius: '3px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '3px', color: G, textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>RECOMANDARE DE DESIGN PENTRU SPAȚIU COMUN (CĂMIN / BIROU)</div>
        <div style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#FFF', fontWeight: '400', marginBottom: '10px', fontFamily: "Georgia, serif" }}>
          Sinergia voastră de stil: <span style={{ color: G }}>{combinedDominants.map(e => EL[e]?.label).join(' & ')}</span>
        </div>
        <p style={{ fontSize: 'clamp(11.5px, 1.6vw, 13px)', color: '#AAA', lineHeight: '1.7', margin: 0 }}>
          Dacă doriți să proiectați un living, un dormitor sau un spațiu de lucru comun, ideal este să îmbinați elementele predominante ale amândurora. 
          Vă recomandăm să folosiți culori care fac tranziția între paletele voastre de culori favorite. De exemplu, 
          {profileA.name} rezonează cu {domA.map(e => EL[e]?.label).join('/')}, iar {profileB.name} aduce un plus de {domB.map(e => EL[e]?.label).join('/')}. 
          Prin urmare, o paletă neutră caldă sau tonuri rafinate de pământ cu accente subtile din elementele voastre vor crea o estetică unitară care hrănește spiritul ambilor parteneri.
        </p>
      </div>
    </div>
  );
};
