'use client';

import React from 'react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          {/* Logo area */}
          <span className="text-2xl font-bold text-primary-900">dados.gov</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-neutral-600 font-medium">
          <Link
            href="/datasets"
            className="hover:text-primary-600 transition-colors"
          >
            Conjuntos de dados
          </Link>
          <a href="#" className="hover:text-primary-600 transition-colors">
            Organizações
          </a>
          <a href="#" className="hover:text-primary-600 transition-colors">
            Reutilizações
          </a>
          <a href="#" className="hover:text-primary-600 transition-colors">
            Documentação
          </a>
          <div className="border-l border-neutral-300 h-6 mx-2"></div>
          <a href="#" className="hover:text-primary-600 transition-colors">
            Entrar / Registar
          </a>
        </nav>
      </div>
    </header>
  );
};
