const express = require('express');
const router = express.Router();
const NotesData = require('../models/NotesData');

async function getSingleton() {
  let doc = await NotesData.findOne({});
  if (!doc) doc = await NotesData.create({ folders: [{ id: 'root', name: 'General' }], notes: [] });
  return doc;
}

// GET /api/notes -> { folders: [...], notes: [...] }
router.get('/', async (req, res) => {
  try {
    const doc = await getSingleton();
    res.json({ folders: doc.folders, notes: doc.notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notes -> replace the full folders + notes set
router.put('/', async (req, res) => {
  try {
    const { folders = [{ id: 'root', name: 'General' }], notes = [] } = req.body;
    const doc = await getSingleton();
    doc.folders = folders;
    doc.notes = notes;
    await doc.save();
    res.json({ folders: doc.folders, notes: doc.notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
