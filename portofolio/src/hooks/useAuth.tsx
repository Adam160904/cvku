/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService, type RegisterResult } from '../services/authService';
import { demoService } from '../services/demoService';

interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  /** true saat user membuka tautan reset password dari email. */
  recoveryMode: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  populateDemoData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAuthUser(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    fullName: (session.user.user_metadata?.full_name as string | undefined) ?? '',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    let active = true;

    authService
      .getSession()
      .then((session) => {
        if (active) setUser(toAuthUser(session));
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
      setUser(toAuthUser(session));
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    await authService.login(email, pass);
  };

  const register = (email: string, pass: string, name: string) =>
    authService.register(email, pass, name);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const populateDemoData = async () => {
    if (!user?.id) return;
    await demoService.seed(user.id);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, recoveryMode, login, register, logout, populateDemoData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
