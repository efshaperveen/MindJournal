
import mongoose from 'mongoose';

const customActivitySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  activities: { type: [String], default: [] },
});

export default mongoose.model('CustomActivity', customActivitySchema);
