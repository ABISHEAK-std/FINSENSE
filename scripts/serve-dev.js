const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle client-side routing (match any path)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 FinSense AI development server running on http://localhost:${PORT}`);
  console.log('📱 Open this URL in your browser to test the application');
  console.log('🔐 Use the "Login with Internet Identity" button to authenticate');
});
