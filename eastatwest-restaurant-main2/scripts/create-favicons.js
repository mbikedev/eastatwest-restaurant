const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFavicons() {
  const inputFile = path.join(__dirname, '../public/apple-touch-icon.png');
  const publicDir = path.join(__dirname, '../public');

  // Read the input image
  const image = sharp(inputFile);

  // Get image metadata to check for trimming
  const metadata = await image.metadata();
  console.log('Original image size:', metadata.width, 'x', metadata.height);

  // Trim transparent pixels and get the trimmed image
  const trimmed = await image.trim().toBuffer();

  // Create larger favicon sizes with trimmed image
  const sizes = [
    { size: 48, name: 'favicon-48x48.png' },
    { size: 64, name: 'favicon-64x64.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 128, name: 'favicon-128x128.png' },
  ];

  for (const { size, name } of sizes) {
    await sharp(trimmed)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, name));

    console.log(`Created ${name}`);
  }

  console.log('All favicons created successfully!');
}

createFavicons().catch(console.error);
