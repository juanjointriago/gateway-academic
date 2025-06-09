import { EVENT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { subscribeToCollection } from "@/src/helpers/firesoteRealTime";
import { IEvent } from "@/src/interfaces";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useEventStore } from "@/src/store/event/event.store";
import { createContext, FC, ReactNode, useContext, useEffect } from "react";

interface EventContextType {
    startListeningEvents: ({ isTeacher }: { isTeacher: boolean }) => void;
    stopListeningEvents: () => void;
}

const EventContext = createContext<EventContextType | null>(null);

interface Props {
    children: ReactNode;
}

export const EventProvider: FC<Props> = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const setEvent = useEventStore((state) => state.setEvent);

    let unsubscribe: (() => void) | null = null;

    const startListeningEvents = ({ isTeacher }: { isTeacher: boolean }) => {
        if (unsubscribe) {
            unsubscribe();
        }

        unsubscribe = subscribeToCollection<IEvent>(
            EVENT_COLLECTION,
            (ref) => ref.where("isActive", "==", true),
            (updatedEvents) => {
                console.debug('updatedEvents Context', updatedEvents.length);
                if (!updatedEvents.length || !user) return;
                if (isTeacher) {
                    const eventsTeacher = updatedEvents.filter((event) => event.teacher === user.id);
                    setEvent(eventsTeacher);
                    return;
                }
                const eventsStudent = updatedEvents.filter((event) => event.students[user.id]);
                setEvent(eventsStudent);
            }
        );
    };

    const stopListeningEvents = () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    };

    useEffect(() => {
        return () => {
            stopListeningEvents();
        };
    }, []);

    return (
        <EventContext.Provider value={{ startListeningEvents, stopListeningEvents }}>
            {children}
        </EventContext.Provider>
    )
};

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (!context) throw new Error("useEventContext debe usarse dentro de un EventProvider");
    return context;
};