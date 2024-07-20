"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ConnectedUsersDropdown from "@/components/editor/ConnectedUsersDropdown";
import ShareModal from "@/components/editor/ShareModal";
import Download from "@/components/editor/Download";
import { CRDT, CRDTOperation, CRDTOperationType } from "@/lib/crdt/crdt";
import { useSocket } from "@/hooks/useSocket";
import Markdown from "react-markdown";
import { msgType } from "@/types/messageTypeEnum";
import { handleSendInfo, handleConnection } from "@/lib/socket.io/helpers";
import { useToast } from "@/components/ui/use-toast";
import { displayNormalToast } from "@/lib/helpers/actionResHelpers";
import { getDocument } from "@/actions/document/getDocument";
import { saveDocument } from "@/actions/document/saveDocument";
import { useRouter } from "next/navigation";
import { displayErrorToast } from "@/lib/helpers/apiRequestHelpers";
interface Props {
    userID: number;
    username: string;
    documentID: number;
    token: string;
}

interface ConnectedUser {
    userID: number;
    username: string;
}

export default function PageContent({ userID, documentID, username , token }: Props) {
    const { toast } = useToast();
    const [mode, setMode] = useState("single");
    const [markdown, setMarkdown] = useState("");
    const [crdt] = useState(new CRDT(userID));
    const [UID] = useState(Math.floor(Math.random() * 100000000));
    const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
    const socket = useSocket(token);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const router = useRouter();

    // FETCH DOCUMENT
    useEffect(() => {
        async function fetchDocument() {
            const res = await getDocument(documentID);
            if (res.success) {
                setMarkdown(res.res);
                crdt.initDocument(res.res)
            } else {
                displayErrorToast(toast , res.message);
                router.push("/home/0");
            }
        }

        fetchDocument();
    }, []);

    // SOCKET.IO
    useEffect(() => {
        if(!socket.connected) socket.connect();
        socket.on("connect", () =>{
            setIsSocketConnected(true);
            handleConnection(socket, userID, documentID)
    });
        socket.on(msgType.sendInfo, () =>
            handleSendInfo(socket, userID, username, documentID)
        );
        socket.on(msgType.message, (msg) => {
            const operation: CRDTOperation = JSON.parse(msg);

            if (operation.operation === CRDTOperationType.insert) {
                crdt.insertStringRemote(operation);
            } else {
                crdt.deleteStringRemote(operation);
            }

            setMarkdown(crdt.getDocument());
        });
        socket.on(msgType.receiveInfo, (userID, username) => {
            displayNormalToast(
                toast,
                "User connected",
                `User ${username} is in the room!`
            );
            setConnectedUsers((prevUsers) => {
                const isPresent = prevUsers.some(
                    (user) => user.userID === userID
                );
                if (!isPresent) {
                    return [...prevUsers, { userID, username }];
                }
                return prevUsers;
            });
        });
        socket.on(msgType.leaveRoom, (userID) => {
            setConnectedUsers((prevUsers) => {
                const userLeaving = prevUsers.find(
                    (user) => user.userID === userID
                );
                if (userLeaving) {
                    displayNormalToast(
                        toast,
                        "User disconnected",
                        `User ${userLeaving.username} left the room!`
                    );
                }

                const newList = prevUsers.filter(
                    (user) => user.userID !== userID
                );
                return newList;
            });
        });

        socket.on(msgType.updateDoc, () => {
            getDocument(documentID).then((res) => {
                if (res.success) {
                    setMarkdown(res.res);
                    crdt.initDocument(res.res)
                } else {
                    displayNormalToast(toast, "Error", res.message);
                }
            });
        })

        return () => {
            socket.off(msgType.sendInfo);
            socket.off(msgType.message);
            socket.off(msgType.receiveInfo);
            socket.off(msgType.leaveRoom);
            socket.off(msgType.updateDoc);
            socket.off("connect");
            if(socket.connected) {socket.disconnect()
            setIsSocketConnected(false)
            }
        };
    }, []);

    // LOCAL CHANGES
    function handleMarkdownChange(
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        const newText = event.target.value;
        const oldLength = markdown.length;
        const newLength = newText.length;
        const selectionStart = event.target.selectionStart;

        if (newLength > oldLength) {
            const insertedLength = newLength - oldLength;
            const insertedText = newText.slice(
                selectionStart - insertedLength,
                selectionStart
            );
            const startIndex = selectionStart - insertedLength;
            const op = crdt.insertStringLocal(insertedText, startIndex, UID);

            if (socket.connected)
                socket.emit(msgType.message, JSON.stringify(op), documentID);
        } else {
            const deletedLength = oldLength - newLength;
            const op = crdt.deleteStringLocal(
                selectionStart,
                deletedLength,
                UID
            );

            if (socket.connected)
                socket.emit(msgType.message, JSON.stringify(op), documentID);
        }

        setMarkdown(crdt.getDocument());
    }

    async function handleSave() {
        const res = await saveDocument(markdown , documentID);
        if (res.success) {
            displayNormalToast(toast,'Save successfully', res.message)
            socket.emit(msgType.updateDoc, documentID);
            crdt.initDocument(markdown)
        } else {
            displayNormalToast(toast,'Error', res.message)
        }
    }

    if(!isSocketConnected) return <div className="p-4">Connecting To server...</div>
    return (
        <div className="flex flex-col h-screen">
            <header className="bg-background border-b px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant={mode === "single" ? "ghost" : "outline"}
                        onClick={() => setMode("single")}
                    >
                        Single
                    </Button>
                    <Button
                        variant={mode === "split" ? "ghost" : "outline"}
                        onClick={() => setMode("split")}
                    >
                        Split
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    {/* CONNECTED USERS LIST */}
                    <ConnectedUsersDropdown users={connectedUsers} />

                    {/* Save and download */}
                    <Button onClick={handleSave} variant="outline">Save</Button>
                    <Download markdown={markdown} />

                    {/* SHARE MODAL */}
                    <ShareModal documentID={documentID} userID={userID}/>
                </div>
            </header>
            <div className="flex-1 flex">
                {mode === "single" ? (
                    <Tabs defaultValue="editor" className="flex-1">
                        <TabsList className="border-b ml-4 mt-4">
                            <TabsTrigger value="editor">Editor</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="editor" className="p-4 px-4 h-full">
                            <Textarea
                                value={markdown}
                                onChange={handleMarkdownChange}
                                className="w-full h-full resize-none"
                                placeholder="Write your markdown here..."
                            />
                        </TabsContent>
                        <TabsContent value="preview" className="p-4">
                            <div className="prose dark:prose-invert">
                                <Markdown>{markdown}</Markdown>
                            </div>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="grid grid-cols-2 flex-1">
                        <div className="border-r p-4">
                            <Textarea
                                value={markdown}
                                onChange={handleMarkdownChange}
                                className="w-full h-full resize-none"
                                placeholder="Write your markdown here..."
                            />
                        </div>
                        <div className="p-4">
                            <div className="prose dark:prose-invert h-full overflow-auto">
                                <Markdown>{markdown}</Markdown>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
