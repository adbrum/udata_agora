import StatusCard from '@/components/datastories/Components/Primitives/StatusCard';
import { InfoBlock } from '@/components/datastories/Components/Shared/InfoBlock';
import Section from '@/components/datastories/Components/Shared/Section';
import Icon from '@/components/datastories/Components/Primitives/Icon';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Data Story - dados.gov',
};

export default function DataStoryDetailPage() {

    const data = {
        title: 'Serviços Públicos: o canal presencial',
        description: `Quando um cidadão precisa de tratar de um assunto com a Administração Pública, tem hoje várias opções ao seu dispor. Pode fazê-lo online, através do telefone ou presencialmente. Cada uma destas formas de contacto responde a necessidades diferentes — e permite que os serviços públicos estejam acessíveis a todos.
        \nPara garantir a proximidade ao cidadão, a Agência para a Reforma Tecnológica do Estado organiza o seu atendimento público através de três canais complementares: presencial, telefónico e digital. Juntos, formam uma rede que assegura cobertura em todo o território e permite aos cidadãos escolher a forma mais conveniente de interagir com o Estado. O canal presencial continua a ser uma das portas de entrada mais visíveis desta rede. Nas Lojas e Espaços do Cidadão, várias entidades públicas concentram os seus serviços no mesmo local, permitindo tratar diferentes assuntos numa única deslocação — desde documentos de identificação a serviços da segurança social ou da administração fiscal.
        \nTodos os dias, cidadãos de diferentes idades e contextos recorrem a estes espaços para resolver necessidades concretas. Alguns procuram ajuda para executar um serviço, outros preferem esclarecer dúvidas diretamente com um funcionário ou tratar de processos que exigem presença física.
        \nNesta história assente em dados, exploramos como funciona esta rede de atendimento presencial: onde se concentram os atendimentos, que serviços são mais procurados, quanto tempo esperam os cidadãos e que feedback deixam sobre a sua experiência.
        \nCompreender o funcionamento do canal presencial ajuda a perceber melhor como os serviços públicos chegam às pessoas — hoje e no futuro.`,
        bigCards: [
            {
                icon: 'agora-line-ticket',
                title: "Canal presencial",
                description: "Lojas e Espaços do Cidadão",
            },
            {
                icon: 'agora-line-help-support',
                title: "Canal telefónico",
                description: "Linha Cidadão",
                anchor: {
                    children: "Serviços públicos: o canal telefónico",
                    href: "#",
                }
            },
            {
                icon: 'agora-line-smartphone',
                title: "Canal digital",
                description: "Portal e app gov.pt",
                anchor: {
                    children: "Serviços públicos: o canal digital",
                    href: "#",
                }
            },
        ],
        sections: [{
            title: 'Para onde se dirigem os cidadãos?',
            description: "Conheça os locais de atendimento presencial com maior e menor afluência.",
            className: 'bg-primary-100',
            iFrame: {
                className: 'w-full h-[1200px] bg-white',
                src: '',
            }
        }, {
            title: 'E o que procuram?',
            description: "Saiba quais os serviços mais procurados nas Lojas de Cidadão.",
            className: 'bg-primary-100',
            extraPy: 'py-[64px]',
            iFrame: {
                className: 'w-full h-[1200px] bg-white',
                src: '',
            }
        },
        {
            title: 'O tempo de espera nas Lojas do Cidadão',
            description: "Os tempos de espera variam entre locais de atendimento, mas também de acordo com o serviço a realizar e a entidade que o presta. Saiba mais sobre os tempos de espera nas Lojas de Cidadão geridas pela ARTE.",
            className: 'bg-white',
            extraPy: 'py-[64px]',
            iFrame: {
                className: 'w-full h-[820px] bg-primary-100',
                src: '',
            }
        }, {
            title: 'Sugestões, reclamações e elogios no canal presencial',
            description: "Através do portal gov.pt o cidadão pode reportar, de forma simples e por via digital, a sua opinião e experiência com os serviços da Administração Pública, em forma de sugestão, elogio ou reclamação.",
            warning: {
                title: "Dados sobre entidade aderentes",
                description: "Nem todas as Lojas do Cidadão, entidades públicas e serviços estão registados para recolher avaliações. Os dados apresentados refletem apenas a realidade das entidades aderentes."
            },
            className: 'bg-primary-100',
            iFrame: {
                className: 'w-full h-[1530px] bg-white',
                src: '',
            }

        }, {
            title: 'O que diz o cidadão?',
            description: "A experiência do cidadão é decisiva para avaliar a qualidade do atendimento público. Saiba o que diz o cidadão sobre como os serviços públicos estão a corresponder às suas necessidades.",
            warning: {
                title: "Dados sobre entidade aderentes",
                description: "Nem todas as Lojas do Cidadão, entidades públicas e serviços estão registados para recolher avaliações. Os dados apresentados refletem apenas a realidade das entidades aderentes."
            },
            className: 'bg-primary-100',
            extraPy: 'py-[64px]',
            iFrame: {
                className: 'w-full h-[795px] bg-white',
                src: '',
            }

        }]
    };


    return (
        <main className='flex flex-col'>
            <Section className="bg-primary-900 flex items-center justify-center ">
                <InfoBlock.Root className='py-[96px]'>
                    <InfoBlock.Header>
                        <InfoBlock.Title titleLevel="h1" title={data.title} className='text-white text-3xl-bold ' />
                    </InfoBlock.Header>
                    <InfoBlock.Content>
                        <InfoBlock.Description className='whitespace-pre-wrap text-m-regular text-white' description={data.description} />
                        <div className='w-full h-full flex flex-col gap-64'>
                            <div className='flex flex-col'>
                                <div className='pb-[16px]'>
                                    <div className='bg-primary-100 p-[16px] w-[56px] h-[56px] rounded-[8px] flex items-center justify-center'>
                                        <Icon name='agora-line-smartphone' />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </InfoBlock.Content>
                </InfoBlock.Root>
            </Section>
            {data.sections.map((section, index) => (
                <Section className={"flex items-center justify-center " + section.className} key={index}>
                    <InfoBlock.Root className={(section.extraPy ? section.extraPy : 'pt-[64px]') + ' gap-64'}>
                        <InfoBlock.Header className='gap-16'>
                            <InfoBlock.Title titleLevel="h2" title={section.title} className='text-2xl font-bold text-neutral-900' />
                            <InfoBlock.Description className='whitespace-pre-wrap text-m-light text-black max-w-[500px] ' description={section.description} />
                            {
                                section.warning && (
                                    <div className='max-w-[592px]'>
                                        <StatusCard
                                            type='warning'
                                            title={section.warning.title}
                                            description={section.warning.description}
                                        />
                                    </div>
                                )
                            }
                        </InfoBlock.Header>
                        <iframe src={section.iFrame.src} className={section.iFrame.className} />
                    </InfoBlock.Root>
                </Section>
            ))}
        </main>
    );
}
