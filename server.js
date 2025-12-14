require('dotenv').config();
const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Test route - Hello World
// Test route - Hello World
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Hello World! Server is running 🚀',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});