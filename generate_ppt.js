#!/usr/bin/env node

/**
 * PowerPoint Generator from JSON Configuration
 * Generates a PPTX presentation from a JSON slide configuration
 * 
 * Usage: node generate_ppt.js <config.json> [output.pptx]
 */

const fs = require('fs');
const path = require('path');

// Require PptxGenJs
let PptxGenJs;
try {
  PptxGenJs = require('pptxgenjs');
} catch (err) {
  console.error('Error: pptxgenjs not found. Install with: npm install pptxgenjs');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node generate_ppt.js <config.json> [output.pptx]');
  console.log('Example: node generate_ppt.js lecture_8_9_config.json lecture.pptx');
  process.exit(1);
}

const configFile = args[0];
const outputFile = args[1] || 'lecture.pptx';

// Check if config file exists
if (!fs.existsSync(configFile)) {
  console.error(`Error: Config file not found: ${configFile}`);
  process.exit(1);
}

// Read and parse JSON
let config;
try {
  const jsonContent = fs.readFileSync(configFile, 'utf-8');
  config = JSON.parse(jsonContent);
} catch (err) {
  console.error(`Error parsing JSON: ${err.message}`);
  process.exit(1);
}

// Initialize presentation
const pres = new PptxGenJs();

// Set layout to 16:9 (10" x 5.625")
pres.layout = pres.LAYOUT_16x9;

// Define theme colors from config
const theme = config.presentation.theme || {
  primary: '1F1F3D',
  secondary: 'FF6B6B',
  accent: '4ECDC4',
  text: 'FFFFFF',
  background: '0F0F1E'
};

// Helper function to add a title slide
function addTitleSlide(slide, theme) {
  const s = pres.addSlide();
  
  // Background
  s.background = { color: theme.background };
  
  // Title
  s.addText(slide.title || '', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.2,
    fontSize: 54,
    bold: true,
    color: theme.text,
    align: 'center',
    fontFace: 'Arial'
  });
  
  // Subtitle
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 0.5,
      y: 3,
      w: 9,
      h: 0.8,
      fontSize: 28,
      color: theme.accent,
      align: 'center',
      fontFace: 'Arial'
    });
  }
  
  // Add decorative line
  s.addShape(pres.ShapeType.rectangle, {
    x: 3,
    y: 4.2,
    w: 4,
    h: 0.05,
    fill: { color: theme.accent },
    line: { type: 'none' }
  });
  
  // Speaker notes
  if (slide.notes) {
    s.addNotes(slide.notes);
  }
}

// Helper function to add a section slide
function addSectionSlide(slide, theme) {
  const s = pres.addSlide();
  
  // Background with accent color
  s.background = { color: theme.primary };
  
  // Section title
  s.addText(slide.title || '', {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 1.2,
    fontSize: 48,
    bold: true,
    color: theme.accent,
    align: 'left',
    fontFace: 'Arial'
  });
  
  // Subtitle
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 0.5,
      y: 3.2,
      w: 9,
      h: 0.6,
      fontSize: 24,
      color: theme.text,
      align: 'left',
      fontFace: 'Arial'
    });
  }
  
  // Decorative shapes
  s.addShape(pres.ShapeType.rectangle, {
    x: 0,
    y: 4.8,
    w: 10,
    h: 0.8,
    fill: { color: theme.secondary },
    line: { type: 'none' }
  });
  
  // Speaker notes
  if (slide.notes) {
    s.addNotes(slide.notes);
  }
}

