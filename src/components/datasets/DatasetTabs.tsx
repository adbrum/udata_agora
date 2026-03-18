'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tabs, Tab, TabHeader, TabBody } from '@ama-pt/agora-design-system';
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
                        reuseCount === 0 ? (
                            <p className="text-neutral-500">Nenhuma reutilização associada a este conjunto de dados.</p>
                        ) : (
                            <div className="space-y-16">
                                {reuses.map((reuse) => (
                                    <div key={reuse.id} className="bg-white rounded-4 p-24 border border-neutral-200">
                                        <Link
                                            href={`/pages/reuses/${reuse.slug}`}
                                            className="text-primary-600 hover:underline text-m-semibold"
                                        >
                                            {reuse.title}
                                        </Link>
                                        {reuse.description && (
                                            <p className="text-neutral-700 text-sm mt-8 line-clamp-2">
                                                {reuse.description}
                                            </p>
                                        )}
                                        {reuse.organization && (
                                            <p className="text-neutral-500 text-xs mt-8">
                                                {reuse.organization.name}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </Tab>
                <Tab>
                    <TabHeader>Discussões ({discussionCount})</TabHeader>
                    {renderTabBody(
                        discussionCount === 0 ? (
                            <p className="text-neutral-500">Nenhuma discussão sobre este conjunto de dados.</p>
                        ) : (
                            <div className="space-y-16">
                                {discussions.map((disc) => (
                                    <div key={disc.id} className="bg-white rounded-4 p-24 border border-neutral-200">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-m-semibold text-neutral-900">{disc.title}</h4>
                                            {disc.closed && (
                                                <span className="text-xs bg-neutral-200 text-neutral-600 px-8 py-2 rounded">
                                                    Fechada
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-neutral-500 text-xs mt-4">
                                            {disc.user.first_name} {disc.user.last_name} — {new Date(disc.created).toLocaleDateString('pt-PT')}
                                        </p>
                                        {disc.discussion.length > 0 && (
                                            <p className="text-neutral-700 text-sm mt-8 line-clamp-2">
                                                {disc.discussion[0].content}
                                            </p>
                                        )}
                                        <p className="text-neutral-500 text-xs mt-8">
                                            {disc.discussion.length} {disc.discussion.length === 1 ? 'mensagem' : 'mensagens'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </Tab>
                <Tab>
                    <TabHeader>
                        Recursos comunitários ({dataset.community_resources?.length || 0})
                    </TabHeader>
                    {renderTabBody(
                        !dataset.community_resources || dataset.community_resources.length === 0 ? (
                            <p className="text-neutral-500">Nenhum recurso comunitário disponível.</p>
                        ) : (
                            <DatasetResourcesTable resources={dataset.community_resources} />
                        )
                    )}
                </Tab>
                <Tab>
                    <TabHeader>Informação</TabHeader>
                    {renderTabBody(
                        <DatasetInfo description={dataset.description} id={dataset.id} />
                    )}
                </Tab>
            </Tabs>
        </div>
    );
};
