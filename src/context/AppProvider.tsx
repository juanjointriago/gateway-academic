import { FC } from 'react'
import { AuthProvider } from './AuthContext'
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

export const AppProvider: FC<Props> = ({ children }) => {
    return (
        <PertmissionsProvider>
            <AuthProvider>
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
            </AuthProvider>
        </PertmissionsProvider>
    )
}
