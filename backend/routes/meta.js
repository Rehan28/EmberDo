const express = require('express');
const router = express.Router();
const Meta = require('../models/Meta');

async function getSingleton() {
  let doc = await Meta.findOne({});
  if (!doc) doc = await Meta.create({ lastQuoteDate: null });
  return doc;
}

// GET /api/meta -> { lastQuoteDate }
router.get('/', async (req, res) => {
  try {
    const doc = await getSingleton();
    res.json({ lastQuoteDate: doc.lastQuoteDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/meta -> update meta fields
router.put('/', async (req, res) => {
  try {
    const doc = await getSingleton();
    if (typeof req.body.lastQuoteDate !== 'undefined') doc.lastQuoteDate = req.body.lastQuoteDate;
    await doc.save();
    res.json({ lastQuoteDate: doc.lastQuoteDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
