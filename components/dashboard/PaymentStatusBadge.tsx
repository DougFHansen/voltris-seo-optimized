import React from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface PaymentStatusBadgeProps {
  status: string;
  className?: string;
}

export default function PaymentStatusBadge({ status, className = '' }: PaymentStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Aprovado',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircleIcon
        };
      case 'pending':
        return {
          label: 'Pendente',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: ClockIcon
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircleIcon
        };
      case 'processing':
        return {
          label: 'Processando',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: ArrowPathIcon
        };
      case 'refunded':
        return {
          label: 'Estornado',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: ExclamationTriangleIcon
        };
      case 'disputed':
        return {
          label: 'Disputado',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: ExclamationTriangleIcon
        };
      case 'returned':
        return {
          label: 'Devolvido',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: ExclamationTriangleIcon
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: CurrencyDollarIcon
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  );
} 