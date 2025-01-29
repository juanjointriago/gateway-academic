import { EVENT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments, getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { IEvent } from "@/src/interfaces";

export class EventService {
    static getAllEvents = async (): Promise<IEvent[]> => {
        const events = await getAllDocuments<IEvent>(EVENT_COLLECTION);
        return events;
    }
}