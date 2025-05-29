
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Star } from "lucide-react";

interface ProfileAchievementsProps {
  profile: any;
  projectsCount: number;
}

export const ProfileAchievements = ({ profile, projectsCount }: ProfileAchievementsProps) => {
  return (
    <Card className="bg-[#1a1a1a] dark:bg-[#1a1a1a] border-gray-700 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-white dark:text-white">Conquistas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-[#131313] dark:bg-[#131313] border border-green-600/30">
            <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="font-medium text-white dark:text-white">Designer Pro</div>
              <div className="text-sm text-gray-300 dark:text-gray-300">{projectsCount} carrosséis criados</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-[#131313] dark:bg-[#131313] border border-purple-600/30">
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="font-medium text-white dark:text-white">Membro {profile.role.toUpperCase()}</div>
              <div className="text-sm text-gray-300 dark:text-gray-300">Status atual da conta</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
