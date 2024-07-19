'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FolderPlusIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { displayToast } from "@/lib/helpers/actionResHelpers"
import { createNewFolder } from "@/actions/files/newFolder"
import { useRouter } from "next/navigation"

interface IProps {
    parentFolderID: string
}

export default function ({parentFolderID}:IProps) {

    const {toast} = useToast()
    const router = useRouter()
    const [folderName, setFolderName] = useState("")

    async function handleCreateFolder(){
        const pfid = parseInt(parentFolderID) === 0 ? null : parseInt(parentFolderID)
        const res = await createNewFolder(folderName , pfid)
        if(res.success){
            router.refresh()
        }else{
            displayToast(toast, res.message)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>

                <Button variant="ghost" size="icon">
                    <FolderPlusIcon className="w-6 h-6" />
                    <span className="sr-only">New Folder</span>
                </Button>

            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enter Folder Name</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Input onChange={e=>setFolderName(e.target.value)} placeholder="Folder Name" />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreateFolder}>Create</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}