import { readFileSync } from "node:fs";
import zlib from "node:zlib";
import { PDFDocument } from 'pdf-lib';

/**
 * Extrator de especificação visual de um PDF: devolve os TEXTOS (posição,
 * fonte, tamanho, cor, conteúdo) e as FORMAS (retângulos e linhas).
 *
 *serve para comparar o PDF gerado pela aplicação com o PDF de referência do
 * aplicativo desktop: mesma lista de textos, mesmas coordenadas, mesmas cores.
 */

/* ------------------------------------------------------------- tokenizer */

function tokenize(content) {
  const tokens = [];
  let i = 0;
  while (i < content.length) {
    const ch = content[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '(') {
      let depth = 1, j = i + 1, out = '';
      while (j < content.length && depth > 0) {
        if (content[j] === '\\') { out += content[j] + content[j + 1]; j += 2; continue; }
        if (content[j] === '(') depth++;
        if (content[j] === ')') { depth--; if (!depth) break; }
        out += content[j]; j++;
      }
      tokens.push({ op: 'str', value: out });
      i = j + 1;
      continue;
    }
    if (ch === '<' && content[i + 1] !== '<') {
      const j = content.indexOf('>', i);
      tokens.push({ op: 'hex', value: content.slice(i + 1, j) });
      i = j + 1;
      continue;
    }
    if (ch === '<' && content[i + 1] === '<') {
      tokens.push({ op: 'op', value: '<<' });
      i += 2; continue;
    }
    if (ch === '>' && content[i + 1] === '>') {
      tokens.push({ op: 'op', value: '>>' });
      i += 2; continue;
    }
    if (ch === '[') { tokens.push({ op: 'op', value: '[' }); i++; continue; }
    if (ch === ']') { tokens.push({ op: 'op', value: ']' }); i++; continue; }
    if (ch === '/') {
      const m = /^\/[^\s/[\]()<>]+/.exec(content.slice(i));
      tokens.push({ op: 'name', value: m[0].slice(1) });
      i += m[0].length;
      continue;
    }
    const m = /^[+-]?(\d+\.?\d*|\.\d+)/.exec(content.slice(i));
    if (m) { tokens.push({ op: 'num', value: Number(m[0]) }); i += m[0].length; continue; }
    const m2 = /^[A-Za-z'"][^\s/[\]()<>]*/.exec(content.slice(i));
    if (m2) { tokens.push({ op: 'op', value: m2[0] }); i += m2[0].length; continue; }
    i++;
  }
  return tokens;
}

/* --------------------------------------------------------------- extração */

export function extrair(pdfPath) {
  const buf = readFileSync(pdfPath);
  return extrairBuffer(buf);
}

export async function extrairBuffer(buf) {
  // garante objetos "planos" (sem object streams) para a leitura
  try {
    const doc = await PDFDocument.load(buf, { updateMetadata: false, ignoreEncryption: true });
    buf = Buffer.from(await doc.save({ useObjectStreams: false }));
  } catch { /* segue com o buffer original */ }

  const txt = buf.toString('latin1');
  const objs = new Map();
  for (const m of txt.matchAll(/(\d+)\s+0\s+obj([\s\S]*?)endobj/g)) objs.set(Number(m[1]), m[2]);

  const streamDe = (objNum) => {
    const objStart = txt.indexOf(`${objNum} 0 obj`);
    if (objStart === -1) return null;
    const si = txt.indexOf('stream', objStart);
    if (si === -1) return null;
    const dict = txt.slice(objStart, si);
    const lm = /\/Length\s+(\d+)/.exec(dict);
    let s = si + 6;
    if (buf[s] === 13) s++;
    if (buf[s] === 10) s++;
    if (!lm) return null;
    const raw = buf.subarray(s, s + Number(lm[1]));
    if (/\/ASCII85Decode/.test(dict)) {
      let a = raw.toString('latin1').replace(/\s/g, '');
      const e = a.indexOf('~>'); if (e !== -1) a = a.slice(0, e);
      const out = []; let tuple = [];
      for (const ch of a) {
        if (ch === 'z' && !tuple.length) { out.push(0,0,0,0); continue; }
        const code = ch.charCodeAt(0) - 33;
        if (code < 0 || code > 84) continue;
        tuple.push(code);
        if (tuple.length === 5) { let v = 0; for (const t of tuple) v = v*85+t; out.push((v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255); tuple = []; }
      }
      if (tuple.length) { const n = tuple.length; while (tuple.length < 5) tuple.push(84); let v = 0; for (const t of tuple) v = v*85+t; const b=[(v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255]; out.push(...b.slice(0,n-1)); }
      try { return zlib.inflateSync(Buffer.from(out)).toString('latin1'); } catch { return null; }
    }
    try { return zlib.inflateSync(raw).toString('latin1'); } catch { return null; }
  };

  // ToUnicode por fonte
  const fontMap = new Map();
  for (const [num, body] of objs) {
    if (!/\/Type\s*\/Font/.test(body)) continue;
    const nameM = /\/Name\s*\/([^\s/\]>]+)/.exec(body);
    const tuM = /\/ToUnicode\s+(\d+)\s+0\s+R/.exec(body);
    if (!nameM) continue;
    const map = new Map();
    if (tuM) {
      const c = streamDe(Number(tuM[1])) || '';
      for (const bf of c.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
        for (const p of [...bf[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)]) {
          const code = parseInt(p[1], 16), hexs = p[2];
          let s = '';
          for (let i = 0; i < hexs.length; i += 4) s += String.fromCharCode(parseInt(hexs.slice(i, i+4), 16));
          map.set(code, s);
        }
      }
      for (const bf of c.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
        for (const r of [...bf[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)]) {
          const a = parseInt(r[1],16), b = parseInt(r[2],16), c0 = parseInt(r[3],16);
          for (let i = a; i <= b; i++) map.set(i, String.fromCharCode(c0 + (i - a)));
        }
      }
    }
    fontMap.set(nameM[1], { obj: num, map });
  }

  let conteudo = null;
  for (const [, body] of objs) {
    if (!/\/Type\s*\/Page\b/.test(body)) continue;
    const cm = /\/Contents\s*(?:\[\s*)?(\d+)\s+0\s+R/.exec(body);
    if (cm) { conteudo = streamDe(Number(cm[1])); if (conteudo) break; }
  }
  if (!conteudo) return { textos: [], formas: [] };

  const toks = tokenize(conteudo);
  const pilha = [];
  const textos = [], formas = [];
  let fill = null, stroke = null, font = null, size = null;
  let tm = [0, 0], ctm = [0, 0];
  let path = [];

  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.op === 'num' || t.op === 'name' || t.op === 'str' || t.op === 'hex') { pilha.push(t); continue; }
    const op = t.value;
    const nums = pilha.filter(p => p.op === 'num').map(p => p.value);
    switch (op) {
      case 'rg': if (nums.length >= 3) fill = nums.slice(0,3).map(v=>Math.round(v*255)); break;
      case 'RG': if (nums.length >= 3) stroke = nums.slice(0,3).map(v=>Math.round(v*255)); break;
      case 'Tf': {
        const nome = [...pilha].reverse().find(p => p.op === 'name');
        const sz = [...pilha].reverse().find(p => p.op === 'num');
        if (nome) font = nome.value;
        if (sz) size = sz.value;
        break;
      }
      case 'cm': if (nums.length >= 6) { ctm = [nums[4], nums[5]]; tm = [nums[4], nums[5]]; } break;
      case 'Tm': if (nums.length >= 6) tm = [nums[4], nums[5]]; break;
      case 'Td': if (nums.length >= 2) tm = [tm[0] + nums[0], tm[1] + nums[1]]; break;
      case 'T*': break;
      case 're': if (nums.length >= 4) path.push({ tipo: 'rect', x: nums[0], y: nums[1], w: nums[2], h: nums[3], cor: fill }); break;
      case 'm': if (nums.length >= 2) path.push({ tipo: 'move', x: nums[0], y: nums[1] }); break;
      case 'l': if (nums.length >= 2) path.push({ tipo: 'line', x: nums[0], y: nums[1] }); break;
      case 'c': if (nums.length >= 6) path.push({ tipo: 'curve', pts: [nums[0],nums[1],nums[2],nums[3],nums[4],nums[5]] }); break;
      case 'f':
      case 'f*': {
        for (const p of path) {
          if (p.tipo === 'rect') formas.push({ ...p, cor: fill });
          else if (p.tipo === 'move' || p.tipo === 'line' || p.tipo === 'curve') formas.push({ ...p, cor: stroke });
        }
        path = [];
        break;
      }
      case 'S': {
        for (const p of path) formas.push({ ...p, cor: stroke });
        path = [];
        break;
      }
      case 'Tj': {
        const s = pilha[pilha.length - 1];
        if (s && (s.op === 'str' || s.op === 'hex')) {
          let txt = '';
          if (s.op === 'hex') {
            const f = fontMap.get(font);
            const h = s.value;
            for (let k = 0; k + 3 < h.length + 1; k += 4) {
              const code = parseInt(h.slice(k, k+4), 16);
              txt += f?.map?.get(code) ?? '?';
            }
          } else {
            txt = s.value.replace(/\\([()\\])/g, '$1');
          }
          textos.push({ x: tm[0], y: tm[1], fonte: font, tamanho: size, cor: fill, texto: txt });
        }
        break;
      }
      case 'BT': tm = [0, 0]; break;
    }
    if (!['q', 'Q', 'gs', 'sh', 'Do', 'BI', 'EI', 'W', 'W*', 'n', 'g', 'G', 'cs', 'scn', 'sc', 'rg', 'RG', 'k', 'K', 'gs'].includes(op)) {
      // consome operandos
    }
    pilha.length = 0;
  }
  return { textos, formas };
}

export const hex = (c) => c ? '#' + c.map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase() : '?';

if (process.argv[2]) {
  const r = await extrair(process.argv[2]);
  console.log('TEXTOS:', r.textos.length);
  for (const t of r.textos) console.log(`  (${String(Math.round(t.x)).padStart(6)},${String(Math.round(t.y)).padStart(4)}) ${String(t.fonte).padEnd(6)} ${String(t.tamanho).padStart(5)} ${hex(t.cor).padEnd(8)} ${t.texto}`);
  console.log('\nFORMAS:', r.formas.length);
  for (const f of r.formas) {
    if (f.tipo === 'rect') console.log(`  rect  x=${Math.round(f.x)} y=${Math.round(f.y)} w=${Math.round(f.w)} h=${Math.round(f.h)} ${hex(f.cor)}`);
    else if (f.tipo === 'move') console.log(`  move  (${Math.round(f.x)},${Math.round(f.y)})`);
    else if (f.tipo === 'line') console.log(`  line  (${Math.round(f.x)},${Math.round(f.y)})`);
    else if (f.tipo === 'curve') console.log(`  curve ${f.pts.map(v=>Math.round(v)).join(',')}`);
  }
}
