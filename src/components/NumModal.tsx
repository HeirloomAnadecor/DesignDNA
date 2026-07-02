import React from "react";
import { NumerologyResults } from "../types";
import { EL, NUM_ESSENCE } from "../data";
import { POS_INFO, NUM_STYLES } from "../data_extra";
import { numToEl, isMaster } from "../utils";

interface NumModalProps {
  modal: { key: string; n: number } | null;
  results: { nums: NumerologyResults } | null;
  onClose: () => void;
}

export const NumModal: React.FC<NumModalProps> = ({ modal, results, onClose }) => {
  if (!modal || !results) return null;
  const { key, n } = modal;
  const pos = POS_INFO[key];
  const ess = NUM_ESSENCE[n] || NUM_ESSENCE[1];
  const el = numToEl(n);
  const info = EL[el];
  
  const freq: Record<number, number> = {};
  (Object.values(results.nums) as number[]).forEach(x => {
    freq[x] = (freq[x] || 0) + 1;
  });
  const f = freq[n];
  const G = '#d4af37';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }} />
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: 'min(480px, 95vw)', height: '100vh', overflowY: 'auto', background: '#0a0a0a', borderLeft: `1px solid ${isMaster(n) ? '#FFD70044' : info.color + '44'}`, padding: '40px 32px', zIndex: 1, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '64px', fontWeight: '300', color: isMaster(n) ? '#FFD700' : info.color, lineHeight: '1', fontFamily: "'Georgia', serif", fontStyle: 'italic' }}>{n}</div>
            {isMaster(n) && <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#FFD700', marginTop: '6px', fontWeight: '500' }}>{n === 11 ? 'DIVIN' : n === 22 ? 'CONSTRUCTOR SUPREM' : 'MANIFESTARE DIVINĂ'}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '24px' }}>✕</button>
        </div>
        <div style={{ padding: '16px 18px', border: `1px solid ${info.color}33`, background: info.color + '0A', marginBottom: '20px', borderRadius: '2px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: '600' }}>POZIȚIA</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>{pos.icon}</span>
            <span style={{ fontSize: '16px', color: G, fontWeight: '500' }}>{pos.title}</span>
            {f > 1 && <span style={{ fontSize: '10px', color: info.color, padding: '2px 8px', border: `1px solid ${info.color}44`, borderRadius: '1px' }}>×{f}</span>}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: '1.6' }}>{pos.lens}</div>
        </div>
        <div style={{ padding: '16px 18px', border: '1px solid rgba(255,255,255,0.08)', background: '#121212', marginBottom: '20px', borderRadius: '2px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: '600' }}>CUM ESTE CALCULAT</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8' }}>{pos.calc}</div>
        </div>
        {NUM_STYLES[n] && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: isMaster(n) ? '#FFD70088' : 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: '600' }}>STILURI · NUMĂRUL {n}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {NUM_STYLES[n].map(s => (
                <span key={s} style={{ fontSize: '10px', padding: '4px 10px', border: `1px solid ${isMaster(n) ? '#FFD70033' : info.color + '33'}`, color: isMaster(n) ? '#FFD700' : info.color, background: isMaster(n) ? '#FFD7000A' : info.color + '08', borderRadius: '1px' }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* ESENTA — PERSONALITATE COMPLETA */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: '600' }}>ESENȚA</div>
          <div style={{ fontSize: '12px', letterSpacing: '1px', color: isMaster(n) ? '#FFD700' : info.color, marginBottom: '12px', lineHeight: '1.6', fontWeight: '500' }}>{ess.kw}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '2', fontStyle: 'italic' }}>{ess.pers}</div>
        </div>

        {/* PUNCTE FORTE */}
        {ess.strengths && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#6b9e5e', marginBottom: '10px', fontWeight: '600' }}>PUNCTE FORTE</div>
            {ess.strengths.map((s, i) => (
              <div key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'flex', gap: '8px', lineHeight: '1.6' }}>
                <span style={{ color: '#6b9e5e' }}>✓</span>{s}
              </div>
            ))}
          </div>
        )}

        {/* UMBRA */}
        {ess.shadow && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#D4542A', marginBottom: '10px', fontWeight: '600' }}>PROVOCĂRI · UMBRA</div>
            {ess.shadow.map((s, i) => (
              <div key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'flex', gap: '8px', lineHeight: '1.6' }}>
                <span style={{ color: '#D4542A' }}>⚠</span>{s}
              </div>
            ))}
          </div>
        )}

        {/* TEMA DE VIATA */}
        {ess.lifeTheme && (
          <div style={{ padding: '16px', border: `1px solid ${G}22`, background: `${G}08`, marginBottom: '20px', borderRadius: '2px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: G, marginBottom: '10px', fontWeight: '600' }}>TEMA CENTRALĂ DE VIAȚĂ</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', fontStyle: 'italic' }}>{ess.lifeTheme}</div>
          </div>
        )}

        {/* SIMBOLISM */}
        {ess.symbolism && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: '600' }}>SIMBOLISM NUMEROLOGIC</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8' }}>{ess.symbolism}</div>
          </div>
        )}

        {/* RELATII */}
        {ess.relationships && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#C8A8CC', marginBottom: '10px', fontWeight: '600' }}>ÎN RELAȚII</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', fontStyle: 'italic' }}>{ess.relationships}</div>
          </div>
        )}

        {/* CARIERA */}
        {ess.career && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#8EB8D0', marginBottom: '10px', fontWeight: '600' }}>CARIERĂ & VOCAȚIE</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>{ess.career}</div>
          </div>
        )}

        {/* LA ACEASTA POZITIE */}
        <div style={{ padding: '16px', border: `1px solid ${G}22`, background: `${G}08`, marginBottom: '20px', borderRadius: '2px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: G, marginBottom: '10px', fontWeight: '600' }}>LA POZIȚIA {pos.title.toUpperCase()}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.9', fontStyle: 'italic' }}>{pos.posLens(n)}</div>
        </div>
        <div style={{ padding: '16px', border: `1px solid ${info.color}22`, background: info.color + '06', marginBottom: '20px', borderRadius: '2px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: info.color, marginBottom: '10px', fontWeight: '600' }}>IMPLICAȚII DE DESIGN</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.9', fontStyle: 'italic' }}>{ess.design}</div>
        </div>

        {/* PALETA SPECIFICA NUMARULUI */}
        {ess.colors && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: '600' }}>PALETA SPECIFICĂ NUMĂRULUI {n}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ess.colors.map(c => (
                <span key={c} style={{ fontSize: '10px', padding: '5px 10px', border: `1px solid ${info.color}33`, color: 'rgba(255,255,255,0.7)', background: info.color + '06', borderRadius: '1px' }}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* FORME SPECIFICE */}
        {ess.forms && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: '600' }}>FORME CARACTERISTICE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ess.forms.map(f => (
                <span key={f} style={{ fontSize: '10px', padding: '5px 10px', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', borderRadius: '1px' }}>{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* MATERIALE SPECIFICE */}
        {ess.materials && (
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: '600' }}>MATERIALE RECOMANDATE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ess.materials.map(m => (
                <span key={m} style={{ fontSize: '10px', padding: '5px 10px', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', borderRadius: '1px' }}>{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
