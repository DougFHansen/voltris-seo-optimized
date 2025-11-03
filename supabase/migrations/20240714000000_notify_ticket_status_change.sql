-- Migration: Notificação de status de ticket com campo sound

create or replace function notify_ticket_status_change()
returns trigger as $$
begin
  if (new.status is distinct from old.status) and (new.status in ('Em Análise', 'Resolvido', 'Finalizado')) then
    insert into notifications (
      user_id,
      type,
      title,
      body,
      data,
      sound,         -- campo que indica o som a ser tocado
      created_at,
      read
    ) values (
      new.user_id,
      'ticket_status',
      'Status do seu ticket atualizado',
      'Seu ticket "' || new.title || '" agora está com status: ' || new.status,
      jsonb_build_object('ticket_id', new.id, 'status', new.status),
      case
        when new.status = 'Finalizado' then 'alert'
        when new.status = 'Resolvido' then 'chime'
        when new.status = 'Em Análise' then 'ping'
        else 'ping'
      end,
      now(),
      false
    );
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notify_ticket_status_change on tickets;
create trigger trg_notify_ticket_status_change
after update on tickets
for each row
execute function notify_ticket_status_change(); 