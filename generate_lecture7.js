/**
 * Blockchain & Solidity — Lecture #7 Presentation Generator
 * Reads:    lecture7_slides.json
 * Output:   slides/Lecture7_Contract_Architecture.pptx
 *
 * Install:  npm install pptxgenjs
 * Run:      node generate_lecture7.js
 */

const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");

const JSON_FILE   = path.join(__dirname, "lecture7_slides.json");
const OUTPUT_PATH = path.join(__dirname, "slides");
const OUTPUT_FILE = "Lecture7_Contract_Architecture.pptx";

const data = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
const meta = data.presentation || {};

const T = {
  primary:  "0D1B2A",
  secondary:"142236",
  accent:   "00C6AE",
  accent2:  "1A6FBF",
  amber:    "F59E0B",
  purple:   "9B59B6",
  red:      "E74C3C",
  green:    "27AE60",
  light:    "F4F9FE",
  white:    "FFFFFF",
  muted:    "7A8BA0",
  textDark: "1A3A5C",
  codeBg:   "0A1628",
  codeFg:   "88FFCC",
  line:     "E4E8F2",
};

fs.mkdirSync(OUTPUT_PATH, { recursive: true });

const PAGE_W = 13.333;
const PAGE_H = 7.5;
const MARGIN = 0.48;
const CONTENT_W = PAGE_W - MARGIN * 2;

const pres = new pptxgen();
pres.defineLayout({ name: "WIDE", width: PAGE_W, height: PAGE_H });
pres.layout = "WIDE";
pres.author = meta.author || "Blockchain Course";
pres.title  = meta.title  || "Lecture 7";
pres.subject = meta.subject || "";

const FONT_HEAD = "Calibri";
const FONT_BODY = "Calibri";
const FONT_CODE = "Courier New";
const CREDIT_LINE = "Muhammad Waqas  | https://github.com/MuhammadWaqas4 | +923335086624";

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
function darkBg(slide)  { slide.background = { color: T.primary }; }
function lightBg(slide) { slide.background = { color: T.light }; }

function footerBar(slide, label, dark) {
  slide.addText(label || "Lecture 7", {
    x: MARGIN, y: PAGE_H - 0.38, w: CONTENT_W / 2, h: 0.26,
    fontFace: FONT_BODY, fontSize: 10, color: dark ? "9AA3B8" : T.muted, align: "left",
  });
  slide.addText(meta.title || "Blockchain Technology – Lecture 7", {
    x: MARGIN + CONTENT_W / 2, y: PAGE_H - 0.38, w: CONTENT_W / 2, h: 0.26,
    fontFace: FONT_BODY, fontSize: 10, color: dark ? "9AA3B8" : T.muted, align: "right",
  });
}

function slideHeader(slide, title) {
  slide.addText(title, {
    x: MARGIN, y: 0.22, w: CONTENT_W, h: 0.55,
    fontFace: FONT_HEAD, fontSize: 24, bold: true, color: T.primary,
    align: "left", valign: "middle",
  });
  slide.addShape(pres.shapes.OVAL, {
    x: MARGIN, y: 0.82, w: 0.12, h: 0.12,
    fill: { color: T.accent }, line: { color: T.accent },
  });
}

function addTitleDark(slide, text) {
  slide.addText(text, {
    x: MARGIN, y: 0.22, w: CONTENT_W, h: 0.55,
    fontFace: FONT_HEAD, fontSize: 24, bold: true, color: T.white,
    align: "left", valign: "middle",
  });
}

function addBulletRow(slide, text, x, y, w, fontSize, textColor, dotColor, h) {
  const DOT = 0.09, GAP = 0.13, NUDGE = 0.06;
  const rowH = h || 0.38;
  slide.addShape(pres.shapes.OVAL, {
    x, y: y + NUDGE, w: DOT, h: DOT,
    fill: { color: dotColor }, line: { color: dotColor },
  });
  slide.addText(String(text), {
    x: x + DOT + GAP, y, w: w - DOT - GAP, h: rowH,
    fontSize, color: textColor, fontFace: FONT_BODY,
    align: "left", valign: "top", margin: 0,
  });
}

function codeFontSize(code, maxH) {
  const lines = String(code || "").split("\n").length;
  if (lines > 38) return 8;
  if (lines > 30) return 9;
  if (lines > 22) return 10;
  if (lines > 16) return 11;
  if (maxH && maxH < 2.2) return 10;
  return 12;
}

function codePanel(slide, x, y, w, h, label, code, fontSize) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: T.codeBg }, line: { color: T.accent2, width: 0.75 },
  });
  if (label) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h: 0.28, rectRadius: 0.06,
      fill: { color: T.accent2 }, line: { color: T.accent2 },
    });
    slide.addText(label, {
      x, y, w, h: 0.28,
      fontSize: 9, bold: true, color: T.white, fontFace: FONT_BODY,
      align: "center", valign: "middle", margin: 0,
    });
  }
  const top = label ? 0.34 : 0.1;
  slide.addText(String(code || ""), {
    x: x + 0.12, y: y + top, w: w - 0.24, h: h - top - 0.08,
    fontSize: fontSize || codeFontSize(code, h),
    color: T.codeFg, fontFace: FONT_CODE,
    align: "left", valign: "top", margin: 0,
  });
}

function banner(slide, x, y, w, h, text, opts) {
  opts = opts || {};
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: opts.fill || T.primary },
    line: { color: opts.line || T.accent, width: opts.lineWidth || 0 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.1, h,
    fill: { color: opts.accent || T.accent }, line: { color: opts.accent || T.accent },
  });
  slide.addText(String(text), {
    x: x + 0.22, y, w: w - 0.32, h,
    fontSize: opts.fontSize || 13, color: opts.color || T.white,
    fontFace: FONT_BODY, italic: !!opts.italic,
    align: "left", valign: "middle", margin: 0,
  });
}

