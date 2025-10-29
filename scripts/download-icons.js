import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Weather conditions and their icons (both day and night versions)
const weatherCodes = [
  '01', '02', '03', '04', '09', '10', '11', '13', '50'
];

// Create the weather-icons directory in frontend/public
const iconDir = path.join(__dirname, '..', 'frontend', 'public', 'weather-icons');

async function downloadIcon(code, timeOfDay) {
  const filename = `${code}${timeOfDay}.png`;
  const url = `https://openweathermap.org/img/wn/${code}${timeOfDay}@2x.png`;
  const filePath = path.join(iconDir, filename);

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filePath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filePath);
        reject(err);
      });
    }).on('error', reject);
  });
}

async function downloadAllIcons() {
  try {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(iconDir)) {
      fs.mkdirSync(iconDir, { recursive: true });
      console.log('Created weather-icons directory');
    }

    // Download all day and night versions
    const downloads = weatherCodes.flatMap(code => [
      downloadIcon(code, 'd'),
      downloadIcon(code, 'n')
    ]);

    await Promise.all(downloads);
    console.log('All icons downloaded successfully!');
  } catch (error) {
    console.error('Error downloading icons:', error);
  }
}

// Run the download
downloadAllIcons();