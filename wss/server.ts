import { createServer } from "http";
import { Server } from "socket.io";
import { msgType } from "./types/messageTypeEnum";

interface UserRoomInfo {
    userID: string;
    roomID: string;
}

const socketRoomMap = new Map<string, UserRoomInfo>();
const server = createServer();
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
        socket.broadcast.to(roomID).emit(msgType.message, msg);
    });

    socket.on(msgType.joinRoom, (userID:string , roomID:string) => {
        socket.join(roomID)
        socketRoomMap.set(socket.id, { userID , roomID });
        socket.to(roomID).emit(msgType.sendInfo);
        socket.emit(msgType.sendInfo)
    });

    socket.on(msgType.takeInfo , (userID:string , username:string , roomID: string) => {
        socket.broadcast.to(roomID).emit(msgType.receiveInfo,userID , username)
    })

    socket.on(msgType.updateDoc, (roomID: string) => {
        socket.broadcast.to(roomID).emit(msgType.updateDoc);
    })

    socket.on("disconnect", () => {
        const {userID , roomID} = socketRoomMap.get(socket.id)!;
        socket.broadcast.to(roomID).emit(msgType.leaveRoom, userID);
        console.log("A user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
