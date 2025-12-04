import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    console.log('Descrição recebida:', description);

    if (!description) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      );
    }

    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
    console.log('UNSPLASH_ACCESS_KEY:', unsplashAccessKey);
    
    if (!unsplashAccessKey) {
      return NextResponse.json(
        { error: 'API key do Unsplash não configurada' },
        { status: 500 }
      );
    }

    // Buscar múltiplas imagens no Unsplash
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(description)}&orientation=landscape&per_page=5&client_id=${unsplashAccessKey}`,
      {
        headers: {
          'Accept-Version': 'v1'
        }
      }
    );

    const data = await response.json();
    console.log('Resposta da API do Unsplash:', data);

    if (!response.ok) {
      console.error('Erro na API do Unsplash:', data);
      return NextResponse.json(
        { error: 'Erro ao buscar imagem', details: data },
        { status: 500 }
      );
    }

    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma imagem encontrada para a descrição fornecida.', details: data },
        { status: 404 }
      );
    }

    // Montar array de imagens
    const images = data.results.map((img: any) => ({
      imageUrl: img.urls.regular,
      thumbUrl: img.urls.thumb,
      downloadUrl: img.links.download,
      photographer: img.user.name,
      photographerUrl: img.user.links.html
    }));

    return NextResponse.json({ images });

  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
} 