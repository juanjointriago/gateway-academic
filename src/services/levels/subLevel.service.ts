import { SUB_LEVEL_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments } from "@/src/helpers/firestoreHelper";
import { ISubLevel } from "@/src/interfaces"

export class SubLevelService {
    static getAllSubLevels = async (): Promise<ISubLevel[]> => {
        const levels = await getAllDocuments<ISubLevel>(SUB_LEVEL_COLLECTION);
        return levels;
    }
}