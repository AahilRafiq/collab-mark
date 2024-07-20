import { createServer } from "http";
import { Server } from "socket.io";
import { msgType } from "./types/messageTypeEnum";
import jwt from 'jsonwebtoken'

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: process.env.APP_URL,
    },
});

const port = process.env.PORT || 5000;

io.use((socket, next) => {
    let token = socket.handshake.query?.token;
    if (!token || !process.env.JWT_AUTH_SECRET) {
        return next(new Error("Authentication error"));
    }

    if(Array.isArray(token)){
        token = token[0];
    }

    try {
        const data = jwt.verify(token, process.env.JWT_AUTH_SECRET);
        socket.data = data;
        next();
    } catch (err) {
        console.log(err);
        return next(new Error("Authentication error"));
    }
})

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on(msgType.message, (msg , roomID) => {
        socket.broadcast.to(roomID).emit(msgType.message, msg);
    });

    socket.on(msgType.joinRoom, (userID:string , roomID:string) => {
        socket.join(roomID)
        socket.data.roomID = roomID;
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
        socket.broadcast.to(socket.data.roomID).emit(msgType.leaveRoom, socket.data.id);
        console.log("A user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
