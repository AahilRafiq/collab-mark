import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/lib/helpers/getUserData";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import UserProfileModal from "./navbar/UserProfileModal";
import { MenuIcon } from "lucide-react";

export default async function () {
    const userData = await getUserData();

    return (
        <header className="px-4 my-2 lg:px-6 h-14 flex items-center justify-between">
            <Link
                href="/"
                className="flex items-center justify-center"
                prefetch={false}
            >
                <PencilIcon className="h-6 w-6" />
                <span className="dark: text-white font-bold text-xl p-2">
                    CollabMark
                </span>
            </Link>
            <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
                <Link href="/home/0">
                    <Button variant="ghost" color="black">
                        Home
                    </Button>
                </Link>
                <Link href="/about">
                    <Button variant="ghost">About</Button>
                </Link>
                {userData && <UserProfileModal user={userData} />}
                {!userData && (
                    <Link href="/auth/signin">
                        <Button>Login</Button>
                    </Link>
                )}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="md:hidden" size="icon" variant="outline">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="grid gap-6 p-6">
                        <Link href="/home">
                            <Button variant="ghost" color="black">
                                Home
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button variant="ghost">About</Button>
                        </Link>
                        <Link href="/groups">
                            <Button variant="ghost">Groups</Button>
                        </Link>
                        <Link href="/auth/signin">
                            <Button>Sign In</Button>
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
