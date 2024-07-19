import { Button } from "@/components/ui/button"
import { HomeIcon, UploadIcon } from "lucide-react"
import Document from "@/components/files/Document"
import Folder from "@/components/files/Folder"
import Link from "next/link"
import NewFolderModal from "@/components/files/NewFolderModal"
import { getDocuments } from "@/lib/helpers/getDocuments"
import { getFolders } from "@/lib/helpers/getFolders"
import NewDocumentModal from "@/components/files/NewDocumentModal"

interface IProps {
    params: {
        folderID: string
    }
}

export default async function ({params}:IProps) {

    const documents = await getDocuments(params.folderID)
    const folders = await getFolders(params.folderID)

    return (
        <div className="flex flex-col h-screen">
            
            <header className=" p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">

                    {/* Menu Buttons */}
                    <Link href={`/home/0`}>
                        <Button variant="ghost" size="icon">
                            <HomeIcon className="w-6 h-6" />
                            <span className="sr-only">Go Home</span>
                        </Button>
                    </Link>
                    <NewFolderModal parentFolderID={params.folderID}/>
                    <NewDocumentModal parentFolderID={params.folderID}/>
                    {/* <UploadFileModal folderID={params.folderID} groupID={params.groupID}/> */}

                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <span className="sr-only">Filter</span>
                    </Button>
                </div>
            </header>

            {/* Files/Folders */}

            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">

                    {documents.map(document => {
                        return <Document key={document.id} fileName={document.name} fileID={document.id}/>
                    })}

                    {folders.map(folder => {
                        return <Folder key={folder.id} folderName={folder.name} folderID={folder.id}/>
                    })}

                </div>
            </div>
        </div>
    )
}
