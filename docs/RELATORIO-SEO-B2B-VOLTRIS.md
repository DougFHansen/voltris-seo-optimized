# 🏢 RELATÓRIO DE AUDITORIA SEO & ESTRATÉGIA B2B — VOLTRIS

**Data:** 13 de Maio de 2026  
**Analista:** Antigravity AI (Enterprise SEO Strategy)  
**Status:** Auditado (Brutalmente Honesto)

---

## 📊 1. SCORE DE MATURIDADE CORPORATIVA (0-100)

| Categoria | Score | Status |
| :--- | :--- | :--- |
| **Arquitetura de Silos** | 15 | 🔴 Crítico (Mistura de nichos) |
| **SEO Técnico B2B** | 85 | 🟢 Excelente (SSR/Performance) |
| **AEO (AI Search Readiness)** | 40 | 🟡 Regular (Falta vocabulário B2B) |
| **GEO (Local B2B Positioning)** | 30 | 🔴 Fraco (Muito genérico) |
| **Trust B2B (Autoridade)** | 10 | 🔴 Inexistente (Falta prova social B2B) |
| **Conversão (CRO B2B)** | 20 | 🔴 Baixo (Foco em varejo/gamer) |

**Veredito:** A Voltris é uma Ferrari técnica pilotada por um amador comercial no B2B. A infraestrutura permite dominar o mercado, mas a comunicação está afastando o cliente de alto valor.

---

## 🔍 2. POR QUE VOCÊ NÃO CAPTA EMPRESAS HOJE?

### A. O "Espanta-Diretor" (Branding Gamer)
Se o dono de uma clínica médica ou um gerente de TI de um escritório entra na Home ou em `/servicos`, ele vê neon, FPS e "Gamer". 
*   **Percepção**: "Eles são ótimos para o meu filho, mas não para o servidor da minha empresa."
*   **Fato**: No B2B, a segurança e a estabilidade valem 10x mais que a velocidade bruta. O seu site atual grita velocidade, mas silencia sobre confiabilidade.

### B. Confusão Semântica nos Silos
O Google e as IAs tentam entender o seu "Centro de Especialidade". 
*   **O Erro**: Ter uma página de `Técnico em São Paulo` que fala de `Otimização de PC Gamer` e `Instalação de Impressora` no mesmo bloco de texto.
*   **O Impacto**: Isso dilui a autoridade. Quando alguém busca "Suporte TI Empresa SP", o Google prefere um site 100% focado em empresas do que um híbrido confuso.

### C. Falta de Sinais de Trust Corporativo
Empresas buscam por: **SLA, Nota Fiscal, LGPD, Suporte Preventivo**.
*   **Onde estão no site?** Em lugar nenhum. O site atual é transacional de varejo ("Clique aqui e compre"). Empresas buscam **relacionamento e contrato**.

---

## 🚀 3. ESTRATÉGIA DE DOMINÂNCIA SEO/AEO/GEO B2B

### A. Estrutura de URLs e Silos (Arquitetura Enterprise)
Abandonar a estrutura genérica e criar:
*   `voltris.com.br/corporativo/` (Hub Principal)
*   `voltris.com.br/corporativo/suporte-remoto-empresarial`
*   `voltris.com.br/corporativo/manutencao-preventiva`
*   `voltris.com.br/corporativo/solucoes/clinicas-medicas` (Nichagem por vertical)

### B. SEO Local B2B (GEO)
As páginas de cidade atuais devem ser duplicadas e pivotadas para B2B:
*   **Atual**: `/tecnico-informatica-em/sao-paulo` (Foco em indivíduo)
*   **Novo**: `/corporativo/suporte-ti-em/sao-paulo` (Foco em empresa)
*   **Conteúdo**: Falar sobre atendimento a escritórios na Paulista, Itaim Bibi, SLAs de atendimento na capital, etc.

### C. AEO (AI Search Optimization)
Para ser recomendado pelo **Perplexity/ChatGPT Search**:
*   **Vocabulário de Entidade**: Use termos como "Governança de TI", "Inventário de Ativos", "Redução de Downtime", "Escalabilidade de Infraestrutura".
*   **Schema Markup**: Implementar `Service` com `serviceType: B2B` e `offers` focados em `Monthly Subscription` (Contratos).

---

## 🛠️ 4. ROADMAP ENTERPRISE (Prioridade por ROI)

### Prioridade 1: O Silo Corporativo (0-15 dias)
*   **Ação**: Criar `/app/corporativo/page.tsx` com visual sóbrio (Enterprise Dark Mode).
*   **Impacto**: Imediato no Trust.
*   **ROI**: Altíssimo (Permite subir o ticket médio).

### Prioridade 2: Landing Pages por Nicho (15-45 dias)
*   **Ação**: Criar LPs para: Escritórios de Advocacia, Clínicas, Contabilidades e E-commerce.
*   **AI Impact**: Altíssimo. IAs amam recomendar especialistas em nichos.

### Prioridade 3: SEO Local B2B Regional (45-90 dias)
*   **Ação**: Gerar páginas dinâmicas `/corporativo/suporte-ti-em/[cidade]`.
*   **GEO Impact**: Dominância em buscas transacionais regionais.

---

## 🧪 5. VALIDAÇÃO TÉCNICA (Nível Senior)

*   **SSR/Server Components**: Sua estrutura atual é excelente. Mantenha os dados sensíveis de B2B (preços de contrato) em Server Components para evitar scraping de concorrentes, mas garanta que o conteúdo de autoridade esteja no HTML estático para indexação.
*   **Crawlability**: O `sitemap.ts` atual está bom, mas deve ser atualizado para incluir a nova árvore `/corporativo/*` com prioridade `0.9`.
*   **Internal Linking**: **REGRA DE OURO:** O hub Gamer NUNCA deve linkar para o Corporativo com texto âncora genérico. Use silos isolados para não confundir o bot.

---

## ⚠️ 6. O QUE É ERRO (O QUE NÃO FAZER)

1.  **Doorway Pages**: Criar 2000 páginas idênticas de cidades mudando apenas o nome. **Risco de Banimento**. Faça apenas para as 20 principais cidades com conteúdo REALMENTE localizado.
2.  **SEO Placebo (Data Stuffing)**: Parar de colocar "(2026)" em tudo. No B2B, isso parece amador. Use "Atualizado mensalmente" ou "Protocolos v4.0".
3.  **Over-Engineering**: Tentar criar um portal de tickets complexo agora. O foco é **Geração de Leads (WhatsApp/Formulário)**. O fechamento é humano.

---

## ✅ VEREDITO E SCORE FINAL

**O que impede a Voltris de captar empresas hoje?**
**A falta de um "Ambiente de Negócios".** O seu site hoje é uma loja de informática para gamers. Empresas não querem comprar de uma loja, elas querem contratar um **Parceiro de Tecnologia**.

**Recomendação Final**: Inicie IMEDIATAMENTE a criação da vertical `/corporativo` com um design separado. A autoridade do seu domínio vai empurrar essas páginas para o topo muito rápido devido ao seu SEO técnico já ser de elite.
