import { useState, createContext, useEffect } from "react";
import { supabase } from "./../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext({} as AuthContextType);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  async function getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setIsLoading(false);
  }

  useEffect(() => {
    // Busca a sessão atual
    getSession();

    // Fica escutando mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Limpa quando o componete desmontar
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, isLoading }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
