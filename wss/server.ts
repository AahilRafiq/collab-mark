import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const port = 5000;

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming messages
    socket.on('message', (msg) => {
        // Broadcast the message to all clients except the sender
        socket.broadcast.emit('message', msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
