-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    login text unique,
    full_name text,
    phone text,
    city text,
    neighborhood text,
    state text,
    cep text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on public.profiles for select
    using ( auth.uid() = id );

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update their own profile"
    on public.profiles for update
    using ( auth.uid() = id );

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Create trigger for updated_at
create trigger handle_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$;

-- Create trigger for new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user(); 