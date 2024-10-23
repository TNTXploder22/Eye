const path = require('path');

var router = function(app) {
    app.get('/', function(req, res) {
        res.status(200).sendFile(path.join(__dirname + '/../client/index.html'));
    });

    app.get('/Eye', function(req, res) {
        res.status(200).sendFile(path.join(__dirname + '/../client/index.html'));
    });
};

module.exports = router;