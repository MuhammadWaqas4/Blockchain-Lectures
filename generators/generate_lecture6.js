/**
 * generate_lecture6.js
 * Reads lecture6_slides.json and builds a styled .pptx deck for the
 * Solidity "Lecture 6" session (Inheritance, Enums, Abstract
 * Contracts, Interfaces).
 *
 * Usage: node generate_lecture6.js [lecture6_slides.json] [output.pptx]
 */

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const ROOT = path.join(__dirname, "..");
const contentPath = process.argv[2] || path.join(ROOT, "data", "lecture6_slides.json");
const outPath = process.argv[3] || path.join(ROOT, "slides", "Lecture6_Inheritance_Enums_Interfaces.pptx");

const DATA = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const PAL = DATA.meta.palette;

const FONT_HEAD = "Cambria";      // safe-list serif for headers
const FONT_BODY = "Calibri";      // safe-list sans for body
const FONT_CODE = "Courier New";  // safe-list monospace for code

const PAGE_W = 13.333;
const PAGE_H = 7.5;
const MARGIN = 0.55;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ---------------------------------------------------------------------------
// Presentation setup
// ---------------------------------------------------------------------------
const pres = new pptxgen();
pres.defineLayout({ name: "WIDE", width: PAGE_W, height: PAGE_H });
pres.layout = "WIDE";

// ---------------------------------------------------------------------------
// Small helpers (fresh option objects every call — never share/mutate)
// ---------------------------------------------------------------------------
function newSlide(bg) {
  const s = pres.addSlide();
  s.background = { color: bg || PAL.light };
  return s;
}

function accentDot(slide, x, y, size, color) {
  slide.addShape("ellipse", {
    x, y, w: size, h: size,
    fill: { color },
    line: { type: "none" },
  });
}

function footerBar(slide, label, dark) {
  slide.addText(label, {
    x: MARGIN, y: PAGE_H - 0.45, w: CONTENT_W, h: 0.3,
    fontFace: FONT_BODY, fontSize: 10, color: dark ? "9AA3B8" : PAL.textMuted,
    align: "left",
  });
  slide.addText(DATA.meta.deckTitle, {
    x: MARGIN, y: PAGE_H - 0.45, w: CONTENT_W, h: 0.3,
    fontFace: FONT_BODY, fontSize: 10, color: dark ? "9AA3B8" : PAL.textMuted,
    align: "right",
  });
}

function slideHeader(slide, title, kicker) {
  if (kicker) {
    slide.addText(kicker.toUpperCase(), {
      x: MARGIN, y: 0.4, w: CONTENT_W, h: 0.3,
      fontFace: FONT_BODY, fontSize: 12, bold: true,
      color: PAL.accent === PAL.accent ? "00A896" : PAL.accent,
      charSpacing: 2,
    });
  }
  slide.addText(title, {
    x: MARGIN, y: kicker ? 0.68 : 0.45, w: CONTENT_W, h: 0.8,
    fontFace: FONT_HEAD, fontSize: 30, bold: true, color: PAL.textDark,
    align: "left",
  });
}

// Arrow connector between two points (simple right/down chevron line)
function arrowRight(slide, x, y, w, color) {
  slide.addShape("rightArrow", {
    x, y, w, h: 0.18,
    fill: { color },
    line: { type: "none" },
  });
}

// ---------------------------------------------------------------------------
// Layout renderers — one function per slide "type"
// ---------------------------------------------------------------------------

