import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '@ama-pt/agora-design-system';
import { Resource } from '@/types/api';

interface DatasetResourcesTableProps {
    resources: Resource[];
}

export const DatasetResourcesTable: React.FC<DatasetResourcesTableProps> = ({ resources }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHeaderCell>Nome</TableHeaderCell>
                    <TableHeaderCell>Formato</TableHeaderCell>
                    <TableHeaderCell>Data</TableHeaderCell>
                    <TableHeaderCell>Ação</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {resources.map((resource) => (
                    <TableRow key={resource.id}>
                        <TableCell headerLabel="Nome">{resource.title}</TableCell>
                        <TableCell headerLabel="Formato">
                            <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-xs font-mono font-bold uppercase text-neutral-600">
                                {resource.format || 'Ficheiro'}
                            </span>
                        </TableCell>
                        <TableCell headerLabel="Data">
                            {new Date(resource.created_at).toLocaleDateString('pt-PT')}
                        </TableCell>
                        <TableCell headerLabel="Ação">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline">
                                Download
                            </a>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
