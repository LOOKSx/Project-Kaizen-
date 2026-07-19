const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'dist', 'browser');
const destDir = path.join(__dirname, 'dist');

if (fs.existsSync(srcDir)) {
  console.log(`Copying files from ${srcDir} to ${destDir} for Vercel deployment...`);
  fs.readdirSync(srcDir).forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    
    try {
      if (fs.lstatSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } catch (err) {
      console.error(`Error copying ${file}:`, err);
    }
  });
  console.log('Copy complete!');
} else {
  console.log(`Source directory ${srcDir} does not exist.`);
}
