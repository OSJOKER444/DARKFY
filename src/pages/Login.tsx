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
import { Crown } from "lucide-react";
import { signInWithGoogle, loginWithEmail, registerWithEmail } from "../firebase";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setIsLoading(true);
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(`Erro ao fazer login com Google: ${err.message || "Tente novamente."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Email ou senha incorretos.");
      } else if (err.code === 'auth/weak-password') {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError(`Erro na autenticação: ${err.message || "Tente novamente."}`);
      }
    } finally {
      setIsLoading(false);
    }
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
            <Crown className="w-8 h-8 text-[#7B2EFF]" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-wider text-white">
            DARKFY
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Monetize sem aparecer.</p>
        </div>

        <Card className="border-[#2A2A2A] bg-[#141414]/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle>
              {isLogin ? "Acessar Plataforma" : "Criar Conta"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Entre com suas credenciais para acessar o dashboard."
                : "Crie sua conta para começar a gerar conteúdo dark."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col pt-4">
            <form onSubmit={handleEmailAuth} className="space-y-4 w-full">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input 
                  type="email" 
                  placeholder="hacker@darkfy.com" 
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Senha
                </label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Confirmar Senha
                  </label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-[#0A0A0A] border-[#2A2A2A] text-white focus-visible:ring-[#7B2EFF]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
              )}
              <Button type="submit" variant="neon" className="w-full mt-6 py-6 text-lg" disabled={isLoading}>
                {isLoading ? "Processando..." : (isLogin ? "Entrar com Email" : "Cadastrar com Email")}
              </Button>
            </form>

            <div className="relative my-6 w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#2A2A2A]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#141414] px-2 text-gray-400">Ou continue com</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-[#2A2A2A] hover:bg-[#2A2A2A] text-white py-6 text-lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isLoading ? "Conectando..." : "Entrar com Google"}
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md w-full">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="mt-6 text-center text-sm w-full">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-gray-400 hover:text-[#7B2EFF] transition-colors"
                type="button"
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
