export const LIMIAR_VERIFICADO = 0.6;

export const checksPadrao = [
  { id: 'contatado', label: '📞 Contatado' },
  { id: 'catalogoRecebido', label: '📋 Catálogo recebido' },
  { id: 'precoVolume', label: '💰 Preço por volume' },
  { id: 'fotosEstoque', label: '📸 Fotos do estoque' },
  { id: 'marcasConfirmadas', label: '🏷️ Marcas confirmadas' },
  { id: 'originalidade', label: '✅ Originalidade verificada' },
  { id: 'visitado', label: '🚶 Loja visitada' },
  { id: 'comprou', label: '🛒 Compra realizada' },
];

export function calcStatus(checks, checkItems) {
  const total = Object.values(checks).filter(Boolean).length;
  if (checks.comprou) return 'aprovado';
  if (checkItems.length > 0 && total >= Math.ceil(checkItems.length * LIMIAR_VERIFICADO)) return 'verificado';
  if (total >= 1) return 'em_andamento';
  return 'pendente';
}

export function corPrioridade(p) {
  if (p === 'Alta') return 'bg-red-100 text-red-700 border-red-200';
  if (p === 'Média') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
}

export function corStatus(s) {
  if (s === 'aprovado') return 'bg-green-500 text-white';
  if (s === 'verificado') return 'bg-blue-500 text-white';
  if (s === 'em_andamento') return 'bg-yellow-500 text-white';
  return 'bg-gray-300 text-gray-700';
}

export function labelStatus(s) {
  return { aprovado: '✓ Aprovado', verificado: 'Verificado', em_andamento: 'Em andamento', pendente: 'Pendente' }[s] || s;
}
