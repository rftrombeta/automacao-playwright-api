import { test, expect } from "@playwright/test";
import { criarUsuario } from "../../services/usuarioService";
import { autenticarUsuarioExistente } from "../../services/autenticacaoService";

test.describe("POST - Login de Usuários", () => {
  
  test("Login de usuário com sucesso", {
    tag: ["@001", "@login", "@post"],
  }, async ({ request }) => {
      const { payload: payloadUser, response } = await criarUsuario(request, { administrador: "false" });
      expect(response.status()).toBe(201);
      
      const loginResponse = await autenticarUsuarioExistente(request, payloadUser.email, payloadUser.password);
      expect(loginResponse.status()).toBe(200);
      const loginResponseJson = await loginResponse.json();
      expect(loginResponseJson.message).toBe("Login realizado com sucesso");
      expect(loginResponseJson.authorization).toBeTruthy();
    },
  );

  test("Login de usuário com email inválido", {
    tag: ["@002", "@login", "@post"],
  }, async ({ request }) => {
      const { payload: payloadUser, response } = await criarUsuario(request, { administrador: "false" });
      expect(response.status()).toBe(201);
      
      const loginResponse = await autenticarUsuarioExistente(request, "invalid_email@example.com", payloadUser.password);
      expect(loginResponse.status()).toBe(401);
      const loginResponseJson = await loginResponse.json();
      expect(loginResponseJson.message).toBe("Email e/ou senha inválidos");
    },
  );

  test("Login de usuário com senha inválida", {
    tag: ["@003", "@login", "@post"],
  }, async ({ request }) => {
      const { payload: payloadUser, response } = await criarUsuario(request, { administrador: "false" });
      expect(response.status()).toBe(201);
      
      const loginResponse = await autenticarUsuarioExistente(request, payloadUser.email, "invalid_password");
      expect(loginResponse.status()).toBe(401);
      const loginResponseJson = await loginResponse.json();
      expect(loginResponseJson.message).toBe("Email e/ou senha inválidos");
    },
  );
});
