const actions = require("./actions")
const handlers = require("./handlers")
const log = require("./log")
module.exports.connection = (socket) => {
    const io = require("./server").io;

    socket.on("data", handlers.data);
    socket.on("subscribe", handlers.subscription);
    socket.on("disconnect", handlers.disconnection.bind(null, socket));
    socket.on("ack", log.ack);
    io.locals.connected_clients.push(socket.id);

    actions.subscribeToTopic("general", socket.id);
    actions.subscribeToTopic("ack", socket.id);
};

module.exports.disconnection = (socket) => {
    const io = require("./server").io;

    const index = io.locals.connected_clients.indexOf(socket.id);
    io.locals.connected_clients.splice(index, 1);

    const keys = Object.keys(io.locals.active_topic);

    keys.forEach(function (topic) {
        actions.unsubscribeFromTopic(topic, socket.id);
    })
}

module.exports.data = (data) => {
    const io = require("./server").io;

    let topic = data.topic;
    let message = data.msg;
    let sender_id = data.socket_id;

    if (data.topic === null || data.topic === undefined || data.topic === "") {
        topic = "general";
    }

    if (data.msg === null || data.msg === undefined) {
        message = "";
    }
    if (data.socket_id !== null || data.socket_id !== undefined) {
        actions.sendToTopic(message, topic, sender_id);
    }
};

module.exports.subscription = (data) => {
    actions.subscribeToTopic(data.topic, data.socket_id)
}