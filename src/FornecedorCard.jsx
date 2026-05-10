import React, { useState, useRef } from 'react';
import { Phone, MapPin, Trash2, Edit2, Save, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { LIMIAR_VERIFICADO, corPrioridade, corStatus, labelStatus } from './utils.js';

export default function FornecedorCard({ f, checkItems, mensagemWA, onToggleCheck, onSalvarEdicao, onRemover, onAtualizarNotas }) {
  const [expandido, setExpandido] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editForm, setEditForm] = useState({});
  const debounceNotas = useRef(null);

  const totalChecks = Object.values(f.checks || {}).filter(Boolean).length;
  const progresso = checkItems.length > 0 ? (totalChecks / checkItems.length) * 100 : 0;

  const iniciarEdicao = () => {
    setEditForm({ ...f });
    setEditando(true);
    setExpandido(true);
  };

  const salvarEdicao = () => {
    onSalvarEdicao(editForm);
    setEditando(false);
    setEditForm({});
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setEditForm({});
  };

  const atualizarNotas = (notas) => {
    clearTimeout(debounceNotas.current);
    debounceNotas.current = setTimeout(() => onAtualizarNotas(f.id, notas), 400);
  };

  const abrirWhatsApp = () => {
    if (!f.contato) return;
    const numero = f.contato.replace(/\D/g, '');
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagemWA)}`, '_blank');
  };

  const abrirMaps = () => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(f.endereco + ' Cobija Bolivia')}`, '_blank');
  };

  const barColor = totalChecks === checkItems.length && checkItems.length > 0
    ? 'bg-green-500'
    : totalChecks >= Math.ceil(checkItems.length * LIMIAR_VERIFICADO)
      ? 'bg-blue-500'
      : totalChecks >= 1 ? 'bg-yellow-500' : 'bg-slate-300';

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4">
        {editando ? (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900 text-sm">✏️ Editando fornecedor</h3>
              <div className="flex gap-2">
                <button onClick={salvarEdicao} className="bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-green-700">
                  <Save size={12} /> Salvar
                </button>
                <button onClick={cancelarEdicao} className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs hover:bg-slate-300">Cancelar</button>
              </div>
            </div>
            <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm font-medium" placeholder="Nome" value={editForm.nome || ''} onChange={e => setEditForm(ef => ({ ...ef, nome: e.target.value }))} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input className="border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Contato" value={editForm.contato || ''} onChange={e => setEditForm(ef => ({ ...ef, contato: e.target.value }))} />
              <input className="border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Tipo" value={editForm.tipo || ''} onChange={e => setEditForm(ef => ({ ...ef, tipo: e.target.value }))} />
            </div>
            <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Endereço" value={editForm.endereco || ''} onChange={e => setEditForm(ef => ({ ...ef, endereco: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <select className="border border-slate-300 rounded px-2 py-1.5 text-sm" value={editForm.prioridade || 'Média'} onChange={e => setEditForm(ef => ({ ...ef, prioridade: e.target.value }))}>
                <option>Alta</option><option>Média</option><option>Baixa</option>
              </select>
              <select className="border border-slate-300 rounded px-2 py-1.5 text-sm" value={editForm.atacado || 'Baixo'} onChange={e => setEditForm(ef => ({ ...ef, atacado: e.target.value }))}>
                <option>Indício forte</option><option>Indício médio</option><option>Baixo a médio</option><option>Baixo</option><option>Não confirmado</option>
              </select>
            </div>
            <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Avaliação" value={editForm.avaliacao || ''} onChange={e => setEditForm(ef => ({ ...ef, avaliacao: e.target.value }))} />
            <textarea className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Observações" rows={2} value={editForm.obs || ''} onChange={e => setEditForm(ef => ({ ...ef, obs: e.target.value }))} />
            <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" value={editForm.status || 'pendente'} onChange={e => setEditForm(ef => ({ ...ef, status: e.target.value }))}>
              <option value="pendente">Status: Pendente</option>
              <option value="em_andamento">Status: Em andamento</option>
              <option value="verificado">Status: Verificado</option>
              <option value="aprovado">Status: Aprovado</option>
            </select>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-slate-900 text-base">{f.nome}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded border ${corPrioridade(f.prioridade)}`}>{f.prioridade}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${corStatus(f.status)}`}>{labelStatus(f.status)}</span>
                </div>
                {f.tipo && <p className="text-sm text-slate-600">{f.tipo}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={iniciarEdicao} className="text-slate-400 hover:text-blue-600 p-1" title="Editar"><Edit2 size={16} /></button>
                <button onClick={() => onRemover(f.id)} className="text-slate-400 hover:text-red-500 p-1" title="Remover"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="space-y-1 text-sm text-slate-600 mb-3">
              {f.contato && (
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <button onClick={abrirWhatsApp} className="text-green-700 hover:underline font-medium">{f.contato}</button>
                </div>
              )}
              {f.endereco && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <button onClick={abrirMaps} className="text-blue-700 hover:underline text-left">{f.endereco}</button>
                </div>
              )}
              {f.atacado && f.atacado !== 'N/D' && (
                <div className="text-xs text-slate-500">Atacado: <span className="font-medium">{f.atacado}</span></div>
              )}
            </div>

            {f.obs && <p className="text-xs text-slate-500 italic mb-3 bg-slate-50 p-2 rounded">{f.obs}</p>}
          </>
        )}

        {!editando && (
          <button
            onClick={() => setExpandido(e => !e)}
            className="w-full flex items-center justify-between text-xs text-slate-500 mb-2 hover:text-slate-700"
          >
            <span>Verificação ({totalChecks}/{checkItems.length})</span>
            {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}

        {!editando && (
          <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
            <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${progresso}%` }} />
          </div>
        )}

        {(expandido || editando) && (
          <>
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {checkItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onToggleCheck(f.id, item.id)}
                  className={`text-left text-xs px-2 py-1.5 rounded border transition ${f.checks?.[item.id] ? 'bg-green-50 border-green-300 text-green-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {f.checks?.[item.id] ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            <textarea
              className="w-full text-xs border border-slate-200 rounded p-2 resize-none focus:outline-none focus:border-slate-400"
              placeholder="Notas pessoais (preços cotados, marcas vistas, observações da visita...)"
              rows={2}
              defaultValue={f.notas || ''}
              onChange={e => atualizarNotas(e.target.value)}
            />
          </>
        )}
      </div>
    </div>
  );
}
