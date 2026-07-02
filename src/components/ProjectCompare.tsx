import React from "react";
import { Project, NumerologyResults } from "../types";
import { EL } from "../data";
import { ProjectBanner } from "./ProjectBanner";

interface ProjectCompareProps {
  projectA: Project;
  projectB: Project;
  userDominants: string[];
  userNums: NumerologyResults;
  onClose: () => void;
}

const COLOR_MAP: Record<string, string> = {
  'Alb': '#FFFFFF',
  'Crem': '#FFFDD0',
  'Bej': '#F5F5DC',
  'Gri perlat': '#EAE6DF',
  'Catifea': '#4A3B32',
  'Caramel': '#C68E17',
  'Bronz': '#CD7F32',
  'Auriu cald': '#D4AF37',
  'Auriu': '#FFD700',
  'Ivory': '#FFFFF0',
  'Piatră': '#8A7F75',
  'Neutru': '#D3D3D3',
  'Verde vegetal': '#2E8B57',
  'Bej organic': '#E5D3B3',
  'Lut': '#B5651D',
  'Gri mineral': '#708090',
  'Albastru palid': '#ADD8E6',
  'Linen': '#FAF0E6',
  'Beton aparent': '#A9A9A9',
  'Lemn cald': '#DEB887',
  'Negru mat': '#1A1A1A',
  'Ruginit': '#8B4513',
  'Albastru celest': '#4682B4',
  'Argintiu': '#C0C0C0',
  'Natural': '#E0D6C8',
  'Monocromatic': '#444444',
  'In': '#EAE6DF',
  'Lemn masiv': '#8B5A2B',
  'Albastru marin': '#000080',
  'Auriu subtil': '#E5C158',
  'Gri perle': '#DCDCDC',
  'Beton': '#808080',
  'Negru': '#000000',
  'Paletă unitară': '#555555',
  'Verde': '#2E8B57',
  'Miere': '#EBA937',
  'Ocru': '#CC7722',
  'Azur': '#007FFF',
  'Transparent': '#EAEAEA',
  'Gri pal': '#D3D3D3'
};

const G = '#d4af37';

