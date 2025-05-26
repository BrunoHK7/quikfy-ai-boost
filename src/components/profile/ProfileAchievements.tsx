
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Star } from "lucide-react";

interface ProfileAchievementsProps {
  profile: any;
  projectsCount: number;
}

export const ProfileAchievements = ({ profile, projectsCount }: ProfileAchievementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conquistas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="font-medium">Designer Pro</div>
              <div className="text-sm text-gray-600">{projectsCount} carrosséis criados</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="font-medium">Membro {profile.role.toUpperCase()}</div>
              <div className="text-sm text-gray-600">Status atual da conta</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
