
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Ao acessar e usar a plataforma Quikfy, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-700 mb-4">
                A Quikfy é uma plataforma digital que oferece ferramentas para criação de conteúdo, incluindo 
                design de carrosséis, geração de conteúdo por inteligência artificial e outras funcionalidades 
                relacionadas ao marketing digital.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Uso Adequado</h2>
              <p className="text-gray-700 mb-4">
                Você concorda em usar a plataforma apenas para fins legais e de acordo com estes Termos. 
                É proibido:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Usar o serviço para atividades ilegais ou não autorizadas</li>
                <li>Tentar hackear, comprometer ou prejudicar a segurança da plataforma</li>
                <li>Compartilhar conteúdo ofensivo, difamatório ou que viole direitos de terceiros</li>
                <li>Criar múltiplas contas para contornar limitações do serviço</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Propriedade Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Todo o conteúdo criado por você na plataforma permanece de sua propriedade. A Quikfy mantém 
                os direitos sobre a plataforma, tecnologia e ferramentas fornecidas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Assinaturas e Pagamentos</h2>
              <p className="text-gray-700 mb-4">
                Os planos pagos são cobrados conforme descrito na página de preços. Os pagamentos são 
                processados através de provedores terceirizados seguros. O cancelamento pode ser feito 
                a qualquer momento através das configurações da conta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 mb-4">
                A Quikfy não se responsabiliza por danos indiretos, incidentais ou consequenciais 
                resultantes do uso da plataforma. Nosso serviço é fornecido "como está".
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modificações dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Reservamos o direito de modificar estes termos a qualquer momento. As alterações 
                entrarão em vigor imediatamente após a publicação na plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contato</h2>
              <p className="text-gray-700 mb-4">
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do email: 
                contato@quikfy.com
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

export default Terms;
