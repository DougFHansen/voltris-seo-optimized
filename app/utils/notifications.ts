// Utilitário para enviar notificações push automaticamente

export interface NotificationData {
  title: string;
  body: string;
  tag: string;
  data?: Record<string, any>;
  type: 'new_user' | 'new_service' | 'new_ticket' | 'service_update' | 'ticket_update' | 'general';
}

// Função para enviar notificação push
export async function sendPushNotification(notification: NotificationData): Promise<boolean> {
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('📱 Notificação push enviada:', result);
      return true;
    } else {
      console.error('❌ Erro ao enviar notificação push:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao enviar notificação push:', error);
    return false;
  }
}

// Funções específicas para diferentes tipos de notificação

// Novo usuário cadastrado
export async function notifyNewUser(userData: { name: string; email: string; id: string }) {
  return sendPushNotification({
    title: '👤 Novo Usuário Cadastrado',
    body: `${userData.name} acabou de se cadastrar no VOLTRIS`,
    tag: 'new-user',
    data: {
      userId: userData.id,
      userEmail: userData.email,
      action: 'view_user',
      url: `/admin/users/${userData.id}`
    },
    type: 'new_user'
  });
}

// Novo serviço solicitado
export async function notifyNewService(serviceData: { title: string; clientName: string; id: string }) {
  return sendPushNotification({
    title: '🛠️ Novo Serviço Solicitado',
    body: `${serviceData.clientName} solicitou: ${serviceData.title}`,
    tag: 'new-service',
    data: {
      serviceId: serviceData.id,
      action: 'view_service',
      url: `/admin/services/${serviceData.id}`
    },
    type: 'new_service'
  });
}

// Novo ticket aberto
export async function notifyNewTicket(ticketData: { subject: string; clientName: string; id: string; priority: 'low' | 'medium' | 'high' }) {
  const priorityEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🔴'
  };
  
  return sendPushNotification({
    title: `${priorityEmoji[ticketData.priority]} Novo Ticket Aberto`,
    body: `${ticketData.clientName}: ${ticketData.subject}`,
    tag: 'new-ticket',
    data: {
      ticketId: ticketData.id,
      priority: ticketData.priority,
      action: 'view_ticket',
      url: `/admin/tickets/${ticketData.id}`
    },
    type: 'new_ticket'
  });
}

// Atualização de serviço
export async function notifyServiceUpdate(serviceData: { title: string; status: string; id: string }) {
  return sendPushNotification({
    title: '📋 Serviço Atualizado',
    body: `Status alterado para: ${serviceData.status}`,
    tag: 'service-update',
    data: {
      serviceId: serviceData.id,
      status: serviceData.status,
      action: 'view_service',
      url: `/admin/services/${serviceData.id}`
    },
    type: 'service_update'
  });
}

// Atualização de ticket
export async function notifyTicketUpdate(ticketData: { subject: string; status: string; id: string }) {
  return sendPushNotification({
    title: '📝 Ticket Atualizado',
    body: `Status alterado para: ${ticketData.status}`,
    tag: 'ticket-update',
    data: {
      ticketId: ticketData.id,
      status: ticketData.status,
      action: 'view_ticket',
      url: `/admin/tickets/${ticketData.id}`
    },
    type: 'ticket_update'
  });
}

// Notificação personalizada
export async function notifyCustom(title: string, body: string, data?: Record<string, any>) {
  return sendPushNotification({
    title,
    body,
    tag: 'custom-notification',
    data,
    type: 'general'
  });
}
