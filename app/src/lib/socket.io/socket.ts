import { io } from 'socket.io-client'

const url = process.env.NEXT_PUBLIC_WSS_URL || 'http://localhost:5000'

export const socket = io(url,{
    autoConnect: false
})