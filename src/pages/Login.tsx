import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { motion } from "motion/react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("darkfy_auth", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7B2EFF] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4C1D95] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md px-4"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center mb-4 glow-neon">
            <span className="font-display font-bold text-4xl text-[#7B2EFF]">
              D
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold tracking-wider text-white">
            DARKFY
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Monetize sem aparecer.</p>
        </div>

        <Card className="border-[#2A2A2A] bg-[#141414]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>
              {isLogin ? "Acessar Plataforma" : "Criar Conta"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Entre com suas credenciais para acessar o dashboard."
                : "Crie sua conta para começar a gerar conteúdo dark."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input type="email" placeholder="hacker@darkfy.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Senha
                </label>
                <Input type="password" placeholder="••••••••" required />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Confirmar Senha
                  </label>
                  <Input type="password" placeholder="••••••••" required />
                </div>
              )}
              <Button type="submit" variant="neon" className="w-full mt-6">
                {isLogin ? "Entrar" : "Cadastrar"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-400 hover:text-[#7B2EFF] transition-colors"
              >
                {isLogin
                  ? "Não tem uma conta? Cadastre-se"
                  : "Já tem uma conta? Faça login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
