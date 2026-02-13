'use client';

import React from 'react';
import Link from 'next/link';
import {
    Button,
    InputText,
    InputPassword,
    Checkbox,
    Icon,
} from '@ama-pt/agora-design-system';

export default function LoginClient() {
    return (
        <main className="flex-grow bg-white">
            <div className="container mx-auto px-16 py-64 flex flex-col items-center">
                <div className="w-full max-w-[560px]">
                    {/* Title and Intro */}
                    <h1 className="text-3xl-bold text-[#002D72] mb-16 text-left" id="login-title">
                        Iniciar Sessão
                    </h1>
                    <p className="text-sm mb-32">
                        Os campos marcados com um asterisco ( * ) são obrigatórios.
                    </p>

                    {/* Login Form */}
                    <form className="flex flex-col gap-24" onSubmit={(e) => e.preventDefault()}>
                        <InputText
                            label="Endereço de email *"
                            placeholder="Introduza aqui o texto"
                            id="email"
                            name="email"
                            type="email"
                            className="w-full"
                        />
                        <InputPassword
                            label="Senha *"
                            placeholder="Introduza aqui o texto"
                            id="password"
                            name="password"
                            className="w-full"
                        />

                        <div className="flex items-center">
                            <Checkbox label="Lembre de mim" id="remember" name="remember" />
                        </div>

                        <div className="flex justify-center mt-8">
                            <Button variant="primary" type="submit" className="min-w-[200px] h-11 px-48" id="submit-login">
                                Iniciar sessão
                            </Button>
                        </div>
                    </form>

                    {/* Links Section */}
                    <div className="flex flex-col items-center gap-16 mt-32 text-sm">
                        <div className="flex flex-wrap justify-center gap-4">
                            <span className="text-neutral-600">Esqueceu a senha?</span>
                            <Link href="#" className="text-primary-600 hover:underline font-bold">
                                Recuperar a senha
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-center">
                            <span className="text-neutral-600">Não recebeu as instruções de confirmação?</span>
                            <Link href="#" className="text-primary-600 hover:underline font-bold">
                                Reenvie as instruções
                            </Link>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="my-48 border-t border-neutral-200 w-full" />

                    {/* Chave Móvel Digital Section */}
                    <div className="flex flex-col items-center gap-16 w-full">
                        <Button
                            appearance="outline"
                            variant="primary"
                            className="w-full flex items-center justify-center gap-8 h-11"
                            id="login-cmd"
                        >
                            <Icon name="agora-line-user" className="w-20 h-20" />
                            Autenticação Chave Móvel Digital
                        </Button>
                        <Link href="#" className="text-sm text-primary-600 hover:underline">
                            O que é a Chave Móvel Digital?
                        </Link>
                    </div>

                    {/* Separator */}
                    <div className="my-48 border-t border-neutral-200 w-full" />

                    {/* Create Account Section */}
                    <div className="flex flex-col items-center gap-16">
                        <h2 className="text-xl-bold text-[#002D72]">Não tem uma conta?</h2>
                        <Button
                            appearance="outline"
                            variant="primary"
                            className="min-w-[200px] h-11 px-48"
                            id="create-account"
                        >
                            Criar uma conta
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
