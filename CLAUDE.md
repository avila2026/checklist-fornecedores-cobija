# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## Comandos

```bash
npm install        # instala as dependências
npm run dev        # servidor de desenvolvimento em http://localhost:3000 (abre o navegador automaticamente)
npm run build      # build de produção → dist/
npm run preview    # visualiza o build de produção localmente
```

Nenhum test runner ou linter está configurado.

## Arquitetura

Este é um aplicativo React de página única. Toda a lógica da aplicação está em um único arquivo: `src/App.jsx`. Não há rotas, componentes adicionais nem biblioteca de gerenciamento de estado.

**Stack:** React 18 · Vite 4 · Tailwind CSS 3 · lucide-react icons

### Modelo de dados

Cada fornecedor (`fornecedor`) tem a seguinte estrutura:
```js
{
  id: number,
  nome: string,
  contato: string,      // telefone com código do país (+591...)
  avaliacao: string,
  endereco: string,
  tipo: string,
  atacado: string,      // indicador de atacado: 'Indício forte' | 'Indício médio' | 'Baixo a médio' | 'Baixo' | 'Não confirmado'
  prioridade: string,   // 'Alta' | 'Média' | 'Baixa'
  obs: string,
  checks: Record<string, boolean>,  // chave: id do item de checklist
  status: string,       // 'pendente' | 'em_andamento' | 'verificado' | 'aprovado'
  notas: string
}
```

### Cálculo automático de status

`calcStatus(checks)` em `App.jsx:92` deriva o status automaticamente com base nos itens marcados:
- `comprou` marcado → `'aprovado'`
- ≥ 60% dos itens marcados → `'verificado'`
- ≥ 1 item marcado → `'em_andamento'`
- caso contrário → `'pendente'`

O status também pode ser definido manualmente pelo formulário de edição.

### Abstração de armazenamento (`window.storage`)

O app utiliza uma API assíncrona `window.storage` em vez de `localStorage` diretamente. Essa API **não** é fornecida nativamente pelos navegadores — foi projetada para uma plataforma que injeta esse shim (ex.: Replit). Em um navegador padrão, os blocos `try/catch` fazem fallback para os dados iniciais, o que significa que **a persistência não funciona na produção no estado atual**.

Há 7 pontos de uso em `src/App.jsx`:
- **3 leituras** (`window.storage.get(key)`) dentro de `carregar` (o loader do `useEffect`) — retorna uma Promise resolvida em `{value: string}`; o dado real é lido via `.value`
- **4 escritas** (`window.storage.set(key, value)`) — uma em `carregar` (seed inicial) e uma em cada uma das funções `salvar`, `salvarChecks` e `salvarMensagem`

As três chaves de armazenamento são: `'dados'` (lista de fornecedores), `'checks'` (itens do checklist), `'mensagem'` (template do WhatsApp).

Para migrar para `localStorage`, observe as diferenças de API:
- `window.storage.get(key)` é **assíncrono** e retorna `{value: string}` — substituir por `localStorage.getItem(key)`, que é síncrono e retorna a string diretamente (remover o `await` e trocar `result.value` por `result`)
- `window.storage.set(key, val)` é **assíncrono** — substituir por `localStorage.setItem(key, val)` (remover o `await`; a função `carregar` pode ser simplificada ou tornar-se síncrona)

## Deploy

O app é publicado em dois destinos:

- **GitHub Pages** – CI em `.github/workflows/deploy.yml` é acionado a cada push na branch `main`. Usa a variável de ambiente `GITHUB_PAGES=true` para que o Vite defina `base: '/checklist-fornecedores-cobija/'`.
- **Vercel** – configurado via `vercel.json` com rewrite de fallback para SPA. Usa `base: '/'`.

Para gerar o build do GitHub Pages localmente, defina a variável: `GITHUB_PAGES=true npm run build`.

## Idioma

O código-fonte e a interface estão em português brasileiro. Nomes de variáveis, funções, comentários e textos da UI devem permanecer em português.