function card(slide, x, y, w, h, headerColor, headerText) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.07,
    fill: { color: T.white }, line: { color: T.line, width: 1 },
  });
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h: 0.42, rectRadius: 0.07,
    fill: { color: headerColor }, line: { color: headerColor },
  });
  slide.addText(headerText, {
    x: x + 0.14, y, w: w - 0.28, h: 0.42,
    fontSize: 13, bold: true, color: T.white, fontFace: FONT_HEAD,
    align: "left", valign: "middle", margin: 0,
  });
}

// ─── SLIDE BUILDERS ───────────────────────────────────────────────────────────

function buildTitle(s) {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addShape(pres.shapes.OVAL, {
    x: 10.4, y: -1.2, w: 4.2, h: 4.2,
    fill: { color: T.secondary }, line: { color: T.secondary },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 11.3, y: 5.1, w: 3.0, h: 3.0,
    fill: { color: T.accent2 }, line: { color: T.accent2 },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: -1.1, y: 5.4, w: 2.6, h: 2.6,
    fill: { color: T.secondary }, line: { color: T.secondary },
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN, y: 1.85, w: 1.9, h: 0.36, rectRadius: 0.04,
    fill: { color: T.secondary }, line: { color: T.accent, width: 1 },
  });
  slide.addText(s.tag, {
    x: MARGIN, y: 1.85, w: 1.9, h: 0.36,
    fontSize: 11, bold: true, color: T.accent, fontFace: FONT_BODY,
    align: "center", valign: "middle", margin: 0,
  });

  slide.addText(s.title, {
    x: MARGIN, y: 2.4, w: 11.4, h: 1.35,
    fontSize: 36, bold: true, color: T.white, fontFace: FONT_HEAD,
    align: "left", valign: "middle",
  });
  slide.addText(s.subtitle, {
    x: MARGIN, y: 3.85, w: 11, h: 0.45,
    fontSize: 16, color: "CADCFC", fontFace: FONT_BODY,
  });
  slide.addText(s.duration, {
    x: MARGIN, y: 4.45, w: 8, h: 0.35,
    fontSize: 14, color: T.accent, fontFace: FONT_BODY, italic: true,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN, y: 5.15, w: 1.2, h: 0.06,
    fill: { color: T.accent }, line: { color: T.accent },
  });
  slide.addText([
    { text: s.footer, options: { breakLine: true } },
    { text: CREDIT_LINE },
  ], {
    x: MARGIN, y: 5.4, w: 12, h: 0.7,
    fontSize: 13, color: "9AA3B8", fontFace: FONT_BODY,
    valign: "top",
  });
}

function buildAgenda(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, "Lecture Plan");

  const parts = [s.part1, s.part2];
  const colW = (CONTENT_W - 0.4) / 2;
  parts.forEach((part, i) => {
    const x = MARGIN + i * (colW + 0.4);
    const y = 1.15;
    const h = 5.7;
    card(slide, x, y, colW, h, part.color, part.label);
    part.items.forEach((item, ii) => {
      const iy = y + 0.62 + ii * 0.68;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.22, y: iy, w: 0.36, h: 0.36, rectRadius: 0.04,
        fill: { color: part.color }, line: { color: part.color },
      });
      slide.addText(String(ii + 1), {
        x: x + 0.22, y: iy, w: 0.36, h: 0.36,
        fontSize: 11, bold: true, color: T.white, fontFace: FONT_BODY,
        align: "center", valign: "middle", margin: 0,
      });
      slide.addText(item, {
        x: x + 0.7, y: iy - 0.04, w: colW - 0.95, h: 0.44,
        fontSize: 14, color: T.textDark, fontFace: FONT_BODY,
        valign: "middle", margin: 0,
      });
    });
  });
}

function buildRecap(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, "Recap");

  const leftW = 7.15;
  s.recap_points.forEach((pt, i) => {
    addBulletRow(slide, pt, MARGIN, 1.15 + i * 0.62, leftW, 14, T.textDark, T.accent2, 0.55);
  });

  const x = MARGIN + leftW + 0.35;
  const w = CONTENT_W - leftW - 0.35;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y: 1.1, w, h: 4.55, rectRadius: 0.07,
    fill: { color: T.white }, line: { color: T.line, width: 1 },
  });
  slide.addText("PROGRESSION", {
    x: x + 0.2, y: 1.22, w: w - 0.4, h: 0.3,
    fontSize: 11, bold: true, color: T.accent2, fontFace: FONT_BODY,
  });
  s.progression.forEach((label, i) => {
    const iy = 1.6 + i * 0.52;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: iy, w: w - 0.4, h: 0.44, rectRadius: 0.05,
      fill: { color: i === 0 ? T.accent2 : T.light },
      line: { color: T.accent2, width: 0.75 },
    });
    slide.addText((i + 1) + "  " + label, {
      x: x + 0.32, y: iy, w: w - 0.64, h: 0.44,
      fontSize: 12, bold: true, color: i === 0 ? T.white : T.primary,
      fontFace: FONT_BODY, valign: "middle", margin: 0,
    });
  });

  banner(slide, MARGIN, 6.35, CONTENT_W, 0.65, s.transition, {
    fill: T.secondary, accent: T.accent, fontSize: 13, italic: true, color: "CADCFC",
  });
}

