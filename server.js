const http = require('http');
const app = require('./app');

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 2099;
const server = http.createServer(app);
server.listen(port);
console.log(`Server is listening on port ${port}`);