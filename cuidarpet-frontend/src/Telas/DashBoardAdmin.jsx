import { useState, useEffect } from 'react';
import api from '../config/Api';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [usuariosAtivos, setUsuariosAtivos] = useState(0);

  const [totalClientes, setTotalClientes] = useState(0);
  const [ultimoCliente, setUltimoCliente] = useState('...');

  const navigate = useNavigate();
  

  useEffect(() => {
    api.get('/usuarios')
      .then(response => {
        const listaUsuarios = response.data;
        
        //Define o total geral
        setTotalUsuarios(listaUsuarios.length);
        
        // Filtro de quantos user estão ativos
        const ativos = listaUsuarios.filter(u => u.ativo === true).length;
        setUsuariosAtivos(ativos);
      })
      .catch(err => console.error("Erro ao buscar usuários", err));

        // Busca dados de Clientes 
    api.get('/clientes')
      .then(response => {
        const lista = response.data;
        setTotalClientes(lista.length);
        
        // Pega o nome do último cliente cadastrado (último da lista)
        if (lista.length > 0) {
          setUltimoCliente(lista[lista.length - 1].nome);
        }
      })
      .catch(err => console.error("Erro ao buscar clientes", err));
  }, []);
  

  return (
    <div className="animate-entrance">
      {/* Welcome Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">
          Bem-vindo, {user.nome?.split(' ')[0] || 'Usuário'}
        </h2>
        <p className="text-on-surface-variant">Aqui está o que está acontecendo na clínica hoje.</p>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon="medical_services" 
          label="Total de Usuários" 
          value={totalUsuarios} 
          color="bg-secondary-container/30 text-secondary" 
        />
        <StatCard 
          icon="person_add" 
          label="Clientes cadastrados" 
          value={totalClientes}
          color="bg-primary-container/10 text-primary-container" 
        />
        <StatCard 
          icon="pets" 
          label="Pets Cadastrados" 
          value="489" 
          color="bg-purple-100 text-purple-600" 
        />
        {/* Card de Destaque Laranja */}
        <div className="bg-primary-container p-6 rounded-xl shadow-xl shadow-orange-200 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-start text-white">
            <div className="p-3 bg-white/20 rounded-lg">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
            <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-all">arrow_forward</span>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Agendamentos Hoje</p>
            <h3 className="text-3xl font-bold text-white">4</h3>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Management Overview */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryMiniCard icon="pets" title="Pets" label1="Recente" value1="Max (Cão)" label2="Total" value2="489" />
          <SummaryMiniCard icon="group" title="Clientes" label1="Novo" value1={ultimoCliente}  label2="Total" value2={totalClientes} />
          <SummaryMiniCard icon="person" title="Usuários" label1="Ativos" value1={usuariosAtivos} label2="Total" value2={totalUsuarios} path="/usuarios" />
          <SummaryMiniCard icon="calendar_month" title="Agendamentos" label1="Hoje" value1="4" label2="Total" value2="120" />
        </div>

        {/* Ações Rápidas */}
        <aside className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h4 className="text-xl font-bold mb-6">Ações Rápidas</h4>
          <div className="space-y-3">
            <QuickActionButton icon="person_add_alt" label="Novo Usuário" onClick={() => navigate('/usuarios/cadastro')} />
            <QuickActionButton icon="person_pin" label="Novo Cliente" onClick={() => navigate('/clientes/cadastro')} />
            <QuickActionButton icon="event_repeat" label="Marcar Consulta" onClick={() => navigate('/agendamentos/cadastro')} />
          </div>
        </aside>
      </div>
    </div>
  );
}

// Sub-componentes para organizar o código
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
      <div className={`w-fit p-3 rounded-lg ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}

function SummaryMiniCard({ icon, title, label1, value1, label2, value2, path }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          <h4 className="font-bold text-sm uppercase tracking-wider">{title}</h4>
        </div>
        <button className="text-primary text-xs font-bold hover:underline" onClick={() => navigate(path)}>Ver todos</button>
      </div>
      <div className="space-y-1">
        {/* Linha 1 Dinâmica */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{label1}:</span>
          <span className="font-bold">{value1}</span>
        </div>
        {/* Linha 2 Dinâmica */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{label2}:</span>
          <span className="font-bold">{value2}</span>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }) {
     return (
    <button 
      onClick={onClick} // <--- Aplica a função ao clique do botão real
      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl group hover:bg-primary-container hover:text-white transition-all active:scale-95"
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary-container group-hover:text-white">{icon}</span>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-all">chevron_right</span>
    </button>
  );
}