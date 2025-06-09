import { SUB_LEVEL_COLLECTION, UNIT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getDocumentById, getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { ISubLevel, IUnit, IUnitMutation } from "@/src/interfaces";

export class UnitService {
    static getUnitByUser = async (unitsUser: string[]): Promise<IUnitMutation[]> => {
        try {
            if (!unitsUser?.length) throw new Error("No units found");

            // 🔹 Obtener todas las unidades activas del usuario
            const units = await getQueryDocuments<IUnit>({
                collection: UNIT_COLLECTION,
                condition: [
                    { 
                        field: "sublevel", 
                        operator: "in", 
                        value: unitsUser 
                    },
                    { 
                        field: "isActive", 
                        operator: "==", 
                        value: true 
                    }
                ]
            });

            if (!units?.length) throw new Error("No units found");

            // 🔹 Extraer sublevelIds únicos y obtener subniveles
            const uniqueSublevelIds = [...new Set(units.map(unit => unit.sublevel))];
            const sublevels = await Promise.all(
                uniqueSublevelIds.map(id => getDocumentById<ISubLevel>(SUB_LEVEL_COLLECTION, id))
            );

            // 🔹 Crear mapa de subniveles y mapear unidades
            const sublevelMap = new Map(
                uniqueSublevelIds.map((id, index) => [id, sublevels[index]])
            );

            return units
                .map(unit => ({
                    ...unit,
                    sublevelInfo: sublevelMap.get(unit.sublevel) as ISubLevel
                }))
                .sort((a, b) => a.orderNumber - b.orderNumber);

        } catch (error) {
            console.error('Error in getUnitByUser:', error);
            return [];
        }
    };
}