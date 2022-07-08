let connection = null;
let subscribed_topics = ["general"];
let active_topic = "general";
let connection_status = false;

elements.buttons.connect.addEventListener("click", events.connect_try);
elements.buttons.add_topic.addEventListener("click", events.add_topic);
elements.buttons.send_msg.addEventListener("click", events.send_msg);
elements.inputs.message.addEventListener("keyup", (event) => events.enter_event(event, events.send_msg));

window.onload = () => {
    ui.set_connection_section_active(true);
    ui.set_loading_active(false);
    ui.set_main_active(false);
    ui.add_topic_to_list("general");
    ui.select_topic("general");
}