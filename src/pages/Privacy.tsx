
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações que Coletamos</h2>
              <p className="text-gray-700 mb-4">
                Coletamos informações que você nos fornece diretamente, como:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Nome, email e informações de perfil</li>
                <li>Conteúdo criado na plataforma</li>
                <li>Informações de pagamento (processadas por terceiros seguros)</li>
                <li>Comunicações conosco</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Como Usamos suas Informações</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos e gerenciar sua conta</li>
                <li>Enviar comunicações importantes sobre o serviço</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
              <p className="text-gray-700 mb-4">
                Não vendemos suas informações pessoais. Podemos compartilhar dados apenas:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Com provedores de serviços necessários para operação da plataforma</li>
                <li>Quando exigido por lei ou processo legal</li>
                <li>Para proteger nossos direitos e segurança</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
                analisar o uso da plataforma e personalizar conteúdo. Você pode controlar 
                o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Segurança dos Dados</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas técnicas e organizacionais apropriadas para proteger 
                suas informações pessoais contra acesso não autorizado, alteração, 
                divulgação ou destruição.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Seus Direitos</h2>
              <p className="text-gray-700 mb-4">
                Você tem o direito de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Retirar consentimento a qualquer momento</li>
                <li>Exportar seus dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Retenção de Dados</h2>
              <p className="text-gray-700 mb-4">
                Mantemos suas informações pelo tempo necessário para fornecer nossos serviços 
                e cumprir obrigações legais. Quando você exclui sua conta, removemos suas 
                informações pessoais, exceto quando a retenção for exigida por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Alterações nesta Política</h2>
              <p className="text-gray-700 mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                sobre mudanças significativas através de email ou aviso na plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contato</h2>
              <p className="text-gray-700 mb-4">
                Para questões sobre esta Política de Privacidade ou seus dados pessoais, 
                entre em contato: contato@quikfy.com
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
