
import React, { createContext, useContext } from 'react';

type Language = 'pt' | 'en' | 'es';

interface Translations {
  [key: string]: {
    pt: string;
    en: string;
    es: string;
  };
}

const translations: Translations = {
  // Navigation and common
  'nav.home': { pt: 'Início', en: 'Home', es: 'Inicio' },
  'nav.profile': { pt: 'Perfil', en: 'Profile', es: 'Perfil' },
  'nav.settings': { pt: 'Configurações', en: 'Settings', es: 'Configuración' },
  'nav.logout': { pt: 'Sair', en: 'Logout', es: 'Cerrar Sesión' },
  
  // Profile page
  'profile.title': { pt: 'Meu Perfil', en: 'My Profile', es: 'Mi Perfil' },
  'profile.edit': { pt: 'Editar Perfil', en: 'Edit Profile', es: 'Editar Perfil' },
  'profile.save': { pt: 'Salvar', en: 'Save', es: 'Guardar' },
  'profile.cancel': { pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' },
  'profile.overview': { pt: 'Visão Geral', en: 'Overview', es: 'Resumen' },
  'profile.projects': { pt: 'Meus Projetos', en: 'My Projects', es: 'Mis Proyectos' },
  'profile.photos': { pt: 'Fotos', en: 'Photos', es: 'Fotos' },
  'profile.achievements': { pt: 'Conquistas', en: 'Achievements', es: 'Logros' },
  'profile.addPhoto': { pt: 'Adicionar Foto', en: 'Add Photo', es: 'Agregar Foto' },
  
  // Settings page
  'settings.title': { pt: 'Configurações', en: 'Settings', es: 'Configuración' },
  'settings.privacy': { pt: 'Privacidade', en: 'Privacy', es: 'Privacidad' },
  'settings.publicProfile': { pt: 'Perfil Público', en: 'Public Profile', es: 'Perfil Público' },
  'settings.publicProfileDesc': { pt: 'Permite que outros usuários vejam seu perfil publicamente', en: 'Allows other users to view your profile publicly', es: 'Permite que otros usuarios vean tu perfil públicamente' },
  'settings.language': { pt: 'Idioma', en: 'Language', es: 'Idioma' },
  'settings.languageDesc': { pt: 'Escolha o idioma da aplicação', en: 'Choose the application language', es: 'Elige el idioma de la aplicación' },
  'settings.theme': { pt: 'Tema', en: 'Theme', es: 'Tema' },
  'settings.themeDesc': { pt: 'Escolha entre tema claro ou escuro', en: 'Choose between light or dark theme', es: 'Elige entre tema claro u oscuro' },
  'settings.notifications': { pt: 'Notificações', en: 'Notifications', es: 'Notificaciones' },
  'settings.emailNotifications': { pt: 'Notificações por Email', en: 'Email Notifications', es: 'Notificaciones por Email' },
  'settings.emailNotificationsDesc': { pt: 'Receba atualizações importantes por email', en: 'Receive important updates by email', es: 'Recibe actualizaciones importantes por email' },
  'settings.marketingEmails': { pt: 'Emails de Marketing', en: 'Marketing Emails', es: 'Emails de Marketing' },
  'settings.marketingEmailsDesc': { pt: 'Receba novidades e ofertas especiais', en: 'Receive news and special offers', es: 'Recibe noticias y ofertas especiales' },
  'settings.account': { pt: 'Conta', en: 'Account', es: 'Cuenta' },
  'settings.dangerZone': { pt: 'Zona de Perigo', en: 'Danger Zone', es: 'Zona de Peligro' },
  'settings.deleteAccount': { pt: 'Excluir Conta', en: 'Delete Account', es: 'Eliminar Cuenta' },
  'settings.saveSettings': { pt: 'Salvar Configurações', en: 'Save Settings', es: 'Guardar Configuración' },
  
  // Language options
  'language.portuguese': { pt: 'Português (BR)', en: 'Portuguese (BR)', es: 'Portugués (BR)' },
  'language.english': { pt: 'English', en: 'English', es: 'English' },
  'language.spanish': { pt: 'Español', en: 'Spanish', es: 'Español' },
  
  // Theme options
  'theme.light': { pt: 'Claro', en: 'Light', es: 'Claro' },
  'theme.dark': { pt: 'Escuro', en: 'Dark', es: 'Oscuro' },
  
  // Messages
  'message.loading': { pt: 'Carregando...', en: 'Loading...', es: 'Cargando...' },
  'message.saving': { pt: 'Salvando...', en: 'Saving...', es: 'Guardando...' },
  'message.settingsSaved': { pt: 'Configurações salvas com sucesso!', en: 'Settings saved successfully!', es: '¡Configuración guardada exitosamente!' },
  'message.error': { pt: 'Erro ao salvar configurações', en: 'Error saving settings', es: 'Error al guardar configuración' }
};

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: React.ReactNode;
  language: Language;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children, language }) => {
  const t = (key: string): string => {
    const translation = translations[key];
    if (translation && translation[language]) {
      return translation[language];
    }
    return key; // Return key if translation not found
  };

  return (
    <TranslationContext.Provider value={{ t, language }}>
      {children}
    </TranslationContext.Provider>
  );
};
