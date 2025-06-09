import { NEWS_COLLECTION } from "@/src/constants/ContantsFirebase";
import {  getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { INew } from "@/src/interfaces/news.interface";

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
}
    