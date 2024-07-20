import { io } from "socket.io-client";
import { useState } from "react";

const url = process.env.NEXT_PUBLIC_WSS_URL || "http://localhost:5000";

export function useSocket(token: string) {
    const [socket] = useState(io(url, { 
        query:{token},
        autoConnect: false
     }));

    return socket;
}
