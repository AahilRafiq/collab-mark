import { createServer } from "http";
import { Server } from "socket.io";
// import { RoomInfoManager } from "./lib/RoomManager";
import { msgType } from "./types/messageTypeEnum";

const server = createServer();
// const roomManager = RoomInfoManager.getInstance();
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const port = 5000;

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on(msgType.message, (msg , roomID) => {
        // Broadcast to all execpt sender
        console.log('message came');
        socket.broadcast.to(roomID).emit(msgType.message, msg);
    });

    socket.on(msgType.joinRoom, (roomID:string) => {
        // roomManager.joinRoomList(userID, username, roomID);
        socket.join(roomID)
        socket.to(roomID).emit(msgType.sendInfo);
        socket.emit(msgType.sendInfo)
    });

    socket.on(msgType.takeInfo , (userID:string , username:string , roomID: string) => {
        socket.broadcast.to(roomID).emit(msgType.receiveInfo,userID , username)
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
