import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../Context/AuthContext";

export function Private() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div>
        <p>"carregando..."</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
}
