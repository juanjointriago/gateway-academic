import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useAuthStore } from "../store/auth/auth.store";
import { UserService } from "../services";
import { IUser } from "../interfaces";

interface AuthContextType {
    loading: boolean;
    user: IUser | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { setUser, user } = useAuthStore();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const userInfo = await UserService.getUserByDocId(firebaseUser.uid);
                if (!userInfo) {
                    setUser(null);
                    await auth.signOut();
                } else {
                    setUser(userInfo);
                }
            } catch (error) {
                console.error('Error en autenticación:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
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

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};