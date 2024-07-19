import type { Socket } from "socket.io-client";
import { msgType } from "@/types/messageTypeEnum";

export function handleConnection(socket: Socket , documentID: number) {    
    socket.emit(msgType.joinRoom,documentID)
}

export function handleSendInfo(socket: Socket , userID: number , username: string , roomID: number) {
    socket.emit(msgType.takeInfo , userID , username , roomID)
}