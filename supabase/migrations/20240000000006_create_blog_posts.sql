-- =====================================================
-- CRIAÇÃO DAS TABELAS BLOG_POSTS E COMMENTS - VOLTRIS
-- =====================================================

-- =====================================================
-- 1. TABELA DE COMENTÁRIOS
-- =====================================================

-- Dropar a tabela antiga de comentários, se existir
DROP TABLE IF EXISTS comments;

-- Criar a nova tabela de comentários
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  aprovado boolean DEFAULT false,
  parent_id uuid REFERENCES comments(id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_aprovado ON comments(aprovado);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Adicionar restrição para garantir que um comentário não pode ser pai de si mesmo
ALTER TABLE comments ADD CONSTRAINT check_parent_id_not_self 
CHECK (parent_id IS NULL OR parent_id != id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Política para leitura de comentários aprovados (público)
CREATE POLICY "Permitir leitura de comentários aprovados"
  ON comments FOR SELECT
  TO public
  USING (aprovado = true);

-- Política para inserção de novos comentários (público)
CREATE POLICY "Permitir inserção de comentários"
  ON comments FOR INSERT
  TO public
  WITH CHECK (true);

-- =====================================================
-- 2. TABELA BLOG_POSTS
-- =====================================================

-- Criar tabela blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    author TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    slug TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_title ON blog_posts USING gin(to_tsvector('portuguese', title));
CREATE INDEX IF NOT EXISTS idx_blog_posts_content ON blog_posts USING gin(to_tsvector('portuguese', content));
CREATE INDEX IF NOT EXISTS idx_blog_posts_excerpt ON blog_posts USING gin(to_tsvector('portuguese', excerpt));

-- Trigger para updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. POLÍTICAS RLS PARA BLOG_POSTS
-- =====================================================

-- Permitir leitura para todos (posts públicos)
CREATE POLICY "Blog posts are viewable by everyone"
    ON blog_posts FOR SELECT
    USING (true);

-- Permitir inserção apenas para usuários autenticados (admin)
CREATE POLICY "Authenticated users can insert blog posts"
    ON blog_posts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Permitir atualização apenas para usuários autenticados (admin)
CREATE POLICY "Authenticated users can update blog posts"
    ON blog_posts FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Permitir exclusão apenas para usuários autenticados (admin)
CREATE POLICY "Authenticated users can delete blog posts"
    ON blog_posts FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. FUNÇÃO PARA BUSCA FULL-TEXT
-- =====================================================

CREATE OR REPLACE FUNCTION search_blog_posts(search_query TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    category TEXT,
    tags TEXT[],
    date TIMESTAMPTZ,
    author TEXT,
    featured BOOLEAN,
    slug TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id,
        bp.title,
        bp.excerpt,
        bp.content,
        bp.cover_image,
        bp.category,
        bp.tags,
        bp.date,
        bp.author,
        bp.featured,
        bp.slug,
        bp.created_at,
        bp.updated_at,
        ts_rank(
            to_tsvector('portuguese', COALESCE(bp.title, '') || ' ' || COALESCE(bp.excerpt, '') || ' ' || COALESCE(bp.content, '')),
            plainto_tsquery('portuguese', search_query)
        ) as rank
    FROM blog_posts bp
    WHERE 
        to_tsvector('portuguese', COALESCE(bp.title, '') || ' ' || COALESCE(bp.excerpt, '') || ' ' || COALESCE(bp.content, '')) @@ plainto_tsquery('portuguese', search_query)
        OR bp.title ILIKE '%' || search_query || '%'
        OR bp.excerpt ILIKE '%' || search_query || '%'
        OR bp.content ILIKE '%' || search_query || '%'
        OR bp.author ILIKE '%' || search_query || '%'
        OR bp.category ILIKE '%' || search_query || '%'
        OR bp.tags::TEXT ILIKE '%' || search_query || '%'
    ORDER BY rank DESC, bp.date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. CONCEDER PERMISSÕES
-- =====================================================

GRANT EXECUTE ON FUNCTION search_blog_posts(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_blog_posts(TEXT) TO anon;

-- =====================================================
-- 6. COMENTÁRIOS NAS TABELAS
-- =====================================================

-- Comentários para blog_posts
COMMENT ON TABLE blog_posts IS 'Tabela para armazenar posts do blog criados pelo painel administrativo';
COMMENT ON COLUMN blog_posts.title IS 'Título do post';
COMMENT ON COLUMN blog_posts.excerpt IS 'Resumo/descrição curta do post';
COMMENT ON COLUMN blog_posts.content IS 'Conteúdo completo do post (HTML/Markdown)';
COMMENT ON COLUMN blog_posts.cover_image IS 'URL da imagem de capa';
COMMENT ON COLUMN blog_posts.category IS 'Categoria do post';
COMMENT ON COLUMN blog_posts.tags IS 'Array de tags do post';
COMMENT ON COLUMN blog_posts.date IS 'Data de publicação';
COMMENT ON COLUMN blog_posts.author IS 'Autor do post';
COMMENT ON COLUMN blog_posts.featured IS 'Se o post é destaque';
COMMENT ON COLUMN blog_posts.slug IS 'Slug único para URL do post';

-- Comentários para comments
COMMENT ON TABLE comments IS 'Tabela para armazenar comentários dos posts do blog';
COMMENT ON COLUMN comments.post_slug IS 'Slug do post ao qual o comentário pertence';
COMMENT ON COLUMN comments.name IS 'Nome do autor do comentário';
COMMENT ON COLUMN comments.email IS 'Email do autor do comentário';
COMMENT ON COLUMN comments.comment IS 'Conteúdo do comentário';
COMMENT ON COLUMN comments.created_at IS 'Data de criação do comentário';
COMMENT ON COLUMN comments.aprovado IS 'Se o comentário foi aprovado para exibição';
COMMENT ON COLUMN comments.parent_id IS 'ID do comentário pai (para respostas)'; 