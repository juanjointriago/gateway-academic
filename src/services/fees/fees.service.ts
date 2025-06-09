import { FEES_COLLECTION } from "@/src/constants/ContantsFirebase";
import { createDocumentWithLocalId, getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { fee } from "@/src/interfaces/fees.interface";

export class FeesService {
    static async getFees(): Promise<fee[]> {
        try {
                    const news = await getQueryDocuments<fee>({
                        collection: FEES_COLLECTION,
                        condition: [{ field: "isActive", operator: "==", value: true }],
                        // orderBy: [{ field: "createdAt", direction: "desc" }]
                    });
                    return news;
                } catch (error) {
                    console.error('Error fetching news:', error);
                    return [];
                }

    }
    static async createFee(fee: fee) {
        try {
            const docRef = await createDocumentWithLocalId<fee>(FEES_COLLECTION, fee);
            console.debug('Fee created with ID:', docRef.id);
        } catch (error) {
            console.error('Error creating fee:', error);
        }
    }
}