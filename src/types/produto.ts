/**
 * Estrutura do payload de produto usada pelos testes.
 *
 * Campos:
 * - `nome`: nome do produto.
 * - `preco`: preco do produto.
 * - `descricao`: descricao do produto.
 * - `quantidade`: quantidade em estoque.
 */
export interface ProdutoPayload {
  /** Nome do produto */
  nome: string;

  /** Preco do produto */
  preco: number;

  /** Descricao do produto */
  descricao: string;

  /** Quantidade em estoque */
  quantidade: number;
}
