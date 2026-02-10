import { faker } from '@faker-js/faker';
import { UsuarioPayload } from '../types/usuario';

/**
 * Gera um payload de usuário válido para uso em testes.
 *
 * O factory usa `@faker-js/faker` para criar valores realistas e aceita
 * um objeto `overrides` para sobrescrever campos específicos quando
 * necessário (ex.: para testar validações ou casos de borda).
 *
 * Exemplo de uso:
 * ```ts
 * const payload = generateUserPayload({ email: 'teste@exemplo.com' });
 * await apiPost(request, '/usuarios', payload);
 * ```
 *
 * @param overrides - campos que devem sobrescrever os valores gerados
 * @returns `UserPayload` pronto para envio à API
 */
export const generateUserPayload = (overrides?: Partial<UsuarioPayload>): UsuarioPayload => {
  const payload: UsuarioPayload = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: faker.datatype.boolean() ? 'true' : 'false',
  };
  return { ...payload, ...overrides };
};
