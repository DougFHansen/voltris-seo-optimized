-- Create services table (atualizada para estrutura existente)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    duration INTEGER NOT NULL CHECK (duration > 0), -- Duration in minutes
    status service_status NOT NULL DEFAULT 'active',
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies for services
CREATE POLICY "Services are viewable by everyone"
    ON public.services FOR SELECT
    USING (status = 'active');

CREATE POLICY "Services can be managed by authenticated users"
    ON public.services FOR ALL
    USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some default services (apenas se a tabela estiver vazia)
INSERT INTO public.services (name, description, price, duration, status) VALUES
('Criação de Site Básico', 'Site institucional com até 5 páginas, design responsivo e SEO básico', 299.00, 480, 'active'),
('Criação de Site Profissional', 'Site completo com até 10 páginas, blog integrado e SEO avançado', 599.00, 720, 'active'),
('Criação de Site Empresarial', 'Site corporativo com e-commerce, painel administrativo e suporte premium', 1299.00, 1440, 'active'),
('Instalação de Programas', 'Instalação e configuração de programas no Windows', 49.00, 60, 'active'),
('Suporte Windows', 'Suporte técnico para Windows, otimização e manutenção', 79.00, 120, 'active'),
('Otimização de Sistema', 'Limpeza, otimização e aceleração do Windows', 99.00, 90, 'active')
ON CONFLICT DO NOTHING; 