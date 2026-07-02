import React from "react";
import { NumerologyResults } from "../types";
import { EL, NUM_ESSENCE } from "../data";
import { NUM_COLORS, NUM_STYLES, EL_FORMS, STYLE_TAG } from "../data_extra";
import { getSortedNums, numToEl } from "../utils";
import { ShapeIcon } from "./ShapeIcon";

interface MoodBoardProps {
  nums: NumerologyResults;
  dominants: string[];
  styleName: string;
  styleDesc?: string;
}

export const MoodBoard: React.FC<MoodBoardProps> = ({ nums, dominants, styleName, styleDesc }) => {
  const sorted = getSortedNums(nums);
  const lpNum = nums.drumVietii;
  const soulNum = nums.suflet;

  // Key profile numbers: most frequent in each dominant element + Life Path + Soul Urge
  const domTopNums = dominants.map(d => {
    const cand = sorted
      .filter(m => numToEl(nums[m.key as keyof NumerologyResults]) === d)
      .map(m => nums[m.key as keyof NumerologyResults]);
    return cand[0];
  });
  const keyNums = [...new Set([...domTopNums, lpNum, soulNum])];
  const keyElements = [...new Set(keyNums.map(n => numToEl(n)))];

  // For the color palette, we strictly use the dominant key numbers to represent only the dominant elements.
  const paletteKeyNums = [...new Set(domTopNums)].filter((n): n is number => n !== undefined);

  // Hybrid style name — combines tags of the most relevant key numbers
  const fusionTags = [...new Set(keyNums.map(n => STYLE_TAG[n]))].slice(0, 3);
  const fusionLabel = fusionTags.join(' · ');

  // Unified palette — mix from ONLY dominant key numbers, interleaved
  const buckets = paletteKeyNums.map(n => {
    const cols: { c: string; name: string; el: string; num: number }[] = [];
    const seen = new Set<string>();
    (NUM_COLORS[n] || []).forEach(({ c, n: nm }) => {
      if (!seen.has(c)) {
        seen.add(c);
        cols.push({ c, name: nm, el: numToEl(n), num: n });
      }
    });
    return cols;
  });
  const maxLen = Math.max(...buckets.map(b => b.length), 0);
  const palette: { c: string; name: string; el: string; num: number }[] = [];
  const seenC = new Set<string>();
  for (let i = 0; i < maxLen && palette.length < 11; i++) {
    buckets.forEach(b => {
      if (b[i] && !seenC.has(b[i].c) && palette.length < 11) {
        seenC.add(b[i].c);
        palette.push(b[i]);
      }
    });
  }

  // Styles — mix from key numbers, dominant first
  const styles: string[] = [];
  keyNums.forEach(n =>
    (NUM_STYLES[n] || []).slice(0, 2).forEach(s => {
      if (!styles.includes(s) && styles.length < 7) styles.push(s);
    })
  );

  // Forms & textures — united from all key elements
  const forms: string[] = [];
  const textures: string[] = [];
  keyElements.forEach(el => {
    EL_FORMS[el].forms.forEach(f => {
      if (!forms.includes(f)) forms.push(f);
    });
    EL_FORMS[el].textures.forEach(t => {
      if (!textures.includes(t)) textures.push(t);
    });
  });

  const mainColor = EL[dominants[0]]?.color || "#d4af37";

  return (
    <div style={{ border: `1px solid rgba(255,255,255,0.08)`, background: '#121212', padding: '28px', marginBottom: '24px', borderRadius: '4px' }}>
      <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '9px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>MOODBOARD · PROFILUL TĂU VIZUAL</div>
        <div style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: '#ffffff', fontWeight: '300', letterSpacing: '2px', fontStyle: 'italic', marginBottom: '8px' }}>{styleName}</div>
        {styleDesc && (
          <div style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '1px', marginBottom: '14px', lineHeight: '1.4' }}>
            {styleDesc}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>STIL HIBRID:</span>
          <span style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', letterSpacing: '1px', color: mainColor, fontWeight: 'bold' }}>{fusionLabel}</span>
          <div style={{ display: 'flex', gap: '3px', marginLeft: '4px' }}>
            {keyElements.map(e => (
              <span key={e} style={{ fontSize: '13px' }}>{EL[e].icon}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CROMATICĂ — mix unificat */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>CROMATICĂ · MIX DIN PROFIL</div>
        <div style={{ display: 'flex', gap: '2px', marginBottom: '10px', height: '3px' }}>
          {dominants.map(el => (
            <div key={el} style={{ flex: 1, background: EL[el].color, opacity: 0.85 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {palette.map(({ c, name, el }, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: c, border: `2px solid ${EL[el].color}55` }} />
              <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', width: '48px', textAlign: 'center', lineHeight: '1.2' }}>{name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          {dominants.map(el => (
            <div key={el} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', background: EL[el].color, borderRadius: '50%' }} />
              <span style={{ fontSize: '8px', color: EL[el].color, letterSpacing: '1px' }}>{EL[el].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STILURI / FORME / TEXTURI — toate unificate din profil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>STILURI DIN PROFIL</div>
          {styles.map(s => (
            <div key={s} style={{ fontSize: '11px', padding: '6px 10px', border: `1px solid ${mainColor}33`, color: mainColor, background: mainColor + '08', marginBottom: '6px' }}>{s}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>FORME DIN PROFIL</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {keyElements.map(el => (
              <ShapeIcon key={el} shape={EL_FORMS[el].shape} color={EL[el].color} size={38} />
            ))}
          </div>
          {forms.slice(0, 5).map(f => (
            <div key={f} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <span style={{ color: mainColor }}>—</span>{f}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>TEXTURI & MATERIALE</div>
          {textures.slice(0, 6).map(t => (
            <div key={t} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
              <span style={{ color: mainColor, fontSize: '8px' }}>◆</span>{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
