# Deploy do Frontend na Vercel

Este projeto deve ser publicado em dois blocos:

- `apps/web` na Vercel
- `apps/api` em Railway, Render ou outro host para Node.js

## Por que separar

O frontend e o backend estao em apps diferentes. O painel `Next.js` funciona muito bem na Vercel, enquanto a API `NestJS` atual foi desenhada como servidor dedicado.

## Passo 1. Subir o codigo para o GitHub

Publique a raiz do repositorio inteiro.

## Passo 2. Criar o projeto na Vercel

Na Vercel:

1. `Add New > Project`
2. importe o repositorio
3. configure:

- `Framework Preset`: `Next.js`
- `Root Directory`: `apps/web`
- `Install Command`: `npm install`
- `Build Command`: `npm run build`

## Passo 3. Variaveis de ambiente

Cadastre na Vercel:

```env
NEXT_PUBLIC_API_URL=https://SUA-API-PUBLICA
```

Opcional, se quiser uma URL interna separada para chamadas server-side:

```env
API_URL_INTERNAL=https://SUA-API-INTERNA
```

## Passo 4. Redeploy

Depois de salvar as variaveis, faca um novo deploy.

## Backend

Antes do frontend funcionar em producao, a API precisa estar online.

Exemplo de URL valida:

```text
https://api.previdados.com
```

## Observacoes

- localmente, o frontend continua usando `http://localhost:3333` como fallback
- em producao, o ideal e sempre definir `NEXT_PUBLIC_API_URL`
- se a API estiver em outro dominio, habilite CORS nela para o dominio da Vercel
