-- SOLUÇÃO FINAL: Função robusta para criar perfis automaticamente
-- Execute no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar se a tabela profiles tem as colunas necessárias
-- Se não tiver, vamos criar uma versão mínima
DO $$
BEGIN
    -- Verificar se a tabela profiles existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Criar tabela profiles se não existir
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY,
            full_name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Habilitar RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Criar políticas básicas
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
        
        RAISE LOG 'Tabela profiles criada automaticamente';
    END IF;
    
    -- Verificar se a coluna full_name existe, se não, adicionar
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
        RAISE LOG 'Coluna full_name adicionada automaticamente';
    END IF;
    
    -- Verificar se as colunas de timestamp existem, se não, adicionar
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE LOG 'Coluna created_at adicionada automaticamente';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE LOG 'Coluna updated_at adicionada automaticamente';
    END IF;
END $$;

-- 2. Agora vamos criar uma função super robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_exists BOOLEAN;
    insert_success BOOLEAN := FALSE;
BEGIN
    -- Log do início
    RAISE LOG 'handle_new_user: Iniciando para usuário %', new.id;
    
    -- Verificar se o perfil já existe
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = new.id) INTO profile_exists;
    
    IF profile_exists THEN
        RAISE LOG 'handle_new_user: Usuário % já tem perfil, pulando', new.id;
        RETURN new;
    END IF;
    
    -- Tentar inserção com dados completos
    BEGIN
        INSERT INTO public.profiles (id, full_name, created_at, updated_at)
        VALUES (
            new.id, 
            COALESCE(new.raw_user_meta_data->>'full_name', new.email, 'Usuário'),
            NOW(),
            NOW()
        );
        insert_success := TRUE;
        RAISE LOG 'handle_new_user: Perfil criado com sucesso para usuário %', new.id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user: Erro na inserção completa para usuário %: %', new.id, SQLERRM;
        
        -- Tentar inserção mínima
        BEGIN
            INSERT INTO public.profiles (id, full_name)
            VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email, 'Usuário'));
            insert_success := TRUE;
            RAISE LOG 'handle_new_user: Perfil criado com fallback para usuário %', new.id;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE LOG 'handle_new_user: ERRO FATAL para usuário %: %', new.id, SQLERRM;
            
            -- Última tentativa: apenas ID
            BEGIN
                INSERT INTO public.profiles (id)
                VALUES (new.id);
                insert_success := TRUE;
                RAISE LOG 'handle_new_user: Perfil criado apenas com ID para usuário %', new.id;
                
            EXCEPTION WHEN OTHERS THEN
                RAISE LOG 'handle_new_user: FALHA TOTAL para usuário %: %', new.id, SQLERRM;
                -- Não falhar o processo de autenticação
            END;
        END;
    END;
    
    IF insert_success THEN
        RAISE LOG 'handle_new_user: Sucesso para usuário %', new.id;
    ELSE
        RAISE LOG 'handle_new_user: Falha total para usuário %', new.id;
    END IF;
    
    RETURN new;
END;
$$;

-- 3. Recriar o trigger (removendo o antigo primeiro)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verificar se tudo foi criado
SELECT 'Função criada:' as status, routine_name, routine_type FROM information_schema.routines WHERE routine_name = 'handle_new_user';
SELECT 'Trigger criado:' as status, trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
SELECT 'Tabela profiles:' as status, COUNT(*) as total_rows FROM public.profiles;
