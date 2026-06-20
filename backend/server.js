const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initBucket } = require('./config/minio');
const { initDatabase } = require('./config/database');
const memeRoutes = require('./routes/memeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api/memes', memeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API running 🚀' });
});

const startServer = async () => {
  try {
    await initDatabase();
    await initBucket();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur au démarrage:', error.message);
    process.exit(1);
  }
};

startServer();