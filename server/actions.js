
module.exports.subscribeToTopic = (topic, socket_id) => {
    const io = require("./server").io;

    if (!(topic in io.locals.active_topic)) {
        let arr = [];
        arr.push(socket_id);
        io.locals.active_topic[topic] = arr;
    } else {
        if (!(io.locals.active_topic[topic].includes(socket_id))) {
            console.log("Topic", io.locals.active_topic[topic]);
            io.locals.active_topic[topic].forEach((id) => {
                let socket = io.sockets.sockets.get(id);
                if (socket) {
                    socket.emit("subscribed", {
                        topic: topic,
                        socket_id: socket_id
                    });
                }
            })
            io.locals.active_topic[topic].push(socket_id);
        }
    }
};

module.exports.unsubscribeFromTopic = (topic, socket_id) => {
    const io = require("./server").io;
    const index = io.locals.connected_clients.indexOf(socket_id);
    io.emit("unsubscribed", {
        topic: topic,
        socket_id: socket_id
    });
    io.locals.active_topic[topic].splice(index, 1);
};

module.exports.sendToTopic = (message, topic, sender_id) => {
    const io = require("./server").io;

    if (topic in io.locals.active_topic) {
        io.locals.active_topic[topic].forEach(function (socket_id) {
            let socket = io.sockets.sockets.get(socket_id);
            if (socket) {
                socket.emit("data-received", {
                    "topic": topic,
                    "message": message,
                    "socket_id": sender_id
                });
            }
        })
    }
}