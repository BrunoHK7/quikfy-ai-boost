
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Brain className="w-10 h-10 text-purple-600" />
            <span className="text-3xl font-bold text-gray-900">QUIKFY</span>
          </Link>
          <p className="text-gray-600 mt-2">Crie sua conta e transforme seu negócio</p>
        </div>

        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Criar Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Nome Completo *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-gray-300 focus:border-purple-500 bg-white text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-purple-500 bg-white text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-gray-300 focus:border-purple-500 bg-white text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700">Cidade *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="São Paulo"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border-gray-300 focus:border-purple-500 bg-white text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-700">Estado *</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="SP"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border-gray-300 focus:border-purple-500 bg-white text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-700">País *</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Brasil"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border-gray-300 focus:border-purple-500 bg-white text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-gray-700">Ocupação *</Label>
                <Select value={occupation} onValueChange={setOccupation} required>
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 bg-white text-gray-900">
                    <SelectValue placeholder="Selecione sua ocupação" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="empresario" className="text-gray-900 hover:bg-gray-100">Empresário</SelectItem>
                    <SelectItem value="autonomo" className="text-gray-900 hover:bg-gray-100">Autônomo</SelectItem>
                    <SelectItem value="funcionario" className="text-gray-900 hover:bg-gray-100">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-purple-500 pr-10 bg-white text-gray-900 placeholder:text-gray-400"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-gray-300 focus:border-purple-500 bg-white text-gray-900 placeholder:text-gray-400"
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
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
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
