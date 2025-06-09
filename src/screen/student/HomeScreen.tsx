import { useEffect, useMemo } from "react";
import { LabelWithImg, LayoutGeneral, Section } from "../../components";
import { useAuthStore } from "../../store/auth/auth.store";
import { typeUser } from "../../constants/ConstantsErrors";
import { Divider, Text } from "react-native-paper";
import { useLevelStore } from "../../store/level/level.store";
import { useEventStore } from "../../store/event/event.store";
import { useSubLevelStore } from "../../store/level/sublevel.store";
import { useUnitStore } from "../../store/unit/unit.store";
import { BannerSimple } from "@/src/components/banner/BannerSimple";
import { useEventContext } from "@/src/context/Firebase/EventContext";
import { useUnitContext } from "@/src/context/Firebase/UnitsContext";
import { useUserContext } from "@/src/context/Firebase/UserContext";
import { useLevelContext } from "@/src/context/Firebase/LevelContext";
import { useSubLevelContext } from "@/src/context/Firebase/SublevelContext";
import { useNewsStore } from "@/src/store/news/news.store";
import { Carousel } from "@/src/components/image/Carousel";

export const HomeScreen = () => {
  const { startListeningEvents, stopListeningEvents } = useEventContext();
  const { startListeningUser, stopListeningUser } = useUserContext();
  const { startListeningLevel, stopListeningLevel } = useLevelContext();
  const { startListeningSubLevel, stopListeningSubLevel } =
    useSubLevelContext();

  const user = useAuthStore((state) => state.user);

  const level = useLevelStore((state) => state.level);

  const events = useEventStore((state) => state.eventsAvailable);

  const sublevel = useSubLevelStore((state) => state.subLevel);

  const units = useUnitStore((state) => state.unitsAvailable);

  const getNews = useNewsStore((state) => state.getAndSetNews);
  const news = useNewsStore((state) => state.news);

  useEffect(() => {
    getNews();
  }, [getNews]);

  const listInfo = useMemo(
    () => [
      {
        title: "Modalida",
        nameIcon: "school",
        description: level?.name || "Sin Modalidad Asignada",
      },
      {
        title: "Clases Reservadas",
        nameIcon: "calendar-month",
        description: `${events}`,
      },
      {
        title: "Unidad Actual",
        nameIcon: "chart-bar",
        description: sublevel?.name || " Sin Unidad Asignada",
      },
      {
        title: "Libros Disponibles",
        nameIcon: "notebook",
        description: `${units}`,
      },
    ],
    [level, events, sublevel, units]
  );

  useEffect(() => {
    if (!user) return;
    startListeningUser(user.id);

    return () => {
      stopListeningUser();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    startListeningLevel();
    startListeningSubLevel();
    startListeningEvents({ isTeacher: false });

    return () => {
      stopListeningEvents();
      stopListeningLevel();
      stopListeningSubLevel();
    };
  }, [user]);

  return (
    <LayoutGeneral title="Bienvenido" withScrollView>
      <LabelWithImg
        title={user?.name}
        url={user?.photoUrl}
        subtitle={user?.email}
        description={typeUser[user?.role as string]}
        contentStyle={{ marginBottom: 10 }}
      />
      <Divider style={{ marginVertical: 10 }} />
      <Carousel data={news} onPress={(item) => console.debug(item)} />
      <Section title="Informacion General" setionsList={listInfo} />
    </LayoutGeneral>
  );
};
