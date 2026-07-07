/**
 * Blockchain & Solidity — Lecture #5 Presentation Generator
 * Reads:    lecture5_slides.json
 * Output:   Lecture5_Modifiers_AccessControl_ErrorHandling.pptx
 *
 * Install:  npm install pptxgenjs
 * Run:      node generate_lecture5.js
 */

const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");
const os      = require("os");

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const JSON_FILE   = path.join(__dirname, "lecture5_slides.json");
const OUTPUT_PATH = path.join(
  os.homedir(),
  "Desktop", "Drive (D) work", "Drive (Extra)",
  "work", "Blockchain-Lectures", "slides"
);
const OUTPUT_FILE = "Lecture5_Modifiers_AccessControl_ErrorHandling.pptx";
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
const darkBg  = s => { s.background = { color: T.primary }; };
const lightBg = s => { s.background = { color: "F4F9FE" };  };

function addSectionTag(slide, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 5.25, w: 2.8, h: 0.22,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(label.toUpperCase(), {
    x: 0.35, y: 5.25, w: 2.8, h: 0.22,
    fontSize: 7, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
}

function addTitleDark(slide, text) {
  slide.addText(text, {
    x: 0.45, y: 0.15, w: 9.1, h: 0.78,
    fontSize: 27, bold: true, color: T.white,
    fontFace: "Calibri", align: "left", valign: "middle"
  });
}

function addTitleLight(slide, text) {
  slide.addText(text, {
    x: 0.45, y: 0.08, w: 9.1, h: 0.78,
    fontSize: 25, bold: true, color: T.primary,
    fontFace: "Calibri", align: "left", valign: "middle"
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.45, y: 0.9, w: 0.11, h: 0.11,
    fill: { color: T.accent }, line: { color: T.accent }
  });
}

// Custom bullet — NO PptxGenJS bullet:true (avoids &#x2022; rendering bug)
function addBulletRow(slide, text, x, y, w, fontSize, textColor, dotColor) {
  const DOT = 0.09, GAP = 0.13, NUDGE = 0.07;
  slide.addShape(pres.shapes.OVAL, {
    x, y: y + NUDGE, w: DOT, h: DOT,
    fill: { color: dotColor }, line: { color: dotColor }
  });
  slide.addText(text, {
    x: x + DOT + GAP, y, w: w - DOT - GAP, h: 0.54,
    fontSize, color: textColor,
    fontFace: "Calibri", align: "left", valign: "top", margin: 0
  });
}

// ─── SLIDE BUILDERS ───────────────────────────────────────────────────────────

// ── 1. TITLE ─────────────────────────────────────────────────────────────────
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
    x: 0.6, y: 0.62, w: 1.55, h: 0.32,
    fill: { color: "0A2A45" }, line: { color: T.accent, width: 1 }
  });
  slide.addText("LECTURE #5", {
    x: 0.6, y: 0.62, w: 1.55, h: 0.32,
    fontSize: 9, bold: true, color: T.accent,
    align: "center", valign: "middle", margin: 0
  });

  slide.addText(s.title, {
    x: 0.6, y: 1.05, w: 7.4, h: 1.3,
    fontSize: 38, bold: true, color: T.accent,
    fontFace: "Calibri", align: "left"
  });
  slide.addText(s.subtitle, {
    x: 0.6, y: 2.46, w: 7.5, h: 0.58,
    fontSize: 17, color: T.white, fontFace: "Calibri Light", align: "left"
  });
  slide.addText(s.tagline, {
    x: 0.6, y: 3.16, w: 7.6, h: 0.55,
    fontSize: 12, color: "88BBDD",
    fontFace: "Calibri", align: "left", italic: true
  });
  slide.addText(s.footer, {
    x: 0.6, y: 5.2, w: 8.8, h: 0.26,
    fontSize: 9.5, color: T.muted, align: "left"
  });
}

