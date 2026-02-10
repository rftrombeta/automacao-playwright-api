import { faker } from '@faker-js/faker';
import { ProdutoPayload } from '../types/produto';

/**
 * Gera um payload de produto valido para uso em testes.
 *
 * Usa `@faker-js/faker` para criar valores realistas e permite sobrescrever
 * campos especificos atraves do objeto `overrides`.
 *
 * @param overrides - campos que devem sobrescrever os valores gerados
 * @returns `ProdutoPayload` pronto para envio a API
 */
export const generateProductPayload = (
  overrides?: Partial<ProdutoPayload>
): ProdutoPayload => {
  const payload: ProdutoPayload = {
    nome: faker.commerce.productName(),
    preco: Number(faker.commerce.price({ min: 10, max: 2000 })),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 1000 }),
  };

  return { ...payload, ...overrides };
};
