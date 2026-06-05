export interface OrderItem {
  service_name: string;
  service_description: string;
  price: number;
  plan_type?: string;
  notes?: string;
}

export interface Order {
  id: string;
  user_id: string;
  service_name: string;
  service_description: string;
  plan_type?: string;
  final_price: number;
  total: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'processing';
  payment_status?: 'pending' | 'approved' | 'cancelled' | 'refunded' | 'processing' | 'disputed' | 'returned';
  notes?: string;
  scheduling_type?: string;
  appointment_datetime?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
  cancelled_by?: 'client' | 'admin';
} 