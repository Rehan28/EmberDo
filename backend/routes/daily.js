const express = require('express');
const router = express.Router();
const DailyData = require('../models/DailyData');

// GET /api/daily  -> { "2026-08-01": { todos, notodos }, ... } for every day on record
// (used to build the 365-day heatmap without one request per day)
router.get('/', async (req, res) => {
  try {
    const entries = await DailyData.find({});
    const map = {};
    entries.forEach((e) => {
      map[e.date] = { todos: e.todos, notodos: e.notodos };
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/daily/:date -> a single day's data
router.get('/:date', async (req, res) => {
  try {
    const entry = await DailyData.findOne({ date: req.params.date });
    res.json(entry ? { todos: entry.todos, notodos: entry.notodos } : { todos: [], notodos: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/daily/:date -> replace (upsert) a single day's todos/notodos
router.put('/:date', async (req, res) => {
  try {
    const { todos = [], notodos = [] } = req.body;
    const entry = await DailyData.findOneAndUpdate(
      { date: req.params.date },
      { date: req.params.date, todos, notodos },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ todos: entry.todos, notodos: entry.notodos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
