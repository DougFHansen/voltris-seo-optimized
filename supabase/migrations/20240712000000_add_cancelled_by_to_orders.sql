-- Migration: Adiciona coluna cancelled_by para rastrear quem cancelou o pedido
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS cancelled_by TEXT CHECK (cancelled_by IN ('client', 'admin'));

COMMENT ON COLUMN public.orders.cancelled_by IS 'Indica quem cancelou o pedido: client (cliente) ou admin (administrador)'; 