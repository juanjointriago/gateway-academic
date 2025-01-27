import { LEVEL_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments, getDocumentById } from "@/src/helpers/firestoreHelper";
import { ILevel } from "@/src/interfaces";

export class LevelService {
    static getAllLevels = async (): Promise<ILevel[]> => {
        const levels = await getAllDocuments<ILevel>(LEVEL_COLLECTION);
        return levels;
    }

    static getLevelByDocId = async (docId: string): Promise<ILevel | null> => {
        const level = await getDocumentById<ILevel>(LEVEL_COLLECTION, docId);
        return level;
    }
}