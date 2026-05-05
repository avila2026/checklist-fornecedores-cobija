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

Este é um aplicativo React de página única (PWA). Toda a lógica da aplicação está em um único arquivo: `src/App.jsx`. Não há rotas, componentes adicionais nem biblioteca de gerenciamento de estado.

**Stack:** React 18 · Vite 4 · Tailwind CSS 3 · lucide-react · vite-plugin-pwa

### Modelo de dados

Cada fornecedor (`fornecedor`) tem a seguinte estrutura:
```js
{
  id: string,           // crypto.randomUUID()
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

`calcStatus(checks)` em `App.jsx` deriva o status automaticamente com base nos itens marcados. O limiar de 60% é definido pela constante `LIMIAR_VERIFICADO = 0.6` no topo do arquivo:
- `comprou` marcado → `'aprovado'`
- ≥ 60% dos itens marcados → `'verificado'`
- ≥ 1 item marcado → `'em_andamento'`
- caso contrário → `'pendente'`

O status também pode ser definido manualmente pelo formulário de edição.

### Persistência (`localStorage`)

O app usa `localStorage` diretamente com inicialização síncrona via lazy `useState` — sem `useEffect` de carregamento. As três chaves são: `'dados'` (fornecedores), `'checks'` (itens do checklist), `'mensagem'` (template do WhatsApp).

Gravações frequentes (notas e labels de check) são debounced em 400ms para evitar serialização do JSON a cada tecla digitada. Falhas de gravação (ex.: modo privado com quota zero) exibem um banner vermelho temporário no topo da tela.

## PWA

O app é uma PWA instalável configurada em `vite.config.js` via `vite-plugin-pwa`. O Service Worker (gerado pelo Workbox) faz cache de todos os assets estáticos para funcionamento offline. Os ícones ficam em `public/icon-192.png` e `public/icon-512.png`.

## Deploy

O app é publicado em dois destinos:

- **GitHub Pages** – CI em `.github/workflows/deploy.yml` é acionado a cada push na branch `main`. Usa a variável de ambiente `GITHUB_PAGES=true` para que o Vite defina `base: '/checklist-fornecedores-cobija/'`.
- **Vercel** – configurado via `vercel.json` com rewrite de fallback para SPA. Usa `base: '/'`.

Para gerar o build do GitHub Pages localmente: `GITHUB_PAGES=true npm run build`.

## Idioma

O código-fonte e a interface estão em português brasileiro. Nomes de variáveis, funções, comentários e textos da UI devem permanecer em português.
