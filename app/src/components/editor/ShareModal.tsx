import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function () {
    const [showModal, setShowModal] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    return (
        <>
            <Button onClick={() => setShowModal(true)}>Share</Button>
            <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
                <DialogTrigger asChild />
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Share Document</DialogTitle>
                        <DialogDescription>
                            Control who can access this document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center justify-between">
                            <span>Public Access</span>
                            <Switch
                                id="public-access"
                                checked={isPublic}
                                onCheckedChange={() => setIsPublic(!isPublic)}
                            />
                        </div>
                        {isPublic ? (
                            <div className="text-muted-foreground">
                                Anyone with the link can view this document.
                            </div>
                        ) : (
                            <div className="text-muted-foreground">
                                Only people you invite can view this document.
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
