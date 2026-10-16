/**
 * ============================================================
 *  Blockchain Lecture 9 — PPTX Generator (ERC-721 NFTs)
 *  File:  generators/generate_lecture9.js
 *  Data:  data/lecture9_slides.json
 *  Out:   slides/Lecture9_ERC721_NFT_Standard.pptx
 *  Run:   npm run slides:9
 * ============================================================
 *
 *  Every slide in the JSON has a `type` with one renderer each:
 *    title · agenda · section · bullets · two_column · cards ·
 *    code · table · flow · tree · closing
 *  Optional on any slide: `notes` (speaker notes) and `source`
 *  (caption above the footer). Text inside `backticks` is set in
 *  Consolas. Code may be a string or an array of lines.
 */

const pptxgen = require("pptxgenjs");
const fs      = require("fs");
const path    = require("path");

// ── Config ───────────────────────────────────────────────────
const LECTURE     = 9;
const ROOT        = path.join(__dirname, "..");
const DATA_FILE   = path.join(ROOT, "data", "lecture9_slides.json");
const OUTPUT_FILE = path.join(ROOT, "slides", "Lecture9_ERC721_NFT_Standard.pptx");
const FOOTER      = `Blockchain Course  |  Lecture ${LECTURE}`;

const { presentation, slides } = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

// ── Colour Palette (same as Lecture 8) ───────────────────────
const C = {
  darkBg  : "0D1B2A",
  panel   : "1B2E45",
  slideBg : "F4F7FB",
  cardBg  : "FFFFFF",
  border  : "E2E8F0",
  codeBg  : "1E293B",
  codeBar : "0F172A",
  codeBdr : "334155",
  codeText: "E2E8F0",
  codeCmt : "8A9BB3",
  primary : "1A6FBF",
  accent  : "00C6AE",
  amber   : "F59E0B",
  red     : "E74C3C",
  purple  : "9B59B6",
  green   : "27AE60",
  white   : "FFFFFF",
  textDk  : "0D1B2A",
  textBd  : "334155",
  textMd  : "64748B",
  textLt  : "CBD5E1",
};
const PAL         = [C.primary, C.accent, C.amber, C.red, C.purple, C.green];
const SECTION_PAL = [C.accent, C.primary, C.amber, C.purple, C.green];
const NAMED       = { primary: C.primary, accent: C.accent, amber: C.amber, red: C.red, purple: C.purple, green: C.green, dark: C.darkBg };
const pc          = (i) => PAL[i % PAL.length];
const inkOn       = (fill) => (fill === C.accent || fill === C.amber ? C.textDk : C.white);

function colorOf(name, i = 0) {
  if (!name) return pc(i);
  if (!NAMED[name]) throw new Error(`Unknown colour "${name}"`);
  return NAMED[name];
}

// ── Layout (LAYOUT_16x9 = 10 × 5.625 in) ─────────────────────
const FONT      = "Calibri";
const MONO      = "Consolas";
const W         = 10;
const H         = 5.625;
const X0        = 0.4;    // content left edge
const CW        = 9.2;    // content width
const TOP       = 1.32;   // first row under the title bar
const GAP       = 0.15;
const LINE      = 1.2;    // body line height (× font size)
const CODE_LINE = 1.18;   // code line height (× font size)
const SANS_EM   = 0.5;    // average Calibri advance in em (slightly generous)
const MONO_EM   = 0.56;   // Consolas advance in em
const contentBottom = (s) => (s.source ? 4.96 : 5.16);

// ── Init ─────────────────────────────────────────────────────
const pres = new pptxgen();
pres.layout  = "LAYOUT_16x9";
pres.author  = presentation.author;
pres.title   = presentation.title;
pres.subject = presentation.subject;

// ── Small utilities ──────────────────────────────────────────
const SH      = () => ({ type: "outer", color: "000000", opacity: 0.1, blur: 8, offset: 3, angle: 135 });
const clamp   = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const halfPt  = (v) => Math.floor(v * 2) / 2;
const asText  = (v) => (Array.isArray(v) ? v.join("\n") : String(v ?? ""));
const asLines = (v) => asText(v).replace(/\s+$/, "").split("\n");

function mix(hex, target, k) {
  const a = parseInt(hex, 16);
  const b = parseInt(target, 16);
  return [16, 8, 0]
    .map((s) => Math.round(((a >> s) & 255) + (((b >> s) & 255) - ((a >> s) & 255)) * k))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}
const tint  = (hex, k) => mix(hex, "FFFFFF", k);
const shade = (hex, k) => mix(hex, "000000", k);

let slideNo = 0;
const warn = (msg) => console.warn(`⚠️  Slide ${slideNo}: ${msg}`);

// Rough text metrics, used to size boxes and pick font sizes.
function textWidth(value, fs, mono = false) {
  return String(value)
    .split("`")
    .reduce((w, part, i) => w + (part.length * fs * (mono || i % 2 ? MONO_EM : SANS_EM)) / 72, 0);
}
function lineCount(value, w, fs, mono = false) {
  return asText(value)
    .split("\n")
    .reduce((n, line) => n + Math.max(1, Math.ceil((textWidth(line, fs, mono) * 1.1) / Math.max(w, 0.3))), 0);
}
const textHeight = (value, w, fs, mono = false) => (lineCount(value, w, fs, mono) * fs * LINE) / 72;

