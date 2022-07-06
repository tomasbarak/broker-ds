const connect_btn = document.querySelector("#connect-button");
const broker_url_input = document.querySelector("#url-input");
let connection = null;
let subscribed_topics = [];

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