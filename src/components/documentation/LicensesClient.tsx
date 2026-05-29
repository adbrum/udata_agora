"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Breadcrumb } from "@ama-pt/agora-design-system";

const CMS_GRAPHQL_URL = process.env.NEXT_PUBLIC_CMS_URL
  ? `${process.env.NEXT_PUBLIC_CMS_URL}/graphql`
  : "http://localhost:3333/graphql";

const LICENCES_CONTENT_ID = "licences";

interface LicensesContent {
  title: string;
  body: string;
  actionTitle: string;
  actions: Array<{ children: string; href: string }>;
}

export default function LicensesClient() {
  const [content, setContent] = useState<LicensesContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const query = `
          query {
            queryFaqsContents(filter: "data/id/iv eq '${LICENCES_CONTENT_ID}'") {
              data {
                title { pt }
                body { pt }
                actionTitle { pt }
                actions { pt { anchor { children href } } }
              }
            }
          }
        `;
        const res = await fetch(CMS_GRAPHQL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const { data } = await res.json();
        const raw = data?.queryFaqsContents?.[0]?.data;
        if (raw) {
          setContent({
            title: raw.title?.pt ?? "",
            body: raw.body?.pt ?? "",
            actionTitle: raw.actionTitle?.pt ?? "",
            actions: (raw.actions?.pt ?? []).map(
              (a: { anchor: { children: string; href: string } }) => a.anchor,
            ),
          });
        }
      } catch (error) {
        console.error("Failed to load licenses content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col bg-white min-h-screen font-sans">
      <main className="flex-grow pt-32 pb-64">
        <div className="container mx-auto px-4">
          <div className="pt-[32px] mb-[64px]">
            <Breadcrumb
              items={[
                { label: "Início", url: "/" },
                { label: "Licenças", url: "/pages/faqs/licenses" },
              ]}
            />
          </div>
        </div>

        <div className="bg-[#F7F8FA] pt-[64px] pb-[38px] pl-[112px] pr-[112px]">
          <div className="container mx-auto px-4">
            <div className="max-w-[592px]">
              {isLoading ? (
                <p className="text-[16px] leading-[28px] text-[#2b363c]">A carregar...</p>
              ) : content?.body ? (
                <div className="text-[#2b363c] flex flex-col gap-[16px]">
                  {content.title && (
                    <h1 className="text-2xl-medium text-[#021C51] mb-16 leading-tight">
                      {content.title}
                    </h1>
                  )}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl-medium text-[#021C51] mb-16 leading-tight">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px] mt-[16px]">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="font-bold text-[16px] leading-[28px] text-[#021c51] mb-[16px]">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-[16px] leading-[28px] mb-[16px]">{children}</p>
                      ),
                      a: ({ href, children }) => {
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
                      ul: ({ children }) => (
                        <ul className="list-disc pl-[48px] space-y-[12px] mb-[24px] text-[16px] leading-[28px]">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-[48px] space-y-[12px] mb-[24px] text-[16px] leading-[28px]">
                          {children}
                        </ol>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[#034AD8] pl-[16px] italic text-[16px] leading-[28px] mb-[16px]">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isBlock = className?.includes("language-");
                        return isBlock ? (
                          <pre className="bg-[#e1e4ea] rounded p-[16px] overflow-x-auto mb-[16px]">
                            <code className="text-[14px] leading-[24px]">{children}</code>
                          </pre>
                        ) : (
                          <code className="bg-[#e1e4ea] rounded px-[4px] py-[2px] text-[14px]">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content.body}
                  </ReactMarkdown>

                  {content.actions.length > 0 && (
                    <div className="pt-[32px]">
                      {content.actionTitle && (
                        <h2 className="text-[32px] font-medium text-[#021C51] mb-16 leading-tight">
                          {content.actionTitle}
                        </h2>
                      )}
                      <ul className="list-disc pl-[48px] space-y-[12px] text-[16px] leading-[28px]">
                        {content.actions.map((action, index) => (
                          <li key={index}>
                            <Link
                              href={action.href ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#034AD8] underline font-medium hover:text-primary-700"
                            >
                              {action.children}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[16px] leading-[28px] text-[#2b363c]">
                  Não foi possível carregar o conteúdo.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
