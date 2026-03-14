import { fetchReuses, fetchReuseTypes } from '@/services/api';
import ReusesClient from '@/components/reuses/ReusesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reutilizações - dados.gov',
    description: 'Descubra como os dados abertos estão a ser utilizados para criar valor em Portugal. Explore as reutilizações da comunidade.',
};

export default async function ReusesPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        q?: string;
        type?: string;
        tag?: string;
        organization?: string;
        sort?: string;
    }>;
}) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page) || 1;
    const filters = {
        q: resolvedSearchParams?.q,
        type: resolvedSearchParams?.type,
        tag: resolvedSearchParams?.tag,
        organization: resolvedSearchParams?.organization,
        sort: resolvedSearchParams?.sort,
    };
    const [initialData, reuseTypes] = await Promise.all([
        fetchReuses(page, 12, filters),
        fetchReuseTypes(),
    ]);

    return (
        <ReusesClient
            initialData={initialData}
            currentPage={page}
            initialFilters={filters}
            reuseTypes={reuseTypes}
        />
    );
}
