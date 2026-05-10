import React, { useState } from 'react';

const estadoInicial = { nome: '', contato: '', endereco: '', tipo: '', atacado: 'Baixo', prioridade: 'Média', obs: '' };

export default function FormularioFornecedor({ onAdicionar, onCancelar }) {
  const [form, setForm] = useState(estadoInicial);

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const adicionar = () => {
    if (!form.nome.trim()) return;
    onAdicionar(form);
    setForm(estadoInicial);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-3">Adicionar novo fornecedor</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Nome do comércio*" value={form.nome} onChange={e => set('nome', e.target.value)} />
        <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Contato (+591...)" value={form.contato} onChange={e => set('contato', e.target.value)} />
        <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:col-span-2" placeholder="Endereço" value={form.endereco} onChange={e => set('endereco', e.target.value)} />
        <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Tipo (perfumaria, cosméticos...)" value={form.tipo} onChange={e => set('tipo', e.target.value)} />
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.prioridade} onChange={e => set('prioridade', e.target.value)}>
          <option>Alta</option><option>Média</option><option>Baixa</option>
        </select>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.atacado} onChange={e => set('atacado', e.target.value)}>
          <option>Indício forte</option><option>Indício médio</option><option>Baixo a médio</option><option>Baixo</option><option>Não confirmado</option>
        </select>
        <textarea className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:col-span-2" placeholder="Observações" rows={2} value={form.obs} onChange={e => set('obs', e.target.value)} />
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={adicionar} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Adicionar</button>
        <button onClick={onCancelar} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">Cancelar</button>
      </div>
    </div>
  );
}
