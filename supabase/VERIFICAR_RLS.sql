-- Execute este SQL no Supabase Dashboard para verificar as políticas RLS atuais

-- 1. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'installations';

-- 2. Listar todas as políticas da tabela installations
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'installations'
ORDER BY policyname;

-- 3. Verificar se existem registros na tabela
SELECT 
    id,
    user_id,
    app_version,
    cpu_name,
    last_heartbeat,
    created_at,
    updated_at
FROM installations
ORDER BY updated_at DESC
LIMIT 10;

-- 4. Verificar se existe o registro específico
SELECT 
    id,
    user_id,
    app_version,
    cpu_name,
    os_name,
    last_heartbeat,
    created_at,
    updated_at
FROM installations
WHERE id = 'DC045D24-F4A2-4B77-8046-0A7CD04A2B0C';

-- 5. Contar instalações por user_id
SELECT 
    user_id,
    COUNT(*) as total
FROM installations
GROUP BY user_id
ORDER BY total DESC;
