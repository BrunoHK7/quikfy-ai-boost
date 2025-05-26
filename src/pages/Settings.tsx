import { useState, useEffect } from "react";
import { Brain, ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [showPublicProfile, setShowPublicProfile] = useState(false);
  const [language, setLanguage] = useState("pt");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    if (profile) {
      setShowPublicProfile(profile.show_public_profile || false);
    }
  }, [profile]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        show_public_profile: showPublicProfile,
      });

      if (error) {
        toast.error("Erro ao salvar configurações");
      } else {
        toast.success("Configurações salvas com sucesso!");
      }
    } catch (error) {
      toast.error("Erro inesperado ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      try {
        // In a real app, you would call a server function to delete the account
        toast.error("Funcionalidade em desenvolvimento. Entre em contato com o suporte.");
      } catch (error) {
        toast.error("Erro ao excluir conta");
      }
    }
  };

  const getPublicProfileUrl = () => {
    if (user && showPublicProfile) {
      return `${window.location.origin}/public-profile/${user.id}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
          </Link>
          <Link to="/profile">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Perfil
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações de conta</p>
        </div>

        <div className="space-y-6">
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">Perfil Público</div>
                  <div className="text-sm text-gray-500">
                    Permite que outros usuários vejam seu perfil publicamente
                  </div>
                </div>
                <Switch
                  checked={showPublicProfile}
                  onCheckedChange={setShowPublicProfile}
                />
              </div>
              
              {showPublicProfile && getPublicProfileUrl() && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 mb-2">Seu perfil público está disponível em:</p>
                  <p className="text-sm font-mono bg-white p-2 rounded border break-all">
                    {getPublicProfileUrl()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Idioma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">Idioma da Interface</div>
                  <div className="text-sm text-gray-500">
                    Escolha o idioma da aplicação
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português (BR)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">Notificações por Email</div>
                  <div className="text-sm text-gray-500">
                    Receba atualizações importantes por email
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">Emails de Marketing</div>
                  <div className="text-sm text-gray-500">
                    Receba novidades e ofertas especiais
                  </div>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-base mb-2">Email da Conta</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-base text-red-600 mb-2">Zona de Perigo</div>
                  <p className="text-sm text-gray-500 mb-4">
                    Ações irreversíveis relacionadas à sua conta
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    size="sm"
                  >
                    Excluir Conta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
