/**
 * ============================================================
 *  Blockchain Lecture 8 — PPTX Generator
 *  File:  generate_lecture8.js
 *  Run:   node generate_lecture8.js
 *  Req:   npm install pptxgenjs
 * ============================================================
 */

const pptxgen = require("pptxgenjs");
const fs      = require("fs");
const path    = require("path");

// ── Load JSON ────────────────────────────────────────────────
const ROOT = path.join(__dirname, "..");
const raw  = fs.readFileSync(path.join(ROOT, "data", "lecture9_slides.json"), "utf8");
const data = JSON.parse(raw);
const { presentation, slides } = data;

function resolveOutputPath(rawPath) {
  const fallback = path.join(ROOT, "slides", "Lecture9_ERC20_Token_Standard.pptx");
  if (!rawPath || typeof rawPath !== "string") return fallback;
  let out = rawPath.trim();
  if (!out.toLowerCase().endsWith(".pptx")) {
    out = out.replace(/\.(ppt|json)$/i, "") + ".pptx";
  }
  if (process.platform !== "win32" && /^[a-zA-Z]:[\\/]/.test(out)) {
    out = path.join(ROOT, "slides", path.basename(out));
  } else if (!path.isAbsolute(out)) {
    out = path.join(ROOT, out);
  }
  return out;
}
presentation.outputPath = resolveOutputPath(presentation.outputPath);

// ── Colour Palette ───────────────────────────────────────────
const C = {
  darkBg  : "0D1B2A",
  slideBg : "F4F7FB",
  cardBg  : "FFFFFF",
  codeBg  : "1E293B",
  codeBdr : "334155",
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
const PAL = [C.primary, C.accent, C.amber, C.red, C.purple, C.green];
const pc  = i => PAL[i % PAL.length];

// ── Init ─────────────────────────────────────────────────────
const pres = new pptxgen();
pres.layout  = "LAYOUT_16x9";
pres.author  = presentation.author;
pres.title   = presentation.title;
pres.subject = presentation.subject;

// ── Shared helpers ───────────────────────────────────────────
const SH = () => ({ type:"outer", color:"000000", opacity:0.10, blur:8, offset:3, angle:135 });
const BD = (c="E2E8F0") => ({ color:c, pt:1 });

function titleBar(slide, text, accent = C.accent, size = 30) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:0, w:10, h:1.08, fill:{color:C.darkBg}, line:{color:C.darkBg}
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:1.08, w:10, h:0.065, fill:{color:accent}, line:{color:accent}
  });
  slide.addText(text, {
    x:0.45, y:0, w:9.3, h:1.08,
    fontSize:size, bold:true, color:C.white, fontFace:"Calibri",
    valign:"middle", margin:0
  });
}

function pgFooter(slide, text) {
  slide.addText(text || "Blockchain Course  |  Lecture 8", {
    x:0, y:5.33, w:10, h:0.29,
    fontSize:9, color:C.textMd, align:"center", fontFace:"Calibri"
  });
}

function codeBox(slide, code, x, y, w, h, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill:{color:C.codeBg}, line:{color:C.codeBdr, pt:1}, shadow:SH()
  });
  if (label) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h:0.28, fill:{color:"0F172A"}, line:{color:C.codeBdr, pt:0}
    });
    slide.addText(label, {
      x:x+0.1, y, w:w-0.2, h:0.28,
      fontSize:9, bold:true, color:C.accent, fontFace:"Consolas", valign:"middle"
    });
  }
  slide.addText(code, {
    x:x+0.1, y: label ? y+0.3 : y+0.1, w:w-0.2, h: label ? h-0.36 : h-0.18,
    fontSize:9.5, color:"E2E8F0", fontFace:"Consolas", valign:"top"
  });
}

