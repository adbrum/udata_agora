'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Icon, Breadcrumb, CardExpandable } from '@ama-pt/agora-design-system';
import PageBanner from '@/components/PageBanner';


export default function MiniCourseDetailClient() {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const relatedCourses = [
        {
            title: 'Mini Curso sobre reutilizações de dados abertos',
            description: 'Este minicurso apresenta como reutilizar dados abertos de forma prática e segura.',
            slug: 'reutilizacao-dados-abertos'
        },
        {
            title: 'Mini Curso sobre Metadados',
            description: 'Este mini curso apresenta os conceitos introdutórios fundamentais dos metadados relacionados com dados abertos, explicando o que são, para que servem e porque são essenciais para a descoberta, compreensão e reutilização correta da informação.',
            slug: 'metadados'
        },
        {
            title: 'Mini Curso sobre os diferentes formatos de datasets',
            description: 'Este minicurso apresenta os conceitos essenciais sobre a publicação de dados abertos no dados.gov.pt, com foco nos formatos de datasets, metadados e no modelo das 5 Estrelas dos Dados Abertos.',
            slug: 'formatos-datasets'
        }
    ];

    const socialLinks = [
        { name: 'Facebook', icon: 'agora-line-facebook', color: '#1877F2' },
        { name: 'Twitter', icon: 'agora-line-twitter', color: '#1DA1F2' },
        { name: 'LinkedIn', icon: 'agora-line-linkedin', color: '#0A66C2' },
        { name: 'WhatsApp', icon: 'agora-line-whatsapp', color: '#25D366' },
        { name: 'e-mail', icon: 'agora-line-mail', color: '#EA4335' }
    ];

    return (
        <div className="flex flex-col font-sans text-neutral-900 bg-white min-h-screen">
            <main className="flex-grow bg-white">
                <PageBanner
                    title="Mini-cursos"
                    variant="light"
                    breadcrumbItems={[
                        { label: 'Bem-vindo', url: '/' },
                        { label: 'Mini Cursos', url: '/pages/mini-courses' },
                        { label: 'Mini Curso sobre a introdução aos dados abertos', url: '#' }
                    ]}
                    image={{
                        src: "/minicourses/medal_people.png",
                        alt: "Mini-cursos",
                        className: "max-h-[350px] w-auto drop-shadow-2xl"
                    }}
                    subtitle={
                        <p className="text-neutral-700 mb-8 text-xl leading-relaxed">
                            Aprenda a explorar, utilizar e partilhar dados abertos com os nossos mini-cursos rápidos e práticos.
                        </p>
                    }
                />

                <div className="container mx-auto px-4 py-64">
                    {/* Specific Course Header Section */}
                    <div className="xl:grid xl:grid-cols-12 gap-32 mb-64">
                        <div className="xl:col-span-8">
                            <h1 className="text-3xl-bold text-primary-900 leading-tight mb-24">
                                Mini Curso sobre a<br /> introdução aos dados abertos
                            </h1>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-32 max-w-3xl">
                                Este mini curso apresenta as informações introdutórias fundamentais dos dados abertos, explicando o que são, para que servem e porque são importantes para a transparência, inovação e reutilização da informação. As imagens utilizadas são apenas ilustrativas e podem ser substituídas ou adaptadas conforme o contexto da apresentação.
                            </p>
                            <p className="text-sm text-neutral-500 mb-8">
                                Atualizado em 30.09.2026
                            </p>
                        </div>
                        <div className="xl:col-span-4 flex justify-center items-start pt-64">
                            <div className="relative w-full max-w-[280px]">
                                <img
                                    src="/minicourses/medal.png"
                                    alt="Mini Course Achievement Medal"
                                    className="w-full h-auto drop-shadow-xl"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="xl:grid xl:grid-cols-12 gap-64">
                        {/* Main Content Column */}
                        <div className="xl:col-span-7">
                            <article className="prose max-w-none text-neutral-800 space-y-48">
                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">1. O que são dados abertos?</h2>
                                    <p className="text-base leading-relaxed">
                                        São dados disponibilizados de forma livre, que qualquer pessoa pode aceder, utilizar, modificar e partilhar. Devem estar acessíveis sem barreiras técnicas ou legais, permitindo a sua reutilização para fins pessoais, profissionais, científicos ou comerciais.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">2. Para que servem os dados abertos?</h2>
                                    <p className="text-base leading-relaxed">
                                        Os dados abertos servem para aumentar a transparência das instituições públicas e apoiar a tomada de decisões informadas. Permitem a investigação, a participação cidadã e a criação de novos serviços, aplicações e soluções inovadoras que beneficiam a sociedade.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">3. Quem pode usar dados abertos?</h2>
                                    <p className="text-base leading-relaxed">
                                        Todos. O formato determina o quão fácil é aceder, reutilizar, analisar e integrar os dados noutros sistemas. Formatos inadequados podem limitar a reutilização, mesmo que os dados estejam publicamente disponíveis.
                                    </p>
                                </section>

                                <div className="my-64 rounded-16 overflow-hidden shadow-sm border border-neutral-100">
                                    <img
                                        src="/minicourses/medal_people.png"
                                        alt="Ilustração de dados abertos"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">4. Quais são as principais características dos dados abertos?</h2>
                                    <p className="text-base leading-relaxed">
                                        Os dados abertos devem ser facilmente acessíveis e gratuitos, sem discriminação de quem os utiliza. Devem estar completos, atualizados e disponíveis de forma a permitir a reutilização livre, garantindo utilidade, transparência e confiança na informação.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">5. Qual a diferença entre dados públicos e dados abertos?</h2>
                                    <p className="text-base leading-relaxed">
                                        Dados públicos são informações disponibilizadas por entidades públicas, mas nem sempre podem ser reutilizadas. Os dados abertos, além de públicos, são disponibilizados de forma a permitir o acesso, a reutilização e a partilha livre por qualquer pessoa.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">6. Os dados abertos devem estar disponíveis para todos em condições iguais?</h2>
                                    <p className="text-base leading-relaxed">
                                        Sim. O acesso aos dados abertos deve ser igual para todos, sem discriminação de pessoas, organizações ou finalidades de uso. Este princípio garante transparência, equidade e oportunidades iguais de reutilização da informação.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">7. Os dados abertos devem estar atualizados?</h2>
                                    <p className="text-base leading-relaxed">
                                        Sim, para serem úteis e confiáveis, os dados abertos precisam refletir a realidade atual, permitindo decisões precisas e soluções eficazes. A atualização regular garante que empresas, cidadãos e pesquisadores possam aproveitar a informação de forma segura e eficiente.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">8. Pode haver limites no processo de abertura de dados?</h2>
                                    <p className="text-base leading-relaxed">
                                        Sim. Nem todos os dados podem ser abertos, especialmente dados pessoais, sensíveis ou confidenciais. A proteção da privacidade, da segurança e do interesse público deve ser sempre garantida antes da publicação de dados abertos.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">9. Os dados abertos podem ser reutilizados e modificados?</h2>
                                    <p className="text-base leading-relaxed">
                                        Sim, inclusive para fins comerciais. Podem ser usados, combinados e adaptados por qualquer pessoa, permitindo criar novos serviços, produtos e soluções inovadoras.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl-bold text-neutral-900 mb-16">10. Como é que os dados abertos beneficiam a economia?</h2>
                                    <p className="text-base leading-relaxed">
                                        Os dados abertos estimulam a criação de novos serviços, produtos e empregos, e aumentam a eficiência das empresas. Estudos da UE estimam que o mercado de dados abertos poderá gerar quase 200 mil milhões de euros até 2030. Além disso, promovem inovação, melhoram decisões empresariais e fortalecem a economia digital.
                                    </p>
                                </section>
                            </article>

                            <div className="flex flex-wrap gap-16 mt-64 pt-48 border-t border-neutral-100">
                                <Button
                                    variant="primary"
                                    appearance={isFavorite ? 'solid' : 'outline'}
                                    hasIcon={true}
                                    leadingIcon={isFavorite ? 'agora-solid-star' : 'agora-line-star'}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className="px-24 h-48"
                                >
                                    {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                </Button>
                                <Button
                                    variant="primary"
                                    appearance="solid"
                                    hasIcon={true}
                                    leadingIcon={isCompleted ? 'agora-solid-check-circle' : 'agora-line-check-circle'}
                                    onClick={() => setIsCompleted(!isCompleted)}
                                    className="px-24 h-48"
                                >
                                    {isCompleted ? 'Curso concluído' : 'Concluir curso'}
                                </Button>
                            </div>

                            <div className="mt-48 pt-32 border-t border-neutral-200">
                                <p className="text-sm font-bold text-neutral-600 mb-16 uppercase tracking-wider">Partilhar este mini curso</p>
                                <div className="flex flex-wrap gap-32">
                                    {socialLinks.map((link) => (
                                        <Link key={link.name} href="#" className="flex items-center gap-8 text-neutral-700 hover:text-primary-700 transition-colors">
                                            <Icon name={link.icon} className="w-20 h-20" />
                                            <span className="text-sm font-medium">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <aside className="xl:col-span-5">
                            <div className="bg-primary-100 rounded-16 p-32 sticky top-32">
                                <h3 className="text-lg font-medium text-neutral-700 mb-24">
                                    Outros <span className="font-bold text-neutral-900">mini cursos</span> relacionados
                                </h3>
                                <div className="space-y-32">
                                    {relatedCourses.map((course) => (
                                        <div key={course.slug} className="group cursor-pointer">
                                            <h4 className="font-bold text-neutral-900 group-hover:text-primary-700 transition-colors mb-8">
                                                {course.title}
                                            </h4>
                                            <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                                                {course.description}
                                            </p>
                                            <div className="mt-12 h-1 w-full bg-neutral-200 group-last:hidden"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
