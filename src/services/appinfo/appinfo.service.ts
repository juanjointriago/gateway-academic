import { APPINFO_COLLECTION } from "@/src/constants/ContantsFirebase";
import {
  createDocumentWithLocalId,
  getQueryDocuments,
} from "@/src/helpers/firestoreHelper";
import { IAppInfo } from "@/src/interfaces/appinfo.interface";

export class AppInfoService {
  static async getAppInfo(): Promise<IAppInfo[]> {
    try {
      const appInfoRecords = await getQueryDocuments<IAppInfo>({
        collection: APPINFO_COLLECTION,
        condition: [{ field: "isActive", operator: "==", value: true }],
      });
      return appInfoRecords;
    } catch (error) {
      console.error("Error fetching app info:", error);
      return [];
    }
  }
  static async updateAppInfo(appInfo: IAppInfo) {
    try {
      const docRef = await createDocumentWithLocalId<IAppInfo>(
        APPINFO_COLLECTION,
        appInfo
      );
      console.debug("App Info updated with ID:", docRef.id);
    } catch (error) {
      console.error("Error updating app info:", error);
    }
  }
}
