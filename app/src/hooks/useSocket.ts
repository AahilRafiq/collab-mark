import { io } from "socket.io-client";
import { useState } from "react";

const url = "http://localhost:5000";

export function useSocket() {
    const [socket] = useState(io(url, { autoConnect: false }));

    return socket;
}
