import { UNIT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { IUnit } from "@/src/interfaces";

export class UnitService {
  static getAllUnits = async (): Promise<IUnit[]> => {
    try {
      // 🔹 Obtener todas las unidades activas del usuario
      const units = await getQueryDocuments<IUnit>({
        collection: UNIT_COLLECTION,
        condition: [{ field: "isActive", operator: "==", value: true }],
        // orderBy: [{ field: "createdAt", direction: "desc" }]
      });

      if (!units?.length) throw new Error("No have units");

      return units.sort((a, b) => a.orderNumber - b.orderNumber);
    } catch (error) {
      console.error("Error in getUnitByUser:", error);
      return [];
    }
  };
}
