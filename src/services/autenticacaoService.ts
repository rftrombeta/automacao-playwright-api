import { APIRequestContext, APIResponse } from '@playwright/test';
import { apiPost } from '../api/client';
import { criarUsuario } from './usuarioService';

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Autentica um usuario existente via API POST /login.
 *
 * Envia `email` e `password` no body para obter o token/autorizacao.
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param email - e-mail do usuario cadastrado
 * @param password - senha do usuario
 *
 * @returns Promise com `APIResponse` do Playwright:
 *   - `response.status()`: numero (ex: 200 para sucesso, 401 para credenciais invalidas)
 *   - `response.json()`: Promise<{authorization, message}> — corpo da resposta parseado
 *
 * @example
 * const response = await autenticarUsuarioExistente(request, 'fulano@qa.com', 'teste');
 * expect(response.status()).toBe(200);
 * const { authorization } = await response.json();
 */
export const autenticarUsuarioExistente = async (
  request: APIRequestContext,
  email: string,
  password: string
): Promise<APIResponse> => {
  const payload: LoginPayload = { email, password };
  return await apiPost(request, '/login', payload);
};

/**
 * Cria um novo usuario e autentica em seguida, retornando o token.
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param administrador - define se o usuario sera admin (true/false)
 *
 * @returns Promise<string> token de autorizacao (authorization)
 *
 * @example
 * const token = await autenticarNovoUsuario(request, true);
 * expect(token).toBeTruthy();
 */
export const autenticarNovoUsuario = async (
  request: APIRequestContext,
  administrador: boolean
): Promise<string> => {
  const { payload } = await criarUsuario(request, {
    administrador: administrador ? 'true' : 'false'
  });

  const loginResponse = await autenticarUsuarioExistente(
    request,
    payload.email,
    payload.password
  );

  const { authorization } = await loginResponse.json();
  return authorization;
};