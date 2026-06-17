import DashboardAdmin from './DashBoardAdmin';
import DashboardAtendente from './DashboardAtendente';

export default function Home() {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  return userData.admin ? <DashboardAdmin /> : <DashboardAtendente />;
}