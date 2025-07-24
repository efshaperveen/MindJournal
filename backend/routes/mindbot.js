import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/mindbot', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'moonshotai/kimi-k2:free', // adjust to your preferred model
        messages: [
          { role: 'system', content: 'You are MindBot-AI, an empathetic mental health assistant.' },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'OpenRouter call failed' });
  }
});

export default router;
