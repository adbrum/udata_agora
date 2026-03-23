'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tabs, Tab, TabHeader, TabBody, CardNoResults, CardLinks, Icon, StatusCard, Button, InputSearchBar, InputText, InputTextArea } from '@ama-pt/agora-design-system';
import { Dataset, Discussion, DiscussionCreatePayload, Reuse, Resource } from '@/types/api';
import { fetchDiscussions, fetchReuses, fetchCommunityResourcesByDataset, createDiscussion } from '@/services/api';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
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
    const [showNewDiscussion, setShowNewDiscussion] = useState(false);
    const [newDiscTitle, setNewDiscTitle] = useState('');
    const [newDiscMessage, setNewDiscMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [communityResources, setCommunityResources] = useState<Resource[]>([]);
    const [communityCount, setCommunityCount] = useState(0);

    const handleCreateDiscussion = async () => {
        if (!newDiscTitle.trim() || !newDiscMessage.trim()) return;
        setIsSubmitting(true);
        try {
            const payload: DiscussionCreatePayload = {
                title: newDiscTitle.trim(),
                comment: newDiscMessage.trim(),
                subject: {
                    class: 'Dataset',
                    id: dataset.id,
                },
            };
            const created = await createDiscussion(payload);
            if (created) {
                setDiscussions((prev) => [created, ...prev]);
                setDiscussionCount((prev) => prev + 1);
                setNewDiscTitle('');
                setNewDiscMessage('');
                setShowNewDiscussion(false);
            }
        } catch (error) {
            console.error('Error creating discussion:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        async function loadTabData() {
            try {
                const [discResponse, reuseResponse, communityResponse] = await Promise.all([
                    fetchDiscussions(dataset.id),
                    fetchReuses(1, 20, { dataset: dataset.id }),
                    fetchCommunityResourcesByDataset(dataset.id),
                ]);
                setDiscussions(discResponse.data);
                setDiscussionCount(discResponse.total);
                setReuses(reuseResponse.data);
                setReuseCount(reuseResponse.total);
                setCommunityResources(communityResponse.data);
                setCommunityCount(communityResponse.total);
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
                                        <Icon name="agora-line-file" className="w-[40px] h-[40px] text-primary-500 icon-xl" />
                                    }
                                    title="Sem reutilizações"
                                    description="Ainda não existem reutilizações associadas a este conjunto de dados."
                                    hasAnchor={false}
                                />
                            ) : (
                                <div className="grid grid-cols-2 agora-card-links-datasets-px0 gap-32">
                                    {reuses.map((reuse) => (
                                        <div key={reuse.id} className="h-full">
                                            <CardLinks
                                                onClick={() => window.location.href = `/pages/reuses/${reuse.slug}`}
                                                className="cursor-pointer text-neutral-900"
                                                variant="transparent"
                                                image={{
                                                    src: reuse.image_thumbnail || reuse.image || '/laptop.png',
                                                    alt: reuse.title,
                                                }}
                                                category={reuse.organization?.name || 'Reutilização'}
                                                title={<div className="underline text-xl-bold">{reuse.title}</div>}
                                                description={
                                                    reuse.description ? (
                                                        <p className="text-sm line-clamp-3 leading-relaxed text-neutral-900 mt-[8px] max-w-[592px]">
                                                            {reuse.description}
                                                        </p>
                                                    ) : undefined
                                                }
                                                date={
                                                    <span className="font-[300]">
                                                        Atualizado{' '}
                                                        {format(
                                                            new Date(reuse.last_modified || reuse.created_at),
                                                            'dd MM yyyy',
                                                            { locale: pt }
                                                        )}
                                                    </span>
                                                }
                                                links={[
                                                    {
                                                        href: '#',
                                                        hasIcon: true,
                                                        leadingIcon: 'agora-line-eye',
                                                        leadingIconHover: 'agora-solid-eye',
                                                        trailingIcon: '',
                                                        trailingIconHover: '',
                                                        trailingIconActive: '',
                                                        children: reuse.metrics?.views?.toLocaleString('pt-PT') || '0',
                                                        title: 'Visualizações',
                                                        onClick: (e: React.MouseEvent) => e.preventDefault(),
                                                        className: 'text-[#034AD8]',
                                                    },
                                                    {
                                                        href: '#',
                                                        hasIcon: true,
                                                        leadingIcon: 'agora-line-calendar',
                                                        leadingIconHover: 'agora-solid-calendar',
                                                        trailingIcon: '',
                                                        trailingIconHover: '',
                                                        trailingIconActive: '',
                                                        children: `${reuse.datasets?.length || 0} datasets`,
                                                        title: 'Datasets',
                                                        onClick: (e: React.MouseEvent) => e.preventDefault(),
                                                        className: 'text-[#034AD8]',
                                                    },
                                                    {
                                                        href: '#',
                                                        hasIcon: true,
                                                        leadingIcon: 'agora-line-star',
                                                        leadingIconHover: 'agora-solid-star',
                                                        trailingIcon: '',
                                                        trailingIconHover: '',
                                                        trailingIconActive: '',
                                                        children: reuse.metrics?.followers || 0,
                                                        title: 'Favoritos',
                                                        onClick: (e: React.MouseEvent) => e.preventDefault(),
                                                        className: 'text-[#034AD8]',
                                                    },
                                                ]}
                                                mainLink={
                                                    <Link href={`/pages/reuses/${reuse.slug}`}>
                                                        <span className="underline">{reuse.title}</span>
                                                    </Link>
                                                }
                                                blockedLink={true}
                                            />
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
                                        onClick={() => setShowNewDiscussion(!showNewDiscussion)}
                                    >
                                        Iniciar nova discussão
                                    </Button>
                                </div>
                            </div>
                            {/* New discussion form */}
                            {showNewDiscussion && (
                                <div className="bg-white rounded-8 p-32 mb-24">
                                    <div className="flex justify-between items-center mb-16">
                                        <h3 className="font-bold text-neutral-900 text-base">
                                            Nova discussão
                                        </h3>
                                        <Button
                                            variant="primary"
                                            appearance="link"
                                            onClick={() => setShowNewDiscussion(false)}
                                        >
                                            Fechar
                                        </Button>
                                    </div>
                                    <p className="text-sm text-neutral-900 mb-16">
                                        Os campos marcados com um asterisco (<span className="text-red-500">*</span>) são obrigatórios.
                                    </p>
                                    <div className="mb-24">
                                        <InputText
                                            label="Título *"
                                            value={newDiscTitle}
                                            onChange={(e) => setNewDiscTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-24">
                                        <InputTextArea
                                            label="A sua mensagem *"
                                            value={newDiscMessage}
                                            onChange={(e) => setNewDiscMessage(e.target.value)}
                                            rows={4}
                                            placeholder="Por favor, mantenha a cordialidade e uma postura construtiva. Evite partilhar informações pessoais."
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="primary"
                                            appearance="solid"
                                            onClick={handleCreateDiscussion}
                                            disabled={isSubmitting || !newDiscTitle.trim() || !newDiscMessage.trim()}
                                        >
                                            {isSubmitting ? 'A enviar...' : 'Enviar'}
                                        </Button>
                                    </div>
                                </div>
                            )}
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
                                            {/* First message / topic */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-neutral-900 text-base">{disc.title}</h4>
                                                    <p className="text-sm text-neutral-900 mt-4">
                                                        <span className="text-primary-600 font-medium">
                                                            {disc.user.first_name} {disc.user.last_name}
                                                        </span>
                                                        {' — Publicado em '}
                                                        {format(new Date(disc.created), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                                                    </p>
                                                </div>
                                            </div>
                                            {disc.discussion.length > 0 && (
                                                <p className="text-neutral-900 text-sm mt-16">
                                                    {disc.discussion[0].content}
                                                </p>
                                            )}
                                            {/* Replies */}
                                            {disc.discussion.length > 1 && (
                                                <div className="mt-16 space-y-16 border-t border-neutral-200 pt-16">
                                                    {disc.discussion.slice(1).map((msg, idx) => (
                                                        <div key={idx} className="border-l-2 border-primary-600" style={{ paddingLeft: "24px" }}>
                                                            <p className="text-sm text-neutral-900">
                                                                <span className="text-primary-600 font-medium">
                                                                    {msg.posted_by.first_name} {msg.posted_by.last_name}
                                                                </span>
                                                                {' — '}
                                                                {format(new Date(msg.posted_on), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                                                            </p>
                                                            <p className="text-neutral-900 text-sm mt-4">
                                                                {msg.content}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Responder button */}
                                            <div className="flex justify-end" style={{ marginTop: "32px" }}>
                                                <Button
                                                    variant="primary"
                                                    appearance="outline"
                                                >
                                                    Responder
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Tab>
                <Tab>
                    <TabHeader>
                        Recursos comunitários ({communityCount})
                    </TabHeader>
                    {renderTabBody(
                        communityCount === 0 ? (
                            <div className="bg-white rounded-8 py-64 px-32 flex flex-col items-center text-center">
                                <Icon name="agora-line-user-group" className="w-[40px] h-[40px] text-primary-500 icon-xl mb-16" />
                                <h3 className="text-primary-600 text-[2rem] leading-[3rem] mb-16" style={{ fontWeight: 300 }}>
                                    Sem recursos comunitários
                                </h3>
                                <p className="text-neutral-900 text-base font-normal mb-8">
                                    Atualmente, não existem recursos comunitários disponíveis para este conjunto de dados.
                                </p>
                                <div className="flex flex-row items-center gap-16 mt-32">
                                    <Link href={`/pages/admin/me/community-resources/new?dataset_id=${dataset.id}`}>
                                        <Button
                                            variant="primary"
                                            appearance="solid"
                                        >
                                            Compartilhe os seus recursos
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="primary"
                                        appearance="outline"
                                    >
                                        Saiba mais sobre a comunidade
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-24">
                                    <StatusCard
                                        type="warning"
                                        description="Estes recursos são publicados pela comunidade e não são da responsabilidade do produtor dos dados."
                                    />
                                </div>
                                <div className="flex items-center justify-between mb-16">
                                    <h3 className="font-medium text-neutral-900 text-base">
                                        {communityCount} {communityCount === 1 ? "RECURSO COMUNITÁRIO" : "RECURSOS COMUNITÁRIOS"}
                                    </h3>
                                    <Link href={`/pages/admin/me/community-resources/new?dataset_id=${dataset.id}`}>
                                        <Button
                                            variant="primary"
                                            appearance="outline"
                                            hasIcon={true}
                                            leadingIcon="agora-line-plus-circle"
                                            leadingIconHover="agora-solid-plus-circle"
                                        >
                                            Compartilhe os seus recursos
                                        </Button>
                                    </Link>
                                </div>
                                <DatasetResourcesTable resources={communityResources} />
                            </div>
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
