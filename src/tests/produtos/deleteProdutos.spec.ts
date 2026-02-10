import { test, expect } from "@playwright/test";
import { criarUsuario } from "../../services/usuarioService";
import { criarProduto, deletarProduto } from "../../services/produtoService";
import { autenticarNovoUsuario } from "../../services/autenticacaoService";

test.describe("DELETE - Exclusão de Produtos", () => {
  
  test("Excluir produto existente com sucesso", {
    tag: ["@001", "@produtos", "@delete"],
  }, async ({ request }) => {
    const token = await autenticarNovoUsuario(request, true);  
    const { response } = await criarProduto(request, token);
    expect(response.status()).toBe(201);
    const body = await response.json();
    const produtoId = body._id;

      const deleteResponse = await deletarProduto(request, produtoId, token);
      expect(deleteResponse.status()).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody.message).toContain("Registro excluído com sucesso");
    },
  );
});
