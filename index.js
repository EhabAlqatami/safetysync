const express = require('express') ;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Add this fallback route
app.get('*', (req, res) => {
  res.send('Welcome to SafetySync EHS App! Site is under construction.');
});
