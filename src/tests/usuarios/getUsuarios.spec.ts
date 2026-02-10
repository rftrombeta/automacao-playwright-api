import { test, expect } from "@playwright/test";
import { criarUsuario, buscarUsuario } from "../../services/usuarioService";

test.describe("GET - Consulta de Usuários", () => {
  
  test("Listar todos os usuários cadastrados", {
    tag: ["@001", "@usuarios", "@get"],
  }, async ({ request }) => {
      const response = await buscarUsuario(request);
      expect(response.status()).toBe(200);
      
      const users = await response.json();
      expect(Array.isArray(users.usuarios)).toBe(true);
      
      const userCount = users.usuarios.length;
      expect(users.quantidade).toBe(userCount);
      
      // Validar schema de cada usuário retornado
      users.usuarios.forEach((user: any) => {
        expect(user).toHaveProperty('nome');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('password');
        expect(user).toHaveProperty('administrador');
        expect(user).toHaveProperty('_id');
        
        // Validar tipos dos campos
        expect(typeof user.nome).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.password).toBe('string');
        expect(user.administrador).toMatch(/^(true|false)$/);
        expect(typeof user._id).toBe('string');
      });
    },
  );

  test("Consultar um usuário cadastrado", {
    tag: ["@002", "@usuarios", "@get"],
  }, async ({ request }) => {
      const { payload: payload_usuario, response: response_post } = await criarUsuario(request);
      const response_post_json = await response_post.json();
      const usuario_id_post = response_post_json._id;
      const response = await buscarUsuario(request, usuario_id_post);
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body.nome).toBe(payload_usuario.nome);
      expect(body.email).toBe(payload_usuario.email);
      expect(body.administrador).toBe(payload_usuario.administrador);
    },
  );

  test("Consultar um usuário não cadastrado", {
    tag: ["@003", "@usuarios", "@get"],
  }, async ({ request }) => {      
      const usuario_id = '0uxuRF0cbmQhpEz1'
      const response = await buscarUsuario(request, usuario_id);
      expect(response.status()).toBe(400);
      
      const body_json = await response.json();
      expect(body_json.message).toBe("Usuário não encontrado");
    },
  );
});
