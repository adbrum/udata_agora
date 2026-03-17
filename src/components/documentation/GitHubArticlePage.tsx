"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Breadcrumb, Icon } from "@ama-pt/agora-design-system";
import { githubPagesConfig } from "@/config/site";

interface BreadcrumbItem {
  label: string;
  url: string;
}

interface GitHubArticlePageProps {
  slug: string;
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  publishedDate?: string;
}

const relatedArticles = [
  {
    date: "01 de agosto de 2025",
    title: "Title text lorem ipsum dolor",
    image: "/Articles/last-new1.svg",
  },
  {
    date: "01 de agosto de 2025",
    title: "Title text lorem ipsum dolor",
    image: "/Articles/last-new2.svg",
  },
  {
    date: "01 de agosto de 2025",
    title:
      "Title text lorem ipsum dolorTitle text lorem ipsum dolorTitle text lorem ipsum dolor",
    image: "/Articles/last-new3.svg",
  },
];

const socialLinks = [
  { name: "Facebook", icon: "agora-line-facebook", href: "#" },
  { name: "Twitter", icon: "agora-line-twitter", href: "#" },
  { name: "LinkedIn", icon: "agora-line-linkedin", href: "#" },
  { name: "WhatsApp", customIcon: "/Icons/whatsapp.svg", href: "#" },
  { name: "e-mail", icon: "agora-line-mail", href: "#" },
];

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-2xl-medium text-[#021C51] mb-16 leading-tight">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px] mt-[16px]">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-[16px] leading-[28px] mb-[16px]">{children}</p>
  ),
  a: ({ href, children }: any) => {
    const isExternal = href?.startsWith("http");
    return (
      <Link
        href={href ?? "#"}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-[#034AD8] underline font-medium hover:text-primary-700"
      >
        {children}
      </Link>
    );
  },
  ul: ({ children }: any) => (
    <ul className="list-disc pl-[48px] space-y-[12px] mb-[24px] text-[16px] leading-[28px]">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal pl-[48px] space-y-[12px] mb-[24px] text-[16px] leading-[28px]">
      {children}
    </ol>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-[#034AD8] pl-[16px] italic text-[16px] leading-[28px] mb-[16px]">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: any) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <pre className="bg-[#e1e4ea] rounded p-[16px] overflow-x-auto mb-[16px]">
        <code className="text-[14px] leading-[24px]">{children}</code>
      </pre>
    ) : (
      <code className="bg-[#e1e4ea] rounded px-[4px] py-[2px] text-[14px]">{children}</code>
    );
  },
  img: ({ src, alt }: any) => (
    <img src={src} alt={alt ?? ""} className="max-w-full h-auto mb-[16px] rounded" />
  ),
  strong: ({ children }: any) => <strong>{children}</strong>,
  em: ({ children }: any) => <em>{children}</em>,
};

export function GitHubArticlePage({
  slug,
  title,
  breadcrumbItems,
  publishedDate,
}: GitHubArticlePageProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const url = `${githubPagesConfig.rawBaseUrl}/${slug}.md`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        setContent(text);
      } catch (error) {
        console.error("Failed to fetch markdown content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, [slug]);

  const editUrl = `${githubPagesConfig.repoBaseUrl}/${slug}.md`;

  return (
    <div className="flex flex-col bg-white min-h-screen font-sans">
      <main className="flex-grow pt-32 pb-64">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="pt-[32px] mb-[64px]">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Hero Section */}
          <div className="mb-64">
            {publishedDate && (
              <span className="text-primary-900 text-l-regular block mb-[8px]">
                Publicado em {publishedDate}
              </span>
            )}
            <h1 className="text-2xl-medium text-[#021C51] mb-16 leading-tight max-w-[800px]">
              {title}
            </h1>
          </div>
        </div>

        <div className="bg-[#F7F8FA] pt-[64px] pb-[38px] pl-[112px] pr-[112px]">
          <div className="container mx-auto px-4 flex gap-[64px] lg:gap-[240px]">
            {/* Left - Main Content */}
            <div className="w-[63%]">
              <div className="text-[#2b363c] flex flex-col gap-[32px]">
                {isLoading ? (
                  <p className="text-[16px] leading-[28px] text-[#2b363c]">
                    A carregar conteúdo...
                  </p>
                ) : content ? (
                  <div className="max-w-[592px]">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-[16px] leading-[28px] text-[#2b363c]">
                    Não foi possível carregar o conteúdo.
                  </p>
                )}

                <div className="max-w-[592px] pt-[32px]">
                  <h1 className="text-[32px] font-medium text-[#021C51] mb-16 leading-tight max-w-[800px]">
                    Ações
                  </h1>
                  <Link
                    href={editUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#034AD8] underline font-medium hover:text-primary-700"
                  >
                    Propor uma mudança
                  </Link>
                </div>
              </div>
            </div>

            {/* Right - Sidebar: Related Articles */}
            <div className="w-[37%]">
              <div className="pt-[96px] flex flex-col gap-[32px]">
                <p className="text-[20px] leading-[32px] text-[#021c51] font-light">
                  Outros <span className="text-[20px] font-bold">artigos</span> relacionados
                </p>

                <div className="flex flex-col gap-[16px]">
                  {relatedArticles.map((article, index) => (
                    <div key={index} className="flex flex-col gap-[32px]">
                      <div className="flex flex-col gap-[16px]">
                        <div className="flex gap-[16px] items-start">
                          <div className="flex-1 flex flex-col gap-[8px] text-[16px] leading-[28px] text-[#2b363c]">
                            <p>{article.date}</p>
                            <p className="font-bold">{article.title}</p>
                          </div>
                          <div className="flex-1 relative min-h-[80px]">
                            <img
                              src={article.image}
                              alt=""
                              className="w-full h-full object-cover absolute inset-0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="h-[2px] bg-[#e1e4ea] w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Newsletter Section */}
          <div className="mt-[64px] relative overflow-hidden w-full">
            <img
              src="/Articles/last-new1.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Social Sharing */}
          <div className="flex flex-col gap-[16px]">
            <p className="text-[16px] leading-[28px] text-[#021c51]">
              Partilhar esta notícia
            </p>
            <div className="flex flex-wrap gap-[16px]">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-[8px] text-[#034AD8] hover:text-primary-700 transition-colors py-[8px] px-[16px]"
                >
                  {link.icon ? (
                    <Icon
                      name={link.icon as any}
                      className="w-[24px] h-[24px]"
                      aria-hidden="true"
                    />
                  ) : (
                    <img
                      src={link.customIcon}
                      alt=""
                      className="w-[24px] h-[24px]"
                    />
                  )}
                  <span className="text-[16px] leading-[28px]">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
