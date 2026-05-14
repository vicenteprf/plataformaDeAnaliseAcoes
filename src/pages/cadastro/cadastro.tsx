import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Cadastro() {
  const [dadosCadastro, setDadosCadastro] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;

    setDadosCadastro({
      ...dadosCadastro,
      [name]: value,
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    console.log(dadosCadastro);
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
          <h2 className="mb-8 text-2xl font-bold text-white">Criar conta</h2>

          <div className="flex flex-col gap-4">
            <button className="flex items-center justify-center gap-2 rounded-x1 border border-zinc-700 bg-[#111827] py-3 text-white cursor-pointer">
              <FcGoogle size={22} />
              Cadastrar com Google
            </button>

            <button className="flex items-center justify-center gap-2 rounded-x1 border border-zinc-700 bg-[#111827] py-3 text-white cursor-pointer">
              <FaApple size={22} />
              Cadastrar com Apple
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-zinc-800"></div>

              <span className="text-xs text-zinc-500">
                {" "}
                ou preencha o formulário
              </span>

              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-1">
                <label className="mb-2 block text-sm text-zinc-400">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="João da Silva"
                  className="w-full rounded-xl border border-zinc-700 bg-[#111827] px-4 py-3 text-white outline-none"
                  onChange={handleChange}
                />
              </div>

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
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-xl border border-zinc-700 bg-[#111827] px-4 py-3 text-white outline-none"
                  onChange={handleChange}
                />
              </div>

              <label className="flex items-start gap-2 text-sm text-zinc-500 p-2">
                <input type="checkbox" className="mt-1 accent-blue-600" />

                <span>
                  Lí e concordo com os{" "}
                  <a href="#" className="text-blue-500 hover:text-blue-400">
                    Termos de uso
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-blue-500 hover:text-blue-400">
                    Política de Privacidade
                  </a>
                </span>
              </label>

              <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white cursor-pointer ">
                Cadastrar
              </button>

              <p className="text-center text-sm text-zinc-500 p-2">
                Já tem conta?{" "}
                <Link to={"/login"} className="text-blue-500">
                  Entrar
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
