import { test, expect } from "@playwright/test";
import { criarUsuario, buscarUsuario, atualizarUsuario } from "../../services/usuarioService";
import { generateUserPayload } from "../../factories/userFactory";
import { generateId } from "../../helpers/generators";

test.describe("PUT - Atualização de Usuários", () => {
  
  test("Atualizar nome de um usuário", {
    tag: ["@001", "@usuarios", "@put", "@positivo"],
  }, async ({ request }) => {
      const { payload: payloadPost, response: responsePost } = await criarUsuario(request);
      const { _id } = await responsePost.json();
      
      // Preparar payload completo com nome atualizado
      const updatedPayload = { ...payloadPost, nome: "Nome Atualizado" };
      const { response } = await atualizarUsuario(request, _id, updatedPayload);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.message).toContain("Registro alterado com sucesso");

      // Validar que o nome foi realmente alterado
      const responseGet = await buscarUsuario(request, _id);
      const user = await responseGet.json();
      expect(user.nome).toBe("Nome Atualizado");
    },
  );

  test("Atualizar email de um usuário", {
    tag: ["@002", "@usuarios", "@put", "@positivo"],
  }, async ({ request }) => {
      const { payload: payloadPost, response: responsePost } = await criarUsuario(request);
      const { _id } = await responsePost.json();
      
      // Preparar payload completo com email atualizado
      const newEmail = `${generateId()}_email@example.com`;
      const updatedPayload = { ...payloadPost, email: newEmail };
      const { response } = await atualizarUsuario(request, _id, updatedPayload);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.message).toContain("Registro alterado com sucesso");
      
      // Validar que realmente foi atualizado
      const responseGet = await buscarUsuario(request, _id);
      const user = await responseGet.json();
      expect(user.email).toBe(newEmail);
    },
  );

  test("Atualizar múltiplos campos simultaneamente", {
    tag: ["@003", "@usuarios", "@put", "@positivo"],
  }, async ({ request }) => {
      const { payload: payloadPost, response: responsePost } = await criarUsuario(request);
      const { _id } = await responsePost.json();
      
      // Preparar payload completo com múltiplos campos atualizados
      const newPayload = generateUserPayload();
      const { response } = await atualizarUsuario(request, _id, newPayload);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.message).toContain("Registro alterado com sucesso");
      
      // Validar mudanças
      const responseGet = await buscarUsuario(request, _id);
      const user = await responseGet.json();
      expect(user.administrador).toBe(newPayload.administrador); 
      expect(user.email).toBe(newPayload.email);
      expect(user.nome).toBe(newPayload.nome);
      expect(user.password).toBe(newPayload.password);
    },
  );

  test("Atualizar usuário para um email já utilizado", {
    tag: ["@004", "@usuarios", "@put", "@negativo"],
  }, async ({ request }) => {
      const payloadCompleto = generateUserPayload();
      const response = await buscarUsuario(request);
      const users = await response.json();      
      payloadCompleto.email = users.usuarios[1].email; // Email já existente

      const { response: responsePut } = await atualizarUsuario(request, users.usuarios[1]._id, payloadCompleto);
      expect(responsePut.status()).toBe(200);

      const body = await responsePut.json();
      expect(body.message).toContain("Registro alterado com sucesso");
    },
  );

  test("Atualizar usuário inexistente gerando um cadastro", {
    tag: ["@005", "@usuarios", "@put", "@positivo"],
  }, async ({ request }) => {
      const usuarioId = generateId()
      const payloadCompleto = generateUserPayload();
      const { response } = await atualizarUsuario(request, usuarioId, payloadCompleto);
      
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.message).toContain("Cadastro realizado com sucesso");
      expect(body._id).toBeDefined();
    },
  );
});
