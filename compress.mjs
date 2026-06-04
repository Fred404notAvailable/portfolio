import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GALLERY_DIR = path.join(__dirname, 'public', 'images', 'gallery');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      const filePath = path.join(dir, file);
      const tempFilePath = path.join(dir, `temp_${file}`);
      
      const stats = fs.statSync(filePath);
      const sizeMB = stats.size / (1024 * 1024);
      
      if (sizeMB > 1) { // Only compress files larger than 1MB
        console.log(`Compressing ${file} (${sizeMB.toFixed(2)} MB)...`);
        
        try {
          await sharp(filePath)
            .resize({ width: 1920, withoutEnlargement: true }) // Max width 1920
            .jpeg({ quality: 82, progressive: true }) // Good quality, progressive rendering
            .toFile(tempFilePath);
            
          const newStats = fs.statSync(tempFilePath);
          const newSizeMB = newStats.size / (1024 * 1024);
          
          // Replace original with compressed version
          fs.unlinkSync(filePath);
          fs.renameSync(tempFilePath, filePath);
          
          console.log(`✅ Reduced to ${newSizeMB.toFixed(2)} MB`);
        } catch (error) {
          console.error(`❌ Failed to compress ${file}:`, error);
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        }
      } else {
        console.log(`Skipping ${file} (Already optimized: ${sizeMB.toFixed(2)} MB)`);
      }
    }
  }
}

console.log('Starting image compression...');
processDirectory(GALLERY_DIR).then(() => {
  console.log('Compression complete!');
}).catch(err => {
  console.error('Error during compression:', err);
});
