// Image Color Analyzer & Style Extractor
// Extracts dominant colors + mood from uploaded reference images

function analyzeImage(imageFile) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100; // thumbnail for performance
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 100, 100);
        
        // Extract dominant colors
        const imageData = ctx.getImageData(0, 0, 100, 100).data;
        const colorMap = {};
        for (let i = 0; i < imageData.length; i += 16) {
          const r = Math.round(imageData[i] / 32) * 32;
          const g = Math.round(imageData[i+1] / 32) * 32;
          const b = Math.round(imageData[i+2] / 32) * 32;
          const key = `${r},${g},${b}`;
          colorMap[key] = (colorMap[key] || 0) + 1;
        }
        
        // Sort by frequency
        const sorted = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([key]) => {
            const [r, g, b] = key.split(',').map(Number);
            const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
            return { hex, r, g, b };
          });
        
        // Detect mood from colors
        const avgBrightness = sorted.reduce((s, c) => s + (c.r + c.g + c.b) / 3, 0) / sorted.length;
        const mood = avgBrightness > 150 ? 'bright' : avgBrightness > 80 ? 'balanced' : 'dark';
        
        // Detect warm/cool
        const warmScore = sorted.reduce((s, c) => s + (c.r - c.b), 0) / sorted.length;
        const temperature = warmScore > 30 ? 'warm' : warmScore < -30 ? 'cool' : 'neutral';
        
        resolve({
          dominantColors: sorted.map(c => c.hex),
          mood,
          temperature,
          brightness: avgBrightness,
          primary: sorted[0]?.hex || '#00ffcc',
          secondary: sorted[1]?.hex || '#8800ff'
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  });
}

// Expose globally
window.analyzeImage = analyzeImage;
