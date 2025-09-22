import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rolesRouter from './routes/roles.js';
import chatRouter from './routes/chat.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

app.use('/api/roles', rolesRouter);
app.use('/api/chat', chatRouter);

// serve static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/', express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`AI Talk server listening on http://localhost:${PORT}`);
});


