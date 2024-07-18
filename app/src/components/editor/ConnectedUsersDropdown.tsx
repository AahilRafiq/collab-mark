import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
    users: string[];
}

export default function () {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
                <Avatar className="w-6 h-6 border">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span>Connected Users</span>
                <ChevronDownIcon className="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem>
                <Avatar className="w-6 h-6 border">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span>John Doe</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Avatar className="w-6 h-6 border">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                <span>Jane Appleseed</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>;
}
