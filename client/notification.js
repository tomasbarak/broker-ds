function create_input_notification(callback, options = {title: "New Topic", input_placeholder: "Topic name..."}){
    console.log
    const input_notification_background = document.createElement("div");
    input_notification_background.classList.add("input-notification-background");

    const input_notification = document.createElement("div");
    input_notification.classList.add("input-notification");

    const notification_title = document.createElement("a");
    notification_title.classList.add("notification-title");
    notification_title.innerHTML = options.title;

    const input_text = document.createElement("input");
    input_text.classList.add("notification-input-text");
    input_text.setAttribute("placeholder", options.input_placeholder);

    const input_submit = document.createElement("a");
    input_submit.classList.add("notification-input-submit");
    input_submit.innerHTML = "Ok";
    input_submit.addEventListener("click", () => {
        input_notification_background.remove();
        callback(input_text.value, false);
    });

    const close_button = document.createElement("a");
    close_button.classList.add("notification-close-button");
    close_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="rgb(114, 137, 218)" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"></path></svg>';

    close_button.addEventListener("click", () => {
        input_notification_background.remove();
        callback(null, true);
    });
    
    input_notification.appendChild(notification_title);
    input_notification.appendChild(input_text);
    input_notification.appendChild(input_submit);
    input_notification.appendChild(close_button);
    input_notification_background.appendChild(input_notification);
    document.body.appendChild(input_notification_background);
}