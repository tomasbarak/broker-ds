module.exports.socketIO = {
    init: (server) => {
        const io = require('socket.io')(server, {
            cors: {
                origin: '*',
            }
        });

        io.locals = {
            connected_clients: [],
            active_topic: {
                "general": [],
                "ack": []
            }
        }

        return io;
    }
};

module.exports.httpServer = {
    init: (options = {}) => {
        const server = require('http').createServer(options);
        return server;
    }
}