function fitFont(value, w, h, maxFs, minFs, mono = false) {
  let fs = maxFs;
  while (fs > minFs && textHeight(value, w, fs, mono) > h) fs -= 0.5;
  return fs;
}
const monoFit = (value, w, maxFs, minFs = 8) =>
  clamp(halfPt(((w - 0.1) * 72) / (Math.max(1, String(value).length) * MONO_EM)), minFs, maxFs);

// ── Drawing primitives ───────────────────────────────────────
function box(slide, x, y, w, h, fill, o = {}) {
  slide.addShape(o.radius ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: o.transparency ? { color: fill, transparency: o.transparency } : { color: fill },
    line: { color: o.line || fill, width: o.lineWidth || 0.75 },
    ...(o.radius ? { rectRadius: o.radius } : {}),
    ...(o.shadow ? { shadow: SH() } : {}),
  });
}

function oval(slide, x, y, d, fill, transparency) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: d, h: d, fill: { color: fill, transparency }, line: { color: fill },
  });
}

function arrow(slide, x1, y1, x2, y2, color = C.textMd) {
  slide.addShape(pres.shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color, width: 1.75, endArrowType: "triangle" },
  });
}

function text(slide, value, o) {
  slide.addText(value, { fontFace: FONT, margin: 0, ...o });
}

// Splits `code` spans into Consolas runs.
function runs(value, o = {}) {
  const { codeColor = C.primary, ...base } = o;
  return String(value)
    .split("`")
    .map((part, i) => ({ text: part, options: i % 2 ? { ...base, fontFace: MONO, color: codeColor } : { ...base } }))
    .filter((r) => r.text !== "");
}

function rich(slide, value, o) {
  const { fontSize, color, codeColor, bold, ...rest } = o;
  slide.addText(runs(value, { fontSize, color, codeColor, bold }), {
    fontFace: FONT, margin: 0, lineSpacing: fontSize * LINE, fontSize, color, ...rest,
  });
}

// ── Shared slide parts ───────────────────────────────────────
function titleBar(slide, title, accent = C.accent) {
  box(slide, 0, 0, W, 1.08, C.darkBg);
  box(slide, 0, 1.08, W, 0.065, accent);
  const fs = title.length > 50 ? 23 : title.length > 40 ? 26 : 28;
  text(slide, title, { x: 0.45, y: 0, w: 9.1, h: 1.08, fontSize: fs, bold: true, color: C.white, valign: "middle" });
}

function pgFooter(slide) {
  text(slide, FOOTER, { x: 0, y: 5.33, w: W, h: 0.29, fontSize: 9, color: C.textMd, align: "center", valign: "middle" });
}

function sourceCaption(slide, value) {
  text(slide, `Source: ${value}`, { x: X0, y: 5.02, w: CW, h: 0.26, fontSize: 8.5, italic: true, color: C.textMd, valign: "middle" });
}

function lightSlide(slide, s) {
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title);
  pgFooter(slide);
}

function introBox(slide, value, x, y, w) {
  const fs = 13;
  const h = textHeight(value, w - 0.36, fs) + 0.2;
  box(slide, x, y, w, h, "EAF2FB", { line: "C9DCF2" });
  box(slide, x, y, 0.07, h, C.primary);
  rich(slide, value, { x: x + 0.2, y, w: w - 0.32, h, fontSize: fs, color: C.textDk, valign: "middle" });
  return h;
}

const KINDS = {
  info  : { bar: C.primary, bg: "EAF2FB", ink: "1A5FA3", label: "NOTE" },
  tip   : { bar: C.accent,  bg: "E6F8F5", ink: "0B8A79", label: "KEY IDEA" },
  warn  : { bar: C.amber,   bg: "FEF5E5", ink: "B26A00", label: "REMEMBER" },
  danger: { bar: C.red,     bg: "FDECEA", ink: "B83227", label: "SECURITY" },
};

function kindOf(c) {
  const k = KINDS[c.kind || "info"];
  if (!k) throw new Error(`Unknown callout kind "${c.kind}"`);
  return k;
}

function calloutHeight(c, w = CW) {
  return textHeight(`${c.label || kindOf(c).label}    ${c.text}`, w - 0.36, 12) + 0.2;
}

function callout(slide, c, x, y, w, h) {
  const k = kindOf(c);
  box(slide, x, y, w, h, k.bg, { line: tint(k.bar, 0.55) });
  box(slide, x, y, 0.07, h, k.bar);
  slide.addText(
    [
      { text: `${c.label || k.label}    `, options: { bold: true, color: k.ink, fontSize: 10.5, charSpacing: 1 } },
      ...runs(c.text, { fontSize: 12, color: C.textDk }),
    ],
    { x: x + 0.2, y, w: w - 0.32, h, fontFace: FONT, margin: 0, valign: "middle", lineSpacing: 12 * LINE }
  );
}

