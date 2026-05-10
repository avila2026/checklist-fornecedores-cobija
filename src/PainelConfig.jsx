import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function PainelConfig({ checkItems, onEditarLabel, onRemoverCheck, onAdicionarCheck }) {
  const [novoCheck, setNovoCheck] = useState('');

  const adicionar = () => {
    if (!novoCheck.trim()) return;
    onAdicionarCheck(novoCheck);
    setNovoCheck('');
  };

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-3">
      <h3 className="font-semibold text-indigo-900 mb-3 text-sm">⚙️ Configurar itens do checklist</h3>
      <div className="space-y-2 mb-3">
        {checkItems.map((c, i) => (
          <div key={c.id} className="flex gap-2 items-center bg-white rounded-lg p-2 border border-indigo-100">
            <span className="text-xs text-indigo-400 w-6">{i + 1}.</span>
            <input
              className="flex-1 text-sm outline-none"
              value={c.label}
              onChange={e => onEditarLabel(c.id, e.target.value)}
            />
            <button onClick={() => onRemoverCheck(c.id)} className="text-red-400 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-indigo-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Novo item de verificação (ex: 🧾 NF emitida)"
          value={novoCheck}
          onChange={e => setNovoCheck(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && adicionar()}
        />
        <button onClick={adicionar} className="bg-indigo-600 text-white px-4 rounded-lg text-sm hover:bg-indigo-700">
          Adicionar
        </button>
      </div>
    </div>
  );
}
