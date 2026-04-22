import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('userToken');
        if (savedToken) setToken(savedToken);
      } catch (e) {
        console.log("Error cargando token");
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = (newToken: string, userData: any) => {
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken'); 
      setToken(null); // 3. LIMPIAR TOKEN (Esto reemplaza el error de isAuthenticated)
      setUser(null); 
      router.replace('/(auth)/login'); 
    } catch (e) {
      console.error("Error al cerrar sesión", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  return context;
};