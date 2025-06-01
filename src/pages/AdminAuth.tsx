
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StandardHeader } from '@/components/StandardHeader';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'Showmethemoney7&';

const AdminAuth = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pegar a URL de destino dos parâmetros da URL
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/admin';

  console.log('🔐 AdminAuth - Component loaded:', {
    returnTo,
    currentPath: location.pathname
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular um pequeno delay para melhor UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        console.log('✅ AdminAuth - Password correct, storing session');
        
        // Armazenar no sessionStorage que o usuário está autenticado como admin
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminAuthTime', Date.now().toString());
        
        toast.success('Acesso autorizado!');
        navigate(returnTo);
      } else {
        console.log('❌ AdminAuth - Incorrect password');
        toast.error('Senha incorreta');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <StandardHeader 
          title="Acesso Administrativo" 
          showBackButton={true}
        />

        <Card className="mt-8">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>Área Restrita</CardTitle>
            <p className="text-sm text-muted-foreground">
              Digite a senha para acessar a área administrativa
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Senha de Administrador</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || !password}
              >
                {isLoading ? 'Verificando...' : 'Acessar'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-2">ℹ️ Informações:</p>
              <ul className="space-y-1 text-xs">
                <li>• A autenticação é válida apenas para esta sessão</li>
                <li>• Feche o navegador para fazer logout automático</li>
                <li>• Entre em contato com o administrador se precisar de acesso</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
