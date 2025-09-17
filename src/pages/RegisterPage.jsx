import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: senha,
          is_admin: isAdmin,
          status: true,
        }),
      });
      if (res.ok || res.status === 201) {
        alert("Usuário criado com sucesso!");
        navigate("/");
      } else {
        const txt = await res.text();
        alert("Erro ao criar usuário: " + txt);
      }
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  return (
    <div className="grid-cols-2 w-screen h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/fundo.png')] flex flex-col overflow-hidden">
      <div className="flex flex-1">
        <div className="flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <img
              src="EduCloud.png"
              alt="Logo"
              className="w-3/4 max-w-[500px] h-auto object-contain"
            />
          </div>
          <img src="organize.png" alt="Logo" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="col-span-1">
            <div className=" z-[-10] w-full h-screen left-[px] top-[-81px] absolute bg-sky-400 rounded-full" />
          </div>

          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-4 p-8 rounded-2xl w-96"
          >
            <input
              type="text"
              placeholder="Nome completo"
              className="w-full h-20 px-6 rounded-[15px] border border-gray-300 text-black text-lg font-['Kameron'] focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full h-20 px-6 rounded-[15px] border border-gray-300 text-black text-lg font-['Kameron'] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full h-20 px-6 rounded-[15px] border border-gray-300 text-black text-lg font-['Kameron'] focus:outline-none"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-5 h-5"
              />
              <label
                htmlFor="isAdmin"
                className="text-black text-lg font-['Kameron']"
              >
                Sou professor
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-64 h-20 bg-amber-400 rounded-[15px] text-center text-black text-3xl font-black font-['Inter'] hover:bg-amber-500 disabled:opacity-50 cursor-pointer flex items-center justify-center"
              >
                Criar
              </button>
            </div>
            <div className="mt-4 flex justify-end items-center">
              <Link to="/" className="w-40 text-center cursor-pointer">
                <span className="text-white text-xl font-bold font-['Kameron']">
                  FAÇA{" "}
                </span>
                <span className="text-black text-xl font-bold font-['Kameron']">
                  LOGIN
                </span>
              </Link>
              <img src="seta.png" alt="Seta" className="w-8 h-8" />
            </div>
          </form>
        </div>
      </div>

      <footer className="w-full bg-black h-[8vh] flex items-center justify-around px-4">
        {[
          "Alex Vinicius Maximiano",
          "Luisa Mosca de Oliveira",
          "Nicolas Jodar de Barros",
          "Vanderlei Tortora Junior",
          "Ryan Matheus Morais",
        ].map((nome, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-white text-sm md:text-lg font-['Abel']"
          >
            <img
              src="icons8-pessoa-30 3.png"
              alt="Avatar"
              className="w-6 h-6"
            />
            <span>{nome}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}
