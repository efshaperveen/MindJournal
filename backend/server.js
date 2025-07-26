import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import mindbotRoutes from './routes/mindbot.js';
import customActivitiesRoutes from './routes/customActivities.js'; //  new import

dotenv.config();
console.log('MONGO_URI from .env:', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/mindbot', mindbotRoutes);
app.use('/api/custom-activities', customActivitiesRoutes); //  new route

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(' MongoDB connected');
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
})
.catch((err) => {
  console.error(' MongoDB connection failed:', err);
});
