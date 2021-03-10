import React, { createContext, useCallback, useState } from 'react';
import { auth } from '../config/firebase';
import { AuthContextData, AuthState } from '../models/auth';

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const user = localStorage.getItem('@Taugor:user');

    if (user) return { user: JSON.parse(user) };

    return {} as AuthState;
  });

  const signIn = useCallback(async (email, password) => {
    const response = await auth.signInWithEmailAndPassword(email, password);

    const { user } = response;

    if (user) {
      setData({ user });
    }

    localStorage.setItem('@Taugor:user', JSON.stringify(user));
  }, []);

  const signOut = useCallback(() => {
    setData({} as AuthState);
    localStorage.removeItem('@Taugor:user');
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
