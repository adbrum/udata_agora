import React from 'react';
import { Button, InputText } from '@ama-pt/agora-design-system';

export const NewsletterHighlight = () => {
    return (
        <div className="hero-background bg-primary-900 text-white pt-24 pb-32 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="md:w-1/2 space-y-4">
                        <h2 className="text-3xl font-bold">Subscreva a nossa Newsletter</h2>
                        <p className="text-lg text-white/90">
                            Fique a par das últimas novidades e atualizações da nossa plataforma.
                        </p>
                    </div>
                    <div className="md:w-1/2 w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="newsletter-email" className="sr-only">Email</label>
                                <InputText
                                    id="newsletter-email"
                                    placeholder="O seu email"
                                    className="bg-white text-neutral-900"
                                />
                            </div>
                            <Button appearance="primary" className="w-full justify-center">
                                Subscrever
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
