import { useState, useEffect } from 'react';
import api from '../config/Api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Estados
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalPets, setTotalPets] = useState(0);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState([]); // Apenas os de hoje
  const [loading, setLoading] = useState(true);

  const isAdmin = user.admin;
  const isAtendente = user.role === 'ATENDENTE';

  useEffect(() => {
    
    const hoje = new Date().toLocaleDateString('en-CA'); // Retorna YYYY-MM-DD exatamente

    // 2. Busca usuários (Admin apenas)
    if (isAdmin) {
      api.get('/usuarios').then(res => setTotalUsuarios(res.data.length)).catch(console.error);
    }

    // 3. Busca Clientes (Admin/Atendente)
    if (isAdmin || isAtendente) {
      api.get('/clientes').then(res => setTotalClientes(res.data.length)).catch(console.error);
    }

    // 4. Busca Pets
    api.get('/pets').then(res => setTotalPets(res.data.length)).catch(console.error);

    // 5. Busca Agendamentos de HOJE usando o endpoint de data que criamos
    api.get(`/agendamentos/data?data=${hoje}`)
      .then(response => {
        setAgendamentosDoDia(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar agenda de hoje:", err);
        setAgendamentosDoDia([]);
        setLoading(false);
      });

  }, [isAdmin, isAtendente]);

  return (
    <div className="animate-entrance">
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">
          Bem-vindo, {user.nome?.split(' ')[0] || 'Usuário'}
        </h2>
        <p className="text-on-surface-variant">Confira a movimentação da clínica para hoje.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isAdmin && (
          <StatCard icon="medical_services" label="Total de Usuários" value={totalUsuarios} color="bg-secondary-container/30 text-secondary" />
        )}

        {(isAdmin || isAtendente) && (
          <StatCard icon="person_add" label="Clientes cadastrados" value={totalClientes} color="bg-primary-container/10 text-primary-container" />
        )}

        <StatCard icon="pets" label="Pets Cadastrados" value={totalPets} color="bg-purple-100 text-purple-600" />
        
        {/* Card Laranja: Mostra a contagem de HOJE */}
        <div className="bg-primary-container p-6 rounded-xl shadow-xl flex flex-col justify-between text-white">
          <div className="p-3 bg-white/20 rounded-lg w-fit">
            <span className="material-symbols-outlined">calendar_today</span>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Agendamentos Hoje</p>
            <h3 className="text-3xl font-bold text-white">{agendamentosDoDia.length}</h3>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h4 className="font-bold text-lg text-on-surface">Agenda do Dia</h4>
            <button onClick={() => navigate('/agendamentos')} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              Ver todos <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-on-surface-variant text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Horário</th>
                  <th className="px-6 py-3 font-semibold">Pet</th>
                  <th className="px-6 py-3 font-semibold">Veterinário</th>
                  <th className="px-6 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agendamentosDoDia.length > 0 ? (
                  agendamentosDoDia.slice(0, 6).map((ag) => (
                    <tr key={ag.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-on-surface text-sm">{ag.horario.substring(0, 5)}h</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{ag.petNome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{ag.veterinarioNome}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          ag.status === 'CONFIRMADO' ? 'bg-secondary/10 text-secondary' : 'bg-orange-100 text-primary'
                        }`}>
                          {ag.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-on-surface-variant italic">
                      {loading ? 'Carregando agenda...' : 'Nenhum atendimento para hoje.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ações Rápidas */}
        {(isAdmin || isAtendente) && (
        <aside className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h4 className="text-xl font-bold mb-6">Ações Rápidas</h4>
          <div className="space-y-3">
            {isAdmin && (
              <QuickActionButton icon="person_add_alt" label="Novo Usuário" onClick={() => navigate('/usuarios/cadastro')} />
            )}
            {(isAdmin || isAtendente) && (
              <QuickActionButton icon="person_pin" label="Novo Cliente" onClick={() => navigate('/clientes/cadastro')} />
            )}
            {(isAdmin || isAtendente) && (
              <QuickActionButton icon="event_repeat" label="Marcar Consulta" onClick={() => navigate('/agendamentos/novo')} />
            )}
          </div>
        </aside>
        )}
      </div>
    </div>
  );
}
// Sub-componentes
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