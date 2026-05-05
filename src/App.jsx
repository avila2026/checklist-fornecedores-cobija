import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Plus, Phone, MapPin, Trash2, Edit2, Save, Search, Download, MessageCircle, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Settings } from 'lucide-react';

const LIMIAR_VERIFICADO = 0.6;

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
  { id: 10, nome: 'Importaciones Anita', contato: '+591 67044465', avaliacao: 'N/D', endereco: 'Calle La Paz, frente à Gobernación, Cobija', tipo: 'Importadora', atacado: 'Indício médio', prioridade: 'Média', obs: 'Lead de importadora. Consultar produtos importados.', checks: {}, status: 'pendente', notas: '' }
];

const checksPadrao = [
  { id: 'contatado', label: '📞 Contatado' },
  { id: 'catalogoRecebido', label: '📋 Catálogo recebido' },
  { id: 'precoVolume', label: '💰 Preço por volume' },
  { id: 'fotosEstoque', label: '📸 Fotos do estoque' },
  { id: 'marcasConfirmadas', label: '🏷️ Marcas confirmadas' },
  { id: 'originalidade', label: '✅ Originalidade verificada' },
  { id: 'visitado', label: '🚶 Loja visitada' },
  { id: 'comprou', label: '🛒 Compra realizada' }
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
  // Inicialização síncrona via lazy useState — sem useEffect, sem loading state
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
  const [editandoId, setEditandoId] = useState(null);
  const [expandidoId, setExpandidoId] = useState(null);
  const [showMensagem, setShowMensagem] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [editandoMensagem, setEditandoMensagem] = useState(false);
  const [novoCheck, setNovoCheck] = useState('');
  const [mensagemCopiada, setMensagemCopiada] = useState(false);
  const [novoForn, setNovoForn] = useState({ nome: '', contato: '', endereco: '', tipo: '', atacado: 'Baixo', prioridade: 'Média', obs: '' });
  const [editForm, setEditForm] = useState({});
  const [erroSalvar, setErroSalvar] = useState(null);
  const [confirmarRemocao, setConfirmarRemocao] = useState(null);

  const debounceNotas = useRef(null);
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

  const calcStatus = useCallback((checks) => {
    const total = Object.values(checks).filter(Boolean).length;
    if (checks.comprou) return 'aprovado';
    if (total >= Math.ceil(checkItems.length * LIMIAR_VERIFICADO)) return 'verificado';
    if (total >= 1) return 'em_andamento';
    return 'pendente';
  }, [checkItems]);

  const toggleCheck = (id, key) => {
    const novos = fornecedores.map(f => {
      if (f.id === id) {
        const novosChecks = { ...f.checks, [key]: !f.checks[key] };
        return { ...f, checks: novosChecks, status: calcStatus(novosChecks) };
      }
      return f;
    });
    salvar(novos);
  };

  const adicionar = () => {
    if (!novoForn.nome.trim()) return;
    const novo = { id: crypto.randomUUID(), ...novoForn, avaliacao: 'N/D', checks: {}, status: 'pendente', notas: '' };
    salvar([...fornecedores, novo]);
    setNovoForn({ nome: '', contato: '', endereco: '', tipo: '', atacado: 'Baixo', prioridade: 'Média', obs: '' });
    setShowForm(false);
  };

  const remover = (id) => {
    setConfirmarRemocao({ tipo: 'fornecedor', id, mensagem: 'Remover este fornecedor?' });
  };

  const iniciarEdicao = (f) => {
    setEditandoId(f.id);
    setEditForm({ ...f });
    setExpandidoId(f.id);
  };

  const salvarEdicao = () => {
    const novos = fornecedores.map(f => f.id === editandoId ? { ...editForm } : f);
    salvar(novos);
    setEditandoId(null);
    setEditForm({});
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditForm({});
  };

  const atualizarNotas = (id, notas) => {
    const novos = fornecedores.map(f => f.id === id ? { ...f, notas } : f);
    setFornecedores(novos);
    clearTimeout(debounceNotas.current);
    debounceNotas.current = setTimeout(() => {
      try { localStorage.setItem('dados', JSON.stringify(novos)); }
      catch (e) { console.error(e); mostrarErro('Erro ao salvar notas.'); }
    }, 400);
  };

  const adicionarCheck = () => {
    if (!novoCheck.trim()) return;
    const id = 'custom_' + crypto.randomUUID();
    salvarChecks([...checkItems, { id, label: novoCheck }]);
    setNovoCheck('');
  };

  const editarCheckLabel = (id, novoLabel) => {
    const novos = checkItems.map(c => c.id === id ? { ...c, label: novoLabel } : c);
    setCheckItems(novos);
    clearTimeout(debounceLabel.current);
    debounceLabel.current = setTimeout(() => {
      try { localStorage.setItem('checks', JSON.stringify(novos)); }
      catch (e) { console.error(e); mostrarErro('Erro ao salvar checklist.'); }
    }, 400);
  };

  const removerCheck = (id) => {
    setConfirmarRemocao({ tipo: 'check', id, mensagem: 'Remover este item de verificação? Os marcadores existentes serão removidos.' });
  };

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

  const copiarMensagem = () => {
    navigator.clipboard.writeText(mensagemWA);
    setMensagemCopiada(true);
    setTimeout(() => setMensagemCopiada(false), 2000);
  };

  const abrirWhatsApp = (contato) => {
    if (!contato) return;
    const numero = contato.replace(/\D/g, '');
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagemWA)}`, '_blank');
  };

  const abrirMaps = (endereco) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(endereco + ' Cobija Bolivia')}`, '_blank');
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

  const corPrioridade = (p) => p === 'Alta' ? 'bg-red-100 text-red-700 border-red-200' : p === 'Média' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200';
  const corStatus = (s) => s === 'aprovado' ? 'bg-green-500 text-white' : s === 'verificado' ? 'bg-blue-500 text-white' : s === 'em_andamento' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700';
  const labelStatus = (s) => ({ aprovado: '✓ Aprovado', verificado: 'Verificado', em_andamento: 'Em andamento', pendente: 'Pendente' }[s] || s);

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
            <button onClick={() => setShowConfig(!showConfig)} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg">
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
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-3">
            <h3 className="font-semibold text-indigo-900 mb-3 text-sm">⚙️ Configurar itens do checklist</h3>
            <div className="space-y-2 mb-3">
              {checkItems.map((c, i) => (
                <div key={c.id} className="flex gap-2 items-center bg-white rounded-lg p-2 border border-indigo-100">
                  <span className="text-xs text-indigo-400 w-6">{i + 1}.</span>
                  <input className="flex-1 text-sm outline-none" value={c.label} onChange={e => editarCheckLabel(c.id, e.target.value)} />
                  <button onClick={() => removerCheck(c.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 border border-indigo-200 rounded-lg px-3 py-2 text-sm" placeholder="Novo item de verificação (ex: 🧾 NF emitida)" value={novoCheck} onChange={e => setNovoCheck(e.target.value)} onKeyDown={e => e.key === 'Enter' && adicionarCheck()} />
              <button onClick={adicionarCheck} className="bg-indigo-600 text-white px-4 rounded-lg text-sm hover:bg-indigo-700">Adicionar</button>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-3 flex-wrap">
          <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-800">
            <Plus size={16} /> Novo fornecedor
          </button>
          <button onClick={() => setShowMensagem(!showMensagem)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-green-700">
            <MessageCircle size={16} /> Mensagem WhatsApp
          </button>
          <button onClick={exportarJSON} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-50">
            <Download size={16} /> Exportar
          </button>
        </div>

        {showMensagem && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
            <div className="flex items-start justify-between mb-2 gap-2">
              <h3 className="font-semibold text-green-900 text-sm">Mensagem padrão (editável)</h3>
              <div className="flex gap-2">
                <button onClick={() => setEditandoMensagem(!editandoMensagem)} className="text-xs bg-white border border-green-300 text-green-700 px-3 py-1 rounded hover:bg-green-50">
                  {editandoMensagem ? 'Concluir' : '✏️ Editar'}
                </button>
                <button onClick={copiarMensagem} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  {mensagemCopiada ? '✓ Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
            {editandoMensagem ? (
              <textarea className="w-full text-xs text-green-900 bg-white p-3 rounded border border-green-300 font-sans resize-y" rows={14} value={mensagemWA} onChange={e => salvarMensagem(e.target.value)} />
            ) : (
              <pre className="text-xs text-green-900 whitespace-pre-wrap font-sans bg-white p-3 rounded border border-green-200">{mensagemWA}</pre>
            )}
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3">Adicionar novo fornecedor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Nome do comércio*" value={novoForn.nome} onChange={e => setNovoForn({ ...novoForn, nome: e.target.value })} />
              <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Contato (+591...)" value={novoForn.contato} onChange={e => setNovoForn({ ...novoForn, contato: e.target.value })} />
              <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:col-span-2" placeholder="Endereço" value={novoForn.endereco} onChange={e => setNovoForn({ ...novoForn, endereco: e.target.value })} />
              <input className="border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Tipo (perfumaria, cosméticos...)" value={novoForn.tipo} onChange={e => setNovoForn({ ...novoForn, tipo: e.target.value })} />
              <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm" value={novoForn.prioridade} onChange={e => setNovoForn({ ...novoForn, prioridade: e.target.value })}>
                <option>Alta</option><option>Média</option><option>Baixa</option>
              </select>
              <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm" value={novoForn.atacado} onChange={e => setNovoForn({ ...novoForn, atacado: e.target.value })}>
                <option>Indício forte</option><option>Indício médio</option><option>Baixo a médio</option><option>Baixo</option><option>Não confirmado</option>
              </select>
              <textarea className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:col-span-2" placeholder="Observações" rows={2} value={novoForn.obs} onChange={e => setNovoForn({ ...novoForn, obs: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={adicionar} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Adicionar</button>
              <button onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">Cancelar</button>
            </div>
          </div>
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
          {filtrados.map(f => {
            const totalChecks = Object.values(f.checks || {}).filter(Boolean).length;
            const progresso = checkItems.length > 0 ? (totalChecks / checkItems.length) * 100 : 0;
            const expandido = expandidoId === f.id;
            const editando = editandoId === f.id;
            return (
              <div key={f.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="p-4">
                  {editando ? (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 text-sm">✏️ Editando fornecedor</h3>
                        <div className="flex gap-2">
                          <button onClick={salvarEdicao} className="bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-green-700"><Save size={12} /> Salvar</button>
                          <button onClick={cancelarEdicao} className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs hover:bg-slate-300">Cancelar</button>
                        </div>
                      </div>
                      <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm font-medium" placeholder="Nome" value={editForm.nome || ''} onChange={e => setEditForm({ ...editForm, nome: e.target.value })} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input className="border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Contato" value={editForm.contato || ''} onChange={e => setEditForm({ ...editForm, contato: e.target.value })} />
                        <input className="border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Tipo" value={editForm.tipo || ''} onChange={e => setEditForm({ ...editForm, tipo: e.target.value })} />
                      </div>
                      <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Endereço" value={editForm.endereco || ''} onChange={e => setEditForm({ ...editForm, endereco: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <select className="border border-slate-300 rounded px-2 py-1.5 text-sm" value={editForm.prioridade || 'Média'} onChange={e => setEditForm({ ...editForm, prioridade: e.target.value })}>
                          <option>Alta</option><option>Média</option><option>Baixa</option>
                        </select>
                        <select className="border border-slate-300 rounded px-2 py-1.5 text-sm" value={editForm.atacado || 'Baixo'} onChange={e => setEditForm({ ...editForm, atacado: e.target.value })}>
                          <option>Indício forte</option><option>Indício médio</option><option>Baixo a médio</option><option>Baixo</option><option>Não confirmado</option>
                        </select>
                      </div>
                      <input className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Avaliação" value={editForm.avaliacao || ''} onChange={e => setEditForm({ ...editForm, avaliacao: e.target.value })} />
                      <textarea className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" placeholder="Observações" rows={2} value={editForm.obs || ''} onChange={e => setEditForm({ ...editForm, obs: e.target.value })} />
                      <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm" value={editForm.status || 'pendente'} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
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
                          <button onClick={() => iniciarEdicao(f)} className="text-slate-400 hover:text-blue-600 p-1" title="Editar"><Edit2 size={16} /></button>
                          <button onClick={() => remover(f.id)} className="text-slate-400 hover:text-red-500 p-1" title="Remover"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-slate-600 mb-3">
                        {f.contato && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <button onClick={() => abrirWhatsApp(f.contato)} className="text-green-700 hover:underline font-medium">{f.contato}</button>
                          </div>
                        )}
                        {f.endereco && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <button onClick={() => abrirMaps(f.endereco)} className="text-blue-700 hover:underline text-left">{f.endereco}</button>
                          </div>
                        )}
                        {f.atacado && f.atacado !== 'N/D' && <div className="text-xs text-slate-500">Atacado: <span className="font-medium">{f.atacado}</span></div>}
                      </div>

                      {f.obs && <p className="text-xs text-slate-500 italic mb-3 bg-slate-50 p-2 rounded">{f.obs}</p>}
                    </>
                  )}

                  {!editando && (
                    <button onClick={() => setExpandidoId(expandido ? null : f.id)} className="w-full flex items-center justify-between text-xs text-slate-500 mb-2 hover:text-slate-700">
                      <span>Verificação ({totalChecks}/{checkItems.length})</span>
                      {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}

                  {!editando && (
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          totalChecks === checkItems.length && checkItems.length > 0 ? 'bg-green-500'
                          : totalChecks >= Math.ceil(checkItems.length * LIMIAR_VERIFICADO) ? 'bg-blue-500'
                          : totalChecks >= 1 ? 'bg-yellow-500'
                          : 'bg-slate-300'
                        }`}
                        style={{ width: `${progresso}%` }}
                      />
                    </div>
                  )}

                  {(expandido || editando) && (
                    <>
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        {checkItems.map(item => (
                          <button key={item.id} onClick={() => toggleCheck(f.id, item.id)} className={`text-left text-xs px-2 py-1.5 rounded border transition ${f.checks?.[item.id] ? 'bg-green-50 border-green-300 text-green-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <span className="inline-flex items-center gap-1.5">
                              {f.checks?.[item.id] ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-300"></div>}
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      <textarea className="w-full text-xs border border-slate-200 rounded p-2 resize-none focus:outline-none focus:border-slate-400" placeholder="Notas pessoais (preços cotados, marcas vistas, observações da visita...)" rows={2} value={f.notas || ''} onChange={e => atualizarNotas(f.id, e.target.value)} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
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
