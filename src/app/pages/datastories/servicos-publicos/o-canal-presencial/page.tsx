import { CardCompound } from '@/components/datastories/Components/Shared/CardCompound';
import DataSourcesSection, { DataSourcesSectionProps } from '@/components/datastories/Components/Shared/DataSourcesSection';
import { InfoBlock } from '@/components/datastories/Components/Shared/InfoBlock';
import Section from '@/components/datastories/Components/Shared/Section';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Data Story - dados.gov',
};

export default function DataStoryDetailPage() {

    const data = {
        hero: {
            title: 'Serviços Públicos: o canal presencial',
            description: `Quando um cidadão precisa de tratar de um assunto com a Administração Pública, tem hoje várias opções ao seu dispor. Pode fazê-lo online, através do telefone ou presencialmente. Cada uma destas formas de contacto responde a necessidades diferentes — e permite que os serviços públicos estejam acessíveis a todos.
                            \nPara garantir a proximidade à população, a Agência para a Reforma Tecnológica do Estado organiza o seu atendimento público através de três canais complementares: presencial, telefónico e digital. Juntos, formam uma rede que assegura cobertura em todo o território e permite aos cidadãos escolher a forma mais conveniente de interagir com o Estado.
                            \nO canal presencial continua a ser uma das portas de entrada mais visíveis desta rede. Nas Lojas e Espaços Cidadão, várias entidades públicas concentram os seus serviços no mesmo local, permitindo tratar diferentes assuntos numa única deslocação — desde renovar documentos de identificação a desempenhar serviços da segurança social, entre outros.
                            \nNesta história assente em dados, exploramos como funciona o canal presencial: onde se encontram os locais de atendimento, onde se concentram os atendimentos, que serviços são mais procurados e quanto tempo demora.
                            \nCompreender o funcionamento do canal presencial ajuda a perceber melhor como os serviços públicos chegam às pessoas e que mudanças podem ser feitas para o tornar mais eficaz.`,
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
                        href: "#",
                        children: "Serviços públicos: o canal telefónico"
                    }
                },
                {
                    icon: 'agora-line-smartphone',
                    title: "Canal digital",
                    description: "Portal e app gov.pt",
                    anchor: {
                        href: "#",
                        children: "Serviços públicos: o canal digital"
                    }
                },
            ],
        },
        sections: [{
            title: 'Onde estão as Lojas e Espaços Cidadão?',
            description: "Saiba por onde se distribuem as Lojas e Espaços Cidadão, e como cobrem o território para satisfazer as necessidades da população.",
            className: 'bg-primary-100',
            extraPy: 'py-[64px]',
            iFrame: {
                className: 'w-full h-[1200px] bg-white',
                src: '',
            },
        }, {
            title: 'A eficiência do canal presencial',
            description: "O atendimento corresponde às interações entre o cidadão e as instituições públicas e privadas presentes nas Lojas e Espaços Cidadão. Compreenda a evolução da eficiência dos serviços públicos presenciais analisando a relação entre o número de senhas tiradas e o atendimento realizado ao longo do tempo.",
            className: 'bg-primary-100',
            extraPy: 'pt-[64px]',
            iFrame: {
                className: 'w-full h-[1200px] bg-white',
                src: '',
            },
        },
        {
            title: 'Para onde se dirigem os cidadãos?',
            description: "Conheça os locais de atendimento presencial com maior e menor afluência.",
            className: 'bg-primary-100',
            extraPy: 'pt-[64px]',
            iFrame: {
                className: 'w-full h-[820px] bg-white',
                src: '',
            },
        },
        {
            title: 'E o que procuram?',
            description: "Saiba quais os serviços mais e menos procurados nas Lojas de Cidadão.",
            className: 'bg-primary-100',
            extraPy: 'pt-[64px]',
            iFrame: {
                className: 'w-full h-[1530px] bg-white',
                src: '',
            },
        },
        {
            title: 'Quanto tempo espera o cidadão?',
            description: "Os tempos de espera variam entre locais de atendimento, mas também de acordo com o serviço a realizar e a entidade que o presta. Saiba mais sobre os tempos de espera e de atendimento nas Lojas de Cidadão geridas pela ARTE.",
            className: 'bg-primary-100',
            extraPy: 'py-[64px]',
            iFrame: {
                className: 'w-full h-[1530px] bg-white',
                src: '',
            },
        }],
        dataSourcesSection: {
            title: 'Datasets utilizados nesta página',
            description: 'Os indicadores apresentados usam os seguintes datasets, que servem de base aos valores mostrados nesta página.',
            dataSources: [{
                children: "Atentimento do canal presencial",
                href: "#",
            }]
        }
    };

    return (
        <main className='flex flex-col'>
            <Section className="bg-primary-900 flex items-center justify-center ">
                <InfoBlock.Root className='py-[96px]'>
                    <InfoBlock.Header>
                        <InfoBlock.Title titleLevel="h1" title={data.hero.title} className='text-white text-3xl-bold ' />
                    </InfoBlock.Header>
                    <InfoBlock.Content className='flex min-[1280px]:flex-row flex-col justify-between min-[1280px]:gap-[136px] gap-32 '>
                        <InfoBlock.Description className='whitespace-pre-wrap text-m-regular text-white' description={data.hero.description} />
                        <div className='w-full h-full flex flex-col gap-[128px] py-[36px] justify-center'>
                            <div className='flex flex-col gap-64'>
                                {data.hero.bigCards.map((card, index) => (
                                    <CardCompound.Root key={index}>
                                        <CardCompound.Icon icon={card.icon} />
                                        <CardCompound.Title>
                                            {card.title}
                                        </CardCompound.Title>
                                        <CardCompound.Description>
                                            {card.description}
                                        </CardCompound.Description>
                                        {card.anchor && (
                                            <CardCompound.Anchor href={card.anchor.href} className='hover:!text-white !text-white ' hasIcon>
                                                {card.anchor.children}
                                            </CardCompound.Anchor>
                                        )}
                                    </CardCompound.Root>
                                ))}
                            </div>
                        </div>
                    </InfoBlock.Content>
                </InfoBlock.Root>
            </Section>
            {data.sections.map((section, index) => (
                <Section className={"flex items-center justify-center " + section.className} key={index}>
                    <InfoBlock.Root className={(section.extraPy ? section.extraPy : 'pt-[64px]') + ' gap-64'}>
                        <InfoBlock.Header className='gap-16'>
                            <InfoBlock.Title titleLevel="h2" title={section.title} className='text-2xl font-bold text-primary-900' />
                            <InfoBlock.Description className=' whitespace-pre-wrap text-m-light text-black max-w-[500px] ' description={section.description} />
                        </InfoBlock.Header>
                        <iframe src={section.iFrame.src} className={section.iFrame.className} />
                    </InfoBlock.Root>
                </Section>
            ))}
            <DataSourcesSection {...data.dataSourcesSection as DataSourcesSectionProps} className='mt-[96px]' />
        </main>
    );
}
