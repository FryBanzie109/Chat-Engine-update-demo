const express = require('express');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const cors = require('cors');

const app = express();
const PORT = 3000;

require('dotenv').config();
// Mengambil OpenAI API key dari file .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful Discord chat bot.' },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await response.json();
    console.log('OpenAI response:', data); // Debug log
    res.json(data);
  } catch (err) {
    console.error('Server error:', err); // Debug log
    res.status(500).json({ error: 'Failed to connect to OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});