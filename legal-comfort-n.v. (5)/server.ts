import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/router.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Mount APIs
app.use('/api', apiRouter);

// Serve static assets from built React app
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all other routes to SPA shell index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Production server running on port ${port}`);
});
