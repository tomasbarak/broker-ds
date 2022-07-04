const socket = io("ws://localhost:5050");
        const msg = document.getElementById("msg");
        const topic = document.getElementById("topic");
        const btn = document.getElementById("send");

        const topicToSubscribe = document.getElementById("topic-to-subscribe");
        const btnSubscribe = document.getElementById("subscribe");

        function subscribe(event){
            event.preventDefault();
            socket.emit("subscribe", {
                topic: topicToSubscribe.value,
                socket_id: socket.id
            });
        }

        function sendMsg(event){

            const dataMsg = {
                msg: msg.value,
                topic: topic.value
            };

            event.preventDefault();
            socket.emit("data", dataMsg);
        }

        socket.on("connect", () => {
            btn.addEventListener("click", sendMsg)
            btnSubscribe.addEventListener("click", subscribe)
        });

        socket.on("data-received", function(data){
            let element = document.createElement("div");
            let msg_text = document.createElement('a');
            let msg_sender_id = document.createElement('a');
            let msg_topic = document.createElement('a');
            let sussy_chatty = document.getElementById("sussy-chatty");

            msg_text.className = "msg-text";
            msg_sender_id.className = "msg-sender-id";
            msg_topic.className = "msg-topic";
            element.className = "msg-container";

            msg_text.innerText = data.message;
            msg_sender_id.innerText = data.socket_id;
            msg_topic.innerText = data.topic;

            element.appendChild(msg_text);
            element.appendChild(msg_sender_id);
            element.appendChild(msg_topic);

            sussy_chatty.appendChild(element);
            console.log(data);
            socket.emit("ack", {
                socket_id: socket.id,
                topic: data.topic,
                msg: data.message,
            });
        })