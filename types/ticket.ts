export interface Profile {
  id: string;
  full_name: string;
  email: string;
  is_admin: boolean;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: Profile;
}

export interface Ticket {
  id: string;
  title: string;
  status: 'Aberto' | 'Em Análise' | 'Resolvido' | 'Finalizado';
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  created_at: string;
  messages?: TicketMessage[];
  profiles?: Profile;
} 