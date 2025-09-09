import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        navigate("/files");
      } else {
        const txt = await res.text();
        alert("Erro ao fazer login: " + txt);
      }
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
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
          <img
            src="organize.png"
            alt="Logo"
          />
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="col-span-1">

          <div className=" z-[-10] w-full h-screen left-[px] top-[-81px] absolute bg-sky-400 rounded-full" />
          </div>

          <div className="flex flex-col gap-4 p-8 rounded-2xl w-96">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-20 px-6 rounded-[15px] border border-gray-300 text-black text-lg font-['Kameron'] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setSenha(e.target.value)}
              className="w-full h-20 px-6 rounded-[15px] border border-gray-300 text-black text-lg font-['Kameron'] focus:outline-none"
            />
            <div className="flex justify-end">
            <button 
        onClick={handleLogin}
        disabled={loading}
        className="w-64 h-20 bg-amber-400 rounded-[15px] text-center text-black text-3xl font-black font-['Inter'] hover:bg-amber-500 disabled:opacity-50 cursor-pointer flex items-center justify-center"
      >
        {loading ? "Entrando..." : "Login"}
      </button>
            </div>
         
      <div className="mt-4 flex justify-end items-center gap-1">
          <Link to="/register" className="w-40 text-center cursor-pointer">
        <span className="text-white text-xl font-bold font-['Kameron']">CADASTRE - </span>
        <span className="text-black text-xl font-bold font-['Kameron']">SE</span>
      </Link>
            <img
              src="seta.png"
              alt="Seta"
              className="w-8 h-8"
            />
          </div>
          </div>
         
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
            <img src="icons8-pessoa-30 3.png" alt="Avatar" className="w-6 h-6" />
            <span>{nome}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}