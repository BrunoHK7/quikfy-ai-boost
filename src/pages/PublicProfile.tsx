import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Brain, MapPin, Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PublicProfileData {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  city: string;
  state: string;
  country: string;
  occupation: string;
  role: string;
  created_at: string;
}

interface Photo {
  id: string;
  photo_url: string;
  caption: string;
}

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchPublicProfile(userId);
    }
  }, [userId]);

  const fetchPublicProfile = async (id: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, bio, avatar_url, city, state, country, occupation, role, created_at')
        .eq('id', id)
        .eq('show_public_profile', true)
        .single();

      if (profileError || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch photos
      const { data: photosData } = await supabase
        .from('profile_photos')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(9);

      setPhotos(photosData || []);
    } catch (error) {
      console.error('Error fetching public profile:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-700 border-red-200">ADMIN</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">VIP MEMBER</Badge>;
      case 'pro':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">PRO MEMBER</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">FREE MEMBER</Badge>;
    }
  };

  const getOccupationLabel = (occupation: string) => {
    if (!occupation) return 'Não informado';
    switch (occupation) {
      case 'empresario':
        return 'Empresário';
      case 'autonomo':
        return 'Autônomo';
      case 'funcionario':
        return 'Funcionário';
      default:
        return occupation;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Perfil não encontrado</h1>
          <p className="text-gray-600 mb-8">Este perfil não existe ou está privado.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
          </Link>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                {getRoleBadge(profile.role)}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{profile.full_name}</h1>
                
                {profile.bio && (
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center justify-center md:justify-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.city}, {profile.state}, {profile.country}
                  </div>
                  <div className="flex items-center justify-center md:justify-start text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center justify-center md:justify-start text-gray-600">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {getOccupationLabel(profile.occupation)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos Section */}
        {photos.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Fotos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || "Foto do perfil"}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    {photo.caption && (
                      <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Conquistas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Membro {profile.role.toUpperCase()}</div>
                  <div className="text-sm text-gray-600">Status atual da conta</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicProfile;
