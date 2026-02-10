# Automação de APIs com Playwright + TypeScript

Estrutura inicial para testes de API usando `@playwright/test` e TypeScript.

Primeiros passos:

1. Instalar dependências:

```bash
npm install
```

2. Instalar navegadores e binários do Playwright (recomendado):

```bash
npx playwright install
```

3. Executar os testes:

```bash
npm test
```

Arquivos importantes:

- `playwright.config.ts`: configuração do Playwright.
- `src/tests`: testes de exemplo.
- `src/api/client.ts`: helpers para requisições API.
