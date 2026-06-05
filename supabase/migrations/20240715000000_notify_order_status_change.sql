-- Migration: Notificação de status de pedido (order) com campo sound

create or replace function notify_order_status_change()
returns trigger as $$
begin
  if (new.status is distinct from old.status) and (new.status in ('Em processamento', 'Concluído', 'Cancelado')) then
    insert into notifications (
      user_id,
      type,
      title,
      message,
      data,
      sound,
      created_at,
      read
    ) values (
      new.user_id,
      'order',
      'Status do seu pedido atualizado',
      'Seu pedido "' || coalesce(new.service_name, new.id::text) || '" agora está com status: ' || new.status,
      jsonb_build_object('order_id', new.id, 'status', new.status),
      case
        when new.status = 'Concluído' then 'alert'
        when new.status = 'Em processamento' then 'chime'
        when new.status = 'Cancelado' then 'ping'
        else 'ping'
      end,
      now(),
      false
    );
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notify_order_status_change on orders;
create trigger trg_notify_order_status_change
after update on orders
for each row
execute function notify_order_status_change(); 