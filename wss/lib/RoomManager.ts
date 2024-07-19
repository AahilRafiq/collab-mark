import type { UserInfo } from "../types/userInfo"

export class RoomInfoManager {
    private static instance: RoomInfoManager;
    private rooms: Map<string, UserInfo[]>;

    private constructor() {
        this.rooms = new Map<string, UserInfo[]>();
    }

    public static getInstance(): RoomInfoManager {
        if (!RoomInfoManager.instance) {
            RoomInfoManager.instance = new RoomInfoManager();
        }
        return RoomInfoManager.instance;
    }

    public joinRoomList(userID: number, username: string, roomID: string): void {
        let room = this.rooms.get(roomID);
        if (!room) room = new Array<UserInfo>();
        room.push({ id: userID, name: username });
        this.rooms.set(roomID, room);
    }

    public leaveRoomList(userID: number, roomID: string): void {
        let room = this.rooms.get(roomID);
        if (room) {
            room = room.filter(userinfo => userinfo.id != userID);
            this.rooms.set(roomID, room);
        }
    }

    public getAllUsers(roomID: string): UserInfo[] | undefined {
        return this.rooms.get(roomID);
    }
}