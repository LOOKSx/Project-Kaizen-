// Vercel Serverless Edge/Node API for real-time global sync across all visitors & devices
let globalArticlesStore = null;
let globalSettingsStore = null;
let lastUpdatedAt = Date.now();

module.exports = (req, res) => {
  // CORS Headers
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
      if (body.articles && Array.isArray(body.articles)) {
        globalArticlesStore = body.articles;
      }
      if (body.settings) {
        globalSettingsStore = body.settings;
      }
      lastUpdatedAt = Date.now();
      return res.status(200).json({
        success: true,
        timestamp: lastUpdatedAt,
        articles: globalArticlesStore,
        settings: globalSettingsStore
      });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  return res.status(200).json({
    success: true,
    timestamp: lastUpdatedAt,
    articles: globalArticlesStore,
    settings: globalSettingsStore
  });
};
