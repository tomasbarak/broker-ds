const connect_btn = document.querySelector("#connect-button");
const active_topic_label = document.querySelector("#active-topic-label");
const broker_url_input = document.querySelector("#url-input");
const add_topic_btn = document.querySelector("#add-topic-btn");
const send_msg_btn = document.querySelector("#send-btn");
let connection = null;
let subscribed_topics = ["general"];
const active_topic = "general";

const connect_to_broker = (url) => {
    return io(`ws://${url}`);
}

send_msg_btn.addEventListener("click", send_msg_event);

add_topic_btn.addEventListener("click", () => {
    create_input_notification((result, cancelled) => {
        if (!cancelled){
            connection.emit("subscribe", {
                topic: result,
                socket_id: connection.id
            });
            add_topic_to_list(result);
        }
    });
})

connect_btn.addEventListener("click", (e) => {
    e.preventDefault();
    const url = broker_url_input.value;
    connection = connect_to_broker(url);

    set_connection_section_active(false);
    set_loading_section_active(true);

    connection.on("connect", () => {
        setTimeout(() => {
            set_connection_section_active(false);
            set_loading_section_active(false);
            set_main_section_active(true);
        }, 1000);
    });

    connection.on("data-received", function (data) {
        console.log(data);
        connection.emit("ack", {
            socket_id: connection.id,
            topic: data.topic,
            msg: data.message,
        });
    })
})

function set_connection_section_active(active) {
    const connection_section = document.querySelector("#connection-section");
    if (active) {
        connection_section.classList.remove("active");
        connection_section.classList.add("active");
    } else {
        connection_section.classList.remove("active");
    }
}

function set_loading_section_active(active) {
    const loading_section = document.querySelector("#loading-section");
    if (active) {
        loading_section.classList.remove("active");
        loading_section.classList.add("active");
    } else {
        loading_section.classList.remove("active");
    }
}

function set_main_section_active(active) {
    const app_section = document.querySelector("#main-section");
    if (active) {
        app_section.classList.remove("active");
        app_section.classList.add("active");
    } else {
        app_section.classList.remove("active");
    }
}

function set_active_topic_item(topic_name) {
    const topic_list = document.querySelector("#topic-list");
    const active_topic_title = document.querySelector("#active-topic-label");
    const topic_items = topic_list.querySelectorAll(".list-group-item");
    topic_items.forEach(item => {
        console.log(item.innerHTML);
        if (item.innerHTML === topic_name) {
            item.classList.add("active-topic");
            active_topic_title.innerHTML = topic_name;
        } else {
            item.classList.remove("active-topic");
        }
    })
}

const topic_selection_event = (event) => {
    const topic_name = event.target.innerHTML;
    set_active_topic_item(topic_name);
}

function add_topic_to_list(topic_name) {
    const topic_list = document.querySelector("#topic-list");
    const topic_item = document.createElement("a");
    topic_item.classList.add("list-group-item");
    topic_item.innerHTML = topic_name;
    topic_item.addEventListener("click", topic_selection_event);
    topic_list.appendChild(topic_item);
}

function select_topic(topic_name) {
    set_active_topic_item(topic_name);
    active_topic_label.innerHTML = topic_name;
}

function send_msg_event(event) {
    const msg = document.getElementById("message-input").value;
    const dataMsg = {
        msg: msg,
        topic: active_topic
    };
    console.log(dataMsg);
    connection.emit("data", dataMsg);
}

window.onload = () => {
    set_connection_section_active(true);
    set_loading_section_active(false);
    set_main_section_active(false);
    add_topic_to_list("general");
    select_topic("general");
}