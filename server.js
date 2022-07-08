const server = require('http').createServer();
const fs = require('fs');
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

let connected_clients = [];
let active_topic = {
    "general": [],
    "ack": []
}

function handleData(data) {
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
        sendToTopic(message, topic, sender_id);
    }
}

function handleSubscription(data) {
    console.log(data.topic, data.socket_id)
    subscribeToTopic(data.topic, data.socket_id)

    console.log(active_topic)
}

function ackLog(data) {
    //Append to file
    let new_data_arr = [];
    const timestamp = new Date().getTime();
    data.timestamp = timestamp;
    if (!fs.existsSync('./ack.log')) {
        new_data_arr.push(data);
        fs.writeFileSync('./ack.log', JSON.stringify(new_data_arr, null, 2));
    } else {
        let prev_data = fs.readFileSync('./ack.log');
        new_data_arr = JSON.parse(prev_data);
        new_data_arr.push(data);
        //fs.writeFileSync('./ack.log', JSON.stringify(new_data_arr, null, 2))
    }
}

function sendToTopic(message, topic, sender_id) {
    if (topic in active_topic) {
        active_topic[topic].forEach(function (socket_id) {
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

function handleConnection(socket) {
    socket.on("data", handleData);
    socket.on("subscribe", handleSubscription);
    socket.on("disconnect", handleDisconnection);
    socket.on("ack", ackLog);
    connected_clients.push(socket.id);
    console.log('Connected clients: ', connected_clients);

    subscribeToTopic("general", socket.id);
    subscribeToTopic("ack", socket.id);
    function handleDisconnection() {
        const index = connected_clients.indexOf(socket.id);
        connected_clients.splice(index, 1);

        const keys = Object.keys(active_topic);

        keys.forEach(function (topic) {
            unsubscribeFromTopic(topic, socket.id);
        })
    }
}

function subscribeToTopic(topic, socket_id) {
    if (!(topic in active_topic)) {
        let arr = [];
        arr.push(socket_id);
        active_topic[topic] = arr;
    } else {
        active_topic[topic].push(socket_id);
    }
}

function unsubscribeFromTopic(topic, socket_id) {
    const index = connected_clients.indexOf(socket_id);
    active_topic[topic].splice(index, 1);
}


io.on('connection', handleConnection);

server.listen(5050, function () {
    console.log('Server listening on port 5050');
});



/*
    function 1(valor, funcionCallback){
        hacerAlgo()
        funcionCallback()
    }
*/