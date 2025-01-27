export interface ILevel {
    id?: string;
    description: string;
    name: string;
    isActive: boolean;
    createdAt?: number;
    updatedAt?: number;
}

export interface ISubLevel {
    id?: string;
    name: string;
    // parentLevel?:string;
    // maxAssistantsNumber: number;
    // minAssistantsNumber: number;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
}


