/**
 * Blockchain & Solidity — Lecture #3 Presentation Generator
 * Reads:    lecture3_slides.json
 * Output:   Lecture3_Arrays_Structs_Mappings.pptx  →  OUTPUT_PATH
 *
 * Install:  npm install pptxgenjs
 * Run:      node generate_lecture3.js
 */

const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");
const os      = require("os");

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ROOT = path.join(__dirname, "..");
const JSON_FILE = path.join(ROOT, "data", "lecture4_slides.json");
const OUTPUT_PATH = path.join(ROOT, "slides");
const OUTPUT_FILE = "Lecture4_Solidity_Function_types.pptx";
// ──────────────────────────────────────────────────────────────────────────────

const data = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
const T    = data.theme;

fs.mkdirSync(OUTPUT_PATH, { recursive: true });

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = data.author;
pres.title  = data.title;

const H = 5.625;

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

const darkBg  = slide => { slide.background = { color: T.primary }; };
const lightBg = slide => { slide.background = { color: "F4F9FE" };  };

function addSectionTag(slide, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 5.25, w: 2.6, h: 0.22,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(label.toUpperCase(), {
    x: 0.35, y: 5.25, w: 2.6, h: 0.22,
    fontSize: 7, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
}

function addTitleDark(slide, text) {
  slide.addText(text, {
    x: 0.45, y: 0.18, w: 9.1, h: 0.76,
    fontSize: 28, bold: true, color: T.white,
    fontFace: "Calibri", align: "left", valign: "middle"
  });
}

function addTitleLight(slide, text) {
  slide.addText(text, {
    x: 0.45, y: 0.1, w: 9.1, h: 0.76,
    fontSize: 26, bold: true, color: T.primary,
    fontFace: "Calibri", align: "left", valign: "middle"
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.45, y: 0.9, w: 0.11, h: 0.11,
    fill: { color: T.accent }, line: { color: T.accent }
  });
}

// Custom bullet — NO PptxGenJS bullet:true (avoids &#x2022; bug)
function addBulletRow(slide, text, x, y, w, fontSize, textColor, dotColor) {
  const DOT   = 0.09;
  const GAP   = 0.13;
  const NUDGE = 0.07;
  slide.addShape(pres.shapes.OVAL, {
    x, y: y + NUDGE, w: DOT, h: DOT,
    fill: { color: dotColor }, line: { color: dotColor }
  });
  slide.addText(text, {
    x: x + DOT + GAP, y,
    w: w - DOT - GAP, h: 0.54,
    fontSize, color: textColor,
    fontFace: "Calibri", align: "left", valign: "top", margin: 0
  });
}

// Tick mark row (for summary / checklist)
function addTickRow(slide, text, x, y, w, fontSize, textColor) {
  slide.addText("✓", {
    x, y, w: 0.28, h: 0.38,
    fontSize: fontSize + 1, color: T.accent,
    bold: true, fontFace: "Calibri", align: "center", valign: "middle", margin: 0
  });
  slide.addText(text, {
    x: x + 0.32, y, w: w - 0.32, h: 0.42,
    fontSize, color: textColor,
    fontFace: "Calibri", align: "left", valign: "middle", margin: 0
  });
}

// ─── SLIDE BUILDERS ───────────────────────────────────────────────────────────

// ── TITLE SLIDE ───────────────────────────────────────────────────────────────
function buildTitleSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: H,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 6.8, y: -1.0, w: 4.2, h: 4.2,
    fill: { color: "0A2A45", transparency: 30 },
    line: { color: "0A2A45", transparency: 30 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.3, y: 3.5, w: 2.4, h: 2.4,
    fill: { color: "00C2FF", transparency: 85 },
    line: { color: "00C2FF", transparency: 85 }
  });

  // Lecture badge
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.65, w: 1.5, h: 0.32,
    fill: { color: "0A2A45" }, line: { color: T.accent, width: 1 }
  });
  slide.addText("LECTURE #3", {
    x: 0.6, y: 0.65, w: 1.5, h: 0.32,
    fontSize: 9, bold: true, color: T.accent,
    align: "center", valign: "middle", margin: 0
  });

  slide.addText(s.title, {
    x: 0.6, y: 1.08, w: 7.2, h: 1.25,
    fontSize: 40, bold: true, color: T.accent,
    fontFace: "Calibri", align: "left"
  });
  slide.addText(s.subtitle, {
    x: 0.6, y: 2.45, w: 7.4, h: 0.6,
    fontSize: 18, color: T.white, fontFace: "Calibri Light", align: "left"
  });
  slide.addText(s.tagline, {
    x: 0.6, y: 3.18, w: 7.5, h: 0.55,
    fontSize: 12, color: "88BBDD",
    fontFace: "Calibri", align: "left", italic: true
  });
  slide.addText(s.footer, {
    x: 0.6, y: 5.2, w: 8.8, h: 0.26,
    fontSize: 9.5, color: T.muted, align: "left"
  });
}

