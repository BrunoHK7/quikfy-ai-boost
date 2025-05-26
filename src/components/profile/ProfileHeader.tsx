
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Edit3, MapPin, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileHeaderProps {
  profile: any;
  updateProfile: (updates: any) => Promise<{ error?: any }>;
  uploadAvatar: (file: File) => Promise<{ error?: any; data?: string }>;
}

export const ProfileHeader = ({ profile, updateProfile, uploadAvatar }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for editing with fallback values
  const [editFullName, setEditFullName] = useState(profile?.full_name || "");
  const [editPhone, setEditPhone] = useState(profile?.phone || "");
  const [editCity, setEditCity] = useState(profile?.city || "");
  const [editState, setEditState] = useState(profile?.state || "");
  const [editCountry, setEditCountry] = useState(profile?.country || "");
  const [editOccupation, setEditOccupation] = useState(profile?.occupation || "");
  const [editBio, setEditBio] = useState(profile?.bio || "");

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: editFullName,
        phone: editPhone,
        city: editCity,
        state: editState,
        country: editCountry,
        occupation: editOccupation,
        bio: editBio,
      });

      if (error) {
        toast.error("Erro ao atualizar perfil");
      } else {
        toast.success("Perfil atualizado com sucesso!");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Erro inesperado ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setAvatarLoading(true);
    try {
      const { error } = await uploadAvatar(file);
      
      if (error) {
        toast.error("Erro ao fazer upload da imagem");
      } else {
        toast.success("Avatar atualizado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro inesperado ao fazer upload");
    } finally {
      setAvatarLoading(false);
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

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {avatarLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            {getRoleBadge(profile.role)}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{profile.full_name || 'Usuário'}</h1>
              <Button 
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                variant="outline"
                className="border-purple-600 text-purple-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? "Salvar" : "Editar Perfil"}
                  </>
                )}
              </Button>
            </div>

            {/* Bio */}
            {!isEditing && profile.bio && (
              <div className="mb-4">
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                    <Input
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Telefone</label>
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cidade</label>
                    <Input
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <Input
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">País</label>
                    <Input
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ocupação</label>
                    <Select value={editOccupation} onValueChange={setEditOccupation}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empresario">Empresário</SelectItem>
                        <SelectItem value="autonomo">Autônomo</SelectItem>
                        <SelectItem value="funcionario">Funcionário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <Textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profile.city || 'Cidade'}, {profile.state || 'Estado'}, {profile.country || 'País'}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center text-gray-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {getOccupationLabel(profile.occupation)}
                </div>
              </div>
            )}

            {isEditing && (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="mr-2"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
