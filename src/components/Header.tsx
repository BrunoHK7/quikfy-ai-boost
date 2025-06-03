
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Menu, X, User, Settings, LogOut, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isSubscribed = profile?.subscription_status === 'active';

  const navigationItems = [
    { label: 'Ferramentas', href: '#ferramentas', external: false },
    { label: 'Cursos', href: '/pricing', external: false },
    { 
      label: 'Comunidade', 
      href: '#', 
      external: false, 
      disabled: true,
      badge: 'Em breve'
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Quikfy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.disabled ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 cursor-not-allowed">
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    Meu Perfil
                  </Button>
                </Link>
                
                {isSubscribed ? (
                  <Link to="/settings">
                    <Button variant="outline" size="sm">
                      <Crown className="w-4 h-4 mr-2" />
                      Gerenciar Assinatura
                    </Button>
                  </Link>
                ) : (
                  <Link to="/pricing">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Assinar Agora
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Criar Conta
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.disabled ? (
                    <div className="flex items-center justify-between px-2 py-2">
                      <span className="text-gray-400">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-2 py-2 text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="border-t pt-4 space-y-2">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Meu Perfil
                      </Button>
                    </Link>
                    {isSubscribed ? (
                      <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <Crown className="w-4 h-4 mr-2" />
                          Gerenciar Assinatura
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          Assinar Agora
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Criar Conta
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
