import { fileStorage } from "@/src/helpers/fileSystemZustand"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IEvent, IEventDetail } from "@/src/interfaces"
import { EventService } from "@/src/services"
import { create, StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

interface IEventState {
    events: IEvent[]
    eventSelected: IEventDetail | null
    eventsAvailable: number
}

interface IEventActions {
    getEventsByUser: ({ isTeacher, userId }: { isTeacher: boolean, userId: string }) => Promise<void>
    getEventsDetailById: (uuid: string) => Promise<void>
   getEventById: (id: string) => IEvent | undefined;
    setEvent: (event: IEvent[]) => void
    clearStoreEvents: () => void
}

const storeApi: StateCreator<IEventState & IEventActions, [["zustand/immer", never]]> = (set, get) => ({
    events: [],
    eventSelected: null,
    eventsAvailable: 0,
    getEventsByUser: async ({ isTeacher, userId }) => {
        const events = await EventService.getEvents();
        if (isTeacher) {
            const eventsTeacher = events.filter((event) => event.teacher === userId && event.isActive);
            set({ events: eventsTeacher, eventsAvailable: eventsTeacher.length });
        }
        const eventsStudent = events.filter((event) => event.students[userId] && event.isActive);
        set({ events: eventsStudent, eventsAvailable: eventsStudent.length });
    },
    getEventsDetailById: async (uuid) => {
        const event = await EventService.getEventWithDetailById(uuid);
        set({ eventSelected: event });
    },
    getEventById: (id: string) => get().events.find(event => event.id === id),

    setEvent: (newEvents) => {
        set((state) => {
            if (JSON.stringify(state.events) !== JSON.stringify(newEvents)) {
                return { events: newEvents, eventsAvailable: newEvents.length };
            }
            return state;
        });
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