// ── AGENDA SLIDE ──────────────────────────────────────────────────────────────
function buildAgendaSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Lecture Plan");

  const cols  = [0.35, 5.08];
  const rows  = 5;
  const rowH  = 0.86;
  const startY = 1.06;

  s.items.forEach((item, i) => {
    const col = i < rows ? 0 : 1;
    const row = i % rows;
    const x   = cols[col];
    const y   = startY + row * rowH;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: y + 0.08, w: 0.38, h: 0.36,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(item.num, {
      x, y: y + 0.08, w: 0.38, h: 0.36,
      fontSize: 9, bold: true, color: T.primary,
      align: "center", valign: "middle", margin: 0
    });
    slide.addText(item.label, {
      x: x + 0.48, y: y + 0.12, w: 4.4, h: 0.34,
      fontSize: 11.5, color: T.white, fontFace: "Calibri",
      align: "left", margin: 0
    });
  });
}

// ── DEFINITION SLIDE ─────────────────────────────────────────────────────────
function buildDefinitionSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Core Concept");

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.04, w: 9.1, h: 1.0,
    fill: { color: T.primary }, line: { color: T.primary }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.04, w: 0.12, h: 1.0,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(s.definition, {
    x: 0.72, y: 1.06, w: 8.66, h: 0.96,
    fontSize: 11, color: T.white, italic: true,
    fontFace: "Calibri", align: "left", valign: "middle", margin: 0
  });

  slide.addText("Key Points", {
    x: 0.45, y: 2.18, w: 3, h: 0.3,
    fontSize: 11.5, bold: true, color: T.primary, fontFace: "Calibri"
  });

  s.keyPoints.forEach((kp, idx) => {
    addBulletRow(slide, kp, 0.45, 2.55 + idx * 0.53, 9.1, 10.5, "1A3A5C", T.accent);
  });
}

// ── TWO-COLUMN SLIDE ──────────────────────────────────────────────────────────
function buildTwoColumnSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Detail");

  const colDefs = [
    { x: 0.38, title: s.leftTitle,  items: s.leftItems  },
    { x: 5.08, title: s.rightTitle, items: s.rightItems }
  ];

  colDefs.forEach((col) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 1.04, w: 4.52, h: 4.34,
      fill: { color: T.white },
      shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.1 },
      line: { color: "D8E8F5", width: 0.5 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 1.04, w: 4.52, h: 0.36,
      fill: { color: T.primary }, line: { color: T.primary }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 1.04, w: 0.1, h: 0.36,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(col.title, {
      x: col.x + 0.18, y: 1.04, w: 4.2, h: 0.36,
      fontSize: 11.5, bold: true, color: T.white,
      fontFace: "Calibri", valign: "middle", margin: 0
    });
    col.items.forEach((item, idx) => {
      addBulletRow(
        slide, item,
        col.x + 0.16, 1.50 + idx * 0.6,
        4.22, 10.5, "1A3A5C", T.accent
      );
    });
  });
}

