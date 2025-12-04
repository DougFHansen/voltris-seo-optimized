-- Função melhorada com mais logs e tratamento de erros
-- Execute no SQL Editor do Supabase

-- 1. Remover a função antiga
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Criar função melhorada com logs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Log do início da execução
    RAISE LOG 'handle_new_user: Iniciando criação de perfil para usuário %', new.id;
    
    -- Verificar se o usuário já tem perfil
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
        RAISE LOG 'handle_new_user: Usuário % já tem perfil, pulando criação', new.id;
        RETURN new;
    END IF;
    
    -- Tentar criar o perfil
    BEGIN
        INSERT INTO public.profiles (id, full_name, created_at, updated_at)
        VALUES (
            new.id, 
            COALESCE(new.raw_user_meta_data->>'full_name', new.email),
            NOW(),
            NOW()
        );
        
        RAISE LOG 'handle_new_user: Perfil criado com sucesso para usuário %', new.id;
        
    EXCEPTION WHEN OTHERS THEN
        -- Log do erro
        RAISE LOG 'handle_new_user: ERRO ao criar perfil para usuário %: %', new.id, SQLERRM;
        
        -- Tentar inserção mais simples se falhar
        BEGIN
            INSERT INTO public.profiles (id, full_name)
            VALUES (new.id, new.email);
            
            RAISE LOG 'handle_new_user: Perfil criado com fallback para usuário %', new.id;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE LOG 'handle_new_user: ERRO FATAL ao criar perfil para usuário %: %', new.id, SQLERRM;
            -- Não falhar o processo de autenticação
        END;
    END;
    
    RETURN new;
END;
$$;

-- 3. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verificar se foi criado
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 5. Verificar se o trigger foi criado
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
