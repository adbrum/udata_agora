'use client';

import { Button, InputSearchBar, Icon, CardGeneral, CardArticle } from '@ama-pt/agora-design-system';

export default function Home() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="hero-background bg-primary-900 text-white pt-24 pb-32 relative overflow-hidden">
        {/* Abstract geometric shapes or gradient could go here as background elements */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Plataforma aberta
              <br />
              <span className="font-thin">
                de dados públicos portugueses
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              Aceda, explore e reutilize dados públicos de forma transparente e acessível. Milhares de conjuntos de dados ao seu dispor.
            </p>

            {/* Search Section */}
            <div className="max-w-2xl">
              <p className="text-white text-lg font-medium mb-3">O que procura no Portal?</p>
              <InputSearchBar
                id="hero-search"
                label="Pesquisa"
                hideLabel={true}
                placeholder="Pesquisar datasets, organizações, temas..."
                searchActionAltText="Pesquisar"
              />
              <p className=" text-sm mt-3">
                Exemplos: &quot;educação&quot;, &quot;saúde pública&quot;, &quot;ambiente&quot;
              </p>
            </div>
            <div className="mt-64 flex gap-4">
              <Button
                variant="primary"
                className="!bg-[#5F93FC] !text-primary-900 hover:!bg-[#4a80e8] border-none"
              >
                <span className="flex items-center">
                  <span className="font-normal">Publicar</span>
                  <span className="font-bold mx-1">dados.gov</span>
                  <Icon name="agora-line-arrow-right-circle" aria-hidden="true" className="w-6 h-6 ml-1" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section / Communities */}
      <section className="py-16 bg-white -mt-8 relative z-20 rounded-t-3xl border-t border-neutral-100 shadow-top-low md:mt-0 md:border-none md:shadow-none">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-primary-900">Uma comunidade dinâmica e empenhada</h2>
          <div className="bg-white  md:rounded-16 md:shadow-center-medium p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
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
      {/* Featured Datasets / Card General */}
      <section className="py-16 md:bg-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary-900 mb-2">
            Conjunto de Dados em Destaque
          </h2>
          <p className="text-neutral-600 mb-8 max-w-3xl">Conjuntos de dados mais populares e atualizados.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                time: 'Hoje',
                org: 'Agência Portuguesa do Ambiente',
                title: 'Indicadores de Qualidade do Ar',
                desc: 'Medições diárias da qualidade do ar em estações de monitorização em todo o país.',
                views: '34 567'
              },
              {
                time: '2 dias atrás',
                org: 'Ministério da Saúde',
                title: 'Base de Dados de Estabelecimentos de Saúde',
                desc: 'Lista completa de todos os estabelecimentos de saúde em Portugal, incluindo hospitais, centros de saúde e clínicas.',
                views: '45 678'
              },
              {
                time: '3 dias atrás',
                org: 'Instituto Nacional de Estatística',
                title: 'Dados Demográficos Municipais',
                desc: 'População, densidade, faixas etárias e indicadores demográficos por município.',
                views: '52 341'
              }
            ].map((item, i) => (
              <CardArticle
                key={i}
                hasPill={true}
                pill={{
                  children: item.time,
                  variant: 'primary',
                  appearance: 'solid',
                }}
                title={item.title}
                subtitle={item.org}
                blockedLink={true}
                mainAnchor={{ href: '#' }}
                className="!border-2 !border-[#1A65FA] !bg-white !p-8 min-h-[300px]"
              >
                <div className="flex flex-col h-full mt-4">
                  <p className="text-neutral-600 mb-6 flex-grow">{item.desc}</p>
                  <div className="flex items-center gap-2 font-medium">
                    <Icon name="agora-line-eye" aria-hidden="true" className="w-5 h-5 text-[#1A65FA]" />
                    <span className="text-[#1A65FA]">{item.views}</span>
                  </div>
                </div>
              </CardArticle>
            ))}
          </div>
          <div className="mt-12">
            <Button variant="primary" appearance="outline">Ver mais</Button>
          </div>
        </div>
      </section>

      {/* Utilizado diariamente por */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary-900 mb-8">
            Utilizado diariamente por
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {['arte.svg', 'ADC.svg', 'IMPIC.svg', 'DSPA.svg', 'apa.svg'].map((logo, i) => (
              <div key={i} className="flex items-center justify-center w-full h-20">
                <img
                  src={`/${logo}`}
                  alt={`Logo ${logo.replace('.svg', '')}`}
                  className="max-h-12 max-w-[160px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reuses */}
      <section className="py-16 md:bg-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary-900 mb-2">
            Storytellings em Destaque
          </h2>
          <p className="text-neutral-600 mb-8 max-w-3xl">Storytellings mais populares</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: 'storytelling1.svg',
                title: 'Gestão de resíduos contentores e ecopontos',
                subtitle: 'Publicado a DD MM AAAA'
              },
              {
                img: 'storytelling2.svg',
                title: 'Sistema de Monitorização do Ordenamento do Território (SMOT)',
                subtitle: 'Publicado a DD MM AAAA'
              },
              {
                img: 'storytelling3.svg',
                title: 'Emissões GEE por setor (Portugal) — visualização + API (P7CO®)',
                subtitle: 'Publicado a DD MM AAAA'
              }
            ].map((story, i) => (
              <CardArticle
                key={i}
                image={{
                  src: `/${story.img}`,
                  alt: story.title,
                }}
                subtitle={story.subtitle}
                title={story.title}
                blockedLink={true}
                mainAnchor={{ href: '#' }}
                className="!bg-primary-50 border-none shadow-none"
              />
            ))}
          </div>
          <div className="mt-12">
            <Button variant="primary" appearance="outline">Ver mais</Button>
          </div>
        </div>
      </section >

      {/* Latest News */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-900 mb-12">
            <span className="font-normal">Últimas</span> novidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['last-new1.svg', 'last-new2.svg', 'last-new3.svg'].map((img, i) => (
              <CardArticle
                key={i}
                image={{
                  src: `/${img}`,
                  alt: `Novidade ${i + 1}`
                }}
                hasPill={true}
                pill={{
                  children: 'Webinar',
                  variant: 'primary',
                  appearance: 'solid',
                }}
                subtitle="Publicado em 21 de novembro de 2024"
                title="Webinar Developers e Data Scientists: Publicação e uso de dados abertos"
                mainAnchor={{
                  href: '#',
                  target: '_self',
                  title: 'Ver mais',
                  hasIcon: true,
                  iconOnly: true,
                  leadingIcon: 'agora-line-arrow-right-circle',
                  leadingIconHover: 'agora-solid-arrow-right-circle',
                  variant: 'primary',
                }}
                blockedLink={true}
              />
            ))}
          </div>
          <div className="mt-12">
            <Button variant="primary" appearance="outline">Ver mais</Button>
          </div>
        </div>
      </section>
    </main >
  );
}
