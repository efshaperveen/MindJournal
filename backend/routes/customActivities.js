import express from 'express';
import CustomActivity from '../models/CustomActivity.js';

const router = express.Router();

//  GET: Fetch all custom activities for a user
router.get('/:email', async (req, res) => {
  try {
    const record = await CustomActivity.findOne({ userEmail: req.params.email });
    res.json(record?.activities || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

//  POST: Add a custom activity
router.post('/', async (req, res) => {
  const { email, activity } = req.body;

  try {
    const user = await CustomActivity.findOneAndUpdate(
      { userEmail: email },
      { $addToSet: { activities: activity } }, // prevents duplicates
      { new: true, upsert: true }
    );
    res.json(user.activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

//  DELETE: Remove a custom activity
router.delete('/', async (req, res) => {
  const { email, activity } = req.body;

  try {
    const user = await CustomActivity.findOneAndUpdate(
      { userEmail: email },
      { $pull: { activities: activity } },
      { new: true }
    );
    res.json(user.activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;
