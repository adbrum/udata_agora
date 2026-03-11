import DataStoriesClient from '@/components/datastories/DataStoriesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Data Stories - dados.gov',
    description: 'Explore narrativas baseadas em dados abertos para descobrir novos insights sobre Portugal.',
};

export default async function DataStoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page) || 1;
    return <DataStoriesClient currentPage={page} />;
}
