'use client';

import {
  Button,
  InputSearchBar,
  Icon,
  CardArticle,
} from '@ama-pt/agora-design-system';

export default function Home() {
  return (
    <main className="flex-grow">
      <div className="w-full homepage">
        {/* Hero Section */}
        <div
          className="agora-card-highlight-newsletter"
          style={{
            backgroundImage:
              'url("/hero-bg.svg")',
          }}
        >
          <div className="card-container">
            <div className="card-content">
              <div className="title">
                <h1 className="container mx-auto xl:text-3xl-bold md:text-3xl-bold xs:text-2xl-bold text-white grid sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-3">
                  Plataforma aberta
                  de dados públicos portugueses
                </h1>
              </div>
              <div className="subtitle">
                <div className="container mx-auto text-m-regular text-left grid sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2">
                  Aceda, explore e reutilize dados públicos de forma transparente e acessível. Milhares de
                  conjuntos de dados ao seu dispor.
                </div>
              </div>
            </div>
            <div className="input-container">
              <div className="email-bar">
                <div className="container mx-auto grid xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 pb-64">
                  <div className="relative text-white">
                    <div className="agora-input-search-bar">
                      <div className="input-label-wrapper flex items-end mb-16 justify-between">
                        <label
                          htmlFor="portal-search"
                          className="input-search-bar-label"
                        >
                          O que procura no Portal?
                        </label>
                      </div>
                      <div className="input-search-bar-container">
                        <input
                          placeholder="Pesquisar datasets, organizações, temas..."
                          id="portal-search"
                          className="grow outline-none"
                          type="text"
                        />
                        <div className="actions-container flex flex-row gap-16">
                          <button
                            type="button"
                            aria-label="Pesquisar por voz"
                            className="flex items-center justify-center content-center agora-btn agora-btn-link-primary microphone-icon"
                          >
                            <span className="children-wrapper">
                              <div className="icon-wrapper leading">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="icon icon-m fill-(--color-primary-600) block!"
                                  role="img"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 0C10.9391 0 9.92172 0.421427 9.17157 1.17157C8.42143 1.92172 8 2.93913 8 4V12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12V4C16 2.93913 15.5786 1.92172 14.8284 1.17157C14.0783 0.421427 13.0609 0 12 0ZM10.5858 2.58579C10.9609 2.21071 11.4696 2 12 2C12.5304 2 13.0391 2.21071 13.4142 2.58579C13.7893 2.96086 14 3.46957 14 4V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12V4C10 3.46957 10.2107 2.96086 10.5858 2.58579Z"
                                  ></path>
                                  <path d="M6 10C6 9.44771 5.55228 9 5 9C4.44772 9 4 9.44771 4 10V12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.60623 18.9199 9.2482 19.717 11.0019 19.9375C11.0006 19.9582 11 19.979 11 20V22H8C7.44772 22 7 22.4477 7 23C7 23.5523 7.44772 24 8 24H16C16.5523 24 17 23.5523 17 23C17 22.4477 16.5523 22 16 22H13V20C13 19.979 12.9993 19.9582 12.9981 19.9375C14.7518 19.717 16.3938 18.9199 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12V10C20 9.44771 19.5523 9 19 9C18.4477 9 18 9.44771 18 10V12C18 13.5913 17.3679 15.1174 16.2426 16.2426C15.1174 17.3679 13.5913 18 12 18C10.4087 18 8.88258 17.3679 7.75736 16.2426C6.63214 15.1174 6 13.5913 6 12V10Z"></path>
                                </svg>
                              </div>
                            </span>
                          </button>
                          <button
                            aria-label="Pesquisar"
                            disabled
                            className="flex items-center justify-center content-center agora-btn agora-btn-solid-primary agora-btn-with-icon is-icon-only magnifier-icon"
                          >
                            <div className="icon-wrapper leading">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-m fill-(--color-primary-600) leading-icon-default block!"
                                aria-hidden="true"
                                role="img"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M16.6177 18.0319C15.078 19.2635 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2635 15.078 18.0319 16.6177L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0977 20.6834 22.0977 20.2929 21.7071L16.6177 18.0319ZM4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 12.886 17.2541 14.5978 16.0413 15.8565C16.0071 15.8828 15.9742 15.9116 15.9429 15.9429C15.9116 15.9742 15.8827 16.0071 15.8564 16.0413C14.5977 17.2542 12.886 18 11 18C7.13401 18 4 14.866 4 11Z"
                                ></path>
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="absolute w-full mb-64 bg-white text-neutral-900 shadow-lg dropdown"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Stats Section / Communities */}
        <div className="py-16 bg-white -mt-8 relative z-20 rounded-t-3xl border-t border-neutral-100 shadow-top-low md:mt-0 md:border-none md:shadow-none">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-primary-900">
              Uma comunidade dinâmica e empenhada
            </h2>
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
        </div>

        {/* Featured Datasets */}
        <div className="py-16 md:bg-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              Conjunto de Dados em Destaque
            </h2>
            <p className="text-neutral-600 mb-8 max-w-3xl">
              Conjuntos de dados mais populares e atualizados.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  time: 'Hoje',
                  org: 'Agência Portuguesa do Ambiente',
                  title: 'Indicadores de Qualidade do Ar',
                  desc: 'Medições diárias da qualidade do ar em estações de monitorização em todo o país.',
                  views: '34 567',
                },
                {
                  time: '2 dias atrás',
                  org: 'Ministério da Saúde',
                  title: 'Base de Dados de Estabelecimentos de Saúde',
                  desc: 'Lista completa de todos os estabelecimentos de saúde em Portugal, incluindo hospitais, centros de saúde e clínicas.',
                  views: '45 678',
                },
                {
                  time: '3 dias atrás',
                  org: 'Instituto Nacional de Estatística',
                  title: 'Dados Demográficos Municipais',
                  desc: 'População, densidade, faixas etárias e indicadores demográficos por município.',
                  views: '52 341',
                },
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
                  className="border-2! border-[#1A65FA]! !bg-white !p-8 min-h-[300px]"
                >
                  <div className="flex flex-col h-full mt-4">
                    <p className="text-neutral-600 mb-6 flex-grow">{item.desc}</p>
                    <div className="flex items-center gap-2 font-medium">
                      <Icon
                        name="agora-line-eye"
                        aria-hidden="true"
                        className="w-5 h-5 text-[#1A65FA]"
                      />
                      <span className="text-[#1A65FA]">{item.views}</span>
                    </div>
                  </div>
                </CardArticle>
              ))}
            </div>
            <div className="mt-12">
              <Button variant="primary" appearance="outline">
                Ver mais
              </Button>
            </div>
          </div>
        </div>

        {/* Utilizado diariamente por */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-primary-900 mb-8">
              Utilizado diariamente por
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
              {['arte.svg', 'ADC.svg', 'IMPIC.svg', 'DSPA.svg', 'apa.svg'].map(
                (logo, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center w-full h-20"
                  >
                    <img
                      src={`/${logo}`}
                      alt={`Logo ${logo.replace('.svg', '')}`}
                      className="max-h-12 max-w-[160px] object-contain"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Reuses */}
        <div className="py-16 md:bg-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              Storytellings em Destaque
            </h2>
            <p className="text-neutral-600 mb-8 max-w-3xl">
              Storytellings mais populares
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  img: 'storytelling1.svg',
                  title: 'Gestão de resíduos contentores e ecopontos',
                  subtitle: 'Publicado a DD MM AAAA',
                },
                {
                  img: 'storytelling2.svg',
                  title:
                    'Sistema de Monitorização do Ordenamento do Território (SMOT)',
                  subtitle: 'Publicado a DD MM AAAA',
                },
                {
                  img: 'storytelling3.svg',
                  title:
                    'Emissões GEE por setor (Portugal) — visualização + API (P7CO®)',
                  subtitle: 'Publicado a DD MM AAAA',
                },
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
                  className="bg-primary-50! border-none shadow-none"
                />
              ))}
            </div>
            <div className="mt-12">
              <Button variant="primary" appearance="outline">
                Ver mais
              </Button>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-primary-900 mb-12">
              <span className="font-normal">Últimas</span> novidades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['last-new1.svg', 'last-new2.svg', 'last-new3.svg'].map(
                (img, i) => (
                  <CardArticle
                    key={i}
                    image={{
                      src: `/${img}`,
                      alt: `Novidade ${i + 1}`,
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
                )
              )}
            </div>
            <div className="mt-12">
              <Button variant="primary" appearance="outline">
                Ver mais
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