function renderTitle(sl) {
  const s = newSlide(PAL.primary);

  // decorative circles motif
  accentDot(s, 11.2, -1.1, 3.6, PAL.secondary);
  accentDot(s, 11.9, 5.6, 2.6, PAL.secondary);
  accentDot(s, -0.9, 5.2, 2.4, PAL.secondary);
  s.addShape("ellipse", {
    x: 11.55, y: -0.65, w: 2.5, h: 2.5,
    fill: { color: PAL.accent, transparency: 88 },
    line: { color: PAL.accent, width: 1.5 },
  });

  s.addText(sl.kicker.toUpperCase(), {
    x: MARGIN, y: 2.15, w: 10, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, bold: true, color: PAL.accent,
    charSpacing: 3,
  });
  s.addText(sl.title, {
    x: MARGIN, y: 2.6, w: 10.8, h: 2.0,
    fontFace: FONT_HEAD, fontSize: 42, bold: true, color: "FFFFFF",
    lineSpacingMultiple: 1.05,
  });
  s.addText(sl.subtitle, {
    x: MARGIN, y: 4.65, w: 9.6, h: 0.8,
    fontFace: FONT_BODY, fontSize: 16, color: "CADCFC",
  });

  s.addShape("line", {
    x: MARGIN, y: 5.55, w: 1.1, h: 0,
    line: { color: PAL.accent, width: 3 },
  });
  s.addText(sl.footer, {
    x: MARGIN, y: 5.75, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 13, color: "9AA3B8",
  });
}

function renderSection(sl) {
  const s = newSlide(PAL.primary);
  accentDot(s, 10.6, -1.3, 4.2, PAL.secondary);
  accentDot(s, -1.2, 5.4, 3.2, PAL.secondary);

  s.addText(sl.number, {
    x: MARGIN, y: 2.15, w: 4, h: 1.4,
    fontFace: FONT_HEAD, fontSize: 90, bold: true, color: PAL.secondary,
  });
  s.addShape("ellipse", {
    x: MARGIN, y: 3.55, w: 0.16, h: 0.16,
    fill: { color: PAL.accent }, line: { type: "none" },
  });
  s.addText(sl.title, {
    x: MARGIN + 0.35, y: 3.35, w: 9, h: 0.6,
    fontFace: FONT_BODY, fontSize: 14, bold: true, color: PAL.accent,
    charSpacing: 2,
  });
  s.addText(sl.subtitle, {
    x: MARGIN, y: 3.85, w: 10.5, h: 1.0,
    fontFace: FONT_HEAD, fontSize: 28, bold: true, color: "FFFFFF",
  });
}

function renderAgenda(sl) {
  const s = newSlide(PAL.light);
  slideHeader(s, sl.title);
  s.addText(sl.intro, {
    x: MARGIN, y: 1.35, w: CONTENT_W, h: 0.9,
    fontFace: FONT_BODY, fontSize: 13.5, color: PAL.textMuted,
    lineSpacingMultiple: 1.25,
  });

  const colW = (CONTENT_W - 0.5) / 2;
  const colors = [PAL.primary, PAL.secondary];
  sl.columns.forEach((col, ci) => {
    const x = MARGIN + ci * (colW + 0.5);
    const y = 2.55;
    s.addShape("roundRect", {
      x, y, w: colW, h: 4.15, rectRadius: 0.1,
      fill: { color: "FFFFFF" },
      line: { color: "E4E8F2", width: 1 },
      shadow: { type: "outer", color: "1E2761", opacity: 0.12, blur: 8, offset: 3, angle: 90 },
    });
    s.addShape("roundRect", {
      x, y, w: colW, h: 0.65, rectRadius: 0.1,
      fill: { color: colors[ci] }, line: { type: "none" },
    });
    s.addText(col.heading, {
      x: x + 0.3, y, w: colW - 0.6, h: 0.65,
      fontFace: FONT_HEAD, fontSize: 16, bold: true, color: "FFFFFF",
      valign: "middle",
    });
    col.items.forEach((item, ii) => {
      const iy = y + 0.95 + ii * 0.62;
      accentDot(s, x + 0.3, iy + 0.06, 0.28, PAL.accent);
      s.addText(String(ii + 1), {
        x: x + 0.3, y: iy + 0.02, w: 0.28, h: 0.28,
        fontFace: FONT_BODY, fontSize: 11, bold: true, color: PAL.primary,
        align: "center", valign: "middle",
      });
      s.addText(item, {
        x: x + 0.75, y: iy - 0.06, w: colW - 1.05, h: 0.5,
        fontFace: FONT_BODY, fontSize: 13.5, color: PAL.textDark,
        valign: "middle",
      });
    });
  });
  footerBar(s, "Lecture 6");
}

