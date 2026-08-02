const express = require('express');
const router = express.Router();
const WeeklyData = require('../models/WeeklyData');

// GET /api/weekly -> { "2026-07-27": { goals }, ... } for every week on record
router.get('/', async (req, res) => {
  try {
    const entries = await WeeklyData.find({});
    const map = {};
    entries.forEach((e) => {
      map[e.weekStart] = { goals: e.goals };
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/weekly/:weekStart
router.get('/:weekStart', async (req, res) => {
  try {
    const entry = await WeeklyData.findOne({ weekStart: req.params.weekStart });
    res.json(entry ? { goals: entry.goals } : { goals: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/weekly/:weekStart -> replace (upsert) a single week's goals
router.put('/:weekStart', async (req, res) => {
  try {
    const { goals = [] } = req.body;
    const entry = await WeeklyData.findOneAndUpdate(
      { weekStart: req.params.weekStart },
      { weekStart: req.params.weekStart, goals },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ goals: entry.goals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
