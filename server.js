const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors:{
        origin:'*',
    }
});

let connected_clients = [];

function handleData(data){
    console.log('Mensaje: ', data.msg);
    console.log('Tópico: ', data.topic);
}


function handleConnection(socket){
    socket.on("data", handleData);
    socket.on("disconnect", handleDisconnection);
    connected_clients.push(socket.id);
    console.log(connected_clients);

    function handleDisconnection(){
        console.log("Client disconnected: ", socket.id);
        const index = connected_clients.indexOf(socket.id);
        connected_clients.splice(index, 1);
        console.log("Connected clients: " ,connected_clients);
    }
}

io.on('connection', handleConnection);

server.listen(5050);



/*
    function 1(valor, funcionCallback){
        hacerAlgo()
        funcionCallback()
    }
*/