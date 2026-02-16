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
                    <h1 className="text-3xl-bold text-[#002D72] mb-32 text-left" id="login-title">
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

                        <div className="flex justify-center mt-32">
                            <Button variant="primary" type="submit" className="min-w-[200px] h-11 px-48" id="submit-login">
                                Iniciar sessão
                            </Button>
                        </div>
                    </form>

                    {/* Links Section */}
                    <div className="flex flex-col items-center gap-16 mt-32 text-sm">
                        <div className="flex flex-wrap justify-center items-center gap-8">
                            <span className="">Esqueceu a senha?</span>
                            <Button appearance="link">
                                Recuperar a senha
                            </Button>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 text-center">
                            <span className="">Não recebeu as instruções de confirmação?</span>
                            <Button appearance="link">
                                Reenvie as instruções
                            </Button>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="my-32 border-t border-neutral-200 w-full" />

                    {/* Chave Móvel Digital Section */}
                    <div className="flex flex-col items-center gap-16 w-full">
                        <Button
                            appearance="outline"
                            variant="primary"
                            hasIcon={true}
                            leadingIcon="agora-line-user"
                            leadingIconHover="agora-solid-user"
                            className="w-full h-11"
                            id="login-cmd"
                        >
                            Autenticação Chave Móvel Digital
                        </Button>
                        <Link href="#" className="text-sm text-primary-600 hover:underline">
                            O que é a Chave Móvel Digital?
                        </Link>
                    </div>

                    {/* Separator */}
                    <div className="my-32 border-t border-neutral-200 w-full" />

                    {/* Create Account Section */}
                    <div className="flex flex-col items-center gap-16">
                        <h2 className="text-xl-bold text-[#002D72]">Não tem uma conta?</h2>
                        <Link href="/pages/register">
                            <Button
                                appearance="outline"
                                variant="primary"
                                className="min-w-[200px] h-11 px-48"
                                id="create-account"
                            >
                                Criar uma conta
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
