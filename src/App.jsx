import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Plus, Download, MessageCircle, Search, AlertCircle, Settings } from 'lucide-react';
import { checksPadrao, calcStatus as calcStatusFn } from './utils.js';
import PainelMensagem from './PainelMensagem.jsx';
import PainelConfig from './PainelConfig.jsx';
import FormularioFornecedor from './FormularioFornecedor.jsx';
import FornecedorCard from './FornecedorCard.jsx';

const fornecedoresIniciais = [
  { id: 1, nome: 'Perfumeria Bolivia Shop / Bolivia Shop', contato: '+591 67660440', avaliacao: 'N/D', endereco: 'Calle Santa Cruz 56, Cobija', tipo: 'Perfumaria / importados', atacado: 'Indício médio', prioridade: 'Alta', obs: 'Um dos melhores leads. Indícios de perfumes importados e WhatsApp.', checks: {}, status: 'pendente', notas: '' },
  { id: 2, nome: 'La Bodega de Mena SRL', contato: '+591 72925277', avaliacao: 'N/D', endereco: 'Puerto Cobija', tipo: 'Perfumes importados', atacado: 'Indício médio', prioridade: 'Alta', obs: 'Lead associado a perfumes importados em Cobija. Confirmar estoque real.', checks: {}, status: 'pendente', notas: '' },
  { id: 3, nome: 'Perfumes Europeos', contato: '+591 72917349', avaliacao: 'N/D', endereco: 'Shopping Center PB, Cobija', tipo: 'Perfumes / beleza', atacado: 'Baixo a médio', prioridade: 'Alta', obs: 'Lead direto de perfumaria. Pedir preço para 10, 20 e 50 unidades.', checks: {}, status: 'pendente', notas: '' },
  { id: 4, nome: 'NuevoMundo Cobija', contato: '', avaliacao: 'N/D', endereco: 'Calle Sta. Cruz No. 54, Cobija', tipo: 'Cosméticos / acessórios', atacado: 'Baixo', prioridade: 'Alta', obs: 'Confirmar se vende perfumes/body splash e preço para revendedor.', checks: {}, status: 'pendente', notas: '' },
  { id: 5, nome: 'AcreCorp', contato: '+591 64999332', avaliacao: 'N/D', endereco: 'Tcnl. Enrique Fernandez Cornejo 73, Cobija', tipo: 'Importados / multicategoria', atacado: 'Indício forte', prioridade: 'Média', obs: 'Muito interessante como importadora. Venda por mayor e menor.', checks: {}, status: 'pendente', notas: '' },
  { id: 6, nome: 'Diana Perfumeria, Cosméticos y Accesorios', contato: '+591 77524580', avaliacao: '5.0 / 1 avaliação', endereco: 'Cobija', tipo: 'Perfumaria / cosméticos', atacado: 'Baixo', prioridade: 'Média', obs: 'Aparece com Natura e Avon. Útil para cotação secundária.', checks: {}, status: 'pendente', notas: '' },
  { id: 7, nome: "Punto Yanbal, Esika, L'Bel y Cyzone", contato: '+591 75107389', avaliacao: 'N/D', endereco: 'X6JV+JF2, 11 de Octubre, Cobija', tipo: 'Beleza / catálogo', atacado: 'Baixo', prioridade: 'Média', obs: 'Cosméticos de marcas conhecidas. Confirmar margem para revenda.', checks: {}, status: 'pendente', notas: '' },
  { id: 8, nome: 'Yanbal - Lourdes Sobrino Pereira', contato: '+591 69562500', avaliacao: 'N/D', endereco: 'Avenida Chelio Luna Pizarro, Cobija', tipo: 'Produtos de beleza', atacado: 'Baixo', prioridade: 'Média', obs: 'Confirmar entrega, preço por volume e itens mais vendidos.', checks: {}, status: 'pendente', notas: '' },
  { id: 9, nome: 'Pink and Pink', contato: '+591 68993776', avaliacao: '5.0 / 1 avaliação', endereco: 'Calle Ayacucho, terceira loja entrando pela 9 de Febrero', tipo: 'Beleza / possível cosméticos', atacado: 'Baixo', prioridade: 'Média', obs: 'Lead secundário. Precisa confirmar mix de produtos.', checks: {}, status: 'pendente', notas: '' },
  { id: 10, nome: 'Importaciones Anita', contato: '+591 67044465', avaliacao: 'N/D', endereco: 'Calle La Paz, frente à Gobernación, Cobija', tipo: 'Importadora', atacado: 'Indício médio', prioridade: 'Média', obs: 'Lead de importadora. Consultar produtos importados.', checks: {}, status: 'pendente', notas: '' },
];

const mensagemPadrao = `Hola, buenas tardes. Estoy buscando proveedores en Cobija para comprar perfumes, body splash y cosméticos por cantidad.

¿Ustedes trabajan con venta al por mayor o precio para revendedores?

Me puede enviar:
1. Catálogo o fotos de productos disponibles
2. Lista de precios
3. Cantidad mínima para precio mayorista
4. Marcas disponibles
5. Si los productos son originales/importados
6. Ubicación de la tienda en Cobija

Gracias.`;

