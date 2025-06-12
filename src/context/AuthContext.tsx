import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getAuth, signOut } from '@react-native-firebase/auth';
// import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { useAuthStore } from "../store/auth/auth.store";
import { useUserStore } from "../store/users/users.store";
import { IUser } from "../interfaces";

interface AuthContextType {
    loading: boolean;
    user: IUser | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const user= useAuthStore(state=>state.user);
    const setUser = useAuthStore(state=> state.setUser);
    const getUserById = useUserStore(state=> state.getUserById);
    const getAllUsers = useUserStore(state=> state.getAllUsers);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const auth = getAuth();
                const firebaseUser = auth.currentUser;

                if (!firebaseUser) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Primero obtenemos todos los usuarios
                await getAllUsers();
                
                // Luego buscamos el usuario específico por uid
                const userData = getUserById(firebaseUser.uid);

                if (!userData) {
                    console.warn('Usuario autenticado pero no encontrado en la base de datos');
                    setUser(null);
                    await signOut(auth);
                } else {
                    setUser(userData as IUser);
                }
            } catch (error) {
                console.error('Error en verificación de auth:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthState();
    }, []);

    const value = useMemo(() => ({
        loading,
        user
    }), [loading, user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};