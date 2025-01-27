import { FC } from 'react'
import { AuthProvider } from './AuthContext'
import { AlertProvider } from './AlertContext'
import { PertmissionsProvider } from './PermissionsContext'

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const AppProvider: FC<Props> = ({ children }) => {
    return (
        <PertmissionsProvider>
            <AuthProvider>
                <AlertProvider>
                    {children}
                </AlertProvider>
            </AuthProvider>
        </PertmissionsProvider>
    )
}
