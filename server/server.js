const setup = require('./config/setup');
const server = setup.httpServer.init();
const io = setup.socketIO.init(server);
const handlers = require('./handlers');

io.on('connection', handlers.connection);

server.listen(5050, function () {
    console.log('Server listening on port 5050');
});

module.exports.io = io;