-- Debug: Verificar estrutura da tabela profiles
-- Execute no SQL Editor do Supabase

-- 1. Verificar se a tabela profiles existe e sua estrutura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se há dados na tabela profiles
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- 3. Verificar se há constraints NOT NULL que possam estar falhando
SELECT 
    constraint_name,
    constraint_type,
    table_name,
    column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'profiles' 
AND tc.constraint_type IN ('NOT NULL', 'CHECK');

-- 4. Verificar se há políticas RLS que possam estar bloqueando
SELECT 
    policyname,
    tablename,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. Verificar se há triggers na tabela profiles
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- 6. Testar inserção manual simples (ATENÇÃO: execute apenas se souber o que está fazendo)
/*
-- Teste com dados mínimos
INSERT INTO public.profiles (id, full_name) 
VALUES ('11111111-1111-1111-1111-111111111111', 'TESTE_OAUTH')
ON CONFLICT (id) DO NOTHING;

-- Verificar se foi inserido
SELECT * FROM public.profiles WHERE id = '11111111-1111-1111-1111-111111111111';

-- Remover o teste
DELETE FROM public.profiles WHERE id = '11111111-1111-1111-1111-111111111111';
*/
