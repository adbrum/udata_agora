import React from 'react';
import { Icon, Button } from '@ama-pt/agora-design-system';
import { Resource } from '@/types/api';

interface DatasetResourcesTableProps {
    resources: Resource[];
}

export const DatasetResourcesTable: React.FC<DatasetResourcesTableProps> = ({ resources }) => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wide mb-2 opacity-70">
                {resources.length} Ficheiros Principais
            </h3>
            {resources.map((resource) => (
                <div
                    key={resource.id}
                    className="bg-white border border-neutral-200 rounded-lg p-6 flex items-center justify-between gap-4 hover:shadow-md transition-shadow group"
                >
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg text-neutral-900 mb-1 group-hover:text-primary-700 transition-colors">
                            {resource.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-neutral-500">
                            <span>
                                Atualizado em {new Date(resource.created_at).toLocaleDateString('pt-PT', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                            <span className="flex items-center gap-1 font-medium text-neutral-700">
                                <Icon name="agora-line-file" className="w-4 h-4" />
                                {resource.format || 'Ficheiro'}
                            </span>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 text-primary-700 transition-colors"
                            aria-label="Download"
                        >
                            <Icon name="agora-line-download" className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};
