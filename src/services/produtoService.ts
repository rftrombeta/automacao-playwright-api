import { APIRequestContext, APIResponse } from '@playwright/test';
import { ProdutoPayload } from '../types/produto';
import { apiPost, apiGet, apiPut, apiDelete } from '../api/client';
import { generateProductPayload } from '../factories/productFactory';

/**
 * Cadastra um novo produto via API POST /produtos.
 *
 * Reutiliza o factory `generateProductPayload` para gerar payloads realistas
 * e centraliza a logica de criacao, permitindo facil reuso em diferentes testes.
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param authToken - token de autenticacao para enviar no header `Authorization` (obrigatorio)
 * @param overrides - campos do payload que devem sobrescrever os gerados
 *
 * @returns Promise com objeto contendo:
 *   - `payload`: `ProdutoPayload` — dados enviados na requisicao
 *   - `response`: `APIResponse` — resposta bruta do Playwright
 *     - `response.status()`: numero (ex: 201 para sucesso, 400 para erro)
 *     - `response.json()`: Promise<{message, _id}> — corpo da resposta parseado
 *
 * @example
 * const { payload, response } = await criarProduto(request, token, undefined);
 * expect(response.status()).toBe(201);
 */
export const criarProduto = async (
  request: APIRequestContext,
  authToken: string,
  overrides?: Partial<ProdutoPayload>,
): Promise<{ payload: ProdutoPayload; response: APIResponse }> => {
  const payload = generateProductPayload(overrides);
  const options = { headers: { Authorization: authToken } };
  const response = await apiPost(request, '/produtos', payload, options);
  return { payload, response };
};

/**
 * Busca produtos via API GET /produtos ou GET /produtos/{produtoId}.
 *
 * Comportamento flexivel:
 * - Sem `produtoId`: faz GET /produtos (retorna lista de todos)
 * - Com `produtoId`: faz GET /produtos/{produtoId} (retorna produto especifico)
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param produtoId - (opcional) ID unico do produto. Se omitido, lista todos os produtos.
 *
 * @returns Promise com `APIResponse` do Playwright:
 *   - `response.status()`: 200 em sucesso, 400 se produto nao encontrado (com produtoId)
 *   - Com produtoId:
 *     - `response.json()`: Promise<{nome, preco, descricao, quantidade, _id}>
 *   - Sem produtoId:
 *     - `response.json()`: Promise<ProdutoPayload[]> — array com todos os produtos
 */
export const buscarProduto = async (
  request: APIRequestContext,
  produtoId?: string
): Promise<APIResponse> => {
  const endpoint = produtoId ? `/produtos/${produtoId}` : '/produtos';
  return await apiGet(request, endpoint);
};

/**
 * Atualiza um produto existente via API PUT /produtos/{produtoId}.
 *
 * O API PUT espera o **payload completo** do produto. Todos os campos
 * devem ser fornecidos, mesmo que apenas alguns sejam alterados.
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param produtoId - ID unico do produto a ser atualizado
 * @param produtoData - payload **completo** com todos os campos (ProdutoPayload)
 *
 * @returns Promise com objeto contendo:
 *   - `payload`: `ProdutoPayload` — dados enviados na requisicao
 *   - `response`: `APIResponse` — resposta bruta do Playwright
 *     - `response.status()`: 200 em sucesso, 400 se nao encontrado
 *     - `response.json()`: Promise<{message, _id, ...resto do produto}>
 */
export const atualizarProduto = async (
  request: APIRequestContext,
  produtoId: string,
  produtoData: ProdutoPayload,
  authToken: string
): Promise<{ payload: ProdutoPayload; response: APIResponse }> => {
  const options = { headers: { Authorization: authToken } };
  const response = await apiPut(request, `/produtos/${produtoId}`, produtoData, options);
  return { payload: produtoData, response };
};
/**
 * Deleta um produto existente via API DELETE /produtos/{produtoId}.
 *
 * @param request - fixture `APIRequestContext` do Playwright
 * @param produtoId - ID unico do produto a ser deletado
 * @param authToken - token de autenticacao para enviar no header `Authorization` (obrigatorio)
 *
 * @returns Promise com `APIResponse` do Playwright:
 *   - `response.status()`: 200 em sucesso, 400 se produto nao encontrado, 401 sem token, 403 se usuario nao admin
 *   - `response.json()`: Promise<{message, _id}>
 *
 * @example
 * const { response } = await deletarProduto(request, '123abc', token);
 * expect(response.status()).toBe(200);
 * const { message } = await response.json();
 * expect(message).toContain("Produto deletado com sucesso");
 */
export const deletarProduto = async (
  request: APIRequestContext,
  produtoId: string,
  authToken: string
): Promise<APIResponse> => {
  const options = { headers: { Authorization: authToken } };
  return await apiDelete(request, `/produtos/${produtoId}`, options);
};