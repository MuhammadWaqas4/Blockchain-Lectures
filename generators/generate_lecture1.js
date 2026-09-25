/**
 * Blockchain Basic Concepts — Presentation Generator
 * Reads: lecture1_slides.json
 * Output: saves .pptx to OUTPUT_PATH
 *
 * Install:  npm install pptxgenjs
 * Run:      node generate_lecture1.js
 */

const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");
const os      = require("os");

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ROOT = path.join(__dirname, "..");
const JSON_FILE = path.join(ROOT, "data", "lecture1_slides.json");
const OUTPUT_PATH = path.join(ROOT, "slides");
const OUTPUT_FILE = "Lecture1_Introduction.pptx";
// ──────────────────────────────────────────────────────────────────────────────

const data = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
const T    = data.theme;

fs.mkdirSync(OUTPUT_PATH, { recursive: true });

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = data.author;
pres.title  = data.title;

const H = 5.625; // slide height in inches

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function darkBg(slide)  { slide.background = { color: T.primary }; }
function lightBg(slide) { slide.background = { color: "F4F9FE" };  }

/**
 * Section tag — placed in BOTTOM-LEFT corner.
 * Keeping it far from the title prevents any overlap.
 */
function addSectionTag(slide, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 5.25, w: 2.1, h: 0.22,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(label.toUpperCase(), {
    x: 0.35, y: 5.25, w: 2.1, h: 0.22,
    fontSize: 7, bold: true, color: T.primary,
    align: "center", valign: "middle", margin: 0
  });
}

/** Title on dark slides — top of slide */
function addTitleDark(slide, text) {
  slide.addText(text, {
    x: 0.45, y: 0.22, w: 9.1, h: 0.72,
    fontSize: 30, bold: true, color: T.white,
    fontFace: "Calibri", align: "left", valign: "middle"
  });
}

/** Title on light slides — top of slide */
function addTitleLight(slide, text) {
  slide.addText(text, {
    x: 0.45, y: 0.12, w: 9.1, h: 0.72,
    fontSize: 28, bold: true, color: T.primary,
    fontFace: "Calibri", align: "left", valign: "middle"
  });
  // small accent dot
  slide.addShape(pres.shapes.OVAL, {
    x: 0.45, y: 0.88, w: 0.11, h: 0.11,
    fill: { color: T.accent }, line: { color: T.accent }
  });
}

/**
 * Custom bullet row: draws a solid circle dot + plain text beside it.
 * We NEVER use PptxGenJS bullet:true — it renders "&#x2022;" as literal
 * text in LibreOffice / Google Slides / some PowerPoint versions.
 */
function addBulletRow(slide, text, x, y, w, fontSize, textColor, dotColor) {
  const DOT   = 0.10;   // dot diameter in inches
  const GAP   = 0.13;   // gap between dot and text
  const NUDGE = 0.06;   // vertical nudge to optically centre dot on first text line

  slide.addShape(pres.shapes.OVAL, {
    x: x, y: y + NUDGE, w: DOT, h: DOT,
    fill: { color: dotColor }, line: { color: dotColor }
  });
  slide.addText(text, {
    x: x + DOT + GAP, y: y,
    w: w - DOT - GAP,
    h: 0.52,
    fontSize, color: textColor,
    fontFace: "Calibri", align: "left", valign: "top", margin: 0
  });
}

// ─── SLIDE 1 — TITLE ──────────────────────────────────────────────────────────
function buildTitleSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: H,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 7.0, y: -1.0, w: 4.0, h: 4.0,
    fill: { color: "0A2A45", transparency: 30 },
    line: { color: "0A2A45", transparency: 30 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.2, y: 3.4, w: 2.5, h: 2.5,
    fill: { color: "00C2FF", transparency: 85 },
    line: { color: "00C2FF", transparency: 85 }
  });

  slide.addText(s.title, {
    x: 0.6, y: 1.1, w: 6.5, h: 1.15,
    fontSize: 64, bold: true, color: T.accent,
    fontFace: "Calibri", align: "left"
  });
  slide.addText(s.subtitle, {
    x: 0.6, y: 2.35, w: 6.5, h: 0.72,
    fontSize: 30, color: T.white, fontFace: "Calibri Light", align: "left"
  });
  slide.addText(s.tagline, {
    x: 0.6, y: 3.18, w: 7.2, h: 0.42,
    fontSize: 13, color: "88BBDD",
    fontFace: "Calibri", align: "left", italic: true
  });
  slide.addText(s.footer, {
    x: 0.6, y: 5.2, w: 8.8, h: 0.26,
    fontSize: 10, color: T.muted, align: "left"
  });
}

