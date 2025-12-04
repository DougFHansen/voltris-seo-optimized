import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, category } = await request.json();

    if (!topic || !category) {
      return NextResponse.json(
        { error: 'Tópico e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'API key do Gemini não configurada' },
        { status: 500 }
      );
    }

    // Prompt para gerar o post
    const prompt = `
      Atue como um redator sênior especialista em produção de conteúdo estratégico para blogs de alto desempenho e SEO avançado. Crie um artigo de altíssima qualidade, envolvente e perfeitamente estruturado sobre o tema: "${topic}" na categoria "${category}". Siga cada diretriz abaixo com rigor para garantir um resultado excepcional, digno das principais plataformas de conteúdo digital:

1.  **Estrutura e Organização:**
   - Utilize cabeçalhos hierárquicos (<h1>, <h2>, <h3>) para organizar as seções com lógica e fluidez, facilitando a navegação do leitor e a indexação pelos mecanismos de busca.
   - Divida o texto em parágrafos curtos e bem balanceados, com espaçamento adequado para leitura rápida e escaneabilidade.
   - Inclua listas ordenadas (<ol>) e não ordenadas (<ul>, <li>) para destacar pontos essenciais de maneira clara e visualmente atraente.
   - Aplique frases de transição e conectores sofisticados para garantir uma narrativa coesa e harmoniosa entre os tópicos.

2.  **Qualidade e Linguagem:**
   - Redija uma introdução magnética que desperte a curiosidade e engaje o leitor desde a primeira linha.
   - Conclua com um fechamento impactante e memorável, reforçando a mensagem central e incentivando a ação ou reflexão.
   - Adote uma linguagem profissional, fluida e natural, com tom adaptável ao público-alvo (informal sofisticado ou técnico, conforme o contexto).
   - Integre palavras-chave estratégicas de forma orgânica e distribuída, evitando sobrecarga, para maximizar a performance em SEO.

3.  **Especificações de Conteúdo:**
   - Gere um título altamente otimizado para SEO (máximo 60 caracteres) que seja ao mesmo tempo descritivo e chamativo.
   - Crie um resumo (excerpt) irresistível e conciso com até 160 caracteres para atrair cliques em mecanismos de busca e redes sociais.
   - Desenvolva o corpo do artigo com pelo menos 800 palavras, mantendo a narrativa envolvente do início ao fim.
   - Apresente de 3 a 5 tags relevantes e estrategicamente escolhidas para facilitar a categorização e indexação.
   - Descreva uma imagem representativa do tema com riqueza de detalhes visuais (cenário, objetos, cores, estilo), evitando descrições genéricas. Gere essa descrição em inglês, curta, composta apenas por palavras-chave separadas por vírgula, para busca no Unsplash. Não use frases completas. Exemplo: "computer, repair, tools, desk, technology, office".

4.  **Restrições Técnicas:**
   - Não inclua as tags <html>, <head>, <meta> ou <body>.
   - Utilize exclusivamente tags de conteúdo: <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>.

5.  **Formato da Saída:**
   - Responda exclusivamente em formato JSON com as seguintes chaves:
     - "title": Título SEO otimizado
     - "excerpt": Resumo atrativo
     - "content": Corpo completo do artigo com formatação adequada
     - "tags": Lista com 3-5 palavras-chave relevantes
     - "image_description": Descrição detalhada da imagem representativa
    `;

    // Chamada para a API do Gemini (modelo atualizado)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na API do Gemini:', errorData);
      return NextResponse.json(
        { error: 'Erro ao gerar conteúdo com IA' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Tentar extrair JSON da resposta
    let parsedContent;
    try {
      // Procurar por JSON na resposta
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        // Se não encontrar JSON, criar estrutura manual
        const lines = generatedText.split('\n');
        parsedContent = {
          title: lines.find((line: string) => line.includes('Título'))?.replace(/.*Título[:\s]*/, '').trim() || `Post sobre ${topic}`,
          excerpt: lines.find((line: string) => line.includes('Resumo'))?.replace(/.*Resumo[:\s]*/, '').trim() || `Aprenda sobre ${topic}`,
          content: generatedText,
          tags: [category, topic.toLowerCase()],
          imageDescription: `Imagem relacionada a ${topic}`
        };
      }
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      // Fallback se não conseguir fazer parse
      parsedContent = {
        title: `Post sobre ${topic}`,
        excerpt: `Aprenda sobre ${topic} e suas melhores práticas`,
        content: generatedText,
        tags: [category, topic.toLowerCase()],
        imageDescription: `Imagem relacionada a ${topic}`
      };
    }

    return NextResponse.json(parsedContent);

  } catch (error) {
    console.error('Erro ao gerar post:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 