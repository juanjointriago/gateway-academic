import { ILevel, ISubLevel } from "./levels.interface";
import { IUser } from "./user.interface";

export type StatusEvent = 'COMMING' | 'MAYBE' | 'CONFIRMED' | 'DECLINED';

interface IInfoUserEvent {
    id: string;
    status: StatusEvent;
}

interface ILevelSubLevel {
    level: string
    subLevels: string[]
}

export interface ILevelEvent {
    level: string;
    subLevels: string[];
}

export interface IStudents { [key: string]: { status: StatusEvent } }

export interface IEvent {
    id?: string;
    isActive: boolean;
    levels: ILevelSubLevel[];
    maxAssistantsNumber: number;
    minAssistantsNumber: number;
    name: string;
    status: StatusEvent;
    students: IStudents;
    teacher: string | null;
    updatedAt: number;
    createdAt: number;
    limitDate?: number;
    meetLink?: string | null;
    date: number;
}

export interface IEventPrev {
    id: string;
    name: string;
    maxAssistantsNumber: number;
    minAssistantsNumber: number;
    status: StatusEvent
    students: IStudents[]
    teacher: IInfoUserEvent[] | IInfoUserEvent | string
    levels: ILevelSubLevel
    isActive: boolean;
    date: number;
    createdAt: number;
    updatedAt: number;
}

/* Interface Evnet With Deatil */

export interface IEventDetail extends IEvent {
    levelsData: ILevelData[];
    teacherData: IUserData | null;
    studentsData: IUserData[];
}

export interface ILevelData extends ILevel {
    subLevels: ISubLevel[];
}

export interface IUserData extends IUser {
    status?: string;
}
