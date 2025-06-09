import { LayoutGeneral } from "@/src/components";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useProgressSheetStore } from "@/src/store/progress-sheet/progress-sheet.store";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export const ProgressSheetScreen = () => {
  const user = useAuthStore((state) => state.user);
  const getProgressSheetByStudentId = useProgressSheetStore( (state) => state.getProgressSheetByStudentId);
  const getAllProgressSheets = useProgressSheetStore((state) => state.getAllProgressSheets);
  if(!user) {
    return <View><Text>Error user not found</Text></View>
  };
  const myProgressSheet = getProgressSheetByStudentId(user.id);

  useEffect(() => {
    if (user) {
      getAllProgressSheets();
    }
  }, [getAllProgressSheets]);

  return (
    <LayoutGeneral title="ProgressSheet">
      <View>
        <Text>myProgressSheet</Text>
      </View>
    </LayoutGeneral>
  );
};
