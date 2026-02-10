# 🧪 Guia de Testes

Este documento descreve a estratégia de testes, organização das suites, padrões adotados e como contribuir com novos cenários.

---

## 📋 Índice

- [Estratégia de Testes](#-estratégia-de-testes)
- [Organização das Suites](#-organização-das-suites)
- [Cobertura de Testes](#-cobertura-de-testes)
- [Padrões e Convenções](#-padrões-e-convenções)
- [Como Executar](#-como-executar)
- [Como Adicionar Novos Testes](#-como-adicionar-novos-testes)
- [Boas Práticas](#-boas-práticas)

---

## 🎯 Estratégia de Testes

O projeto adota uma abordagem de **testes de API** focada em:

### Tipos de Cenários

1. **Testes Positivos** (`@positivo`)
   - Validam fluxos felizes e comportamentos esperados
   - Confirmam que operações válidas retornam sucesso

2. **Testes Negativos** (`@negativo`)
   - Validam tratamento de erros e validações da API
   - Campos obrigatórios, tipos inválidos, permissões, dados duplicados

### Níveis de Teste

| Nível | Descrição | O que valida |
|-------|-----------|--------------|
| **Contrato** | Estrutura da resposta | Status code, campos obrigatórios, tipos de dados |
| **Funcional** | Lógica de negócio | Regras de validação, fluxos CRUD completos |
| **Segurança** | Autenticação e Autorização | Tokens, permissões (admin vs comum) |

---

## 📂 Organização das Suites

```
src/tests/
├── login/
│   └── postLogin.spec.ts           # Autenticação de usuários
├── produtos/
│   ├── getProdutos.spec.ts         # Busca de produtos
│   ├── postProdutos.spec.ts        # Cadastro de produtos
│   └── putProdutos.spec.ts         # Atualização de produtos
└── usuarios/
    ├── deleteUsuarios.spec.ts      # Exclusão de usuários
    ├── getUsuarios.spec.ts         # Busca de usuários
    ├── postUsuarios.spec.ts        # Cadastro de usuários
    └── putUsuarios.spec.ts         # Atualização de usuários
```

### Nomenclatura de Arquivos

- Padrão: `{metodoHTTP}{Recurso}.spec.ts`
- Exemplos: `postUsuarios.spec.ts`, `getProdutos.spec.ts`

---

## ✅ Cobertura de Testes

O projeto cobre **testes de API REST** para os seguintes recursos:

### 🔐 Autenticação (Login)
- Autenticação válida e inválida
- Validação de credenciais obrigatórias

### 👤 Usuários
- **CRUD completo**: Create, Read, Update, Delete
- Validações de campos obrigatórios e tipos de dados
- Regras de negócio (email duplicado, formato de email)

### 📦 Produtos
- **CRUD completo**: Create, Read, Update, Delete
- **Autorização**: Validação de token e permissões (admin vs comum)
- Validações de campos obrigatórios e tipos de dados
- Regras de negócio (nome duplicado, valores negativos)

> **💡 Detalhes de cada teste**  
> Consulte os arquivos `.spec.ts` em `src/tests/` - cada teste está autodocumentado com nome descritivo e tags organizacionais.

---

## 🏷️ Padrões e Convenções

### Sistema de Tags

Cada teste utiliza múltiplas tags para filtros flexíveis:

```typescript
test("Cadastrar novo produto com sucesso", {
  tag: ["@001", "@produtos", "@post", "@positivo"],
}, async ({ request }) => {
  // teste aqui
});
```

#### Estrutura de Tags

1. **ID Único**: `@001`, `@002`, `@003...`
   - Identificador sequencial dentro da suite
   
2. **Recurso**: `@usuarios`, `@produtos`, `@login`
   - Agrupa testes por domínio
   
3. **Método HTTP**: `@get`, `@post`, `@put`, `@delete`
   - Agrupa por operação
   
4. **Tipo**: `@positivo`, `@negativo`
   - Agrupa por natureza do cenário

### Nomenclatura de Testes

**Formato**: Ação + Contexto + Resultado Esperado

```typescript
// ✅ Bom
test("Cadastrar novo usuário com sucesso")
test("Não cadastrar produto sem token de autenticação")
test("Atualizar múltiplos campos simultaneamente")

// ❌ Evitar
test("Teste de cadastro")
test("Validação de produto")
test("PUT /usuarios")
```

### Estrutura AAA (Arrange-Act-Assert)

```typescript
test("Atualizar nome de um produto", async ({ request }) => {
  // Arrange - Preparar dados
  const { payload, response: responsePost } = await criarProduto(request, token);
  const { _id } = await responsePost.json();
  const updatedPayload = { ...payload, nome: `${payload.nome}-Atualizado` };
  
  // Act - Executar ação
  const { response } = await atualizarProduto(request, _id, updatedPayload, token);
  
  // Assert - Validar resultado
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toContain("Registro alterado com sucesso");
});
```

---

## ▶️ Como Executar

### Executar Todos os Testes

```bash
npm test
```

### Executar por Recurso

```bash
# Apenas testes de usuários
npx playwright test --grep @usuarios

# Apenas testes de produtos
npx playwright test --grep @produtos

# Apenas testes de login
npx playwright test --grep @login
```

### Executar por Método HTTP

```bash
# Apenas testes POST
npx playwright test --grep @post

# Apenas testes GET
npx playwright test --grep @get

# Apenas testes PUT
npx playwright test --grep @put
```

### Executar por Tipo

```bash
# Apenas cenários positivos
npx playwright test --grep @positivo

# Apenas cenários negativos
npx playwright test --grep @negativo
```

### Executar Suite Específica

```bash
npx playwright test src/tests/produtos/postProdutos.spec.ts
```

### Executar Teste Específico

```bash
# Por ID da tag
npx playwright test --grep "@001"

# Por nome (substring)
npx playwright test --grep "sem token"
```

### Combinar Filtros

```bash
# Testes negativos de produtos
npx playwright test --grep "@produtos.*@negativo"

# Apenas POST de usuários
npx playwright test --grep "@usuarios.*@post"
```

### Modo UI Interativo

```bash
# Abre interface do Playwright para execução interativa
npx playwright test --ui
```

O **modo UI** permite:
- ✅ Executar testes individualmente ou em grupo
- ✅ Ver requisições e respostas em tempo real
- ✅ Filtrar por tags diretamente na interface
- ✅ Re-executar testes falhados rapidamente

### Visualizar Resultados

```bash
# Abrir relatório HTML após execução
npx playwright show-report

# Executar e ver apenas resumo no terminal
npm test
```

> **💡 Nota**: Comandos como `--headed` ou `--debug` não são úteis para testes de API (funcionam apenas para testes web com navegador). Para análise detalhada de APIs, use `--ui` ou o **HTML Report**.

---

## ➕ Como Adicionar Novos Testes

### 1. Identificar a Suite Correta

Determine onde o teste se encaixa:
- `/login` - Autenticação
- `/usuarios` - CRUD de usuários
- `/produtos` - CRUD de produtos

### 2. Seguir Template

```typescript
import { test, expect } from "@playwright/test";
import { autenticarNovoUsuario } from "../../services/autenticacaoService";
import { recursoService } from "../../services/recursoService";

test.describe("METODO - Descrição da Suite", () => {
  let token: string;

  // Setup global (se necessário autenticação)
  test.beforeAll(async ({ request }) => {
    token = await autenticarNovoUsuario(request, true);
  });

  test("Descrição clara do comportamento", {
    tag: ["@XXX", "@recurso", "@metodo", "@tipo"],
  }, async ({ request }) => {
    // Arrange
    const payload = gerarDados();
    
    // Act
    const { response } = await executarAcao(request, payload);
    
    // Assert
    expect(response.status()).toBe(expectedStatus);
    const body = await response.json();
    expect(body.message).toBe("Mensagem esperada");
  });
});
```

### 3. Incrementar ID da Tag

- Verificar último `@XXX` usado na suite
- Usar próximo número sequencial

### 4. Reutilizar Services

**❌ Não faça:**
```typescript
const response = await request.post('/usuarios', {
  data: { nome: "João", email: "joao@test.com" }
});
```

**✅ Faça:**
```typescript
const { response } = await criarUsuario(request, { 
  nome: "João" 
});
```

### 5. Validar Completamente

```typescript
// Não apenas status
expect(response.status()).toBe(201);

// Valide também estrutura
const body = await response.json();
expect(body.message).toBe("Cadastro realizado com sucesso");
expect(body._id).toBeTruthy();

// E persistência (se aplicável)
const getResponse = await buscarRecurso(request, body._id);
expect(getResponse.status()).toBe(200);
```

---

## 💡 Boas Práticas

### ✅ DO (Faça)

1. **Use services para ações**
   ```typescript
   const { response } = await criarUsuario(request);
   ```

2. **Use factories para dados dinâmicos**
   ```typescript
   const payload = generateUserPayload({ administrador: 'true' });
   ```

3. **Nomeie testes claramente em português**
   ```typescript
   test("Não cadastrar produto com nome duplicado")
   ```

4. **Aplique todas as tags relevantes**
   ```typescript
   tag: ["@004", "@produtos", "@post", "@negativo"]
   ```

5. **Valide além do status code**
   ```typescript
   expect(response.status()).toBe(400);
   expect(body.message).toBe("Já existe produto com esse nome");
   ```

6. **Isole testes (não dependam uns dos outros)**
   ```typescript
   // Cada teste cria seus próprios dados
   const { payload } = await criarUsuario(request);
   ```

### ❌ DON'T (Não faça)

1. **Hardcode dados de teste**
   ```typescript
   // ❌ Evite
   email: "teste@test.com"
   
   // ✅ Use
   email: generateUserPayload().email
   ```

2. **Duplique lógica de requisições**
   ```typescript
   // ❌ Evite
   await request.post('/usuarios', { data: {...} });
   
   // ✅ Use
   await criarUsuario(request);
   ```

3. **Valide apenas status code**
   ```typescript
   // ❌ Insuficiente
   expect(response.status()).toBe(201);
   
   // ✅ Complete
   expect(response.status()).toBe(201);
   const body = await response.json();
   expect(body.message).toBeTruthy();
   ```

4. **Crie dependências entre testes**
   ```typescript
   // ❌ Evite
   test("Criar usuário") // Teste A depende deste
   test("Deletar usuário criado anteriormente") // ❌ Falha se A falhar
   ```

5. **Use nomes genéricos**
   ```typescript
   // ❌ Evite
   test("Teste 1")
   test("Validação")
   
   // ✅ Seja específico
   test("Não cadastrar usuário com email duplicado")
   ```

---

## 📊 Relatórios

### Visualizar Relatório HTML

```bash
npx playwright show-report
```

O **HTML Report** é a principal ferramenta de análise para testes de API:

### Estrutura do Relatório

- **HTML Report**: `playwright-report/index.html`
  - ✅ Sumarização de execução (passou/falhou/duração)
  - ✅ Detalhes de cada teste individual
  - ✅ Stack traces completos de erros
  - ✅ Requisições e respostas HTTP (body, headers, status)
  
- **Traces**: `playwright-report/trace/`
  - Timeline completa da execução
  - Network activity (todas as chamadas de API)
  - Console logs e debugging info

> **💡 Dica**: Configure `trace: 'on-first-retry'` no `playwright.config.ts` para capturar traces automaticamente quando testes falharem.

---

## 📚 Recursos Adicionais

- [Playwright Test Documentation](https://playwright.dev/docs/test-intro)
- [API Testing Best Practices](https://playwright.dev/docs/test-api-testing)
- [Configuração do Projeto](playwright.config.ts)
- [README Principal](README.md)

---

## 🤝 Contribuindo

Ao adicionar novos testes:

1. Siga os padrões estabelecidos neste documento
2. Documente cenários especiais no próprio código (comentários JSDoc)
3. Execute toda a suite antes de commitar

```bash
npm test
```

---

**Dúvidas?** Abra uma [issue](https://github.com/seu-usuario/automacao-playwright-api/issues) ou consulte a equipe!
