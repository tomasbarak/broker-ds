const events = {
    "connect_try": (e) => {
        e.preventDefault();
        const url = elements.inputs.url.value;
        connection = connect_to_broker(url);

        ui.set_connection_section_active(false);
        ui.set_loading_active(true);

        connection.on("connect", events.connection_success);
        connection.on("connect_error", events.connection_error);
        connection.on("connect_failure", events.connection_error);
        connection.on("connect_failed", events.connection_error);
        connection.on("disconnect", events.disconnect);
        connection.on("data-received", events.data_received);
        connection.on("subscribed", events.new_subscription_received);
        connection.on("unsubscribed", events.new_unsubscription_received);
    },
    "connection_success": () => {
        connection_status = true;
        elements.labels.connection_status.innerHTML = "Connected";
        elements.labels.connection_status.classList.remove("offline");
        elements.labels.connection_status.classList.remove("online");
        elements.labels.connection_status.classList.add("online");

        setTimeout(() => {
            ui.set_connection_section_active(false);
            ui.set_loading_active(false);
            ui.set_main_active(true);
        }, 1000);
    },
    "connection_error": () => {
        connection.disconnect();

        connection_status = false;
        elements.labels.connection_status.innerHTML = "Offline";
        elements.labels.connection_status.classList.remove("offline");
        elements.labels.connection_status.classList.remove("online");
        elements.labels.connection_status.classList.add("offline");


        ui.set_connection_section_active(true);
        ui.set_loading_active(false);
        ui.set_main_active(false);
    },
    "disconnect": () => {
        connection_status = false;
        elements.labels.connection_status.innerHTML = "Disconnected";
        elements.labels.connection_status.classList.remove("online");
        elements.labels.connection_status.classList.remove("offline");
        elements.labels.connection_status.classList.add("offline");
    },
    "data_received": (data) => {
        if (data.topic === active_topic) {
            ui.add_message_to_chat(data);
            if (data.socket_id !== connection.id) {
                const audio = new Audio('discord-notification.mp3');
                audio.play();
            }
            elements.conversation.scrollTo(0, elements.conversation.scrollHeight);
        }
        connection.emit("ack", {
            socket_id: connection.id,
            topic: data.topic,
            msg: data.message,
        });
    },
    "new_subscription_received": (data) => {
        console.log(data);
        events.on_join_notification(data);
    },
    new_unsubscription_received: (data) => {
        console.log("Unsubscribe", data);
        events.on_leave_notification(data);
    },
    "send_msg": () => {
        const msg = elements.inputs.message.value;
        if (msg.length > 0 && connection_status) {
            connection.emit("data-sent", {
                topic: active_topic,
                message: msg,
                socket_id: connection.id
            });
            const dataMsg = {
                msg: msg,
                topic: active_topic,
                socket_id: connection.id
            };
            console.log(dataMsg);
            connection.emit("data", dataMsg);
            elements.inputs.message.value = "";
        }
    },
    "add_topic": () => {
        create_input_notification((result, cancelled) => {
            if (!cancelled) {
                if(!subscribed_topics.includes(result)) {
                    connection.emit("subscribe", {
                        topic: result,
                        socket_id: connection.id
                    });
                    subscribed_topics.push(result);
                    ui.add_topic_to_list(result);
                }
            }
        });
    },
    "topic_selection": (event) => {
        const topic_name = event.target.innerHTML;
        if (topic_name !== active_topic) {
            ui.set_active_topic_item(topic_name);
            ui.clear_conversation();
        }
    },
    "enter_event": (event, callback) => {
        if (event.keyCode === 13) {
            console.log("enter");
            callback();
        }
    },
    "on_join_notification": (data) => {
        if (data.socket_id !== connection.id) {
            console.log("on_join", data);
            if(data.topic === active_topic) {
                ui.add_join_notification(data);
            }
        }
    },
    "on_leave_notification": (data) => {
        if (data.socket_id !== connection.id) {
            console.log("on_leave", data);
            if(data.topic === active_topic) {
                ui.add_leave_notification(data);
            }
        }
    }
}