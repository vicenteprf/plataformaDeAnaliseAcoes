import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    }

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
