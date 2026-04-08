export interface Jogador {
  id: string;
  nome: string;
  numero: number;
  tipo: 'jogador' | 'goleiro' | 'suplente';
  presente?: boolean;
}

export interface RachaData {
  data: string;
  hora: string;
  cores: string;
  totalJogadores: number;
  jogadores: Jogador[];
  goleiros: Jogador[];
  suplentes: Jogador[];
}

export interface Presenca {
  jogadorId: string;
  status: 'confirmado' | 'falta' | 'suplente';
  timestamp: number;
}

export interface Time {
  numero: number;
  quantidade: number;
  jogadores: Jogador[];
}

export interface DivisaoTimes {
  teams: Time[];
  summary: {
    totalJogadores: number;
    jogosPorTime: number;
    timesComExtraJogador: number;
    detalhesTimes: Array<{
      numero: number;
      quantidade: number;
      jogadores: string[];
    }>;
  };
}