// vertical parent -> child tree, 2 or 3 nodes
function renderDiagramTree(sl) {
  const s = newSlide(PAL.light);
  slideHeader(s, sl.title);
  s.addText(sl.intro, {
    x: MARGIN, y: 1.35, w: 6.6, h: 3.9,
    fontFace: FONT_BODY, fontSize: 14.5, color: PAL.textDark,
    lineSpacingMultiple: 1.35,
  });

  s.addShape("roundRect", {
    x: MARGIN, y: 5.55, w: 6.6, h: 1.15, rectRadius: 0.08,
    fill: { color: "FFFFFF" }, line: { color: PAL.accent, width: 1.25 },
  });
  s.addText(sl.note, {
    x: MARGIN + 0.25, y: 5.63, w: 6.1, h: 1.0,
    fontFace: FONT_BODY, fontSize: 12, italic: true, color: PAL.secondary,
    valign: "middle", lineSpacingMultiple: 1.2,
  });

  // Tree column on the right
  const nodes = sl.nodes;
  const colX = 7.7;
  const colW = CONTENT_W - (colX - MARGIN);
  const nodeH = nodes.length === 3 ? 1.15 : 1.35;
  const gap = nodes.length === 3 ? 0.55 : 0.75;
  const totalH = nodes.length * nodeH + (nodes.length - 1) * gap;
  let y = (PAGE_H - totalH) / 2 + 0.15;
  const colors = [PAL.primary, PAL.secondary, PAL.accent2];

  nodes.forEach((label, i) => {
    if (i > 0) {
      s.addShape("line", {
        x: colX + colW / 2, y: y - gap, w: 0, h: gap,
        line: { color: PAL.accent, width: 2.5, endArrowType: "triangle" },
      });
    }
    s.addShape("roundRect", {
      x: colX, y, w: colW, h: nodeH, rectRadius: 0.09,
      fill: { color: i === 0 ? colors[0] : "FFFFFF" },
      line: { color: colors[Math.min(i, 2)], width: i === 0 ? 0 : 1.75 },
      shadow: { type: "outer", color: "1E2761", opacity: 0.15, blur: 6, offset: 2, angle: 90 },
    });
    const funcs = sl.labels && sl.labels[label] ? sl.labels[label] : null;
    s.addText(label, {
      x: colX + 0.2, y: y + (funcs ? 0.1 : 0), w: colW - 0.4, h: funcs ? 0.4 : nodeH,
      fontFace: FONT_HEAD, fontSize: 16, bold: true,
      color: i === 0 ? "FFFFFF" : PAL.textDark,
      valign: funcs ? "top" : "middle",
    });
    if (funcs) {
      s.addText(funcs.join("   \u00b7   "), {
        x: colX + 0.2, y: y + 0.52, w: colW - 0.4, h: 0.5,
        fontFace: FONT_CODE, fontSize: 10.5, color: PAL.secondary,
      });
    }
    y += nodeH + gap;
  });

  footerBar(s, sl.title.split("\u2014")[0].trim());
}

