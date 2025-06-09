import { FC, memo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './AuthContext'
import { AlertProvider } from './AlertContext'
import { PertmissionsProvider } from './PermissionsContext'
import { EventProvider } from './Firebase/EventContext'
import { UnitProvider } from './Firebase/UnitsContext'
import { UserProvider } from './Firebase/UserContext'
import { LevelProvider } from './Firebase/LevelContext'
import { SubLevelProvider } from './Firebase/SublevelContext'

interface Props {
    children: JSX.Element | JSX.Element[]
}

const AppContent: FC<Props> = memo(({ children }) => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <UserProvider>
            <LevelProvider>
                <SubLevelProvider>
                    <EventProvider>
                        <UnitProvider>
                            <AlertProvider>
                                {children}
                            </AlertProvider>
                        </UnitProvider>
                    </EventProvider>
                </SubLevelProvider>
            </LevelProvider>
        </UserProvider>
    );
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
