import React, { createContext, useCallback, useState } from 'react';
import { AuthContextData, AuthState } from '../models/auth';
import { emailRecovery, emailSignIn, emailSignUp } from '../services/firebase';

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
    const response = await emailSignIn(email, password);

    const { user } = response;

    if (user) {
      setData({ user });
    }

    localStorage.setItem('@Taugor:user', JSON.stringify(user));
  }, []);

  const signUp = useCallback(async (email, password) => {
    const response = await emailSignUp(email, password);

    const { user } = response;

    if (user) {
      setData({ user });
    }

    localStorage.setItem('@Taugor:user', JSON.stringify(user));
  }, []);

  const recovery = useCallback(async email => {
    await emailRecovery(email);
  }, []);

  const signOut = useCallback(() => {
    setData({} as AuthState);
    localStorage.removeItem('@Taugor:user');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signUp, recovery, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
