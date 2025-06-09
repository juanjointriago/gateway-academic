import { getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { progressSheetInterface } from "@/src/interfaces/progress-sheet.interface";

export class ProgressSheetService {
  static async getProgressSheet(): Promise<progressSheetInterface[]> {
    try {
        const progressSheets = await getQueryDocuments<progressSheetInterface>({
            collection: 'progressSheets',
            condition: [{ field: "isActive", operator: "==", value: true }],
        });
        return progressSheets;
    } catch (error) {
        console.error('Error fetching progress sheets:', error);
        return [];
    }
  }


}