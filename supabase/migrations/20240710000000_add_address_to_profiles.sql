-- Adiciona o campo address na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text; 