const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Simple API endpoint for testing
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    // Try to serve the requested path
    const requestedPath = req.path.substring(1); // Remove leading slash
    
    if (requestedPath && requestedPath.endsWith('.html')) {
        // If it's an HTML file request, try to serve it
        const filePath = path.join(__dirname, requestedPath);
        res.sendFile(filePath, (err) => {
            if (err) {
                // If file not found, fall back to index.html or dashboard.html
                serveDefaultPage(res);
            }
        });
    } else {
        // For all other routes, serve a default page
        serveDefaultPage(res);
    }
});

// Helper function to serve a default page
function serveDefaultPage(res) {
    const possibleFiles = ['dashboard.html', 'index.html', 'authentication.html'];
    
    // Try each possible file
    let fileFound = false;
    for (const file of possibleFiles) {
        const filePath = path.join(__dirname, file);
        try {
            if (require('fs').existsSync(filePath)) {
                res.sendFile(filePath);
                fileFound = true;
                break;
            }
        } catch (err) {
            console.error(`Error checking for ${file}:`, err);
        }
    }
    
    // If no file was found, send a simple message
    if (!fileFound) {
        res.send('Welcome to SafetySync EHS App! No default HTML files found.');
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Current directory: ${__dirname}`);
});
