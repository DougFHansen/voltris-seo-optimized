-- Create tickets table
create table if not exists public.tickets (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    status text not null default 'Aberto',
    priority text not null default 'medium',
    user_id uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ticket_messages table
create table if not exists public.ticket_messages (
    id uuid default gen_random_uuid() primary key,
    ticket_id uuid references public.tickets on delete cascade not null,
    content text not null,
    user_id uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;

-- Create policies for tickets
create policy "Users can view their own tickets"
    on public.tickets for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own tickets"
    on public.tickets for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own tickets"
    on public.tickets for update
    using ( auth.uid() = user_id );

-- Create policies for ticket_messages
create policy "Users can view messages from their tickets"
    on public.ticket_messages for select
    using (
        exists (
            select 1 from public.tickets
            where tickets.id = ticket_messages.ticket_id
            and tickets.user_id = auth.uid()
        )
    );

create policy "Users can insert messages in their tickets"
    on public.ticket_messages for insert
    with check (
        exists (
            select 1 from public.tickets
            where tickets.id = ticket_id
            and tickets.user_id = auth.uid()
        )
    );

-- Create policy for admins to view all tickets and messages
create policy "Admins can view all tickets"
    on public.tickets for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );

create policy "Admins can view all messages"
    on public.ticket_messages for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );

create policy "Admins can insert messages in any ticket"
    on public.ticket_messages for insert
    with check (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );

create policy "Admins can update any ticket"
    on public.tickets for update
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    ); 