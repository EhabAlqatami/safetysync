const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Log all available files (for debugging)
console.log('Available files:');
fs.readdirSync(__dirname).forEach(file => {
  console.log(file);
});

// Route for home page - try multiple possible HTML files
app.get('/', (req, res) => {
  const possibleFiles = ['index.html', 'dashboard.html', 'authentication.html'];
  
  for (const file of possibleFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`Serving ${file} as homepage`);
      return res.sendFile(filePath);
    }
  }
  
  // Fallback if no HTML files found
  res.send('Welcome to SafetySync EHS App! Site is under construction. No HTML files found.');
});

// Catch-all route for any other path
app.get('*', (req, res) => {
  res.send('Welcome to SafetySync EHS App! The requested page was not found.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Current directory: ${__dirname}`);
});