// ── 2. AGENDA ─────────────────────────────────────────────────────────────────
function buildAgendaSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Lecture Plan");

  const cols = [0.35, 5.08], rows = 6, rowH = 0.7, startY = 1.04;

  s.items.forEach((item, i) => {
    const col = i < rows ? 0 : 1;
    const row = i % rows;
    const x = cols[col], y = startY + row * rowH;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: y + 0.07, w: 0.36, h: 0.34,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(item.num, {
      x, y: y + 0.07, w: 0.36, h: 0.34,
      fontSize: 8.5, bold: true, color: T.primary,
      align: "center", valign: "middle", margin: 0
    });
    slide.addText(item.label, {
      x: x + 0.46, y: y + 0.1, w: 4.42, h: 0.32,
      fontSize: 11, color: T.white, fontFace: "Calibri",
      align: "left", margin: 0
    });
  });
}

// ── 3. DEFINITION ─────────────────────────────────────────────────────────────
function buildDefinitionSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Core Concept");

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.02, w: 9.1, h: 1.0,
    fill: { color: T.primary }, line: { color: T.primary }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.02, w: 0.12, h: 1.0,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(s.definition, {
    x: 0.72, y: 1.04, w: 8.66, h: 0.96,
    fontSize: 11, color: T.white, italic: true,
    fontFace: "Calibri", align: "left", valign: "middle", margin: 0
  });

  slide.addText("Key Points", {
    x: 0.45, y: 2.16, w: 3, h: 0.3,
    fontSize: 11.5, bold: true, color: T.primary, fontFace: "Calibri"
  });

  s.keyPoints.forEach((kp, i) => {
    addBulletRow(slide, kp, 0.45, 2.52 + i * 0.53, 9.1, 10.5, "1A3A5C", T.accent);
  });
}

// ── 4. ANALOGY SLIDE ──────────────────────────────────────────────────────────
function buildAnalogySlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, s.subtitle);

  // Analogy text banner
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.38, y: 1.02, w: 9.24, h: 0.92,
    fill: { color: T.darkCard }, line: { color: T.accent, width: 0.6 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.38, y: 1.02, w: 0.1, h: 0.92,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(s.analogy, {
    x: 0.58, y: 1.05, w: 8.96, h: 0.86,
    fontSize: 11, color: "AACCEE", fontFace: "Calibri",
    italic: true, valign: "middle", margin: 0
  });

  // Left card — customers
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.38, y: 2.08, w: 4.38, h: 2.88,
    fill: { color: T.darkCard }, line: { color: s.leftAccent, width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.38, y: 2.08, w: 4.38, h: 0.36,
    fill: { color: s.leftAccent }, line: { color: s.leftAccent }
  });
  slide.addText(s.leftTitle, {
    x: 0.38, y: 2.08, w: 4.38, h: 0.36,
    fontSize: 11, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
  s.leftItems.forEach((item, i) => {
    slide.addText("  " + item, {
      x: 0.52, y: 2.54 + i * 0.54, w: 4.1, h: 0.46,
      fontSize: 12, color: s.leftAccent, fontFace: "Courier New",
      align: "left", valign: "middle", margin: 0
    });
  });

  // Right card — manager
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.22, y: 2.08, w: 4.38, h: 2.88,
    fill: { color: T.darkCard }, line: { color: s.rightAccent, width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.22, y: 2.08, w: 4.38, h: 0.36,
    fill: { color: s.rightAccent }, line: { color: s.rightAccent }
  });
  slide.addText(s.rightTitle, {
    x: 5.22, y: 2.08, w: 4.38, h: 0.36,
    fontSize: 11, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
  s.rightItems.forEach((item, i) => {
    slide.addText("  " + item, {
      x: 5.36, y: 2.54 + i * 0.54, w: 4.1, h: 0.46,
      fontSize: 12, color: s.rightAccent, fontFace: "Courier New",
      align: "left", valign: "middle", margin: 0
    });
  });

  // Bottom note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.38, y: 5.07, w: 9.24, h: 0.34,
    fill: { color: "0A2A45" }, line: { color: T.accent, width: 0.7 }
  });
  slide.addText("  " + s.bottomNote, {
    x: 0.48, y: 5.09, w: 9.04, h: 0.3,
    fontSize: 10, color: T.accent, fontFace: "Calibri",
    italic: true, margin: 0
  });
}

