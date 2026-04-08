'use client';

import { useState } from 'react';
import { parseRachaMessage } from '@/lib/parseRacha';
import { RachaData } from '@/lib/types';

interface ParserFormProps {
  onParsed: (data: RachaData) => void;
}

export default function ParserForm({ onParsed }: ParserFormProps) {
  const [mensagem, setMensagem] = useState('');
  const [error, setError] = useState('');

  const handleParse = () => {
    try {
      setError('');
      if (!mensagem.trim()) {
        setError('Por favor, cole a mensagem do WhatsApp');
        return;
      }

      const dados = parseRachaMessage(mensagem);

      if (dados.jogadores.length === 0) {
        setError('Nenhum jogador encontrado. Verifique o formato da mensagem.');
        return;
      }

      onParsed(dados);
      setMensagem('');
    } catch (err) {
      setError('Erro ao processar a mensagem. Verifique o formato.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-blue-200 dark:border-blue-900 transition-colors">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">📋 Carregar Racha</h2>

      <textarea
        value={mensagem}
        onChange={(e) => {
          setMensagem(e.target.value);
          setError('');
        }}
        placeholder="Cole aqui a mensagem do WhatsApp com a lista de jogadores..."
        className="w-full h-48 p-4 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-vertical transition-colors"
      />

      {error && (
        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-100 rounded transition-colors">
          🚨 {error}
        </div>
      )}

      <button
        onClick={handleParse}
        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 text-white font-bold py-3 rounded-lg transition duration-200 transform hover:scale-105"
      >
        ✅ Carregar Racha
      </button>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center transition-colors">
        Dica: Cole exatamente a mensagem do WhatsApp, incluindo emojis e formatação
      </p>
    </div>
  );
}
