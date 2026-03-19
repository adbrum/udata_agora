import { InfoBlock } from '@/components/datastories/Components/Shared/InfoBlock';
import Section from '@/components/datastories/Components/Shared/Section';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Data Story - dados.gov',
};

export default function DataStoryDetailPage() {
    return (
        <Section className='bg-brand-blue-dark'>
            <InfoBlock.Root>
                <InfoBlock.Header>
                    <InfoBlock.Title titleLevel="h2" title="Serviços Públicos: o canal digital" />
                </InfoBlock.Header>
            </InfoBlock.Root>
        </Section>
    );
}
