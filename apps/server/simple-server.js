
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Prompt execution endpoint
app.post('/api/prompt/execute', async (req, res) => {
  try {
    const { prompt, provider, model } = req.body;
    
    // Mock response for now
    const response = {
      success: true,
      response: "Mock response from server: " + prompt,
      prompt,
      provider: provider || 'openai',
      model: model || 'gpt-3.5-turbo',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Settings endpoint
app.get('/api/settings', (req, res) => {
  res.json({
    providers: {
      openai: { apiKey: '' },
      lmstudio: { baseUrl: 'http://localhost:1234' }
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});
