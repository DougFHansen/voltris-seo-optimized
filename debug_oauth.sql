-- Debug OAuth - Investigar problema mais profundamente
-- Execute no SQL Editor do Supabase

-- 1. Verificar se a tabela profiles tem a estrutura correta
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se há políticas RLS que possam estar bloqueando
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

-- 3. Verificar se a função handle_new_user está funcionando
-- Teste manual da função
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 4. Verificar se há erros nos logs do Supabase
-- (Isso pode não estar disponível na interface gratuita)

-- 5. Testar inserção manual para ver se há problemas de permissão
-- ATENÇÃO: Execute apenas se souber o que está fazendo
/*
INSERT INTO public.profiles (id, full_name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'TESTE')
ON CONFLICT (id) DO NOTHING;

-- Depois remova o teste
DELETE FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000000';
*/

-- 6. Verificar se há constraints que possam estar falhando
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'profiles';

-- 7. Verificar se há triggers conflitantes
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
OR event_object_table = 'profiles';
