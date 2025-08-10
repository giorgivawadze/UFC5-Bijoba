const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:;");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Serve static files from root
app.use(express.static(__dirname));

// Load fighter data
let fighters = [];
try {
    fighters = JSON.parse(fs.readFileSync(path.join(__dirname, 'fighters.json'), 'utf8'));
} catch (err) {
    console.error('Error loading fighters data:', err);
}

// API endpoint for all fighters
app.get('/api/fighters', (req, res) => {
    res.json(fighters);
});

// API endpoint for individual fighter
app.get('/api/fighters/:id', (req, res) => {
    const fighterId = parseInt(req.params.id);
    const fighter = fighters.find(f => f.id === fighterId);
    
    if (fighter) {
        res.json(fighter);
    } else {
        res.status(404).json({ error: 'Fighter not found' });
    }
});

// Fighter profile page
app.get('/fighter.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'fighter.html'));
});

// All other routes serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error - Blood Flow Disrupted');
});

app.listen(port, () => {
    console.log(`UFC 5 Blood Sport server running: http://localhost:${port}`);
    console.log(`Next bloodbath scheduled for ${getNextFriday6PM().toLocaleString()}`);
});

// Helper function to get next event time
function getNextFriday6PM() {
    const now = new Date();
    const georgianOffset = 4 * 60 * 60000; // GMT+4 in milliseconds
    const localTime = now.getTime();
    const georgianTime = localTime + (now.getTimezoneOffset() * 60000) + georgianOffset;
    const geoNow = new Date(georgianTime);
    
    // Calculate days until Friday (5)
    let daysUntilFriday = 5 - geoNow.getDay();
    if (daysUntilFriday < 0) daysUntilFriday += 7;
    
    // If today is Friday and before 18:00
    if (daysUntilFriday === 0 && geoNow.getHours() < 18) {
        daysUntilFriday = 0;
    } else if (daysUntilFriday === 0) {
        daysUntilFriday = 7;
    }
    
    // Create next Friday at 18:00 Georgian Time
    const nextFriday = new Date(geoNow);
    nextFriday.setDate(geoNow.getDate() + daysUntilFriday);
    nextFriday.setHours(18, 0, 0, 0);
    
    // Convert back to local time
    return new Date(nextFriday.getTime() - (now.getTimezoneOffset() * 60000) - georgianOffset);
}