// Helper function to add a content slide
function addContentSlide(slide, theme) {
  const s = pres.addSlide();
  
  // Background
  s.background = { color: theme.background };
  
  // Title
  s.addText(slide.title || '', {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.6,
    fontSize: 40,
    bold: true,
    color: theme.accent,
    align: 'left',
    fontFace: 'Arial'
  });
  
  // Subtitle if present
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 0.5,
      y: 1.0,
      w: 9,
      h: 0.4,
      fontSize: 18,
      color: theme.text,
      align: 'left',
      fontFace: 'Arial',
      italic: true
    });
  }
  
  // Horizontal line under title
  s.addShape(pres.ShapeType.rectangle, {
    x: 0.5,
    y: slide.subtitle ? 1.5 : 1.1,
    w: 9,
    h: 0.02,
    fill: { color: theme.secondary },
    line: { type: 'none' }
  });
  
  const contentStartY = slide.subtitle ? 1.8 : 1.4;
  
  // Content area
  if (slide.diagram && slide.content) {
    // Display diagram/code in monospace
    s.addText(slide.content, {
      x: 0.7,
      y: contentStartY,
      w: 8.6,
      h: 3.5,
      fontSize: 12,
      color: theme.accent,
      align: 'left',
      fontFace: 'Courier New',
      valign: 'top'
    });
  } else if (slide.bullets) {
    // Bullets content
    let currentY = contentStartY;
    
    slide.bullets.forEach((bullet, index) => {
      if (typeof bullet === 'string') {
        // Simple bullet
        s.addText('• ' + bullet, {
          x: 0.8,
          y: currentY,
          w: 8.4,
          h: 0.4,
          fontSize: 16,
          color: theme.text,
          align: 'left',
          fontFace: 'Arial'
        });
        currentY += 0.45;
      } else if (bullet.label) {
        // Labeled section
        s.addText(bullet.label, {
          x: 0.8,
          y: currentY,
          w: 8.4,
          h: 0.35,
          fontSize: 16,
          bold: true,
          color: theme.accent,
          align: 'left',
          fontFace: 'Arial'
        });
        currentY += 0.4;
        
        // Items under label
        bullet.items.forEach(item => {
          s.addText('◦ ' + item, {
            x: 1.2,
            y: currentY,
            w: 8,
            h: 0.35,
            fontSize: 14,
            color: theme.text,
            align: 'left',
            fontFace: 'Arial'
          });
          currentY += 0.38;
        });
        currentY += 0.1;
      }
    });
  }
  
  // Explanation if present
  if (slide.explanation) {
    s.addText(slide.explanation, {
      x: 0.7,
      y: 4.8,
      w: 8.6,
      h: 0.65,
      fontSize: 13,
      color: theme.secondary,
      align: 'left',
      fontFace: 'Arial',
      italic: true
    });
  }
  
  // Speaker notes
  if (slide.notes) {
    s.addNotes(slide.notes);
  }
}

// Helper function to add a code slide
function addCodeSlide(slide, theme) {
  const s = pres.addSlide();
  
  // Background
  s.background = { color: theme.background };
  
  // Title
  s.addText(slide.title || '', {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.6,
    fontSize: 40,
    bold: true,
    color: theme.accent,
    align: 'left',
    fontFace: 'Arial'
  });
  
  // Horizontal line
  s.addShape(pres.ShapeType.rectangle, {
    x: 0.5,
    y: 1.05,
    w: 9,
    h: 0.02,
    fill: { color: theme.secondary },
    line: { type: 'none' }
  });
  
  // Code block background
  s.addShape(pres.ShapeType.rectangle, {
    x: 0.5,
    y: 1.3,
    w: 9,
    h: 2.8,
    fill: { color: '1a1a2e' },
    line: { color: theme.accent, width: 1 }
  });
  
  // Code content
  s.addText(slide.code || '', {
    x: 0.7,
    y: 1.4,
    w: 8.6,
    h: 2.6,
    fontSize: 11,
    color: theme.accent,
    align: 'left',
    fontFace: 'Courier New',
    valign: 'top',
    margin: [5, 5, 5, 5]
  });
  
  // Explanation
  if (slide.explanation) {
    s.addText(slide.explanation, {
      x: 0.7,
      y: 4.3,
      w: 8.6,
      h: 0.9,
      fontSize: 13,
      color: theme.secondary,
      align: 'left',
      fontFace: 'Arial',
      italic: true,
      valign: 'top'
    });
  }
  
  // Speaker notes
  if (slide.notes) {
    s.addNotes(slide.notes);
  }
}

// Main function to generate presentation
function generatePresentation() {
  console.log(`📊 Generating presentation from: ${configFile}`);
  console.log(`🎨 Using theme: Primary=${theme.primary}, Secondary=${theme.secondary}, Accent=${theme.accent}`);
  console.log(`📑 Processing ${config.slides.length} slides...`);
  
  // Add each slide
  config.slides.forEach((slide, index) => {
    try {
      switch (slide.type) {
        case 'title':
          addTitleSlide(slide, theme);
          break;
        case 'section':
          addSectionSlide(slide, theme);
          break;
        case 'code':
          addCodeSlide(slide, theme);
          break;
        case 'content':
          addContentSlide(slide, theme);
          break;
        default:
          console.warn(`⚠️  Unknown slide type: ${slide.type}`);
          addContentSlide(slide, theme);
      }
      
      // Progress indicator
      if ((index + 1) % 10 === 0) {
        console.log(`  ✓ Added slide ${index + 1}/${config.slides.length}`);
      }
    } catch (err) {
      console.error(`❌ Error processing slide ${index + 1}: ${err.message}`);
      throw err;
    }
  });
  
  // Save presentation
  try {
    pres.writeFile({ fileName: outputFile });
    console.log(`✅ Presentation saved: ${outputFile}`);
    console.log(`📈 Total slides: ${config.slides.length}`);
  } catch (err) {
    console.error(`❌ Error saving presentation: ${err.message}`);
    process.exit(1);
  }
}

// Run generator
try {
  generatePresentation();
} catch (err) {
  console.error(`\n❌ Fatal error: ${err.message}`);
  process.exit(1);
}