export default function App() {
  const [fornecedores, setFornecedores] = useState(() => {
    try {
      const dados = localStorage.getItem('dados');
      if (!dados) localStorage.setItem('dados', JSON.stringify(fornecedoresIniciais));
      return dados ? JSON.parse(dados) : fornecedoresIniciais;
    } catch { return fornecedoresIniciais; }
  });
  const [checkItems, setCheckItems] = useState(() => {
    try {
      const checks = localStorage.getItem('checks');
      return checks ? JSON.parse(checks) : checksPadrao;
    } catch { return checksPadrao; }
  });
  const [mensagemWA, setMensagemWA] = useState(() => {
    try { return localStorage.getItem('mensagem') || mensagemPadrao; }
    catch { return mensagemPadrao; }
  });

  const [busca, setBusca] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [showMensagem, setShowMensagem] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);
  const [confirmarRemocao, setConfirmarRemocao] = useState(null);

  const debounceLabel = useRef(null);
  const debounceMsg = useRef(null);
  const erroTimer = useRef(null);

  const mostrarErro = useCallback((msg) => {
    setErroSalvar(msg);
    clearTimeout(erroTimer.current);
    erroTimer.current = setTimeout(() => setErroSalvar(null), 4000);
  }, []);

  const salvar = useCallback((novosDados) => {
    setFornecedores(novosDados);
    try { localStorage.setItem('dados', JSON.stringify(novosDados)); }
    catch (e) { console.error(e); mostrarErro('Erro ao salvar. Armazenamento indisponível.'); }
  }, [mostrarErro]);

  const salvarChecks = useCallback((novos) => {
    setCheckItems(novos);
    try { localStorage.setItem('checks', JSON.stringify(novos)); }
    catch (e) { console.error(e); mostrarErro('Erro ao salvar checklist.'); }
  }, [mostrarErro]);

  const salvarMensagem = useCallback((msg) => {
    setMensagemWA(msg);
    clearTimeout(debounceMsg.current);
    debounceMsg.current = setTimeout(() => {
      try { localStorage.setItem('mensagem', msg); }
      catch (e) { console.error(e); mostrarErro('Erro ao salvar mensagem.'); }
    }, 400);
  }, [mostrarErro]);

  const calcStatus = useCallback((checks) => calcStatusFn(checks, checkItems), [checkItems]);

  const toggleCheck = useCallback((id, key) => {
    const novos = fornecedores.map(f => {
      if (f.id !== id) return f;
      const novosChecks = { ...f.checks, [key]: !f.checks[key] };
      return { ...f, checks: novosChecks, status: calcStatus(novosChecks) };
    });
    salvar(novos);
  }, [fornecedores, calcStatus, salvar]);

  const adicionar = useCallback((formData) => {
    const novo = { id: crypto.randomUUID(), ...formData, avaliacao: 'N/D', checks: {}, status: 'pendente', notas: '' };
    salvar([...fornecedores, novo]);
    setShowForm(false);
  }, [fornecedores, salvar]);

  const salvarEdicao = useCallback((editForm) => {
    salvar(fornecedores.map(f => f.id === editForm.id ? { ...editForm } : f));
  }, [fornecedores, salvar]);

  const remover = useCallback((id) => {
    setConfirmarRemocao({ tipo: 'fornecedor', id, mensagem: 'Remover este fornecedor?' });
  }, []);

  const atualizarNotas = useCallback((id, notas) => {
    const novos = fornecedores.map(f => f.id === id ? { ...f, notas } : f);
    setFornecedores(novos);
    try { localStorage.setItem('dados', JSON.stringify(novos)); }
    catch (e) { console.error(e); mostrarErro('Erro ao salvar notas.'); }
  }, [fornecedores, mostrarErro]);

  const adicionarCheck = useCallback((label) => {
    salvarChecks([...checkItems, { id: 'custom_' + crypto.randomUUID(), label }]);
  }, [checkItems, salvarChecks]);

  const editarCheckLabel = useCallback((id, novoLabel) => {
    const novos = checkItems.map(c => c.id === id ? { ...c, label: novoLabel } : c);
    setCheckItems(novos);
    clearTimeout(debounceLabel.current);
    debounceLabel.current = setTimeout(() => {
      try { localStorage.setItem('checks', JSON.stringify(novos)); }
      catch (e) { console.error(e); mostrarErro('Erro ao salvar checklist.'); }
    }, 400);
  }, [checkItems, mostrarErro]);

  const removerCheck = useCallback((id) => {
    setConfirmarRemocao({ tipo: 'check', id, mensagem: 'Remover este item de verificação? Os marcadores existentes serão removidos.' });
  }, []);

  const confirmarRemocaoExecutar = () => {
    if (!confirmarRemocao) return;
    if (confirmarRemocao.tipo === 'fornecedor') {
      salvar(fornecedores.filter(f => f.id !== confirmarRemocao.id));
    } else {
      salvarChecks(checkItems.filter(c => c.id !== confirmarRemocao.id));
    }
    setConfirmarRemocao(null);
  };

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify({ fornecedores, checkItems, mensagemWA }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fornecedores-cobija-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const filtrados = useMemo(
    () => fornecedores.filter(f => {
      const matchBusca = f.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (f.tipo || '').toLowerCase().includes(busca.toLowerCase()) ||
        (f.endereco || '').toLowerCase().includes(busca.toLowerCase());
      const matchPri = filtroPrioridade === 'todas' || f.prioridade === filtroPrioridade;
      const matchStatus = filtroStatus === 'todos' || f.status === filtroStatus;
      return matchBusca && matchPri && matchStatus;
    }),
    [fornecedores, busca, filtroPrioridade, filtroStatus]
  );

  const stats = useMemo(() => ({
    total: fornecedores.length,
    aprovados: fornecedores.filter(f => f.status === 'aprovado').length,
    verificados: fornecedores.filter(f => f.status === 'verificado').length,
    emAndamento: fornecedores.filter(f => f.status === 'em_andamento').length,
    pendentes: fornecedores.filter(f => f.status === 'pendente').length,
  }), [fornecedores]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {erroSalvar && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 text-center text-sm z-50 shadow-lg">
          ⚠️ {erroSalvar}
        </div>
      )}

      {confirmarRemocao && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 flex items-center justify-between shadow-lg z-50">
          <span className="text-sm font-medium">{confirmarRemocao.mensagem}</span>
          <div className="flex gap-2 ml-4 shrink-0">
            <button onClick={confirmarRemocaoExecutar} className="bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-red-50">Confirmar</button>
            <button onClick={() => setConfirmarRemocao(null)} className="border border-red-400 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-5 sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold">🛍️ Fornecedores Cobija</h1>
            <button onClick={() => setShowConfig(s => !s)} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg">
              <Settings size={16} />
            </button>
          </div>
          <p className="text-slate-300 text-sm">Checklist de verificação de comércios</p>
          <div className="grid grid-cols-5 gap-2 mt-4 text-xs">
            <div className="bg-white/10 rounded-lg p-2 text-center"><div className="font-bold text-lg">{stats.total}</div><div className="opacity-80">Total</div></div>
            <div className="bg-green-500/20 rounded-lg p-2 text-center"><div className="font-bold text-lg">{stats.aprovados}</div><div className="opacity-80">Aprovados</div></div>
            <div className="bg-blue-500/20 rounded-lg p-2 text-center"><div className="font-bold text-lg">{stats.verificados}</div><div className="opacity-80">Verificados</div></div>
            <div className="bg-yellow-500/20 rounded-lg p-2 text-center"><div className="font-bold text-lg">{stats.emAndamento}</div><div className="opacity-80">Andamento</div></div>
            <div className="bg-gray-500/20 rounded-lg p-2 text-center"><div className="font-bold text-lg">{stats.pendentes}</div><div className="opacity-80">Pendentes</div></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        {showConfig && (
          <PainelConfig
            checkItems={checkItems}
            onEditarLabel={editarCheckLabel}
            onRemoverCheck={removerCheck}
            onAdicionarCheck={adicionarCheck}
          />
        )}

        <div className="flex gap-2 mb-3 flex-wrap">
          <button onClick={() => setShowForm(s => !s)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-800">
            <Plus size={16} /> Novo fornecedor
          </button>
          <button onClick={() => setShowMensagem(s => !s)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-green-700">
            <MessageCircle size={16} /> Mensagem WhatsApp
          </button>
          <button onClick={exportarJSON} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-50">
            <Download size={16} /> Exportar
          </button>
        </div>

        {showMensagem && (
          <PainelMensagem mensagemWA={mensagemWA} onMensagemChange={salvarMensagem} />
        )}

        {showForm && (
          <FormularioFornecedor onAdicionar={adicionar} onCancelar={() => setShowForm(false)} />
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-3 mb-3 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={16} className="text-slate-400" />
            <input className="flex-1 outline-none text-sm" placeholder="Buscar por nome, tipo ou endereço..." value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
          <select className="border border-slate-300 rounded-lg px-3 py-1 text-sm" value={filtroPrioridade} onChange={e => setFiltroPrioridade(e.target.value)}>
            <option value="todas">Todas prioridades</option><option>Alta</option><option>Média</option><option>Baixa</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-1 text-sm" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="todos">Todos status</option>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em andamento</option>
            <option value="verificado">Verificado</option>
            <option value="aprovado">Aprovado</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtrados.map(f => (
            <FornecedorCard
              key={f.id}
              f={f}
              checkItems={checkItems}
              mensagemWA={mensagemWA}
              onToggleCheck={toggleCheck}
              onSalvarEdicao={salvarEdicao}
              onRemover={remover}
              onAtualizarNotas={atualizarNotas}
            />
          ))}
          {filtrados.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
              Nenhum fornecedor encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