// One text box per item, so wrapped lines stay indented next to the marker.
function bulletList(slide, items, x, y, w, h, o = {}) {
  const { numbered = false, color, maxFs = 14, minFs = 10, gap = 0.1, ink = C.textBd, codeColor = C.primary } = o;
  const markW = numbered ? 0.44 : 0.26;
  const tw = w - markW;
  const rowsAt = (fs) => items.map((t) => Math.max(textHeight(t, tw, fs) + 0.05, numbered ? 0.34 : 0));
  const total = (rows) => rows.reduce((a, b) => a + b, 0) + gap * (rows.length - 1);

  let fs = maxFs;
  let rows = rowsAt(fs);
  while (fs > minFs && total(rows) > h) rows = rowsAt((fs -= 0.5));
  if (total(rows) > h + 0.02) warn(`list overflows its box by ${(total(rows) - h).toFixed(2)} in`);

  let cy = y;
  items.forEach((t, i) => {
    const c = color || (numbered ? pc(i) : C.accent);
    const mid = cy + 0.028 + (fs * LINE) / 144;
    if (numbered) {
      oval(slide, x, mid - 0.16, 0.32, c);
      text(slide, String(i + 1), { x, y: mid - 0.16, w: 0.32, h: 0.32, fontSize: 11, bold: true, color: inkOn(c), align: "center", valign: "middle" });
    } else {
      box(slide, x + 0.04, mid - 0.05, 0.1, 0.1, c);
    }
    rich(slide, t, { x: x + markW, y: cy, w: tw, h: rows[i], fontSize: fs, color: ink, codeColor, valign: "top", margin: [0, 0, 0, 2] });
    cy += rows[i] + gap;
  });
  return cy - gap - y;
}

// Grey comments, everything else in the normal code colour.
function commentStart(line) {
  let quoted = false;
  for (let i = 0; i < line.length - 1; i++) {
    if (line[i] === '"') quoted = !quoted;
    else if (!quoted && line[i] === "/" && line[i + 1] === "/") return i;
  }
  return -1;
}

function codeRuns(lines) {
  const out = [];
  lines.forEach((line, i) => {
    const cut = commentStart(line);
    const parts = (cut < 0 ? [[line, C.codeText]] : [[line.slice(0, cut), C.codeText], [line.slice(cut), C.codeCmt]])
      .filter(([t]) => t !== "");
    if (!parts.length) parts.push([" ", C.codeText]);
    parts.forEach(([t, color], j) =>
      out.push({ text: t, options: { color, breakLine: j === parts.length - 1 && i < lines.length - 1 } })
    );
  });
  return out;
}

function codeFont(lines, w, h, maxFs = 11.5, minFs = 7.5) {
  const cols = Math.max(1, ...lines.map((l) => l.length));
  const fit = Math.min(maxFs, ((w - 0.26) * 72) / (cols * MONO_EM), ((h - 0.18) * 72) / (lines.length * CODE_LINE));
  if (fit < minFs) warn(`code block (${lines.length} lines × ${cols} cols) needs ${fit.toFixed(1)} pt and may overflow`);
  return clamp(halfPt(fit), minFs, maxFs);
}

// Font size follows the box; height shrinks to the code unless `stretch`.
function codeBox(slide, code, x, y, w, maxH, label, o = {}) {
  const lines = asLines(code);
  const barH = label ? 0.3 : 0;
  const fs = o.fontSize || codeFont(lines, w, maxH - barH);
  const natural = barH + 0.18 + (lines.length * fs * CODE_LINE) / 72;
  const h = o.stretch ? maxH : Math.min(maxH, natural);

  box(slide, x, y, w, h, C.codeBg, { line: C.codeBdr, shadow: true });
  if (label) {
    box(slide, x, y, w, barH, C.codeBar, { line: C.codeBdr });
    text(slide, label, { x: x + 0.12, y, w: w - 0.24, h: barH, fontFace: MONO, fontSize: 9, bold: true, color: C.accent, valign: "middle" });
  }
  slide.addText(codeRuns(lines), {
    x: x + 0.13, y: y + barH + 0.08, w: w - 0.2, h: h - barH - 0.12,
    fontFace: MONO, fontSize: fs, margin: 0, valign: "top", lineSpacing: fs * CODE_LINE,
  });
  return h;
}

