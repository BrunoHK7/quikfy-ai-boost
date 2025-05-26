
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Mail, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const { resendConfirmation } = useAuth();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email não encontrado");
      return;
    }

    setLoading(true);
    try {
      const { error } = await resendConfirmation(email);
      
      if (error) {
        toast.error("Erro ao reenviar email de confirmação");
      } else {
        toast.success("Email de confirmação reenviado!");
      }
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Brain className="w-10 h-10 text-purple-600" />
            <span className="text-3xl font-bold text-gray-900">QUIKFY</span>
          </Link>
          <p className="text-gray-600 mt-2">Verifique seu email para continuar</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Confirme seu Email
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-gray-600 mb-2">
                Enviamos um link de confirmação para:
              </p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <p>• Verifique sua caixa de entrada</p>
              <p>• Não esqueça de verificar o spam</p>
              <p>• Clique no link para ativar sua conta</p>
            </div>

            <Button 
              onClick={handleResendEmail}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reenviando...
                </>
              ) : (
                "Reenviar Email"
              )}
            </Button>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Já confirmou seu email?{" "}
                <Link to="/login" className="text-purple-600 hover:text-purple-500 font-medium">
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

export default EmailVerification;
