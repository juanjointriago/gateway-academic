import { IEvent, IEventDetail } from "@/src/interfaces"
import { EventService } from "@/src/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create, StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

interface IEventState {
    events: IEvent[]
    eventSelected: IEventDetail | null
    eventsAvailable: number
}

interface IEventActions {
    getAllEvents: ({ isTeacher, userId }: { isTeacher: boolean, userId: string }) => Promise<IEvent[]>
    getEventsDetailById: (uuid: string) => Promise<void>
    clearStoreEvents: () => void
}

const storeApi: StateCreator<IEventState & IEventActions, [["zustand/immer", never]]> = (set, get) => ({
    events: [],
    eventSelected: null,
    eventsAvailable: 0,
    getAllEvents: async ({ isTeacher, userId }) => {
        const events = await EventService.getAllEvents();
        if (isTeacher) {
            const eventsTeacher = events.filter((event) => event.teacher === userId && event.isActive);
            set({ events: eventsTeacher, eventsAvailable: eventsTeacher.length });
            return eventsTeacher;
        }
        const eventsStudent = events.filter((event) => event.students[userId] && event.isActive);
        set({ events: eventsStudent, eventsAvailable: eventsStudent.length });
        return events;
    },

    getEventsDetailById: async (uuid) => {
        const event = await EventService.getEventWithDetailById(uuid);
        set({ eventSelected: event });
    },
    clearStoreEvents: () => {
        set({ events: [], eventSelected: null, eventsAvailable: 0 });
    }
});

export const useEventStore = create<IEventState & IEventActions>()(
    devtools(
        immer(
            persist(storeApi, {
                name: "event-store",
                storage: createJSONStorage(() => AsyncStorage),
            })
        )
    )
);