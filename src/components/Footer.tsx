'use client';

import React from 'react';
import { Icon } from '@ama-pt/agora-design-system';

export const Footer = () => {
  const linkColumns = [
    {
      title: 'Dados abertos',
      links: [
        { href: '#', label: 'Temas' },
        { href: '#', label: 'Dados de referência' },
        { href: '#', label: 'Catálogo de dados' },
        { href: '#', label: 'Acompanhe a abertura dos dados' },
        { href: '#', label: 'Portal de dados' },
      ],
    },
    {
      title: 'Plataforma',
      links: [
        { href: '#', label: 'Guias' },
        { href: '#', label: 'Roteiro e novos desenvolvimentos' },
        { href: '#', label: 'Escreva-nos' },
        { href: '#', label: 'Interaja com a comunidade' },
        { href: '#', label: 'Estatísticas' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },
        { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },
        { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },
        { href: 'https://loremipsum.dados.gov.pt', label: 'loremipsum.dados.gov.pt' },
      ],
    },
    {
      title: 'Desenvolvimento',
      links: [
        { href: '#', label: 'API do portal' },
        { href: '#', label: 'Motor de código aberto: udata (14.7.2)' },
        { href: '#', label: 'Interface de usuário de data.gov.pt: cdata (jj2422c)' },
      ],
    },
  ];

  const socialLinks = [
    { icon: 'agora-line-facebook', href: 'https://facebook.com', label: 'Facebook' },
    { icon: 'agora-line-linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'agora-line-twitter', href: 'https://twitter.com', label: 'X (Twitter)' },
  ];

  const usefulLinks = [
    { href: '#', label: 'República Portuguesa' },
    { href: '#', label: 'Compete 2020' },
    { href: '#', label: 'Portugal 2020' },
    { href: '#', label: 'Comissão Europeia' },
  ];

  return (
    <footer className="bg-primary-900 text-white">
      {/* Links Section */}
      <div className="container mx-auto px-4 py-12">
        <h3 className="text-lg font-bold mb-8">Mais para descobrir no portal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {linkColumns.map((column, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-4 text-white">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-white hover:underline text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Brand & Partners Section */}
      <div className="border-t border-primary-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white text-sm">
              Plataforma aberta de dados públicos portugueses
            </p>
            <div className="flex items-center gap-6">
              <img src="/NextGenerationEU.svg" alt="NextGenerationEU" />
              <img src="/República Portuguesa.svg" alt="República Portuguesa" />
              <img src="/ARTE.svg" alt="ARTE" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Two columns with divider */}
      <div className="border-t border-primary-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row min-h-[120px]">
            {/* Left Column - Social Links */}
            <div className="flex items-center justify-center md:justify-center gap-16 py-8 md:w-1/3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  <Icon name={social.icon} className="w-6 h-6 fill-white" />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-primary-600 self-stretch"></div>

            {/* Right Column - Useful Links & Copyright */}
            <div className="flex-1 flex flex-col justify-center py-8 md:pl-12">
              {/* Useful Links */}
              <div className="flex flex-wrap items-center justify-end md:justify-end gap-8 text-sm mb-4">
                {usefulLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    className="text-white hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Copyright */}
              <div className="flex justify-end text-neutral-500 text-sm">
                © 2022 República Portuguesa. Todos os direitos reservados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
