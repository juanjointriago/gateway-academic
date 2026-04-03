import {
    WORKSHEETS_COLLECTION,
    WORKSHEET_SUBMISSIONS_COLLECTION,
} from '@/src/constants/ContantsFirebase';
import {
    createDocumentWithLocalId,
    getDocumentById,
    getQueryDocuments,
    updateDocument,
} from '@/src/helpers/firestoreHelper';
import { IWorksheet, IWorksheetSubmission } from '@/src/interfaces';

export class WorksheetService {
    static async getWorksheetById(id: string): Promise<IWorksheet | null> {
        return await getDocumentById<IWorksheet>(WORKSHEETS_COLLECTION, id);
    }

    static async getSubmissionsByStudentAndWorksheet(
        studentId: string,
        worksheetId: string
    ): Promise<IWorksheetSubmission[]> {
        return await getQueryDocuments<IWorksheetSubmission>({
            collection: WORKSHEET_SUBMISSIONS_COLLECTION,
            condition: [
                { field: 'studentId', operator: '==', value: studentId },
                { field: 'worksheetId', operator: '==', value: worksheetId },
            ],
            orderByField: 'completedAt',
            orderByDirection: 'asc',
        });
    }

    static async createSubmission(
        submission: Omit<IWorksheetSubmission, 'id'>
    ): Promise<void> {
        await createDocumentWithLocalId<IWorksheetSubmission>(
            WORKSHEET_SUBMISSIONS_COLLECTION,
            submission
        );
    }

    /** Para docentes: todas las entregas de un worksheet */
    static async getSubmissionsByWorksheetId(
        worksheetId: string
    ): Promise<IWorksheetSubmission[]> {
        return await getQueryDocuments<IWorksheetSubmission>({
            collection: WORKSHEET_SUBMISSIONS_COLLECTION,
            condition: [
                { field: 'worksheetId', operator: '==', value: worksheetId },
            ],
            orderByField: 'completedAt',
            orderByDirection: 'desc',
        });
    }

    static async updateSubmission(
        id: string,
        data: Partial<IWorksheetSubmission>
    ): Promise<void> {
        await updateDocument(WORKSHEET_SUBMISSIONS_COLLECTION, id, data);
    }
}
