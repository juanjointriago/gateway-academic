import { SUB_LEVEL_COLLECTION, UNIT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments, getDocumentById, getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { ISubLevel, IUnit, IUnitMutation } from "@/src/interfaces";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export class UnitService {
    static getAllUnits = async (): Promise<IUnitMutation[]> => {
        const units = await getAllDocuments<IUnitMutation>(UNIT_COLLECTION);
        return units.map((unit) => ({
            ...unit,
            sublevelInfo: {} as ISubLevel
        }));
    }

    static getNumberUnitsAvailable = async (unitsStudent: string[]): Promise<number> => {
        const totalDocs = await getQueryDocuments<IUnit>({
            collection: UNIT_COLLECTION,
            condition: [
                { field: "sublevel", operator: "in", value: unitsStudent },
                { field: "isActive", operator: "==", value: true },
            ],
        }).then((docs) => docs.length);
        return totalDocs;
    }

    static getUnitStudent = async (unitsStudent: string[]): Promise<IUnitMutation[]> => {
        const units = await getQueryDocuments<IUnit>({
            collection: UNIT_COLLECTION,
            condition: [
                { field: "sublevel", operator: "in", value: unitsStudent },
                { field: "isActive", operator: "==", value: true },
            ],
        });

        const getSubLevel = await getDocumentById<ISubLevel>(SUB_LEVEL_COLLECTION, unitsStudent[0]);

        const mappedUnits = units.map((unit) => ({
            ...unit,
            sublevelInfo: getSubLevel as ISubLevel,
        })).sort((a, b) => a.orderNumber - b.orderNumber);

        return mappedUnits;
    };
}