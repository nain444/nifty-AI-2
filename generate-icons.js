// Generate PNG icons for PWA
const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#12121a');
    gradient.addColorStop(1, '#1a1a25');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Border
    ctx.strokeStyle = '#3fb950';
    ctx.lineWidth = size * 0.04;
    ctx.strokeRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9);
    
    // Robot emoji / AI symbol
    ctx.fillStyle = '#00d4ff';
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤖', size / 2, size / 2);
    
    // Save
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`Created ${filename}`);
}

try {
    generateIcon(192, 'www/icon-192.png');
    generateIcon(512, 'www/icon-512.png');
} catch (e) {
    console.log('Canvas not available, using placeholder icons');
    // Create simple placeholder
    const placeholder = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync('www/icon-192.png', placeholder);
    fs.writeFileSync('www/icon-512.png', placeholder);
}
