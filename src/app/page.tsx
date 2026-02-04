'use client';

import { Button, InputSearch, Icon } from '@ama-pt/agora-design-system';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary-900 text-white pt-24 pb-32 relative overflow-hidden">
          {/* Abstract geometric shapes or gradient could go here as background elements */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Plataforma aberta
                <br />
                <span className="text-primary-300">
                  de dados públicos portugueses
                </span>
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
                Aceda, explore e reutilize dados da Administração Pública para
                criar novos serviços e aplicações.
              </p>

              <div className="bg-white p-2 rounded-8 shadow-top-medium flex items-center max-w-2xl">
                <div className="flex-grow">
                  <InputSearch
                    id="hero-search"
                    label="O que procura no Portal?"
                    placeholder="Ex: População, Transportes, Saúde..."
                    hideLabel={true}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <Button variant="primary">Explorar Catálogo</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white -mt-8 relative z-20 rounded-t-3xl border-t border-neutral-100 shadow-top-low md:mt-0 md:bg-transparent md:border-none md:shadow-none">
          <div className="container mx-auto px-4">
            <div className="bg-white md:rounded-16 md:shadow-center-medium p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 bg-primary-50 rounded-8 flex items-center justify-center text-primary-600">
                  <Icon name="agora-line-file" aria-hidden="true" />
                </div>
                <span className="text-3xl font-bold text-neutral-900">
                  47,885
                </span>
                <span className="text-neutral-600">Conjuntos de dados</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 bg-danger-50 rounded-8 flex items-center justify-center text-danger-600">
                  <Icon name="agora-line-buildings" aria-hidden="true" />
                </div>
                <span className="text-3xl font-bold text-neutral-900">
                  3,414
                </span>
                <span className="text-neutral-600">Organizações</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 bg-success-50 rounded-8 flex items-center justify-center text-success-600">
                  <Icon name="agora-line-refresh-ccw" aria-hidden="true" />
                </div>
                <span className="text-3xl font-bold text-neutral-900">835</span>
                <span className="text-neutral-600">Reutilizações</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 bg-warning-50 rounded-8 flex items-center justify-center text-warning-600">
                  <Icon name="agora-line-share" aria-hidden="true" />
                </div>
                <span className="text-3xl font-bold text-neutral-900">124</span>
                <span className="text-neutral-600">Harvesters</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Datasets */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-primary-900 mb-8">
              Conjunto de Dados em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-8 shadow-center-low hover:shadow-center-medium transition-shadow border border-neutral-200"
                >
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded mb-3">
                    CSV
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    Indicadores de Qualidade do Ar
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    Monitorização da qualidade do ar em várias estações de
                    medição em Portugal Continental.
                  </p>
                  <div className="flex items-center text-xs text-neutral-500 gap-2">
                    <Icon
                      name="agora-line-clock"
                      aria-hidden="true"
                      className="w-4 h-4"
                    />
                    <span>10 min</span>
                    <span className="mx-1">•</span>
                    <Icon
                      name="agora-line-buildings"
                      aria-hidden="true"
                      className="w-4 h-4"
                    />
                    <span>APA</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button variant="neutral">Ver mais</Button>
            </div>
          </div>
        </section>

        {/* Reuses */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-primary-900 mb-8">
              Reutilizações em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="h-48 bg-neutral-200 rounded-8 mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-primary-900/0 transition-colors"></div>
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      Image Placeholder {i}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors">
                    Gestão de resíduos contentores e ecopontos
                  </h3>
                  <p className="text-sm text-neutral-600 mt-2">CM Oeiras</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
