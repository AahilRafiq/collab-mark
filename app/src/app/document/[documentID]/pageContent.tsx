"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
// Monaco Editor
import Editor from "@monaco-editor/react";

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

export default function PageContent({
  userID,
  documentID,
  username,
  token,
}: Props) {
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
        crdt.initDocument(res.res);
      } else {
        displayErrorToast(toast, res.message);
        router.push("/home/0");
      }
    }
    fetchDocument();
  }, [documentID, crdt, router, toast]);

  // SOCKET.IO
  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      setIsSocketConnected(true);
      handleConnection(socket, userID, documentID);
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
    socket.on(msgType.receiveInfo, (incomingUserID, incomingUsername) => {
      displayNormalToast(
        toast,
        "User connected",
        `User ${incomingUsername} is in the room!`
      );
      setConnectedUsers((prevUsers) => {
        const isPresent = prevUsers.some(
          (user) => user.userID === incomingUserID
        );
        if (!isPresent) {
          return [...prevUsers, { userID: incomingUserID, username: incomingUsername }];
        }
        return prevUsers;
      });
    });
    socket.on(msgType.leaveRoom, (leavingUserID) => {
      setConnectedUsers((prevUsers) => {
        const userLeaving = prevUsers.find(
          (user) => user.userID === leavingUserID
        );
        if (userLeaving) {
          displayNormalToast(
            toast,
            "User disconnected",
            `User ${userLeaving.username} left the room!`
          );
        }

        return prevUsers.filter((user) => user.userID !== leavingUserID);
      });
    });

    socket.on(msgType.updateDoc, () => {
      getDocument(documentID).then((res) => {
        if (res.success) {
          setMarkdown(res.res);
          crdt.initDocument(res.res);
        } else {
          displayNormalToast(toast, "Error", res.message);
        }
      });
    });

    return () => {
      socket.off(msgType.sendInfo);
      socket.off(msgType.message);
      socket.off(msgType.receiveInfo);
      socket.off(msgType.leaveRoom);
      socket.off(msgType.updateDoc);
      socket.off("connect");
      if (socket.connected) {
        socket.disconnect();
        setIsSocketConnected(false);
      }
    };
  }, [socket, userID, documentID, username, crdt, toast]);

  // LOCAL CHANGES (handle Monaco Editor changes)
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined) return;

      const oldLength = markdown.length;
      const newLength = value.length;
      const minLen = Math.min(oldLength, newLength);

      // find first position that differs
      let diffPos = 0;
      while (diffPos < minLen && value[diffPos] === markdown[diffPos]) {
        diffPos++;
      }

      // if new text is longer => insertion
      // else => deletion
      if (newLength > oldLength) {
        const insertedText = value.slice(diffPos, diffPos + (newLength - oldLength));
        const op = crdt.insertStringLocal(insertedText, diffPos, UID);
        if (socket.connected) {
          socket.emit(msgType.message, JSON.stringify(op), documentID);
        }
      } else if (newLength < oldLength) {
        const deletedLength = oldLength - newLength;
        const op = crdt.deleteStringLocal(diffPos, deletedLength, UID);
        if (socket.connected) {
          socket.emit(msgType.message, JSON.stringify(op), documentID);
        }
      }

      setMarkdown(crdt.getDocument());
    },
    [crdt, documentID, markdown, socket, UID]
  );

  async function handleSave() {
    const res = await saveDocument(markdown, documentID);
    if (res.success) {
      displayNormalToast(toast, "Save successfully", res.message);
      socket.emit(msgType.updateDoc, documentID);
      crdt.initDocument(markdown);
    } else {
      displayNormalToast(toast, "Error", res.message);
    }
  }

  if (!isSocketConnected) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Please wait</h2>
        Connecting to server... this might take up to 75 seconds (due to cold start).
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant={mode === "single" ? "ghost" : "outline"} onClick={() => setMode("single")}>
            Single
          </Button>
          <Button variant={mode === "split" ? "ghost" : "outline"} onClick={() => setMode("split")}>
            Split
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <ConnectedUsersDropdown users={connectedUsers} />
          <Button onClick={handleSave} variant="outline">
            Save
          </Button>
          <Download markdown={markdown} />
          <ShareModal documentID={documentID} userID={userID} />
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
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={markdown}
                onChange={handleEditorChange}
                theme="vs-dark" // or "light", etc.
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
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={markdown}
                onChange={handleEditorChange}
                theme="vs-dark"
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