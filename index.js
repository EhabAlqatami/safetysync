const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// In-memory storage (replace with database in production)
const users = [
    { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', name: 'Regular User', role: 'user' }
];

const incidents = [];
const inspections = [];

// API Routes
// Auth endpoints
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // In a real app, you would set up sessions or JWT here
        const userInfo = { ...user };
        delete userInfo.password; // Don't send password to client
        
        res.json({
            success: true,
            user: userInfo
        });
    } else {
        res.json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});

app.get('/api/auth/status', (req, res) => {
    // In a real app, you would check session or JWT here
    res.json({
        authenticated: false
    });
});

// Incident reporting endpoints
app.post('/api/incidents/report', (req, res) => {
    const newIncident = {
        id: incidents.length + 1,
        timestamp: new Date(),
        ...req.body
    };
    
    incidents.push(newIncident);
    
    res.json({
        success: true,
        incident: newIncident
    });
});

app.get('/api/incidents', (req, res) => {
    res.json(incidents);
});

// Inspection endpoints
app.post('/api/inspections', (req, res) => {
    const newInspection = {
        id: inspections.length + 1,
        timestamp: new Date(),
        ...req.body
    };
    
    inspections.push(newInspection);
    
    res.json({
        success: true,
        inspection: newInspection
    });
});

app.get('/api/inspections', (req, res) => {
    res.json(inspections);
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

// Catch-all route to handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Current directory: ${__dirname}`);
});