// ── 5. CODE SLIDE ─────────────────────────────────────────────────────────────
function buildCodeSlide(s) {
  const slide = pres.addSlide();
  slide.background = { color: "0A1628" };

  slide.addText(s.title, {
    x: 0.42, y: 0.08, w: 9.18, h: 0.62,
    fontSize: 21, bold: true, color: T.white,
    fontFace: "Calibri", align: "left", valign: "middle"
  });
  slide.addText(s.subtitle, {
    x: 0.42, y: 0.68, w: 9.18, h: 0.26,
    fontSize: 10.5, color: T.accent, fontFace: "Calibri", italic: true
  });
  addSectionTag(slide, "Remix Practical");

  const cb = s.codeBlocks[0];
  // Code panel
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.32, y: 1.0, w: 5.55, h: 4.14,
    fill: { color: "0D1F33" }, line: { color: T.accent, width: 0.8 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.32, y: 1.0, w: 5.55, h: 0.3,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(cb.label, {
    x: 0.32, y: 1.0, w: 5.55, h: 0.3,
    fontSize: 8.5, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
  slide.addText(cb.code, {
    x: 0.42, y: 1.36, w: 5.35, h: 3.7,
    fontSize: 9.5, color: "88FFCC", fontFace: "Courier New",
    align: "left", valign: "top", margin: 0
  });

  // Key points panel
  slide.addText("Key Points", {
    x: 6.05, y: 1.0, w: 3.6, h: 0.3,
    fontSize: 11, bold: true, color: T.accent, fontFace: "Calibri"
  });
  s.keyPoints.forEach((kp, i) => {
    addBulletRow(slide, kp, 6.05, 1.38 + i * 0.54, 3.6, 9.5, "BBDDEE", T.accent);
  });

  // Test steps bar
  if (s.practicalSteps && s.practicalSteps.length) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.32, y: 5.08, w: 9.3, h: 0.34,
      fill: { color: "0D1F33" }, line: { color: "2A4560", width: 0.5 }
    });
    slide.addText("  Test in Remix: " + s.practicalSteps.join("  |  "), {
      x: 0.4, y: 5.1, w: 9.1, h: 0.28,
      fontSize: 8.5, color: "88BBDD", fontFace: "Calibri", margin: 0
    });
  }
}

