type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          status: string;
          final_price: number;
          user_id: string;
        }
      }
    }
  }
}

type Order = Database['public']['Tables']['orders']['Row']

export default async function StatsCards() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) return null

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)

  if (ordersError) {
    console.error('Erro ao carregar pedidos:', ordersError)
    return null
  }

  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter((order: Order) => order.status === 'pending').length || 0
  const completedOrders = orders?.filter((order: { status: string }) => order.status === 'completed').length || 0
  const totalAmount = orders?.reduce((sum: number, order: any) => sum + (order.final_price || 0), 0) || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#1E1E1E]/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/40 shadow-lg hover:shadow-[#8B31FF]/10 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-2 shadow-lg shadow-[#FF4B6B]/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-[#e2e8f0] text-sm font-medium">Total de Pedidos</h3>
        </div>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] drop-shadow-[0_0_15px_rgba(139,49,255,0.2)]">{totalOrders}</p>
        <span className="text-sm text-[#e2e8f0]/70">Pedidos realizados</span>
      </div>
      
      <div className="bg-[#1E1E1E]/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/40 shadow-lg hover:shadow-[#8B31FF]/10 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-2 shadow-lg shadow-[#FF4B6B]/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-[#e2e8f0] text-sm font-medium">Em Processamento</h3>
        </div>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] drop-shadow-[0_0_15px_rgba(139,49,255,0.2)]">{pendingOrders}</p>
        <span className="text-sm text-[#e2e8f0]/70">Pedidos pendentes</span>
      </div>
      
      <div className="bg-[#1E1E1E]/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/40 shadow-lg hover:shadow-[#8B31FF]/10 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-2 shadow-lg shadow-[#FF4B6B]/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-[#e2e8f0] text-sm font-medium">Pedidos Concluídos</h3>
        </div>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] drop-shadow-[0_0_15px_rgba(139,49,255,0.2)]">{completedOrders}</p>
        <span className="text-sm text-[#e2e8f0]/70">Entregues com sucesso</span>
      </div>
      
      <div className="bg-[#1E1E1E]/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-800/30 hover:border-[#8B31FF]/40 shadow-lg hover:shadow-[#8B31FF]/10 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-[#FF4B6B] to-[#8B31FF] rounded-xl p-2 shadow-lg shadow-[#FF4B6B]/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-[#e2e8f0] text-sm font-medium">Total Gasto</h3>
        </div>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] drop-shadow-[0_0_15px_rgba(139,49,255,0.2)]">R$ {totalAmount.toFixed(2)}</p>
        <span className="text-sm text-[#e2e8f0]/70">Em todos os pedidos</span>
      </div>
    </div>
  )
}