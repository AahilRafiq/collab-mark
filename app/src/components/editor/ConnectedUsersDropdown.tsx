import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";

interface ConnectedUser {
    userID: number,
    username: string
}
interface Props {
    users: ConnectedUser[];
}

export default function ({ users }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <span>Connected Users</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {users.map((user) => {
                    return (
                        <DropdownMenuItem key={Math.floor(Math.random()*10000)}>
                            <span>{user.username}</span>
                        </DropdownMenuItem>
                    );
                })}

                {users.length === 0 && <span>None</span>}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
