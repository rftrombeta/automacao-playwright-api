import { faker } from '@faker-js/faker';

/**
 * Gera um ID (aleatório) para uso em testes.
 *
 * Útil para testar comportamentos com IDs que não existem na API
 * (ex: 404, 400 Not Found).
 *
 * @returns string com formato similar a um ID válido, mas garantidamente inexistente
 *
 * @example
 * const id = generateId();
 * const response = await buscarUsuario(request, id);
 * expect(response.status()).toBe(400);
 */
export const generateId = (): string => {
  // Gera uma string aleatória com 16 caracteres alfanuméricos
  // (tamanho similar aos IDs válidos da API)
  return faker.string.alphanumeric(16).toUpperCase();
};
