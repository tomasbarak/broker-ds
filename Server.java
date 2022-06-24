import java.io.*;
import java.net.*;

public class Server {
    private ServerSocket server_socket;
    private Socket socket;
    private PrintStream print_stream;
    private BufferedReader buffered_reader;

    public Server(int port) throws Exception {
        // Create a server socket
        this.server_socket = new ServerSocket(port);

        // Wait for a client to connect
        this.socket = this.server_socket.accept();

        // Create a print stream to send data to the client
        this.print_stream = new PrintStream(this.socket.getOutputStream());

        // Create a buffered reader to read data from the client
        this.buffered_reader = new BufferedReader(new InputStreamReader(this.socket.getInputStream()));
    }

    //Method to start the server
    public void start() {
        System.out.println("Server started");
        while(true){

        }
    }
}