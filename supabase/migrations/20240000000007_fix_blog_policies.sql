-- Corrigir políticas do blog_posts para permitir que admins publiquem e excluam

-- Remover políticas existentes
drop policy if exists "Permitir insert para autenticados" on blog_posts;
drop policy if exists "Permitir select para autenticados" on blog_posts;

-- Criar políticas corretas para admins

-- Política para SELECT (todos os usuários autenticados podem ver)
create policy "Permitir select para autenticados" on blog_posts
  for select
  to authenticated
  using (true);

-- Política para INSERT (apenas admins podem criar posts)
create policy "Permitir insert para admins" on blog_posts
  for insert
  to authenticated
  with check (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- Política para UPDATE (apenas admins podem editar posts)
create policy "Permitir update para admins" on blog_posts
  for update
  to authenticated
  using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- Política para DELETE (apenas admins podem excluir posts)
create policy "Permitir delete para admins" on blog_posts
  for delete
  to authenticated
  using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.is_admin = true
    )
  );

-- Corrigir políticas do storage para imagens do blog

-- Remover políticas existentes do storage
drop policy if exists "Imagens públicas do blog" on storage.objects;
drop policy if exists "Upload de imagens do blog" on storage.objects;

-- Política para visualizar imagens (público)
create policy "Imagens públicas do blog"
on storage.objects for select
using ( bucket_id = 'blog-images' );

-- Política para upload de imagens (apenas admins)
create policy "Upload de imagens do blog"
on storage.objects for insert
to authenticated
with check ( 
  bucket_id = 'blog-images' 
  and exists (
    select 1 from profiles 
    where profiles.id = auth.uid() 
    and profiles.is_admin = true
  )
);

-- Política para deletar imagens (apenas admins)
create policy "Delete de imagens do blog"
on storage.objects for delete
to authenticated
using ( 
  bucket_id = 'blog-images' 
  and exists (
    select 1 from profiles 
    where profiles.id = auth.uid() 
    and profiles.is_admin = true
  )
);

-- Garantir que o bucket existe
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing; 