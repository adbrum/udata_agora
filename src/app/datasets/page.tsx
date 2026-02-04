import { fetchDatasets } from '@/services/api';
import DatasetsClient from '@/components/DatasetsClient';

// Ensure this is a server component by not adding 'use client'
// But DatasetsClient IS a client component

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams; // Next.js 15+ needs await for params/searchParams
  const page = Number(resolvedSearchParams?.page) || 1;
  const initialData = await fetchDatasets(page);

  return <DatasetsClient initialData={initialData} currentPage={page} />;
}
