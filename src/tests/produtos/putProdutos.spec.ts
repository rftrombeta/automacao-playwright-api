import { test, expect } from "@playwright/test";
import { apiPut } from "../../api/client";
import { generateProductPayload } from "../../factories/productFactory";
import { autenticarNovoUsuario, autenticarUsuarioExistente } from "../../services/autenticacaoService";
import { atualizarProduto, buscarProduto, criarProduto } from "../../services/produtoService";
import { buscarUsuario, criarUsuario } from "../../services/usuarioService";

test.describe("PUT - Atualização de Produtos", () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
      token = await autenticarNovoUsuario(request, true);
    });

  test("Atualizar nome de um produto", {
    tag: ["@001", "@produtos", "@put", "@positivo"],
  }, async ({ request }) => {
      const { payload: payloadPost, response: responsePost } = await criarProduto(request, token);
      const { _id } = await responsePost.json();
      
      // Preparar payload completo com nome atualizado
      const updatedPayload = { ...payloadPost, nome: `${payloadPost.nome}-Atualizado`};
      const { response } = await atualizarProduto(request, _id, updatedPayload, token);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.message).toContain("Registro alterado com sucesso");

      // Validar que o nome foi realmente alterado
      const responseGet = await buscarProduto(request, _id);
      const user = await responseGet.json();
      expect(user.nome).toBe(`${payloadPost.nome}-Atualizado`);
    },
  );

  test("Atualizar múltiplos campos simultaneamente", {
      tag: ["@002", "@produtos", "@put", "@positivo"],
    }, async ({ request }) => {
        const { response: responsePost } = await criarProduto(request, token);
        const { _id } = await responsePost.json();
        
        // Preparar payload completo com múltiplos campos atualizados
        const newPayload = generateProductPayload()
        const { response } = await atualizarProduto(request, _id, newPayload, token);
        expect(response.status()).toBe(200);
  
        const body = await response.json();
        expect(body.message).toContain("Registro alterado com sucesso");
        
        // Validar mudanças
        const responseGet = await buscarProduto(request, _id);
        const produto = await responseGet.json();
        expect(produto.descricao).toBe(newPayload.descricao); 
        expect(produto.nome).toBe(newPayload.nome);
        expect(produto.preco).toBe(newPayload.preco);
        expect(produto.quantidade).toBe(newPayload.quantidade);
      },
    );

    test("Não atualizar produto com nome duplicado", {
      tag: ["@003", "@produtos", "@put", "@negativo"],
    }, async ({ request }) => {
        const { response: responsePost } = await criarProduto(request, token);
        const { _id } = await responsePost.json();
        
        // Preparar payload completo com múltiplos campos atualizados
        const newPayload = generateProductPayload()
        newPayload.nome = "Logitech MX Vertical";
        const { response } = await atualizarProduto(request, _id, newPayload, token);
        expect(response.status()).toBe(400);
  
        const body = await response.json();
        expect(body.message).toContain("Já existe produto com esse nome");
      },
    );

    test("Não atualizar produto sem token de autenticação", {
      tag: ["@004", "@produtos", "@put", "@negativo"],
    }, async ({ request }) => {
        const { response: responsePost } = await criarProduto(request, token);
        const { _id } = await responsePost.json();

        const payload = generateProductPayload();
        const response = await apiPut(request, `/produtos/${_id}`, payload, {
          headers: { Authorization: "" },
        });
        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      },
    );

    test("Não atualizar produto com usuario comum", {
      tag: ["@005", "@produtos", "@put", "@negativo"],
    }, async ({ request }) => {
        const { response: responsePost } = await criarProduto(request, token);
        const { _id } = await responsePost.json();

        const { response: responseUser } = await criarUsuario(request, { administrador: "false" });
        const responseJson = await responseUser.json();
        const userId = responseJson._id;

        const user = await buscarUsuario(request, userId);
        const userJson = await user.json();

        const responseAuth = await autenticarUsuarioExistente(request, userJson.email, userJson.password);
        const authJson = await responseAuth.json();
        const tokenUser = authJson.authorization;

        const payload = generateProductPayload();
        const response = await apiPut(request, `/produtos/${_id}`, payload, {
          headers: { Authorization: tokenUser },
        });
        expect(response.status()).toBe(403);

        const body = await response.json();
        expect(body.message).toBe("Rota exclusiva para administradores");
      },
    );

    test("Não atualizar produto sem nome", {
      tag: ["@006", "@produtos", "@put", "@negativo"],
    }, async ({ request }) => {
        const { response: responsePost } = await criarProduto(request, token);
        const { _id } = await responsePost.json();

        const payload = generateProductPayload();
        delete (payload as any).nome;
        const response = await apiPut(request, `/produtos/${_id}`, payload, {
          headers: { Authorization: token },
        });
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.nome).toBe("nome é obrigatório");
      },
    );

    test("Não atualizar produto sem preco", {
      tag: ["@007", "@produtos", "@put", "@negativo"],
    }, async ({ request }) => {
        const { response: responsePost } = await criarProduto(request, token);
        const { _id } = await responsePost.json();

        const payload = generateProductPayload();
        delete (payload as any).preco;
        const response = await apiPut(request, `/produtos/${_id}`, payload, {
          headers: { Authorization: token },
        });
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.preco).toBe("preco é obrigatório");
      },
    );

    test("Não atualizar produto com preco invalido", {
      tag: ["@008", "@produtos", "@put", "@negativo"],
    }, async ({ request }) => {
        const { response: responsePost } = await criarProduto(request, token);
        const { _id } = await responsePost.json();

        const payload = generateProductPayload({ preco: "invalido" as any });
        const response = await apiPut(request, `/produtos/${_id}`, payload, {
          headers: { Authorization: token },
        });
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.preco).toBe("preco deve ser um número");
      },
    );

    test("Não atualizar produto com quantidade invalida", {
      tag: ["@009", "@produtos", "@put", "@negativo"],
    }, async ({ request }) => {
        const { response: responsePost } = await criarProduto(request, token);
        const { _id } = await responsePost.json();

        const payload = generateProductPayload({ quantidade: -1 });
        const response = await apiPut(request, `/produtos/${_id}`, payload, {
          headers: { Authorization: token },
        });
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.quantidade).toBe("quantidade deve ser maior ou igual a 0");
      },
    );

    test("Não atualizar produto com id inexistente", {
      tag: ["@010", "@produtos", "@put", "@negativo"],
    }, async ({ request }) => {
        const payload = generateProductPayload();
        const { response } = await atualizarProduto(request, "id-inexistente", payload, token);
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.id).toContain("id deve ter exatamente 16 caracteres alfanuméricos");
      },
    );
});
