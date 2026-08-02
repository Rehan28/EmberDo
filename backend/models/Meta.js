const mongoose = require('mongoose');

// Singleton document tracking small app-wide state (e.g. last date the
// reflection quote modal was shown).
const MetaSchema = new mongoose.Schema({
  lastQuoteDate: { type: String, default: null },
});

module.exports = mongoose.model('Meta', MetaSchema);