// ── VISUAL ARRAY SLIDE ────────────────────────────────────────────────────────
function buildVisualArraySlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, s.subtitle);

  // Topic pill
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 0.9, w: 1.8, h: 0.26,
    fill: { color: "E0F5FF" }, line: { color: T.accent, width: 0.8 }
  });
  slide.addText(s.subtitle, {
    x: 0.45, y: 0.9, w: 1.8, h: 0.26,
    fontSize: 8.5, bold: true, color: T.accent,
    align: "center", valign: "middle", margin: 0
  });

  // Explanation text
  slide.addText(s.explanation, {
    x: 0.45, y: 1.24, w: 5.6, h: 0.72,
    fontSize: 11, color: "334466", fontFace: "Calibri"
  });

  // Left panel — problem code
  slide.addText(s.problem, {
    x: 0.45, y: 2.04, w: 2.7, h: 0.28,
    fontSize: 10, bold: true, color: "CC3333", fontFace: "Calibri"
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 2.34, w: 2.7, h: 1.38,
    fill: { color: "1A2F40" }, line: { color: "2A4560", width: 0.5 }
  });
  slide.addText(s.problemCode, {
    x: 0.55, y: 2.38, w: 2.55, h: 1.28,
    fontSize: 10, color: "FF8888", fontFace: "Courier New",
    align: "left", valign: "top", margin: 0
  });

  // Right panel — solution code
  slide.addText(s.solution, {
    x: 3.32, y: 2.04, w: 2.7, h: 0.28,
    fontSize: 10, bold: true, color: "007744", fontFace: "Calibri"
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.32, y: 2.34, w: 2.7, h: 1.38,
    fill: { color: "1A2F40" }, line: { color: T.accent, width: 0.8 }
  });
  slide.addText(s.solutionCode, {
    x: 3.42, y: 2.38, w: 2.55, h: 1.28,
    fontSize: 10, color: "88FFCC", fontFace: "Courier New",
    align: "left", valign: "top", margin: 0
  });

  // Index diagram — right side
  const diagX = 6.28;
  const diagY = 1.12;
  const rowH  = 0.56;

  // Header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: diagX, y: diagY, w: 1.1, h: 0.38,
    fill: { color: T.primary }, line: { color: T.accent, width: 0.8 }
  });
  slide.addText(s.indexLabel, {
    x: diagX, y: diagY, w: 1.1, h: 0.38,
    fontSize: 9, bold: true, color: T.accent,
    align: "center", valign: "middle", margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: diagX + 1.22, y: diagY, w: 1.1, h: 0.38,
    fill: { color: T.primary }, line: { color: T.accent, width: 0.8 }
  });
  slide.addText("Value", {
    x: diagX + 1.22, y: diagY, w: 1.1, h: 0.38,
    fontSize: 9, bold: true, color: T.accent,
    align: "center", valign: "middle", margin: 0
  });

  s.indexRows.forEach((row, i) => {
    const ry = diagY + 0.38 + i * rowH;
    const bg = i % 2 === 0 ? "E8F4FD" : T.white;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: diagX, y: ry, w: 1.1, h: rowH - 0.04,
      fill: { color: bg }, line: { color: "C8E0F4", width: 0.4 }
    });
    slide.addText(row.index, {
      x: diagX, y: ry, w: 1.1, h: rowH - 0.04,
      fontSize: 12, bold: true, color: T.accent,
      align: "center", valign: "middle", margin: 0, fontFace: "Courier New"
    });

    // Arrow
    slide.addText("→", {
      x: diagX + 1.12, y: ry, w: 0.1, h: rowH - 0.04,
      fontSize: 11, color: T.accent, align: "center", valign: "middle", margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: diagX + 1.22, y: ry, w: 1.1, h: rowH - 0.04,
      fill: { color: bg }, line: { color: "C8E0F4", width: 0.4 }
    });
    slide.addText(row.value, {
      x: diagX + 1.22, y: ry, w: 1.1, h: rowH - 0.04,
      fontSize: 12, bold: true, color: "1A3A5C",
      align: "center", valign: "middle", margin: 0, fontFace: "Courier New"
    });
  });

  // Note bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.08, w: 9.1, h: 0.32,
    fill: { color: "E0F0FF" }, line: { color: "B8D8F8", width: 0.5 }
  });
  slide.addText("  " + s.note, {
    x: 0.55, y: 5.1, w: 8.9, h: 0.28,
    fontSize: 10, color: T.primary, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ── VISUAL MAPPING SLIDE ──────────────────────────────────────────────────────
function buildVisualMappingSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, s.subtitle);

  // Topic pill
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 0.96, w: 2.2, h: 0.24,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(s.subtitle, {
    x: 0.45, y: 0.96, w: 2.2, h: 0.24,
    fontSize: 8, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });

  // Explanation
  slide.addText(s.explanation, {
    x: 0.45, y: 1.28, w: 5.4, h: 0.72,
    fontSize: 11, color: "AACCEE", fontFace: "Calibri", italic: true
  });

  // Real world label
  slide.addText(s.realWorld, {
    x: 0.45, y: 2.1, w: 5.4, h: 0.28,
    fontSize: 10.5, bold: true, color: T.accent, fontFace: "Calibri"
  });

  // Mapping rows diagram
  const diagX = 0.6;
  const diagY = 2.45;
  const rowH  = 0.68;

  s.mappingRows.forEach((row, i) => {
    const ry = diagY + i * rowH;

    // Key box
    slide.addShape(pres.shapes.RECTANGLE, {
      x: diagX, y: ry, w: 2.6, h: 0.52,
      fill: { color: T.darkCard }, line: { color: T.accent, width: 0.8 }
    });
    slide.addText(row.key, {
      x: diagX + 0.1, y: ry, w: 2.45, h: 0.52,
      fontSize: 10.5, color: T.accent, fontFace: "Courier New",
      align: "left", valign: "middle", margin: 0
    });

    // Arrow
    slide.addText("→", {
      x: diagX + 2.65, y: ry, w: 0.35, h: 0.52,
      fontSize: 16, bold: true, color: T.accent,
      align: "center", valign: "middle", margin: 0
    });

    // Value box
    slide.addShape(pres.shapes.RECTANGLE, {
      x: diagX + 3.05, y: ry, w: 1.4, h: 0.52,
      fill: { color: T.darkCard }, line: { color: "00AA88", width: 0.8 }
    });
    slide.addText(row.value, {
      x: diagX + 3.05, y: ry, w: 1.4, h: 0.52,
      fontSize: 13, bold: true, color: "00FFCC", fontFace: "Courier New",
      align: "center", valign: "middle", margin: 0
    });
  });

  // Syntax box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.5, w: 4.4, h: 2.6,
    fill: { color: T.darkCard }, line: { color: T.accent, width: 0.8 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.5, w: 4.4, h: 0.36,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText("SYNTAX", {
    x: 5.2, y: 1.5, w: 4.4, h: 0.36,
    fontSize: 9, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
  slide.addText(s.syntax, {
    x: 5.3, y: 1.96, w: 4.2, h: 0.62,
    fontSize: 13, bold: true, color: "88FFCC", fontFace: "Courier New",
    align: "left", valign: "middle", margin: 0
  });
  slide.addText(s.syntaxNote, {
    x: 5.3, y: 2.68, w: 4.2, h: 1.28,
    fontSize: 11, color: "AACCEE", fontFace: "Calibri",
    align: "left", valign: "top", margin: 0
  });

  // Note bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.08, w: 9.1, h: 0.34,
    fill: { color: "0A2A45" }, line: { color: T.accent, width: 0.8 }
  });
  slide.addText("  Key insight: querying an unmapped key returns the default value (0) — NEVER an error.", {
    x: 0.55, y: 5.1, w: 8.9, h: 0.3,
    fontSize: 10.5, color: T.accent, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ── CODE SLIDE ────────────────────────────────────────────────────────────────
function buildCodeSlide(s) {
  const slide = pres.addSlide();
  slide.background = { color: "0A1628" };

  // Title
  slide.addText(s.title, {
    x: 0.45, y: 0.1, w: 9.1, h: 0.62,
    fontSize: 22, bold: true, color: T.white,
    fontFace: "Calibri", align: "left", valign: "middle"
  });
  slide.addText(s.subtitle, {
    x: 0.45, y: 0.7, w: 9.1, h: 0.26,
    fontSize: 11, color: T.accent, fontFace: "Calibri", italic: true
  });

  addSectionTag(slide, "Remix Practical");

  // Code block (left 55%)
  const codeBlock = s.codeBlocks[0];
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.02, w: 5.5, h: 4.12,
    fill: { color: "0D1F33" }, line: { color: T.accent, width: 0.8 }
  });
  // Code label bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.02, w: 5.5, h: 0.3,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(codeBlock.label, {
    x: 0.35, y: 1.02, w: 5.5, h: 0.3,
    fontSize: 8.5, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
  slide.addText(codeBlock.code, {
    x: 0.45, y: 1.38, w: 5.3, h: 3.68,
    fontSize: 9.5, color: "88FFCC", fontFace: "Courier New",
    align: "left", valign: "top", margin: 0
  });

  // Key points (right 40%)
  slide.addText("Key Points", {
    x: 6.05, y: 1.02, w: 3.6, h: 0.3,
    fontSize: 11, bold: true, color: T.accent, fontFace: "Calibri"
  });
  s.keyPoints.forEach((kp, idx) => {
    addBulletRow(slide, kp, 6.05, 1.4 + idx * 0.52, 3.6, 9.5, "BBDDEE", T.accent);
  });

  // Practical steps bar
  if (s.practicalSteps && s.practicalSteps.length > 0) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.35, y: 5.08, w: 9.28, h: 0.34,
      fill: { color: "0D1F33" }, line: { color: "2A4560", width: 0.5 }
    });
    slide.addText(
      "  Test: " + s.practicalSteps.join("  |  "),
      {
        x: 0.42, y: 5.1, w: 9.1, h: 0.28,
        fontSize: 8.5, color: "88BBDD", fontFace: "Calibri", margin: 0
      }
    );
  }
}

