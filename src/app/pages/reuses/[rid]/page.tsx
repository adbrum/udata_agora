import { fetchReuse } from '@/services/api';
import ReuseDetailClient from '@/components/ReuseDetailClient';

export default async function Page({
    params,
}: {
    params: Promise<{ rid: string }>;
}) {
    const { rid } = await params;
    const reuse = await fetchReuse(rid);

    return <ReuseDetailClient reuse={reuse} />;
}
