const express = require('express');
const path = require('path');
const app = express();

// static files
app.use('/client', express.static(path.resolve(__dirname + '/../client/')));

//Page listeners (routers)
var router = require('./router.js');
router(app);

// server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
