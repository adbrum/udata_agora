"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DatasetDetailClient from "@/components/datasets/DatasetDetailClient";

function PreviewContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "preview";
  return <DatasetDetailClient slug={slug} />;
}

export default function DatasetPreviewPage() {
  return (
    <Suspense fallback={<div>A carregar...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
