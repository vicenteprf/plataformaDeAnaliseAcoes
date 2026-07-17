import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

import Login from "./pages/login/login.tsx";
import Cadastro from "./pages/cadastro/cadastro.tsx";
import Home from "./pages/home/home.tsx";
import Detalhes from "./pages/detalhe/detalhe.tsx";
import MinhasAcoes from "./pages/minhaacoes/minhaAcoes.tsx";

import { Private } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./Context/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<App />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/cadastro"} element={<Cadastro />} />
          <Route element={<Private />}>
            <Route path={"/home"} element={<Home />} />
            <Route path={"/detalhes/:ticker"} element={<Detalhes />} />
            <Route path={"/minhasacoes"} element={<MinhasAcoes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
