import { fetchOrganization } from '@/services/api';
import OrganizationDetailClient from '@/components/organizations/OrganizationDetailClient';
import { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const organization = await fetchOrganization(slug);

    return {
        title: `${organization.name} - dados.gov`,
        description: organization.description || `Explore os dados publicados por ${organization.name}.`,
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const organization = await fetchOrganization(slug);

    return <OrganizationDetailClient organization={organization} />;
}
