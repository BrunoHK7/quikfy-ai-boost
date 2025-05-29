
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
    <div className="min-h-screen bg-[#131313] dark:bg-[#131313] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Brain className="w-10 h-10 text-purple-600" />
            <span className="text-3xl font-bold text-white dark:text-white">QUIKFY</span>
          </Link>
          <p className="text-gray-300 dark:text-gray-300 mt-2">Verifique seu email para continuar</p>
        </div>

        <Card className="shadow-xl border-0 bg-[#1a1a1a] dark:bg-[#1a1a1a] border-gray-700 dark:border-gray-700">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white dark:text-white">
              Confirme seu Email
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-gray-300 dark:text-gray-300 mb-2">
                Enviamos um link de confirmação para:
              </p>
              <p className="font-medium text-white dark:text-white">{email}</p>
            </div>

            <div className="text-sm text-gray-400 dark:text-gray-400 space-y-2">
              <p>• Verifique sua caixa de entrada</p>
              <p>• Não esqueça de verificar o spam</p>
              <p>• Clique no link para ativar sua conta</p>
            </div>

            <Button 
              onClick={handleResendEmail}
              variant="outline"
              className="w-full border-gray-600 bg-transparent text-white hover:bg-purple-600 hover:border-purple-600"
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

            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-300 dark:text-gray-300">
                Já confirmou seu email?{" "}
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

export default EmailVerification;
