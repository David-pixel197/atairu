import BASE_URL from '@/config/api';

// ============================================================
// TIPOS
// ============================================================

export interface Jogador {
  id: number;
  nickname: string;
  email: string;
  nome: string;
  cpf?: string;
  avatar?: string;
  km: number;
  banido: boolean;
  dataCadastro: string;
  dataNascimento?: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface CadastroPayload {
  email: string;
  senha: string;
  nickname: string;
  nome: string;
  cpf?: string;
  dataNascimento?: string; // formato: "YYYY-MM-DD"
}

export interface ApiError {
  message: string;
}

// ============================================================
// HELPERS
// ============================================================

/** Converte Date ou string "DD/MM/YYYY" para "YYYY-MM-DD" (formato esperado pelo backend) */
function formatarDataParaApi(data: Date | string): string {
  if (data instanceof Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
  // Se vier como "DD/MM/YYYY"
  if (typeof data === 'string' && data.includes('/')) {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  }
  return data;
}

// ============================================================
// LOGIN
// ============================================================

/**
 * Autentica o jogador com email e senha.
 * Retorna os dados do jogador em caso de sucesso.
 * Lança um Error com a mensagem do backend em caso de falha.
 */
export async function login(payload: LoginPayload): Promise<Jogador> {
  const response = await fetch(`${BASE_URL}/api/jogadores/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    // O backend retorna uma string simples como mensagem de erro
    throw new Error(typeof data === 'string' ? data : 'Erro ao fazer login.');
  }

  return data as Jogador;
}

// ============================================================
// CADASTRO
// ============================================================

/**
 * Cadastra um novo jogador.
 * Retorna os dados do jogador criado em caso de sucesso.
 * Lança um Error com a mensagem do backend em caso de falha.
 */
export async function cadastrar(payload: CadastroPayload): Promise<Jogador> {
  const response = await fetch(`${BASE_URL}/api/jogadores/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(typeof data === 'string' ? data : 'Erro ao cadastrar.');
  }

  return data as Jogador;
}

// ============================================================
// EXPORTA HELPER PARA USO NAS TELAS
// ============================================================
export { formatarDataParaApi };