# PreviDados

Sistema web juridico-previdenciario para advocacia previdenciaria, com foco em gestao de casos por incapacidade, BPC/LOAS, documentos, estrategia interna e analytics.

## Estrutura

- `apps/api`: API NestJS com Prisma e PostgreSQL
- `apps/web`: painel administrativo em Next.js
- `docs/`: documentacao funcional e arquitetural

## Funcionalidades entregues no MVP tecnico

- login com JWT
- CRUD de clientes
- CRUD de peritos
- CRUD de casos
- CRUD de documentos com extracao estruturada manual
- filtros por texto no modulo de casos
- dashboard com agregacoes iniciais
- tabelas mestre para doencas, CIDs e categorias documentais
- seed inicial com usuario admin e dados de exemplo
- base pronta para OCR, IA e busca semantica futura

## Variaveis de ambiente

Copie `.env.example` para `.env` na raiz do projeto.

## Subida de infraestrutura local

```bash
docker compose up -d
```

## Backend

```bash
cd apps/api
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

API disponivel em `http://localhost:3333/api`
Swagger em `http://localhost:3333/api/docs`

## Frontend

```bash
cd apps/web
npm install
npm run dev
```

Painel disponivel em `http://localhost:3000`

Variaveis do frontend:

- `NEXT_PUBLIC_API_URL`: URL publica da API
- `API_URL_INTERNAL`: opcional para chamadas server-side em producao

## Credenciais seed

- email: `admin@jcprevdados.local`
- senha: `admin123`

## Producao

- frontend: Vercel
- backend: Railway, Render ou VPS com Docker
- banco: PostgreSQL gerenciado
- storage: S3/R2/MinIO
- filas assicronas: Redis

Configuracao recomendada para a Vercel:

- `Root Directory`: `apps/web`
- `Framework Preset`: `Next.js`
- `Install Command`: `npm install`
- `Build Command`: `npm run build`
- variavel obrigatoria: `NEXT_PUBLIC_API_URL`

Guia detalhado:

- [deploy-vercel.md](c:/Users/João%20Carvalho/Documents/jcprevdados/docs/deploy-vercel.md)

## Evolucao para IA e OCR

- acionar OCR em upload de documentos por fila assicrona
- gravar texto extraido e metadados em tabela especifica
- gerar `document_extractions` via modelo de IA
- revisar sugestoes na interface antes de consolidar analytics
- adicionar `pgvector` para casos semelhantes e busca por linguagem natural
