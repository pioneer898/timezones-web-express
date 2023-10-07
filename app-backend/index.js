const express = require('express');
const http = require('http');
// Express
const app = express();
const server = http.createServer(app);

// Static App
app.use('/',express.static('./dist/'));

// Start Server
const port = (process.env.NODE_ENV === undefined?'development':process.env.NODE_ENV) === 'production' ? 80 : 88;
server.listen(port, () => {
	console.log(`listening on *:${port}`);
});