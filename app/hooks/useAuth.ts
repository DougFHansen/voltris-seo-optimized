// Re-exporta do AuthContext global para manter compatibilidade com imports existentes.
// Todos os componentes que importam useAuth de qualquer caminho usarão a mesma instância.
export { useAuth } from '@/app/context/AuthContext';
