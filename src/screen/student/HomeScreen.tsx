import { useEffect, useMemo } from "react";
import { LabelWithImg, LayoutGeneral, Section } from "../../components";
import { useAuthStore } from "../../store/auth/auth.store";
import { typeUser } from "../../constants/ConstantsErrors";
import { Divider, Text } from "react-native-paper";
import { useLevelStore } from "../../store/level/level.store";
import { useEventStore } from "../../store/event/event.store";
import { useSubLevelStore } from "../../store/level/sublevel.store";
import { useUnitStore } from "../../store/unit/unit.store";
import { useNewsStore } from "@/src/store/news/news.store";
import { Carousel } from "@/src/components/image/Carousel";
import { useProgressSheetStore } from "@/src/store/progress-sheet/progress-sheet.store";
import { useFeesStore } from "@/src/store/fees/fees.store";

export const HomeScreen = () => {

  const user = useAuthStore((state) => state.user);
  const level = useLevelStore((state) => state.level);
  const events = useEventStore((state) => state.eventsAvailable);
  const sublevel = useSubLevelStore((state) => state.subLevel);
  const units = useUnitStore((state) => state.unitsAvailable);
  const getNews = useNewsStore((state) => state.getAndSetNews);
  const getProgressSheets = useProgressSheetStore((state) => state.getAndSetProgressSheets);
  const news = useNewsStore((state) => state.news);
  const getAllFees = useFeesStore((state) => state.getAndSetFees);
  const getAllClasses = useEventStore((state) => state.getEventsByUser);

  useEffect(() => {
    getNews();
    getProgressSheets();
    getAllFees();
    if(user)
    getAllClasses({isTeacher:false,userId: user.id});
  }, [getNews, getProgressSheets, getAllFees, getAllClasses]);

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
