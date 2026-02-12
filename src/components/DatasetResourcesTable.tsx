import React from 'react';
import { Icon, CardExpandable } from '@ama-pt/agora-design-system';
import { Resource } from '@/types/api';

interface DatasetResourcesTableProps {
    resources: Resource[];
}

export const DatasetResourcesTable: React.FC<DatasetResourcesTableProps> = ({ resources }) => {
    // Grouping resources (mocking for now since we don't have categories in data)
    // In a real scenario, we would filter by some property.
    const principalFiles = resources.slice(0, 2);
    const documentationFiles = resources.slice(2);

    const renderResourceCard = (resource: Resource) => (
        <CardExpandable
            key={resource.id}
            cardTitle={resource.title}
            showBookmarkIcon={false}
            cardSubtitle={
                <div className="flex flex-col gap-4 mt-8">
                    <p className="text-sm text-neutral-500">
                        Atualizado em {new Date(resource.created_at).toLocaleDateString('pt-PT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <div className="flex items-center gap-2">
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-8 text-primary-700 font-bold hover:underline"
                        >
                            <Icon name="agora-line-file" className="w-5 h-5" />
                            <span>Formato {resource.format || 'Ficheiro'} (25,2 MB)</span>
                        </a>
                        <div className="ml-auto">
                            <Icon name="agora-line-download" className="w-6 h-6 text-primary-700" />
                        </div>
                    </div>
                </div>
            }
            accordionHeadingTitle="Mais detalhes"
            className="bg-white border-none shadow-sm"
        >
            <div className="pt-4 text-sm text-neutral-600">
                Informações detalhadas sobre este recurso, incluindo metadados técnicos e histórico de versões.
            </div>
        </CardExpandable>
    );

    return (
        <div className="space-y-32">
            {principalFiles.length > 0 && (
                <div className="space-y-16">
                    <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
                        {principalFiles.length} FICHEIROS PRINCIPAIS
                    </h3>
                    <div className="flex flex-col gap-16">
                        {principalFiles.map(renderResourceCard)}
                    </div>
                </div>
            )}

            {documentationFiles.length > 0 && (
                <div className="space-y-16">
                    <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
                        {documentationFiles.length} DOCUMENTAÇÃO
                    </h3>
                    <div className="flex flex-col gap-16">
                        {documentationFiles.map(renderResourceCard)}
                    </div>
                </div>
            )}
        </div>
    );
};