function buildArchitectureIntro(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, "Architecture");

  banner(slide, MARGIN, 1.1, CONTENT_W, 0.7, s.statement, {
    fill: T.primary, accent: T.accent, fontSize: 15, italic: true,
  });

  const d = s.diagram;
  const rootW = 4.2;
  const rootX = (PAGE_W - rootW) / 2;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: rootX, y: 2.05, w: rootW, h: 0.62, rectRadius: 0.07,
    fill: { color: T.accent2 }, line: { color: T.accent2 },
  });
  slide.addText(d.root, {
    x: rootX, y: 2.05, w: rootW, h: 0.62,
    fontSize: 16, bold: true, color: T.white, fontFace: FONT_HEAD,
    align: "center", valign: "middle",
  });

  const children = d.children || [];
  const gap = 0.35;
  const childW = (CONTENT_W - gap * (children.length - 1)) / children.length;
  const childY = 3.35;
  children.forEach((name, i) => {
    const cx = MARGIN + i * (childW + gap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: rootX + rootW / 2 - 0.01, y: 2.67, w: 0.02, h: 0.28,
      fill: { color: T.accent }, line: { color: T.accent },
    });
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: childY, w: childW, h: 0.7, rectRadius: 0.07,
      fill: { color: T.white }, line: { color: T.accent, width: 1.25 },
    });
    slide.addText(name, {
      x: cx, y: childY, w: childW, h: 0.7,
      fontSize: 14, bold: true, color: T.primary, fontFace: FONT_HEAD,
      align: "center", valign: "middle",
    });

    const gcs = (d.grandchildren && d.grandchildren[name]) || [];
    gcs.forEach((gc, gi) => {
      const gy = childY + 0.95 + gi * 0.62;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx + 0.4, y: gy, w: childW - 0.8, h: 0.5, rectRadius: 0.05,
        fill: { color: T.accent }, line: { color: T.accent },
      });
      slide.addText(gc, {
        x: cx + 0.4, y: gy, w: childW - 0.8, h: 0.5,
        fontSize: 13, bold: true, color: T.primary, fontFace: FONT_BODY,
        align: "center", valign: "middle",
      });
    });
  });

  if (d.title) {
    slide.addText(d.title, {
      x: MARGIN, y: 1.9, w: CONTENT_W, h: 0.12,
      fontSize: 11, color: T.muted, fontFace: FONT_BODY, align: "center",
    });
  }

  banner(slide, MARGIN, 6.35, CONTENT_W, 0.65, s.point, {
    fill: T.white, accent: T.accent2, line: T.accent2, lineWidth: 1,
    fontSize: 14, italic: true, color: T.primary,
  });
}

function buildSectionDivider(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addShape(pres.shapes.OVAL, {
    x: 10.2, y: -1.4, w: 4.6, h: 4.6,
    fill: { color: T.secondary }, line: { color: T.secondary },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: -1.3, y: 5.2, w: 3.4, h: 3.4,
    fill: { color: T.secondary }, line: { color: T.secondary },
  });

  slide.addText(s.section, {
    x: MARGIN, y: 2.35, w: CONTENT_W, h: 0.4,
    fontSize: 14, bold: true, color: T.accent, fontFace: FONT_BODY,
    charSpacing: 2,
  });
  slide.addShape(pres.shapes.OVAL, {
    x: MARGIN, y: 2.9, w: 0.14, h: 0.14,
    fill: { color: T.accent }, line: { color: T.accent },
  });
  slide.addText(s.title, {
    x: MARGIN, y: 3.15, w: CONTENT_W, h: 0.85,
    fontSize: 36, bold: true, color: T.white, fontFace: FONT_HEAD,
  });
  slide.addText(s.subtitle, {
    x: MARGIN, y: 4.1, w: 11, h: 0.5,
    fontSize: 16, color: "CADCFC", fontFace: FONT_BODY,
  });
}

function buildConcept(s) {
  if (s.comparison_table && (s.definition_constant || s.definition_immutable)) {
    return buildConstantImmutable(s);
  }
  if (s.decision_flow) return buildReceiveFallback(s);
  if (s.syntax_simple || s.syntax_usage) return buildCustomErrorsConcept(s);
  if (s.key_formula) return buildFormulaConcept(s);
  if (s.comparison && s.comparison.normal_function) return buildAbstractVsNormal(s);
  if (s.code_abstract || s.code_child) return buildPaymentConcept(s);
  if (s.example_code) return buildInterfaceConcept(s);
  if (s.comparison && (s.comparison.without || s.comparison.with_using)) {
    return buildLibraryConcept(s);
  }
  return buildGenericConcept(s);
}

function buildAbstractVsNormal(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);
  banner(slide, MARGIN, 1.08, CONTENT_W, 0.72, s.definition, {
    fill: T.primary, accent: T.accent, fontSize: 14, italic: true,
  });

  const colW = (CONTENT_W - 0.35) / 2;
  const nf = s.comparison.normal_function;
  const af = s.comparison.abstract_function;
  codePanel(slide, MARGIN, 1.98, colW, 2.55, nf.label, nf.code, 12);
  codePanel(slide, MARGIN + colW + 0.35, 1.98, colW, 2.55, af.label, af.code, 12);

  slide.addText("Key Points", {
    x: MARGIN, y: 4.68, w: 4, h: 0.28,
    fontSize: 13, bold: true, color: T.primary, fontFace: FONT_HEAD,
  });
  s.key_points.forEach((pt, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = MARGIN + col * (CONTENT_W / 2);
    addBulletRow(slide, pt, x, 5.02 + row * 0.42, CONTENT_W / 2 - 0.2, 13, T.textDark, T.accent, 0.4);
  });
}

