const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    points: { type: Number, required: true, min: 1, max: 100 },
    completed: { type: Boolean, default: false },
    deadline: { type: String, default: null }, // "HH:MM", optional
  },
  { _id: false }
);

const NotodoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    points: { type: Number, required: true, min: 1, max: 100 },
    violated: { type: Boolean, default: false },
  },
  { _id: false }
);

const DailyDataSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true, index: true }, // "YYYY-MM-DD"
    todos: { type: [TodoSchema], default: [] },
    notodos: { type: [NotodoSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyData', DailyDataSchema);
