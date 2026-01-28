# Wemei App

Aplicação web moderna construída com Next.js 16, React 19, TypeScript e TailwindCSS.

## 🚀 Tecnologias

### Core

- **[Next.js 16.1.6](https://nextjs.org/)** - Framework React com App Router
- **[React 19.2.3](https://react.dev/)** - Biblioteca para interfaces de usuário
- **[TypeScript 5](https://www.typescriptlang.org/)** - JavaScript com tipagem estática
- **[TailwindCSS 4](https://tailwindcss.com/)** - Framework CSS utility-first

### Gerenciamento de Estado e Dados

- **[TanStack Query (React Query) 5](https://tanstack.com/query)** - Gerenciamento de estado assíncrono e cache
- **[Zustand 5](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado global simplificado
- **[Axios 1.13](https://axios-http.com/)** - Cliente HTTP

### Formulários e Validação

- **[React Hook Form 7](https://react-hook-form.com/)** - Gerenciamento de formulários performático
- **[Zod 4](https://zod.dev/)** - Schema validation com TypeScript
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Integração Zod + React Hook Form

### UI/UX

- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizáveis com Radix UI
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não estilizados
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Suporte a tema claro/escuro
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications elegantes
- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[react-day-picker](https://daypicker.dev/)** - Seletor de datas

### Utilidades

- **[clsx](https://github.com/lukeed/clsx)** - Construção condicional de classes CSS
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge inteligente de classes TailwindCSS

## 📁 Estrutura do Projeto

```
wemei-app/
├── app/
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes shadcn/ui
│   │   └── controlled/  # Componentes controlados
│   ├── hooks/           # Custom React Hooks
│   ├── providers/       # Context Providers
│   ├── schemas/         # Schemas Zod para validação
│   ├── service/         # Serviços e API calls
│   ├── store/           # Stores Zustand
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Funções utilitárias
│   ├── layout.tsx       # Layout raiz
│   ├── page.tsx         # Página inicial
│   └── globals.css      # Estilos globais
├── lib/
│   └── utils.ts         # Utilitários do shadcn
└── public/              # Arquivos estáticos
```

## 🛠️ Instalação

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn** ou **pnpm**

### Passos

1. Clone o repositório:

```bash
git clone <repository-url>
cd wemei-app
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente (se necessário):

```bash
cp .env.example .env.local
```

## 🚀 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev
```

Inicia o servidor de desenvolvimento em [http://localhost:3000](http://localhost:3000).

### Build de Produção

```bash
npm run build
```

Cria uma build otimizada para produção.

### Produção

```bash
npm start
```

Inicia o servidor de produção (requer build anterior).

### Linting

```bash
npm run lint
```

Executa o ESLint para verificar o código.

## 📝 Padrões e Convenções

### TypeScript

- **NUNCA** use o tipo `any`
- Sempre use tipos explícitos e específicos
- Prefira `unknown` quando o tipo for desconhecido
- Use type guards para narrowing adequado

### Formulários

- **SEMPRE** use `react-hook-form` com `zod`
- Schemas de validação em `app/schemas/`
- Use `SchemaMessageTypes` para mensagens de erro centralizadas

### Componentes shadcn/ui

```bash
npx shadcn@latest add <component-name>
```

Componentes serão criados automaticamente em `app/components/ui/`

### Commits

O projeto usa **Husky** e **Commitlint** para padronizar commits seguindo o [Conventional Commits](https://www.conventionalcommits.org/).

#### Formato de Commit

```
<tipo>: <descrição>

[corpo opcional]

[rodapé opcional]
```

#### Tipos Permitidos

- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação, ponto e vírgula, etc
- `refactor` - Refatoração de código
- `perf` - Melhoria de performance
- `test` - Adição/correção de testes
- `build` - Mudanças no build
- `ci` - Mudanças em CI
- `chore` - Outras mudanças
- `revert` - Reverter commit

#### Exemplos

```bash
git commit -m "feat: adiciona componente de login"
git commit -m "fix: corrige validação do formulário"
git commit -m "docs: atualiza README com instruções de commit"
```

## 🎨 Temas

O projeto suporta tema claro e escuro usando `next-themes`. O tema é persistido automaticamente.

## 🔧 Ferramentas de Desenvolvimento

- **React Query Devtools** - Habilitado em modo desenvolvimento
- **ESLint** - Linting e formatação de código
- **TypeScript** - Verificação de tipos em tempo real

## 📦 Build

O projeto usa Turbopack (Next.js 16) para builds rápidas em desenvolvimento e produção.

## 📄 Licença

[MIT](LICENSE)

## 👥 Autores

Desenvolvido por [Lurie Labs](https://lurielabs.com)
