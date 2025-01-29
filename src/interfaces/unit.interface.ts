import { ISubLevel } from "./levels.interface";

export interface IUnit {
    id?: string;
    name: string;
    description: string;
    sublevel: string;
    photoUrl: string;
    supportMaterial?: string;
    workSheetUrl: string;
    isActive: boolean;
    orderNumber: number;
    createdAt?: number;
    updatedAt?: number;
}

export interface IUnitMutation extends IUnit {
    sublevelInfo: ISubLevel;
}

export type IUnitFile = Blob | ArrayBuffer;
