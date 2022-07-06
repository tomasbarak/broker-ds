const connect_to_broker = (url) => {
    return io(`ws://${url}`);
}

const socket = connect_to_broker("localhost:5050");
const msg = document.getElementById("msg");
const topic = document.getElementById("topic");
const btn = document.getElementById("connect-button");

const topicToSubscribe = document.getElementById("topic-to-subscribe");
const btnSubscribe = document.getElementById("subscribe");

function subscribe(event) {
    event.preventDefault();
    socket.emit("subscribe", {
        topic: topicToSubscribe.value,
        socket_id: socket.id
    });
}

function sendMsg(event) {
    const dataMsg = {
        msg: msg.value,
        topic: topic.value
    };

    event.preventDefault();
    socket.emit("data", dataMsg);
}

socket.on("connect", () => {
    
});

socket.on("data-received", function (data) {
    console.log(data);
    socket.emit("ack", {
        socket_id: socket.id,
        topic: data.topic,
        msg: data.message,
    });
})