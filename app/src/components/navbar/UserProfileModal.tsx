'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react";
import { logout } from "@/actions/auth/logout";
import { useRouter } from "next/navigation";

interface IUser {
    name: string;
    email: string;
}

export default function ({user}: {user: IUser}) {

    const router = useRouter();

    async function hanldeLogout() {
        await logout();
        router.refresh()
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className="rounded-full"><UserCircle className="h-6 w-6"/></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{user.name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex gap-2">
                            <UserCircle className="w-6 h-6" />
                            <span>{user.email}</span>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction onClick={hanldeLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

