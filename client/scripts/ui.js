const elements = {
    "conversation": document.querySelector("#conversation"),
    "topic_list": document.querySelector("#topic-list"),
    buttons: {
        "connect": document.querySelector("#connect-button"),
        "add_topic": document.querySelector("#add-topic-btn"),
        "send_msg": document.querySelector("#send-btn"),
    },
    inputs: {
        "url": document.querySelector("#url-input"),
        "message": document.querySelector("#message-input"),
    },
    labels: {
        "active_topic": document.querySelector("#active-topic-label"),
        "connection_status": document.querySelector("#status-label"),
    },
    sections: {
        "connection": document.querySelector("#connection-section"),
        "loading": document.querySelector("#loading-section"),
        "main": document.querySelector("#main-section"),
    }
}


const ui = {
    "clear_conversation": () => {
        elements.conversation.innerHTML = "";
    },
    "create_message_element": (message, sender_id) => {
        const isMine = sender_id === connection.id;
        const msg_container = document.createElement("div");
        const msg_div = document.createElement("div");
        const msg_text = document.createElement("p");
        const msg_sender = isMine ? null : document.createElement("a");

        isMine ? msg_container.classList.add("msg-container-mine") : msg_container.classList.add("msg-container-other");

        msg_div.classList.add("msg-div");
        msg_text.classList.add("msg-text");
        isMine ? null : msg_sender.classList.add("msg-sender");

        msg_text.innerHTML = message;
        isMine ? null : msg_sender.innerHTML = sender_id;

        msg_container.appendChild(msg_div);
        isMine ? null : msg_div.appendChild(msg_sender);
        msg_div.appendChild(msg_text);

        return msg_container;
    },
    "create_join_message": (sender_id) => {
        const notif_container = document.createElement("div");
        const notif_text_id = document.createElement("font");
        const notif_text = document.createElement("p");

        notif_container.classList.add("join-msg-container");
        notif_text_id.classList.add("join-msg-id");
        notif_text.classList.add("join-msg-text");

        notif_text_id.innerHTML = sender_id;
        notif_text.appendChild(notif_text_id);
        notif_text.innerHTML += `has joined the chat`;

        notif_container.appendChild(notif_text);
        console.log(notif_container);
        return notif_container;
    },
    "create_topic_list_element": (topic_name) => {
        const topic_item = document.createElement("a");

        topic_item.classList.add("list-group-item");
        topic_item.innerHTML = topic_name;
        topic_item.addEventListener("click", events.topic_selection);
        
        return topic_item;
    },
    "add_message_to_chat": (data) => {
        const msg_container = ui.create_message_element(data.message, data.socket_id);
        elements.conversation.appendChild(msg_container);
    },
    "add_join_notification": (data) => {
        const msg_container = ui.create_join_message(data.socket_id);
        console.log(msg_container);
        elements.conversation.appendChild(msg_container);
    },
    "set_connection_section_active": (active) => {
        if (active) {
            elements.sections.connection.classList.remove("active");
            elements.sections.connection.classList.add("active");
        } else {
            elements.sections.connection.classList.remove("active");
        }
    },
    "set_loading_active": (active) => {
        if (active) {
            elements.sections.loading.classList.remove("active");
            elements.sections.loading.classList.add("active");
        } else {
            elements.sections.loading.classList.remove("active");
        }
    },
    "set_main_active": (active) => {
        if (active) {
            elements.sections.main.classList.remove("active");
            elements.sections.main.classList.add("active");
        } else {
            elements.sections.main.classList.remove("active");
        }
    },
    "set_active_topic_item": (topic_name) => {
        const topic_items = elements.topic_list.querySelectorAll(".list-group-item");
        topic_items.forEach(item => {
            if (item.innerHTML === topic_name) {
                item.classList.add("active-topic");
                elements.labels.active_topic.innerHTML = topic_name;
                active_topic = topic_name;
            } else {
                item.classList.remove("active-topic");
            }
        })
    },
    "add_topic_to_list": (topic_name) => {
        const topic_item = ui.create_topic_list_element(topic_name);
        elements.topic_list.appendChild(topic_item);
    },
    "select_topic": (topic_name) => {
        ui.set_active_topic_item(topic_name);
        elements.labels.active_topic.innerHTML = topic_name;
    }
}