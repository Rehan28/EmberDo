const mongoose = require('mongoose');

// Singleton document: one collection, one row, holding the full habit list
// plus a per-date completion log ({ "YYYY-MM-DD": { habitId: true } }).
const HabitSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const HabitDataSchema = new mongoose.Schema({
  habits: { type: [HabitSchema], default: [] },
  logs: { type: mongoose.Schema.Types.Mixed, default: {} },
});

module.exports = mongoose.model('HabitData', HabitDataSchema);
