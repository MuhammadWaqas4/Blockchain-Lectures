/**
 * Blockchain & Solidity — Lecture #2 Presentation Generator
 * Reads:    lecture2_slides.json
 * Output:   Lecture2_Solidity_DataTypes_Variables_Functions.pptx  →  OUTPUT_PATH
 *
 * Install:  npm install pptxgenjs
 * Run:      node generate_lecture2.js
 */

const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");
const os      = require("os");

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const JSON_FILE   = path.join(__dirname, "lecture2_slides.json");
const OUTPUT_PATH = path.join(
  os.homedir(),
  "Desktop", "Drive (D) work", "Drive (Extra)",
  "work", "Blockchain-Lectures", "slides"
);
const OUTPUT_FILE = "Lecture2_Solidity_DataTypes_Variables_Functions.pptx";
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
    x: 0.35, y: 5.25, w: 2.5, h: 0.22,
    fill: { color: T.accent }, line: { color: T.accent }
  });
  slide.addText(label.toUpperCase(), {
    x: 0.35, y: 5.25, w: 2.5, h: 0.22,
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

// Custom bullet: dot shape + plain text — NO PptxGenJS bullet:true (avoids &#x2022; bug)
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

// ─── SLIDE BUILDERS ───────────────────────────────────────────────────────────

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
    x: 0.6, y: 0.7, w: 1.5, h: 0.32,
    fill: { color: "0A2A45" }, line: { color: T.accent, width: 1 }
  });
  slide.addText("LECTURE #2", {
    x: 0.6, y: 0.7, w: 1.5, h: 0.32,
    fontSize: 9, bold: true, color: T.accent,
    align: "center", valign: "middle", margin: 0
  });

  slide.addText(s.title, {
    x: 0.6, y: 1.1, w: 7.0, h: 1.25,
    fontSize: 44, bold: true, color: T.accent,
    fontFace: "Calibri", align: "left"
  });
  slide.addText(s.subtitle, {
    x: 0.6, y: 2.45, w: 7.2, h: 0.6,
    fontSize: 20, color: T.white, fontFace: "Calibri Light", align: "left"
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

function buildAgendaSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Lecture Plan");

  const cols  = [0.35, 5.08];
  const rows  = 5;
  const rowH  = 0.82;
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
    addBulletRow(slide, kp, 0.45, 2.55 + idx * 0.54, 9.1, 10.5, "1A3A5C", T.accent);
  });
}

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
        col.x + 0.16,
        1.50 + idx * 0.6,
        4.22,
        10.5, "1A3A5C", T.accent
      );
    });
  });
}

function buildConceptSlide(s) {
  const slide = pres.addSlide();
  lightBg(slide);
  addTitleLight(slide, s.title);
  addSectionTag(slide, "Concept");

  slide.addText(s.subtitle, {
    x: 0.45, y: 0.93, w: 9.1, h: 0.26,
    fontSize: 11, color: T.accent, bold: true, fontFace: "Calibri"
  });
  slide.addText(s.description, {
    x: 0.45, y: 1.24, w: 9.1, h: 0.62,
    fontSize: 11, color: "334466", fontFace: "Calibri"
  });

  s.properties.forEach((prop, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x   = 0.45 + col * 4.63;
    const y   = 2.02 + row * 1.02;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.38, h: 0.9,
      fill: { color: T.white },
      shadow: { type: "outer", color: "000000", blur: 5, offset: 2, angle: 135, opacity: 0.08 },
      line: { color: "D8E8F5", width: 0.5 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.09, h: 0.9,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(prop.term, {
      x: x + 0.2, y: y + 0.06, w: 4.0, h: 0.3,
      fontSize: 12, bold: true, color: T.primary, fontFace: "Calibri", margin: 0
    });
    slide.addText(prop.desc, {
      x: x + 0.2, y: y + 0.4, w: 4.0, h: 0.46,
      fontSize: 10, color: "334466", fontFace: "Calibri", margin: 0
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.08, w: 9.1, h: 0.34,
    fill: { color: "E0F0FF" }, line: { color: "B8D8F8", width: 0.5 }
  });
  slide.addText("  " + s.example, {
    x: 0.55, y: 5.1, w: 8.9, h: 0.3,
    fontSize: 9.5, color: T.primary, fontFace: "Calibri", italic: true, margin: 0
  });
}

function buildStatsSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Watch Out");

  slide.addText(s.intro, {
    x: 0.45, y: 1.06, w: 9.1, h: 0.5,
    fontSize: 11.5, color: "AACCEE", italic: true, fontFace: "Calibri"
  });

  s.stats.forEach((stat, i) => {
    const x = 0.45 + i * 3.08;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.66, w: 2.85, h: 1.0,
      fill: { color: T.darkCard }, line: { color: T.accent, width: 0.8 }
    });
    slide.addText(stat.value, {
      x, y: 1.7, w: 2.85, h: 0.55,
      fontSize: 24, bold: true, color: T.accent,
      fontFace: "Calibri", align: "center"
    });
    slide.addText(stat.label, {
      x, y: 2.26, w: 2.85, h: 0.32,
      fontSize: 10, color: "AACCEE", fontFace: "Calibri", align: "center"
    });
  });

  s.bullets.forEach((b, idx) => {
    addBulletRow(slide, b, 0.45, 2.82 + idx * 0.52, 9.1, 11, T.white, T.accent);
  });
}

function buildApplicationsSlide(s) {
  const slide = pres.addSlide();
  darkBg(slide);
  addTitleDark(slide, s.title);
  addSectionTag(slide, "Practical Tasks");

  s.categories.forEach((cat, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x   = 0.38 + col * 4.88;
    const y   = 1.06 + row * 1.46;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.68, h: 1.3,
      fill: { color: T.darkCard }, line: { color: "1E3A5C", width: 0.5 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.1, h: 1.3,
      fill: { color: T.accent }, line: { color: T.accent }
    });
    slide.addText(cat.sector, {
      x: x + 0.2, y: y + 0.1, w: 4.38, h: 0.3,
      fontSize: 11.5, bold: true, color: T.accent, fontFace: "Calibri", margin: 0
    });
    slide.addText(cat.uses, {
      x: x + 0.2, y: y + 0.44, w: 4.38, h: 0.76,
      fontSize: 10, color: "BBDDEE", fontFace: "Calibri", margin: 0
    });
  });
}

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
    const y = 1.06 + i * 0.58;
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
      x: 0.86, y, w: 8.62, h: 0.5,
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

// ─── BUILD ALL SLIDES ─────────────────────────────────────────────────────────
for (const slide of data.slides) {
  switch (slide.type) {
    case "title":        buildTitleSlide(slide);        break;
    case "agenda":       buildAgendaSlide(slide);       break;
    case "definition":   buildDefinitionSlide(slide);   break;
    case "two_column":   buildTwoColumnSlide(slide);    break;
    case "concept":      buildConceptSlide(slide);      break;
    case "stats":        buildStatsSlide(slide);        break;
    case "applications": buildApplicationsSlide(slide); break;
    case "summary":      buildSummarySlide(slide);      break;
    default: console.warn("Unknown slide type:", slide.type);
  }
}

// ─── SAVE ─────────────────────────────────────────────────────────────────────
const outputFile = path.join(OUTPUT_PATH, OUTPUT_FILE);
pres.writeFile({ fileName: outputFile })
  .then(() => {
    console.log("\n✅  Lecture 2 presentation saved!");
    console.log(`📁  ${outputFile}\n`);
  })
  .catch(err => console.error("❌  Error:", err));