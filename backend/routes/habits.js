const express = require('express');
const router = express.Router();
const HabitData = require('../models/HabitData');

async function getSingleton() {
  let doc = await HabitData.findOne({});
  if (!doc) doc = await HabitData.create({ habits: [], logs: {} });
  return doc;
}

// GET /api/habits -> { habits: [...], logs: { date: { habitId: true } } }
router.get('/', async (req, res) => {
  try {
    const doc = await getSingleton();
    res.json({ habits: doc.habits, logs: doc.logs || {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/habits -> replace the full habit list + log
router.put('/', async (req, res) => {
  try {
    const { habits = [], logs = {} } = req.body;
    const doc = await getSingleton();
    doc.habits = habits;
    doc.logs = logs;
    doc.markModified('logs');
    await doc.save();
    res.json({ habits: doc.habits, logs: doc.logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
