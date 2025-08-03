// server.js
import express from 'express';
import dotenv from 'dotenv';
import mindbotRoutes from './routes/mindbot.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, 'routes', '.env') });

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', mindbotRoutes);

app.get('/', (req, res) => {
  res.send('MindJournal API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
