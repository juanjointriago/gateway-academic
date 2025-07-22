import AsyncStorage from "@react-native-async-storage/async-storage";
import { IEvent, IEventDetail } from "@/src/interfaces";
import { EventService } from "@/src/services";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IEventState {
  events: IEvent[];
  eventSelected: IEventDetail | null;
  eventsAvailable: number;
}

interface IEventActions {
  getEventsByUser: ({
    isTeacher,
    userId,
  }: {
    isTeacher: boolean;
    userId: string;
  }) => Promise<void>;
  getEventsDetailById: (uuid: string) => Promise<IEventDetail | null>;
  getEventById: (id: string) => IEvent | undefined;
  getAllEvents: () => Promise<IEvent[]>;
  setEvent: (event: IEvent[]) => void;
  clearStoreEvents: () => void;
  updateEvent: (event: IEvent) => Promise<void>;
}

const storeApi: StateCreator<IEventState & IEventActions> = (set, get) => ({
  updateEvent: async (event) => {
    await EventService.updateEvent(event);
    set((state) => {
      const updatedEvents = state.events.map((e) => (e.id === event.id ? { ...e, ...event } : e));
      // Solo actualiza eventSelected si corresponde al evento editado y mantiene los detalles extendidos
      let updatedEventSelected = state.eventSelected;
      if (state.eventSelected && state.eventSelected.id === event.id) {
        updatedEventSelected = { ...state.eventSelected, ...event };
      }
      return { ...state, events: updatedEvents, eventSelected: updatedEventSelected };
    });
  },
  events: [],
  eventSelected: null,
  eventsAvailable: 0,
  getEventsByUser: async ({ isTeacher, userId }) => {
    const events = await EventService.getEvents();
    if (isTeacher) {
      const eventsTeacher = events.filter(
        (event) => event.teacher === userId && event.isActive
      );
      set({ events: eventsTeacher, eventsAvailable: eventsTeacher.length });
    }
    const eventsStudent = events.filter(
      (event) => event.students[userId] && event.isActive
    );
    set({ events: eventsStudent, eventsAvailable: eventsStudent.length });
  },
  getEventsDetailById: async (uuid) => {
    const event = await EventService.getEventWithDetailById(uuid);
    set({ eventSelected: event });
    return event
  },
  getEventById: (id: string) => {
    const result = get().events.filter((event) => event.id === id)[0];
    console.debug('events length',get().events.length);
    if (!result) {
      console.warn(`❌ Event with id ${id} not found`);
      return undefined;
    }
    return result;
  },

  getAllEvents: async () => {
    const resp = await EventService.getAllEvents();
    if (!resp || resp.length === 0) {
      console.warn("❌ No events found");
      return [];
    }
    console.debug(`😎 Found ${resp.length} events`);
    set({ events: resp, eventsAvailable: resp.length });
    return resp;
  },
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
  },
});

export const useEventStore = create<IEventState & IEventActions>()(
  persist(storeApi, {
    name: "event-store",
    storage: createJSONStorage(() => AsyncStorage),
  })
);