function buildPaymentConcept(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);
  if (s.analogy) {
    banner(slide, MARGIN, 1.05, CONTENT_W, 0.58, s.analogy, {
      fill: T.secondary, accent: T.accent, fontSize: 13, italic: true, color: "CADCFC",
    });
  }

  const d = s.diagram || {};
  const leftW = 4.4;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN, y: 1.82, w: leftW, h: 0.55, rectRadius: 0.06,
    fill: { color: T.accent2 }, line: { color: T.accent2 },
  });
  slide.addText(d.root || "", {
    x: MARGIN, y: 1.82, w: leftW, h: 0.55,
    fontSize: 13, bold: true, color: T.white, fontFace: FONT_HEAD,
    align: "center", valign: "middle",
  });
  (d.children || []).forEach((name, i) => {
    const y = 2.55 + i * 0.7;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: MARGIN + 0.35, y, w: leftW - 0.7, h: 0.55, rectRadius: 0.06,
      fill: { color: T.white }, line: { color: T.accent, width: 1.1 },
    });
    slide.addText(name, {
      x: MARGIN + 0.35, y, w: leftW - 0.7, h: 0.55,
      fontSize: 13, bold: true, color: T.primary, fontFace: FONT_BODY,
      align: "center", valign: "middle",
    });
  });

  const codeX = MARGIN + leftW + 0.3;
  const codeW = CONTENT_W - leftW - 0.3;
  codePanel(slide, codeX, 1.82, codeW, 1.85, "Abstract", s.code_abstract, 11);
  codePanel(slide, codeX, 3.8, codeW, 2.15, "Child implementation", s.code_child, 11);

  if (s.insight) {
    banner(slide, MARGIN, 6.35, CONTENT_W, 0.65, s.insight, {
      fill: T.white, accent: T.accent, line: T.accent, lineWidth: 1,
      fontSize: 13, italic: true, color: T.primary,
    });
  }
}

function buildInterfaceConcept(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);

  if (s.definition) {
    banner(slide, MARGIN, 1.05, CONTENT_W, 0.7, s.definition, {
      fill: T.primary, accent: T.accent, fontSize: 13, italic: true,
    });
  }
  if (s.analogy) {
    banner(slide, MARGIN, 1.85, CONTENT_W, 0.55, s.analogy, {
      fill: T.white, accent: T.accent2, line: T.accent2, lineWidth: 1,
      fontSize: 13, italic: true, color: T.textDark,
    });
  }

  const leftW = 6.4;
  slide.addText("Rules", {
    x: MARGIN, y: 2.55, w: 3, h: 0.28,
    fontSize: 13, bold: true, color: T.primary, fontFace: FONT_HEAD,
  });
  (s.rules || []).forEach((rule, i) => {
    addBulletRow(slide, rule, MARGIN, 2.9 + i * 0.5, leftW, 14, T.textDark, T.accent, 0.45);
  });
  codePanel(slide, MARGIN + leftW + 0.3, 2.55, CONTENT_W - leftW - 0.3, 4.15, "Example", s.example_code, 13);
}

function buildFormulaConcept(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN, y: 1.08, w: CONTENT_W, h: 0.78, rectRadius: 0.07,
    fill: { color: T.accent2 }, line: { color: T.accent2 },
  });
  slide.addText(s.key_formula, {
    x: MARGIN, y: 1.08, w: CONTENT_W, h: 0.78,
    fontSize: 18, bold: true, color: T.white, fontFace: FONT_HEAD,
    align: "center", valign: "middle",
  });
  banner(slide, MARGIN, 2.02, CONTENT_W, 0.85, s.explanation, {
    fill: T.white, accent: T.accent, line: T.line, lineWidth: 1,
    fontSize: 13, italic: true, color: T.textDark,
  });

  const steps = (s.diagram && s.diagram.steps) || [];
  steps.forEach((step, i) => {
    const y = 3.05 + i * 0.52;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: MARGIN, y, w: 0.4, h: 0.4, rectRadius: 0.05,
      fill: { color: T.accent }, line: { color: T.accent },
    });
    slide.addText(String(i + 1), {
      x: MARGIN, y, w: 0.4, h: 0.4,
      fontSize: 13, bold: true, color: T.primary, fontFace: FONT_BODY,
      align: "center", valign: "middle",
    });
    slide.addText(step, {
      x: MARGIN + 0.55, y, w: 7.3, h: 0.4,
      fontSize: 14, color: T.textDark, fontFace: FONT_BODY, valign: "middle",
    });
  });

  const v = s.visual || {};
  const vx = 9.05;
  card(slide, vx, 3.05, 3.8, 3.5, T.primary, "Call flow");
  [["From", v.contract_a], ["Via", v.arrow], ["To", v.contract_b], ["Result", v.result]].forEach((row, i) => {
    slide.addText(row[0], {
      x: vx + 0.2, y: 3.6 + i * 0.68, w: 3.4, h: 0.22,
      fontSize: 10, bold: true, color: T.accent2, fontFace: FONT_BODY,
    });
    slide.addText(String(row[1] || ""), {
      x: vx + 0.2, y: 3.8 + i * 0.68, w: 3.4, h: 0.32,
      fontSize: 13, color: T.primary, fontFace: FONT_HEAD,
    });
  });
}

function buildLibraryConcept(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);
  if (s.definition) {
    banner(slide, MARGIN, 1.05, CONTENT_W, 0.7, s.definition, {
      fill: T.primary, accent: T.accent, fontSize: 13, italic: true,
    });
  }
  if (s.analogy) {
    banner(slide, MARGIN, 1.85, CONTENT_W, 0.52, s.analogy, {
      fill: T.white, accent: T.accent2, line: T.accent2, lineWidth: 1,
      fontSize: 13, italic: true, color: T.textDark,
    });
  }
  (s.rules || []).forEach((rule, i) => {
    addBulletRow(slide, rule, MARGIN, 2.55 + i * 0.48, 7.4, 14, T.textDark, T.accent, 0.44);
  });
  const cx = 8.2;
  card(slide, cx, 2.55, 4.65, 1.7, T.accent2, "Without using for");
  slide.addText(s.comparison.without, {
    x: cx + 0.2, y: 3.1, w: 4.25, h: 0.95,
    fontSize: 14, color: T.primary, fontFace: FONT_CODE, valign: "middle",
  });
  card(slide, cx, 4.45, 4.65, 1.7, T.accent, "With using for");
  slide.addText(s.comparison.with_using, {
    x: cx + 0.2, y: 5.0, w: 4.25, h: 0.95,
    fontSize: 16, bold: true, color: T.primary, fontFace: FONT_CODE, valign: "middle",
  });
}

