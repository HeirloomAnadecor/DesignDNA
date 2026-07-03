import React, { useState, useEffect, useRef } from "react";
import { NumerologyResults, SavedProfile } from "./types";
import { EL, NUM_ESSENCE, CYCLE, CYCLE_VERB, CYCLE_DESIGN } from "./data";
import { NUM_COLORS, NUM_STYLES, MISSING_EL_DESC, STYLE_TAG, POS_INFO, EL_FORMS } from "./data_extra";
import {
  calcNumerology,
  getSortedNums,
  getElemRanking,
  getDominants,
  getMissingElements,
  getStyleName,
  getStyleTitle,
  getStyleDescription,
  getPoeticStyleVariants,
  matchProjects,
  numToEl,
  isMaster,
  storage
} from "./utils";

// Component imports
import { ShapeIcon } from "./components/ShapeIcon";
import { ProjectBanner } from "./components/ProjectBanner";
import { MoodBoard } from "./components/MoodBoard";
import { NumModal } from "./components/NumModal";
import { ProjectCompare } from "./components/ProjectCompare";
import { ProfileCompare } from "./components/ProfileCompare";

const G = '#d4af37';
const S = {
  app: { minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5', fontFamily: "'Georgia', serif", lineHeight: '1.6' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  btn: { background: '#a38049', color: '#ffffff', border: 'none', padding: '12px 28px', cursor: 'pointer', fontFamily: "'Times New Roman', Times, serif", fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, fontWeight: 'bold', borderRadius: '1px' },
  btnO: { background: 'transparent', color: '#ffffff', border: `1px solid rgba(255,255,255,0.2)`, padding: '11px 24px', cursor: 'pointer', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '1px' },
  btnG: { background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '11px 24px', cursor: 'pointer', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '1px' },
  inp: { background: '#121212', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '14px 18px', fontSize: '15px', fontFamily: "'Georgia', serif", width: '100%', outline: 'none', boxSizing: 'border-box' as const },
  card: { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', padding: '32px 28px', borderRadius: '4px' },
};

export default function App() {
  const [page, setPage] = useState('home');
  const [form, setForm] = useState({ name: '', day: '', month: '', year: '' });
  const [results, setResults] = useState<{
    name: string;
    day: number;
    month: number;
    year: number;
    nums: NumerologyResults;
    matched: any[];
    elemRanking: [string, number][];
  } | null>(null);
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genTime, setGenTime] = useState(0);
  const [docText, setDocText] = useState('');
  const [showDoc, setShowDoc] = useState(false);
  const [err, setErr] = useState('');
  const [modal, setModal] = useState<{ key: string; n: number } | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);
  const [compareProfileNames, setCompareProfileNames] = useState<string[]>([]);
  const [showProfileCompareView, setShowProfileCompareView] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (showCompareView) {
      setTimeout(() => {
        const el = document.getElementById("split-view-container");
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showCompareView]);

  const loadProfiles = async () => {
    try {
      const r = await storage.get('ddna_v5');
      if (r) {
        setProfiles(JSON.parse(r.value));
      }
    } catch (e) {
      console.error("Failed to load profiles:", e);
    }
  };

  const saveProfile = async (p: any) => {
    const newProfile: SavedProfile = {
      name: p.name,
      day: p.day,
      month: p.month,
      year: p.year,
      nums: p.nums,
      savedAt: new Date().toISOString()
    };
    const up = [newProfile, ...profiles.filter(x => x.name !== p.name)];
    setProfiles(up);
    try {
      await storage.set('ddna_v5', JSON.stringify(up));
    } catch (e) {
      console.error("Failed to save profile:", e);
    }
  };

  const deleteProfile = async (name: string) => {
    const up = profiles.filter(p => p.name !== name);
    setProfiles(up);
    try {
      await storage.set('ddna_v5', JSON.stringify(up));
    } catch (e) {
      console.error("Failed to delete profile:", e);
    }
  };

  const calculate = () => {
    setErr('');
    const { name, day, month, year } = form;
    if (!name.trim()) return setErr('Introdu numele complet.');
    if (!day || !month || !year || Number(day) < 1 || Number(day) > 31 || Number(month) < 1 || Number(month) > 12 || Number(year) < 1900) {
      return setErr('Verifică data nașterii.');
    }
    const nums = calcNumerology(name, Number(day), Number(month), Number(year));
    const matched = matchProjects(nums);
    const elemRanking = getElemRanking(nums);
    setResults({ name: name.trim(), day: Number(day), month: Number(month), year: Number(year), nums, matched, elemRanking });
    setDocText('');
    setShowDoc(false);
    setPage('results');
  };

  const startTimer = () => {
    setGenTime(0);
    timerRef.current = setInterval(() => setGenTime(t => t + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const generateDoc = async () => {
    if (!results || generating) return;
    setGenerating(true);
    startTimer();
    const { name, day, month, year, nums, elemRanking, matched } = results;
    const dominants = getDominants(nums);
    const isDuo = dominants.length > 1;
    const domEl = EL[dominants[0]];
    const styleTitle = getStyleTitle(dominants, nums, name, day);
    const styleDesc = getStyleDescription(dominants, nums);
    const domGroup = dominants.map(d => EL[d].label).join(' + ');
    const missingEls = getMissingElements(nums);
    const top3 = matched.slice(0, 3).map(p => p.name).join(', ');
    const freq: Record<number, number> = {};
    (Object.values(nums) as number[]).forEach(n => { freq[n] = (freq[n] || 0) + 1; });
    const sorted = getSortedNums(nums);
    const numList = sorted.map(m => {
      const n = nums[m.key as keyof NumerologyResults];
      const pos = POS_INFO[m.key];
      const ess = NUM_ESSENCE[n] || NUM_ESSENCE[1];
      const f = freq[n];
      return `${pos.title} ${n}${isMaster(n) ? ' (MASTER)' : ''}${f > 1 ? ` (×${f})` : ''}:\n  Esența: ${ess.kw}\n  Personalitate: ${ess.pers}\n  Puncte forte: ${ess.strengths.slice(0, 4).join(', ')}\n  Provocări: ${ess.shadow.slice(0, 3).join(', ')}\n  Temă de viață: ${ess.lifeTheme}\n  Carieră: ${ess.career}\n  La această poziție: ${pos.posLens(n)}\n  Design: ${ess.design}\n  Culori: ${ess.colors.join(', ')}`;
    }).join('\n\n');
    const missingInfo = missingEls.length > 0 ? `\nELEMENTE ABSENTE — CE CAUTĂ: ${missingEls.map(el => `${EL[el].label} (${MISSING_EL_DESC[el].need})`).join('; ')}` : '';
    const lpEl = numToEl(nums.drumVietii);
    const soulEl = numToEl(nums.suflet);
    const keyNumsNote = (!dominants.includes(lpEl) || !dominants.includes(soulEl)) ? `\nNOTĂ IMPORTANTĂ: Drumul Vieții (${nums.drumVietii} → ${EL[lpEl].label}) ${!dominants.includes(lpEl) ? 'NU coincide cu elementul dominant — menționează această tensiune/nuanță în text' : 'coincide cu dominantul'}. Dorința Sufletului (${nums.suflet} → ${EL[soulEl].label}) ${!dominants.includes(soulEl) ? 'NU coincide cu elementul dominant — menționează această dorință interioară distinctă în text' : 'coincide cu dominantul'}.` : '';

    const prompt = `Ești consultant de design interior de lux și expert în numerologie. Creează un raport personalizat și poetic în română pentru ${name} (${day}/${month}/${year}).

STILUL PERSONALIZAT: "${styleTitle}" (${styleDesc})
${isDuo ? `GRUP DOMINANT: ${domGroup} — forță egală, definesc împreună profilul.` : `ELEMENT DOMINANT: ${domEl.label}`}
Distribuție: ${elemRanking.map(([e, c]) => `${EL[e].label}×${c}`).join(', ')}
${missingInfo}${keyNumsNote}
Proiecte Anadecor: ${top3}

HARTA NUMEROLOGICĂ:
${numList}

Scrie 5 paragrafe poetice, separate prin linie goală, fără titluri:
1. Profilul "${styleTitle}" (${styleDesc}) — personalitatea de design pornind de la ${isDuo ? `grupul ${domGroup} ca entitate unificată` : `elementul ${domEl.label}`}.
2. Limbajul spațiului — forme, volume, lumina naturală.
3. Cromatică și materiale — paleta exactă cu influența numerelor secundare.
4. Cele 4 exemple de spații (living, dormitor, bucătărie, birou) întruchipând stilul "${styleTitle}" (${styleDesc}) — câte 2-3 rânduri poetice fiecare.
5. ${missingEls.length > 0 ? `Mesaj despre elementele absente (${missingEls.map(e => EL[e].label).join(', ')}) pe care le caută pentru a completa ciclul, și cum să le integreze în spațiu.` : `Mesaj inspirațional final adresat direct lui ${name} despre cum spațiul devine extensia sinelui.`}

Ton: premium, poetic, cald, adresat cu "tu".`;

   try {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Eroare la generare');
  }

  setDocText(data.text);
  setShowDoc(true);

} catch (e: any) {
  console.error("Generation failed:", e);

  setDocText(
    `Generarea nu a reușit: ${
      e.message || 'Eroare la apelul către server'
    }. Încearcă din nou.`
  );

  setShowDoc(true);
}

stopTimer();
setGenerating(false);
  };

  const downloadPDF = () => {
    if (!results || !docText) return;
    const { name, day, month, year, nums, matched } = results;
    const dominants = getDominants(nums);
    const sTitle = getStyleTitle(dominants, nums, name, day);
    const sDesc = getStyleDescription(dominants, nums);
    const missingEls = getMissingElements(nums);
    const freq: Record<number, number> = {};
    (Object.values(nums) as number[]).forEach(n => { freq[n] = (freq[n] || 0) + 1; });
    const sorted = getSortedNums(nums);
    const topNums = [...new Set(sorted.map(m => nums[m.key as keyof NumerologyResults]))].slice(0, 4);
    const palette: { c: string; name: string }[] = [];
    const seenC = new Set<string>();
    topNums.forEach(n => {
      (NUM_COLORS[n] || []).forEach(({ c, n: nm }) => {
        if (!seenC.has(c) && palette.length < 9) {
          seenC.add(c);
          palette.push({ c, name: nm });
        }
      });
    });
    const styles: string[] = [];
    topNums.slice(0, 3).forEach(n => {
      (NUM_STYLES[n] || []).slice(0, 2).forEach(s => {
        if (!styles.includes(s) && styles.length < 5) styles.push(s);
      });
    });
    const elGroups: Record<string, any[]> = {};
    sorted.forEach(m => {
      const n = nums[m.key as keyof NumerologyResults];
      const el = numToEl(n);
      if (!elGroups[el]) elGroups[el] = [];
      elGroups[el].push({ ...m, n });
    });

    const hartaHTML = CYCLE.filter(el => elGroups[el]).map(el => {
      const info = EL[el];
      return `<div style="margin-bottom:16px;"><div style="font-size:11px;letter-spacing:2px;color:${info.color};margin-bottom:8px;">${info.icon} ${info.label.toUpperCase()}</div>${elGroups[el].map(({ key, n }) => {
        const pos = POS_INFO[key];
        const f = freq[n];
        const ess = NUM_ESSENCE[n] || NUM_ESSENCE[1];
        return `<div style="padding:10px 12px;margin:6px 0 6px 16px;border-left:3px solid ${info.color}44;background:${info.color}08;">
          <div style="display:flex;gap:10px;margin-bottom:6px;">
            <div style="font-size:20px;font-weight:300;color:${info.color};min-width:28px;">${n}${f > 1 ? `<span style="font-size:8px;display:block">×${f}</span>` : ''}</div>
            <div>
              <div style="font-size:11px;color:#555;margin-bottom:2px;">${pos.title}${isMaster(n) ? ' (MASTER)' : ''}</div>
              <div style="font-size:9px;color:${info.color};letter-spacing:1px;margin-bottom:3px;">${ess.kw}</div>
              <div style="font-size:10px;color:#777;font-style:italic;line-height:1.5;">${pos.posLens(n)}</div>
            </div>
          </div>
          <div style="font-size:10px;color:#888;line-height:1.7;margin-bottom:6px;">${ess.pers}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px;">
            <div><div style="font-size:8px;letter-spacing:1px;color:#6B9E5E;margin-bottom:3px;">PUNCTE FORTE</div>${ess.strengths.slice(0, 3).map(s => `<div style="font-size:9px;color:#777;">✓ ${s}</div>`).join('')}</div>
            <div><div style="font-size:8px;letter-spacing:1px;color:#D4542A;margin-bottom:3px;">DE ECHILIBRAT</div>${ess.shadow.slice(0, 2).map(s => `<div style="font-size:9px;color:#777;">⚠ ${s}</div>`).join('')}</div>
          </div>
          <div style="font-size:9px;color:#9A7030;font-style:italic;border-left:2px solid #C8A96E55;padding-left:8px;margin-bottom:6px;"><b>Temă de viață:</b> ${ess.lifeTheme}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><div style="font-size:8px;letter-spacing:1px;color:#8EB8D0;margin-bottom:3px;">CARIERĂ</div><div style="font-size:9px;color:#777;">${ess.career}</div></div>
            <div><div style="font-size:8px;letter-spacing:1px;color:#888;margin-bottom:3px;">PALETĂ SPECIFICĂ</div>${ess.colors.slice(0, 4).map(c => `<span style="font-size:8px;padding:2px 6px;border:1px solid #ddd;margin-right:3px;color:#777;">${c}</span>`).join('')}</div>
          </div>
        </div>`;
      }).join('')}</div>`;
    }).join('');

    const paletteHTML = `<div style="display:flex;gap:4px;flex-wrap:wrap;margin:8px 0;">${palette.map(({ c, name }) => `<div style="text-align:center;"><div style="width:44px;height:44px;background:${c};border:1px solid #ddd;"></div><div style="font-size:7px;color:#888;width:44px;text-align:center;margin-top:2px;line-height:1.2;">${name}</div></div>`).join('')}</div>`;

    const missingHTML = missingEls.length > 0 ? `<div style="margin:20px 0;padding-top:16px;border-top:1px solid #E0D8C8;"><div style="font-size:9px;letter-spacing:4px;color:#888;margin-bottom:6px;">CE ÎȚI LIPSEȘTE ȘI CAUȚI</div><p style="font-size:11px;color:#888;font-style:italic;margin-bottom:12px;">Elementele absente din harta ta sunt cele pe care le cauți instinctiv — pentru a completa ciclul.</p>${missingEls.map(el => {
      const info = EL[el];
      const desc = MISSING_EL_DESC[el];
      return `<div style="padding:10px;margin-bottom:8px;border-left:3px solid ${info.color};background:${info.color}08;"><div style="font-size:13px;color:${info.color};margin-bottom:5px;">${info.icon} ${info.label.toUpperCase()} — ABSENT · CĂUTAT</div><div style="font-size:11px;color:#666;font-style:italic;margin-bottom:6px;">${desc.need}</div><div style="display:flex;gap:4px;margin-bottom:6px;">${desc.colorHex.map((c, i) => `<div><div style="width:30px;height:30px;background:${c};border:1px solid #ddd;"></div><div style="font-size:7px;color:#888;width:30px;text-align:center;">${desc.colors[i]}</div></div>`).join('')}</div><div style="font-size:10px;color:#666;">${desc.forms.map(f => `— ${f}`).join(' · ')}</div><div style="font-size:10px;color:#666;margin-top:4px;font-style:italic;">${desc.energy}</div></div>`;
    }).join('')}</div>` : '';

    const projectsHTML = `<div style="margin:20px 0;padding-top:16px;border-top:1px solid #E0D8C8;"><div style="font-size:9px;letter-spacing:4px;color:#888;margin-bottom:12px;">PROIECTE ANADECOR RECOMANDATE</div>${matched.slice(0, 4).map((p, i) => {
      const elColors = p.elements.map((e: string) => EL[e].color);
      const grad = elColors.length > 1 ? `linear-gradient(135deg, ${elColors[0]}33 0%, #f4f1ea 60%, ${elColors[elColors.length - 1]}33 100%)` : `linear-gradient(135deg, ${elColors[0]}33 0%, #f4f1ea 70%)`;
      return `<div style="display:flex;gap:14px;margin-bottom:14px;border:1px solid #E8E0D0;overflow:hidden;">
      <div style="width:130px;height:110px;flex-shrink:0;background:${grad};display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;">
        <div><div style="font-size:13px;color:#444;font-style:italic;margin-bottom:3px;"><a href="${p.url || 'https://anadecor.ro'}" target="_blank" style="color:#444;text-decoration:none;">${p.name}</a></div><div style="font-size:8px;letter-spacing:1px;color:${elColors[0]};text-transform:uppercase;">${p.style}</div></div>
      </div>
      <div style="padding:10px 12px 10px 0;flex:1;">
        <div style="font-size:14px;color:#9A7030;margin-bottom:2px;"><a href="${p.url || 'https://anadecor.ro'}" target="_blank" style="color:#9A7030;text-decoration:none;font-weight:bold;">${p.name}</a>${i === 0 ? ' <span style="font-size:9px;color:#C8A96E;">BEST MATCH</span>' : ''}</div>
        <div style="font-size:9px;letter-spacing:1px;color:#999;margin-bottom:5px;text-transform:uppercase;">${p.type} · ${p.style}</div>
        <div style="font-size:10px;color:#777;font-style:italic;line-height:1.6;margin-bottom:5px;">${p.desc}</div>
        <div style="margin-bottom:6px;">${p.cromatics.map((c: string) => `<span style="font-size:8px;padding:2px 6px;border:1px solid #ddd;color:#888;margin-right:3px;">${c}</span>`).join('')}</div>
        <div><a href="${p.url || 'https://anadecor.ro'}" target="_blank" style="font-size:9px;color:#9A7030;text-decoration:underline;font-weight:500;">Vezi detalii proiect pe anadecor.ro →</a></div>
      </div>
    </div>`;
    }).join('')}</div>`;

    const html = `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><title>DesignDNA — ${name}</title><style>@page{margin:18mm;size:A4}*{box-sizing:border-box;margin:0;padding:0}body{font-family:Georgia,serif;color:#1A1A1A;background:#fff;line-height:1.8;font-size:13px;padding:20px;max-width:800px;margin:0 auto;}.hdr{text-align:center;padding-bottom:20px;margin-bottom:20px;border-bottom:2px solid #C8A96E44}.lbl{font-size:8px;letter-spacing:5px;color:#888;text-transform:uppercase;margin-bottom:5px}.cname{font-size:26px;font-weight:300;letter-spacing:2px;color:#9A7030;margin:5px 0}.sname{font-size:20px;font-style:italic;font-weight:300;letter-spacing:2px;color:#333;margin:5px 0}.sec{font-size:8px;letter-spacing:4px;color:#888;text-transform:uppercase;margin:18px 0 8px;border-bottom:1px solid #F0E8DC;padding-bottom:5px}.txt{font-size:13px;font-style:italic;color:#444;line-height:2;white-space:pre-wrap}.tag{display:inline-block;padding:2px 8px;border:1px solid #C8A96E55;color:#9A7030;font-size:10px;margin:2px}.ftr{margin-top:30px;padding-top:12px;border-top:1px solid #E0D8C8;font-size:9px;color:#AAA;letter-spacing:2px;display:flex;justify-content:space-between}.printbtn{position:fixed;top:16px;right:16px;background:#C8A96E;color:#fff;border:none;padding:10px 18px;font-family:Georgia,serif;font-size:12px;letter-spacing:2px;cursor:pointer;border-radius:3px}@media print{.printbtn{display:none}}</style></head><body><button class="printbtn" onclick="window.print()">🖨 PRINTEAZĂ / SALVEAZĂ PDF</button><div class="hdr"><div class="lbl">Anadecor · DesignDNA</div><div class="cname">${name}</div><div class="sname">${sTitle}</div><div style="font-size:12px;color:#666;font-style:italic;margin-top:2px;margin-bottom:8px;letter-spacing:1px;">${sDesc}</div><div class="lbl">${day}/${month}/${year} · ${dominants.map(d => EL[d].label).join(' + ')}</div></div><div class="sec">Profilul tău de design</div><div class="txt">${docText}</div><div style="width:40px;height:1.5px;background:#a38049;margin:15px auto 15px;"></div><div class="sec">Harta celor 8 numere</div>${hartaHTML}<div class="sec">Cromatică · Moodboard</div>${paletteHTML}<div style="margin-top:8px;">${styles.map(s => `<span class="tag">${s}</span>`).join('')}</div>${missingHTML}${projectsHTML}<div class="ftr"><span>ANADECOR · anadecor.ro · Constanța</span><span>${new Date().toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' })}</span></div></body></html>`;

    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DesignDNA-${name.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const sorted = results ? getSortedNums(results.nums) : [];
  const missingEls = results ? getMissingElements(results.nums) : [];

  // Render sub-sections based on current state
  return (
    <div style={S.app}>
      <style>{`
        .hb:hover { opacity: .85; }
        .num-card:hover { border-color: ${G}66!important; cursor: pointer; transform: translateY(-2px); transition: all .2s; }
        .pc:hover { border-color: ${G}55!important; transition: border .2s; }
        input:focus { border-color: ${G}66!important; }

        /* User Specific Style Overrides */
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(6) > div:nth-of-type(1) > div:nth-of-type(6) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(6) > div:nth-of-type(1) > div:nth-of-type(5) {
          font-style: italic!important;
          font-family: 'Times New Roman', Times, serif!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(6) > div:nth-of-type(2) {
          font-family: 'Times New Roman', Times, serif!important;
          font-size: 13px!important;
          line-height: 23.4px!important;
          color: #bcbcbc!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)[data-selected="true"] > div:nth-of-type(2) > div:nth-of-type(3) > button:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > button:nth-of-type(1) {
          border-color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(3)[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)[data-selected="true"] > div:nth-of-type(3) > span:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)[data-selected="false"] > div:nth-of-type(3) > span:nth-of-type(2) {
          color: #666666!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)[data-selected="false"] {
          border-color: #737171!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)[data-selected="true"] {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)[data-selected="false"] {
          border-color: #737171!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)[data-selected="true"] {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)[data-selected="false"] {
          color: #737171!important;
          border-color: #737171!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)[data-selected="true"] {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(3)[data-selected="false"] {
          border-color: #737171!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(3)[data-selected="true"] {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(3) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #252525!important;
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(3) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)[data-selected="true"] > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)[data-selected="true"] > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }

        /* Generic styling for all dynamically selected profile cards (pc) */
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div.pc[data-selected="true"] {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div.pc[data-selected="false"] {
          border-color: #737171!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div.pc[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div.pc[data-selected="false"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div.pc[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div.pc[data-selected="true"] > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }

        /* Generic styling for all dynamically selected profile cards (pc) under div:nth-of-type(4) */
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div.pc[data-selected="true"] {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div.pc[data-selected="false"] {
          border-color: #737171!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div.pc[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div.pc[data-selected="false"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div.pc[data-selected="true"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div.pc > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #272727!important;
          color: #ffffff!important;
          border-color: #858585!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div.pc[data-selected="true"] > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #272727!important;
          color: #ffffff!important;
          border-color: #858585!important;
        }

        /* Specific CSS Selector overrides requested by user */
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(6) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(9) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1)[data-selected="false"] > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(2)[data-selected="false"] > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)[data-selected="false"] > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)[data-selected="false"] > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #272727!important;
          border-color: #858585!important;
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1)[data-selected="true"] > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(2)[data-selected="true"] > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)[data-selected="true"] > div:nth-of-type(5) > button:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)[data-selected="true"] > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #a38049!important;
          border-color: #d4af37!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(6) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(6) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(9) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(9) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(6) > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #272727!important;
          border-color: #858585!important;
          color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(9) > div:nth-of-type(5) > button:nth-of-type(1) {
          background-color: #272727!important;
          border-color: #858585!important;
          color: #ffffff!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(4) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(5) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(6) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#profile-split-view-container:nth-of-type(3) > div:nth-of-type(6) > div:nth-of-type(2) > span:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(2) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(5) > button:nth-of-type(1) {
          color: #a38049!important;
          background-color: #353535!important;
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(5) > button:nth-of-type(1) {
          border-color: #a38049!important;
          color: #a38049!important;
          background-color: #343232!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(2) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(2) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(1) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > button#btn-open-compare:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > span:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > button#btn-open-compare:nth-of-type(1) {
          border-color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > span:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > span:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) {
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(5) > a:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(5) > a:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div#split-view-container:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(3) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          color: #a38049!important;
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(2) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(1) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          color: #a38049!important;
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(3) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(4) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(2) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(2) > div:nth-of-type(3) > span:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > button#btn-open-compare:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(1) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(2) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #a38049!important;
          border-color: #000000!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #a38049!important;
          border-color: #000000!important;
          color: #000000!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(3) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(4) {
          border-color: #a38049!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > span:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > span:nth-of-type(2) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) {
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(5) > a:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(5) > a:nth-of-type(1) {
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(3) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(3) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) {
          background-color: #a38049!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(2) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(1) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #a38049!important;
          border-color: #000000!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #a38049!important;
          border-color: #000000!important;
          color: #000000!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) {
          border-color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(2) {
          border-color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(3) {
          border-color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) {
          border-color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(2) {
          border-color: #ffffff!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(6) > div#split-view-container:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(4) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(3) {
          border-color: #ffffff!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(2) {
          background-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(3) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(4) {
          border-color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div#recommended-projects-section:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(4) > button:nth-of-type(1) {
          background-color: #000000!important;
          border-color: #a38049!important;
          color: #a38049!important;
        }

        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(7) > div:nth-of-type(7) > a:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > span:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(7) > div:nth-of-type(7) > a:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > span:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(7) > div:nth-of-type(7) > a:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > span:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(7) > div:nth-of-type(7) > a:nth-of-type(4) > div:nth-of-type(2) > div:nth-of-type(1) > span:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(7) > div:nth-of-type(7) > a:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(1) > span:nth-of-type(1),
        div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(7) > div:nth-of-type(7) > a:nth-of-type(6) > div:nth-of-type(2) > div:nth-of-type(1) > span:nth-of-type(1) {
          color: #a38049!important;
        }

        @media print {
          body * { visibility: hidden; }
          .pdf-doc, .pdf-doc * { visibility: visible; }
          .pdf-doc { position: absolute; top: 0; left: 0; width: 100%; background: #fff!important; border: none!important; padding: 20px!important; }
          .pdf-doc * { color: #222!important; }
          .no-print, .no-print * { display: none!important; visibility: hidden!important; }
          @page { margin: 15mm; }
        }
      `}</style>
      
      <NumModal modal={modal} results={results} onClose={() => setModal(null)} />

      {page === 'home' && (
        <div>
          <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-5 border-b border-white/10 no-print">
            <div className="flex flex-col items-center cursor-pointer text-center" onClick={() => setPage('home')}>
              <div style={{ fontSize: '20px', fontWeight: '300', color: '#ffffff', letterSpacing: '0.15em', lineHeight: '1.1' }}>ANADECOR</div>
              <div style={{ fontSize: '14px', fontWeight: '400', color: '#a38049', letterSpacing: '0.25em', marginTop: '2px', textTransform: 'uppercase' }}>DESIGN - DNA</div>
            </div>
            <div className="flex items-center gap-4 sm:gap-7 flex-wrap justify-center no-print">
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500', opacity: 0.6, cursor: 'pointer' }} className="hb" onClick={() => setPage('home')}>Acasă</span>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500', opacity: 0.6, cursor: 'pointer' }} className="hb" onClick={() => setPage('profiles')}>Profiluri</span>
              <button className="hb" onClick={() => setPage('calculator')} style={{ ...S.btn, padding: '8px 16px' }}>Calculează</button>
            </div>
          </nav>
          <div style={{ textAlign: 'center', padding: '96px 24px 80px', background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, #0a0a0a 75%)' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '600', marginBottom: '24px', textTransform: 'uppercase' }}>AMPRENTA TA DE DESIGN</div>
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 84px)', fontWeight: '300', letterSpacing: '1px', lineHeight: '1.1', margin: '0 0 28px', color: '#ffffff', fontFamily: "'Georgia', serif" }}>
              Design <span style={{ color: '#a38049' }}>DNA</span>
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '540px', margin: '0 auto 48px', fontStyle: 'italic', lineHeight: '30px', fontWeight: '300', fontFamily: "'Times New Roman', Times, serif" }}>
              Fiecare persoană poartă în numerele sale o amprentă unică de design — o semnătură estetică înscrisă în data nașterii și în numele său.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
              <button className="hb" onClick={() => setPage('calculator')} style={{ ...S.btn, padding: '14px 36px' }}>
                DESCOPERĂ-ȚI STILUL
              </button>
              <div style={{ height: '1px', width: '80px', background: 'rgba(255,255,255,0.15)' }}></div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.4 }}>ANADECOR 2026</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row border-y border-white/8">
            {CYCLE.map((el, i) => (
              <div key={el} className="flex-1 text-center py-6 px-4 border-b sm:border-b-0 sm:border-r border-white/8 last:border-0 bg-white/[0.01]">
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{EL[el].icon}</div>
                <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: EL[el].color, marginBottom: '6px', fontWeight: '500' }}>{EL[el].label.toUpperCase()}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{EL[el].nums}</div>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 32px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '48px', fontWeight: '600' }}>CUM FUNCȚIONEAZĂ</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[{ n: '01', t: 'Introdu datele', d: 'Numele tău complet și data nașterii conțin amprenta ta estetică unică și forțele energetice corespunzătoare.' }, { n: '02', t: 'Calculăm harta', d: 'Cele 8 numere numerologice dezvăluie distribuția elementelor (apă, lemn, foc, pământ, metal) care îți definesc esența.' }, { n: '03', t: 'Arta spațiului tău', d: 'Primești o analiză cromatică aprofundată, recomandări de design interior și proiecte Anadecor perfect compatibile.' }].map(({ n, t, d }) => (
                <div key={n} className="feature-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '24px', paddingRight: '12px', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px', fontFamily: "'Georgia', serif", fontStyle: 'italic', color: '#a38049' }}>{n}</span>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.3 }}>Fază</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '300', marginBottom: '10px', color: '#ffffff' }}>{t}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', fontWeight: '300' }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {page === 'calculator' && (
        <div>
          <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-5 border-b border-white/10 no-print">
            <div className="flex flex-col items-center cursor-pointer text-center" onClick={() => setPage('home')}>
              <div style={{ fontSize: '20px', fontWeight: '300', color: '#ffffff', letterSpacing: '0.15em', lineHeight: '1.1' }}>ANADECOR</div>
              <div style={{ fontSize: '14px', fontWeight: '400', color: '#a38049', letterSpacing: '0.25em', marginTop: '2px', textTransform: 'uppercase' }}>DESIGN - DNA</div>
            </div>
            <div className="flex items-center gap-4 sm:gap-7 flex-wrap justify-center no-print">
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500', opacity: 0.6, cursor: 'pointer' }} className="hb" onClick={() => setPage('home')}>Acasă</span>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500', opacity: 0.6, cursor: 'pointer' }} className="hb" onClick={() => setPage('profiles')}>Profiluri ({profiles.length})</span>
              <button className="hb" onClick={() => setPage('calculator')} style={{ ...S.btn, padding: '8px 16px' }}>Calculează</button>
            </div>
          </nav>
          <div style={{ maxWidth: '460px', margin: '0 auto', padding: '56px 32px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '12px' }}>CALCULATOR NUMEROLOGIE</div>
            <h2 style={{ fontSize: '32px', fontWeight: '300', marginBottom: '6px', color: '#a38049' }}>Amprenta ta</h2>
            <p style={{ color: '#555', marginBottom: '40px', fontStyle: 'italic' }}>Cele 8 numere ale hărții tale de design.</p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '10px', letterSpacing: '3px', color: '#666', display: 'block', marginBottom: '8px' }}>NUME COMPLET</label>
              <input style={S.inp} placeholder="ex: Maria Ionescu" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              {[['ZI', 'day', '15'], ['LUNĂ', 'month', '3'], ['AN', 'year', '1990']].map(([l, k, p]) => (
                <div key={k}>
                  <label style={{ fontSize: '10px', letterSpacing: '3px', color: '#666', display: 'block', marginBottom: '8px' }}>{l}</label>
                  <input type="number" style={S.inp} placeholder={p} value={form[k as keyof typeof form]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
            </div>
            {err && <div style={{ color: '#D4542A', fontSize: '13px', marginBottom: '16px', fontStyle: 'italic' }}>{err}</div>}
            <button className="hb" onClick={calculate} style={{ ...S.btn, width: '100%', padding: '14px', fontSize: '13px', letterSpacing: '3px' }}>CALCULEAZĂ HARTA</button>
          </div>
        </div>
      )}

      {page === 'results' && results && (
        <div>
          <nav className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-5 border-b border-white/10 no-print">
            <div className="flex flex-col items-center cursor-pointer text-center" onClick={() => setPage('home')}>
              <div style={{ fontSize: '20px', fontWeight: '300', color: '#ffffff', letterSpacing: '0.15em', lineHeight: '1.1' }}>ANADECOR</div>
              <div style={{ fontSize: '14px', fontWeight: '400', color: '#a38049', letterSpacing: '0.25em', marginTop: '2px', textTransform: 'uppercase' }}>DESIGN - DNA</div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500', opacity: 0.6, cursor: 'pointer' }} className="hb" onClick={() => setPage('home')}>Acasă</span>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500', opacity: 0.6, cursor: 'pointer' }} className="hb" onClick={() => setPage('profiles')}>Profiluri</span>
              <button className="hb" onClick={() => setPage('calculator')} style={{ ...S.btnG, padding: '8px 12px', fontSize: '10px' }}>Recalculează</button>
              <button className="hb" onClick={() => saveProfile(results)} style={{ ...S.btnO, padding: '8px 12px', fontSize: '10px' }}>Salvează</button>
              <button className="hb" onClick={generateDoc} style={{ ...S.btn, padding: '8px 16px', fontSize: '10px' }} disabled={generating}>{generating ? `${genTime}s...` : 'GENEREAZĂ DOCUMENT'}</button>
            </div>
          </nav>

          <div style={{ maxWidth: '980px', margin: '0 auto', padding: '36px 24px' }}>
            {/* HEADER */}
            <div className="no-print" style={{ textAlign: 'center', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #181818' }}>
              <div style={{ fontSize: '10px', letterSpacing: '6px', color: '#555', marginBottom: '14px' }}>PROFILUL DE DESIGN AL</div>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '300', color: '#a38049', margin: '0 0 12px', letterSpacing: '2px' }}>{results.name}</h2>
              <div style={{ fontSize: '13px', color: '#333', marginBottom: '24px' }}>{results.day}/{results.month}/{results.year}</div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '8px' }}>STILUL TĂU DE DESIGN</div>
                <div style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: '300', letterSpacing: '3px', color: '#EEE8DC', fontStyle: 'italic', marginBottom: '20px' }}>
                  {getStyleTitle(getDominants(results.nums), results.nums, results.name, results.day)}
                </div>

                <div style={{ fontSize: '14px', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.7)', maxWidth: '640px', margin: '0 auto 24px', lineHeight: '1.8', whiteSpace: 'pre-line', textAlign: 'center', background: '#0A0A0A', padding: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Times New Roman', Times, serif", fontStyle: 'italic' }}>
                  {getStyleDescription(getDominants(results.nums), results.nums)}
                </div>
                <div style={{ width: '60px', height: '1px', background: `linear-gradient(90deg,transparent,${EL[getDominants(results.nums)[0]].color},transparent)`, margin: '0 auto' }} />
              </div>
              {getDominants(results.nums).length > 1 && (
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '4px', color: '#a38049', border: `1px solid ${G}44`, padding: '4px 16px', background: `${G}0A` }}>
                    DOMINANT {getDominants(results.nums).length === 2 ? 'DUO' : getDominants(results.nums).length === 3 ? 'TRIO' : getDominants(results.nums).length === 4 ? 'CVARTET' : 'MULTI'} · {getDominants(results.nums).map(d => EL[d].label).join(' · ')}
                  </span>
                </div>
              )}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', justifyContent: 'center' }}>
                {getDominants(results.nums).map((d) => {
                  const de = EL[d];
                  return (
                    <div key={d} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 20px', border: `1px solid ${de.color}55`, background: de.color + '0D', margin: '3px' }}>
                      <span style={{ fontSize: '22px' }}>{de.icon}</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '16px', letterSpacing: '3px', color: de.color }}>{de.label.toUpperCase()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NUMERE CHEIE — Drumul Vietii & Sufletul */}
              {(() => {
                const lpEl = numToEl(results.nums.drumVietii);
                const soulEl = numToEl(results.nums.suflet);
                const lpDiffers = !getDominants(results.nums).includes(lpEl);
                const soulDiffers = !getDominants(results.nums).includes(soulEl);
                if (!lpDiffers && !soulDiffers) return null;
                return (
                  <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {lpDiffers && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 20px', border: `1px solid ${EL[lpEl].color}55`, background: EL[lpEl].color + '0D', margin: '3px' }}>
                        <span style={{ fontSize: '22px' }}>{EL[lpEl].icon}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#555', marginBottom: '3px' }}>DRUMUL VIEȚII ({results.nums.drumVietii})</div>
                          <div style={{ fontSize: '16px', letterSpacing: '3px', color: EL[lpEl].color }}>{EL[lpEl].label.toUpperCase()}</div>
                        </div>
                      </div>
                    )}
                    {soulDiffers && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 20px', border: `1px solid ${EL[soulEl].color}55`, background: EL[soulEl].color + '0D', margin: '3px' }}>
                        <span style={{ fontSize: '22px' }}>{EL[soulEl].icon}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#555', marginBottom: '3px' }}>DORINȚA SUFLETULUI ({results.nums.suflet})</div>
                          <div style={{ fontSize: '16px', letterSpacing: '3px', color: EL[soulEl].color }}>{EL[soulEl].label.toUpperCase()}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* HARTA CICLU */}
            <div className="no-print" style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '4px' }}>HARTA CELOR 8 NUMERE</div>
              <div style={{ fontSize: '12px', color: '#444', fontStyle: 'italic', marginBottom: '4px' }}>Ciclul tău productiv — cum se creează elementele între ele</div>
              <div style={{ fontSize: '11px', color: '#333', marginBottom: '20px' }}>Apasă pe orice număr pentru detalii complete ↓</div>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="pb-2">
                <div style={{ display: 'flex', alignItems: 'stretch', width: 'max-content', minWidth: '100%', paddingBottom: '8px' }}>
                  {CYCLE.map((el, ci) => {
                    const info = EL[el];
                    const sorted = getSortedNums(results.nums);
                    const group = sorted.filter(m => numToEl(results.nums[m.key as keyof NumerologyResults]) === el).map(m => ({ key: m.key, n: results.nums[m.key as keyof NumerologyResults] }));
                    const isPresent = group.length > 0;
                    const isLast = ci === CYCLE.length - 1;
                    const nextEl = CYCLE[(ci + 1) % CYCLE.length];
                    const nextPresent = sorted.filter(m => numToEl(results.nums[m.key as keyof NumerologyResults]) === nextEl).length > 0;
                    const freq: Record<number, number> = {};
                    (Object.values(results.nums) as number[]).forEach(n => { freq[n] = (freq[n] || 0) + 1; });

                    return (
                      <div key={el} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '108px', flexShrink: 0, border: `1px solid ${isPresent ? info.color + '66' : '#1A1A1A'}`, background: isPresent ? info.color + '0D' : '#090909', padding: '10px 7px', position: 'relative', overflow: 'hidden', opacity: isPresent ? 1 : 0.3, boxShadow: isPresent && group.some(g => isMaster(g.n)) ? '0 0 24px #FFD70022' : isPresent ? `0 0 14px ${info.color}18` : 'none' }}>
                          {isPresent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${info.color},transparent)` }} />}
                          <div style={{ textAlign: 'center', marginBottom: '8px', paddingBottom: '7px', borderBottom: `1px solid ${isPresent ? info.color + '22' : '#141414'}` }}>
                            <div style={{ fontSize: '16px', marginBottom: '3px' }}>{info.icon}</div>
                            <div style={{ fontSize: '11px', letterSpacing: '1px', color: isPresent ? info.color : '#333' }}>{info.label.toUpperCase()}</div>
                          </div>
                          {isPresent ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              {group.map(({ key, n }) => {
                                const pos = POS_INFO[key];
                                const f = freq[n];
                                const master = isMaster(n);
                                return (
                                  <div key={key} className="num-card" onClick={() => setModal({ key, n })} style={{ padding: '5px 6px', border: `1px solid ${master ? '#FFD70033' : info.color + (f > 1 ? '55' : '22')}`, background: master ? '#FFD7000A' : info.color + '06', position: 'relative', cursor: 'pointer' }}>
                                    {f > 1 && <div style={{ position: 'absolute', top: '2px', right: '4px', fontSize: '8px', color: info.color }}>×{f}</div>}
                                    <div style={{ fontSize: '20px', fontWeight: '300', color: master ? '#FFD700' : info.color, lineHeight: '1' }}>{n}{master && <span style={{ fontSize: '9px', color: '#FFD700', verticalAlign: 'middle', marginLeft: '2px', fontWeight: 'bold' }}> (M)</span>}</div>
                                    <div style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>{pos.title}</div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center', padding: '8px 0', fontSize: '10px', color: '#1E1E1E', fontStyle: 'italic' }}>absent</div>
                          )}
                        </div>
                        {!isLast && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '74px', flexShrink: 0, padding: '0 4px', gap: '4px' }}>
                            <div style={{ fontSize: '16px', color: isPresent && nextPresent ? info.color : '#1E1E1E' }}>→</div>
                            <div style={{ fontSize: '10px', color: isPresent && nextPresent ? info.color : '#252525', textAlign: 'center', textTransform: 'uppercase', lineHeight: '1.3' }}>{CYCLE_VERB[el]}</div>
                            {isPresent && nextPresent && <div style={{ fontSize: '9px', color: '#383838', textAlign: 'center', fontStyle: 'italic', lineHeight: '1.4' }}>{CYCLE_DESIGN[el]}</div>}
                          </div>
                        )}
                        {isLast && isPresent && sorted.filter(m => numToEl(results.nums[m.key as keyof NumerologyResults]) === 'apa').length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '36px', flexShrink: 0, gap: '3px' }}>
                            <div style={{ fontSize: '14px', color: info.color }}>↺</div>
                            <div style={{ fontSize: '9px', color: '#2A2A2A', fontStyle: 'italic' }}>renaște</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: '14px', padding: '12px 16px', border: `1px solid ${EL[getDominants(results.nums)[0]].color}22`, background: EL[getDominants(results.nums)[0]].color + '06' }}>
                <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#444', marginBottom: '6px' }}>CE CREEAZĂ ACEASTĂ COMBINAȚIE</div>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.8', fontStyle: 'italic' }}>
                  {getMissingElements(results.nums).length === 0 ? `${results.name} poartă toate cele 5 elemente — un ciclu complet de creație.` : getDominants(results.nums).length > 1 ? `${results.name} are un ${getDominants(results.nums).length === 2 ? 'duo' : getDominants(results.nums).length === 3 ? 'trio' : getDominants(results.nums).length === 4 ? 'cvartet' : 'grup'} dominant — ${getDominants(results.nums).map(d => EL[d].label).join(' și ')} — cu forță egală. Designul tău este o conversație între aceste energii.` : `Fluxul ${CYCLE.filter(el => sorted.filter(m => numToEl(results.nums[m.key as keyof NumerologyResults]) === el).length > 0).map(e => EL[e].label).join(' → ')} creează un spațiu care ${CYCLE_DESIGN[CYCLE.filter(el => sorted.filter(m => numToEl(results.nums[m.key as keyof NumerologyResults]) === el).length > 0)[0]]?.toLowerCase() || 'vibrează armonios'}. ${EL[getDominants(results.nums)[0]].label} domină și dă tonul.`}
                </div>
              </div>
            </div>

            {/* DISTRIBUTIE */}
            <div className="no-print" style={{ ...S.card, marginBottom: '32px', background: `linear-gradient(135deg,${EL[getDominants(results.nums)[0]].dark},#0A0A0A)`, borderColor: EL[getDominants(results.nums)[0]].color + '22', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '14px' }}>DISTRIBUȚIE ELEMENTE</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {results.elemRanking.map(([el, cnt]) => (
                  <div key={el} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: `1px solid ${EL[el].color}44`, background: EL[el].color + '0D' }}>
                    <span>{EL[el].icon}</span>
                    <span style={{ color: EL[el].color, letterSpacing: '1px', fontSize: '12px' }}>{EL[el].label.toUpperCase()}</span>
                    <span style={{ background: EL[el].color, color: '#000', width: '19px', height: '19px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{cnt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CE ITI LIPSESTE */}
            {missingEls.length > 0 && (
              <div className="no-print" style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '6px' }}>CE ÎȚI LIPSEȘTE ȘI CAUȚI</div>
                <p style={{ color: '#555', fontSize: '13px', fontStyle: 'italic', marginBottom: '16px' }}>Elementele absente din harta ta sunt cele pe care le cauți instinctiv — completând ciclul, completezi versiunea ta.</p>
                {missingEls.map(el => {
                  const info = EL[el];
                  const desc = MISSING_EL_DESC[el];
                  return (
                    <div key={el} style={{ ...S.card, marginBottom: '10px', borderColor: info.color + '33', background: info.color + '04' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{info.icon}</span>
                        <div>
                          <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#444' }}>ELEMENT ABSENT · CĂUTAT</div>
                          <div style={{ fontSize: '15px', color: info.color, letterSpacing: '2px' }}>{info.label.toUpperCase()}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', marginBottom: '10px' }}>{desc.need}</div>
                      <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                        {desc.colorHex.map((c, i) => (
                          <div key={i}>
                            <div style={{ width: '36px', height: '36px', background: c, border: '1px solid #1E1E1E' }} />
                            <div style={{ fontSize: '7px', color: '#444', width: '36px', textAlign: 'center', marginTop: '2px', lineHeight: '1.2' }}>{desc.colors[i]}</div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#444', marginBottom: '5px' }}>FORME & ENERGIE</div>
                          {desc.forms.map(f => <div key={f} style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>— {f}</div>)}
                        </div>
                        <div>
                          <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#444', marginBottom: '5px' }}>CUM SĂ INTEGREZI</div>
                          <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.7' }}>{desc.design}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MOODBOARD */}
            <div className="no-print">
              <MoodBoard nums={results.nums} dominants={getDominants(results.nums)} styleName={getStyleTitle(getDominants(results.nums), results.nums, results.name, results.day)} styleDesc={getStyleDescription(getDominants(results.nums), results.nums)} />
            </div>

            {/* PROIECTE */}
            <div className="no-print" style={{ marginBottom: '40px' }} id="recommended-projects-section">
              <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '6px' }}>PROIECTE ANADECOR RECOMANDATE</div>
              <p style={{ color: '#333', fontSize: '13px', fontStyle: 'italic', marginBottom: '20px' }}>Selectate prin compatibilitate numerologică și elementară. Alege oricare două proiecte pentru a le compara în format Split-View lateral.</p>

              {/* PERSISTENT COMPARATOR CONTROL PANEL */}
              <div style={{ background: '#121212', border: `1px solid ${compareIds.length === 2 ? G : 'rgba(255,255,255,0.08)'}`, padding: '20px', borderRadius: '4px', marginBottom: '24px', transition: 'border-color 0.2s ease' }}>
                <div style={{ fontSize: '11px', letterSpacing: '3px', color: G, textTransform: 'uppercase', marginBottom: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#a38049' }}>COMPARATOR PORTOFOLIU (SPLIT-VIEW)</span>
                  <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', color: '#888', padding: '2px 8px', borderRadius: '10px', letterSpacing: '1px' }}>{compareIds.length} din 2 selectate</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '16px' }}>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>Proiect A</label>
                    <select 
                      value={compareIds[0] || ""} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setCompareIds(prev => {
                          const next = [...prev];
                          if (val) {
                            next[0] = val;
                          } else {
                            next.shift();
                          }
                          const filtered = next.filter(Boolean);
                          if (filtered.length < 2) setShowCompareView(false);
                          return filtered;
                        });
                      }}
                      style={{ width: '100%', background: '#0D0D0D', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: '2px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="" style={{ color: '#666' }}>-- Alege Proiectul A --</option>
                      {results.matched.slice(0, 4).map(p => (
                        <option key={p.id} value={p.id} disabled={compareIds[1] === p.id} style={{ background: '#121212', color: '#FFF' }}>
                          {p.name} ({p.style})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>Proiect B</label>
                    <select 
                      value={compareIds[1] || ""} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setCompareIds(prev => {
                          const next = [...prev];
                          if (val) {
                            next[1] = val;
                          } else {
                            next.pop();
                          }
                          const filtered = next.filter(Boolean);
                          if (filtered.length < 2) setShowCompareView(false);
                          return filtered;
                        });
                      }}
                      style={{ width: '100%', background: '#0D0D0D', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: '2px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="" style={{ color: '#666' }}>-- Alege Proiectul B --</option>
                      {results.matched.slice(0, 4).map(p => (
                        <option key={p.id} value={p.id} disabled={compareIds[0] === p.id} style={{ background: '#121212', color: '#FFF' }}>
                          {p.name} ({p.style})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', minWidth: '180px' }}>
                    <button
                      onClick={() => {
                        if (compareIds.length === 2) {
                          setShowCompareView(true);
                        }
                      }}
                      disabled={compareIds.length !== 2}
                      style={{ 
                        padding: '12px 20px', 
                        background: compareIds.length === 2 ? G : 'rgba(255,255,255,0.03)', 
                        color: compareIds.length === 2 ? '#000' : 'rgba(255,255,255,0.2)',
                        border: compareIds.length === 2 ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.08)',
                        cursor: compareIds.length === 2 ? 'pointer' : 'not-allowed',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                        flex: 1
                      }}
                      className="hb"
                      id="btn-open-compare"
                    >
                      Compară Lateral
                    </button>
                    {compareIds.length > 0 && (
                      <button 
                        onClick={() => { setCompareIds([]); setShowCompareView(false); }}
                        style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '12px 14px', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        className="hb"
                        title="Resetează selecția"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span>* Sugestie: Poți face click direct pe butonul "+ Compară" de pe oricare dintre cele 4 carduri de mai jos.</span>
                  {compareIds.length === 1 && (
                    <span style={{ color: G }}>Selectează încă un proiect pentru a activa compararea laterală.</span>
                  )}
                  {compareIds.length === 2 && !showCompareView && (
                    <span style={{ color: G, fontWeight: 'bold', animation: 'pulse 2s infinite' }}>✓ Proiecte selectate! Apasă pe butonul "Compară Lateral"</span>
                  )}
                </div>
              </div>

              {/* COMPARATIVE SPLIT-VIEW COMPONENT */}
              {showCompareView && compareIds.length === 2 && (
                (() => {
                  const projA = results.matched.find(p => p.id === compareIds[0]);
                  const projB = results.matched.find(p => p.id === compareIds[1]);
                  if (projA && projB) {
                    return (
                      <ProjectCompare
                        projectA={projA}
                        projectB={projB}
                        userDominants={getDominants(results.nums)}
                        userNums={results.nums}
                        onClose={() => setShowCompareView(false)}
                      />
                    );
                  }
                  return null;
                })()
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.matched.slice(0, 4).map((p, i) => {
                  const isSelected = compareIds.includes(p.id);
                  const selectedIdx = compareIds.indexOf(p.id);
                  return (
                    <div 
                      key={p.id} 
                      style={{ 
                        ...S.card, 
                        padding: '0', 
                        overflow: 'hidden', 
                        borderColor: isSelected ? G : (i === 0 ? G + '55' : '#1C1C1C'), 
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease, transform 0.2s ease',
                        boxShadow: isSelected ? `0 0 15px ${G}22` : 'none',
                        position: 'relative'
                      }} 
                      onClick={() => {
                        setCompareIds(prev => {
                          if (prev.includes(p.id)) {
                            const next = prev.filter(id => id !== p.id);
                            if (next.length < 2) setShowCompareView(false);
                            return next;
                          }
                          const next = prev.length >= 2 ? [prev[1], p.id] : [...prev, p.id];
                          return next;
                        });
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <ProjectBanner project={p} height={155} />
                        {i === 0 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#a38049', color: '#000', fontSize: '9px', letterSpacing: '2px', padding: '3px 9px', fontWeight: 'bold' }}>BEST MATCH</div>}
                        
                        {/* Selected Indicator - Highly Visible */}
                        {isSelected && (
                          <div style={{ position: 'absolute', top: '10px', left: '10px', background: G, color: '#000', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #000' }}>
                            <span>✓ PROIECT {selectedIdx === 0 ? 'A' : 'B'}</span>
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '9px', letterSpacing: '2px', color: '#aaa' }}>{p.type.toUpperCase()}</div>
                      </div>
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '15px', color: '#a38049', marginBottom: '4px' }}>{p.name}</div>
                        <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#444', marginBottom: '7px' }}>{p.style.toUpperCase()}</div>
                        <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.7', marginBottom: '8px' }}>{p.desc}</p>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          {p.cromatics.map((c: string) => (
                            <span key={c} style={{ fontSize: '9px', padding: '2px 7px', border: '1px solid #1E1E1E', color: '#444' }}>
                              {c}
                            </span>
                          ))}
                        </div>
                        
                        {/* Interactive Footer with HIGH CONTRAST actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '4px' }}>
                          <span 
                            style={{ fontSize: '10px', letterSpacing: '2px', color: '#a38049', fontWeight: '500' }}
                            onClick={(e) => { e.stopPropagation(); window.open(p.url, '_blank'); }}
                            className="hb"
                          >
                            DETALII PORTOFOLIU →
                          </span>
                          
                          <button 
                            style={{ 
                              fontSize: '10px', 
                              letterSpacing: '1px',
                              background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              color: isSelected ? G : 'rgba(255,255,255,0.9)', 
                              border: isSelected ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.2)',
                              padding: '5px 12px',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              fontWeight: isSelected ? 'bold' : 'normal',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompareIds(prev => {
                                if (prev.includes(p.id)) {
                                  const next = prev.filter(id => id !== p.id);
                                  if (next.length < 2) setShowCompareView(false);
                                  return next;
                                }
                                const next = prev.length >= 2 ? [prev[1], p.id] : [...prev, p.id];
                                return next;
                              });
                            }}
                          >
                            {isSelected ? '✓ Selectat' : '+ Compară'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GENERATING */}
            {generating && (
              <div className="no-print" style={{ ...S.card, textAlign: 'center', padding: '48px', border: `1px solid ${G}33`, background: '#0A0A0A', marginBottom: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px', animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>⟳</div>
                <div style={{ color: '#a38049', letterSpacing: '3px', fontSize: '13px', marginBottom: '12px' }}>SE GENEREAZĂ PROFILUL TĂU</div>
                <div style={{ fontSize: '36px', fontWeight: '300', color: '#EEE8DC', marginBottom: '8px' }}>{genTime}<span style={{ fontSize: '16px', color: '#555' }}>s</span></div>
                <div style={{ fontSize: '11px', color: '#444', fontStyle: 'italic' }}>{genTime < 5 ? 'Se analizează harta numerologică...' : genTime < 12 ? 'Se identifică elementele dominante...' : genTime < 20 ? 'Se redactează profilul de design...' : 'Se finalizează documentul...'}</div>
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {/* DOCUMENT */}
            {showDoc && docText && (
              <div className="pdf-doc" style={{ ...S.card, border: `1px solid ${G}33`, background: '#080808' }}>
                <div style={{ textAlign: 'center', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid #1A1A1A' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '6px', color: '#555', marginBottom: '10px' }}>ANADECOR · DESIGNDNA</div>
                  <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#444', marginBottom: '10px' }}>RAPORT PERSONALIZAT PENTRU</div>
                  <div style={{ fontSize: '22px', fontWeight: '300', color: '#a38049', letterSpacing: '2px', marginBottom: '10px' }}>{results.name}</div>
                  <div style={{ fontSize: '28px', fontWeight: '300', color: '#EEE8DC', letterSpacing: '3px', fontStyle: 'italic', marginBottom: '6px' }}>
                    {getStyleTitle(getDominants(results.nums), results.nums, results.name, results.day)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '10px', fontStyle: 'italic', fontFamily: "'Times New Roman', Times, serif" }}>
                    {getStyleDescription(getDominants(results.nums), results.nums)}
                  </div>
                  <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, #a38049, transparent)', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '11px', color: '#333', letterSpacing: '1px' }}>{results.day}/{results.month}/{results.year} · {getDominants(results.nums).map(d => EL[d].label).join(' + ')} · {genTime}s</div>
                </div>

                <div style={{ fontSize: '13px', lineHeight: '23.4px', fontFamily: "'Times New Roman', Times, serif", color: '#bcbcbc', whiteSpace: 'pre-wrap', fontStyle: 'italic', marginBottom: '28px' }}>{docText}</div>

                {/* O linie mică scurtă orizontală de culoarea #a38049 */}
                <div style={{ width: '40px', height: '1.5px', backgroundColor: '#a38049', margin: '0 auto 28px' }} />

                {/* HARTA IN DOC — cu profil complet per număr */}
                <div style={{ marginBottom: '28px', paddingTop: '20px', borderTop: '1px solid #181818' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '6px' }}>HARTA CELOR 8 NUMERE</div>
                  <div style={{ fontSize: '11px', color: '#444', fontStyle: 'italic', marginBottom: '16px' }}>Ciclul tău productiv — profilul complet al fiecărui număr din harta ta</div>
                  {CYCLE.filter(el => getSortedNums(results.nums).filter(m => numToEl(results.nums[m.key as keyof NumerologyResults]) === el).length > 0).map(el => {
                    const info = EL[el];
                    const sorted = getSortedNums(results.nums);
                    const group = sorted.filter(m => numToEl(results.nums[m.key as keyof NumerologyResults]) === el).map(m => ({ key: m.key, n: results.nums[m.key as keyof NumerologyResults] }));
                    const freq: Record<number, number> = {};
                    (Object.values(results.nums) as number[]).forEach(n => { freq[n] = (freq[n] || 0) + 1; });

                    return (
                      <div key={el} style={{ marginBottom: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px' }}>{info.icon}</span>
                          <span style={{ fontSize: '10px', letterSpacing: '2px', color: info.color }}>{info.label.toUpperCase()}</span>
                        </div>
                        {group.map(({ key, n }) => {
                          const pos = POS_INFO[key];
                          const f = freq[n];
                          const master = isMaster(n);
                          const ess = NUM_ESSENCE[n] || NUM_ESSENCE[1];
                          return (
                            <div key={key} style={{ padding: '12px 14px', marginBottom: '8px', marginLeft: '20px', border: `1px solid ${master ? '#FFD70022' : info.color + '1A'}`, background: master ? '#FFD7000A' : info.color + '06' }}>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div style={{ fontSize: '22px', fontWeight: '300', color: master ? '#FFD700' : info.color, minWidth: '30px', textAlign: 'center' }}>{n}{f > 1 && <span style={{ fontSize: '8px', color: info.color, display: 'block' }}>×{f}</span>}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '12px', color: '#BBB', marginBottom: '2px' }}>{pos.title}{master && <span style={{ color: '#FFD700', fontSize: '9px', marginLeft: '5px' }}> (MASTER)</span>}</div>
                                  <div style={{ fontSize: '9px', letterSpacing: '1px', color: master ? '#FFD70099' : info.color, marginBottom: '4px' }}>{ess.kw}</div>
                                  <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic', lineHeight: '1.6' }}>{pos.posLens(n)}</div>
                                </div>
                              </div>

                              {/* Personalitate extinsă */}
                              <div style={{ fontSize: '10px', color: '#777', lineHeight: '1.8', marginBottom: '8px', paddingLeft: '42px' }}>{ess.pers}</div>

                              {/* Puncte forte & provocări — compact */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingLeft: '42px', marginBottom: '8px' }}>
                                <div>
                                  <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#6b9e5e', marginBottom: '4px' }}>PUNCTE FORTE</div>
                                  {ess.strengths.slice(0, 3).map((s, idx) => <div key={idx} style={{ fontSize: '9px', color: '#666', marginBottom: '2px' }}><span style={{ color: '#6b9e5e', marginRight: '4px' }}>✓</span> {s}</div>)}
                                </div>
                                <div>
                                  <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#D4542A', marginBottom: '4px' }}>DE ECHILIBRAT</div>
                                  {ess.shadow.slice(0, 2).map((s, idx) => <div key={idx} style={{ fontSize: '9px', color: '#666', marginBottom: '2px' }}>⚠ {s}</div>)}
                                </div>
                              </div>

                              {/* Tema de viata */}
                              <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic', lineHeight: '1.7', paddingLeft: '10px', marginBottom: '8px', borderLeft: `2px solid ${G}33`, marginLeft: '42px' }}>
                                <span style={{ color: G, fontSize: '8px', letterSpacing: '2px', display: 'block', marginBottom: '2px' }}>TEMĂ DE VIAȚĂ</span>{ess.lifeTheme}
                              </div>

                              {/* Cariera + Paleta specifica */}
                              <div style={{ paddingLeft: '42px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                  <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#8EB8D0', marginBottom: '3px' }}>CARIERĂ</div>
                                  <div style={{ fontSize: '9px', color: '#666', lineHeight: '1.6' }}>{ess.career}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#555', marginBottom: '3px' }}>PALETĂ SPECIFICĂ</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>{ess.colors.slice(0, 4).map(c => <span key={c} style={{ fontSize: '8px', padding: '2px 6px', border: '1px solid #1E1E1E', color: '#666' }}>{c}</span>)}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                <MoodBoard nums={results.nums} dominants={getDominants(results.nums)} styleName={getStyleTitle(getDominants(results.nums), results.nums, results.name, results.day)} styleDesc={getStyleDescription(getDominants(results.nums), results.nums)} />

                {/* CE LIPSESTE IN DOC */}
                {missingEls.length > 0 && (
                  <div style={{ marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid #181818' }}>
                    <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '6px' }}>CE ÎȚI LIPSEȘTE ȘI CAUȚI</div>
                    <p style={{ color: '#555', fontSize: '12px', fontStyle: 'italic', marginBottom: '14px' }}>Elementele absente sunt cele pe care le cauți instinctiv — pentru a completa ciclul.</p>
                    {missingEls.map(el => {
                      const info = EL[el];
                      const desc = MISSING_EL_DESC[el];
                      return (
                        <div key={el} style={{ padding: '12px 14px', marginBottom: '8px', border: `1px solid ${info.color}33`, background: info.color + '06' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '18px' }}>{info.icon}</span>
                            <span style={{ fontSize: '13px', color: info.color, letterSpacing: '2px' }}>{info.label.toUpperCase()} — ABSENT · CĂUTAT</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', marginBottom: '8px' }}>{desc.need}</div>
                          <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                            {desc.colorHex.map((c, idx) => <div key={idx}><div style={{ width: '32px', height: '32px', background: c, border: '1px solid #1E1E1E' }} /><div style={{ fontSize: '7px', color: '#444', width: '32px', textAlign: 'center', marginTop: '2px' }}>{desc.colors[idx]}</div></div>)}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>{desc.forms.map(f => `— ${f}`).join(' · ')}</div>
                          <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>{desc.energy}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ paddingTop: '20px', borderTop: '1px solid #181818', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#444', marginBottom: '14px' }}>PROIECTE RECOMANDATE · ANADECOR</div>
                  {results.matched.slice(0, 6).map(p => (
                    <a key={p.id} href={p.url || 'https://anadecor.ro'} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '12px', marginBottom: '10px', padding: '10px', border: '1px solid #141414', textDecoration: 'none', color: 'inherit' }} className="pc block">
                      <div style={{ width: '56px', height: '56px', flexShrink: 0, overflow: 'hidden' }}>
                        <ProjectBanner project={p} height={56} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: G, fontSize: '13px', marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{p.name} <span style={{ color: '#333', fontSize: '10px' }}>— {p.type}</span></span>
                          <span style={{ fontSize: '9px', color: '#a38049', textDecoration: 'underline' }}>vezi proiect →</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#444', marginBottom: '2px' }}>{p.cromatics.join(' · ')}</div>
                        <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>{p.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #141414' }}>
                  <div style={{ fontSize: '11px', color: '#333', letterSpacing: '2px' }}>ANADECOR · anadecor.ro · Constanța</div>
                  <button className="hb no-print" onClick={downloadPDF} style={S.btn}>⬇ DESCARCĂ DOCUMENT</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {page === 'profiles' && (
        <div>
          <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-5 border-b border-white/10 no-print">
            <div className="flex flex-col items-center cursor-pointer text-center" onClick={() => setPage('home')}>
              <div style={{ fontSize: '20px', fontWeight: '300', color: '#ffffff', letterSpacing: '0.15em', lineHeight: '1.1' }}>ANADECOR</div>
              <div style={{ fontSize: '14px', fontWeight: '400', color: '#a38049', letterSpacing: '0.25em', marginTop: '2px', textTransform: 'uppercase' }}>DESIGN - DNA</div>
            </div>
            <div className="flex items-center gap-4 sm:gap-7 flex-wrap justify-center no-print">
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500', opacity: 0.6, cursor: 'pointer' }} className="hb" onClick={() => setPage('home')}>Acasă</span>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500', opacity: 0.6, cursor: 'pointer' }} className="hb" onClick={() => setPage('profiles')}>Profiluri ({profiles.length})</span>
              <button className="hb" onClick={() => setPage('calculator')} style={{ ...S.btn, padding: '8px 16px' }}>+ Profil Nou</button>
            </div>
          </nav>
          <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 28px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#555', marginBottom: '12px' }}>PROFILURI SALVATE</div>
            <h2 style={{ fontSize: '32px', fontWeight: '300', marginBottom: '40px', color: '#EEE8DC' }}>Profiluri <span style={{ color: '#a38049' }}>({profiles.length})</span></h2>
            
            {/* PROFILE COMPARATOR CONTROL PANEL */}
            {profiles.length > 0 && (
              <div 
                data-selected={compareProfileNames.length === 2}
                style={{ background: '#121212', border: `1px solid ${compareProfileNames.length === 2 ? G : 'rgba(255,255,255,0.08)'}`, padding: '20px', borderRadius: '4px', marginBottom: '24px', transition: 'all 0.2s ease' }}
              >
                <div style={{ fontSize: '11px', letterSpacing: '3px', color: G, textTransform: 'uppercase', marginBottom: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#a38049' }}>COMPARATOR PROFILE SALVATE (SPLIT-VIEW)</span>
                  <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', color: '#888', padding: '2px 8px', borderRadius: '10px', letterSpacing: '1px' }}>{compareProfileNames.length} din 2 selectate</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '16px' }}>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>Profil A</label>
                    <select 
                      value={compareProfileNames[0] || ""} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setCompareProfileNames(prev => {
                          const next = [...prev];
                          if (val) {
                            next[0] = val;
                          } else {
                            next.shift();
                          }
                          const filtered = next.filter(Boolean);
                          if (filtered.length < 2) setShowProfileCompareView(false);
                          return filtered;
                        });
                      }}
                      style={{ width: '100%', background: '#0D0D0D', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: '2px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="" style={{ color: '#666' }}>-- Alege Profilul A --</option>
                      {profiles.map(p => (
                        <option key={p.name} value={p.name} disabled={compareProfileNames[1] === p.name} style={{ background: '#121212', color: '#FFF' }}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>Profil B</label>
                    <select 
                      value={compareProfileNames[1] || ""} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setCompareProfileNames(prev => {
                          const next = [...prev];
                          if (val) {
                            next[1] = val;
                          } else {
                            next.pop();
                          }
                          const filtered = next.filter(Boolean);
                          if (filtered.length < 2) setShowProfileCompareView(false);
                          return filtered;
                        });
                      }}
                      style={{ width: '100%', background: '#0D0D0D', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: '2px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="" style={{ color: '#666' }}>-- Alege Profilul B --</option>
                      {profiles.map(p => (
                        <option key={p.name} value={p.name} disabled={compareProfileNames[0] === p.name} style={{ background: '#121212', color: '#FFF' }}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', minWidth: '180px' }}>
                    <button
                      onClick={() => {
                        if (compareProfileNames.length === 2) {
                          setShowProfileCompareView(true);
                        }
                      }}
                      disabled={compareProfileNames.length !== 2}
                      style={{ 
                        padding: '12px 20px', 
                        background: compareProfileNames.length === 2 ? G : 'rgba(255,255,255,0.03)', 
                        color: compareProfileNames.length === 2 ? '#000' : 'rgba(255,255,255,0.2)',
                        border: compareProfileNames.length === 2 ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.08)',
                        cursor: compareProfileNames.length === 2 ? 'pointer' : 'not-allowed',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                        flex: 1
                      }}
                      className="hb"
                    >
                      Compară Lateral
                    </button>
                    {compareProfileNames.length > 0 && (
                      <button 
                        onClick={() => { setCompareProfileNames([]); setShowProfileCompareView(false); }}
                        style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '12px 14px', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        className="hb"
                        title="Resetează selecția"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span>* Sugestie: Poți face click direct pe butonul "+ Compară" de pe oricare dintre cardurile de mai jos.</span>
                  {compareProfileNames.length === 1 && (
                    <span style={{ color: G }}>Selectează încă un profil pentru a activa compararea laterală.</span>
                  )}
                  {compareProfileNames.length === 2 && !showProfileCompareView && (
                    <span style={{ color: G, fontWeight: 'bold' }}>✓ Profile selectate! Apasă pe butonul "Compară Lateral"</span>
                  )}
                </div>
              </div>
            )}

            {/* PROFILE COMPARE SCREEN */}
            {showProfileCompareView && compareProfileNames.length === 2 && (() => {
              const profileA = profiles.find(p => p.name === compareProfileNames[0]);
              const profileB = profiles.find(p => p.name === compareProfileNames[1]);
              if (profileA && profileB) {
                return (
                  <ProfileCompare 
                    profileA={profileA} 
                    profileB={profileB} 
                    onClose={() => setShowProfileCompareView(false)} 
                  />
                );
              }
              return null;
            })()}

            {profiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: '#333', border: '1px solid #141414' }}>
                <div style={{ fontSize: '36px', marginBottom: '16px', color: '#222' }}>▫</div>
                <p style={{ fontStyle: 'italic', marginBottom: '24px' }}>Niciun profil salvat.</p>
                <button className="hb" onClick={() => setPage('calculator')} style={S.btn}>CALCULEAZĂ ACUM</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '14px' }}>
                {profiles.map(p => {
                  const dp = getDominants(p.nums);
                  const domE = EL[dp[0]];
                  const isSelected = compareProfileNames.includes(p.name);
                  const selectedIdx = compareProfileNames.indexOf(p.name);
                  return (
                    <div 
                      key={p.name + p.savedAt} 
                      className="pc" 
                      data-selected={isSelected}
                      style={{ 
                        ...S.card, 
                        borderColor: isSelected ? G : '#1C1C1C', 
                        cursor: 'pointer',
                        boxShadow: isSelected ? `0 0 15px ${G}22` : 'none',
                        transition: 'all 0.15s ease'
                      }} 
                      onClick={() => { 
                        setResults({ ...p, matched: matchProjects(p.nums), elemRanking: getElemRanking(p.nums) }); 
                        setPage('results'); 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '16px', color: isSelected ? G : '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {p.name}
                            {isSelected && <span style={{ fontSize: '9px', background: G, color: '#000', padding: '1px 5px', borderRadius: '2px', fontWeight: 'bold' }}>{selectedIdx === 0 ? 'A' : 'B'}</span>}
                          </div>
                          <div style={{ fontSize: '11px', color: '#333', marginTop: '3px' }}>{p.day}/{p.month}/{p.year}</div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); deleteProfile(p.name); }} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }} className="hb">×</button>
                      </div>
                      <div style={{ fontSize: '11px', color: '#a38049', fontStyle: 'italic', marginBottom: '10px', letterSpacing: '0.5px', background: 'rgba(212, 175, 55, 0.05)', padding: '4px 8px', borderLeft: `2px solid ${G}` }}>
                        {getStyleTitle(dp, p.nums, p.name, p.day)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '7px 10px', border: `1px solid ${domE.color}33`, background: domE.color + '0A' }}>
                        <span style={{ fontSize: '16px' }}>{domE.icon}</span>
                        <span style={{ color: domE.color, letterSpacing: '2px', fontSize: '11px' }}>{dp.map(d => EL[d].label).join(' + ').toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '14px' }}>
                        {(Object.values(p.nums) as number[]).map((n, idx) => {
                          const e = numToEl(n);
                          return (
                            <span key={idx} style={{ width: '26px', height: '26px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: isMaster(n) ? '#FFD700' : EL[e].color, border: `1px solid ${isMaster(n) ? '#FFD70033' : EL[e].color + '33'}`, background: EL[e].color + '08' }}>{n}</span>
                          );
                        })}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: 'auto' }}>
                        <span style={{ fontSize: '9px', letterSpacing: '1px', color: '#a38049' }}>DESCHIDE DETALII →</span>
                        <button 
                          style={{ 
                            fontSize: '10px', 
                            letterSpacing: '1px',
                            background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: isSelected ? G : 'rgba(255,255,255,0.9)', 
                            border: isSelected ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.2)',
                            padding: '4px 10px',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            transition: 'all 0.15s ease'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompareProfileNames(prev => {
                              if (prev.includes(p.name)) {
                                const next = prev.filter(name => name !== p.name);
                                if (next.length < 2) setShowProfileCompareView(false);
                                return next;
                              }
                              const next = prev.length >= 2 ? [prev[1], p.name] : [...prev, p.name];
                              return next;
                            });
                          }}
                        >
                          {isSelected ? '✓ Selectat' : '+ Compară'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
