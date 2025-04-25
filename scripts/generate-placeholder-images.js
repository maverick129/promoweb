const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const images = [
  { name: 'tshirt-farmer.jpg', text: 'T-Shirt Prize' },
  { name: 'cap-farmer.jpg', text: 'Cap Prize' },
  { name: 'water-bottle-farmer.jpg', text: 'Water Bottle Prize' },
  { name: 'equipment-farmer.jpg', text: 'Equipment Prize' },
  { name: 'daily-farmer.jpg', text: 'Daily Prize' },
  { name: 'community-farmer.jpg', text: 'Community Event' },
  { name: 'seasonal-farmer.jpg', text: 'Seasonal Reward' }
];

const outputDir = path.join(process.cwd(), 'public', 'images', 'farmers');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

images.forEach(({ name, text }) => {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Fill background with a gradient
  const gradient = ctx.createLinearGradient(0, 0, 800, 600);
  gradient.addColorStop(0, '#4ade80');
  gradient.addColorStop(1, '#22c55e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);

  // Add text
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 400, 300);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(outputDir, name), buffer);
  console.log(`Generated ${name}`);
}); 