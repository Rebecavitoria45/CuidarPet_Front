import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  
  // Pegamos os dados do usuário salvos no login
  const userData = JSON.parse(localStorage.getItem('user') || '{}');


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Estilo padrão dos links
  const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group text-on-surface-variant hover:text-primary";
  // Estilo quando o link está ativo (página atual)
  const activeClass = "bg-primary-container/10 text-primary font-bold active-nav-shadow";

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-6 px-4 z-50">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold text-primary tracking-tight">CuidarPet</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <NavLink to="/dashboard" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ''}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
          <span className="text-sm font-medium">Visão Geral</span>
        </NavLink>

        {userData.admin && (
          <NavLink to="/usuarios" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ''}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
            <span className="text-sm font-medium">Usuários</span>
          </NavLink>
        )}

        <NavLink to="/clientes" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ''}`}>
          <span className="material-symbols-outlined">group</span>
          <span className="text-sm font-medium">Clientes</span>
        </NavLink>

        <NavLink to="/pets" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ''}`}>
          <span className="material-symbols-outlined">pets</span>
          <span className="text-sm font-medium">Pets</span>
        </NavLink>

        <NavLink to="/agendamentos" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ''}`}>
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-sm font-medium">Agendamentos</span>
        </NavLink>
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-outline-variant">
        <button className="w-full bg-primary-container text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-sm">Novo agendamento</span>
        </button>

        {/* Perfil do Usuário Logado */}
        <div className="flex items-center gap-3 px-2 pt-4">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">account_circle</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-on-surface truncate">{userData.nome || 'Usuário'}</span>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">{userData.role || 'Colaborador'}</span>
          </div>
          <button onClick={handleLogout} className="ml-auto text-on-surface-variant hover:text-error transition-colors">
             <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}