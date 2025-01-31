import { SUB_LEVEL_COLLECTION, UNIT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getDocumentById, getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { ISubLevel, IUnit, IUnitMutation } from "@/src/interfaces";

export class UnitService {

    static getUnitByUser = async (unitsUser: string[]): Promise<IUnitMutation[]> => {
        try {
            if (!unitsUser || !unitsUser.length) throw new Error("No units found");

            // 🔹 Obtener todas las unidades activas del usuario
            const units = await getQueryDocuments<IUnit>({
                collection: UNIT_COLLECTION,
                condition: [
                    { field: "sublevel", operator: "in", value: unitsUser }, // Filtra por sublevel de usuario
                    { field: "isActive", operator: "==", value: true }, // Solo unidades activas
                ],
            });

            if (!units || !units.length) throw new Error("No units found");

            // 🔹 Extraer sublevelIds únicos
            const uniqueSublevelIds = [...new Set(units.map((unit) => unit.sublevel))];

            // 🔹 Obtener los detalles de todos los subniveles en paralelo
            const sublevels = await Promise.all(
                uniqueSublevelIds.map((id) => getDocumentById<ISubLevel>(SUB_LEVEL_COLLECTION, id))
            );

            // 🔹 Crear un mapa de sublevels para acceso rápido
            const sublevelMap = new Map(uniqueSublevelIds.map((id, index) => [id, sublevels[index]]));

            // 🔹 Mapear unidades con su información de sublevel correspondiente
            const mappedUnits = units
                .map((unit) => ({
                    ...unit,
                    sublevelInfo: sublevelMap.get(unit.sublevel) as ISubLevel, // Asignar info del sublevel
                }))
                .sort((a, b) => a.orderNumber - b.orderNumber); // Ordenar por número de orden

            return mappedUnits;
        } catch (error) {
            console.debug(error);
            return [];
        }
    };
}