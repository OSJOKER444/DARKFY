import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { UserCircle, Key, Bell } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Configurações
        </h1>
        <p className="text-gray-400 mt-1">Gerencie sua conta e preferências.</p>
      </div>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-[#7B2EFF]" />
            Perfil da Conta
          </CardTitle>
          <CardDescription>
            Atualize seu email e informações básicas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Email</label>
            <Input defaultValue="hacker@darkfy.com" />
          </div>
          <Button variant="outline">Salvar Alterações</Button>
        </CardContent>
      </Card>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#7B2EFF]" />
            Segurança
          </CardTitle>
          <CardDescription>Altere sua senha de acesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Senha Atual</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Nova Senha</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              Confirmar Nova Senha
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button variant="outline">Atualizar Senha</Button>
        </CardContent>
      </Card>

      <Card className="bg-[#141414] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#7B2EFF]" />
            Preferências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-[#2A2A2A] rounded-lg bg-[#0A0A0A]">
            <div>
              <p className="font-medium">Notificações de Sistema</p>
              <p className="text-sm text-gray-400">
                Receba alertas sobre atualizações da plataforma.
              </p>
            </div>
            <div className="w-10 h-6 bg-[#7B2EFF] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
