import { test, expect } from "@playwright/test";
import { criarUsuario, buscarUsuario } from "../../services/usuarioService";
import { buscarProduto, criarProduto } from "../../services/produtoService";
import { autenticarUsuarioExistente } from "../../services/autenticacaoService";

test.describe("GET - Consulta de Produtos", () => {
  
  test("Listar todos os produtos cadastrados", {
    tag: ["@001", "@produtos", "@get"],
  }, async ({ request }) => {
      const response = await buscarProduto(request);
      expect(response.status()).toBe(200);
      
      const produtos = await response.json();
      expect(Array.isArray(produtos.produtos)).toBe(true);
      
      const produtoCount = produtos.produtos.length;
      expect(produtos.quantidade).toBe(produtoCount);
      
      // Validar schema de cada produto retornado
      produtos.produtos.forEach((produto: any) => {
        expect(produto).toHaveProperty('nome');
        expect(produto).toHaveProperty('descricao');
        expect(produto).toHaveProperty('preco');
        expect(produto).toHaveProperty('quantidade');
        expect(produto).toHaveProperty('_id');
        
        // Validar tipos dos campos
        expect(typeof produto.nome).toBe('string');
        expect(typeof produto.descricao).toBe('string');
        expect(typeof produto.preco).toBe('number');
        expect(typeof produto.quantidade).toBe('number');
        expect(typeof produto._id).toBe('string');
      });
    },
  );

  test("Consultar um produto cadastrado", {
    tag: ["@002", "@produtos", "@get"],
  }, async ({ request }) => {
    const { response: responseUsuario } = await criarUsuario(request, { administrador: "true" });
    const responseJson = await responseUsuario.json();
    const userId = responseJson._id;
    
    const user = await buscarUsuario(request, userId);
    const userJson = await user.json();
    
    const responseAuth = await autenticarUsuarioExistente(request, userJson.email, userJson.password);
    const authJson = await responseAuth.json();

    const { payload: payloadPostProduto, response: responsePostProduto } = await criarProduto(request, authJson.authorization);
    const responsePostProdutoJson = await responsePostProduto.json();
    const produto_id_post = responsePostProdutoJson._id;
    const responseGetProduto = await buscarProduto(request, produto_id_post);
      
    const responseGetProdutoJson = await responseGetProduto.json();
    expect(responseGetProdutoJson.descricao).toBe(payloadPostProduto.descricao);
    expect(responseGetProdutoJson.nome).toBe(payloadPostProduto.nome);
    expect(responseGetProdutoJson.preco).toBe(payloadPostProduto.preco);
    expect(responseGetProdutoJson.quantidade).toBe(payloadPostProduto.quantidade);
    },
  );

  test("Consultar um produto não cadastrado", {
    tag: ["@003", "@produtos", "@get"],
  }, async ({ request }) => {      
      const produtoId = '0uxuRF0cbmQhpEz1'
      const response = await buscarProduto(request, produtoId);
      expect(response.status()).toBe(400);
      
      const body_json = await response.json();
      expect(body_json.message).toBe("Produto não encontrado");
    },
  );
});
