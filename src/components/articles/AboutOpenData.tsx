"use client";

import { GitHubArticlePage } from "@/components/documentation/GitHubArticlePage";

const AboutOpenData = () => {
  return (
    <GitHubArticlePage
      slug="pages/faqs/about_opendata"
      breadcrumbItems={[
        { label: "Início", url: "/" },
        { label: "Conhecimento", url: "#" },
        { label: "Sobre dados abertos", url: "/pages/about-open-data" },
      ]}
    />
  );
};

export default AboutOpenData;