// ── 6. DUPLICATION VISUAL ────────────────────────────────────────────────────
function buildDuplicationVisual(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, s.subtitle);

  // Bad side (left)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.08, w: 4.38, h: 4.22,
    fill: { color: T.darkCard }, line: { color: "FF4444", width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.08, w: 4.38, h: 0.36,
    fill: { color: "FF4444" }, line: { color: "FF4444" }
  });
  slide.addText(s.badTitle, {
    x: 0.35, y: 1.08, w: 4.38, h: 0.36,
    fontSize: 11, bold: true, color: T.white,
    align: "center", valign: "middle", margin: 0
  });
  s.badItems.forEach((item, i) => {
    slide.addText(item, {
      x: 0.52, y: 1.56 + i * 0.56, w: 4.06, h: 0.46,
      fontSize: 11.5, color: "FF8888", fontFace: "Courier New",
      align: "left", valign: "middle", margin: 0
    });
    if (i < s.badItems.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.52, y: 1.98 + i * 0.56, w: 4.06, h: 0.02,
        fill: { color: "2A1A1A" }, line: { color: "2A1A1A" }
      });
    }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 4.54, w: 4.38, h: 0.62,
    fill: { color: "1A0A0A" }, line: { color: "FF4444", width: 0.5 }
  });
  slide.addText(s.badNote, {
    x: 0.45, y: 4.57, w: 4.18, h: 0.56,
    fontSize: 9.5, color: "FF8888", fontFace: "Calibri",
    italic: true, align: "left", valign: "middle", margin: 0
  });

  // Arrow between panels
  slide.addText("→", {
    x: 4.82, y: 2.8, w: 0.5, h: 0.5,
    fontSize: 22, bold: true, color: T.accent,
    align: "center", valign: "middle", margin: 0
  });

  // Good side (right)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.4, y: 1.08, w: 4.2, h: 4.22,
    fill: { color: T.darkCard }, line: { color: "00FFAA", width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.4, y: 1.08, w: 4.2, h: 0.36,
    fill: { color: "00FFAA" }, line: { color: "00FFAA" }
  });
  slide.addText(s.goodTitle, {
    x: 5.4, y: 1.08, w: 4.2, h: 0.36,
    fontSize: 11, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
  s.goodItems.forEach((item, i) => {
    const isModifier = i === 0;
    slide.addText(item, {
      x: 5.56, y: 1.56 + i * 0.5, w: 3.9, h: 0.42,
      fontSize: isModifier ? 10 : 11.5,
      color: isModifier ? T.accent : "88FFCC",
      fontFace: "Courier New",
      align: "left", valign: "middle", margin: 0,
      bold: isModifier
    });
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.4, y: 4.54, w: 4.2, h: 0.62,
    fill: { color: "0A1A0A" }, line: { color: "00FFAA", width: 0.5 }
  });
  slide.addText(s.goodNote, {
    x: 5.5, y: 4.57, w: 4.0, h: 0.56,
    fontSize: 9.5, color: "88FFCC", fontFace: "Calibri",
    italic: true, align: "left", valign: "middle", margin: 0
  });
}

// ── 7. FLOW DIAGRAM ───────────────────────────────────────────────────────────
function buildFlowDiagram(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, s.subtitle);

  const cols = [
    { x: 0.38, title: s.leftTitle,  items: s.leftItems,  desc: s.leftDesc,  accent: s.leftAccent  },
    { x: 5.08, title: s.rightTitle, items: s.rightItems, desc: s.rightDesc, accent: s.rightAccent }
  ];

  cols.forEach(col => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 1.04, w: 4.52, h: 3.6,
      fill: { color: T.darkCard }, line: { color: col.accent, width: 0.8 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 1.04, w: 4.52, h: 0.34,
      fill: { color: col.accent }, line: { color: col.accent }
    });
    slide.addText(col.title, {
      x: col.x, y: 1.04, w: 4.52, h: 0.34,
      fontSize: 11, bold: true, color: T.primary,
      align: "center", valign: "middle", margin: 0
    });
    col.items.forEach((item, i) => {
      const y = 1.5 + i * 0.48;
      // step box
      slide.addShape(pres.shapes.RECTANGLE, {
        x: col.x + 0.22, y, w: 4.05, h: 0.38,
        fill: { color: "0A2A3A" }, line: { color: col.accent, width: 0.4 }
      });
      // step number circle
      slide.addShape(pres.shapes.OVAL, {
        x: col.x + 0.26, y: y + 0.06, w: 0.26, h: 0.26,
        fill: { color: col.accent }, line: { color: col.accent }
      });
      slide.addText(String(i + 1), {
        x: col.x + 0.26, y: y + 0.06, w: 0.26, h: 0.26,
        fontSize: 8, bold: true, color: T.primary,
        align: "center", valign: "middle", margin: 0
      });
      slide.addText(item, {
        x: col.x + 0.6, y, w: 3.6, h: 0.38,
        fontSize: 11, color: T.white, fontFace: "Calibri",
        align: "left", valign: "middle", margin: 0
      });
    });
    // desc box
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 4.0, w: 4.52, h: 0.58,
      fill: { color: "0A1A2A" }, line: { color: col.accent, width: 0.4 }
    });
    slide.addText(col.desc, {
      x: col.x + 0.12, y: 4.02, w: 4.28, h: 0.54,
      fontSize: 9.5, color: col.accent, fontFace: "Calibri",
      italic: true, align: "left", valign: "middle", margin: 0
    });
  });

  // Bottom outcome bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.38, y: 4.72, w: 9.24, h: 0.65,
    fill: { color: "0D2A1A" }, line: { color: "00FFAA", width: 0.8 }
  });
  slide.addText(s.outcome + "  — " + s.outcomeDesc, {
    x: 0.52, y: 4.76, w: 9.0, h: 0.56,
    fontSize: 10.5, color: "00FFAA", fontFace: "Calibri",
    bold: true, align: "center", valign: "middle", margin: 0
  });
}

