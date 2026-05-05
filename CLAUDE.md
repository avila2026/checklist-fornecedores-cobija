# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:3000 (auto-opens browser)
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

No test runner or linter is configured.

## Architecture

This is a single-page React app. The entire application logic lives in one file: `src/App.jsx`. There are no routes, no additional components, and no state management library.

**Stack:** React 18 · Vite 4 · Tailwind CSS 3 · lucide-react icons

### Data model

Each supplier (`fornecedor`) has this shape:
```js
{
  id: number,
  nome: string,
  contato: string,      // phone number with country code (+591...)
  avaliacao: string,
  endereco: string,
  tipo: string,
  atacado: string,      // wholesale indicator: 'Indício forte' | 'Indício médio' | 'Baixo a médio' | 'Baixo' | 'Não confirmado'
  prioridade: string,   // 'Alta' | 'Média' | 'Baixa'
  obs: string,
  checks: Record<string, boolean>,  // keyed by checkItem.id
  status: string,       // 'pendente' | 'em_andamento' | 'verificado' | 'aprovado'
  notas: string
}
```

### Status auto-computation

`calcStatus(checks)` in `App.jsx:92` derives status automatically from check completion:
- `comprou` checked → `'aprovado'`
- ≥ 60% of check items checked → `'verificado'`
- ≥ 1 checked → `'em_andamento'`
- otherwise → `'pendente'`

Status can be overridden manually via the edit form.

### Storage abstraction (`window.storage`)

The app uses an async `window.storage` API instead of `localStorage` directly. This API is **not** provided by browsers natively — it was designed for a platform that injects this shim (e.g. Replit). In a standard browser environment the `try/catch` blocks fall back to initial data, meaning **persistence does not work in production as-is**.

There are 7 call sites across `src/App.jsx`:
- **3 reads** (`window.storage.get(key)`) inside `carregar` (the `useEffect` loader) — returns a promise resolving to `{value: string}`; the actual data is read via `.value`
- **4 writes** (`window.storage.set(key, value)`) — one in `carregar` (initial seed), and one each in `salvar`, `salvarChecks`, and `salvarMensagem`

The three storage keys are: `'dados'` (supplier list), `'checks'` (checklist items), `'mensagem'` (WhatsApp template).

To migrate to `localStorage`, note the API differences:
- `window.storage.get(key)` is **async**, returns `{value: string}` — replace with synchronous `localStorage.getItem(key)` which returns the string directly (drop the `await` and change `result.value` to just `result`)
- `window.storage.set(key, val)` is **async** — replace with synchronous `localStorage.setItem(key, val)` (drop the `await`; the `carregar` function can then be simplified or made synchronous)

## Deployment

The app deploys to two targets:

- **GitHub Pages** – CI in `.github/workflows/deploy.yml` triggers on push to `main`. Uses `GITHUB_PAGES=true` env var so Vite sets `base: '/checklist-fornecedores-cobija/'`.
- **Vercel** – configured via `vercel.json` with SPA rewrite fallback. Uses `base: '/'`.

When building for GitHub Pages locally, set the env var: `GITHUB_PAGES=true npm run build`.

## Language

The codebase and UI are in Brazilian Portuguese. Variable names, function names, comments, and UI strings should remain in Portuguese.