function buildCustomErrorsConcept(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);
  banner(slide, MARGIN, 1.02, CONTENT_W, 0.68, s.definition, {
    fill: T.primary, accent: T.accent, fontSize: 13, italic: true,
  });

  const synW = (CONTENT_W - 0.4) / 3;
  [
    { label: "Simple error", code: s.syntax_simple },
    { label: "Usage", code: s.syntax_usage },
    { label: "With parameters", code: s.syntax_with_params },
  ].forEach((box, i) => {
    codePanel(slide, MARGIN + i * (synW + 0.2), 1.82, synW, 1.85, box.label, box.code, 11);
  });

  const colW = (CONTENT_W - 0.35) / 2;
  const req = s.comparison.require;
  const err = s.comparison.custom_error;
  [req, err].forEach((c, i) => {
    const x = MARGIN + i * (colW + 0.35);
    card(slide, x, 3.85, colW, 2.75, i === 0 ? T.accent2 : T.accent, c.label);
    slide.addText(c.code, {
      x: x + 0.18, y: 4.38, w: colW - 0.36, h: 1.15,
      fontSize: 12, color: T.textDark, fontFace: FONT_CODE, valign: "top",
    });
    slide.addText("Pro: " + c.pros, {
      x: x + 0.18, y: 5.55, w: colW - 0.36, h: 0.38,
      fontSize: 12, color: T.green, fontFace: FONT_BODY,
    });
    slide.addText("Con: " + c.cons, {
      x: x + 0.18, y: 5.95, w: colW - 0.36, h: 0.45,
      fontSize: 12, color: T.red, fontFace: FONT_BODY,
    });
  });
}

function buildConstantImmutable(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);

  const colW = (CONTENT_W - 0.3) / 2;
  banner(slide, MARGIN, 1.02, colW, 0.72, s.definition_constant, {
    fill: T.accent2, accent: T.accent, fontSize: 12, italic: true,
  });
  banner(slide, MARGIN + colW + 0.3, 1.02, colW, 0.72, s.definition_immutable, {
    fill: T.primary, accent: T.accent, fontSize: 12, italic: true,
  });
  codePanel(slide, MARGIN, 1.86, colW, 2.05, "constant", s.code_constant, 12);
  codePanel(slide, MARGIN + colW + 0.3, 1.86, colW, 2.05, "immutable", s.code_immutable, 12);

  const tbl = s.comparison_table;
  const rows = [tbl.columns, ...tbl.rows];
  const tableRows = rows.map((row, ri) =>
    row.map((cell) => ({
      text: String(cell),
      options: {
        fill: { color: ri === 0 ? T.primary : ri % 2 === 0 ? "EAF2FB" : T.white },
        color: ri === 0 ? T.white : T.textDark,
        bold: ri === 0 || row.indexOf(cell) === 0,
        fontFace: FONT_BODY,
        fontSize: 12,
        align: "left",
        valign: "middle",
      },
    }))
  );
  slide.addTable(tableRows, {
    x: MARGIN, y: 4.08, w: CONTENT_W, h: 2.55,
    colW: [3.2, 4.55, 4.583],
    border: [{ pt: 0.5, color: T.line }],
    fontFace: FONT_BODY,
  });
}

function buildReceiveFallback(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);
  banner(slide, MARGIN, 1.02, CONTENT_W, 0.55, s.question, {
    fill: T.primary, accent: T.accent, fontSize: 15, italic: true,
  });

  const colW = (CONTENT_W - 0.3) / 2;
  banner(slide, MARGIN, 1.7, colW, 0.7, s.receive_def, {
    fill: T.white, accent: T.accent, line: T.accent, lineWidth: 1,
    fontSize: 12, italic: true, color: T.textDark,
  });
  banner(slide, MARGIN + colW + 0.3, 1.7, colW, 0.7, s.fallback_def, {
    fill: T.white, accent: T.accent2, line: T.accent2, lineWidth: 1,
    fontSize: 12, italic: true, color: T.textDark,
  });
  codePanel(slide, MARGIN, 2.52, colW, 1.45, "receive()", s.syntax_receive, 13);
  codePanel(slide, MARGIN + colW + 0.3, 2.52, colW, 1.45, "fallback()", s.syntax_fallback, 13);

  slide.addText("Decision flow", {
    x: MARGIN, y: 4.12, w: 4, h: 0.28,
    fontSize: 13, bold: true, color: T.primary, fontFace: FONT_HEAD,
  });
  const n = s.decision_flow.length;
  const boxW = (CONTENT_W - 0.18 * (n - 1)) / n;
  s.decision_flow.forEach((step, i) => {
    const x = MARGIN + i * (boxW + 0.18);
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 4.48, w: boxW, h: 1.95, rectRadius: 0.06,
      fill: { color: i % 2 === 0 ? T.accent2 : T.primary },
      line: { color: i % 2 === 0 ? T.accent2 : T.primary },
    });
    slide.addText(String(i + 1), {
      x, y: 4.55, w: boxW, h: 0.28,
      fontSize: 11, bold: true, color: T.accent, fontFace: FONT_BODY, align: "center",
    });
    slide.addText(step, {
      x: x + 0.08, y: 4.85, w: boxW - 0.16, h: 1.4,
      fontSize: 11, color: T.white, fontFace: FONT_BODY, align: "center", valign: "top",
    });
  });
}

function buildGenericConcept(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);
  if (s.definition) {
    banner(slide, MARGIN, 1.08, CONTENT_W, 0.8, s.definition, {
      fill: T.primary, accent: T.accent, fontSize: 14, italic: true,
    });
  }
  const points = s.key_points || s.rules || [];
  points.forEach((pt, i) => {
    addBulletRow(slide, pt, MARGIN, 2.1 + i * 0.55, CONTENT_W, 15, T.textDark, T.accent, 0.5);
  });
}

