import { EVENT_COLLECTION, LEVEL_COLLECTION, SUB_LEVEL_COLLECTION, USER_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments, getDocumentById } from "@/src/helpers/firestoreHelper";
import { IEvent, IEventDetail, ILevel, ISubLevel, IUser } from "@/src/interfaces";

export class EventService {
    static getAllEvents = async (): Promise<IEvent[]> => {
        const events = await getAllDocuments<IEvent>(EVENT_COLLECTION);
        return events;
    }

    static getEventWithDetailById = async (idEvent: string): Promise<IEventDetail | null> => {
        try {
            const classData = await getDocumentById<IEventDetail>(EVENT_COLLECTION, idEvent);
            if (!classData) return null;

            const teacherData = await getDocumentById<IUser>(USER_COLLECTION, classData.teacher as string);
            classData.teacherData = teacherData ? teacherData : null;

            (classData.levelsData as any) = await Promise.all(
                classData.levels.map(async (levelObj) => {
                    // Obtener el nivel
                    const levelData = await getDocumentById<ILevel>(LEVEL_COLLECTION, levelObj.level);

                    // Obtener subniveles
                    const subLevelsData = await Promise.all(
                        levelObj.subLevels.map(async (subLevelId) => {
                            return await getDocumentById<ISubLevel>(SUB_LEVEL_COLLECTION, subLevelId);
                        })
                    );

                    return { ...levelData, subLevels: subLevelsData.filter((s) => s !== null) };
                })
            );

            classData.levelsData = classData.levelsData.filter((l) => l !== null);

            classData.studentsData = await Promise.all(
                Object.entries(classData.students).map(async ([studentId, studentInfo]: [string, any]) => {
                    const studentData = await getDocumentById<IUser>("users", studentId);
                    return studentData ? { status: studentInfo.status, ...studentData } : null as any;
                })
            );

            classData.studentsData = classData.studentsData.filter((s) => s !== null);
            return classData;
        } catch (error) {
            console.error('Error al obtener los detalles del evento:', error);
            return null;
        }
    }
}