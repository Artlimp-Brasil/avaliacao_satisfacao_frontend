// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCupomStore } from "@/stores/cupomStore";
import { useAtendimentoStore } from "@/stores/atendimentoStore"

export default function Login() {

    const resetState = useAtendimentoStore((state) => state.reset);
    const resetCupom = useCupomStore((state) => state.resetCupom);

    useEffect(() => {
        resetCupom()
        resetState()
        localStorage.clear()
    })

    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();


    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErro("");

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ login, senha })
            });
            console.log(res)
            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                setErro(data.message || "Erro ao fazer login.");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("pdv", data.pdv.toString());

            navigate("/");
        } catch (error) {
            setErro("Erro de conexão com o servidor.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login do PDV</h1>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Login</label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                {erro && <p className="text-red-500 mb-4 text-sm">{erro}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