function buildCodeSlide(s) {
  if (s.real_world) return buildRealWorld(s);
  if (s.code_library || s.code_without || s.code_with) return buildLibraryCode(s);
  if (s.code_interface || s.code_implementation) return buildInterfaceCode(s);
  if (s.code_caller) return buildCallerCode(s);
  if (s.comparison && (s.comparison.read || s.comparison.write)) return buildReadWriteCode(s);
  if (s.key_variables) return buildEtherReceiverCode(s);
  if (s.diagram && s.diagram.parent) return buildAnimalCode(s);
  return buildSimpleCode(s);
}

function buildAnimalCode(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.label || s.title);
  codePanel(slide, MARGIN, 1.0, 7.55, 5.0, s.label, s.code, 10);

  const x = 8.25;
  const d = s.diagram;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y: 1.0, w: 4.6, h: 0.7, rectRadius: 0.06,
    fill: { color: T.primary }, line: { color: T.primary },
  });
  slide.addText(d.parent, {
    x, y: 1.0, w: 4.6, h: 0.7,
    fontSize: 14, bold: true, color: T.white, fontFace: FONT_HEAD,
    align: "center", valign: "middle",
  });
  slide.addText(d.note_abstract, {
    x: x + 0.15, y: 1.78, w: 4.3, h: 0.32,
    fontSize: 12, color: T.red, fontFace: FONT_BODY, italic: true,
  });
  slide.addText(d.note_implemented, {
    x: x + 0.15, y: 2.1, w: 4.3, h: 0.32,
    fontSize: 12, color: T.green, fontFace: FONT_BODY, italic: true,
  });
  (d.children || []).forEach((ch, i) => {
    const y = 2.55 + i * 0.85;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.6, h: 0.72, rectRadius: 0.06,
      fill: { color: T.white }, line: { color: T.accent, width: 1.1 },
    });
    slide.addText(ch.name + "  →  " + ch.result, {
      x, y, w: 4.6, h: 0.72,
      fontSize: 15, bold: true, color: T.primary, fontFace: FONT_HEAD,
      align: "center", valign: "middle",
    });
  });
  (s.steps || []).forEach((step, i) => {
    addBulletRow(slide, step, x, 4.35 + i * 0.4, 4.6, 11, T.textDark, T.accent2, 0.38);
  });
}

function buildInterfaceCode(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.label || s.title);
  const colW = (CONTENT_W - 0.3) / 2;
  codePanel(slide, MARGIN, 1.0, colW, 4.35, "Interface", s.code_interface, 12);
  codePanel(slide, MARGIN + colW + 0.3, 1.0, colW, 4.35, "Implementation", s.code_implementation, 12);
  (s.flow || []).forEach((step, i) => {
    const n = s.flow.length;
    const boxW = (CONTENT_W - 0.18 * (n - 1)) / n;
    const x = MARGIN + i * (boxW + 0.18);
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 5.5, w: boxW, h: 1.15, rectRadius: 0.06,
      fill: { color: i % 2 === 0 ? T.accent2 : T.primary },
    });
    slide.addText(step, {
      x: x + 0.08, y: 5.5, w: boxW - 0.16, h: 1.15,
      fontSize: 12, color: T.white, fontFace: FONT_BODY,
      align: "center", valign: "middle",
    });
  });
}

function buildCallerCode(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.label || s.title);
  codePanel(slide, MARGIN, 1.0, 7.5, 4.55, s.label, s.code_caller, 11);

  const x = 8.2;
  if (s.key_line) {
    card(slide, x, 1.0, 4.65, 2.15, T.accent2, "Key line");
    slide.addText(s.key_line.code, {
      x: x + 0.15, y: 1.52, w: 4.35, h: 0.7,
      fontSize: 11, color: T.primary, fontFace: FONT_CODE,
    });
    slide.addText(s.key_line.explanation, {
      x: x + 0.15, y: 2.22, w: 4.35, h: 0.78,
      fontSize: 12, color: T.textDark, fontFace: FONT_BODY,
    });
  }
  slide.addText("Remix steps", {
    x, y: 3.3, w: 4.65, h: 0.28,
    fontSize: 13, bold: true, color: T.primary, fontFace: FONT_HEAD,
  });
  (s.steps || []).forEach((step, i) => {
    addBulletRow(slide, step, x, 3.62 + i * 0.45, 4.65, 12, T.textDark, T.accent, 0.42);
  });
  if (s.result) {
    banner(slide, MARGIN, 5.7, CONTENT_W, 0.9, s.result, {
      fill: T.primary, accent: T.accent, fontSize: 16, italic: true,
    });
  }
}

function buildReadWriteCode(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.label || s.title);
  codePanel(slide, MARGIN, 1.0, 6.6, 4.35, s.label, s.code, 13);

  const x = 7.35;
  const colW = 5.5;
  const read = s.comparison.read;
  const write = s.comparison.write;
  [read, write].forEach((c, i) => {
    const y = 1.0 + i * 2.15;
    card(slide, x, y, colW, 2.0, i === 0 ? T.accent2 : T.amber, (c.icon ? c.icon + "  " : "") + c.label);
    slide.addText(c.detail, {
      x: x + 0.2, y: y + 0.58, w: colW - 0.4, h: 1.2,
      fontSize: 14, color: T.textDark, fontFace: FONT_BODY, valign: "middle",
    });
  });
  if (s.note) {
    banner(slide, MARGIN, 5.55, CONTENT_W, 1.05, s.note, {
      fill: T.white, accent: T.accent, line: T.accent, lineWidth: 1,
      fontSize: 13, italic: true, color: T.primary,
    });
  }
}

