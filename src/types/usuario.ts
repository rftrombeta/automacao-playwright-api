/**
 * Estrutura do payload de usuário usada pelos testes.
 *
 * Campos:
 * - `nome`: nome completo do usuário.
 * - `email`: e-mail do usuário, usado para login/identificação.
 * - `password`: senha do usuário em texto (apenas para testes).
 * - `administrador`: string `'true'` ou `'false'` seguindo o contrato
 *   da API (muitos endpoints de exemplo usam string).
 */
export interface UsuarioPayload {
  /** Nome completo do usuário */
  nome: string;

  /** Endereço de e-mail do usuário */
  email: string;

  /** Senha em texto (somente para uso em testes) */
  password: string;

  /** Indicador se o usuário é administrador: 'true' | 'false' */
  administrador: 'true' | 'false';
}