// ─── SLIDE 2 — AGENDA ─────────────────────────────────────────────────────────
function buildAgendaSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Overview");

  const cols = [0.45, 5.1];
  const rows = 4;

  s.items.forEach((item, i) => {
    const col = i < rows ? 0 : 1;
    const row = i % rows;
    const x   = cols[col];
    const y   = 1.18 + row * 1.0;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.42, h: 0.42,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(item.num, {
      x, y, w: 0.42, h: 0.42,
      fontSize: 10, bold: true, color: T.primary,
      align: "center", valign: "middle", margin: 0
    });
    slide.addText(item.label, {
      x: x + 0.52, y: y + 0.06, w: 4.3, h: 0.34,
      fontSize: 13, color: T.white, fontFace: "Calibri",
      align: "left", margin: 0
    });
  });
}

// ─── SLIDE 3 — DEFINITION ────────────────────────────────────────────────────
function buildDefinitionSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Foundation");

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.06, w: 9.1, h: 1.08,
    fill: { color: T.primary }, line: { color: T.primary }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.06, w: 0.12, h: 1.08,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(s.definition, {
    x: 0.72, y: 1.08, w: 8.66, h: 1.08,
    fontSize: 12, color: T.white, italic: true,
    fontFace: "Calibri", align: "left", valign: "middle", margin: 0
  });

  slide.addText("Key Facts", {
    x: 0.45, y: 2.3, w: 3, h: 0.32,
    fontSize: 12, bold: true, color: T.primary, fontFace: "Calibri"
  });

  s.keyPoints.forEach((kp, idx) => {
    addBulletRow(slide, kp, 0.45, 2.7 + idx * 0.62, 9.1, 12, "1A3A5C", T.accent);
  });
}

// ─── SLIDES 4 & 7 — TWO COLUMN ───────────────────────────────────────────────
function buildTwoColumnSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Structure");

  const colDefs = [
    { x: 0.45, title: s.leftTitle,  items: s.leftItems  },
    { x: 5.15, title: s.rightTitle, items: s.rightItems }
  ];

  colDefs.forEach((col) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 1.06, w: 4.45, h: 4.3,
      fill: { color: T.white },
      shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.1 },
      line: { color: "D8E8F5", width: 0.5 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 1.06, w: 4.45, h: 0.38,
      fill: { color: T.primary }, line: { color: T.primary }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: col.x, y: 1.06, w: 0.1, h: 0.38,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(col.title, {
      x: col.x + 0.18, y: 1.06, w: 4.1, h: 0.38,
      fontSize: 12, bold: true, color: T.white,
      fontFace: "Calibri", valign: "middle", margin: 0
    });

    // Draw each bullet as dot + text — zero PptxGenJS bullet API usage
    col.items.forEach((item, idx) => {
      addBulletRow(
        slide, item,
        col.x + 0.18,
        1.58 + idx * 0.68,
        4.12,
        11.5, "1A3A5C", T.accent
      );
    });
  });
}

// ─── SLIDE 5 — STATS ─────────────────────────────────────────────────────────
function buildStatsSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Network");

  slide.addText(s.intro, {
    x: 0.45, y: 1.06, w: 9.1, h: 0.52,
    fontSize: 11.5, color: "AACCEE", italic: true, fontFace: "Calibri"
  });

  s.stats.forEach((stat, i) => {
    const x = 0.45 + i * 3.08;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.68, w: 2.85, h: 1.1,
      fill: { color: T.darkCard }, line: { color: T.accent, width: 0.8 }
    });
    slide.addText(stat.value, {
      x, y: 1.72, w: 2.85, h: 0.62,
      fontSize: 28, bold: true, color: T.accent,
      fontFace: "Calibri", align: "center"
    });
    slide.addText(stat.label, {
      x, y: 2.34, w: 2.85, h: 0.36,
      fontSize: 10, color: "AACCEE", fontFace: "Calibri", align: "center"
    });
  });

  s.bullets.forEach((b, idx) => {
    addBulletRow(slide, b, 0.45, 2.92 + idx * 0.54, 9.1, 12, T.white, T.accent);
  });
}

