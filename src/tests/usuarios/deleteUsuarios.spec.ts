import { test, expect } from "@playwright/test";
import { criarUsuario, deletarUsuario } from "../../services/usuarioService";

test.describe("DELETE - Exclusão de Usuários", () => {
  
  test("Excluir usuário existente com sucesso", {
    tag: ["@001", "@usuarios", "@delete"],
  }, async ({ request }) => {
      const { response } = await criarUsuario(request, { administrador: "false" });
      expect(response.status()).toBe(201);
      const body = await response.json();
      const userId = body._id;

      const deleteResponse = await deletarUsuario(request, userId);
      expect(deleteResponse.status()).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody.message).toContain("Registro excluído com sucesso");
    },
  );
});
