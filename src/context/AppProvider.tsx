import { FC } from 'react'
import { AuthProvider } from './AuthContext'
import { AlertProvider } from './AlertContext'

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const AppProvider: FC<Props> = ({ children }) => {
    return (
        <AuthProvider>
            <AlertProvider>
                {children}
            </AlertProvider>
        </AuthProvider>
    )
}
