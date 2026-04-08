import { Jogador, RachaData } from './types';

/**
 * Parseia a mensagem do WhatsApp e extrai dados do racha
 */
export function parseRachaMessage(mensagem: string): RachaData {
  const linhas = mensagem.split('\n').map((l) => l.trim());
  const mensagemLimpa = mensagem.replace(/\*/g, '');

  // Extrai data e hora
  let data = '';
  let hora = '';
  const dataMatch = mensagemLimpa.match(/(\d{1,2}\/\d{1,2})\s+as\s+(\d{1,2}h)/i);
  if (dataMatch) {
    data = dataMatch[1];
    hora = dataMatch[2];
  }

  // Extrai cores
  let cores = '';
  const coresMatch = mensagemLimpa.match(/🚨([^🚨]+)🚨/);
  if (coresMatch) {
    cores = coresMatch[1].trim();
  }

  // Função auxiliar para extrair jogadores de uma seção
  function extrairJogadores(
    inicio: number,
    fim: number,
    tipo: 'jogador' | 'goleiro' | 'suplente'
  ): Jogador[] {
    const jogadores: Jogador[] = [];
    let numero = 1;

    for (let i = inicio; i < fim; i++) {
      const linha = linhas[i];
      const match = linha.match(/^\d{1,2}-\s*(.+)/);

      if (match && match[1].trim()) {
        jogadores.push({
          id: `${tipo}-${numero}`,
          nome: match[1].trim(),
          numero,
          tipo,
          presente: true,
        });
        numero++;
      }
    }

    return jogadores;
  }

  // Encontra índices das seções
  let jogadoresStart = -1,
    jogadoresEnd = -1;
  let goleirosStart = -1,
    goleirosEnd = -1;
  let suplentesStart = -1,
    suplentesEnd = -1;

  for (let i = 0; i < linhas.length; i++) {
    const linhaNormalizada = linhas[i]
      .replace(/\*/g, '')
      .replace(/\uFE0F/g, '')
      .toUpperCase();

    if (linhaNormalizada.includes('JOGADORES')) {
      jogadoresStart = i + 1;
    } else if (linhaNormalizada.includes('GOLEIROS')) {
      jogadoresEnd = i;
      goleirosStart = i + 1;
    } else if (linhaNormalizada.includes('SUPLENTES')) {
      goleirosEnd = i;
      suplentesStart = i + 1;
    }
  }

  suplentesEnd = linhas.length;

  // Extrai jogadores por categoria
  const jogadoresBase = extrairJogadores(jogadoresStart, jogadoresEnd, 'jogador');
  const goleiros = extrairJogadores(goleirosStart, goleirosEnd, 'goleiro');
  const suplentes = extrairJogadores(suplentesStart, suplentesEnd, 'suplente');

  // Inclui suplentes na lista principal para a chamada
  const jogadores = [
    ...jogadoresBase,
    ...suplentes.map((suplente, idx) => ({
      ...suplente,
      numero: jogadoresBase.length + idx + 1,
    })),
  ];

  return {
    data,
    hora,
    cores,
    totalJogadores: jogadores.length,
    jogadores,
    goleiros,
    suplentes,
  };
}

/**
 * Formata a data do racha para exibição
 */
export function formatarDataRacha(data: string): string {
  if (!data) return 'Data não especificada';
  const [dia, mes] = data.split('/');
  const meses = [
    '',
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  return `${dia} de ${meses[Number(mes)]}`;
}
