"use client";

import { GitHubArticlePage } from "@/components/documentation/GitHubArticlePage";

const AboutOpenData = () => {
  return (
    <GitHubArticlePage
      slug="pages/faqs/about_opendata"
      title="Sobre dados abertos"
      publishedDate="18.12.2025"
      breadcrumbItems={[
        { label: "Início", url: "/" },
        { label: "Conhecimento", url: "#" },
        { label: "Sobre dados abertos", url: "/pages/about-open-data" },
      ]}
    />
  );
};

export default AboutOpenData;
