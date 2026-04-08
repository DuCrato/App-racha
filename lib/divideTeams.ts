import { Jogador, DivisaoTimes, Time } from './types';

/**
 * Divide jogadores em times de forma balanceada com prioridade para os 2 primeiros times
 * @param players - Jogadores confirmados
 * @param numTeams - Número de times
 * @param numPlayers - Número total de jogadores a usar
 * @param timeFilled - Número de times a priorizar (padrão: 2)
 */
export function divideTeamsPriority(
  players: Jogador[],
  numTeams: number,
  numPlayers: number,
  timeFilled: number = 2
): DivisaoTimes {
  if (numPlayers > players.length) {
    throw new Error(`Apenas ${players.length} jogadores confirmados`);
  }
  if (numTeams < 2) {
    throw new Error('Mínimo 2 times');
  }

  // Seleciona apenas os primeiros N jogadores e embaralha
  const selectedPlayers = [...players.slice(0, numPlayers)].sort(
    () => Math.random() - 0.5
  );

  // Inicializa times vazios
  const teams: Time[] = Array.from({ length: numTeams }, (_, i) => ({
    numero: i + 1,
    quantidade: 0,
    jogadores: [],
  }));

  const jogadorPorTime = Math.floor(numPlayers / numTeams);
  const resto = numPlayers % numTeams;

  let playerIndex = 0;

  // PASSO 1: Preenche os primeiros `timeFilled` times completamente
  for (let t = 0; t < Math.min(timeFilled, numTeams); t++) {
    for (let i = 0; i < jogadorPorTime; i++) {
      if (playerIndex < numPlayers) {
        teams[t].jogadores.push(selectedPlayers[playerIndex++]);
        teams[t].quantidade++;
      }
    }
  }

  // PASSO 2: Distribui os restantes entre todos os times (circulante)
  let teamIndex = 0;
  while (playerIndex < numPlayers) {
    teams[teamIndex].jogadores.push(selectedPlayers[playerIndex++]);
    teams[teamIndex].quantidade++;
    teamIndex = (teamIndex + 1) % numTeams;
  }

  // Ordena times por número
  teams.sort((a, b) => a.numero - b.numero);

  return {
    teams,
    summary: {
      totalJogadores: numPlayers,
      jogosPorTime: jogadorPorTime,
      timesComExtraJogador: resto,
      detalhesTimes: teams.map((time) => ({
        numero: time.numero,
        quantidade: time.quantidade,
        jogadores: time.jogadores.map((j) => j.nome),
      })),
    },
  };
}

/**
 * Versão simples com distribuição uniforme (snake pattern)
 */
export function divideTeamsSnake(
  players: Jogador[],
  numTeams: number,
  numPlayers: number
): DivisaoTimes {
  if (numPlayers > players.length) {
    throw new Error(`Apenas ${players.length} jogadores confirmados`);
  }

  const selectedPlayers = [...players.slice(0, numPlayers)].sort(
    () => Math.random() - 0.5
  );

  const teams: Time[] = Array.from({ length: numTeams }, (_, i) => ({
    numero: i + 1,
    quantidade: 0,
    jogadores: [],
  }));

  const jogadorPorTime = Math.floor(numPlayers / numTeams);
  const resto = numPlayers % numTeams;

  let playerIndex = 0;

  // Distribui jogadores
  for (let t = 0; t < numTeams; t++) {
    const quantidadeNesseTime = jogadorPorTime + (t < resto ? 1 : 0);
    for (let i = 0; i < quantidadeNesseTime; i++) {
      if (playerIndex < numPlayers) {
        teams[t].jogadores.push(selectedPlayers[playerIndex++]);
        teams[t].quantidade++;
      }
    }
  }

  return {
    teams,
    summary: {
      totalJogadores: numPlayers,
      jogosPorTime: jogadorPorTime,
      timesComExtraJogador: resto,
      detalhesTimes: teams.map((time) => ({
        numero: time.numero,
        quantidade: time.quantidade,
        jogadores: time.jogadores.map((j) => j.nome),
      })),
    },
  };
}
