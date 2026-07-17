import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext({} as AuthContextType);