function buildLibraryCode(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.label || s.title);
  const w = (CONTENT_W - 0.4) / 3;
  codePanel(slide, MARGIN, 1.0, w, 3.55, "Library", s.code_library, 12);
  codePanel(slide, MARGIN + w + 0.2, 1.0, w, 3.55, "Without using for", s.code_without, 11);
  codePanel(slide, MARGIN + 2 * (w + 0.2), 1.0, w, 3.55, "With using for", s.code_with, 11);
  if (s.key_insight) {
    banner(slide, MARGIN, 4.7, CONTENT_W, 0.7, s.key_insight, {
      fill: T.primary, accent: T.accent, fontSize: 13, italic: true,
    });
  }
  (s.steps || []).forEach((step, i) => {
    const n = s.steps.length;
    const boxW = (CONTENT_W - 0.18 * (n - 1)) / n;
    const x = MARGIN + i * (boxW + 0.18);
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 5.55, w: boxW, h: 1.1, rectRadius: 0.06,
      fill: { color: i % 2 === 0 ? T.accent2 : T.primary },
    });
    slide.addText((i + 1) + ". " + step, {
      x: x + 0.08, y: 5.55, w: boxW - 0.16, h: 1.1,
      fontSize: 12, color: T.white, fontFace: FONT_BODY,
      align: "center", valign: "middle",
    });
  });
}

function buildSimpleCode(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.label || s.title);
  const hasSide = (s.steps && s.steps.length) || s.note;
  const codeW = hasSide ? 8.0 : CONTENT_W;
  codePanel(slide, MARGIN, 1.0, codeW, hasSide ? 5.15 : 5.55, s.label, s.code, codeFontSize(s.code, 5));

  if (hasSide) {
    const x = MARGIN + codeW + 0.28;
    const w = CONTENT_W - codeW - 0.28;
    if (s.steps) {
      slide.addText("Remix steps", {
        x, y: 1.0, w, h: 0.3,
        fontSize: 13, bold: true, color: T.primary, fontFace: FONT_HEAD,
      });
      s.steps.forEach((step, i) => {
        addBulletRow(slide, step, x, 1.4 + i * 0.7, w, 13, T.textDark, T.accent, 0.65);
      });
    }
    if (s.note) {
      banner(slide, x, 5.15, w, 1.0, s.note, {
        fill: T.white, accent: T.accent2, line: T.accent2, lineWidth: 1,
        fontSize: 12, italic: true, color: T.primary,
      });
    }
  }
}

function buildEtherReceiverCode(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.label || s.title);
  codePanel(slide, MARGIN, 1.0, 7.55, 5.55, s.label, s.code, 11);
  const x = 8.25;
  slide.addText("Key variables", {
    x, y: 1.0, w: 4.6, h: 0.3,
    fontSize: 13, bold: true, color: T.primary, fontFace: FONT_HEAD,
  });
  (s.key_variables || []).forEach((kv, i) => {
    const y = 1.4 + i * 1.05;
    card(slide, x, y, 4.6, 0.95, T.accent2, kv.name);
    slide.addText(kv.meaning, {
      x: x + 0.15, y: y + 0.45, w: 4.3, h: 0.42,
      fontSize: 12, color: T.textDark, fontFace: FONT_BODY,
    });
  });
  (s.steps || []).forEach((step, i) => {
    addBulletRow(slide, step, x, 4.65 + i * 0.45, 4.6, 12, T.textDark, T.accent, 0.42);
  });
}

function buildRealWorld(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.label || s.title);

  const items = s.real_world;
  const gap = 0.25;
  const colW = (CONTENT_W - gap) / 2;
  const rowH = 1.85;
  items.forEach((it, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * (colW + gap);
    const y = 1.05 + row * (rowH + 0.22);
    card(slide, x, y, colW, rowH, it.color || T.accent2, it.name);
    slide.addText(it.detail, {
      x: x + 0.22, y: y + 0.55, w: colW - 0.44, h: 1.15,
      fontSize: 14, color: T.textDark, fontFace: FONT_BODY, valign: "top",
    });
  });
  if (s.key_insight) {
    banner(slide, MARGIN, 6.35, CONTENT_W, 0.65, s.key_insight, {
      fill: T.primary, accent: T.accent, fontSize: 14, italic: true,
    });
  }
}

function buildComparisonTable(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);

  const rows = [s.columns, ...s.rows];
  const tableRows = rows.map((row, ri) =>
    row.map((cell, ci) => ({
      text: String(cell),
      options: {
        fill: { color: ri === 0 ? T.primary : ri % 2 === 0 ? "EAF2FB" : T.white },
        color: ri === 0 ? T.white : T.textDark,
        bold: ri === 0 || ci === 0,
        fontFace: FONT_BODY,
        fontSize: 13,
        align: ci === 0 ? "left" : "center",
        valign: "middle",
      },
    }))
  );
  slide.addTable(tableRows, {
    x: MARGIN, y: 1.1, w: CONTENT_W, h: 5.15,
    colW: [3.4, 4.466, 4.467],
    border: [{ pt: 0.6, color: T.line }],
    fontFace: FONT_BODY,
  });
  if (s.summary) {
    banner(slide, MARGIN, 6.4, CONTENT_W, 0.6, s.summary, {
      fill: T.primary, accent: T.accent, fontSize: 14, italic: true,
    });
  }
}

function buildFinalArchitecture(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, s.title);
  if (s.description) {
    slide.addText(s.description, {
      x: MARGIN, y: 0.92, w: CONTENT_W, h: 0.32,
      fontSize: 13, italic: true, color: T.muted, fontFace: FONT_BODY,
    });
  }

  const layers = s.layers;
  const gap = 0.22;
  const colW = (CONTENT_W - gap * 2) / 3;
  const rowH = 2.35;
  layers.forEach((layer, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = MARGIN + col * (colW + gap);
    const y = 1.38 + row * (rowH + 0.22);
    card(slide, x, y, colW, rowH, layer.color, layer.label);
    layer.items.forEach((item, ii) => {
      addBulletRow(slide, item, x + 0.18, y + 0.58 + ii * 0.5, colW - 0.36, 13, T.textDark, layer.color, 0.46);
    });
  });
}

