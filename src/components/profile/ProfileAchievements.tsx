
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Star } from "lucide-react";

interface ProfileAchievementsProps {
  profile: any;
  projectsCount: number;
}

export const ProfileAchievements = ({ profile, projectsCount }: ProfileAchievementsProps) => {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Conquistas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-white border border-green-200 hover:border-green-300 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Designer Pro</div>
              <div className="text-sm text-gray-600">{projectsCount} carrosséis criados</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-white border border-purple-200 hover:border-purple-300 transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Membro {profile.role.toUpperCase()}</div>
              <div className="text-sm text-gray-600">Status atual da conta</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
