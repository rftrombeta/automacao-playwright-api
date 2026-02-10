import { test, expect } from "@playwright/test";
import { apiPost } from "../../api/client";
import { generateUserPayload } from "../../factories/userFactory";
import { criarUsuario } from "../../services/usuarioService";

test.describe("POST - Cadastro de Usuários", () => {
  
  test("Cadastrar novo usuário comum com sucesso", {
    tag: ["@001", "@usuarios", "@post", "@positivo"],
  }, async ({ request }) => {
      const { response } = await criarUsuario(request, { administrador: "false" });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.message).toBe("Cadastro realizado com sucesso");
      expect(body._id).toBeTruthy();
    },
  );

  test("Cadastrar novo usuário administrador com sucesso", {
    tag: ["@002", "@usuarios", "@post", "@positivo"],
  }, async ({ request }) => {
      const { response } = await criarUsuario(request, { administrador: "true" });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.message).toBe("Cadastro realizado com sucesso");
      expect(body._id).toBeTruthy();
    },
  );

  test("Não cadastrar usuário com email já cadastrado", {
    tag: ["@003", "@usuarios", "@post", "@negativo"],
  }, async ({ request }) => {
      const { payload } = await criarUsuario(request, { administrador: "true" });

      const { response: responseDuplicate } = await criarUsuario(request, { 
        email: payload.email 
      });
      expect(responseDuplicate.status()).toBe(400);
      const body = await responseDuplicate.json();
      expect(body.message).toBe("Este email já está sendo usado");
    },
  );

  test("Não cadastrar usuário sem nome", {
    tag: ["@004", "@usuarios", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateUserPayload();
      delete (payload as any).nome;
      const response = await apiPost(request, "/usuarios", payload);
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.nome).toBe("nome é obrigatório");
    },
  );

  test("Não cadastrar usuário sem email", {
    tag: ["@005", "@usuarios", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateUserPayload();
      delete (payload as any).email;
      const response = await apiPost(request, "/usuarios", payload);
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.email).toBe("email é obrigatório");
    },
  );

  test("Não cadastrar usuário sem senha", {
    tag: ["@006", "@usuarios", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateUserPayload();
      delete (payload as any).password;
      const response = await apiPost(request, "/usuarios", payload);
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.password).toBe("password é obrigatório");
    },
  );

  test("Não cadastrar usuário com email invalido", {
    tag: ["@007", "@usuarios", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateUserPayload({ email: "email-invalido" });
      const response = await apiPost(request, "/usuarios", payload);
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.email).toBe("email deve ser um email válido")
    },
  );

  test("Não cadastrar usuário com administrador invalido", {
    tag: ["@008", "@usuarios", "@post", "@negativo"],
  }, async ({ request }) => {
      const payload = generateUserPayload({ administrador: "talvez" as any });
      const response = await apiPost(request, "/usuarios", payload);
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.administrador).toBe("administrador deve ser 'true' ou 'false'");
    },
  );
});
