'use client';

import React from 'react';
import {
    Button,
    RadioButton,
    Checkbox,
    Icon,
    Breadcrumb,
    Tabs,
    Tab,
    TabHeader,
    TabBody,
} from '@ama-pt/agora-design-system';

export default function LoginClient() {
    const breadcrumbItems = [
        { label: 'Home', url: '/' },
        { label: 'Autenticação', url: '#' },
    ];

    return (
        <main className="flex-grow bg-white min-h-screen">
            <div className="container mx-auto px-16 py-32 max-w-7xl">
                {/* Breadcrumb */}
                <div className="mb-48">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Title Section */}
                <div className="mb-64">
                    <h1 className="text-40 font-bold text-brand-blue-dark mb-16">
                        Autenticação
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl">
                        Escolha um meio de autenticação para se autenticar no portal e ter acesso aos vários serviços e funcionalidades online.
                    </p>
                </div>

                {/* Main Content with Vertical Tabs */}
                <Tabs vertically>
                    <Tab>
                        <TabHeader>Chave Móvel Digital (CMD)</TabHeader>
                        <TabBody>
                            <div className="bg-accent-light p-48 rounded-8">
                                <div className="flex flex-col gap-40">
                                    <div className="flex justify-between items-start flex-wrap gap-24">
                                        <div className="flex flex-col gap-16">
                                            <div className="bg-[#E9EBFF] p-12 rounded-8 w-fit">
                                                <Icon name="agora-line-user" className="w-24 h-24 text-brand-blue-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl-bold text-brand-blue-dark mb-8">Para se autenticar</h2>
                                                <p className="text-base text-neutral-700">
                                                    Precisa do código PIN da sua CMD e do telemóvel que lhe está associado.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12 bg-white px-24 py-16 rounded-8 shadow-sm">
                                            <div className="relative flex items-center justify-center w-32 h-32">
                                                <div className="absolute inset-0 bg-brand-blue-primary rounded-full opacity-10 animate-pulse"></div>
                                                <Icon name="agora-solid-plus-circle" className="w-24 h-24 text-brand-blue-primary" />
                                            </div>
                                            <span className="text-brand-blue-dark font-bold tracking-tight text-lg">AUTENTICAÇÃO.GOV</span>
                                        </div>
                                    </div>

                                    <div className="w-full h-[1px] bg-neutral-200"></div>

                                    <div className="flex flex-col gap-24">
                                        <div className="flex flex-col gap-16">
                                            <RadioButton
                                                label="Cidadão nacional"
                                                id="nacional"
                                                name="citizen-type"
                                                defaultChecked
                                                className="text-lg"
                                            />
                                            <RadioButton
                                                label="Cidadão estrangeiro"
                                                id="estrangeiro"
                                                name="citizen-type"
                                                className="text-lg"
                                            />
                                        </div>

                                        <div className="mt-8">
                                            <Checkbox
                                                label="Declaro que li e aceito os termos e condições para o tratamento dos meus dados pessoais no acesso e utilização da Área Reservada do dadosgov.pt"
                                                id="terms"
                                                className="text-sm text-neutral-700 leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-16">
                                        <Button
                                            variant="primary"
                                            className="px-48 h-56 rounded-8 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                                            hasIcon={true}
                                            trailingIcon="agora-line-arrow-right-circle"
                                        >
                                            Autenticar com CMD
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabBody>
                    </Tab>
                    <Tab>
                        <TabHeader>Autenticação europeia (eIDAS)</TabHeader>
                        <TabBody>
                            <div className="bg-accent-light p-48 rounded-8 flex flex-col items-center justify-center py-64 text-center">
                                <Icon name="agora-line-globe" className="w-64 h-64 text-brand-blue-primary mb-24" />
                                <h2 className="text-2xl-bold text-brand-blue-dark mb-16">Autenticação europeia (eIDAS)</h2>
                                <p className="text-neutral-600 max-w-md">
                                    Utilize os seus meios de autenticação de outros estados-membros da União Europeia.
                                </p>
                            </div>
                        </TabBody>
                    </Tab>
                    <Tab>
                        <TabHeader>Iniciar sessão</TabHeader>
                        <TabBody>
                            <div className="bg-accent-light p-48 rounded-8 flex flex-col items-center justify-center py-64 text-center">
                                <Icon name="agora-line-lock" className="w-64 h-64 text-brand-blue-primary mb-24" />
                                <h2 className="text-2xl-bold text-brand-blue-dark mb-16">Iniciar sessão</h2>
                                <p className="text-neutral-600 max-w-md">
                                    Utilize as suas credenciais do portal dados.gov para iniciar sessão.
                                </p>
                            </div>
                        </TabBody>
                    </Tab>
                </Tabs>
            </div>
        </main>
    );
}
