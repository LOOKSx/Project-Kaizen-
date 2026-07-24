// Vercel Serverless Edge/Node API for real-time global sync across all visitors & devices
// (iPhone, Android, Windows, Mac, etc.)
const https = require('https');

const CLOUD_STORAGE_URL = 'https://jsonblob.com/api/jsonBlob/019f932b-55f6-7921-bd39-1207e80e0712';

let inMemoryStore = {
  articles: null,
  settings: null,
  timestamp: Date.now()
};

function fetchFromCloud() {
  return new Promise((resolve) => {
    const req = https.get(CLOUD_STORAGE_URL, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed) {
            if (parsed.articles !== undefined) inMemoryStore.articles = parsed.articles;
            if (parsed.settings !== undefined) inMemoryStore.settings = parsed.settings;
            if (parsed.timestamp) inMemoryStore.timestamp = parsed.timestamp;
            return resolve(parsed);
          }
        } catch (e) {}
        resolve(inMemoryStore);
      });
    });
    req.on('error', () => resolve(inMemoryStore));
    req.setTimeout(3500, () => {
      req.destroy();
      resolve(inMemoryStore);
    });
  });
}

function saveToCloud(data) {
  return new Promise((resolve) => {
    const payload = JSON.stringify(data);
    const req = https.request(CLOUD_STORAGE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve(true);
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3500, () => {
      req.destroy();
      resolve(false);
    });
    req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const now = Date.now();

      if (body.articles !== undefined && Array.isArray(body.articles)) {
        inMemoryStore.articles = body.articles;
      }
      if (body.settings !== undefined) {
        inMemoryStore.settings = body.settings;
      }
      inMemoryStore.timestamp = now;

      // Save to persistent cloud storage
      await saveToCloud({
        articles: inMemoryStore.articles,
        settings: inMemoryStore.settings,
        timestamp: now
      });

      return res.status(200).json({
        success: true,
        timestamp: now,
        articles: inMemoryStore.articles,
        settings: inMemoryStore.settings
      });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  }

  // GET request - retrieve latest data from persistent cloud storage
  const cloudData = await fetchFromCloud();
  return res.status(200).json({
    success: true,
    timestamp: cloudData.timestamp || inMemoryStore.timestamp,
    articles: cloudData.articles !== undefined ? cloudData.articles : inMemoryStore.articles,
    settings: cloudData.settings !== undefined ? cloudData.settings : inMemoryStore.settings
  });
};
