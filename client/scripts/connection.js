function connect_to_broker (url) {
    return io(`ws://${url}`);
}

function disconnect_from_broker () {
    connection.disconnect();
}