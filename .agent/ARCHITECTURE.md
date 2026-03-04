# Projeto Ágora - Arquitetura Técnica

> Portal de Dados Abertos (udata_agora) baseado em Next.js e Ágora Design System.

---

## 🏗️ Visão Geral da Stack

| Camada | Tecnologia |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Linguagem** | TypeScript |
| **UI Library** | `@ama-pt/agora-design-system` |
| **Estilização** | Tailwind CSS 4 |
| **Roteamento** | App Router (Pasta `src/app/pages`) |

---

## 📁 Estrutura de Diretórios

```plaintext
src/
├── app/                  # Rotas e layout global
│   ├── pages/            # Páginas da aplicação (/pages/*)
│   ├── globals.css       # Estilos globais e design tokens
│   └── layout.tsx        # Layout raiz
├── components/           # Componentes React reutilizáveis
│   ├── datasets/         # Componentes relacionados a conjuntos de dados
│   ├── reuses/           # Componentes relacionados a reutilizações
│   └── ...               # Outros módulos de componentes
├── services/             # Lógica de integração com API (udata)
└── types/                # Definições de tipos TypeScript
```

---

## 🎨 Sistema de Design & Estilização

O projeto utiliza o **Ágora Design System** da AMA.

### Design Tokens
As variáveis de cor e espaçamento são baseadas em tokens CSS definidos no `globals.css`:
- `--color-primary-[50-900]`
- `--color-neutral-[50-900]`
- `--color-brand-*`

### Tailwind CSS 4
O Tailwind está configurado para trabalhar em conjunto com o Design System.
- Configuração: `tailwind.config.ts`.
- PostCSS: `@tailwindcss/postcss`.

---

## 🚦 Fluxos de Dados

1. **Client Components**: Usar `'use client'` para componentes interativos do Design System.
2. **Server Components**: Preferir para busca de dados (Data Fetching) nas páginas.
3. **Services**: Centralizar chamadas à API udata em `src/services`.

---

## 🌐 Internacionalização (i18n)

O portal suporta quatro idiomas:
- **PT**: Português (Principal)
- **EN**: Inglês
- **ES**: Espanhol
- **FR**: Francês

---

## 🛠️ Comandos Úteis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera o build de produção.
- `npm run lint`: Executa a verificação de linting.
