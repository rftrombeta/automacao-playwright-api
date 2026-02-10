import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Faz uma requisição GET usando o fixture `request` do Playwright.
 * Centralize aqui lógica comum como headers, logs, tratamento de erros e baseURL.
 *
 * @param request - fixture `APIRequestContext` injetado pelo Playwright
 * @param url - caminho absoluto ou relativo (quando `baseURL` estiver configurado)
 * @param options - opções extras passadas para `request.get` (use um objeto compatível com Playwright)
 * @returns `APIResponse` retornada pelo Playwright
 */
export const apiGet = async (
  request: APIRequestContext,
  url: string,
  options?: Record<string, any>
): Promise<APIResponse> => {
  return await request.get(url, options);
};

/**
 * Faz uma requisição POST usando o fixture `request` do Playwright.
 * Centralize aqui serialização, headers (ex: content-type), autenticação e retries.
 *
 * @param request - fixture `APIRequestContext` injetado pelo Playwright
 * @param url - caminho absoluto ou relativo (quando `baseURL` estiver configurado)
 * @param data - payload que será enviado no corpo da requisição
 * @param options - opções extras passadas para `request.post` (use um objeto compatível com Playwright)
 * @returns `APIResponse` retornada pelo Playwright
 */
export const apiPost = async (
  request: APIRequestContext,
  url: string,
  data: any,
  options?: Record<string, any>
): Promise<APIResponse> => {
  const postOptions = { ...options, data };
  return await request.post(url, postOptions as any);
};

/**
 * Faz uma requisição PUT usando o fixture `request` do Playwright.
 * Centralize aqui serialização, headers (ex: content-type), autenticação e retries.
 *
 * @param request - fixture `APIRequestContext` injetado pelo Playwright
 * @param url - caminho absoluto ou relativo (quando `baseURL` estiver configurado)
 * @param data - payload que será enviado no corpo da requisição
 * @param options - opções extras passadas para `request.put` (use um objeto compatível com Playwright)
 * @returns `APIResponse` retornada pelo Playwright
 */
export const apiPut = async (
  request: APIRequestContext,
  url: string,
  data: any,
  options?: Record<string, any>
): Promise<APIResponse> => {
  const putOptions = { ...options, data };
  return await request.put(url, putOptions as any);
};

/**
 * Faz uma requisição DELETE usando o fixture `request` do Playwright.
 * Centralize aqui headers, autenticação e retries.
 *
 * @param request - fixture `APIRequestContext` injetado pelo Playwright
 * @param url - caminho absoluto ou relativo (quando `baseURL` estiver configurado)
 * @param options - opções extras passadas para `request.delete` (use um objeto compatível com Playwright)
 * @returns `APIResponse` retornada pelo Playwright
 */
export const apiDelete = async (
  request: APIRequestContext,
  url: string,
  options?: Record<string, any>
): Promise<APIResponse> => {
  return await request.delete(url, options);
};

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
};
