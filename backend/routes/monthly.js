const express = require('express');
const router = express.Router();
const MonthlyData = require('../models/MonthlyData');

// GET /api/monthly -> { "2026-08": { goals }, ... } for every month on record
router.get('/', async (req, res) => {
  try {
    const entries = await MonthlyData.find({});
    const map = {};
    entries.forEach((e) => {
      map[e.month] = { goals: e.goals };
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/monthly/:month
router.get('/:month', async (req, res) => {
  try {
    const entry = await MonthlyData.findOne({ month: req.params.month });
    res.json(entry ? { goals: entry.goals } : { goals: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/monthly/:month -> replace (upsert) a single month's goals
router.put('/:month', async (req, res) => {
  try {
    const { goals = [] } = req.body;
    const entry = await MonthlyData.findOneAndUpdate(
      { month: req.params.month },
      { month: req.params.month, goals },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ goals: entry.goals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