function stepList(slide, steps, x, y, w, colorOverride) {
  steps.forEach((st, i) => {
    const c = colorOverride || pc(i);
    const iy = y + i * 0.52;
    slide.addShape(pres.shapes.OVAL, {
      x, y:iy+0.09, w:0.32, h:0.32, fill:{color:c}, line:{color:c}
    });
    slide.addText(String(i+1), {
      x, y:iy+0.09, w:0.32, h:0.32,
      fontSize:10, bold:true, color:C.white,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    slide.addText(st, {
      x:x+0.42, y:iy, w:w-0.5, h:0.48,
      fontSize:12, color:C.textBd, fontFace:"Calibri", valign:"middle"
    });
  });
}

function checkBullet(slide, text, x, y, w, c) {
  slide.addShape(pres.shapes.OVAL, {
    x, y:y+0.08, w:0.32, h:0.32, fill:{color:c}, line:{color:c}
  });
  slide.addText("✓", {
    x, y:y+0.08, w:0.32, h:0.32,
    fontSize:10, bold:true, color:C.white,
    align:"center", valign:"middle", fontFace:"Calibri", margin:0
  });
  slide.addText(text, {
    x:x+0.42, y, w:w-0.5, h:0.46,
    fontSize:12.5, color:C.textBd, fontFace:"Calibri", valign:"middle"
  });
}

function dividerSlide(slide, section, title, subtitle, accent) {
  slide.background = { color: C.darkBg };
  slide.addShape(pres.shapes.OVAL, {
    x:-1, y:-1, w:5, h:5,
    fill:{color:"1A3A5C", transparency:30}, line:{color:"1A3A5C"}
  });
  slide.addShape(pres.shapes.OVAL, {
    x:7.2, y:2.8, w:3.8, h:3.8,
    fill:{color:"00C6AE", transparency:70}, line:{color:"00C6AE"}
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:0, w:0.12, h:5.625, fill:{color:accent}, line:{color:accent}
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.5, y:1.35, w:3.0, h:0.36, fill:{color:accent}, line:{color:accent}
  });
  slide.addText(section, {
    x:0.5, y:1.35, w:3.0, h:0.36,
    fontSize:10, bold:true, color:C.textDk,
    align:"center", fontFace:"Calibri", margin:0, charSpacing:1.5
  });
  slide.addText(title, {
    x:0.5, y:1.85, w:9, h:1.0,
    fontSize:40, bold:true, color:C.white, fontFace:"Calibri", margin:0
  });
  slide.addText(subtitle, {
    x:0.5, y:3.0, w:8.5, h:0.55,
    fontSize:15, color:accent, fontFace:"Calibri"
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 1);
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:0, w:0.12, h:5.625, fill:{color:C.accent}, line:{color:C.accent}
  });
  slide.addShape(pres.shapes.OVAL, {
    x:6.5, y:-1.2, w:5.2, h:5.2,
    fill:{color:"1A3A5C", transparency:35}, line:{color:"1A3A5C"}
  });
  slide.addShape(pres.shapes.OVAL, {
    x:7.6, y:2.9, w:2.8, h:2.8,
    fill:{color:"00C6AE", transparency:68}, line:{color:"00C6AE"}
  });

  // Tag
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.5, y:0.85, w:2.2, h:0.36, fill:{color:C.accent}, line:{color:C.accent}
  });
  slide.addText(s.tag, {
    x:0.5, y:0.85, w:2.2, h:0.36,
    fontSize:10, bold:true, color:C.textDk,
    align:"center", fontFace:"Calibri", margin:0, charSpacing:2
  });

  slide.addText(s.title, {
    x:0.5, y:1.35, w:7.5, h:1.25,
    fontSize:46, bold:true, color:C.white, fontFace:"Calibri", margin:0
  });
  slide.addText(s.subtitle, {
    x:0.5, y:2.72, w:7.5, h:0.55,
    fontSize:14, color:C.accent, fontFace:"Calibri"
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.5, y:3.38, w:5.5, h:0.045,
    fill:{color:C.textLt, transparency:45}, line:{color:C.textLt}
  });
  slide.addText(s.duration, {
    x:0.5, y:3.52, w:4, h:0.36,
    fontSize:12, color:C.textMd, fontFace:"Calibri"
  });
  slide.addText(s.footer, {
    x:0.5, y:4.02, w:7, h:0.35,
    fontSize:11, color:C.textMd, fontFace:"Calibri"
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 2 — Agenda
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 2);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary);

  const half = Math.ceil(s.items.length / 2);
  s.items.forEach((item, i) => {
    const ci = Math.floor(i / half);
    const ri = i % half;
    const ix = 0.35 + ci * 4.83;
    const iy = 1.2  + ri * 0.54;
    const c = pc(i);
    slide.addShape(pres.shapes.RECTANGLE, {
      x:ix, y:iy, w:4.6, h:0.46,
      fill:{color:C.cardBg}, line:BD(), shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:ix, y:iy, w:0.08, h:0.46, fill:{color:c}, line:{color:c}
    });
    slide.addText(`${i+1}.  ${item}`, {
      x:ix+0.18, y:iy, w:4.32, h:0.46,
      fontSize:12, color:C.textBd, fontFace:"Calibri", valign:"middle"
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 3 — Opening / Introduction
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 3);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary);

  // Quote card
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.2, w:9.3, h:0.68,
    fill:{color:C.darkBg}, line:{color:C.darkBg}, shadow:SH()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.2, w:0.1, h:0.68, fill:{color:C.primary}, line:{color:C.primary}
  });
  slide.addText(s.quote, {
    x:0.58, y:1.2, w:9.0, h:0.68,
    fontSize:13, italic:true, color:C.accent, fontFace:"Calibri", valign:"middle"
  });

  // Known concepts grid
  slide.addText("What you already know:", {
    x:0.35, y:2.02, w:5.1, h:0.36,
    fontSize:13, bold:true, color:C.primary, fontFace:"Calibri"
  });
  const half2 = Math.ceil(s.known_concepts.length / 2);
  s.known_concepts.forEach((kc, i) => {
    const ci = Math.floor(i / half2), ri = i % half2;
    const kx = 0.35 + ci * 2.6;
    const ky = 2.45 + ri * 0.52;
    const c = pc(i);
    slide.addShape(pres.shapes.RECTANGLE, {
      x:kx, y:ky, w:2.48, h:0.44,
      fill:{color:C.cardBg}, line:{color:c, pt:1}, shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:kx, y:ky, w:2.48, h:0.065, fill:{color:c}, line:{color:c}
    });
    slide.addText("✓  " + kc, {
      x:kx+0.08, y:ky+0.1, w:2.32, h:0.32,
      fontSize:11, bold:true, color:c, fontFace:"Calibri", valign:"middle"
    });
  });

  // Transition
  slide.addShape(pres.shapes.RECTANGLE, {
    x:5.55, y:2.02, w:4.1, h:2.28,
    fill:{color:C.primary}, line:{color:C.primary}, shadow:SH()
  });
  slide.addShape(pres.shapes.OVAL, {
    x:6.8, y:2.22, w:1.6, h:1.6,
    fill:{color:"1A5A9F"}, line:{color:"1A5A9F"}
  });
  slide.addText("→", {
    x:6.8, y:2.22, w:1.6, h:1.6,
    fontSize:52, bold:true, color:C.white, align:"center", valign:"middle",
    fontFace:"Calibri", margin:0
  });
  slide.addText("ERC-20", {
    x:5.65, y:3.9, w:3.9, h:0.35,
    fontSize:18, bold:true, color:C.white, align:"center", fontFace:"Calibri"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:4.45, w:9.3, h:0.56,
    fill:{color:"EFF6FF"}, line:{color:"BFDBFE"}
  });
  slide.addText("💡  " + s.transition, {
    x:0.5, y:4.45, w:9.1, h:0.56,
    fontSize:12.5, italic:true, color:C.primary, fontFace:"Calibri", valign:"middle"
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 4 — What is a Standard? (USB Analogy)
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 4);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.amber);

  // Analogy card
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.2, w:9.3, h:0.68,
    fill:{color:C.amber}, line:{color:C.amber}, shadow:SH()
  });
  slide.addText("💡  " + s.analogy, {
    x:0.5, y:1.2, w:9.1, h:0.68,
    fontSize:13, bold:true, color:C.textDk, fontFace:"Calibri", valign:"middle"
  });

  slide.addText(s.erc20_point, {
    x:0.35, y:2.02, w:5.3, h:0.68,
    fontSize:13, color:C.textBd, fontFace:"Calibri"
  });

  // Diagram
  const d = s.diagram;
  const dx = 5.9;
  slide.addShape(pres.shapes.RECTANGLE, {
    x:dx, y:1.95, w:3.75, h:0.52,
    fill:{color:C.darkBg}, line:{color:C.darkBg}, shadow:SH()
  });
  slide.addText(d.top, {
    x:dx, y:1.95, w:3.75, h:0.52,
    fontSize:13, bold:true, color:C.white,
    align:"center", valign:"middle", fontFace:"Calibri", margin:0
  });
  slide.addText("↓  " + d.label, {
    x:dx, y:2.52, w:3.75, h:0.32,
    fontSize:10, italic:true, color:C.textMd, align:"center", fontFace:"Calibri"
  });
  d.tokens.forEach((t, i) => {
    const c = pc(i);
    const ty = 2.9 + i * 0.46;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:dx+0.2, y:ty, w:3.35, h:0.38,
      fill:{color:c}, line:{color:c}, shadow:SH()
    });
    slide.addText(t, {
      x:dx+0.2, y:ty, w:3.35, h:0.38,
      fontSize:13, bold:true, color:C.white,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
  });

  // Key insight
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:4.68, w:9.3, h:0.56,
    fill:{color:C.darkBg}, line:{color:C.darkBg}, shadow:SH()
  });
  slide.addText("🔑  " + s.key_insight, {
    x:0.5, y:4.68, w:9.1, h:0.56,
    fontSize:13, bold:true, color:C.accent, fontFace:"Calibri", valign:"middle"
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 5 — What is ERC-20? (Fungible)
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 5);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary);

  // Definition
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.2, w:9.3, h:0.62,
    fill:{color:C.primary}, line:{color:C.primary}, shadow:SH()
  });
  slide.addText(s.definition, {
    x:0.5, y:1.2, w:9.1, h:0.62,
    fontSize:13, italic:true, color:C.white, fontFace:"Calibri", valign:"middle"
  });

  // Fungible explanation + examples
  slide.addText("What does Fungible mean?", {
    x:0.35, y:1.95, w:5.1, h:0.36,
    fontSize:13, bold:true, color:C.primary, fontFace:"Calibri"
  });
  slide.addText(s.fungible_explanation, {
    x:0.35, y:2.34, w:5.1, h:0.42,
    fontSize:12.5, color:C.textBd, fontFace:"Calibri"
  });

  s.examples.forEach((ex, i) => {
    const ey = 2.88 + i * 0.56;
    const c = ex.fungible ? C.green : C.red;
    const icon = ex.fungible ? "✅" : "❌";
    slide.addShape(pres.shapes.RECTANGLE, {
      x:0.35, y:ey, w:5.1, h:0.48,
      fill:{color:C.cardBg}, line:{color:c, pt:1}, shadow:SH()
    });
    slide.addText(`${icon}  ${ex.label}  =  ${ex.equals}`, {
      x:0.5, y:ey, w:4.88, h:0.48,
      fontSize:12, color:C.textBd, fontFace:"Calibri", valign:"middle"
    });
  });

  // ERC-20 vs ERC-721
  const cmp = [s.comparison.erc20, s.comparison.erc721];
  cmp.forEach((c, i) => {
    const cx = 5.7 + i * 0;
    const cy = 1.95 + i * 1.5;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:5.7, y:cy, w:3.95, h:1.32,
      fill:{color:C.cardBg}, line:{color:c.color, pt:2}, shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:5.7, y:cy, w:3.95, h:0.42,
      fill:{color:c.color}, line:{color:c.color}
    });
    slide.addText(c.label, {
      x:5.7, y:cy, w:3.95, h:0.42,
      fontSize:16, bold:true, color:C.white,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    slide.addText(c.type, {
      x:5.82, y:cy+0.48, w:3.7, h:0.38,
      fontSize:13, bold:true, color:c.color, fontFace:"Calibri"
    });
    slide.addText("e.g. " + c.example, {
      x:5.82, y:cy+0.86, w:3.7, h:0.36,
      fontSize:11, color:C.textMd, fontFace:"Calibri"
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 6 — Core ERC-20 Functions (6-card grid)
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 6);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary, 28);
  slide.addText(s.subtitle, {
    x:0.35, y:1.12, w:9.3, h:0.3,
    fontSize:12, italic:true, color:C.textMd, fontFace:"Calibri"
  });

  const cw = 3.0, ch = 1.25, xgap = 0.18, ygap = 0.15;
  const sx = 0.35, sy = 1.48;
  s.functions.forEach((fn, i) => {
    const ci = i % 3, ri = Math.floor(i / 3);
    const fx = sx + ci * (cw + xgap);
    const fy = sy + ri * (ch + ygap);

    slide.addShape(pres.shapes.RECTANGLE, {
      x:fx, y:fy, w:cw, h:ch,
      fill:{color:C.cardBg}, line:BD(), shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:fx, y:fy, w:cw, h:0.065,
      fill:{color:fn.color}, line:{color:fn.color}
    });
    slide.addText(fn.name, {
      x:fx+0.1, y:fy+0.1, w:cw-0.2, h:0.38,
      fontSize:13, bold:true, color:fn.color, fontFace:"Consolas"
    });
    slide.addText(fn.description, {
      x:fx+0.1, y:fy+0.5, w:cw-0.2, h:0.36,
      fontSize:11, color:C.textBd, fontFace:"Calibri"
    });
    slide.addText(fn.example, {
      x:fx+0.1, y:fy+0.88, w:cw-0.2, h:0.3,
      fontSize:10, color:C.textMd, italic:true, fontFace:"Calibri"
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:4.9, w:9.3, h:0.38,
    fill:{color:"FFF8E7"}, line:{color:"FDE68A"}
  });
  slide.addText("⭐  " + s.note, {
    x:0.5, y:4.9, w:9.1, h:0.38,
    fontSize:12, bold:true, color:"92400E", fontFace:"Calibri", valign:"middle"
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 7 — How Balances Are Stored
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 7);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary);

  // Wrong way
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.2, w:4.55, h:0.38,
    fill:{color:C.red}, line:{color:C.red}
  });
  slide.addText(s.wrong_way.label, {
    x:0.35, y:1.2, w:4.55, h:0.38,
    fontSize:12, bold:true, color:C.white,
    align:"center", valign:"middle", fontFace:"Calibri", margin:0
  });
  codeBox(slide, s.wrong_way.code, 0.35, 1.62, 4.55, 1.12, "");

  // Right way
  slide.addShape(pres.shapes.RECTANGLE, {
    x:5.1, y:1.2, w:4.55, h:0.38,
    fill:{color:C.green}, line:{color:C.green}
  });
  slide.addText(s.right_way.label, {
    x:5.1, y:1.2, w:4.55, h:0.38,
    fontSize:12, bold:true, color:C.white,
    align:"center", valign:"middle", fontFace:"Calibri", margin:0
  });
  codeBox(slide, s.right_way.code, 5.1, 1.62, 4.55, 1.12, "");

  // Mapping diagram
  slide.addText("How balanceOf looks internally:", {
    x:0.35, y:2.88, w:5.5, h:0.36,
    fontSize:13, bold:true, color:C.primary, fontFace:"Calibri"
  });
  s.diagram.entries.forEach((entry, i) => {
    const c = pc(i);
    const ey = 3.3 + i * 0.52;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:0.35, y:ey, w:2.55, h:0.42,
      fill:{color:c}, line:{color:c}, shadow:SH()
    });
    slide.addText(entry.address, {
      x:0.35, y:ey, w:2.55, h:0.42,
      fontSize:11, bold:true, color:C.white,
      align:"center", valign:"middle", fontFace:"Consolas", margin:0
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:2.95, y:ey+0.13, w:0.6, h:0.16,
      fill:{color:C.textMd}, line:{color:C.textMd}
    });
    slide.addText("───▶", {
      x:3.0, y:ey, w:0.6, h:0.42,
      fontSize:10, color:C.textMd, align:"center", valign:"middle", fontFace:"Calibri"
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:3.65, y:ey, w:1.8, h:0.42,
      fill:{color:C.cardBg}, line:{color:c, pt:2}, shadow:SH()
    });
    slide.addText(entry.balance, {
      x:3.65, y:ey, w:1.8, h:0.42,
      fontSize:13, bold:true, color:c,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
  });

  // Supply var + insight
  codeBox(slide, s.supply_var, 5.1, 2.88, 4.55, 0.58, "");
  slide.addShape(pres.shapes.RECTANGLE, {
    x:5.1, y:3.58, w:4.55, h:0.92,
    fill:{color:"EFF6FF"}, line:{color:"BFDBFE"}
  });
  slide.addText("💡  " + s.insight, {
    x:5.22, y:3.58, w:4.32, h:0.92,
    fontSize:12, italic:true, color:C.primary, fontFace:"Calibri", valign:"middle"
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 8 — Practical 1: Build SimpleToken
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 8);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary);

  codeBox(slide, s.code, 0.35, 1.2, 5.55, 3.0, s.label);

  // Line explanations
  slide.addText("Line by line:", {
    x:6.1, y:1.2, w:3.55, h:0.36,
    fontSize:12, bold:true, color:C.primary, fontFace:"Calibri"
  });
  s.line_explanations.forEach((le, i) => {
    const c = pc(i);
    const ly = 1.62 + i * 0.55;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:6.1, y:ly, w:3.55, h:0.46,
      fill:{color:C.cardBg}, line:{color:c, pt:1}, shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:6.1, y:ly, w:0.07, h:0.46,
      fill:{color:c}, line:{color:c}
    });
    slide.addText(le, {
      x:6.22, y:ly, w:3.32, h:0.46,
      fontSize:10.5, color:C.textBd, fontFace:"Calibri", valign:"middle"
    });
  });

  // Deploy diagram
  const dd = s.deploy_diagram;
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:4.35, w:2.55, h:0.72,
    fill:{color:C.darkBg}, line:{color:C.darkBg}, shadow:SH()
  });
  slide.addText(dd.action, {
    x:0.35, y:4.35, w:2.55, h:0.72,
    fontSize:11, bold:true, color:C.white, align:"center", valign:"middle", fontFace:"Calibri", margin:0
  });
  slide.addText("→", {
    x:2.95, y:4.35, w:0.35, h:0.72,
    fontSize:18, color:C.textMd, align:"center", valign:"middle", fontFace:"Calibri"
  });
  [dd.result_supply, dd.result_balance].forEach((r, i) => {
    const c = pc(i+1);
    slide.addShape(pres.shapes.RECTANGLE, {
      x:3.38, y:4.35 + i * 0.38, w:2.3, h:0.32,
      fill:{color:c}, line:{color:c}
    });
    slide.addText(r, {
      x:3.38, y:4.35 + i * 0.38, w:2.3, h:0.32,
      fontSize:11, bold:true, color:C.white, align:"center", valign:"middle", fontFace:"Consolas", margin:0
    });
  });

  // Steps
  slide.addText("Test:", {
    x:6.1, y:4.35, w:3.55, h:0.32,
    fontSize:12, bold:true, color:C.primary, fontFace:"Calibri"
  });
  stepList(slide, s.steps, 6.1, 4.72, 3.55, C.primary);
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 9 — Adding transfer()
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 9);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.accent);

  codeBox(slide, s.code, 0.35, 1.2, 5.55, 2.55, s.label);

  // Logic steps
  slide.addText("How it works:", {
    x:6.1, y:1.2, w:3.55, h:0.36,
    fontSize:12, bold:true, color:C.accent, fontFace:"Calibri"
  });
  stepList(slide, s.logic_steps, 6.1, 1.62, 3.55);

  // Before / After
  const ba = s.before_after;
  const boxY = 3.9;
  [
    { label:"Before", alice: ba.before.alice, bob: ba.before.bob, c: C.red },
    { label:"After",  alice: ba.after.alice,  bob: ba.after.bob,  c: C.green }
  ].forEach((state, i) => {
    const bx = 0.35 + i * 4.3;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:bx, y:boxY, w:3.9, h:1.35,
      fill:{color:C.cardBg}, line:{color:state.c, pt:2}, shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:bx, y:boxY, w:3.9, h:0.36,
      fill:{color:state.c}, line:{color:state.c}
    });
    slide.addText(state.label, {
      x:bx, y:boxY, w:3.9, h:0.36,
      fontSize:13, bold:true, color:C.white, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    slide.addText(`Alice:  ${state.alice} MTK`, {
      x:bx+0.15, y:boxY+0.42, w:3.6, h:0.38,
      fontSize:13, bold:true, color:C.primary, fontFace:"Calibri"
    });
    slide.addText(`Bob:    ${state.bob} MTK`, {
      x:bx+0.15, y:boxY+0.82, w:3.6, h:0.38,
      fontSize:13, bold:true, color:C.accent, fontFace:"Calibri"
    });
  });
  // Arrow between
  slide.addText(`→ ${ba.call}`, {
    x:4.3, y:boxY+0.48, w:2.0, h:0.42,
    fontSize:11, bold:true, color:C.amber, align:"center", fontFace:"Calibri"
  });

  // Steps
  slide.addText("Test in Remix:", {
    x:8.72, y:3.9, w:1.0, h:0.36,
    fontSize:10, bold:true, color:C.accent, fontFace:"Calibri"
  });
  s.steps.forEach((st, i) => {
    slide.addText(`${i+1}. ${st}`, {
      x:8.72, y:4.3 + i * 0.28, w:0.98, h:0.26,
      fontSize:8.5, color:C.textBd, fontFace:"Calibri"
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 10 — Transfer Event
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 10);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.purple);

  codeBox(slide, s.code_event, 0.35, 1.2,  4.55, 1.05, "Event Declaration");
  codeBox(slide, s.code_emit,  0.35, 2.35, 4.55, 2.18, "Emitting the Event");

  // Flow
  slide.addText("Event Flow:", {
    x:5.15, y:1.2, w:4.5, h:0.36,
    fontSize:12, bold:true, color:C.purple, fontFace:"Calibri"
  });
  s.flow.forEach((fl, i) => {
    const c = pc(i);
    slide.addShape(pres.shapes.RECTANGLE, {
      x:5.15, y:1.62 + i * 0.58, w:4.5, h:0.48,
      fill:{color:c}, line:{color:c}, shadow:SH()
    });
    slide.addText(fl, {
      x:5.15, y:1.62 + i * 0.58, w:4.5, h:0.48,
      fontSize:12, bold:true, color:C.white, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    if (i < s.flow.length - 1) {
      slide.addText("▼", {
        x:7.15, y:2.11 + i * 0.58, w:0.5, h:0.1,
        fontSize:8, color:C.textMd, align:"center", fontFace:"Calibri"
      });
    }
  });

  // Why important
  slide.addText("Why Transfer events matter:", {
    x:5.15, y:4.0, w:4.5, h:0.36,
    fontSize:12, bold:true, color:C.purple, fontFace:"Calibri"
  });
  s.why_important.forEach((wi, i) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x:5.15, y:4.42 + i * 0.3, w:4.5, h:0.26,
      fill:{color:C.cardBg}, line:BD(), shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:5.15, y:4.42 + i * 0.3, w:0.07, h:0.26,
      fill:{color:pc(i)}, line:{color:pc(i)}
    });
    slide.addText("▶  " + wi, {
      x:5.27, y:4.42 + i * 0.3, w:4.28, h:0.26,
      fontSize:10.5, color:C.textBd, fontFace:"Calibri", valign:"middle"
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 11 — The Approval System Concept
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 11);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.red);

  // Problem card
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.2, w:9.3, h:0.62,
    fill:{color:C.red}, line:{color:C.red}, shadow:SH()
  });
  slide.addText("⚠  " + s.problem, {
    x:0.5, y:1.2, w:9.1, h:0.62,
    fontSize:12.5, color:C.white, fontFace:"Calibri", valign:"middle"
  });

  // Analogy
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.94, w:5.1, h:0.68,
    fill:{color:"FEF2F2"}, line:{color:"FECACA"}
  });
  slide.addText("💡  " + s.analogy, {
    x:0.5, y:1.94, w:4.9, h:0.68,
    fontSize:12, italic:true, color:"991B1B", fontFace:"Calibri", valign:"middle"
  });

  // Approval flow diagram
  slide.addText("Approval Flow:", {
    x:0.35, y:2.74, w:5.1, h:0.36,
    fontSize:12, bold:true, color:C.red, fontFace:"Calibri"
  });
  s.diagram.steps.forEach((st, i) => {
    const c = pc(i);
    slide.addShape(pres.shapes.RECTANGLE, {
      x:0.35, y:3.16 + i * 0.42, w:5.1, h:0.36,
      fill:{color:c}, line:{color:c}, shadow:SH()
    });
    slide.addText(`${i+1}.  ${st}`, {
      x:0.48, y:3.16 + i * 0.42, w:4.92, h:0.36,
      fontSize:11, bold:true, color:C.white, valign:"middle", fontFace:"Calibri"
    });
  });

  // Key sentence
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:5.08, w:5.1, h:0.38,
    fill:{color:C.darkBg}, line:{color:C.darkBg}
  });
  slide.addText("🔑  " + s.key_sentence, {
    x:0.5, y:5.08, w:4.9, h:0.38,
    fontSize:12, bold:true, color:C.amber, fontFace:"Calibri", valign:"middle"
  });

  // Nested mapping
  codeBox(slide, s.nested_mapping, 5.7, 1.94, 3.95, 0.68, "Allowance Mapping");
  // Mapping diagram
  const md = s.mapping_diagram;
  const mdY = 2.78;
  slide.addText("allowance[Owner][Spender] = Amount", {
    x:5.7, y:mdY, w:3.95, h:0.38,
    fontSize:11, bold:true, color:C.primary, fontFace:"Calibri"
  });
  const boxes = [
    { label: "Owner", value: md.owner, c: C.primary },
    { label: "Spender", value: md.spender, c: C.red },
    { label: "Amount", value: md.amount, c: C.green }
  ];
  boxes.forEach((b, i) => {
    const by = mdY + 0.46 + i * 0.62;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:5.7, y:by, w:3.95, h:0.52,
      fill:{color:C.cardBg}, line:{color:b.c, pt:2}, shadow:SH()
    });
    slide.addText(`${b.label}:  ${b.value}`, {
      x:5.82, y:by, w:3.72, h:0.52,
      fontSize:12, bold:true, color:b.c, fontFace:"Calibri", valign:"middle"
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 12 — approve() & Approval Event
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 12);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.red);

  codeBox(slide, s.code_event,    0.35, 1.2,  4.55, 0.95, "Approval Event");
  codeBox(slide, s.code_function, 0.35, 2.28, 4.55, 2.28, "approve() function");

  // Key points
  slide.addText("Key Points:", {
    x:5.1, y:1.2, w:4.55, h:0.36,
    fontSize:12, bold:true, color:C.red, fontFace:"Calibri"
  });
  s.key_points.forEach((kp, i) => {
    checkBullet(slide, kp, 5.1, 1.62 + i * 0.56, 4.55, pc(i));
  });

  // Steps
  slide.addText("Test in Remix:", {
    x:5.1, y:4.5, w:4.55, h:0.36,
    fontSize:12, bold:true, color:C.red, fontFace:"Calibri"
  });
  stepList(slide, s.steps, 5.1, 4.92, 4.55, C.red);
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 13 — transferFrom()
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 13);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.red);

  codeBox(slide, s.code, 0.35, 1.2, 5.55, 3.12, s.label);

  // Step explanations
  slide.addText("Step by step:", {
    x:6.1, y:1.2, w:3.55, h:0.36,
    fontSize:12, bold:true, color:C.red, fontFace:"Calibri"
  });
  stepList(slide, s.step_explanations, 6.1, 1.62, 3.55);

  // Scenario
  const sc = s.scenario;
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:4.46, w:9.3, h:0.38,
    fill:{color:C.darkBg}, line:{color:C.darkBg}
  });
  slide.addText("📋  Scenario: " + sc.setup + "  →  " + sc.call, {
    x:0.5, y:4.46, w:9.1, h:0.38,
    fontSize:11, italic:true, color:C.textLt, fontFace:"Calibri", valign:"middle"
  });

  const results = [
    { label: "Alice", value: sc.result_alice + " MTK", c: C.primary },
    { label: "Bob", value: sc.result_bob + " MTK", c: C.accent },
    { label: "Allowance left", value: sc.remaining_allowance + " MTK", c: C.amber }
  ];
  results.forEach((r, i) => {
    const rx = 0.35 + i * 3.16;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:rx, y:4.94, w:2.95, h:0.38,
      fill:{color:r.c}, line:{color:r.c}, shadow:SH()
    });
    slide.addText(`${r.label}  →  ${r.value}`, {
      x:rx, y:4.94, w:2.95, h:0.38,
      fontSize:12, bold:true, color:C.white, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 14 — Complete SimpleToken Contract
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 14);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary, 26);

  codeBox(slide, s.code, 0.35, 1.18, 6.4, 4.22, s.label);

  // What it covers chips
  slide.addText("What this covers:", {
    x:6.95, y:1.18, w:2.7, h:0.36,
    fontSize:12, bold:true, color:C.primary, fontFace:"Calibri"
  });
  s.what_it_covers.forEach((wc, i) => {
    const c = pc(i);
    slide.addShape(pres.shapes.RECTANGLE, {
      x:6.95, y:1.6 + i * 0.56, w:2.7, h:0.48,
      fill:{color:C.cardBg}, line:{color:c, pt:1}, shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:6.95, y:1.6 + i * 0.56, w:0.07, h:0.48, fill:{color:c}, line:{color:c}
    });
    slide.addText("✓  " + wc, {
      x:7.06, y:1.6 + i * 0.56, w:2.55, h:0.48,
      fontSize:11, color:C.textBd, fontFace:"Calibri", valign:"middle"
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 15 — OpenZeppelin ERC-20
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 15);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.green, 26);

  // Message
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.2, w:9.3, h:0.56,
    fill:{color:C.green}, line:{color:C.green}, shadow:SH()
  });
  slide.addText("💡  " + s.message, {
    x:0.5, y:1.2, w:9.1, h:0.56,
    fontSize:12.5, bold:true, color:C.white, fontFace:"Calibri", valign:"middle"
  });

  codeBox(slide, s.code, 0.35, 1.88, 5.3, 2.25, "MyToken.sol — OpenZeppelin");

  // Why OZ
  slide.addText("Why OpenZeppelin?", {
    x:5.85, y:1.88, w:3.8, h:0.36,
    fontSize:12, bold:true, color:C.green, fontFace:"Calibri"
  });
  s.why_openzeppelin.forEach((w, i) => {
    checkBullet(slide, w, 5.85, 2.3 + i * 0.5, 3.8, pc(i));
  });

  // Connection to previous concepts
  slide.addText(s.concepts_connection.title, {
    x:0.35, y:4.24, w:9.3, h:0.36,
    fontSize:12, bold:true, color:C.primary, fontFace:"Calibri"
  });
  const half3 = Math.ceil(s.concepts_connection.items.length / 2);
  s.concepts_connection.items.forEach((item, i) => {
    const ci = Math.floor(i / half3), ri = i % half3;
    const cx = 0.35 + ci * 4.83;
    const cy = 4.64 + ri * 0.28;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:cx, y:cy, w:4.6, h:0.24,
      fill:{color:C.cardBg}, line:BD()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:cx, y:cy, w:0.06, h:0.24, fill:{color:pc(i)}, line:{color:pc(i)}
    });
    slide.addText("▶  " + item, {
      x:cx+0.12, y:cy, w:4.42, h:0.24,
      fontSize:10.5, color:C.textBd, fontFace:"Calibri", valign:"middle"
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 16 — Understanding decimals()
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 16);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.amber);

  // Explanation
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:1.2, w:9.3, h:0.52,
    fill:{color:C.amber}, line:{color:C.amber}, shadow:SH()
  });
  slide.addText(s.explanation, {
    x:0.5, y:1.2, w:9.1, h:0.52,
    fontSize:13, bold:true, color:C.textDk, fontFace:"Calibri", valign:"middle"
  });

  // Big visual
  const ex = s.example;
  const boxColors = [C.primary, C.red, C.green];
  const boxLabels = [ex.whole_token, ex.formula, ex.internal_representation];
  const boxTitles = ["Display shows", "Formula", "Internally stored as"];
  boxLabels.forEach((bl, i) => {
    const bx = 0.35 + i * 3.16;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:bx, y:1.86, w:3.0, h:1.28,
      fill:{color:boxColors[i]}, line:{color:boxColors[i]}, shadow:SH()
    });
    slide.addText(boxTitles[i], {
      x:bx, y:1.86, w:3.0, h:0.36,
      fontSize:11, bold:true, color:C.white, align:"center", fontFace:"Calibri", valign:"middle", margin:0
    });
    slide.addText(bl, {
      x:bx+0.1, y:2.24, w:2.8, h:0.82,
      fontSize:i===2 ? 10 : 14, bold:true, color:C.white, align:"center", fontFace:"Calibri", valign:"middle"
    });
  });

  // Code
  codeBox(slide, s.code, 0.35, 3.28, 5.3, 1.42, "Minting with decimals");

  // Analogy
  slide.addShape(pres.shapes.RECTANGLE, {
    x:5.85, y:3.28, w:3.8, h:0.72,
    fill:{color:"FFF8E7"}, line:{color:"FDE68A"}
  });
  slide.addText("💡  " + s.analogy, {
    x:5.97, y:3.28, w:3.62, h:0.72,
    fontSize:11, italic:true, color:"92400E", fontFace:"Calibri", valign:"middle"
  });

  // Common decimals table
  slide.addText("Common token decimals:", {
    x:5.85, y:4.1, w:3.8, h:0.36,
    fontSize:12, bold:true, color:C.amber, fontFace:"Calibri"
  });
  s.common_decimals.forEach((cd, i) => {
    const dy = 4.5 + i * 0.38;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:5.85, y:dy, w:3.8, h:0.32,
      fill:{color:i%2===0 ? "F8FAFC" : "FFFFFF"}, line:BD()
    });
    slide.addText(cd.token, {
      x:5.95, y:dy, w:2.7, h:0.32,
      fontSize:10.5, color:C.textBd, fontFace:"Calibri", valign:"middle"
    });
    slide.addText(cd.decimals, {
      x:8.45, y:dy, w:1.1, h:0.32,
      fontSize:11, bold:true, color:C.amber, align:"center", fontFace:"Calibri", valign:"middle"
    });
  });

  // Note
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.35, y:4.84, w:5.3, h:0.44,
    fill:{color:"F0FDF4"}, line:{color:"86EFAC"}
  });
  slide.addText("📌  " + s.note, {
    x:0.5, y:4.84, w:5.1, h:0.44,
    fontSize:11.5, color:"166534", fontFace:"Calibri", valign:"middle"
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 17 — Final Architecture Diagram
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 17);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary, 26);

  const cw = 3.0, ch = 1.38, xgap = 0.18, ygap = 0.15;
  const sx = 0.35, sy = 1.18;
  s.layers.forEach((layer, i) => {
    const ci = i % 3, ri = Math.floor(i / 3);
    const lx = sx + ci * (cw + xgap);
    const ly = sy + ri * (ch + ygap);

    slide.addShape(pres.shapes.RECTANGLE, {
      x:lx, y:ly, w:cw, h:ch,
      fill:{color:C.cardBg}, line:{color:layer.color, pt:2}, shadow:SH()
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x:lx, y:ly, w:cw, h:0.42,
      fill:{color:layer.color}, line:{color:layer.color}
    });
    slide.addText(layer.label, {
      x:lx, y:ly, w:cw, h:0.42,
      fontSize:12, bold:true, color:C.white,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    layer.items.forEach((item, ii) => {
      slide.addText("▶  " + item, {
        x:lx+0.1, y:ly + 0.47 + ii * 0.3, w:cw-0.2, h:0.28,
        fontSize:11, color:C.textBd, fontFace:"Calibri"
      });
    });
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 18 — Summary Table
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 18);
  const slide = pres.addSlide();
  slide.background = { color: C.slideBg };
  titleBar(slide, s.title, C.primary, 26);

  const colW = [2.1, 6.95];
  const tableData = [
    ["Concept / Keyword", "What it does"].map((h, ci) => ({
      text:h,
      options:{bold:true, color:C.white, fill:{color:[C.darkBg, C.primary][ci]},
        fontSize:12, fontFace:"Calibri", align:"center"}
    })),
    ...s.items.map((it, i) => {
      const rf = i%2===0 ? "F8FAFC" : "FFFFFF";
      const c = pc(i);
      return [
        { text:it.concept, options:{bold:true, color:C.white, fill:{color:c}, fontSize:11, fontFace:"Calibri", align:"center"} },
        { text:it.detail,  options:{color:C.textBd, fill:{color:rf}, fontSize:11, fontFace:"Calibri"} }
      ];
    })
  ];

  slide.addTable(tableData, {
    x:0.35, y:1.15, w:9.3, colW,
    border:{pt:1, color:"E2E8F0"}, rowH:0.36
  });
  pgFooter(slide);
}

// ════════════════════════════════════════════════════════════
// SLIDE 19 — Closing
// ════════════════════════════════════════════════════════════
{
  const s = slides.find(s => s.id === 19);
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Decorative
  slide.addShape(pres.shapes.OVAL, {
    x:-1, y:3.5, w:5.2, h:5.2,
    fill:{color:"1A3A5C", transparency:25}, line:{color:"1A3A5C"}
  });
  slide.addShape(pres.shapes.OVAL, {
    x:7.5, y:-1.2, w:4, h:4,
    fill:{color:"00C6AE", transparency:70}, line:{color:"00C6AE"}
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:0, w:0.12, h:5.625, fill:{color:C.accent}, line:{color:C.accent}
  });

  // Tag
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.5, y:0.82, w:2.6, h:0.36, fill:{color:C.accent}, line:{color:C.accent}
  });
  slide.addText("LECTURE 8 COMPLETE", {
    x:0.5, y:0.82, w:2.6, h:0.36,
    fontSize:9.5, bold:true, color:C.textDk,
    align:"center", fontFace:"Calibri", margin:0, charSpacing:1.5
  });

  slide.addText(s.title, {
    x:0.5, y:1.28, w:9, h:0.9,
    fontSize:52, bold:true, color:C.white, fontFace:"Calibri", margin:0
  });
  slide.addText(s.subtitle, {
    x:0.5, y:2.24, w:7, h:0.42,
    fontSize:18, color:C.accent, fontFace:"Calibri"
  });

  // Key message
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.5, y:2.76, w:9.1, h:0.46,
    fill:{color:"1B2E45"}, line:{color:C.amber, pt:1}
  });
  slide.addText("💡  " + s.key_message, {
    x:0.65, y:2.76, w:8.8, h:0.46,
    fontSize:12, color:C.amber, fontFace:"Calibri", valign:"middle"
  });

  // Recap chips
  const half4 = Math.ceil(s.recap.length / 2);
  s.recap.forEach((r, i) => {
    const ci = Math.floor(i / half4), ri = i % half4;
    const rx = 0.5 + ci * 4.75;
    const ry = 3.3 + ri * 0.38;
    slide.addShape(pres.shapes.RECTANGLE, {
      x:rx, y:ry, w:4.55, h:0.32,
      fill:{color:"1B2E45"}, line:{color:pc(i), pt:1}
    });
    slide.addText("▶  " + r, {
      x:rx+0.1, y:ry, w:4.35, h:0.32,
      fontSize:10, color:C.textLt, fontFace:"Calibri", valign:"middle"
    });
  });

  // Closing statement
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.5, y:5.0, w:9.1, h:0.5,
    fill:{color:"1B2E45"}, line:{color:C.accent}
  });
  slide.addText("📌  " + s.next, {
    x:0.65, y:5.0, w:8.8, h:0.5,
    fontSize:12, color:C.amber, fontFace:"Calibri", valign:"middle"
  });
}

// ════════════════════════════════════════════════════════════
// Save File
// ════════════════════════════════════════════════════════════
(async () => {
  try {
    const outDir = path.dirname(presentation.outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
      console.log(`📁 Created directory: ${outDir}`);
    }
    await pres.writeFile({ fileName: presentation.outputPath });
    console.log("\n✅  Presentation saved successfully!");
    console.log(`📂  ${presentation.outputPath}`);
    console.log(`📊  ${slides.length} slides generated`);
  } catch (err) {
    console.error("❌  Error:", err.message);
    process.exit(1);
  }
})();