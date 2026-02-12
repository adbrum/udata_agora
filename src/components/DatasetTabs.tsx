import React from 'react';
import { Tabs, Tab, TabHeader, TabBody } from '@ama-pt/agora-design-system';
import { Dataset } from '@/types/api';
import { DatasetResourcesTable } from './DatasetResourcesTable';
import { DatasetInfo } from './DatasetInfo';

interface DatasetTabsProps {
    dataset: Dataset;
}

export const DatasetTabs: React.FC<DatasetTabsProps> = ({ dataset }) => {
    return (
        <div className="mt-64">
            <Tabs>
                <Tab>
                    <TabHeader>Ficheiros ({dataset.resources.length})</TabHeader>
                    <TabBody>
                        <div className="mt-6">
                            <DatasetResourcesTable resources={dataset.resources} />
                        </div>
                    </TabBody>
                </Tab>
                <Tab>
                    <TabHeader>Informação</TabHeader>
                    <TabBody>
                        <DatasetInfo description={dataset.description} id={dataset.id} />
                    </TabBody>
                </Tab>
            </Tabs>
        </div>
    );
};
