import React, { useState } from 'react';

export default function PainelMensagem({ mensagemWA, onMensagemChange }) {
  const [editando, setEditando] = useState(false);
  const [copiada, setCopiada] = useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(mensagemWA);
    setCopiada(true);
    setTimeout(() => setCopiada(false), 2000);
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between mb-2 gap-2">
        <h3 className="font-semibold text-green-900 text-sm">Mensagem padrão (editável)</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setEditando(!editando)}
            className="text-xs bg-white border border-green-300 text-green-700 px-3 py-1 rounded hover:bg-green-50"
          >
            {editando ? 'Concluir' : '✏️ Editar'}
          </button>
          <button
            onClick={copiar}
            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            {copiada ? '✓ Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>
      {editando ? (
        <textarea
          className="w-full text-xs text-green-900 bg-white p-3 rounded border border-green-300 font-sans resize-y"
          rows={14}
          value={mensagemWA}
          onChange={e => onMensagemChange(e.target.value)}
        />
      ) : (
        <pre className="text-xs text-green-900 whitespace-pre-wrap font-sans bg-white p-3 rounded border border-green-200">
          {mensagemWA}
        </pre>
      )}
    </div>
  );
}