// ─── SLIDE 6 — CONCEPT (Hashing) ─────────────────────────────────────────────
function buildConceptSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Cryptography");

  slide.addText(s.subtitle, {
    x: 0.45, y: 0.94, w: 9.1, h: 0.28,
    fontSize: 11.5, color: T.accent, bold: true, fontFace: "Calibri"
  });
  slide.addText(s.description, {
    x: 0.45, y: 1.26, w: 9.1, h: 0.62,
    fontSize: 11.5, color: "334466", fontFace: "Calibri"
  });

  s.properties.forEach((prop, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x   = 0.45 + col * 4.63;
    const y   = 2.02 + row * 1.02;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.38, h: 0.88,
      fill: { color: T.white },
      shadow: { type: "outer", color: "000000", blur: 5, offset: 2, angle: 135, opacity: 0.08 },
      line: { color: "D8E8F5", width: 0.5 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.09, h: 0.88,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(prop.term, {
      x: x + 0.2, y: y + 0.07, w: 4.0, h: 0.3,
      fontSize: 12, bold: true, color: T.primary, fontFace: "Calibri", margin: 0
    });
    slide.addText(prop.desc, {
      x: x + 0.2, y: y + 0.42, w: 4.0, h: 0.4,
      fontSize: 10.5, color: "334466", fontFace: "Calibri", margin: 0
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.08, w: 9.1, h: 0.34,
    fill: { color: "E0F0FF" }, line: { color: "B8D8F8", width: 0.5 }
  });
  slide.addText("  " + s.example, {
    x: 0.55, y: 5.1, w: 8.9, h: 0.3,
    fontSize: 10.5, color: T.primary, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ─── SLIDE 8 — PROPERTIES ─────────────────────────────────────────────────────
function buildPropertiesSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Properties");

  s.properties.forEach((prop, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x   = 0.42 + col * 3.19;
    const y   = 1.06 + row * 2.14;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.02, h: 1.94,
      fill: { color: T.white },
      shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.09 },
      line: { color: "D8E8F5", width: 0.5 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.02, h: 0.12,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(prop.icon, {
      x: x + 0.14, y: y + 0.2, w: 0.55, h: 0.48,
      fontSize: 20, align: "left"
    });
    slide.addText(prop.title, {
      x: x + 0.14, y: y + 0.7, w: 2.8, h: 0.3,
      fontSize: 12, bold: true, color: T.primary, fontFace: "Calibri"
    });
    slide.addText(prop.desc, {
      x: x + 0.14, y: y + 1.02, w: 2.8, h: 0.82,
      fontSize: 10, color: "334466", fontFace: "Calibri"
    });
  });
}

// ─── SLIDE 9 — APPLICATIONS ──────────────────────────────────────────────────
function buildApplicationsSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Applications");

  s.categories.forEach((cat, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x   = 0.45 + col * 4.82;
    const y   = 1.12 + row * 1.34;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.58, h: 1.14,
      fill: { color: T.darkCard }, line: { color: "1E3A5C", width: 0.5 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.1, h: 1.14,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(cat.sector, {
      x: x + 0.22, y: y + 0.1, w: 4.2, h: 0.3,
      fontSize: 12, bold: true, color: T.accent, fontFace: "Calibri", margin: 0
    });
    slide.addText(cat.uses, {
      x: x + 0.22, y: y + 0.46, w: 4.2, h: 0.58,
      fontSize: 11, color: "BBDDEE", fontFace: "Calibri", margin: 0
    });
  });
}

// ─── SLIDE 10 — SUMMARY ──────────────────────────────────────────────────────
function buildSummarySlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 9.72, y: 0, w: 0.28, h: H,
    fill: { color: T.accent }, line: { color: T.accent }
  });

  addTitleDark(slide, s.title);
  addSectionTag(slide, "Summary");

  s.points.forEach((point, i) => {
    const y = 1.1 + i * 0.67;

    slide.addShape(pres.shapes.OVAL, {
      x: 0.45, y: y + 0.08, w: 0.34, h: 0.34,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(String(i + 1), {
      x: 0.45, y: y + 0.08, w: 0.34, h: 0.34,
      fontSize: 10, bold: true, color: T.primary,
      align: "center", valign: "middle", margin: 0
    });
    slide.addText(point, {
      x: 0.92, y, w: 8.55, h: 0.54,
      fontSize: 12, color: T.white, fontFace: "Calibri", valign: "middle"
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.08, w: 9.1, h: 0.36,
    fill: { color: "0A2A45" }, line: { color: T.accent, width: 0.8 }
  });
  slide.addText("  " + s.closing, {
    x: 0.55, y: 5.1, w: 8.9, h: 0.3,
    fontSize: 12, color: T.accent, italic: true,
    fontFace: "Calibri", align: "center", margin: 0
  });
}

// ─── BUILD ALL SLIDES ─────────────────────────────────────────────────────────
for (const slide of data.slides) {
  switch (slide.type) {
    case "title":        buildTitleSlide(slide);        break;
    case "agenda":       buildAgendaSlide(slide);       break;
    case "definition":   buildDefinitionSlide(slide);   break;
    case "two_column":   buildTwoColumnSlide(slide);    break;
    case "stats":        buildStatsSlide(slide);        break;
    case "concept":      buildConceptSlide(slide);      break;
    case "properties":   buildPropertiesSlide(slide);   break;
    case "applications": buildApplicationsSlide(slide); break;
    case "summary":      buildSummarySlide(slide);      break;
    default: console.warn("Unknown slide type:", slide.type);
  }
}

// ─── SAVE ─────────────────────────────────────────────────────────────────────
const outputFile = path.join(OUTPUT_PATH, OUTPUT_FILE);
pres.writeFile({ fileName: outputFile })
  .then(() => {
    console.log("\n✅  Presentation saved!");
    console.log(`📁  ${outputFile}\n`);
  })
  .catch((err) => console.error("❌  Error:", err));