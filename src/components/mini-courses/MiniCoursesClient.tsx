'use client';

import Link from 'next/link';
import { Breadcrumb, InputSearch, CardIllustrative, Feedback, Icon } from '@ama-pt/agora-design-system';
import { MiniCoursesFilters } from './MiniCoursesFilters';
import { Pagination } from '@/components/Pagination';
import { miniCoursesData } from '@/data/miniCoursesData';

export default function MiniCoursesClient() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900 bg-neutral-50 ">
      <main className="flex-grow">
        <div className="bg-primary-100">
          <div className="container mx-auto px-4 my-64 lg:px-64">
            <Breadcrumb
              items={[
                { label: 'Início', url: '/' },
                { label: 'Minicursos', url: '/pages/mini-cursos' }
              ]}
              className="mb-64"
            />
            <div className="flex">
              <div className="w-1/2 pr-32">
                <h1 className="text-[32px] leading-[40px] font-bold text-primary-600 mb-32">
                  Minicursos
                </h1>

                <div className="text-[18px] leading-[28px] space-y-16 w-[94%]">
                  <p>
                    As formações do Mosaico destinam-se a diferentes perfis da Administração Pública e visam apoiar o desenvolvimento de competências essenciais para a transformação digital do Estado. Através de uma abordagem prática, permitem desenvolver conhecimentos técnicos e estratégicos para modernizar serviços públicos e melhorar a eficiência e a qualidade do atendimento.
                  </p>
                </div>

                <div className="mt-64">
                  Atualizado em 30.09.2025
                </div>
              </div>
              <div className="img-container">
                <img src="/minicourses/mini_cursos.svg" alt="Minicursos" className="w-[597px] h-[390px]" />
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white py-64 border-t border-neutral-100">
          <div className="container mx-auto px-4 lg:px-64">
            <div className="grid md:grid-cols-3 xl:grid-cols-12 gap-[36px]">
              {/* Sidebar */}
              <div className="xl:col-span-3">
                <MiniCoursesFilters />
              </div>

              {/* Results Area */}
              <div className="xl:col-span-9">


                <div className="bg-white pt-64 pb-64">
                  <div className="container px-4 lg:px-64">
                    <div className="max-w-[700px]">
                      <h2 className="text-[18px] font-bold text-[#000066] mb-16">
                        Que minicurso procura?
                      </h2>
                      <InputSearch
                        id="courses-search"
                        label="Pesquisar minicursos"
                        hideLabel
                        placeholder="Pesquise pelo nome da formação, área técnica ou perfil"
                      />
                    </div>
                  </div>
                </div>


                <div className="flex justify-end mb-16">
                  <span className="text-[14px] text-neutral-500 font-medium tracking-tight">4 de 8 resultados</span>
                </div>

                <div className="flex flex-col gap-24 mini-courses-cards">
                  {miniCoursesData.map((course) => (
                    <CardIllustrative
                      key={course.id}
                      variant="primary-100"
                      isCardHorizontal
                      title={course.title}
                      description={course.description}
                      mainLink={
                        <Link href={`/pages/mini-courses/${course.slug}`} className="flex items-center h-full">
                          <Icon name="agora-line-arrow-right-circle" className="w-[24px] h-[24px]" />
                        </Link>
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-64 flex justify-center pb-64 mini-courses-pagination">
                  <Pagination
                    currentPage={1}
                    totalItems={8}
                    pageSize={4}
                    baseUrl="/pages/mini-cursos"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-accent-light">
          <div className="container mx-auto">
            <div>
              <Feedback
                title="O conteúdo da página foi útil?"
                subtitle="Avalie a sua experiência nesta página e deixe-nos um comentário."
                ratingButtons={{
                  likeButton: { children: 'Sim', appearance: 'outline', variant: 'success' },
                  dislikeButton: { children: 'Não', appearance: 'outline', variant: 'danger' }
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

