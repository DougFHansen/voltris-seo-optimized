-- Adiciona campos de status para bloqueio e exclusão lógica de usuários
alter table public.profiles add column if not exists is_blocked boolean not null default false;
alter table public.profiles add column if not exists is_deleted boolean not null default false; 