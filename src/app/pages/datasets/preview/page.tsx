"use client";

import { useSearchParams } from "next/navigation";
import DatasetDetailClient from "@/components/datasets/DatasetDetailClient";
import { Dataset } from "@/types/api";

export default function DatasetPreviewPage() {
  const searchParams = useSearchParams();

  const dataset: Dataset = {
    id: "preview",
    title: searchParams.get("title") || "Sem título",
    slug: "preview",
    description: searchParams.get("description") || "Sem descrição",
    organization: null,
    last_modified: new Date().toISOString(),
    created_at: new Date().toISOString(),
    tags: [],
    resources: [],
    metrics: {},
    page: "",
  };

  return <DatasetDetailClient dataset={dataset} />;
}
