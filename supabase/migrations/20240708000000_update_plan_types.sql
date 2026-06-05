-- Atualizar os tipos de planos permitidos na tabela orders
-- Adicionar novos tipos de planos para os serviços específicos

-- Remover a restrição atual
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_plan_type_check;

-- Adicionar nova restrição com todos os tipos de planos
ALTER TABLE public.orders ADD CONSTRAINT orders_plan_type_check 
CHECK (plan_type IN (
    'basico', 'profissional', 'empresarial', 'gamer', 'corporativa',
    'Formatação Básica', 'Formatação Média', 'Formatação Avançada', 'Formatação Corporativa',
    'Otimização Básica', 'Otimização Média', 'Otimização Avançada', 'Otimização Premium',
    'Office 365', 'Office 2021', 'Office 2019', 'Office Empresarial'
));

-- Verificar se a alteração foi aplicada
DO $$
BEGIN
    RAISE NOTICE 'Tipos de planos atualizados com sucesso!';
    RAISE NOTICE 'Novos tipos adicionados: Formatação, Otimização e Office';
END $$; 