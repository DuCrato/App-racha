'use client';

import { useState } from 'react';
import { Jogador, Presenca, DivisaoTimes } from '@/lib/types';

interface DivideTeamsFormProps {
  jogadores: Jogador[];
  presencas: Map<string, Presenca>;
  onPresencaChange: (presencas: Map<string, Presenca>) => void;
}

export default function DivideTeamsForm({
  jogadores,
  presencas,
  onPresencaChange,
}: DivideTeamsFormProps) {
  const [playersPerTeam, setPlayersPerTeam] = useState(0);
  const [divisao, setDivisao] = useState<DivisaoTimes | null>(null);
  const [suplentesDaRodada, setSuplentesDaRodada] = useState<Jogador[]>([]);
  const [faltasDaRodada, setFaltasDaRodada] = useState<Jogador[]>([]);
  const [error, setError] = useState('');

  const confirmadosAtuais = Array.from(presencas.values()).filter(
    (p) => p.status === 'confirmado'
  ).length;

  const handleDivide = () => {
    try {
      setError('');
      setSuplentesDaRodada([]);
      setFaltasDaRodada([]);

      const presencasAtualizadas = new Map(presencas);

      jogadores.forEach((jogador) => {
        if (!presencasAtualizadas.has(jogador.id)) {
          presencasAtualizadas.set(jogador.id, {
            jogadorId: jogador.id,
            status: 'suplente',
            timestamp: Date.now(),
          });
        }
      });

      onPresencaChange(presencasAtualizadas);

      const confirmados = jogadores.filter(
        (jogador) => presencasAtualizadas.get(jogador.id)?.status === 'confirmado'
      );

      const faltas = jogadores.filter(
        (jogador) => presencasAtualizadas.get(jogador.id)?.status === 'falta'
      );

      const suplentes = jogadores.filter(
        (jogador) => presencasAtualizadas.get(jogador.id)?.status === 'suplente'
      );

      if (confirmados.length === 0) {
        setError('Nenhum jogador confirmado');
        return;
      }

      if (playersPerTeam <= 0) {
        setError('Informe quantos jogadores por time');
        return;
      }

      const minimoParaDoisTimes = playersPerTeam * 2;
      if (confirmados.length < minimoParaDoisTimes) {
        setError(
          `Para fechar 2 times completos com ${playersPerTeam} por time, são necessários ${minimoParaDoisTimes} confirmados.`
        );
        return;
      }

      const totalConfirmados = confirmados.length;

      const embaralhados = [...confirmados].sort(() => Math.random() - 0.5);
      const times = [];
      let idxTime = 0;
      while (idxTime * playersPerTeam < totalConfirmados) {
        const inicio = idxTime * playersPerTeam;
        const fim = inicio + playersPerTeam;
        const jogadoresDoTime = embaralhados.slice(inicio, fim);

        if (jogadoresDoTime.length === 0) {
          break;
        }

        times.push({
          numero: idxTime + 1,
          quantidade: jogadoresDoTime.length,
          jogadores: jogadoresDoTime,
        });
        idxTime++;
      }

      const resultado: DivisaoTimes = {
        teams: times,
        summary: {
          totalJogadores: totalConfirmados,
          jogosPorTime: playersPerTeam,
          timesComExtraJogador:
            times.length > 2
              ? times.slice(2).filter((time) => time.quantidade < playersPerTeam)
                  .length
              : 0,
          detalhesTimes: times.map((time) => ({
            numero: time.numero,
            quantidade: time.quantidade,
            jogadores: time.jogadores.map((j) => j.nome),
          })),
        },
      };

      setDivisao(resultado);
      setSuplentesDaRodada(suplentes);
      setFaltasDaRodada(faltas);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao dividir times');
      }
    }
  };

  const getCorTime = (
    numeroTime: number
  ): { bg: string; border: string; text: string } => {
    const cores = [
      { bg: 'bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30', border: 'border-blue-500 dark:border-blue-600', text: 'text-blue-900 dark:text-blue-300' },
      {
        bg: 'bg-amber-100 dark:bg-amber-900 dark:bg-opacity-30',
        border: 'border-amber-500 dark:border-amber-600',
        text: 'text-amber-900 dark:text-amber-300',
      },
      {
        bg: 'bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30',
        border: 'border-purple-500 dark:border-purple-600',
        text: 'text-purple-900 dark:text-purple-300',
      },
      { bg: 'bg-pink-100 dark:bg-pink-900 dark:bg-opacity-30', border: 'border-pink-500 dark:border-pink-600', text: 'text-pink-900 dark:text-pink-300' },
    ];
    return cores[numeroTime - 1] || cores[0];
  };

  const gerarTextoCompartilhamento = () => {
    if (!divisao) return '';

    const formatarLinhaJogador = (nome: string, idx: number) =>
      `${String(idx + 1).padStart(2, '0')}- ${nome.trim()}`;

    const linhas: string[] = [];
    linhas.push('⚽ DIVISAO DOS TIMES');
    linhas.push('');

    divisao.teams.forEach((time, idx) => {
      const nomeEquipe = `Equipe ${String.fromCharCode(65 + idx)}`;
      linhas.push(`★ ${nomeEquipe}`);
      time.jogadores.forEach((jogador, jogadorIdx) => {
        linhas.push(formatarLinhaJogador(jogador.nome, jogadorIdx));
      });
      linhas.push('');
    });

    linhas.push(`• SUPLENTES (${suplentesDaRodada.length})`);
    if (suplentesDaRodada.length > 0) {
      suplentesDaRodada.forEach((jogador, idx) => {
        linhas.push(formatarLinhaJogador(jogador.nome, idx));
      });
    } else {
      linhas.push('Nenhum suplente');
    }
    linhas.push('');

    linhas.push(`✖ FALTAS (${faltasDaRodada.length})`);
    if (faltasDaRodada.length > 0) {
      faltasDaRodada.forEach((jogador, idx) => {
        linhas.push(formatarLinhaJogador(jogador.nome, idx));
      });
    } else {
      linhas.push('Nenhuma falta');
    }

    return linhas.join('\n');
  };

  const compartilharNoWhatsApp = async () => {
    if (!divisao) return;

    const texto = gerarTextoCompartilhamento();
    const textoUrl = encodeURIComponent(texto);
    const url = `https://wa.me/?text=${textoUrl}`;

    window.open(url, '_blank');

    // Fallback: deixa o texto copiado para facilitar colar no WhatsApp Desktop.
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Ignora erro de clipboard sem interromper o compartilhamento.
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">⚽ Divisão de Times</h2>

      {confirmadosAtuais > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
          {confirmadosAtuais} jogador(es) confirmado(s)
        </p>
      )}

      {/* Controles */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 transition-colors">
            Jogadores por Time
          </label>
          <input
            type="number"
            min="1"
            max={Math.max(1, confirmadosAtuais)}
            value={playersPerTeam || ''}
            onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
            className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            &nbsp;
          </label>
          <button
            onClick={handleDivide}
            disabled={confirmadosAtuais === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 text-white font-bold py-2 rounded-lg transition"
          >
            🎲 Dividir
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-200 rounded mb-4 transition-colors">
          🚨 {error}
        </div>
      )}

      {/* Resultado da Divisão */}
      {divisao && (
        <div>
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">Resumo</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <p>
                📊 <strong>Total:</strong> {divisao.summary.totalJogadores}
              </p>
              <p>
                👥 <strong>Por time:</strong> {playersPerTeam}
              </p>
              <p>
                🏟️ <strong>Times:</strong> {divisao.teams.length}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {divisao.teams.map((time, idx) => {
              const cores = getCorTime(time.numero);
              const nomeEquipe = `Equipe ${String.fromCharCode(65 + idx)}`;
              return (
                <div
                  key={time.numero}
                  className={`${cores.bg} border-2 ${cores.border} p-4 rounded-lg`}
                >
                  <h3 className={`text-lg font-bold mb-3 ${cores.text}`}>
                    🏆 {nomeEquipe}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">
                    {time.quantidade} jogador(es)
                  </p>
                  <ul className="space-y-1 text-sm">
                    {time.jogadores.map((jogador, idx) => (
                      <li key={idx} className="text-gray-800 dark:text-gray-200 transition-colors">
                        {(idx + 1).toString().padStart(2, '0')}. {jogador.nome}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border-2 border-yellow-400 dark:border-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30">
              <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                🧍 Suplentes ({suplentesDaRodada.length})
              </h4>
              {suplentesDaRodada.length > 0 ? (
                <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
                  {suplentesDaRodada.map((jogador) => (
                    <li key={jogador.id}>{jogador.nome}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">Nenhum suplente.</p>
              )}
            </div>

            <div className="p-4 rounded-lg border-2 border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-900 dark:bg-opacity-30">
              <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">
                ❌ Faltas ({faltasDaRodada.length})
              </h4>
              {faltasDaRodada.length > 0 ? (
                <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
                  {faltasDaRodada.map((jogador) => (
                    <li key={jogador.id}>{jogador.nome}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">Nenhuma falta.</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={compartilharNoWhatsApp}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
            >
              📲 Compartilhar no WhatsApp
            </button>

            <button
              onClick={() => {
                setDivisao(null);
                setSuplentesDaRodada([]);
                setFaltasDaRodada([]);
              }}
              className="w-full py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg transition"
            >
              Limpar
            </button>
          </div>
        </div>
      )}

      {confirmadosAtuais === 0 && (
        <p className="text-center text-gray-500 py-8">
          Confirme jogadores para dividir times
        </p>
      )}
    </div>
  );
}
