# VigIA

**Nome do projeto:** VigIA  
**Descrição:** plataforma de segurança digital para análise de conteúdos suspeitos, acompanhamento de denúncias e educação para proteção online.  
**Endereço de exemplo:** [https://www.vigia.com.br](https://www.vigia.com.br) — endereço ilustrativo; não indica que o domínio esteja registrado ou configurado.

## Visão geral

O VigIA permite analisar textos, mensagens, URLs e imagens. A análise de imagens começa com OCR local no navegador; o conteúdo extraído é enviado ao serviço de análise. URLs são avaliadas por seus dados textuais e estruturais, sem serem abertas pelo servidor e sem consulta de reputação externa.

A aplicação também inclui cadastro, login, recuperação de senha, histórico privado de análises, denúncias com anexos, configurações de conta e visualização de planos.

## Tecnologias

- **Next.js 16** com App Router e Route Handlers
- **React 19** e **TypeScript**
- **Tailwind CSS 4** para estilos
- **Supabase** para autenticação, PostgreSQL, Row Level Security (RLS) e armazenamento de evidências
- **AI SDK** para gerar análises estruturadas com o modelo `google/gemini-3.6-flash`
- **Tesseract.js** para OCR local de imagens em português e inglês
- **SWR** para cache e atualização de dados no cliente
- **Recharts** para visualizações
- **Lucide React** para ícones
- **Zod** para validação de entradas e respostas
- **pnpm 12.3.4** para gerenciamento de dependências

## Arquitetura

O projeto usa uma arquitetura web em camadas, baseada no App Router:

1. **Interface:** páginas e componentes React em `app/` e `components/`.
2. **Autenticação e sessão:** Supabase Auth com cookies gerenciados por `@supabase/ssr`. O arquivo `proxy.ts` atualiza a sessão e protege rotas privadas.
3. **API de análise:** `POST /api/analyses` valida a entrada, exige sessão autenticada, solicita a análise ao modelo e grava o resultado associado ao usuário.
4. **Dados e arquivos:** consultas ao PostgreSQL e ao Storage do Supabase são limitadas pelas políticas RLS e pelas regras de acesso do usuário.
5. **OCR:** imagens são processadas no navegador com Tesseract.js; o texto extraído segue para a API de análise.

### Estrutura principal

```text
app/
├── api/analyses/route.ts      # API autenticada de análise
├── auth/                      # Cadastro, login, recuperação e callback
├── configuracoes/             # Configurações da conta
├── meu-plano/                 # Planos disponíveis
├── minhas-denuncias/          # Denúncias do usuário autenticado
├── globals.css                # Estilos globais e tokens visuais
├── layout.tsx                 # Layout raiz, idioma e metadados
└── page.tsx                   # Entrada e verificação de sessão
components/
├── analysis-result.tsx        # Apresentação do resultado da análise
└── vigia-dashboard.tsx        # Navegação e funcionalidades do painel
lib/
├── analysis.ts                # Tipos de análise
└── supabase/
    ├── client.ts              # Cliente Supabase para o navegador
    └── proxy.ts               # Integração da sessão no servidor
proxy.ts                       # Proteção e atualização de sessão
next.config.mjs                # Configuração do Next.js e headers
package.json                   # Scripts e dependências
```

## Serviços e dados

### Supabase

O projeto usa Supabase para autenticação de usuários, banco de dados PostgreSQL e Storage privado. O código acessa as tabelas `profiles`, `analyses`, `reports`, `report_attachments`, `report_status_history`, `plans`, `subscriptions` e `usage_records`.

As operações com dados pessoais devem permanecer protegidas por autenticação e RLS. O bucket `report-evidence` é privado e aceita arquivos PNG, JPEG, WEBP e PDF de até 5 MB. Os anexos são armazenados em caminhos associados ao usuário e à denúncia.

> O repositório não contém arquivos de migração do banco. O schema, as políticas RLS, os privilégios e o bucket precisam existir no projeto Supabase conectado.

### Análise de conteúdo

A API valida tipo e tamanho do conteúdo, limita a análise à sessão autenticada e grava resultados em `analyses`. O modelo retorna pontuação de risco, indicadores, explicação e recomendações. A classificação é uma estimativa baseada no conteúdo fornecido, não uma confirmação de fraude.

As imagens aceitas para análise são PNG, JPEG e WEBP, com limite de 5 MB. O OCR ocorre no navegador. Para URLs, o servidor valida o protocolo e analisa apenas o endereço informado; não segue redirecionamentos, não acessa o site e não consulta listas externas de reputação.

### Planos e pagamentos

A aplicação apresenta informações de planos, mas não há processamento de pagamentos ou contratação automatizada incluídos neste repositório. Nenhuma cobrança é realizada.

## Requisitos

- Node.js 20.9 ou superior
- Corepack habilitado e pnpm 12.3.4
- Projeto Supabase configurado com as tabelas, políticas RLS e bucket descritos acima
- Acesso a um serviço compatível com o modelo de análise configurado no servidor

## Configuração local

1. Instale as dependências:

   ```bash
   corepack enable
   corepack prepare pnpm@12.3.4 --activate
   pnpm install
   ```

2. Crie `.env.local` na raiz do projeto com as credenciais do Supabase:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
   ```

   Use os valores do seu projeto Supabase. Não coloque chaves secretas ou de serviço em variáveis `NEXT_PUBLIC_*`.

3. Configure no ambiente de execução o acesso ao serviço de IA exigido pela integração do modelo. Não armazene credenciais no repositório.

4. Inicie a aplicação em desenvolvimento:

   ```bash
   pnpm dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000).

## Build e execução

```bash
# Build de produção
pnpm build

# Iniciar a versão compilada
pnpm start
```

Para conferir os tipos separadamente:

```bash
pnpm exec tsc --noEmit
```

O projeto não declara atualmente scripts dedicados de testes automatizados ou lint em `package.json`.

## Rotas principais

- `/` — painel e visão geral
- `/auth/cadastro` — cadastro
- `/auth/login` — login
- `/auth/recuperar` — recuperação de senha
- `/auth/nova-senha` — atualização de senha
- `/minhas-denuncias` — denúncias privadas
- `/configuracoes` — configurações da conta
- `/meu-plano` — informações de planos
- `POST /api/analyses` — análise autenticada de conteúdo
