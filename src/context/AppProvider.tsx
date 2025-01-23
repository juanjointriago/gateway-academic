import { FC } from 'react'
import { AuthProvider } from './AuthContext'

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const AppProvider: FC<Props> = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}
