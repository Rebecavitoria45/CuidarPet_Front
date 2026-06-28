/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function GerenciarAgendamentos() {
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosExibidos, setAgendamentosExibidos] = useState([]); // Lista que a tabela realmente mostra
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoPetFiltro, setTermoPetFiltro] = useState('');
const [petsSugeridos, setPetsSugeridos] = useState([]);
const [mostrarDropdownFiltro, setMostrarDropdownFiltro] = useState(false);
const [petSelecionadoFiltro, setPetSelecionadoFiltro] = useState(null); // Armazena o pet escolhido

// Busca dinâmica de pets para o filtro
useEffect(() => {
  if (termoPetFiltro.length > 2) {
    api.get(`/pets/buscar?nome=${termoPetFiltro}`)
      .then(res => {
        setPetsSugeridos(res.data);
        setMostrarDropdownFiltro(true);
      })
      .catch(err => console.error("Erro ao buscar pets para filtro", err));
  } else {
    setMostrarDropdownFiltro(false);
  }
}, [termoPetFiltro]);

// Função para selecionar o pet no filtro
const selecionarPetNoFiltro = (pet) => {
  setPetSelecionadoFiltro(pet);
  setFiltros({ ...filtros, texto: pet.nome }); // Opcional: preenche o texto com o nome
  setTermoPetFiltro('');
  setMostrarDropdownFiltro(false);
};



  // Estados dos Filtros (Valores temporários antes do clique em Buscar)
  const [filtros, setFiltros] = useState({
    texto: '',
    status: 'Todos',
    vet: 'Todos',
    dataInicio: '',
    dataFim: '',
    horaInicio: '',
    horaFim: ''
  });

  // Controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [acaoModal, setAcaoModal] = useState('');

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      const [resAgenda, resVets] = await Promise.all([
        api.get('/agendamentos'),
        api.get('/usuarios')
      ]);

      const lista = Array.isArray(resAgenda.data) ? resAgenda.data : [];
      setAgendamentos(lista);
      setAgendamentosExibidos(lista); // Inicialmente mostra tudo
      setVeterinarios(Array.isArray(resVets.data) ? resVets.data.filter((u) => u.role === 'VETERINARIO') : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

 const aplicarFiltros = () => {
  const filtrados = agendamentos.filter((ag) => {
    const petNomeBanco = ag.petNome || ag.pet?.nome || '';
    const veterinarioNome = ag.veterinarioNome || ag.veterinario?.nome || '';
    const dataBanco = ag.data ? ag.data.substring(0, 10) : '';
    const horarioBanco = ag.horario ? ag.horario.substring(0, 5) : '';

    const batePet = petSelecionadoFiltro 
      ? ag.petId === petSelecionadoFiltro.id 
      : petNomeBanco.toLowerCase().includes(filtros.texto.toLowerCase());

    const bateStatus = filtros.status === 'Todos' || ag.status === filtros.status;
    const bateVet = filtros.vet === 'Todos' || veterinarioNome === filtros.vet;
    const bateData = (!filtros.dataInicio || dataBanco >= filtros.dataInicio) &&
                     (!filtros.dataFim || dataBanco <= filtros.dataFim);
    const bateHorario = (!filtros.horaInicio || horarioBanco >= filtros.horaInicio) &&
                        (!filtros.horaFim || horarioBanco <= filtros.horaFim);

    return batePet && bateStatus && bateVet && bateData && bateHorario;
  });

  setAgendamentosExibidos(filtrados);
};

  // Ajuste na função Limpar Filtros
const limparFiltros = () => {
  setFiltros({
    texto: '', status: 'Todos', vet: 'Todos',
    dataInicio: '', dataFim: '', horaInicio: '', horaFim: ''
  });
  setPetSelecionadoFiltro(null); // Limpa o pet selecionado
  setTermoPetFiltro('');
  setAgendamentosExibidos(agendamentos);
};

  const abrirModal = (agendamento, acao) => {
    setAgendamentoSelecionado(agendamento);
    setAcaoModal(acao);
    setIsModalOpen(true);
  };

  const handleTrocarStatus = async () => {
    try {
      const novoStatus = acaoModal === 'CONFIRMAR' ? 'CONFIRMADO' : 'CANCELADO';
      await api.patch(`/agendamentos/${agendamentoSelecionado.id}/status`, { status: novoStatus });
      await carregarDados(); // Recarrega e reseta exibição
      setIsModalOpen(false);
    } catch (error) {
      alert('Erro ao atualizar status.');
    }
  };

  const inputFilterClass = "w-full p-1 text-[10px] font-normal border border-gray-200 rounded focus:ring-1 focus:ring-primary-container outline-none bg-white text-on-surface";

  return (
    <Layout>
      <div className="w-full animate-entrance">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Agendamentos</h2>
            <p className="text-on-surface-variant">Gestão de agenda com busca por intervalos de data e hora.</p>
          </div>
          <button
            onClick={() => navigate('/agendamentos/novo')}
            className="bg-primary-container text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:brightness-110 shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Novo Agendamento
          </button>
        </header>

        <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-outline-variant">
                {/* FILTRO DATA (Início e Fim) */}
                <th className="p-3 w-44">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Data (De/Até)</span>
                  <div className="flex flex-col gap-1 mt-1">
                    <input type="date" className={inputFilterClass} value={filtros.dataInicio} onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})} />
                    <input type="date" className={inputFilterClass} value={filtros.dataFim} onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})} />
                  </div>
                </th>

                {/* FILTRO HORÁRIO (Início e Fim) */}
                <th className="p-3 w-32">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Horário</span>
                  <div className="flex flex-col gap-1 mt-1">
                    <input type="time" className={inputFilterClass} value={filtros.horaInicio} onChange={(e) => setFiltros({...filtros, horaInicio: e.target.value})} />
                    <input type="time" className={inputFilterClass} value={filtros.horaFim} onChange={(e) => setFiltros({...filtros, horaFim: e.target.value})} />
                  </div>
                </th>

                <th className="p-3 w-56">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Paciente</span>
                  <input type="text" placeholder="Nome..." className={`${inputFilterClass} mt-1 h-[26px]`} value={filtros.texto} onChange={(e) => setFiltros({...filtros, texto: e.target.value})} />
                </th>

                <th className="p-3">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Veterinário</span>
                  <select className={`${inputFilterClass} mt-1 h-[26px]`} value={filtros.vet} onChange={(e) => setFiltros({...filtros, vet: e.target.value})}>
                    <option value="Todos">Todos</option>
                    {veterinarios.map((v) => <option key={v.id} value={v.nome}>{v.nome}</option>)}
                  </select>
                </th>

                <th className="p-3 w-36">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Status</span>
                  <select className={`${inputFilterClass} mt-1 h-[26px]`} value={filtros.status} onChange={(e) => setFiltros({...filtros, status: e.target.value})}>
                    <option value="Todos">Todos</option>
                    <option value="AGENDADO">Agendado</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="CANCELADO">Cancelado</option>
                    <option value="CONCLUIDO">Concluído</option>
                  </select>
                </th>

                {/* COLUNA DE AÇÕES COM BOTÃO BUSCAR */}
                <th className="p-3 w-36 text-center align-bottom">
                   <div className="flex flex-col gap-1">
                      <button onClick={aplicarFiltros} className="w-full h-7 bg-primary-container text-white text-[10px] font-bold rounded hover:bg-orange-600 transition shadow-sm flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">search</span> Buscar
                      </button>
                      <button onClick={limparFiltros} className="w-full h-7 border border-gray-200 text-gray-500 text-[10px] font-bold rounded hover:bg-gray-50 transition">
                        Limpar
                      </button>
                   </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {!loading && agendamentosExibidos.map((ag) => (
                <tr key={ag.id} className="hover:bg-orange-50/20 transition-colors">
                  <td className="p-4 font-bold text-on-surface text-sm">
                    {ag.data?.substring(0, 10).split('-').reverse().join('/')}
                  </td>
                  <td className="p-4 font-medium text-primary text-sm">
                    {ag.horario?.substring(0, 5)}h
                  </td>
                  <td className="p-4 font-bold text-on-surface">{ag.petNome || ag.pet?.nome}</td>
                  <td className="p-4 text-sm text-on-surface-variant">{ag.veterinarioNome || ag.veterinario?.nome}</td>
                  <td className="p-4"><StatusBadge status={ag.status} /></td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-1">
                      {ag.status !== 'CONFIRMADO' && ag.status !== 'CONCLUIDO' && (
                        <button onClick={() => abrirModal(ag, 'CONFIRMAR')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors" title="Confirmar">
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        </button>
                      )}
                      {ag.status !== 'CANCELADO' && ag.status !== 'CONCLUIDO' && (
                        <button onClick={() => abrirModal(ag, 'CANCELAR')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Cancelar">
                          <span className="material-symbols-outlined text-[20px]">cancel</span>
                        </button>
                      )}
                      <button onClick={() => navigate(`/agendamentos/editar/${ag.id}`)} className="p-1.5 text-gray-400 hover:text-primary transition-colors" title="Editar">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && agendamentosExibidos.length === 0 && (
            <div className="p-20 text-center text-gray-500 italic">Nenhum agendamento encontrado para os filtros.</div>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO (Mantenha o mesmo que você já tinha) */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
              {/* Conteúdo do Modal aqui... */}
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-orange-100 animate-entrance text-center">
                  <h3 className="text-xl font-bold mb-4">{acaoModal === 'CONFIRMAR' ? 'Confirmar Presença?' : 'Cancelar Agendamento?'}</h3>
                  <p className="mb-8 text-sm text-gray-500">Deseja realmente alterar o status para {acaoModal === 'CONFIRMAR' ? 'CONFIRMADO' : 'CANCELADO'}?</p>
                  <div className="flex gap-4">
                      <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded-xl font-bold text-gray-500">Voltar</button>
                      <button onClick={handleTrocarStatus} className={`flex-1 py-2 text-white rounded-xl font-bold ${acaoModal === 'CONFIRMAR' ? 'bg-emerald-600' : 'bg-red-600'}`}>Sim, {acaoModal === 'CONFIRMAR' ? 'Confirmar' : 'Cancelar'}</button>
                  </div>
              </div>
          </div>
      )}
    </Layout>
  );
}

// Sub-componentes
function StatusBadge({ status }) {
  const styles = {
    AGENDADO: 'bg-blue-50 text-blue-600 border-blue-100',
    CONFIRMADO: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    CANCELADO: 'bg-red-50 text-red-600 border-red-100',
    CONCLUIDO: 'bg-gray-100 text-gray-500 border-gray-200'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.AGENDADO}`}>
      {status || 'AGENDADO'}
    </span>
  );
}