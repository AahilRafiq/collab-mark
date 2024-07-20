import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getDocPublicStatus } from "@/actions/document/getPublicStatus";
import { updatePublicStatus } from "@/actions/document/updatePublicStatus";
import { useToast } from "../ui/use-toast";
import { displayErrorToast } from "@/lib/helpers/apiRequestHelpers";
import { displayNormalToast } from "@/lib/helpers/actionResHelpers";

export default function ({documentID , userID}: {documentID: number , userID: number}) {
    const [showModal, setShowModal] = useState(false);
    const [isPublic, setIsPublic] = useState<boolean>();
    const [ownerID, setOwnerID] = useState<number>(-1);
    const {toast} = useToast();

    // FETCH PUBLIC STATUS
    useEffect(() => {
        async function fetchPublicStatus() {
            const res = await getDocPublicStatus(documentID);
            if (res.success) {
                setIsPublic(res.res.isPublic);
                setOwnerID(res.res.ownerID);
            }
        }

        fetchPublicStatus();
    }, []);

    async function handleStatusChange() {
        const res = await updatePublicStatus(documentID, !isPublic);
        if (res.success) {
            setIsPublic(!isPublic);
            displayNormalToast(toast, 'Success', 'document public access updated');
        } else {
            displayErrorToast(toast, res.message);
        }
    }

    function copyCurrentURL() {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                displayNormalToast(toast, 'Success', 'URL copied to clipboard');
            })
            .catch((err) => {
                displayErrorToast(toast, 'Failed to copy URL');
            });
    }

    if(userID != ownerID) return <Button disabled>Share</Button>;

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
                                onCheckedChange={handleStatusChange}
                            />
                        </div>
                        {isPublic ? (
                            <div className="text-muted-foreground">
                                Anyone with the link can view this document.
                            </div>
                        ) : (
                            <div className="text-muted-foreground">
                                Only you can view this document.
                            </div>
                        )}
                        <Button onClick={copyCurrentURL}>Copy Document URL</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}