// A card with a coloured header; its body renders `big`, `code` and `items` in JSON order.
function column(slide, col, x, y, w, h, c) {
  box(slide, x, y, w, h, C.cardBg, { line: C.border, shadow: true });
  box(slide, x, y, w, 0.44, c);
  const mono = col.mono ?? /\w\(/.test(col.heading);
  text(slide, col.heading, {
    x: x + 0.15, y, w: w - 0.3, h: 0.44, bold: true, color: inkOn(c), valign: "middle",
    fontFace: mono ? MONO : FONT, fontSize: mono ? monoFit(col.heading, w - 0.3, 14, 10) : 14,
  });

  const ix = x + 0.15;
  const iw = w - 0.3;
  const end = y + h - 0.12;
  const keys = Object.keys(col).filter((k) => k === "big" || k === "code" || k === "items");
  let cy = y + 0.58;
  keys.forEach((key, i) => {
    const reserve = keys.slice(i + 1).reduce((r, k) => r + (k === "big" ? 0.66 : 0.55), 0);
    if (key === "big") {
      box(slide, ix, cy, iw, 0.54, tint(c, 0.88), { line: tint(c, 0.6) });
      text(slide, col.big, {
        x: ix, y: cy, w: iw, h: 0.54, fontFace: MONO, fontSize: monoFit(col.big, iw - 0.2, 17, 10),
        bold: true, color: shade(c, 0.25), align: "center", valign: "middle",
      });
      cy += 0.66;
    } else if (key === "code") {
      cy += codeBox(slide, col.code, ix, cy, iw, end - cy - reserve) + 0.12;
    } else {
      cy += bulletList(slide, col.items, ix, cy + 0.04, iw, end - cy - reserve - 0.04, { color: c, maxFs: 13, minFs: 10 }) + 0.16;
    }
  });
}

function cardLayout(card, w, monoTitle) {
  const iw = w - 0.26;
  const titleFs = monoTitle ? monoFit(card.title, iw, 13, 9) : lineCount(card.title, iw, 15) > 1 ? 13.5 : 15;
  const titleH = textHeight(card.title, iw, titleFs, monoTitle) + 0.04;
  const codeFs = card.code ? monoFit(card.code, iw - 0.1, 11.5, 8) : 0;
  const textFs = 12;
  const bodyH = card.text ? textHeight(card.text, iw, textFs) + 0.04 : 0;
  const itemsH = card.items ? card.items.reduce((sum, t) => sum + textHeight(t, iw - 0.26, 11.5) + 0.11, 0) : 0;
  const total = 0.2 + titleH + 0.08 + (card.code ? 0.44 : 0) + bodyH + (card.items ? itemsH + 0.06 : 0) + 0.14;
  return { iw, titleFs, titleH, codeFs, textFs, bodyH, total };
}

function drawCard(slide, card, x, y, w, h, c, monoTitle) {
  const L = cardLayout(card, w, monoTitle);
  const ix = x + 0.13;
  box(slide, x, y, w, h, C.cardBg, { line: C.border, shadow: true });
  box(slide, x, y, w, 0.08, c);

  let cy = y + 0.2;
  text(slide, card.title, {
    x: ix, y: cy, w: L.iw, h: L.titleH, fontSize: L.titleFs, bold: true, color: shade(c, 0.2),
    fontFace: monoTitle ? MONO : FONT, valign: "top", lineSpacing: L.titleFs * LINE,
  });
  cy += L.titleH + 0.08;
  if (card.code) {
    box(slide, ix, cy, L.iw, 0.36, "F1F5F9", { line: C.border });
    text(slide, card.code, { x: ix, y: cy, w: L.iw, h: 0.36, fontFace: MONO, fontSize: L.codeFs, color: C.textDk, align: "center", valign: "middle" });
    cy += 0.44;
  }
  if (card.text) {
    rich(slide, card.text, { x: ix, y: cy, w: L.iw, h: L.bodyH, fontSize: L.textFs, color: C.textBd, valign: "top" });
    cy += L.bodyH;
  }
  if (card.items) {
    bulletList(slide, card.items, ix, cy + 0.06, L.iw, y + h - cy - 0.16, { color: c, maxFs: 11.5, minFs: 9.5, gap: 0.06 });
  }
}

// ── Renderers ────────────────────────────────────────────────
function renderTitle(slide, s) {
  slide.background = { color: C.darkBg };
  box(slide, 0, 0, 0.12, H, C.accent);
  oval(slide, 6.5, -1.2, 5.2, "1A3A5C", 35);
  oval(slide, 7.6, 2.9, 2.8, C.accent, 68);

  box(slide, 0.5, 0.7, 2.2, 0.36, C.accent);
  text(slide, s.tag, { x: 0.5, y: 0.7, w: 2.2, h: 0.36, fontSize: 10, bold: true, color: C.textDk, align: "center", valign: "middle", charSpacing: 2 });
  text(slide, s.title, { x: 0.5, y: 1.2, w: 8.6, h: 1.55, fontSize: 42, bold: true, color: C.white, valign: "top", lineSpacing: 48 });
  text(slide, s.subtitle, { x: 0.5, y: 2.85, w: 8.8, h: 0.45, fontSize: 14, color: C.accent, valign: "top" });
  box(slide, 0.5, 3.45, 5.5, 0.045, C.textLt, { transparency: 45 });
  text(slide, s.duration, { x: 0.5, y: 3.6, w: 8.8, h: 0.36, fontSize: 12, color: C.textLt, valign: "middle" });
  if (s.footer) text(slide, s.footer, { x: 0.5, y: 4.1, w: 8.8, h: 0.35, fontSize: 11, color: C.textMd, valign: "middle" });
}

function renderAgenda(slide, s) {
  lightSlide(slide, s);
  const items = s.items;
  const twoCols = items.length > 6;
  const perCol = twoCols ? Math.ceil(items.length / 2) : items.length;
  const note = s.note ? { kind: "info", text: s.note } : null;
  const noteH = note ? calloutHeight(note) : 0;
  const bottom = 5.16 - (note ? noteH + GAP : 0);
  const rowH = Math.min(0.78, (bottom - TOP + 0.1) / perCol);
  const colW = twoCols ? (CW - 0.25) / 2 : CW;
  const timeW = 1.35;

  items.forEach((it, i) => {
    const x = X0 + (twoCols ? Math.floor(i / perCol) : 0) * (colW + 0.25);
    const y = TOP + (twoCols ? i % perCol : i) * rowH;
    const h = rowH - 0.1;
    const c = pc(i);
    const lw = colW - timeW - 0.4;
    box(slide, x, y, colW, h, C.cardBg, { line: C.border, shadow: true });
    box(slide, x, y, 0.08, h, c);
    text(slide, it.time, { x: x + 0.22, y, w: timeW, h, fontSize: 11.5, bold: true, color: shade(c, 0.15), valign: "middle" });
    rich(slide, it.label, { x: x + 0.22 + timeW, y, w: lw, h, fontSize: fitFont(it.label, lw, h - 0.06, 14, 10.5), color: C.textDk, valign: "middle" });
  });
  if (note) callout(slide, note, X0, 5.16 - noteH, CW, noteH);
}

let sectionCount = 0;
function renderSection(slide, s) {
  const accent = s.color ? colorOf(s.color) : SECTION_PAL[sectionCount++ % SECTION_PAL.length];
  slide.background = { color: C.darkBg };
  oval(slide, -1, -1, 5, "1A3A5C", 30);
  oval(slide, 7.2, 2.8, 3.8, C.accent, 70);
  box(slide, 0, 0, 0.12, H, accent);
  box(slide, 0.5, 1.35, 3.0, 0.36, accent);
  text(slide, s.section, { x: 0.5, y: 1.35, w: 3.0, h: 0.36, fontSize: 10, bold: true, color: inkOn(accent), align: "center", valign: "middle", charSpacing: 1.5 });
  text(slide, s.title, { x: 0.5, y: 1.85, w: 9, h: 1.0, fontSize: fitFont(s.title, 9, 0.75, 40, 28), bold: true, color: C.white, valign: "middle" });
  text(slide, s.subtitle, { x: 0.5, y: 3.0, w: 8.8, h: 0.55, fontSize: 15, color: accent, valign: "top" });
}

function renderBullets(slide, s) {
  lightSlide(slide, s);
  let y = TOP;
  if (s.intro) y += introBox(slide, s.intro, X0, y, CW) + GAP;
  const bottom = contentBottom(s);
  const cH = s.callout ? calloutHeight(s.callout) : 0;
  const listBottom = bottom - (cH ? cH + GAP : 0);
  bulletList(slide, s.points, X0 + 0.1, y + 0.12, CW - 0.2, listBottom - y - 0.12, {
    numbered: s.numbered, maxFs: 16, minFs: 11, gap: s.numbered ? 0.2 : 0.16,
  });
  if (s.callout) callout(slide, s.callout, X0, bottom - cH, CW, cH);
}

function renderTwoColumn(slide, s) {
  lightSlide(slide, s);
  let y = TOP;
  if (s.intro) y += introBox(slide, s.intro, X0, y, CW) + GAP;
  const bottom = contentBottom(s);
  const cH = s.callout ? calloutHeight(s.callout) : 0;
  const colBottom = bottom - (cH ? cH + GAP : 0);
  const colW = (CW - 0.25) / 2;
  [s.left, s.right].forEach((col, i) =>
    column(slide, col, X0 + i * (colW + 0.25), y, colW, colBottom - y, colorOf(col.color, i))
  );
  if (s.callout) callout(slide, s.callout, X0, bottom - cH, CW, cH);
}

function renderCards(slide, s) {
  lightSlide(slide, s);
  let y = TOP;
  if (s.intro) y += introBox(slide, s.intro, X0, y, CW) + GAP;
  const bottom = contentBottom(s);
  const cH = s.callout ? calloutHeight(s.callout) : 0;
  const gridBottom = bottom - (cH ? cH + GAP : 0);

  const n = s.cards.length;
  const cols = s.columns || (n <= 4 ? n : n <= 6 ? 3 : 4);
  const rows = Math.ceil(n / cols);
  const cw = (CW - (cols - 1) * GAP) / cols;
  const room = (gridBottom - y - (rows - 1) * GAP) / rows;
  const natural = Math.max(...s.cards.map((card) => cardLayout(card, cw, s.monoTitles).total));
  if (natural > room + 0.02) warn(`cards need ${natural.toFixed(2)} in but only ${room.toFixed(2)} in is free`);
  const ch = Math.min(room, natural + 0.45);
  const gy = y + (gridBottom - y - (rows * ch + (rows - 1) * GAP)) / 2;

  s.cards.forEach((card, i) =>
    drawCard(slide, card, X0 + (i % cols) * (cw + GAP), gy + Math.floor(i / cols) * (ch + GAP), cw, ch, colorOf(card.color, i), s.monoTitles)
  );
  if (s.callout) callout(slide, s.callout, X0, bottom - cH, CW, cH);
}

function renderCode(slide, s) {
  lightSlide(slide, s);
  let y = TOP;
  if (s.intro) y += introBox(slide, s.intro, X0, y, CW) + GAP;
  const bottom = contentBottom(s);
  const cH = s.callout ? calloutHeight(s.callout) : 0;
  const room = bottom - (cH ? cH + GAP : 0) - y;
  const blocks = s.blocks;

  if (blocks.length === 2) {
    if (s.points) throw new Error(`Slide ${slideNo}: a code slide with two blocks cannot have points`);
    const bw = (CW - 0.2) / 2;
    const fs = Math.min(...blocks.map((b) => codeFont(asLines(b.code), bw, room - 0.3)));
    blocks.forEach((b, i) => codeBox(slide, b.code, X0 + i * (bw + 0.2), y, bw, room, b.label, { fontSize: fs, stretch: true }));
  } else if (s.points) {
    const lines = asLines(blocks[0].code);
    const cols = Math.max(...lines.map((l) => l.length));
    const cw = clamp((cols * MONO_EM * 10.5) / 72 + 0.3, 4.6, 6.2);
    codeBox(slide, blocks[0].code, X0, y, cw, room, blocks[0].label);
    bulletList(slide, s.points, X0 + cw + 0.3, y + 0.06, CW - cw - 0.3, room - 0.06, { maxFs: 13, minFs: 10, gap: 0.12 });
  } else {
    codeBox(slide, blocks[0].code, X0, y, CW, room, blocks[0].label);
  }
  if (s.callout) callout(slide, s.callout, X0, bottom - cH, CW, cH);
}

function renderTable(slide, s) {
  lightSlide(slide, s);
  let y = TOP;
  if (s.intro) y += introBox(slide, s.intro, X0, y, CW) + GAP;
  const bottom = contentBottom(s);
  const cH = s.callout ? calloutHeight(s.callout) : 0;
  const room = bottom - (cH ? cH + GAP : 0) - y;

  const tw = s.points ? 4.3 : CW;
  const nCols = s.headers.length;
  const colW = s.colW || Array(nCols).fill(tw / nCols);
  const fs = nCols >= 4 ? 12 : 13;
  const rowH = Math.min(0.52, room / (s.rows.length + 1));
  const cell = (value, o) => ({ text: value, options: { valign: "middle", fontSize: fs, fontFace: FONT, ...o } });
  const head = s.headers.map((h, ci) =>
    cell(h, { bold: true, color: C.white, align: "center", fill: { color: ci === 0 ? C.darkBg : pc(ci - 1) } })
  );
  const body = s.rows.map((row, ri) =>
    row.map((v, ci) =>
      cell(v, {
        bold: ci === 0, color: ci === 0 ? C.textDk : C.textBd,
        align: ci === 0 && nCols > 2 ? "left" : "center",
        fill: { color: ri % 2 ? C.cardBg : "F8FAFC" },
      })
    )
  );
  slide.addTable([head, ...body], {
    x: X0, y, w: tw, colW, rowH, margin: [0.04, 0.1, 0.04, 0.1],
    border: { type: "solid", pt: 1, color: C.border },
  });
  if (s.points) {
    bulletList(slide, s.points, X0 + tw + 0.35, y + 0.08, CW - tw - 0.35, room - 0.08, { maxFs: 15, minFs: 11, gap: 0.16 });
  }
  if (s.callout) callout(slide, s.callout, X0, bottom - cH, CW, cH);
}

// Boxes joined by arrows; more than five steps wrap into a second row that runs right-to-left.
function renderFlow(slide, s) {
  lightSlide(slide, s);
  let y = TOP;
  if (s.intro) y += introBox(slide, s.intro, X0, y, CW) + GAP;
  const bottom = contentBottom(s);
  const cH = s.callout ? calloutHeight(s.callout) : 0;
  const areaBottom = bottom - (cH ? cH + GAP : 0);

  const steps = s.steps;
  const n = steps.length;
  const perRow = n > 5 ? Math.ceil(n / 2) : n;
  const nRows = Math.ceil(n / perRow);
  const arrowW = steps.some((st) => st.arrow) ? 1.4 : 0.48;
  const bw = Math.min(2.5, (CW - (perRow - 1) * arrowW) / perRow);
  const bh = steps.some((st) => st.sub) ? 0.92 : 0.66;
  const rowGap = 0.42;
  const x0 = X0 + (CW - (perRow * bw + (perRow - 1) * arrowW)) / 2;
  const at = (i) => {
    const r = Math.floor(i / perRow);
    const k = i % perRow;
    return { x: x0 + (r % 2 ? perRow - 1 - k : k) * (bw + arrowW), y: y + r * (bh + rowGap) };
  };

  steps.forEach((st, i) => {
    const p = at(i);
    const c = colorOf(st.color, i);
    box(slide, p.x, p.y, bw, bh, tint(c, 0.88), { line: c, lineWidth: 1.5, radius: 0.08, shadow: true });
    const label = {
      x: p.x + 0.08, w: bw - 0.16, bold: true, color: C.textDk, align: "center", fontFace: st.mono ? MONO : FONT,
      fontSize: st.mono ? monoFit(st.label, bw - 0.2, 13, 9) : fitFont(st.label, bw - 0.2, st.sub ? 0.42 : bh - 0.1, 14, 10.5),
    };
    if (st.sub) {
      text(slide, st.label, { ...label, y: p.y + 0.06, h: bh * 0.5 - 0.04, valign: "bottom" });
      rich(slide, st.sub, {
        x: p.x + 0.08, y: p.y + bh * 0.5 + 0.02, w: bw - 0.16, h: bh * 0.5 - 0.08,
        fontSize: fitFont(st.sub, bw - 0.16, bh * 0.5 - 0.08, 11, 9), color: C.textBd, align: "center", valign: "top",
      });
    } else {
      text(slide, st.label, { ...label, y: p.y, h: bh, valign: "middle" });
    }

    if (i === n - 1) return;
    const q = at(i + 1);
    if (q.y === p.y) {
      const right = q.x > p.x;
      const x1 = right ? p.x + bw + 0.07 : p.x - 0.07;
      const x2 = right ? q.x - 0.07 : q.x + bw + 0.07;
      arrow(slide, x1, p.y + bh / 2, x2, p.y + bh / 2);
      if (st.arrow) {
        text(slide, st.arrow, { x: Math.min(x1, x2), y: p.y + bh / 2 - 0.32, w: Math.abs(x2 - x1), h: 0.26, fontSize: 10.5, italic: true, color: C.textMd, align: "center", valign: "bottom" });
      }
    } else {
      arrow(slide, p.x + bw / 2, p.y + bh + 0.06, q.x + bw / 2, q.y - 0.06);
    }
  });

  y += nRows * bh + (nRows - 1) * rowGap + 0.28;
  const room = areaBottom - y;
  if ((s.code || s.points) && room < 0.5) warn("little room left under the flow");
  if (s.code && s.points) {
    const halfW = (CW - 0.3) / 2;
    codeBox(slide, s.code, X0, y, halfW, room, s.codeLabel);
    bulletList(slide, s.points, X0 + halfW + 0.3, y + 0.04, halfW, room - 0.04, { maxFs: 13, minFs: 10 });
  } else if (s.code) {
    codeBox(slide, s.code, X0, y, CW, room, s.codeLabel);
  } else if (s.points) {
    bulletList(slide, s.points, X0, y, CW, room, { maxFs: 14, minFs: 10 });
  }
  if (s.callout) callout(slide, s.callout, X0, bottom - cH, CW, cH);
}

const parentsOf = (node) => (node.parent === undefined ? [] : [].concat(node.parent));
const spread = (n, w, gap, centre) => Array.from({ length: n }, (_, i) => centre + (i - (n - 1) / 2) * (w + gap));
const nodeColor = (node, level) => (node.color ? colorOf(node.color) : level === 0 ? C.darkBg : pc(level - 1));

function drawNode(slide, node, p, h, c) {
  const dark = c === C.darkBg;
  const x = p.cx - p.w / 2;
  const iw = p.w - 0.14;
  box(slide, x, p.y, p.w, h, dark ? C.darkBg : tint(c, 0.86), { line: dark ? C.darkBg : c, lineWidth: 1.5, radius: 0.07, shadow: true });
  const fs = node.mono
    ? monoFit(node.label, iw, 12.5, 8)
    : fitFont(node.label, iw, (node.sub ? h * 0.5 : h) - 0.04, 12.5, 9.5);
  const label = { x: x + 0.07, w: iw, fontSize: fs, bold: true, color: dark ? C.white : C.textDk, align: "center", fontFace: node.mono ? MONO : FONT };
  if (node.sub) {
    text(slide, node.label, { ...label, y: p.y + 0.03, h: h * 0.5 - 0.03, valign: "bottom" });
    text(slide, node.sub, { x: x + 0.07, y: p.y + h * 0.5, w: iw, h: h * 0.5 - 0.04, fontSize: Math.min(11, fs - 1), color: dark ? C.textLt : C.textBd, align: "center", valign: "top" });
  } else {
    text(slide, node.label, { ...label, y: p.y, h, valign: "middle" });
  }
}

// Levels top-to-bottom; each node is centred under its parent(s) when there is room.
function renderTree(slide, s) {
  lightSlide(slide, s);
  let y = TOP;
  if (s.intro) y += introBox(slide, s.intro, X0, y, CW) + GAP;
  const bottom = contentBottom(s);
  const cH = s.callout ? calloutHeight(s.callout) : 0;
  const areaBottom = bottom - (cH ? cH + GAP : 0);
  const sideW = s.side ? 3.3 : 0;
  if (s.side) column(slide, s.side, X0 + CW - sideW, y, sideW, areaBottom - y, C.primary);

  const areaX = X0;
  const areaW = CW - (s.side ? sideW + 0.3 : 0);
  const areaH = areaBottom - y;
  const levels = s.levels;
  const L = levels.length;
  const hasSub = levels.some((lv) => lv.some((node) => node.sub));
  const nodeH = clamp(areaH / (L * 1.8), hasSub ? 0.56 : 0.38, hasSub ? 0.74 : 0.56);
  const gapY = L > 1 ? Math.min(0.85, (areaH - L * nodeH) / (L - 1)) : 0;
  if (gapY < 0.22) warn(`tree is crowded (${L} levels, ${gapY.toFixed(2)} in between levels)`);
  const y0 = y + Math.max(0, (areaH - (L * nodeH + (L - 1) * gapY)) / 2);
  const gapX = 0.25;

  const pos = [];
  levels.forEach((nodes, l) => {
    const n = nodes.length;
    const w = n === 1
      ? clamp(Math.max(textWidth(nodes[0].label, 12.5, nodes[0].mono), nodes[0].sub ? textWidth(nodes[0].sub, 11) : 0) + 0.4, 2.2, areaW)
      : Math.min(2.5, (areaW - (n - 1) * gapX) / n);
    let cx = spread(n, w, gapX, areaX + areaW / 2);
    if (l > 0) {
      const want = [];
      for (let i = 0; i < n; ) {
        const key = parentsOf(nodes[i]).join(",");
        let j = i;
        while (j + 1 < n && parentsOf(nodes[j + 1]).join(",") === key) j++;
        const ps = parentsOf(nodes[i]);
        ps.forEach((p) => {
          if (!pos[l - 1][p]) throw new Error(`Slide ${slideNo}: level ${l} node "${nodes[i].label}" has no parent #${p}`);
        });
        const centre = ps.length ? ps.reduce((sum, p) => sum + pos[l - 1][p].cx, 0) / ps.length : areaX + areaW / 2;
        want.push(...spread(j - i + 1, w, gapX, centre));
        i = j + 1;
      }
      const lo = areaX + w / 2;
      const hi = areaX + areaW - w / 2;
      for (let k = 0; k < n; k++) want[k] = Math.max(want[k], k === 0 ? lo : want[k - 1] + w + gapX);
      const over = want[n - 1] - hi;
      if (over > 0) for (let k = 0; k < n; k++) want[k] -= over;
      if (want[0] >= lo - 0.001) cx = want;
    }
    pos.push(cx.map((c) => ({ cx: c, w, y: y0 + l * (nodeH + gapY) })));
  });

  levels.forEach((nodes, l) =>
    nodes.forEach((node, i) =>
      parentsOf(node).forEach((p) => {
        const from = pos[l - 1][p];
        arrow(slide, from.cx, from.y + nodeH + 0.02, pos[l][i].cx, pos[l][i].y - 0.04);
      })
    )
  );
  levels.forEach((nodes, l) => nodes.forEach((node, i) => drawNode(slide, node, pos[l][i], nodeH, nodeColor(node, l))));
  levels.forEach((nodes, l) =>
    nodes.forEach((node, i) => {
      if (!node.edge) return;
      const ps = parentsOf(node);
      const from = pos[l - 1][ps[Math.floor(ps.length / 2)]];
      const to = pos[l][i];
      const mono = /\(/.test(node.edge);
      const lw = textWidth(node.edge, 9.5, mono) + 0.24;
      text(slide, node.edge, {
        x: (from.cx + to.cx) / 2 - lw / 2, y: (from.y + nodeH + to.y) / 2 - 0.13, w: lw, h: 0.26,
        fontSize: 9.5, italic: !mono, fontFace: mono ? MONO : FONT, color: C.textBd,
        align: "center", valign: "middle", fill: { color: C.slideBg },
      });
    })
  );
  if (s.callout) callout(slide, s.callout, X0, bottom - cH, CW, cH);
}

function renderClosing(slide, s) {
  slide.background = { color: C.darkBg };
  oval(slide, -1, 3.5, 5.2, "1A3A5C", 25);
  oval(slide, 7.5, -1.2, 4, C.accent, 70);
  box(slide, 0, 0, 0.12, H, C.accent);

  const tagW = Math.max(2.6, textWidth(s.tag, 9.5) * 1.3 + 0.4);
  box(slide, 0.5, 0.55, tagW, 0.36, C.accent);
  text(slide, s.tag, { x: 0.5, y: 0.55, w: tagW, h: 0.36, fontSize: 9.5, bold: true, color: C.textDk, align: "center", valign: "middle", charSpacing: 1.5 });
  text(slide, s.title, { x: 0.5, y: 0.98, w: 9, h: 0.8, fontSize: 46, bold: true, color: C.white, valign: "middle" });
  text(slide, s.subtitle, { x: 0.5, y: 1.8, w: 9, h: 0.4, fontSize: 17, color: C.accent, valign: "middle" });

  let y = 2.32;
  const keyH = textHeight(s.key_message, 8.8, 12.5) + 0.18;
  box(slide, 0.5, y, 9.1, keyH, C.panel, { line: C.amber });
  rich(slide, s.key_message, { x: 0.68, y, w: 8.8, h: keyH, fontSize: 12.5, color: C.amber, codeColor: C.amber, valign: "middle" });
  y += keyH + 0.14;

  const perCol = Math.ceil(s.recap.length / 2);
  s.recap.forEach((r, i) => {
    const rx = 0.5 + Math.floor(i / perCol) * 4.6;
    const ry = y + (i % perCol) * 0.37;
    box(slide, rx, ry, 4.5, 0.31, C.panel, { line: pc(i) });
    rich(slide, `▸  ${r}`, { x: rx + 0.12, y: ry, w: 4.3, h: 0.31, fontSize: 10.5, color: C.textLt, codeColor: C.accent, valign: "middle" });
  });
  y += perCol * 0.37 + 0.08;

  if (s.next) {
    box(slide, 0.5, y, 9.1, 0.42, C.panel, { line: C.accent });
    rich(slide, s.next, { x: 0.68, y, w: 8.8, h: 0.42, fontSize: 12.5, bold: true, color: C.accent, codeColor: C.white, valign: "middle" });
    y += 0.42;
  }
  if (s.footer) text(slide, s.footer, { x: 0.5, y: Math.max(y + 0.1, 5.18), w: 9.1, h: 0.3, fontSize: 9.5, color: C.textMd, valign: "middle" });
}

const RENDER = {
  title: renderTitle,
  agenda: renderAgenda,
  section: renderSection,
  bullets: renderBullets,
  two_column: renderTwoColumn,
  cards: renderCards,
  code: renderCode,
  table: renderTable,
  flow: renderFlow,
  tree: renderTree,
  closing: renderClosing,
};

// ════════════════════════════════════════════════════════════
// Build & Save
// ════════════════════════════════════════════════════════════
(async () => {
  try {
    slides.forEach((s, i) => {
      slideNo = i + 1;
      const render = RENDER[s.type];
      if (!render) throw new Error(`Slide ${slideNo}: unknown type "${s.type}"`);
      const slide = pres.addSlide();
      render(slide, s);
      if (s.source) sourceCaption(slide, s.source);
      if (s.notes) slide.addNotes(Array.isArray(s.notes) ? s.notes.join(" \n\n") : s.notes);
    });

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    await pres.writeFile({ fileName: OUTPUT_FILE });
    console.log("\n✅  Presentation saved successfully!");
    console.log(`📂  ${OUTPUT_FILE}`);
    console.log(`📊  ${slides.length} slides generated`);
  } catch (err) {
    console.error("❌  Error:", err.message);
    process.exit(1);
  }
})();