// ── 8. TWO COLUMN ─────────────────────────────────────────────────────────────
function buildTwoColumnSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Detail");

  const colDefs = [
    { x: 0.38, title: s.leftTitle,  items: s.leftItems  },
    { x: 5.08, title: s.rightTitle, items: s.rightItems }
  ];

  colDefs.forEach(col => {
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
    col.items.forEach((item, i) => {
      addBulletRow(slide, item, col.x + 0.16, 1.5 + i * 0.6, 4.22, 10.5, "1A3A5C", T.accent);
    });
  });
}

// ── 9. THREE COLUMN ───────────────────────────────────────────────────────────
function buildThreeColumnSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, s.subtitle);

  const colW = 2.98;
  const startX = 0.38;
  const gap = 0.14;

  s.columns.forEach((col, ci) => {
    const x = startX + ci * (colW + gap);

    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.02, w: colW, h: 4.32,
      fill: { color: T.darkCard }, line: { color: col.color, width: 1 }
    });
    // Header bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.02, w: colW, h: 0.48,
      fill: { color: col.color }, line: { color: col.color }
    });
    // Icon
    slide.addText(col.icon, {
      x, y: 1.02, w: 0.44, h: 0.48,
      fontSize: 16, align: "center", valign: "middle", margin: 0
    });
    // Title
    slide.addText(col.title, {
      x: x + 0.44, y: 1.02, w: colW - 0.44, h: 0.48,
      fontSize: 13, bold: true, color: T.primary,
      fontFace: "Calibri", align: "left", valign: "middle", margin: 0
    });

    // Rows
    col.rows.forEach((row, ri) => {
      const isCode = row.startsWith("require") || row.startsWith("revert") || row.startsWith("assert") || row.startsWith("if(");
      const y = 1.58 + ri * 0.38;
      slide.addText(row, {
        x: x + 0.14, y, w: colW - 0.22, h: 0.36,
        fontSize: isCode ? 10 : 11,
        color: isCode ? col.color : "BBDDEE",
        fontFace: isCode ? "Courier New" : "Calibri",
        align: "left", valign: "middle", margin: 0,
        bold: isCode
      });
    });
  });
}

// ── 10. SUMMARY ───────────────────────────────────────────────────────────────
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
    const y = 1.04 + i * 0.57;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.42, y: y + 0.1, w: 0.3, h: 0.3,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(String(i + 1), {
      x: 0.42, y: y + 0.1, w: 0.3, h: 0.3,
      fontSize: 8.5, bold: true, color: T.primary,
      align: "center", valign: "middle", margin: 0
    });
    slide.addText(point, {
      x: 0.86, y, w: 8.62, h: 0.5,
      fontSize: 10.5, color: T.white, fontFace: "Calibri", valign: "middle"
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

// ─── BUILD ALL SLIDES ─────────────────────────────────────────────────────────
for (const slide of data.slides) {
  switch (slide.type) {
    case "title":              buildTitleSlide(slide);        break;
    case "agenda":             buildAgendaSlide(slide);       break;
    case "definition":         buildDefinitionSlide(slide);   break;
    case "analogy_slide":      buildAnalogySlide(slide);      break;
    case "code_slide":         buildCodeSlide(slide);         break;
    case "duplication_visual": buildDuplicationVisual(slide); break;
    case "flow_diagram":       buildFlowDiagram(slide);       break;
    case "two_column":         buildTwoColumnSlide(slide);    break;
    case "three_column":       buildThreeColumnSlide(slide);  break;
    case "summary":            buildSummarySlide(slide);      break;
    default: console.warn("Unknown slide type:", slide.type);
  }
}

// ─── SAVE ─────────────────────────────────────────────────────────────────────
const outputFile = path.join(OUTPUT_PATH, OUTPUT_FILE);
pres.writeFile({ fileName: outputFile })
  .then(() => {
    console.log("\n✅  Lecture 5 presentation saved!");
    console.log(`📁  ${outputFile}\n`);
  })
  .catch(err => console.error("❌  Error:", err));