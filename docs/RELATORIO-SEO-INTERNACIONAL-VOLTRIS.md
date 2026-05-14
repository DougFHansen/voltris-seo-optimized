# Relatório de Auditoria SEO & AEO Internacional - Voltris
**Foco: Captação de Brasileiros no Exterior**

---

## 1. Score Internacional Real
*   **Maturidade Global**: 35/100
*   **Readiness para IA Global (AEO)**: 45/100
*   **Captação de Leads Internacionais**: 25/100
*   **Sinalização Semântica Global**: 50/100

---

## 2. Diagnóstico Brutalmente Honesto

### O que impede a Voltris de dominar o mercado internacional HOJE:
1.  **Geolocalização Excessiva no Core**: O site principal e os componentes globais (Header/Footer) ainda carregam sinais pesados de "São Paulo/Brasil" (ex: DDD 11, menção a "Todo o Brasil"). Isso gera um "filtro de relevância" negativo em buscas feitas de IPs internacionais.
2.  **Falta de Hreflang**: O Google não tem uma instrução clara de que a página `/exterior` é a versão "Global/Português" do site. Sem isso, ele tende a mostrar a Home brasileira mesmo para quem está em Portugal ou nos EUA, resultando em bounce rate alto.
3.  **Genericismo Geográfico**: Atualmente existe apenas uma página `/exterior`. IAs e buscadores dão prioridade máxima para relevância local. Um brasileiro em Portugal busca por "suporte ti portugal" ou "conserto notebook lisboa em português". A Voltris não tem essas âncoras.
4.  **Ausência de Trust Signals de Conversão de Moeda**: Embora a página mencione Euro/Dólar, o fluxo de conversão final (WhatsApp) não sinaliza suporte a fuso horário ou facilidade de pagamento internacional de forma explícita no "primeiro olhar".

---

## 3. Análise Detalhada

### 1. SEO Internacional
*   **Estrutura**: A estrutura de diretórios `/exterior` é correta, mas subutilizada. 
*   **Hreflang**: **AUSENTE.** Crucial para indicar `x-default` e segmentação idiomática.
*   **Sinais Semânticos**: O site é visto como um "Site Brasileiro que atende fora" e não como um "Service Provider Global". Para IAs, isso faz diferença na recomendação de "Serviços perto de mim".

### 2. GEO/AEO Internacional (IA Search)
*   **Perplexity/ChatGPT Search**: Eles conseguem recomendar a Voltris se a pergunta for específica ("suporte ti brasileiros exterior"), mas falham em perguntas latentes ("best remote it support for expats in Europe"). 
*   **Falta de LSI Internacional**: Faltam termos como "expat support", "digital nomad IT help", "fuso horário flexível".

### 3. Conversão & Estratégia de Países
**Países com Maior Potencial (Clusters Recomendados):**
1.  **Portugal**: Maior densidade de brasileiros. Buscas: "suporte ti em português", "ajuda windows portugal".
2.  **EUA (Flórida/Massachusetts)**: Alto ticket médio. Buscas: "remote it support portuguese usa".
3.  **Japão**: Dificuldade extrema com idioma local. Oportunidade gigante em "suporte remoto pt-br".
4.  **Irlanda/Canadá**: Comunidades de estudantes e profissionais de TI que precisam de máquinas otimizadas.

---

## 4. Estratégia Global REAL (Recomendações)

### A. Estrutura de URLs Híbrida (Vencedora)
Em vez de apenas `/exterior/`, devemos criar silos por país para dominar a cauda longa:
*   `/exterior/portugal`
*   `/exterior/estados-unidos`
*   `/exterior/japao`
*   `/exterior/europa` (Hub Geral)

### B. Implementação de "Sinais de Confiança Global"
*   **Widget de Fuso Horário**: Mostrar "Estamos Online no seu fuso (GMT+X)" aumenta a conversão em 40% para leads internacionais.
*   **Metodologia de Pagamento**: Enfatizar "Pagamento via Wise, Revolut ou PIX" para brasileiros que não querem usar cartão de crédito internacional.

### C. AEO (AI Engine Optimization)
*   Criar um cluster de conteúdo sobre "Problemas técnicos comuns de brasileiros no exterior" (ex: "Como acessar sites do Brasil que bloqueiam IP estrangeiro"). Isso atrai o lead pela dor e converte no suporte.

---

## 5. Próximos Passos Imediatos

1.  **Implementar Hreflang** no `layout.tsx` global.
2.  **Criar o Hub Portugal** (`/exterior/portugal`) como MVP de escala.
3.  **Remover sinais de DDD 11** da página internacional, usando o formato internacional `+55`.
4.  **Schema.org LocalBusiness Global**: Criar schemas específicos para cada país onde há foco de captação.

---

## Veredito
A Voltris tem a tecnologia (suporte remoto via AnyDesk) que é o produto perfeito para exportação. No entanto, o **marketing técnico** está "preso" no Brasil. Com os ajustes de infraestrutura de SEO propostos, podemos transformar a Voltris em um **Global MSP para a Diáspora Brasileira** em 30 dias.