export const ProjectCompare: React.FC<ProjectCompareProps> = ({
  projectA,
  projectB,
  userDominants,
  userNums,
  onClose
}) => {
  // Helper to calculate a compatibility score %
  const getCompatibilityInfo = (p: Project) => {
    const userNumValues = Object.values(userNums);
    const matchedNums = p.nums.filter(n => userNumValues.includes(n));
    const matchedElements = p.elements.filter(e => userDominants.includes(e));
    
    // Formula for score: Base 50% + 15% per matching element + 10% per matching number (capped at 100%)
    let percent = 50 + (matchedElements.length * 15) + (matchedNums.length * 10);
    if (percent > 100) percent = 100;
    
    // Determine the synergy message
    let message = "";
    if (matchedElements.length > 0 && matchedNums.length > 0) {
      message = `Sinergie excelentă: rezonează puternic prin elementul ${matchedElements.map(e => EL[e]?.label).join(' & ')} și vibrația numărului ${matchedNums.join(', ')}.`;
    } else if (matchedElements.length > 0) {
      message = `Rezonanță elementară: se aliniază ideal cu dominanta ta de ${matchedElements.map(e => EL[e]?.label).join(' & ')}.`;
    } else if (matchedNums.length > 0) {
      message = `Compatibilitate numerologică: rezonează cu frecvențele tale active, în special cu numărul ${matchedNums.join(', ')}.`;
    } else {
      message = `Echilibru complementar: aduce elemente proaspete (${p.elements.map(e => EL[e]?.label).join(' & ')}) necesare pentru a-ți completa ciclul personal.`;
    }

    return { percent, message };
  };

  const compA = getCompatibilityInfo(projectA);
  const compB = getCompatibilityInfo(projectB);

  return (
    <div style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', padding: '24px', margin: '24px 0' }} className="no-print" id="split-view-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '4px', color: G, textTransform: 'uppercase', marginBottom: '4px' }}>ANALIZĂ COMPARATIVĂ</div>
          <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: '300', color: '#FFF', margin: 0, fontFamily: "Georgia, serif" }}>Format Split-View (Lateral)</h3>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}
          className="hb"
          id="btn-close-split"
        >
          Închide Compararea ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUMN A */}
        <div className="border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '2px', marginBottom: '16px' }}>
            <ProjectBanner project={projectA} height={160} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#000', color: G, fontSize: '9px', letterSpacing: '2px', padding: '3px 8px', border: `1px solid ${G}33` }}>
              PROIECT A
            </div>
          </div>

          <h4 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '300', color: '#FFF', margin: '0 0 6px 0', fontFamily: "Georgia, serif" }}>{projectA.name}</h4>
          <div style={{ fontSize: '10px', letterSpacing: '3px', color: G, textTransform: 'uppercase', marginBottom: '16px' }}>{projectA.style}</div>

          {/* COMPATIBILITY SCORE */}
          <div style={{ background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.1)', padding: '12px 16px', borderRadius: '2px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>POTRIVIRE DESIGN DNA</span>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: G }}>{compA.percent}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', background: G, width: `${compA.percent}%` }} />
            </div>
            <p style={{ fontSize: 'clamp(11px, 1.5vw, 12px)', color: '#AAA', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>{compA.message}</p>
          </div>

          {/* DETAILS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '4px' }}>Tipologie & Spațiu</div>
              <div style={{ fontSize: '13px', color: '#DDD' }}>{projectA.type}</div>
            </div>

            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '6px' }}>Elemente Primordiale</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {projectA.elements.map(e => {
                  const el = EL[e];
                  return (
                    <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${el?.color}11`, border: `1px solid ${el?.color}33`, padding: '4px 10px', borderRadius: '1px' }}>
                      <span style={{ fontSize: '14px' }}>{el?.icon}</span>
                      <span style={{ fontSize: '11px', color: el?.color, letterSpacing: '1px' }}>{el?.label.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '6px' }}>Cromatică & Paletă</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {projectA.cromatics.map(c => (
                  <span key={c} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 8px', color: '#BBB' }}>
                    {c}
                  </span>
                ))}
              </div>
              {/* Live Color Swatches */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {projectA.cromatics.map(c => {
                  const hex = COLOR_MAP[c] || '#888888';
                  return (
                    <div 
                      key={c} 
                      style={{ width: '24px', height: '24px', background: hex, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px' }} 
                      title={c}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '4px' }}>Numere Rezonante</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {projectA.nums.map(n => {
                  const isUserActive = Object.values(userNums).includes(n);
                  return (
                    <div 
                      key={n} 
                      style={{ 
                        width: '28px', 
                        height: '28px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderRadius: '50%', 
                        fontSize: '11px', 
                        fontWeight: 'bold',
                        background: isUserActive ? G : 'rgba(255,255,255,0.05)',
                        color: isUserActive ? '#000' : '#FFF',
                        border: isUserActive ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.1)'
                      }}
                      title={isUserActive ? "Număr prezent în harta ta" : "Număr rezonant proiect"}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '6px' }}>Descriere & Atmosferă</div>
              <p style={{ fontSize: 'clamp(12px, 1.6vw, 13px)', color: '#AAA', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>{projectA.desc}</p>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <a 
              href={projectA.url} 
              target="_blank" 
              rel="noreferrer" 
              style={{ display: 'inline-block', fontSize: '11px', letterSpacing: '2px', color: G, textDecoration: 'none', borderBottom: `1px solid ${G}33`, paddingBottom: '2px' }}
              className="hb"
            >
              EXPLOREAZĂ PORTOFOLIU complet A →
            </a>
          </div>
        </div>

        {/* COLUMN B */}
        <div className="md:pl-2">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '2px', marginBottom: '16px' }}>
            <ProjectBanner project={projectB} height={160} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#000', color: G, fontSize: '9px', letterSpacing: '2px', padding: '3px 8px', border: `1px solid ${G}33` }}>
              PROIECT B
            </div>
          </div>

          <h4 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '300', color: '#FFF', margin: '0 0 6px 0', fontFamily: "Georgia, serif" }}>{projectB.name}</h4>
          <div style={{ fontSize: '10px', letterSpacing: '3px', color: G, textTransform: 'uppercase', marginBottom: '16px' }}>{projectB.style}</div>

          {/* COMPATIBILITY SCORE */}
          <div style={{ background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.1)', padding: '12px 16px', borderRadius: '2px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>POTRIVIRE DESIGN DNA</span>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: G }}>{compB.percent}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', background: G, width: `${compB.percent}%` }} />
            </div>
            <p style={{ fontSize: 'clamp(11px, 1.5vw, 12px)', color: '#AAA', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>{compB.message}</p>
          </div>

          {/* DETAILS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '4px' }}>Tipologie & Spațiu</div>
              <div style={{ fontSize: '13px', color: '#DDD' }}>{projectB.type}</div>
            </div>

            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '6px' }}>Elemente Primordiale</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {projectB.elements.map(e => {
                  const el = EL[e];
                  return (
                    <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${el?.color}11`, border: `1px solid ${el?.color}33`, padding: '4px 10px', borderRadius: '1px' }}>
                      <span style={{ fontSize: '14px' }}>{el?.icon}</span>
                      <span style={{ fontSize: '11px', color: el?.color, letterSpacing: '1px' }}>{el?.label.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '6px' }}>Cromatică & Paletă</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {projectB.cromatics.map(c => (
                  <span key={c} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 8px', color: '#BBB' }}>
                    {c}
                  </span>
                ))}
              </div>
              {/* Live Color Swatches */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {projectB.cromatics.map(c => {
                  const hex = COLOR_MAP[c] || '#888888';
                  return (
                    <div 
                      key={c} 
                      style={{ width: '24px', height: '24px', background: hex, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px' }} 
                      title={c}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '4px' }}>Numere Rezonante</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {projectB.nums.map(n => {
                  const isUserActive = Object.values(userNums).includes(n);
                  return (
                    <div 
                      key={n} 
                      style={{ 
                        width: '28px', 
                        height: '28px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderRadius: '50%', 
                        fontSize: '11px', 
                        fontWeight: 'bold',
                        background: isUserActive ? G : 'rgba(255,255,255,0.05)',
                        color: isUserActive ? '#000' : '#FFF',
                        border: isUserActive ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.1)'
                      }}
                      title={isUserActive ? "Număr prezent în harta ta" : "Număr rezonant proiect"}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '6px' }}>Descriere & Atmosferă</div>
              <p style={{ fontSize: 'clamp(12px, 1.6vw, 13px)', color: '#AAA', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>{projectB.desc}</p>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <a 
              href={projectB.url} 
              target="_blank" 
              rel="noreferrer" 
              style={{ display: 'inline-block', fontSize: '11px', letterSpacing: '2px', color: G, textDecoration: 'none', borderBottom: `1px solid ${G}33`, paddingBottom: '2px' }}
              className="hb"
            >
              EXPLOREAZĂ PORTOFOLIU complet B →
            </a>
          </div>
        </div>

      </div>

      {/* COMBINED COMPARISON SUMMARY */}
      <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '2px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '3px', color: G, textTransform: 'uppercase', marginBottom: '8px' }}>SINERGIE ȘI ATRIBUTE COMPLEMENTARE</div>
        <p style={{ fontSize: 'clamp(12px, 1.6vw, 14px)', color: '#AAA', margin: 0, lineHeight: '1.7' }}>
          În timp ce <strong>{projectA.name}</strong> pune accent pe un design ghidat de elementul {projectA.elements.map(e => EL[e]?.label).join(' & ')} ({projectA.style}), 
          <strong> {projectB.name}</strong> explorează nuanțele elementului {projectB.elements.map(e => EL[e]?.label).join(' & ')} ({projectB.style}). 
          Alegerea între cele două depinde de starea pe care vrei să o cultivi în căminul tău: vibrația {projectA.cromatics.join(', ')} a primului aduce stabilitate și focus, 
          în timp ce paleta {projectB.cromatics.join(', ')} a celui de-al doilea deschide spațiul către contemplație și fluiditate emoțională.
        </p>
      </div>
    </div>
  );
};
