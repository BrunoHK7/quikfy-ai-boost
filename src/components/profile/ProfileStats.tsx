
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Camera, Trophy, ImageIcon, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileStatsProps {
  projectsCount: number;
}

export const ProfileStats = ({ projectsCount }: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-2 space-y-6">
        {/* Revenue Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Estatísticas de Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">R$ 0</div>
                <div className="text-sm text-gray-600">Total Faturado</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">R$ 0</div>
                <div className="text-sm text-gray-600">Este Mês</div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              <Trophy className="w-4 h-4 mr-2" />
              Comprovar Faturamento
            </Button>
          </CardContent>
        </Card>

        {/* Recent Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Fotos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Camera className="w-4 h-4 mr-2" />
              Adicionar Foto
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons & Achievements */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/carousel-creator">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <ImageIcon className="w-4 h-4 mr-2" />
                Criar Carrossel
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Criar Post
            </Button>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Carrosséis Criados</span>
                <span className="font-semibold">{projectsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Posts na Comunidade</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lives Assistidas</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
