import { useState, useEffect } from "react";
import { Brain, ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useTranslation } from "@/contexts/TranslationContext";
import { toast } from "sonner";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useTranslation();
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
    if (preferences) {
      setLanguage(preferences.language || "pt");
    }
  }, [profile, preferences]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Update profile settings
      const profileResult = await updateProfile({
        show_public_profile: showPublicProfile,
      });

      // Update user preferences
      const preferencesResult = await updatePreferences({
        language,
      });

      if (profileResult.error || preferencesResult.error) {
        toast.error(t('message.error'));
      } else {
        toast.success(t('message.settingsSaved'));
      }
    } catch (error) {
      toast.error(t('message.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      try {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-foreground">QUIKFY</span>
          </Link>
          <Link to="/profile">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('nav.profile')}
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('settings.title')}</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações de conta</p>
        </div>

        <div className="space-y-6">
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.privacy')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">{t('settings.publicProfile')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.publicProfileDesc')}
                  </div>
                </div>
                <Switch
                  checked={showPublicProfile}
                  onCheckedChange={setShowPublicProfile}
                />
              </div>
              
              {showPublicProfile && getPublicProfileUrl() && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">Seu perfil público está disponível em:</p>
                  <p className="text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded border break-all">
                    {getPublicProfileUrl()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.language')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">{t('settings.language')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.languageDesc')}
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">{t('language.portuguese')}</SelectItem>
                    <SelectItem value="en">{t('language.english')}</SelectItem>
                    <SelectItem value="es">{t('language.spanish')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notifications')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">{t('settings.emailNotifications')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.emailNotificationsDesc')}
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">{t('settings.marketingEmails')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.marketingEmailsDesc')}
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
              <CardTitle>{t('settings.account')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-base mb-2">Email da Conta</div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-base text-red-600 mb-2">{t('settings.dangerZone')}</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ações irreversíveis relacionadas à sua conta
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    size="sm"
                  >
                    {t('settings.deleteAccount')}
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
                  {t('message.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('settings.saveSettings')}
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