// code-focused slide: title/intro on top, code block left, note+output right
function renderCode(sl) {
  const s = newSlide(PAL.light);
  slideHeader(s, sl.title);
  s.addText(sl.intro, {
    x: MARGIN, y: 1.3, w: CONTENT_W, h: 0.6,
    fontFace: FONT_BODY, fontSize: 13, color: PAL.textMuted,
    lineSpacingMultiple: 1.2,
  });

  const codeX = MARGIN, codeY = 2.0, codeW = 7.35, codeH = 4.55;
  s.addShape("roundRect", {
    x: codeX, y: codeY, w: codeW, h: codeH, rectRadius: 0.08,
    fill: { color: PAL.primary }, line: { type: "none" },
    shadow: { type: "outer", color: "1E2761", opacity: 0.25, blur: 10, offset: 3, angle: 90 },
  });
  // fake window dots
  ["FF5F57", "FEBC2E", "28C840"].forEach((c, i) => {
    accentDot(s, codeX + 0.25 + i * 0.28, codeY + 0.22, 0.14, c);
  });
  s.addText(sl.code, {
    x: codeX + 0.35, y: codeY + 0.55, w: codeW - 0.7, h: codeH - 0.85,
    fontFace: FONT_CODE, fontSize: 13, color: "E4E8F2",
    lineSpacingMultiple: 1.28, valign: "top",
  });

  const noteX = codeX + codeW + 0.4;
  const noteW = CONTENT_W - codeW - 0.4;
  s.addShape("roundRect", {
    x: noteX, y: codeY, w: noteW, h: sl.output ? 2.6 : codeH, rectRadius: 0.08,
    fill: { color: "FFFFFF" }, line: { color: "E4E8F2", width: 1 },
    shadow: { type: "outer", color: "1E2761", opacity: 0.1, blur: 6, offset: 2, angle: 90 },
  });
  s.addText("WHAT HAPPENS", {
    x: noteX + 0.25, y: codeY + 0.2, w: noteW - 0.5, h: 0.3,
    fontFace: FONT_BODY, fontSize: 10.5, bold: true, color: PAL.accent === "00D9C0" ? "00A896" : PAL.accent,
    charSpacing: 2,
  });
  s.addText(sl.note, {
    x: noteX + 0.25, y: codeY + 0.55, w: noteW - 0.5, h: (sl.output ? 1.9 : codeH - 0.8),
    fontFace: FONT_BODY, fontSize: 12.5, color: PAL.textDark,
    lineSpacingMultiple: 1.3, valign: "top",
  });

  if (sl.output) {
    const oy = codeY + 2.85;
    s.addShape("roundRect", {
      x: noteX, y: oy, w: noteW, h: codeH - 2.85, rectRadius: 0.08,
      fill: { color: PAL.secondary }, line: { type: "none" },
    });
    s.addText("OUTPUT", {
      x: noteX + 0.25, y: oy + 0.15, w: noteW - 0.5, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, bold: true, color: PAL.accent2, charSpacing: 2,
    });
    s.addText(sl.output, {
      x: noteX + 0.25, y: oy + 0.48, w: noteW - 0.5, h: codeH - 2.85 - 0.6,
      fontFace: FONT_CODE, fontSize: 12, color: "FFFFFF", valign: "top",
      lineSpacingMultiple: 1.3,
    });
  }

  if (sl.flow) {
    // small inline flow chips under the note box replaced by flow row at bottom if no output
  }
  footerBar(s, sl.title.split("\u2014")[0].trim());
}

