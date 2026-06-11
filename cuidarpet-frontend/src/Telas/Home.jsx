import DashboardAdmin from './DashBoardAdmin';
import DashboardAtendente from './DashboardAtendente';

export default function Home() {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Se for ADMIN, renderiza o dash de admin, senão o comum
  return userData.role === 'ADMIN' ? <DashboardAdmin /> : <DashboardAtendente />;
}