import { SUB_LEVEL_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments, getDocumentById } from "@/src/helpers/firestoreHelper";
import { ISubLevel } from "@/src/interfaces"

export class SubLevelService {
    static getAllSubLevels = async (): Promise<ISubLevel[]> => {
        const levels = await getAllDocuments<ISubLevel>(SUB_LEVEL_COLLECTION);
        return levels;
    }

    static getSubLevelByDocId = async (docId: string): Promise<ISubLevel | null> => {
        const level = await getDocumentById<ISubLevel>(SUB_LEVEL_COLLECTION, docId);
        return level;
    }
}