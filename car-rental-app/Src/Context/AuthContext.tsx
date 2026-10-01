import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { userService } from '@/Services';

type AuthContextValue = {
  isLoggedIn: boolean;
  userEmail: string | null;
  userId: number | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: PropsWithChildren) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  function login(email: string, password: string) {
    const user = userService.authenticate(email, password);

    if (user) {
      setUserEmail(user.email);
    }

    return user !== undefined;
  }

  function logout() {
    setUserEmail(null);
  }

  const userId = userEmail ? userService.getUserByEmail(userEmail)?.id ?? null : null;

  return (
    <AuthContext.Provider value={{ isLoggedIn: userEmail !== null, userEmail, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
