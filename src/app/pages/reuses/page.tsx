import { fetchReuses, fetchReuseTypes, fetchSiteInfo } from '@/services/api';
import ReusesClient from '@/components/reuses/ReusesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reutilizações - dados.gov.pt',
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
        ...(resolvedSearchParams?.q && { q: resolvedSearchParams.q }),
        ...(resolvedSearchParams?.type && { type: resolvedSearchParams.type }),
        ...(resolvedSearchParams?.tag && { tag: resolvedSearchParams.tag }),
        ...(resolvedSearchParams?.organization && { organization: resolvedSearchParams.organization }),
        ...(resolvedSearchParams?.sort && { sort: resolvedSearchParams.sort }),
    };
    // Relevance sort: when no search query, fall back to default (most recent first)
    const apiFilters = { ...filters };
    if (!apiFilters.sort && !apiFilters.q) {
        apiFilters.sort = '-last_modified';
    }

    const [initialData, reuseTypes, siteInfo] = await Promise.all([
        fetchReuses(page, 12, apiFilters),
        fetchReuseTypes(),
        fetchSiteInfo(),
    ]);

    return (
        <ReusesClient
            initialData={initialData}
            currentPage={page}
            initialFilters={filters}
            reuseTypes={reuseTypes}
            siteMetrics={siteInfo.metrics}
        />
    );
}
