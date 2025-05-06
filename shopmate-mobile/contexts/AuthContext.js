import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

// ✅ Create authentication context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const tokenRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('@token');
      if(token){
        tokenRef.current = token || '';
        setIsAuthenticated(true)
      }else{
        setIsAuthenticated(false)
      }
    })()
  }, []);
  const login = useCallback(async (token,user) => {
    setIsAuthenticated(true);
    await AsyncStorage.setItem('@token', token);
    await AsyncStorage.setItem('@user', user);
    tokenRef.current = token;
    router.replace('/(tabs)') // ✅ Redirect to home tab
  }, []);
  // ✅ Logout function (Redirect to Auth Screen)
  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    await AsyncStorage.setItem('@token', '');
    await AsyncStorage.setItem('@user', '');
    tokenRef.current = null;
    router.replace("/(auth)"); // ✅ Redirect to login screen
  }, []);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout,token: tokenRef, }}>
      {children}
    </AuthContext.Provider>
  );
};
// ✅ Hook to use authentication state
export const useAuth = ()=> {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};