// two-card comparison layout
function renderConceptSplit(sl) {
  const s = newSlide(PAL.light);
  slideHeader(s, sl.title);

  const y = 1.55, h = 3.85;
  const colW = (CONTENT_W - 0.5) / 2;
  const cards = [
    { x: MARGIN, heading: sl.leftHeading, bullets: sl.leftBullets, color: PAL.primary },
    { x: MARGIN + colW + 0.5, heading: sl.rightHeading, bullets: sl.rightBullets, color: PAL.secondary },
  ];
  cards.forEach((c) => {
    s.addShape("roundRect", {
      x: c.x, y, w: colW, h, rectRadius: 0.1,
      fill: { color: "FFFFFF" }, line: { color: "E4E8F2", width: 1 },
      shadow: { type: "outer", color: "1E2761", opacity: 0.12, blur: 8, offset: 3, angle: 90 },
    });
    s.addShape("roundRect", {
      x: c.x, y, w: colW, h: 0.7, rectRadius: 0.1,
      fill: { color: c.color }, line: { type: "none" },
    });
    s.addText(c.heading, {
      x: c.x + 0.3, y, w: colW - 0.6, h: 0.7,
      fontFace: FONT_HEAD, fontSize: 17, bold: true, color: "FFFFFF",
      valign: "middle",
    });
    const bulletItems = c.bullets.map((b, i) => ({
      text: b,
      options: {
        bullet: { code: "25CF", color: PAL.accent },
        breakLine: i < c.bullets.length - 1,
        fontFace: /\(\)|;|\{/.test(b) ? FONT_CODE : FONT_BODY,
        fontSize: /\(\)|;|\{/.test(b) ? 12.5 : 14,
        color: PAL.textDark,
        paraSpaceAfter: 14,
      },
    }));
    s.addText(bulletItems, {
      x: c.x + 0.3, y: y + 0.95, w: colW - 0.6, h: h - 1.2,
      valign: "top", lineSpacingMultiple: 1.2,
    });
  });

  s.addShape("roundRect", {
    x: MARGIN, y: y + h + 0.2, w: CONTENT_W, h: 0.75, rectRadius: 0.08,
    fill: { color: PAL.light === "F4F6FB" ? "EAF7F5" : PAL.light }, line: { color: PAL.accent, width: 1 },
  });
  s.addText(sl.diagramNote, {
    x: MARGIN + 0.25, y: y + h + 0.2, w: CONTENT_W - 0.5, h: 0.75,
    fontFace: FONT_BODY, fontSize: 12.5, italic: true, color: PAL.secondary,
    valign: "middle",
  });
  footerBar(s, sl.title.split("\u2014")[0].trim());
}

// horizontal step chain with arrows
function renderProcess(sl) {
  const s = newSlide(PAL.light);
  slideHeader(s, sl.title);
  s.addText(sl.intro, {
    x: MARGIN, y: 1.35, w: CONTENT_W, h: 0.9,
    fontFace: FONT_BODY, fontSize: 14, color: PAL.textMuted,
    lineSpacingMultiple: 1.3,
  });

  const steps = sl.steps;
  const n = steps.length;
  const gap = 0.55;
  const boxW = (CONTENT_W - gap * (n - 1)) / n;
  const y = 3.1, boxH = 1.3;
  const colors = [PAL.primary, PAL.secondary, "00A896", PAL.accent2];

  steps.forEach((step, i) => {
    const x = MARGIN + i * (boxW + gap);
    s.addShape("roundRect", {
      x, y, w: boxW, h: boxH, rectRadius: 0.1,
      fill: { color: colors[i % colors.length] }, line: { type: "none" },
      shadow: { type: "outer", color: "1E2761", opacity: 0.18, blur: 6, offset: 2, angle: 90 },
    });
    s.addText(String(i + 1), {
      x: x + 0.18, y: y + 0.12, w: 0.5, h: 0.35,
      fontFace: FONT_BODY, fontSize: 11, bold: true, color: "FFFFFF",
    });
    s.addText(step, {
      x: x + 0.15, y: y + 0.35, w: boxW - 0.3, h: 0.75,
      fontFace: FONT_HEAD, fontSize: 15, bold: true, color: "FFFFFF",
      align: "center", valign: "middle",
    });
    if (i < n - 1) {
      arrowRight(s, x + boxW + 0.06, y + boxH / 2 - 0.09, gap - 0.12, PAL.accent);
    }
  });

  s.addShape("roundRect", {
    x: MARGIN, y: y + boxH + 0.45, w: CONTENT_W, h: 1.35, rectRadius: 0.08,
    fill: { color: "FFFFFF" }, line: { color: "E4E8F2", width: 1 },
  });
  s.addText(sl.note, {
    x: MARGIN + 0.3, y: y + boxH + 0.45, w: CONTENT_W - 0.6, h: 1.35,
    fontFace: FONT_CODE, fontSize: 12, color: PAL.textDark,
    valign: "middle", lineSpacingMultiple: 1.3,
  });
  footerBar(s, sl.title.split("\u2014")[0].trim());
}

// icon-circle rows list
function renderIconList(sl) {
  const s = newSlide(PAL.light);
  slideHeader(s, sl.title);
  s.addText(sl.intro, {
    x: MARGIN, y: 1.35, w: CONTENT_W, h: 0.6,
    fontFace: FONT_BODY, fontSize: 14, color: PAL.textMuted,
  });

  const items = sl.items;
  const rowH = 1.35;
  const startY = 2.3;
  const colors = [PAL.primary, PAL.secondary, "00A896", PAL.accent2];

  items.forEach((it, i) => {
    const y = startY + i * (rowH + 0.25);
    s.addShape("roundRect", {
      x: MARGIN, y, w: CONTENT_W, h: rowH, rectRadius: 0.09,
      fill: { color: "FFFFFF" }, line: { color: "E4E8F2", width: 1 },
      shadow: { type: "outer", color: "1E2761", opacity: 0.1, blur: 6, offset: 2, angle: 90 },
    });
    accentDot(s, MARGIN + 0.35, y + rowH / 2 - 0.4, 0.8, colors[i % colors.length]);
    s.addText(it.label.charAt(0), {
      x: MARGIN + 0.35, y: y + rowH / 2 - 0.4, w: 0.8, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 22, bold: true, color: "FFFFFF",
      align: "center", valign: "middle",
    });
    s.addText(it.label, {
      x: MARGIN + 1.45, y: y + 0.18, w: CONTENT_W - 1.8, h: 0.5,
      fontFace: FONT_HEAD, fontSize: 17, bold: true, color: PAL.textDark,
    });
    s.addText(it.desc, {
      x: MARGIN + 1.45, y: y + 0.68, w: CONTENT_W - 1.8, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: PAL.textMuted,
    });
  });
  footerBar(s, sl.title.split("\u2014")[0].trim());
}

function renderClosing(sl) {
  const s = newSlide(PAL.primary);
  accentDot(s, 11.2, -1.1, 3.6, PAL.secondary);
  accentDot(s, -1.0, 5.6, 3.0, PAL.secondary);

  s.addText(sl.title, {
    x: MARGIN, y: 0.55, w: CONTENT_W, h: 0.7,
    fontFace: FONT_HEAD, fontSize: 30, bold: true, color: "FFFFFF",
  });
  s.addText(sl.subtitle, {
    x: MARGIN, y: 1.2, w: CONTENT_W, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, color: "CADCFC",
  });

  const steps = sl.flow;
  const n = steps.length;
  const gap = 0.35;
  const boxW = (CONTENT_W - gap * (n - 1)) / n;
  const y = 2.0, boxH = 0.95;
  steps.forEach((step, i) => {
    const x = MARGIN + i * (boxW + gap);
    s.addShape("roundRect", {
      x, y, w: boxW, h: boxH, rectRadius: 0.09,
      fill: { color: i % 2 === 0 ? PAL.accent : PAL.accent2 }, line: { type: "none" },
    });
    s.addText(step, {
      x, y, w: boxW, h: boxH,
      fontFace: FONT_HEAD, fontSize: 13.5, bold: true, color: PAL.primary,
      align: "center", valign: "middle",
    });
    if (i < n - 1) {
      arrowRight(s, x + boxW + 0.03, y + boxH / 2 - 0.07, gap - 0.06, "FFFFFF");
    }
  });

  const bulletItems = sl.bullets.map((b, i) => ({
    text: b,
    options: {
      bullet: { code: "25CF", color: PAL.accent },
      breakLine: i < sl.bullets.length - 1,
      fontFace: FONT_BODY, fontSize: 15, color: "FFFFFF",
      paraSpaceAfter: 16,
    },
  }));
  s.addText(bulletItems, {
    x: MARGIN, y: 3.35, w: CONTENT_W, h: 3.4,
    valign: "top", lineSpacingMultiple: 1.25,
  });

  footerBar(s, "Thank You", true);
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------
const RENDERERS = {
  title: renderTitle,
  section: renderSection,
  agenda: renderAgenda,
  diagram_tree: renderDiagramTree,
  code: renderCode,
  concept_split: renderConceptSplit,
  process: renderProcess,
  icon_list: renderIconList,
  closing: renderClosing,
};

DATA.slides.forEach((sl, idx) => {
  const fn = RENDERERS[sl.type];
  if (!fn) {
    throw new Error(`No renderer for slide type "${sl.type}" (slide ${idx + 1})`);
  }
  fn(sl);
});

pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`Wrote ${outPath} (${DATA.slides.length} slides)`);
});