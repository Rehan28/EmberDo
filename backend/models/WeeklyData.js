const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    points: { type: Number, required: true, min: 1, max: 100 },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const WeeklyDataSchema = new mongoose.Schema(
  {
    weekStart: { type: String, required: true, unique: true, index: true }, // "YYYY-MM-DD" (Sunday)
    goals: { type: [GoalSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeeklyData', WeeklyDataSchema);