function buildSummaryTable(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, "Summary");

  const header = ["Concept", "Keyword", "Meaning"];
  const rows = [
    header.map((h) => ({
      text: h,
      options: {
        fill: { color: T.primary }, color: T.white, bold: true,
        fontFace: FONT_BODY, fontSize: 12, align: "left", valign: "middle",
      },
    })),
    ...s.items.map((it, i) => [
      {
        text: it.concept,
        options: {
          fill: { color: i % 2 === 0 ? T.white : "EAF2FB" },
          color: T.primary, bold: true, fontFace: FONT_BODY, fontSize: 11, valign: "middle",
        },
      },
      {
        text: it.keyword,
        options: {
          fill: { color: i % 2 === 0 ? T.white : "EAF2FB" },
          color: T.accent2, fontFace: FONT_CODE, fontSize: 11, valign: "middle",
        },
      },
      {
        text: it.meaning,
        options: {
          fill: { color: i % 2 === 0 ? T.white : "EAF2FB" },
          color: T.textDark, fontFace: FONT_BODY, fontSize: 11, valign: "middle",
        },
      },
    ]),
  ];
  slide.addTable(rows, {
    x: MARGIN, y: 0.95, w: CONTENT_W, h: 6.05,
    colW: [2.6, 3.4, 6.333],
    border: [{ pt: 0.4, color: T.line }],
    fontFace: FONT_BODY,
  });
}

function buildPracticalOrder(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  slideHeader(slide, s.title);
  footerBar(slide, "Remix Practicals");

  const items = s.items;
  const colW = (CONTENT_W - 0.3) / 2;
  items.forEach((it, i) => {
    const col = i < 6 ? 0 : 1;
    const row = i % 6;
    const x = MARGIN + col * (colW + 0.3);
    const y = 1.05 + row * 0.9;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: colW, h: 0.8, rectRadius: 0.06,
      fill: { color: T.white }, line: { color: T.line, width: 1 },
    });
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.12, y: y + 0.18, w: 0.44, h: 0.44, rectRadius: 0.05,
      fill: { color: T.accent2 }, line: { color: T.accent2 },
    });
    slide.addText(String(it.step), {
      x: x + 0.12, y: y + 0.18, w: 0.44, h: 0.44,
      fontSize: 13, bold: true, color: T.white, fontFace: FONT_BODY,
      align: "center", valign: "middle",
    });
    slide.addText(it.contract, {
      x: x + 0.68, y: y + 0.08, w: colW - 0.85, h: 0.32,
      fontSize: 13, bold: true, color: T.primary, fontFace: FONT_HEAD,
    });
    slide.addText(it.concepts, {
      x: x + 0.68, y: y + 0.4, w: colW - 0.85, h: 0.32,
      fontSize: 11, color: T.muted, fontFace: FONT_BODY,
    });
  });
}

function buildClosing(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addShape(pres.shapes.OVAL, {
    x: 10.5, y: -1.2, w: 4.0, h: 4.0,
    fill: { color: T.secondary }, line: { color: T.secondary },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: -1.2, y: 5.4, w: 3.2, h: 3.2,
    fill: { color: T.secondary }, line: { color: T.secondary },
  });

  slide.addText(s.title, {
    x: MARGIN, y: 0.35, w: CONTENT_W, h: 0.55,
    fontSize: 30, bold: true, color: T.white, fontFace: FONT_HEAD,
  });
  slide.addText(s.subtitle, {
    x: MARGIN, y: 0.92, w: CONTENT_W, h: 0.32,
    fontSize: 14, color: T.accent, fontFace: FONT_BODY,
  });
  banner(slide, MARGIN, 1.35, CONTENT_W, 0.7, s.key_message, {
    fill: T.secondary, accent: T.accent, fontSize: 14, italic: true, color: "CADCFC",
  });

  (s.recap || []).forEach((pt, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i < 4 ? i : i - 4;
    const x = MARGIN + col * (CONTENT_W / 2);
    addBulletRow(slide, pt, x, 2.22 + row * 0.48, CONTENT_W / 2 - 0.2, 14, T.white, T.accent, 0.44);
  });

  banner(slide, MARGIN, 5.15, CONTENT_W, 0.95, s.closing_statement, {
    fill: T.secondary, accent: T.accent2, fontSize: 13, italic: true, color: "CADCFC",
  });
  slide.addText(s.next, {
    x: MARGIN, y: 6.22, w: CONTENT_W, h: 0.32,
    fontSize: 14, bold: true, color: T.accent, fontFace: FONT_BODY,
  });
  slide.addText([
    { text: s.footer || "Thank You", options: { breakLine: true } },
    { text: CREDIT_LINE },
  ], {
    x: MARGIN, y: PAGE_H - 0.62, w: CONTENT_W, h: 0.5,
    fontFace: FONT_BODY, fontSize: 10, color: "9AA3B8", align: "left", valign: "top",
  });
}

// ─── DISPATCH ─────────────────────────────────────────────────────────────────
const BUILDERS = {
  title: buildTitle,
  agenda: buildAgenda,
  recap: buildRecap,
  architecture_intro: buildArchitectureIntro,
  section_divider: buildSectionDivider,
  concept: buildConcept,
  code_slide: buildCodeSlide,
  comparison_table: buildComparisonTable,
  final_architecture: buildFinalArchitecture,
  summary_table: buildSummaryTable,
  practical_order: buildPracticalOrder,
  closing: buildClosing,
};

data.slides.forEach((sl, idx) => {
  const fn = BUILDERS[sl.type];
  if (!fn) {
    throw new Error(`No renderer for slide type "${sl.type}" (slide ${idx + 1})`);
  }
  fn(sl);
});

const outputFile = path.join(OUTPUT_PATH, OUTPUT_FILE);
pres.writeFile({ fileName: outputFile })
  .then(() => {
    console.log(`Wrote ${outputFile} (${data.slides.length} slides)`);
  })
  .catch((err) => {
    console.error("Failed to write presentation:", err);
    process.exit(1);
  });
