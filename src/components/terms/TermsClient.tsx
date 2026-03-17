"use client";

import { GitHubMarkdownPage } from "@/components/documentation/GitHubMarkdownPage";

export default function TermsClient() {
  return (
    <GitHubMarkdownPage
      slug="pages/faqs/terms"
      title="Termos de utilização"
      breadcrumbItems={[
        { label: "Início", url: "/" },
        { label: "Termos de utilização", url: "/pages/faqs/terms" },
      ]}
    />
  );
}
