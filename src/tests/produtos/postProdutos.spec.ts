import { test, expect } from "@playwright/test";
import { apiPost } from "../../api/client";
import { generateProductPayload } from "../../factories/productFactory";
import { criarProduto } from "../../services/produtoService";
import { buscarUsuario, criarUsuario } from "../../services/usuarioService";
import { autenticarNovoUsuario, autenticarUsuarioExistente } from "../../services/autenticacaoService";

test.describe("POST - Cadastro de Produtos", () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await autenticarNovoUsuario(request, true);
  });
  
  test("Cadastrar novo produto com sucesso", {
    tag: ["@001", "@produtos", "@post", "@positivo"],
  }, async ({ request }) => {
      const { response } = await criarProduto(request, token);
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.message).toBe("Cadastro realizado com sucesso");
      expect(body._id).toBeTruthy();
    },
  );

  test("Não cadastrar produto sem o token de autenticação", {
    tag: ["@002", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const { payload: payloadProduto } = await criarProduto(request, token);
      const { response } = await criarProduto(request, "", { nome: payloadProduto.nome });
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
    },
  );

  test("Não cadastrar produto com usuario comum", {
    tag: ["@003", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const { response: responseUser } = await criarUsuario(request, { administrador: "false" });
      const responseJson = await responseUser.json();
      const userId = responseJson._id;

      const user = await buscarUsuario(request, userId);
      const userJson = await user.json();

      const responseAuth = await autenticarUsuarioExistente(request, userJson.email, userJson.password);
      const authJson = await responseAuth.json();
      const tokenUser = authJson.authorization;
    
      const { response } = await criarProduto(request, tokenUser);
      expect(response.status()).toBe(403);
      const body = await response.json();
      expect(body.message).toBe("Rota exclusiva para administradores");
    },
  );

  test("Não cadastrar produto com o mesmo nome", {
    tag: ["@004", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const { payload: payloadProduto } = await criarProduto(request, token);
      const { response } = await criarProduto(request, token, { nome: payloadProduto.nome });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toBe("Já existe produto com esse nome");
      
    },
  );

  test("Não cadastrar produto sem nome", {
    tag: ["@005", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateProductPayload();
      delete (payload as any).nome;
      const response = await apiPost(request, "/produtos", payload, {
        headers: { Authorization: token },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.nome).toBe("nome é obrigatório");
    },
  );

  test("Não cadastrar produto sem preco", {
    tag: ["@006", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateProductPayload();
      delete (payload as any).preco;
      const response = await apiPost(request, "/produtos", payload, {
        headers: { Authorization: token },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.preco).toBe("preco é obrigatório");
    },
  );

  test("Não cadastrar produto sem descricao", {
    tag: ["@007", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateProductPayload();
      delete (payload as any).descricao;
      const response = await apiPost(request, "/produtos", payload, {
        headers: { Authorization: token },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.descricao).toBe("descricao é obrigatório");
    },
  );

  test("Não cadastrar produto sem quantidade", {
    tag: ["@008", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateProductPayload();
      delete (payload as any).quantidade;
      const response = await apiPost(request, "/produtos", payload, {
        headers: { Authorization: token },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.quantidade).toBe("quantidade é obrigatório");
    },
  );

  test("Não cadastrar produto com preco invalido", {
    tag: ["@009", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateProductPayload({ preco: "invalido" as any });
      const response = await apiPost(request, "/produtos", payload, {
        headers: { Authorization: token },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.preco).toBe("preco deve ser um número");
    },
  );

  test("Não cadastrar produto com quantidade invalida", {
    tag: ["@010", "@produtos", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateProductPayload({ quantidade: -1 });
      const response = await apiPost(request, "/produtos", payload, {
        headers: { Authorization: token },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.quantidade).toBe("quantidade deve ser maior ou igual a 0");
    },
  );
});
