require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const dailyRoutes = require('./routes/daily');
const weeklyRoutes = require('./routes/weekly');
const monthlyRoutes = require('./routes/monthly');
const habitsRoutes = require('./routes/habits');
const notesRoutes = require('./routes/notes');
const metaRoutes = require('./routes/meta');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/daily', dailyRoutes);
app.use('/api/weekly', weeklyRoutes);
app.use('/api/monthly', monthlyRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/meta', metaRoutes);

// Fallback for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Ember API running on http://localhost:${PORT}`));
});
