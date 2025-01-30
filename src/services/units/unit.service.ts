import { SUB_LEVEL_COLLECTION, UNIT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments, getDocumentById, getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { ISubLevel, IUnit, IUnitMutation } from "@/src/interfaces";

export class UnitService {
    static getAllUnits = async (): Promise<IUnitMutation[]> => {
        const units = await getAllDocuments<IUnitMutation>(UNIT_COLLECTION);
        return units.map((unit) => ({
            ...unit,
            sublevelInfo: {} as ISubLevel
        }));
    }

    static getUnitByUser = async (unitsUser: string[]): Promise<IUnitMutation[]> => {
        try {
            if (!unitsUser || !unitsUser.length) throw new Error("No units found");
            const units = await getQueryDocuments<IUnit>({
                collection: UNIT_COLLECTION,
                condition: [
                    { field: "sublevel", operator: "in", value: unitsUser },
                    { field: "isActive", operator: "==", value: true },
                ],
            });
            if (!units || !units.length) throw new Error("No units found");
            const getSubLevel = await getDocumentById<ISubLevel>(SUB_LEVEL_COLLECTION, unitsUser[0]);
            const mappedUnits = units.map((unit) => ({
                ...unit,
                sublevelInfo: getSubLevel as ISubLevel,
            })).sort((a, b) => a.orderNumber - b.orderNumber);

            return mappedUnits;
        } catch (error) {
            console.debug(error);
            return [];
        }
    };
}