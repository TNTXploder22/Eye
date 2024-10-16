const express = require('express');
const path = require('path');
const app = express();

// static files
app.use('/client', express.static(path.resolve(__dirname + '/../client/')));

// routes
app.get('/server', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/server`);
});
