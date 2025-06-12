import { FC, memo } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./AuthContext";
import { AlertProvider } from "./AlertContext";
import { PertmissionsProvider } from "./PermissionsContext";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AppContent: FC<Props> = memo(({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AlertProvider>{children}</AlertProvider>;
});

export const AppProvider: FC<Props> = memo(({ children }) => {
  return (
    <PertmissionsProvider>
      <AuthProvider>
        <AppContent>{children}</AppContent>
      </AuthProvider>
    </PertmissionsProvider>
  );
});
