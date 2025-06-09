import { NEWS_COLLECTION } from "@/src/constants/ContantsFirebase";
import { createDocument, deleteDocument, getQueryDocuments, updateDocument } from "@/src/helpers/firestoreHelper";
import { INew, newFile } from "@/src/interfaces/news.interface";

export class NewsService {
    static getNews = async (): Promise<INew[]> => {
        try {
            const news = await getQueryDocuments<INew>({
                collection: NEWS_COLLECTION,
                condition: [{ field: "isActive", operator: "==", value: true }],
                // orderBy: [{ field: "createdAt", direction: "desc" }]
            });
            return news;
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
        }
    };


    static updateNew = async (news: INew): Promise<void> => {
        try {
            await updateDocument(NEWS_COLLECTION, news.id!, news);
        } catch (error) {
            console.error('Error updating news:', error);
            throw error;
        }
    };

    static deleteNew = async (id: string): Promise<void> => {
        try {
            await deleteDocument(NEWS_COLLECTION, id);
        } catch (error) {
            console.error('Error deleting news:', error);
            throw error;
        }
    };
}
    