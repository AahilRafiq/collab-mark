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
import { FilePlus2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { displayToast } from "@/lib/helpers/actionResHelpers"
import { createNewDocument } from "@/actions/files/newDocument"
import { useRouter } from "next/navigation"
import { FullscreenSpinner } from "../ui/loading"

interface IProps {
    parentFolderID: string
}

export default function ({parentFolderID}:IProps) {

    const {toast} = useToast()
    const router = useRouter()
    const [documentName, setDocumentName] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleCreateDocument(){
        const pfid = parseInt(parentFolderID) === 0 ? null : parseInt(parentFolderID)
        setLoading(true)
        const res = await createNewDocument(documentName , pfid)
        setLoading(false)
        if(res.success){
            router.refresh()
        }else{
            displayToast(toast, res.message)
        }
    }

    if(loading) {
        return <FullscreenSpinner />
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>

                <Button variant="ghost" size="icon">
                    <FilePlus2 className="w-6 h-6" />
                    <span className="sr-only">New Folder</span>
                </Button>

            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enter Document Name</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Input onChange={e=>setDocumentName(e.target.value)} placeholder="Document Name" />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreateDocument}>Create</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}