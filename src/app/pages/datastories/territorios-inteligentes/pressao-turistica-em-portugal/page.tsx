import StatusCard from '@/components/datastories/Components/Primitives/StatusCard';
import { InfoBlock } from '@/components/datastories/Components/Shared/InfoBlock';
import Section from '@/components/datastories/Components/Shared/Section';
import { Metadata } from 'next';
import { CardCompound } from '@/components/datastories/Components/Shared/CardCompound';
import FooterReference from '@/components/datastories/Components/Shared/FooterReference';
import DataSourcesSection, { DataSourcesSectionProps } from '@/components/datastories/Components/Shared/DataSourcesSection';

export const metadata: Metadata = {
    title: 'Data Story - dados.gov',
};

export default function DataStoryDetailPage() {

    const data = {
        hero: {
            title: 'Qual a intensidade da pressão turística em Portugal?',
            description: `A pressão turística mostra o peso da atividade turística em cada território, ao relacionar o número de hóspedes com a população residente. Este indicador varia entre municípios e ao ao longo do ano, refletindo a maior ou menor procura turística. Em alguns casos, a presença de hóspedes é reduzida; noutros, em certos períodos, pode aproximar-se ou até ultrapassar a população residente. 
            \nEsta variação sazonal coloca desafios ao planeamento e à gestão dos territórios, especialmente onde os picos de procura aumentam a pressão sobre infraestruturas, serviços públicos e recursos locais. Compreender estes padrões é, por isso, essencial para apoiar decisões mais informadas e antecipar necessidades. 
            \nEste caso de estudo cruza duas variáveis: o número de hóspedes em estabelecimentos de alojamento turístico e a população residente. Esta leitura permite perceber onde a atividade turística é mais intensa, como se distribui no território e de que forma varia ao longo do tempo. 
            \nAo longo desta página, pode explorar a evolução da pressão turística, comparar municípios e regiões e interpretar este fenómeno à luz da realidade de cada território. Esta leitura contribui para uma compreensão mais informada do turismo em Portugal e dos desafios associados ao equilíbrio entre atividade económica, qualidade de vida e sustentabilidade.`,
            bigCards: [
                {
                    icon: 'agora-solid-briefcase',
                    number: 31500000,
                    subtitle: "Hóspedes registados",
                    description: "Valor anual",
                },
                {
                    icon: 'agora-solid-home',
                    subtitle: "Residentes no país",
                    number: 10700000,
                    description: "Valor anual",
                },
            ],
            period: "2024"
        },
        sections: [{
            title: 'De que forma evoluiu o número de hóspedes e residentes ao longo do tempo?',
            description: "Observe a diferença entre a população residente e a população presente, resultante da soma entre residentes e hóspedes. A linha da população residente mantém-se estável, refletindo a base demográfica permanente do país. Já a linha da população presente varia ao longo do tempo, acompanhando as oscilações no número de hóspedes. ",
            className: 'bg-primary-100',
            extraPy: 'py-[64px]',
            iFrame: {
                className: 'w-full h-[1200px] bg-white',
                src: '',
            },
            label: "Esta visualização permite identificar períodos de maior presença turística e compreender como o turismo altera temporariamente a dimensão da população no território."
        }, {
            title: 'Como se distribuem os hóspedes e a população residente no território?',
            description: "Observe como a atividade turística se distribui no território e como varia ao longo do tempo. Esta visualização permite comparar territórios e identificar onde o número de visitantes assume maior expressão face à população residente. ",
            className: 'bg-white',
            extraPy: 'pt-[64px]',
            iFrame: {
                className: 'w-full h-[1200px] bg-primary-100',
                src: '',
            },
            label: "Analise a distribuição do número de hóspedes e da população residente em Portugal."
        },
        {
            title: 'Proporção entre o número de hóspedes e residentes por município',
            description: "Compare o número de hóspedes e residentes em cada município. A comparação entre municípios permite identificar diferenças na intensidade da atividade turística e observar onde o número de visitantes assume maior expressão.",
            className: 'bg-white',
            extraPy: 'py-[64px]',
            iFrame: {
                className: 'w-full h-[820px] bg-primary-100',
                src: '',
            },
            label: "Este gráfico permite analisar a relação entre visitantes e população local em cada território. Utilize os filtros para explorar os dados por ano ou mês."
        },
        {
            title: 'Percentagem do número de hóspedes face à população residente em cada município',
            description: "O número total de hóspedes não reflete necessariamente a intensidade da atividade turística. Para compreender essa intensidade, é importante analisar a relação entre hóspedes e população residente, permitindo observar onde a presença de visitantes assume maior peso relativo face à população local. ",
            className: 'bg-primary-100',
            extraPy: 'py-[64px]',
            iFrame: {
                className: 'w-full h-[1530px] bg-white',
                src: '',
            },
            label: "Explore a percentagem de hóspedes em relação à população residente. Territórios com percentagens mais elevadas indicam uma presença turística mais intensa em relação à população local. Utilize os filtros temporais para observar como esta relação varia ao longo do tempo. "
        }],
        dataSourcesSection: {
            title: 'Datasets utilizados nesta página',
            description: 'Os indicadores apresentados usam os seguintes datasets, que servem de base aos valores mostrados nesta página.',
            dataSources: [{
                children: "Hóspedes (N.º) nos estabelecimentos de alojamento turístico",
                href: "#",
            },
            {
                children: "População residente (N.º)",
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
                    <InfoBlock.Content className='flex xl:flex-row flex-col justify-between xl:gap-[136px] gap-32'>
                        <InfoBlock.Description className='whitespace-pre-wrap text-m-regular text-white' description={data.hero.description} />
                        <div className='w-full h-full flex flex-col gap-[128px] py-[44px]'>
                            <div className='flex flex-col gap-64'>
                                {data.hero.bigCards.map((card, index) => (
                                    <CardCompound.Root key={index}>
                                        <CardCompound.Icon icon={card.icon} />
                                        <CardCompound.BigNumber number={card.number} />
                                        <CardCompound.Subtitle >
                                            {card.subtitle}
                                        </CardCompound.Subtitle>
                                        <CardCompound.Description>
                                            {card.description}
                                        </CardCompound.Description>
                                    </CardCompound.Root>
                                ))}
                            </div>
                            <FooterReference text='Ano de referência' period={data.hero.period} />
                        </div>
                    </InfoBlock.Content>
                </InfoBlock.Root>
            </Section>
            {data.sections.map((section, index) => (
                <Section className={"flex items-center justify-center " + section.className} key={index}>
                    <InfoBlock.Root className={(section.extraPy ? section.extraPy : 'pt-[64px]') + ' gap-64'}>
                        <InfoBlock.Header className='gap-16'>
                            <InfoBlock.Title titleLevel="h2" title={section.title} className='text-2xl font-bold text-primary-900' />
                            <InfoBlock.Description className='whitespace-pre-wrap text-m-light text-black max-w-[500px] ' description={section.description} />
                        </InfoBlock.Header>
                        <iframe src={section.iFrame.src} className={section.iFrame.className} />
                        <InfoBlock.Content>
                            <InfoBlock.Description className='text-m-regular text-black' description={section.label} />
                        </InfoBlock.Content>
                    </InfoBlock.Root>
                </Section>
            ))}
            <DataSourcesSection {...data.dataSourcesSection as DataSourcesSectionProps} className='mt-[96px]' />
        </main>
    );
}
