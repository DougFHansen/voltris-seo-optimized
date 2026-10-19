/**
 * Extrator de texto e geometria de um PDF (usado nos testes da fatura).
 *
 * O PDF da fatura embute fontes SUBSETTADAS (Lato, DejaVu Sans Mono) com
 * codificação Identity-H: o texto no conteúdo é hexadecimal e precisa do
 * CMap /ToUnicode para virar letra. Ler o PDF "olhando" os bytes não
 * funciona — é por isso que este arquivo existe.
 */

import zlib from 'node:zlib';
import { PDFDocument } from 'pdf-lib';

interface Token { op: string; value: string | number }

function tokenize(content: string): Token[] {
    const tokens: Token[] = [];
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
        if (ch === '<' && content[i + 1] === '<') { tokens.push({ op: 'op', value: '<<' }); i += 2; continue; }
        if (ch === '>' && content[i + 1] === '>') { tokens.push({ op: 'op', value: '>>' }); i += 2; continue; }
        if (ch === '[') { tokens.push({ op: 'op', value: '[' }); i++; continue; }
        if (ch === ']') { tokens.push({ op: 'op', value: ']' }); i++; continue; }
        if (ch === '/') {
            const m = /^\/[^\s/[\]()<>]+/.exec(content.slice(i));
            tokens.push({ op: 'name', value: m![0].slice(1) });
            i += m![0].length;
            continue;
        }
        const num = /^[+-]?(\d+\.?\d*|\.\d+)/.exec(content.slice(i));
        if (num) { tokens.push({ op: 'num', value: Number(num[0]) }); i += num[0].length; continue; }
        const op = /^[A-Za-z'"][^\s/[\]()<>]*/.exec(content.slice(i));
        if (op) { tokens.push({ op: 'op', value: op[0] }); i += op[0].length; continue; }
        i++;
    }
    return tokens;
}

export interface TextoExtraido {
    x: number;
    y: number;
    fonte: string | null;
    tamanho: number | null;
    cor: number[] | null;
    texto: string;
}

export interface PdfExtraido {
    textos: TextoExtraido[];
    conteudo: string;
}

export async function extrairPdf(bytes: Uint8Array): Promise<PdfExtraido> {
    // Re-serializa sem object streams: o stream da página fica legível.
    const doc = await PDFDocument.load(bytes, { updateMetadata: false });
    const buf = Buffer.from(await doc.save({ useObjectStreams: false }));
    const txt = buf.toString('latin1');

    const objs = new Map<number, string>();
    for (const m of txt.matchAll(/(\d+)\s+0\s+obj([\s\S]*?)endobj/g)) objs.set(Number(m[1]), m[2]);

    const streamDe = (objNum: number): string | null => {
        const objStart = txt.indexOf(`${objNum} 0 obj`);
        if (objStart === -1) return null;
        const si = txt.indexOf('stream', objStart);
        if (si === -1) return null;
        const dict = txt.slice(objStart, si);
        const len = /\/Length\s+(\d+)/.exec(dict);
        if (!len) return null;
        let s = si + 6;
        if (buf[s] === 13) s++;
        if (buf[s] === 10) s++;
        const raw = buf.subarray(s, s + Number(len[1]));
        try {
            return zlib.inflateSync(raw).toString('latin1');
        } catch {
            return raw.toString('latin1');
        }
    };

    // recursos da página: nome no conteúdo -> objeto da fonte
    let recursos = new Map<string, number>();
    let conteudo: string | null = null;
    for (const [, body] of objs) {
        if (!/\/Type\s*\/Page\b/.test(body)) continue;
        const cm = /\/Contents\s*(?:\[\s*)?(\d+)\s+0\s+R/.exec(body);
        if (cm) conteudo = streamDe(Number(cm[1]));
        const fonts = /\/Font\s*<<([\s\S]*?)>>/.exec(body);
        if (fonts) {
            for (const m of fonts[1].matchAll(/\/([^\s/]+)\s+(\d+)\s+0\s+R/g)) {
                recursos.set(m[1], Number(m[2]));
            }
        }
        if (conteudo) break;
    }
    if (!conteudo) return { textos: [], conteudo: '' };

    // CMap /ToUnicode por objeto de fonte
    const toUnicode = new Map<number, Map<number, string>>();
    for (const [num, body] of objs) {
        const tu = /\/ToUnicode\s+(\d+)\s+0\s+R/.exec(body);
        if (!tu) continue;
        const c = streamDe(Number(tu[1]));
        if (!c) continue;
        const map = new Map<number, string>();
        for (const bf of c.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
            for (const p of [...bf[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)]) {
                const code = parseInt(p[1], 16);
                const hex = p[2];
                let s = '';
                for (let i = 0; i < hex.length; i += 4) s += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
                map.set(code, s);
            }
        }
        for (const bf of c.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
            for (const r of [...bf[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)]) {
                const a = parseInt(r[1], 16), b = parseInt(r[2], 16), c0 = parseInt(r[3], 16);
                for (let i = a; i <= b; i++) map.set(i, String.fromCharCode(c0 + (i - a)));
            }
        }
        toUnicode.set(num, map);
    }

    const pilha: Token[] = [];
    const textos: TextoExtraido[] = [];
    let fill: number[] | null = null;
    let font: string | null = null;
    let size: number | null = null;
    let tm: [number, number] = [0, 0];

    for (const t of tokenize(conteudo)) {
        if (t.op !== 'op') { pilha.push(t); continue; }
        const nums = pilha.filter((p) => p.op === 'num').map((p) => p.value as number);
        switch (t.value) {
            case 'rg': if (nums.length >= 3) fill = nums.slice(0, 3).map((v) => Math.round(v * 255)); break;
            case 'Tf': {
                const nome = [...pilha].reverse().find((p) => p.op === 'name');
                const sz = [...pilha].reverse().find((p) => p.op === 'num');
                if (nome) font = nome.value;
                if (sz) size = sz.value as number;
                break;
            }
            case 'Tm': if (nums.length >= 6) tm = [nums[4], nums[5]]; break;
            case 'Td': if (nums.length >= 2) tm = [tm[0] + nums[0], tm[1] + nums[1]]; break;
            case 'Tj': {
                const s = pilha[pilha.length - 1];
                if (s && (s.op === 'str' || s.op === 'hex')) {
                    let out = '';
                    if (s.op === 'hex') {
                        const map = toUnicode.get(recursos.get(font ?? '') ?? -1);
                        const h = s.value;
                        for (let k = 0; k + 3 < h.length + 1; k += 4) {
                            out += map?.get(parseInt(h.slice(k, k + 4), 16)) ?? '?';
                        }
                    } else {
                        out = s.value.replace(/\\([()\\])/g, '$1');
                    }
                    textos.push({ x: tm[0], y: tm[1], fonte: font, tamanho: size, cor: fill, texto: out });
                }
                break;
            }
            case 'BT': tm = [0, 0]; break;
        }
        pilha.length = 0;
    }
    return { textos, conteudo };
}

/** Só o texto, concatenado (para asserções simples). */
export async function extrairTextoDoPdf(bytes: Uint8Array): Promise<string> {
    const { textos } = await extrairPdf(bytes);
    return textos.map((t) => t.texto).join('\n');
}
