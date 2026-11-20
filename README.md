# Sora.GG — protótipo

Site da organização Sora.GG, com coleção de uniformes, criadoras, história, parceiros e diário.

## Tecnologias

- React para as interações da página.
- Vite para desenvolvimento e geração do site estático.
- Node.js com Express para servir a pasta de produção e disponibilizar um endpoint de status.

## Como executar

```sh
npm install
npm run dev
```

Para gerar e servir a versão de produção:

```sh
npm run build
npm start
```

O servidor Node escuta a porta definida em `PORT` (padrão: 3000). O endpoint `/api/health` informa se o serviço está ativo.

