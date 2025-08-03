import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/mindbot', async (req, res) => {
  console.log('Received request for /mindbot with body:', JSON.stringify(req.body, null, 2));
  const { message: userMessage, context: entry } = req.body;

  let systemPrompt;

  if (entry) {
    let contextString = '';
    try {
      contextString += `Title: ${entry.title || 'Not specified'}\n`;
      contextString += `Mood: ${entry.mood || 'Not specified'}\n`;
      if (entry.activities && Array.isArray(entry.activities) && entry.activities.length > 0) {
        contextString += `Activities: ${entry.activities.join(', ')}\n`;
      }
      if (entry.micro_goals && Array.isArray(entry.micro_goals) && entry.micro_goals.length > 0) {
        contextString += `Goals:\n${entry.micro_goals.map(g => `- ${g.text} (${g.is_completed ? 'Completed' : 'Pending'})`).join('\n')}\n`;
      }
      contextString += `\nContent:\n---\n${entry.content || 'The user has not written anything yet.'}\n---`;
    } catch (error) {
      console.error('Error constructing context string:', error);
      return res.status(500).json({ error: 'Failed to construct context string.', details: error.message });
    }

    systemPrompt = `You are MindBot-AI, an empathetic mental health assistant. Your primary task is to discuss the provided journal entry with the user.

**Journal Entry Details:**
${contextString}

**Your Instructions:**
-   **Focus exclusively** on the journal entry provided above.
-   Engage with the user about their thoughts and feelings related to this specific entry.
-   Be supportive, empathetic, and helpful.
-   **Do not** mention that you are an AI.
-   **Do not** refer to any "past entries" or previous conversations. Your knowledge is limited to this single entry.`;
  } else {
    systemPrompt = 'You are MindBot-AI, an empathetic mental health assistant. Respond to the user in a supportive and helpful manner.';
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free', // Using a known stable model
        messages: [
          { role: 'system', content: systemPrompt },
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
    console.error('Full error object from OpenRouter call:', error);
    res.status(500).json({ error: 'OpenRouter call failed', details: error.message });
  }
});

export default router;
