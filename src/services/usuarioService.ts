import { APIRequestContext, APIResponse } from '@playwright/test';
import { UsuarioPayload } from '../types/usuario';
import { generateUserPayload } from '../factories/userFactory';
import { apiPost, apiGet, apiPut, apiDelete } from '../api/client';

/**
 * Cadastra um novo usuario via API POST /usuarios.
 *
 * Reutiliza o factory `generateUserPayload` para gerar payloads realistas
 * e centraliza a logica de criacao, permitindo facil reuso em diferentes testes.
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param overrides - campos do payload que devem sobrescrever os gerados
 *
 * @returns Promise com objeto contendo:
 *   - `payload`: `UserPayload` — dados enviados na requisicao
 *   - `response`: `APIResponse` — resposta bruta do Playwright
 *     - `response.status()`: numero (ex: 201 para sucesso, 400 para erro)
 *     - `response.json()`: Promise<{message, _id}> — corpo da resposta parseado
 *
 * @example
 * // Criar usuario comum
 * const { payload, response } = await criarUsuario(request, { administrador: 'false' });
 * expect(response.status()).toBe(201);
 * const { _id, message } = await response.json();
 *
 * // Criar usuario admin com overrides
 * const { response: adminResp } = await criarUsuario(request, { administrador: 'true' });
 */
export const criarUsuario = async (
  request: APIRequestContext,
  overrides?: Partial<UsuarioPayload>
): Promise<{ payload: UsuarioPayload; response: APIResponse }> => {
  const payload = generateUserPayload(overrides);
  const response = await apiPost(request, '/usuarios', payload);
  return { payload, response };
};

/**
 * Busca usuarios via API GET /usuarios ou GET /usuarios/{userId}.
 *
 * Comportamento flexivel:
 * - Sem `userId`: faz GET /usuarios (retorna lista de todos)
 * - Com `userId`: faz GET /usuarios/{userId} (retorna usuario especifico)
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param userId - (opcional) ID unico do usuario. Se omitido, lista todos os usuarios.
 *
 * @returns Promise com `APIResponse` do Playwright:
 *   - `response.status()`: 200 em sucesso, 400 se usuario nao encontrado (com userId)
 *   - Com userId:
 *     - `response.json()`: Promise<{nome, email, administrador, _id}>
 *   - Sem userId:
 *     - `response.json()`: Promise<UserPayload[]> — array com todos os usuarios
 *
 * @example
 * // Buscar usuario especifico
 * const response = await buscarUsuario(request, '123abc');
 * expect(response.status()).toBe(200);
 * const user = await response.json();
 * expect(user.nome).toBeTruthy();
 *
 * // Listar todos os usuarios
 * const response = await buscarUsuario(request);
 * expect(response.status()).toBe(200);
 * const users = await response.json();
 * expect(Array.isArray(users)).toBe(true);
 *
 * // Buscar usuario inexistente
 * const response = await buscarUsuario(request, 'invalid-id');
 * expect(response.status()).toBe(400);
 * const { message } = await response.json();
 * expect(message).toContain('nao encontrado');
 */
export const buscarUsuario = async (
  request: APIRequestContext,
  userId?: string
): Promise<APIResponse> => {
  const endpoint = userId ? `/usuarios/${userId}` : '/usuarios';
  return await apiGet(request, endpoint);
};

/**
 * Atualiza um usuario existente via API PUT /usuarios/{userId}.
 *
 * O API PUT espera o **payload completo** do usuario. Todos os campos
 * devem ser fornecidos, mesmo que apenas alguns sejam alterados.
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param userId - ID unico do usuario a ser atualizado
 * @param userData - payload **completo** com todos os campos (UserPayload)
 *
 * @returns Promise com objeto contendo:
 *   - `payload`: `UserPayload` — dados enviados na requisicao
 *   - `response`: `APIResponse` — resposta bruta do Playwright
 *     - `response.status()`: 200 em sucesso, 400 se nao encontrado
 *     - `response.json()`: Promise<{message, _id, ...resto do usuario}>
 *
 * @example
 * // Buscar usuario, modificar e enviar completo
 * const { response: getResp } = await buscarUsuario(request, '123abc');
 * const user = await getResp.json();
 *
 * // Enviar payload completo com nome atualizado
 * const { response } = await atualizarUsuario(request, '123abc', {
 *   nome: 'Nome Novo',
 *   email: user.email,
 *   password: user.password,
 *   administrador: user.administrador
 * });
 * expect(response.status()).toBe(200);
 *
 * // Ou usar factory com overrides
 * const newPayload = generateUserPayload({ administrador: 'true' });
 * const { response } = await atualizarUsuario(request, '123abc', newPayload);
 */
export const atualizarUsuario = async (
  request: APIRequestContext,
  userId: string,
  userData: UsuarioPayload
): Promise<{ payload: UsuarioPayload; response: APIResponse }> => {
  const response = await apiPut(request, `/usuarios/${userId}`, userData);
  return { payload: userData, response };
};
/**
 * Deleta um usuario existente via API DELETE /usuarios/{userId}.
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param userId - ID unico do usuario a ser deletado
 *
 * @returns Promise com `APIResponse` do Playwright:
 *   - `response.status()`: 200 em sucesso, 400 se usuario nao encontrado
 *   - `response.json()`: Promise<{message, _id}>
 *
 * @example
 * const { response } = await deletarUsuario(request, '123abc');
 * expect(response.status()).toBe(200);
 * const { message } = await response.json();
 * expect(message).toContain("Usuario deletado com sucesso");
 */
export const deletarUsuario = async (
  request: APIRequestContext,
  userId: string
): Promise<APIResponse> => {
  return await apiDelete(request, `/usuarios/${userId}`);
};