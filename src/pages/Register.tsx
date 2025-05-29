
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName, phone, city, state, country, occupation);

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(error.message || "Erro ao criar conta");
        }
      } else {
        toast.success("Conta criada! Verifique seu email para confirmar.");
        navigate("/email-verification", { state: { email } });
      }
    } catch (error: any) {
      toast.error("Erro inesperado ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] dark:bg-[#131313] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Brain className="w-10 h-10 text-purple-600" />
            <span className="text-3xl font-bold text-white dark:text-white">QUIKFY</span>
          </Link>
          <p className="text-gray-300 dark:text-gray-300 mt-2">Crie sua conta e transforme seu negócio</p>
        </div>

        <Card className="shadow-xl border-0 bg-[#1a1a1a] dark:bg-[#1a1a1a] border-gray-700 dark:border-gray-700">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white dark:text-white">
              Criar Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white dark:text-white">Nome Completo *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-gray-600 dark:border-gray-600 focus:border-purple-500 bg-[#131313] dark:bg-[#131313] text-white dark:text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dark:text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-600 dark:border-gray-600 focus:border-purple-500 bg-[#131313] dark:bg-[#131313] text-white dark:text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white dark:text-white">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-gray-600 dark:border-gray-600 focus:border-purple-500 bg-[#131313] dark:bg-[#131313] text-white dark:text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white dark:text-white">Cidade *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="São Paulo"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border-gray-600 dark:border-gray-600 focus:border-purple-500 bg-[#131313] dark:bg-[#131313] text-white dark:text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white dark:text-white">Estado *</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="SP"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border-gray-600 dark:border-gray-600 focus:border-purple-500 bg-[#131313] dark:bg-[#131313] text-white dark:text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-white dark:text-white">País *</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Brasil"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border-gray-600 dark:border-gray-600 focus:border-purple-500 bg-[#131313] dark:bg-[#131313] text-white dark:text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-white dark:text-white">Ocupação *</Label>
                <Select value={occupation} onValueChange={setOccupation} required>
                  <SelectTrigger className="border-gray-600 dark:border-gray-600 focus:border-purple-500 bg-[#131313] dark:bg-[#131313] text-white dark:text-white">
                    <SelectValue placeholder="Selecione sua ocupação" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] dark:bg-[#1a1a1a] border-gray-700 dark:border-gray-700">
                    <SelectItem value="empresario" className="text-white dark:text-white hover:bg-[#131313]">Empresário</SelectItem>
                    <SelectItem value="autonomo" className="text-white dark:text-white hover:bg-[#131313]">Autônomo</SelectItem>
                    <SelectItem value="funcionario" className="text-white dark:text-white hover:bg-[#131313]">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white dark:text-white">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-600 dark:border-gray-600 focus:border-purple-500 pr-10 bg-[#131313] dark:bg-[#131313] text-white dark:text-white placeholder:text-gray-400"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white dark:text-white">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-gray-600 dark:border-gray-600 focus:border-purple-500 bg-[#131313] dark:bg-[#131313] text-white dark:text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300 dark:text-gray-300">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
