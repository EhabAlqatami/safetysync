const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// API endpoints
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Serve the requested HTML file or fall back to login.html
app.get('*.html', (req, res) => {
    const requestedPath = req.path;
    const filePath = path.join(__dirname, requestedPath);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            // If file not found, serve login.html
            res.sendFile(path.join(__dirname, 'login.html'));
        }
    });
});

// Catch-all route to serve login.html for SPA-like behavior
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Current directory: ${__dirname}`);
});
