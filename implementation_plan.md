# Implementation Plan - Bing SEO & IndexNow

## Goal
Achieve 100% compliance with Bing Webmaster Tools requirements, specifically fixing sitemap issues, duplicate metadata, and implementing IndexNow.

## User Review Required
> [!IMPORTANT]
> The IndexNow API Key will be generated and placed in `public/`. This key must be submitted to Bing Webmaster Tools once manually if not already done, though the automatic submission will help subsequently.

## Proposed Changes

### 1. Sitemap (`app/sitemap.ts`)
- **Action:** Refine the recursive file scanning to ensuring strictly only public pages are included.
- **Fix:** Explicitly filter out `admin`, `dashboard`, `auth`.
- **Validation:** Check the output array ensures all `guias/*` are present.

### 2. IndexNow
- **Key Generation:** Generate a random 32-char hex key.
- **File:** `public/[key].txt` containing the key.
- **Endpoint:** `app/api/indexnow/route.ts` to allow triggering index updates programmatically.

### 3. Metadata (Titles & Descriptions)
- **Problem:** Many pages likely copy-pasted generic metadata.
- **Solution:**
    - **Services:** Update `app/todos-os-servicos/*/page.tsx` to have specific, action-oriented titles/descriptions.
    - **Guides:** Update `app/guias/*/page.tsx`. Use a consistent pattern: `[Tópico] - Guia Completo | VOLTRIS`.
    - **Landing Pages:** Verify `criar-site`, `criadores-de-site`, `voltrisoptimizer` are unique.

### 4. Backlinks Plan
- Deliver a strategy document in `RELATORIO_BING_SEO.md`.

## Verification Plan
### Automated Tests
- Run `npm run build` to ensure type safety.
- Use `grep` to verify no duplicate descriptions exist in `app/`.

### Manual Verification
- Review `sitemap.xml` route logic.
- Verify IndexNow endpoint response.
