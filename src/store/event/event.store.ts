import { IEvent } from "@/src/interfaces"
import { EventService } from "@/src/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create, StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

interface IEventState {
    evnts: IEvent[]
}

interface IEventActions {
    getAllEvents: () => Promise<IEvent[]>
    getEventStudent: (userId: string) => IEvent[]
}

const storeApi: StateCreator<IEventState & IEventActions, [["zustand/immer", never]]> = (set, get) => ({
    evnts: [],
    getAllEvents: async () => {
        const events = await EventService.getAllEvents();
        set({ evnts: events });
        return events;
    },

    getEventStudent: (userId) => {
        const events = get().evnts.filter((event) => event.students[userId] && event.isActive);
        return events;
    },
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