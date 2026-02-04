import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">Mais para descobrir no portal</h4>
            <ul className="space-y-2 text-primary-100 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Dados Abertos
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Aplicações
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Organizações
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-primary-100 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Termos de uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Política de privacidade
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Parceiros</h4>
            <ul className="space-y-2 text-primary-100 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  AMA
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  DSPA
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-200">
          <span>República Portuguesa</span>
          <span>© 2026 dados.gov.pt. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
};
