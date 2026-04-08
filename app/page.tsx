'use client';

import { useState } from 'react';
import ParserForm from '@/components/ParserForm';
import PlayerList from '@/components/PlayerList';
import DivideTeamsForm from '@/components/DivideTeamsForm';
import { RachaData, Presenca } from '@/lib/types';

export default function Home() {
  const [racha, setRacha] = useState<RachaData | null>(null);
  const [presencas, setPresencas] = useState<Map<string, Presenca>>(new Map());

  const handleRachaParsed = (data: RachaData) => {
    setRacha(data);
    setPresencas(new Map());
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2">App Racha</h1>
        </div>

        {/* Conteúdo Principal */}
        {!racha ? (
          <ParserForm onParsed={handleRachaParsed} />
        ) : (
          <div className="space-y-6">

            {/* Layout em Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Esquerda - Lista de Jogadores (takes 2 cols) */}
              <div className="lg:col-span-2">
                <PlayerList
                  jogadores={racha.jogadores}
                  goleiros={racha.goleiros}
                  presencas={presencas}
                  onPresencaChange={setPresencas}
                />
              </div>

              {/* Coluna Direita - Divisão de Times */}
              <div>
                <DivideTeamsForm
                  jogadores={racha.jogadores}
                  presencas={presencas}
                  onPresencaChange={setPresencas}
                />
              </div>
            </div>

            {/* Botão Voltar */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setRacha(null);
                  setPresencas(new Map());
                }}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition"
              >
                ← Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
