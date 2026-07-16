import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { supabase } from "../../lib/supabase";

export default function Login() {
  const [dados, setDados] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;

    setDados({
      ...dados,
      [name]: value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!dados.email || !dados.password) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: dados.email,
      password: dados.password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage("Email ou senha incorretos.");
      return;
    }

    navigate("/home");
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/home",
      },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 shadow-[0_0_20px_rgba(59,130,246,0.10)]">
      <section className="w-full max-w-md ">
        {/* Logo */}
        <div className="mb-8 text-center ">
          <h1 className="text-4xl font-bold text-white">
            Stock <span className="text-blue-500">Vault</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Sua plataforma de análise
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#0B1020] p-8 shadow-2xl">
          <h2 className="mb-8 text-2xl font-bold text-white">
            Entrar na conta
          </h2>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-[#111827] py-3 text-white cursor-pointer"
            >
              <FcGoogle size={22} />
              Continuar com Google
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-zinc-800"></div>

              <span className="text-xs text-zinc-500">
                {" "}
                Ou entre com e-mail
              </span>

              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-1">
                <label className="mb-2 block text-sm text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-zinc-700 bg-[#111827] px-4 py-3 text-white outline-none"
                  onChange={handleChange}
                />
              </div>

              <div className="p-1">
                <label className="mb-2 block text-sm text-zinc-400">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="**********"
                  className="w-full rounded-xl border border-zinc-700 bg-[#111827] px-4 py-3 text-white outline-none"
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end p-4">
                <Link to={"/#"} className="text-sm text-blue-500">
                  Esqueceu a senha?
                </Link>
              </div>

              {errorMessage && (
                <p className="text-red-400 text-sm text-center py-2">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white cursor-pointer "
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>

              <p className="text-center text-sm text-zinc-500 p-2">
                Não tem conta?{" "}
                <Link to={"/cadastro"} className="text-blue-500">
                  Criar conta
                </Link>
              </p>
            </form>
          </div>

          <footer className="mt-6 flex justify-center gap-4 text-xs text-zinc-600">
            <span>Termos de Uso</span>
            <span>Privacidade</span>
            <span>Ajuda</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
