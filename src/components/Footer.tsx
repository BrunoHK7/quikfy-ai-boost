
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Sobre', href: '/about' },
    { label: 'Termos de uso', href: '/terms' },
    { label: 'Política de privacidade', href: '/privacy' },
    { label: 'Suporte', href: '/support' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/quikfy/', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contato@quikfy.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e descrição */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="text-purple-600" size={32} />
              <span className="text-xl font-bold text-gray-900">Quikfy</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-md">
              A caixa de ferramentas definitiva para fazer seu negócio crescer. 
              Automatize processos e crie conteúdos que convertem.
            </p>
          </div>

          {/* Links úteis */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Links úteis</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes sociais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Siga-nos</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : '_self'}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-9 h-9 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-300 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Quikfy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
