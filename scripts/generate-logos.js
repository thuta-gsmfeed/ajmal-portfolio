const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '../public/images/logo');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Monogram / Icon SVG (Image 1)
const monogramSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="25" y="16" width="135" height="152" rx="24" ry="24" fill="none" stroke="#ffffff" stroke-width="12" stroke-linejoin="round" />
  <rect x="54" y="45" width="77" height="94" rx="14" ry="14" fill="none" stroke="#ffffff" stroke-width="12" stroke-linejoin="round" />
  <line x1="88" y1="92" x2="186" y2="92" stroke="#ffffff" stroke-width="12" stroke-linecap="square" />
</svg>`;

// 2. Full Logo SVG (Image 2)
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 340" width="440" height="340">
  <!-- Top Emblem Monogram -->
  <g transform="translate(120, 15)">
    <rect x="25" y="16" width="135" height="152" rx="24" ry="24" fill="none" stroke="#ffffff" stroke-width="11" stroke-linejoin="round" />
    <rect x="54" y="45" width="77" height="94" rx="14" ry="14" fill="none" stroke="#ffffff" stroke-width="11" stroke-linejoin="round" />
    <line x1="88" y1="92" x2="186" y2="92" stroke="#ffffff" stroke-width="11" stroke-linecap="square" />
  </g>
  
  <!-- GHOLZAD Text with Stylized 'A' (inverted V / chevron) -->
  <g fill="#ffffff" transform="translate(220, 235)">
    <text font-family="'Montserrat', 'Inter', 'Helvetica Neue', sans-serif" font-size="34" font-weight="300" letter-spacing="12" text-anchor="middle" x="0" y="0">
      GHOLZ<tspan font-family="sans-serif" font-weight="300" fill="none" stroke="#ffffff" stroke-width="2.5"> </tspan>D
    </text>
    <!-- Custom Crossbar-less 'A' shape -->
    <path d="M 64 -26 L 76 0 L 88 -26" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  
  <!-- MANAGEMENT GROUP Subtitle -->
  <g fill="rgba(255, 255, 255, 0.85)" transform="translate(220, 285)" text-anchor="middle">
    <text font-family="'Montserrat', 'Inter', 'Helvetica Neue', sans-serif" font-size="11" font-weight="400" letter-spacing="9" x="4">
      MANAGEMENT GROUP
    </text>
  </g>
</svg>`;

// Save SVG files
fs.writeFileSync(path.join(outputDir, 'logo-monogram.svg'), monogramSvg.trim());
fs.writeFileSync(path.join(outputDir, 'logo-full.svg'), fullLogoSvg.trim());

// Render PNG files using sharp
async function generatePngs() {
  // Monogram PNG (Transparent & Black BG)
  await sharp(Buffer.from(monogramSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'logo-monogram.png'));

  await sharp(Buffer.from(fullLogoSvg))
    .resize(800, 640)
    .png()
    .toFile(path.join(outputDir, 'logo-full.png'));

  console.log('Logo files generated successfully in public/images/logo/');
}

generatePngs().catch(console.error);
