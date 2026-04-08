# Guia de Deploy - App Racha

## Pré-requisitos

- Conta no GitHub
- Conta no Vercel
- Git instalado localmente

## Passo 1: Preparar o Repositório Git

```bash
# Se ainda não inicializou git
cd app-racha
git init
git add .
git commit -m "Initial commit: App Racha"

# Se já tem repositório
git add .
git commit -m "App Racha implementation"
git push origin main
```

## Passo 2: Deploy no Vercel

### Opção A: Via CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

### Opção B: Via Website

1. Acesse [vercel.com](https://vercel.com/dashboard)
2. Clique em "Add New..." → "Project"
3. Selecione o repositório do GitHub
4. Clique em "Import"
5. As configurações devem ser detectadas automaticamente
6. Clique em "Deploy"

### Opção C: GitHub Integration

1. No Vercel, conecte sua conta GitHub
2. Instale o Vercel App no seu repositório
3. Cada push para `main` fará deploy automático

## Configurações Vercel

O arquivo `vercel.json` contém:

- **outputDirectory**: `.next` (padrão Next.js)
- **installCommand**: `npm ci` (para build limpo)
- **buildCommand**: `npm run build`

## URLs Após Deploy

Após deployment, você terá:

- **Preview URL**: `https://<seu-projeto>-<seu-usuario>.vercel.app`
- **Production URL**: `https://<seu-projeto>.vercel.app` (se configurado)
- **Custom Domain**: Pode adicionar no Vercel Dashboard

## Variáveis de Ambiente

Até o momento, o app não requer variáveis de ambiente. Caso futuro seja necessário adicionar:

1. Vá para projeto no Vercel Dashboard
2. Settings → Environment Variables
3. Adicione as variáveis

## Monitoramento

No Vercel Dashboard, você pode:

- Acompanhar deployments
- Ver logs de build
- Verificar analytics
- Configurar alertas

## Troubleshooting

### Build falha
```bash
# Verificar localmente
npm run build

# Verificar typings
npx tsc --noEmit
```

### Deploy lento
- Vercel cacheia dependências
- Primeiro deploy é mais lento
- Próximos deployments são rápidos

### Problemas com CORS
- O app não faz chamadas externas
- Não há necessidade de configurar CORS

## Rollback

Se precisar revert a um deployment anterior:

1. No Vercel Dashboard
2. Vá para "Deployments"
3. Encontre o deployment anterior
4. Clique em "..." → "Promote to Production"

## Atualizações Contínuas

```bash
# Fazer mudanças localmente
git add .
git commit -m "Feature: Nova funcionalidade"
git push origin main

# Vercel fará deploy automaticamente
# Acompanhe em: https://vercel.com/deployments
```

## Suporte

- Documentação Next.js: https://nextjs.org/docs
- Documentação Vercel: https://vercel.com/docs
- Discord Vercel: https://vercel.com/support
