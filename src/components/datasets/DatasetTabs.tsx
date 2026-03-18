'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tabs, Tab, TabHeader, TabBody, CardNoResults, Icon, StatusCard, Button, InputSearchBar } from '@ama-pt/agora-design-system';
import { Dataset, Discussion, Reuse } from '@/types/api';
import { fetchDiscussions, fetchReuses } from '@/services/api';
import { DatasetResourcesTable } from './DatasetResourcesTable';
import { DatasetInfo } from './DatasetInfo';

interface DatasetTabsProps {
    dataset: Dataset;
}

export const DatasetTabs: React.FC<DatasetTabsProps> = ({ dataset }) => {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [discussionCount, setDiscussionCount] = useState(dataset.metrics.discussions || 0);
    const [reuses, setReuses] = useState<Reuse[]>([]);
    const [reuseCount, setReuseCount] = useState(dataset.metrics.reuses || 0);

    useEffect(() => {
        async function loadTabData() {
            try {
                const [discResponse, reuseResponse] = await Promise.all([
                    fetchDiscussions(dataset.id),
                    fetchReuses(1, 20, { dataset: dataset.id }),
                ]);
                setDiscussions(discResponse.data);
                setDiscussionCount(discResponse.total);
                setReuses(reuseResponse.data);
                setReuseCount(reuseResponse.total);
            } catch (error) {
                console.error("Error loading tab data:", error);
            }
        }
        loadTabData();
    }, [dataset.id]);

    const renderTabBody = (content: React.ReactNode) => (
        <TabBody>
            <div className="relative">
                <div
                    className="absolute inset-y-0 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-32 xl:-mx-64 bg-primary-100 border-t border-dashed border-primary-400 z-0"
                    aria-hidden="true"
                />
                <div className="relative z-10">
                    <div className="container mx-auto max-w-5xl">
                        {content}
                    </div>
                </div>
            </div>
        </TabBody>
    );

    return (
        <div className="mt-64">
            <Tabs>
                <Tab>
                    <TabHeader>Ficheiros ({dataset.resources.length})</TabHeader>
                    {renderTabBody(<DatasetResourcesTable resources={dataset.resources} />)}
                </Tab>
                <Tab>
                    <TabHeader>Reutilizações e APIs ({reuseCount})</TabHeader>
                    {renderTabBody(
                        <div>
                            <h3 className="font-medium text-neutral-900 text-base mb-16">
                                {reuseCount} {reuseCount === 1 ? "REUTILIZAÇÃO" : "REUTILIZAÇÕES"}
                            </h3>
                            {reuseCount === 0 ? (
                                <CardNoResults
                                    position="center"
                                    icon={
                                        <img src="/Icons/bar_chart.svg" alt="" className="w-[40px] h-[40px]" />
                                    }
                                    title="Sem reutilizações"
                                    description="Ainda não existem reutilizações associadas a este conjunto de dados."
                                    hasAnchor={false}
                                />
                            ) : (
                                <div className="space-y-24">
                                    {reuses.map((reuse) => (
                                        <div key={reuse.id} className="bg-white rounded-8 p-32">
                                            <div className="flex gap-16 items-start">
                                                {reuse.image_thumbnail && (
                                                    <img
                                                        src={reuse.image_thumbnail}
                                                        alt=""
                                                        className="w-[64px] h-[64px] rounded-4 object-cover shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={`/pages/reuses/${reuse.slug}`}
                                                        className="text-neutral-900 hover:underline font-bold text-base"
                                                    >
                                                        {reuse.title}
                                                    </Link>
                                                    <div className="flex items-center gap-8 mt-4 text-sm text-neutral-900">
                                                        {reuse.organization && (
                                                            <span>{reuse.organization.name}</span>
                                                        )}
                                                    </div>
                                                    {reuse.description && (
                                                        <p className="text-neutral-900 text-sm mt-8 line-clamp-2">
                                                            {reuse.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Tab>
                <Tab>
                    <TabHeader>Discussões ({discussionCount})</TabHeader>
                    {renderTabBody(
                        <div>
                            <div className="mb-24">
                                <StatusCard
                                    type="info"
                                    description={
                                        <>
                                            A sua questão é sobre outro tema que não este conjunto de dados?{" "}
                                            <a
                                                href="https://dados.gov.pt"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-600 underline font-semibold"
                                            >
                                                Visite o nosso fórum <Icon name="agora-line-external-link" className="w-4 h-4 inline" />
                                            </a>
                                        </>
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between mb-24">
                                <h3 className="font-medium text-neutral-900 text-base">
                                    {discussionCount} {discussionCount === 1 ? "DISCUSSÃO" : "DISCUSSÕES"}
                                </h3>
                                <div className="flex items-center gap-24">
                                    <InputSearchBar
                                        hasVoiceActionButton={false}
                                        placeholder="Pesquisar"
                                        aria-label="Pesquisar discussões"
                                    />
                                    <Button
                                        variant="primary"
                                        appearance="outline"
                                        hasIcon={true}
                                        leadingIcon="agora-line-plus-circle"
                                        leadingIconHover="agora-solid-plus-circle"
                                    >
                                        Iniciar nova discussão
                                    </Button>
                                </div>
                            </div>
                            {discussionCount === 0 ? (
                                <CardNoResults
                                    position="center"
                                    icon={
                                        <Icon name="agora-line-chat" className="w-[40px] h-[40px] text-primary-500 icon-xl" />
                                    }
                                    title="Sem discussões"
                                    description="Ainda não existem discussões sobre este conjunto de dados."
                                    hasAnchor={false}
                                />
                            ) : (
                                <div className="space-y-16">
                                    {discussions.map((disc) => (
                                        <div key={disc.id} className="bg-white rounded-8 p-32">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-neutral-900">{disc.title}</h4>
                                                {disc.closed && (
                                                    <span className="text-xs bg-neutral-200 text-neutral-900 px-8 py-4 rounded">
                                                        Fechada
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-neutral-900 text-sm mt-4">
                                                {disc.user.first_name} {disc.user.last_name} — {new Date(disc.created).toLocaleDateString('pt-PT')}
                                            </p>
                                            {disc.discussion.length > 0 && (
                                                <p className="text-neutral-900 text-sm mt-8 line-clamp-2">
                                                    {disc.discussion[0].content}
                                                </p>
                                            )}
                                            <p className="text-neutral-900 text-sm mt-8">
                                                {disc.discussion.length} {disc.discussion.length === 1 ? 'mensagem' : 'mensagens'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Tab>
                <Tab>
                    <TabHeader>
                        Recursos comunitários ({dataset.community_resources?.length || 0})
                    </TabHeader>
                    {renderTabBody(
                        !dataset.community_resources || dataset.community_resources.length === 0 ? (
                            <div className="bg-white rounded-8 py-64 px-32 flex flex-col items-center text-center">
                                <Icon name="agora-line-user-group" className="w-[40px] h-[40px] text-primary-500 icon-xl mb-16" />
                                <h3 className="text-primary-600 text-[2rem] leading-[3rem] mb-16" style={{ fontWeight: 300 }}>
                                    Sem recursos comunitários
                                </h3>
                                <p className="text-neutral-900 text-base font-normal mb-8">
                                    Atualmente, não existem recursos comunitários disponíveis para este conjunto de dados.
                                </p>
                                <div className="flex flex-row items-center gap-16 mt-32">
                                    <Button
                                        variant="primary"
                                        appearance="solid"
                                    >
                                        Compartilhe os seus recursos
                                    </Button>
                                    <Button
                                        variant="primary"
                                        appearance="outline"
                                    >
                                        Saiba mais sobre a comunidade
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <DatasetResourcesTable resources={dataset.community_resources} />
                        )
                    )}
                </Tab>
                <Tab>
                    <TabHeader>Informação</TabHeader>
                    {renderTabBody(
                        <DatasetInfo dataset={dataset} />
                    )}
                </Tab>
            </Tabs>
        </div>
    );
};