// ── SUMMARY SLIDE ─────────────────────────────────────────────────────────────
function buildSummarySlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 9.72, y: 0, w: 0.28, h: H,
    fill: { color: T.accent }, line: { color: T.accent }
  });

  addTitleDark(slide, s.title);
  addSectionTag(slide, "Lecture Summary");

  s.points.forEach((point, i) => {
    const y = 1.06 + i * 0.6;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.42, y: y + 0.1, w: 0.3, h: 0.3,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(String(i + 1), {
      x: 0.42, y: y + 0.1, w: 0.3, h: 0.3,
      fontSize: 9, bold: true, color: T.primary,
      align: "center", valign: "middle", margin: 0
    });
    slide.addText(point, {
      x: 0.86, y, w: 8.62, h: 0.52,
      fontSize: 11, color: T.white, fontFace: "Calibri", valign: "middle"
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.08, w: 9.1, h: 0.36,
    fill: { color: "0A2A45" }, line: { color: T.accent, width: 0.8 }
  });
  slide.addText("  " + s.closing, {
    x: 0.55, y: 5.1, w: 8.9, h: 0.3,
    fontSize: 11, color: T.accent, italic: true,
    fontFace: "Calibri", align: "center", margin: 0
  });
}

// ── APPLICATIONS SLIDE ────────────────────────────────────────────────────────
function buildApplicationsSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Real World");

  s.categories.forEach((cat, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x   = 0.38 + col * 4.88;
    const y   = 1.06 + row * 1.48;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.68, h: 1.32,
      fill: { color: T.darkCard }, line: { color: "1E3A5C", width: 0.5 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.1, h: 1.32,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(cat.sector, {
      x: x + 0.2, y: y + 0.1, w: 4.38, h: 0.3,
      fontSize: 11.5, bold: true, color: T.accent, fontFace: "Calibri", margin: 0
    });
    slide.addText(cat.uses, {
      x: x + 0.2, y: y + 0.45, w: 4.38, h: 0.76,
      fontSize: 10, color: "BBDDEE", fontFace: "Calibri", margin: 0
    });
  });
}

// ─── BUILD ALL SLIDES ─────────────────────────────────────────────────────────
for (const slide of data.slides) {
  switch (slide.type) {
    case "title":          buildTitleSlide(slide);         break;
    case "agenda":         buildAgendaSlide(slide);        break;
    case "definition":     buildDefinitionSlide(slide);    break;
    case "two_column":     buildTwoColumnSlide(slide);     break;
    case "visual_array":   buildVisualArraySlide(slide);   break;
    case "visual_mapping": buildVisualMappingSlide(slide); break;
    case "code_slide":     buildCodeSlide(slide);          break;
    case "applications":   buildApplicationsSlide(slide);  break;
    case "summary":        buildSummarySlide(slide);       break;
    default: console.warn("Unknown slide type:", slide.type);
  }
}

// ─── SAVE ─────────────────────────────────────────────────────────────────────
const outputFile = path.join(OUTPUT_PATH, OUTPUT_FILE);
pres.writeFile({ fileName: outputFile })
  .then(() => {
    console.log("\n✅  Lecture 3 presentation saved!");
    console.log(`📁  ${outputFile}\n`);
  })
  .catch(err => console.error("❌  Error:", err));