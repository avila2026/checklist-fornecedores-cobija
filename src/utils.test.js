import { describe, it, expect } from 'vitest';
import { calcStatus, corPrioridade, corStatus, labelStatus, LIMIAR_VERIFICADO, checksPadrao } from './utils.js';

const items = checksPadrao; // 8 itens; limiar = ceil(8 * 0.6) = 5

describe('LIMIAR_VERIFICADO', () => {
  it('é 0.6', () => expect(LIMIAR_VERIFICADO).toBe(0.6));
});

describe('calcStatus', () => {
  it('pendente quando sem checks', () => {
    expect(calcStatus({}, items)).toBe('pendente');
  });

  it('em_andamento com 1 check', () => {
    expect(calcStatus({ contatado: true }, items)).toBe('em_andamento');
  });

  it('em_andamento com 4 checks (abaixo do limiar)', () => {
    const checks = { contatado: true, catalogoRecebido: true, precoVolume: true, fotosEstoque: true };
    expect(calcStatus(checks, items)).toBe('em_andamento');
  });

  it('verificado com 5 checks (limiar exato: ceil(8*0.6)=5)', () => {
    const checks = {
      contatado: true, catalogoRecebido: true, precoVolume: true,
      fotosEstoque: true, marcasConfirmadas: true,
    };
    expect(calcStatus(checks, items)).toBe('verificado');
  });

  it('aprovado quando comprou=true, independente dos demais', () => {
    expect(calcStatus({ comprou: true }, items)).toBe('aprovado');
  });

  it('aprovado prevalece sobre verificado', () => {
    const checks = {
      contatado: true, catalogoRecebido: true, precoVolume: true,
      fotosEstoque: true, marcasConfirmadas: true, comprou: true,
    };
    expect(calcStatus(checks, items)).toBe('aprovado');
  });

  it('false não conta como marcado', () => {
    expect(calcStatus({ contatado: false, catalogoRecebido: false }, items)).toBe('pendente');
  });

  it('funciona com lista de checks vazia (0 itens)', () => {
    expect(calcStatus({}, [])).toBe('pendente');
  });
});

describe('corPrioridade', () => {
  it('Alta → classes vermelhas', () => {
    expect(corPrioridade('Alta')).toContain('red');
  });

  it('Média → classes amarelas', () => {
    expect(corPrioridade('Média')).toContain('yellow');
  });

  it('Baixa → classes cinzas', () => {
    expect(corPrioridade('Baixa')).toContain('gray');
  });

  it('valor desconhecido → classes cinzas', () => {
    expect(corPrioridade('')).toContain('gray');
  });
});

describe('corStatus', () => {
  it('aprovado → verde', () => expect(corStatus('aprovado')).toContain('green'));
  it('verificado → azul', () => expect(corStatus('verificado')).toContain('blue'));
  it('em_andamento → amarelo', () => expect(corStatus('em_andamento')).toContain('yellow'));
  it('pendente → cinza', () => expect(corStatus('pendente')).toContain('gray'));
  it('valor desconhecido → cinza', () => expect(corStatus('')).toContain('gray'));
});

describe('labelStatus', () => {
  it('aprovado → "✓ Aprovado"', () => expect(labelStatus('aprovado')).toBe('✓ Aprovado'));
  it('verificado → "Verificado"', () => expect(labelStatus('verificado')).toBe('Verificado'));
  it('em_andamento → "Em andamento"', () => expect(labelStatus('em_andamento')).toBe('Em andamento'));
  it('pendente → "Pendente"', () => expect(labelStatus('pendente')).toBe('Pendente'));
  it('valor desconhecido → retorna o próprio valor', () => expect(labelStatus('outro')).toBe('outro'));
});
