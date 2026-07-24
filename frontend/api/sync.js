// Vercel Serverless Edge/Node API for real-time global sync across all visitors & devices
// (iPhone, Android, Windows, Mac, etc.)
const https = require('https');

const ARTICLES_BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019f9330-e258-7fc6-8c0f-23f9e7b781f2';
const SETTINGS_BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019f9330-e400-7bdf-9108-7edaf83958e3';

let inMemoryStore = {
  articles: null,
  settings: null,
  timestamp: Date.now()
};

function fetchBlob(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          return resolve(parsed);
        } catch (e) {}
        resolve(null);
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(3500, () => {
      req.destroy();
      resolve(null);
    });
  });
}

function saveBlob(url, data) {
  return new Promise((resolve) => {
    const payload = JSON.stringify(data);
    const req = https.request(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 201);
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
        await saveBlob(ARTICLES_BLOB_URL, { articles: body.articles, timestamp: now }).catch(() => {});
      }
      if (body.settings !== undefined) {
        inMemoryStore.settings = body.settings;
        await saveBlob(SETTINGS_BLOB_URL, { settings: body.settings, timestamp: now }).catch(() => {});
      }
      inMemoryStore.timestamp = now;

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

  // GET request - retrieve latest data from dual cloud blobs
  const [artData, settData] = await Promise.all([
    fetchBlob(ARTICLES_BLOB_URL),
    fetchBlob(SETTINGS_BLOB_URL)
  ]);

  if (artData && artData.articles !== undefined) {
    inMemoryStore.articles = artData.articles;
  }
  if (settData && settData.settings !== undefined) {
    inMemoryStore.settings = settData.settings;
  }

  return res.status(200).json({
    success: true,
    timestamp: inMemoryStore.timestamp,
    articles: inMemoryStore.articles,
    settings: inMemoryStore.settings
  });
};
