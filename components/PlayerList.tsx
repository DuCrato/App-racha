'use client';

import { useState } from 'react';
import { Jogador, Presenca } from '@/lib/types';

interface PlayerListProps {
  jogadores: Jogador[];
  goleiros: Jogador[];
  presencas: Map<string, Presenca>;
  onPresencaChange: (presencas: Map<string, Presenca>) => void;
}

export default function PlayerList({
  jogadores,
  goleiros,
  presencas,
  onPresencaChange,
}: PlayerListProps) {
  const [filterTab, setFilterTab] = useState<'todos' | 'confirmados' | 'faltas'>(
    'todos'
  );

  const handlePresenca = (
    jogadorId: string,
    status: 'confirmado' | 'falta' | 'suplente'
  ) => {
    const novasPresencas = new Map(presencas);

    // Se clicar no mesmo status novamente, desmarca o jogador.
    if (novasPresencas.get(jogadorId)?.status === status) {
      novasPresencas.delete(jogadorId);
    } else {
      novasPresencas.set(jogadorId, {
        jogadorId,
        status,
        timestamp: Date.now(),
      });
    }

    onPresencaChange(novasPresencas);
  };

  const getPresenca = (
    jogadorId: string
  ): 'confirmado' | 'falta' | 'suplente' | null => {
    return presencas.get(jogadorId)?.status || null;
  };

  const numConfirmados = Array.from(presencas.values()).filter(
    (p) => p.status === 'confirmado'
  ).length;
  const numFaltas = Array.from(presencas.values()).filter((p) => p.status === 'falta')
    .length;
  const numSuplentes = Array.from(presencas.values()).filter(
    (p) => p.status === 'suplente'
  ).length;

  const renderPlayerRow = (jogador: Jogador) => {
    const presenca = getPresenca(jogador.id);

    return (
      <div
        key={jogador.id}
        className={`flex items-center justify-between p-3 rounded-lg border-2 transition ${
          presenca === 'confirmado'
            ? 'bg-green-50 dark:bg-green-900 dark:bg-opacity-30 border-green-400 dark:border-green-600'
            : presenca === 'falta'
              ? 'bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border-red-400 dark:border-red-600'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
        }`}
      >
        <div className="flex-1">
          <p className="font-semibold text-gray-800 dark:text-white transition-colors">
            {jogador.numero.toString().padStart(2, '0')}. {jogador.nome}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handlePresenca(jogador.id, 'confirmado')}
            className={`px-3 py-1 rounded font-semibold transition ${
              presenca === 'confirmado'
                ? 'bg-green-500 dark:bg-green-600 text-white'
                : 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700'
            }`}
          >
            ✅
          </button>
          <button
            onClick={() => handlePresenca(jogador.id, 'suplente')}
            className={`px-3 py-1 rounded font-semibold transition ${
              presenca === 'suplente'
                ? 'bg-yellow-500 dark:bg-yellow-600 text-white'
                : 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-300 dark:hover:bg-yellow-700'
            }`}
          >
            🧍
          </button>
          <button
            onClick={() => handlePresenca(jogador.id, 'falta')}
            className={`px-3 py-1 rounded font-semibold transition ${
              presenca === 'falta'
                ? 'bg-red-500 dark:bg-red-600 text-white'
                : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-300 dark:hover:bg-red-700'
            }`}
          >
            ❌
          </button>
        </div>
      </div>
    );
  };

  const allPlayers = jogadores;

  const filteredPlayers =
    filterTab === 'confirmados'
      ? allPlayers.filter((j) => getPresenca(j.id) === 'confirmado')
      : filterTab === 'faltas'
        ? allPlayers.filter((j) => getPresenca(j.id) === 'falta')
        : allPlayers;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-colors h-[72vh] flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">⚽ Jogadores</h2>

        {/* Cards de Resumo */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1">
            <div className="bg-green-100 dark:bg-green-900 dark:bg-opacity-30 p-4 rounded-lg border-2 border-green-400 dark:border-green-600 transition-colors">
              <p className="text-sm font-semibold text-gray-600 dark:text-green-200">Confirmados</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{numConfirmados}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 p-4 rounded-lg border-2 border-yellow-400 dark:border-yellow-600 transition-colors">
              <p className="text-sm font-semibold text-gray-600 dark:text-yellow-200">Suplentes</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{numSuplentes}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 dark:bg-opacity-30 p-4 rounded-lg border-2 border-red-400 dark:border-red-600 transition-colors">
              <p className="text-sm font-semibold text-gray-600 dark:text-red-200">Faltas</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{numFaltas}</p>
            </div>
          </div>
        </div>

        {/* Tabs de Filtro */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilterTab('todos')}
            className={`flex-1 py-2 rounded font-semibold transition ${
              filterTab === 'todos'
                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todos ({allPlayers.length})
          </button>
          <button
            onClick={() => setFilterTab('confirmados')}
            className={`flex-1 py-2 rounded font-semibold transition ${
              filterTab === 'confirmados'
                ? 'bg-green-600 dark:bg-green-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Confirmados ({numConfirmados})
          </button>
          <button
            onClick={() => setFilterTab('faltas')}
            className={`flex-1 py-2 rounded font-semibold transition ${
              filterTab === 'faltas'
                ? 'bg-red-600 dark:bg-red-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Faltas ({numFaltas})
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {/* Lista de Jogadores */}
        <div className="space-y-2">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(renderPlayerRow)
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8 transition-colors">Nenhum jogador nesta categoria</p>
          )}
        </div>

        {/* Goleiros */}
        {goleiros.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">🧤 Goleiros</h3>
            <div className="space-y-2">
              {goleiros.map(renderPlayerRow)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
