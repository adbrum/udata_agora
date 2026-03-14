import { fetchOrganizations, fetchSiteInfo, fetchOrgBadges } from '@/services/api';
import OrganizationsClient from '@/components/organizations/OrganizationsClient';
import { OrganizationFilters } from '@/types/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Organizações - dados.gov',
    description: 'Explore as organizações que publicam dados abertos em Portugal.',
};

export default async function OrganizationsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const resolved = await searchParams;
    const page = Number(resolved?.page) || 1;

    const filters: OrganizationFilters = {};
    if (resolved?.q) filters.q = String(resolved.q);
    if (resolved?.badge) filters.badge = String(resolved.badge);
    if (resolved?.sort) filters.sort = String(resolved.sort);

    const [initialData, siteInfo, orgBadges] = await Promise.all([
        fetchOrganizations(page, 20, filters),
        fetchSiteInfo(),
        fetchOrgBadges(),
    ]);

    const badgeKeys = Object.keys(orgBadges);
    const badgeCounts = await Promise.all(
        badgeKeys.map((badge) => fetchOrganizations(1, 1, { badge }))
    );
    const orgBadgesWithCounts = Object.fromEntries(
        badgeKeys.map((kind, i) => [kind, badgeCounts[i].total])
    );

    return (
        <OrganizationsClient
            initialData={initialData}
            currentPage={page}
            siteMetrics={siteInfo.metrics}
            orgBadges={orgBadges}
            orgBadgeCounts={orgBadgesWithCounts}
        />
    );
}
