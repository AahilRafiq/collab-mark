import { generateKeyBetween, generateNKeysBetween } from "fractional-indexing";

export type CRDTOperation = {
    operation: CRDTOperationType;
    charOps: CharOperation[];
    userID: number;
};

export type CharOperation = {
    value?: string;
    userID?: number;
    identifier: string;
};

export enum CRDTOperationType {
    insert = "INSERT",
    delete = "DELETE",
}

class Char {
    value: string;
    identifier: string;
    next: Char | null;
    prev: Char | null;
    userID: number;

    constructor(identifier: string, value: string, userID: number) {
        this.identifier = identifier;
        this.value = value;
        this.next = null;
        this.prev = null;
        this.userID = userID;
    }
}

export class CRDT {
    BOF: Char;

    constructor(userID: number) {
        this.BOF = new Char(generateKeyBetween(null, null), "BOF", userID);
    }

    insertStringLocal(
        value: string,
        index: number,
        userID: number
    ): CRDTOperation {
        let curr = this.BOF;
        for (let i = 0; i < index && curr.next; i++) {
            curr = curr.next;
        }

        let endingChar = curr.next;

        let keys = generateNKeysBetween(
            curr.identifier,
            curr.next?.identifier,
            value.length
        );

        for (let i = 0; i < value.length; i++) {
            const newChar = new Char(keys[i], value[i], userID);
            newChar.prev = curr;
            curr.next = newChar;
            curr = newChar;
        }

        curr.next = endingChar;
        if (endingChar) endingChar.prev = curr;

        const charOps: CharOperation[] = keys.map((identifier, i) => {
            return {
                identifier,
                value: value[i],
            };
        });

        return { charOps, operation: CRDTOperationType.insert, userID };
    }

    insertStringRemote(ops: CRDTOperation) {
        let curr = this.BOF;

        if (ops.charOps.length === 0) return;

        const startingIdentifer = ops.charOps[0].identifier;
        const remoteUserID = ops.userID;
        while (curr.next && curr.next.identifier < startingIdentifer) {
            curr = curr.next;
        }

        while (
            curr.next &&
            curr.next.identifier == startingIdentifer &&
            curr.next.userID < remoteUserID
        ) {
            curr = curr.next;
        }

        const endingChar = curr.next;
        ops.charOps.forEach((CharToInsert) => {
            const newChar = new Char(
                CharToInsert.identifier,
                CharToInsert.value!,
                remoteUserID
            );
            newChar.prev = curr;
            curr.next = newChar;
            curr = newChar;
        });

        curr.next = endingChar;
        if (endingChar) {
            endingChar.prev = curr;
        }
    }

    deleteStringLocal(index: number, length: number, userID: number) {
        let curr = this.BOF;
        for (let i = 0; i < index && curr.next; i++) {
            curr = curr.next;
        }

        let endingChar = curr.next;
        let deleteIdentifiers: CharOperation[] = [];
        for (let i = 0; i < length && endingChar; i++) {
            deleteIdentifiers.push({
                identifier: endingChar.identifier,
                userID: endingChar.userID,
            });
            endingChar = endingChar.next;
        }

        curr.next = endingChar;
        if (endingChar) endingChar.prev = curr;

        const operation: CRDTOperation = {
            operation: CRDTOperationType.delete,
            charOps: deleteIdentifiers,
            userID, // not required
        };

        return operation;
    }

    deleteStringRemote(op: CRDTOperation) {
        let curr: Char | null = this.BOF;
        const { charOps } = op;
        let deleteIndex = 0;

        while (deleteIndex < charOps.length && curr) {
            const charOp = charOps[deleteIndex];
            if (
                curr.identifier === charOp.identifier &&
                curr.userID === charOp.userID
            ) {
                const nextChar: Char | null = curr.next;
                if (curr.next) curr.next.prev = curr.prev;
                if (curr.prev) curr.prev.next = curr.next;
                curr = nextChar;
                deleteIndex++;
            } else {
                curr = curr.next;
            }
        }

        if (deleteIndex < charOps.length) {
            throw new Error("Remote characters deletion could not be complete");
        }
    }

    getDocument(): string {
        let doc: string = "";
        let curr = this.BOF.next;
        while (curr) {
            doc += curr.value;
            curr = curr.next;
        }
        return doc;
    }
}