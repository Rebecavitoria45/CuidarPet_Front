/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function GerenciarAgendamentos() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.admin;
  const isAtendente = user.role === 'ATENDENTE';
  const isVeterinario = user.role === 'VETERINARIO';

  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosExibidos, setAgendamentosExibidos] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para busca dinâmica de Pets no Filtro
  const [termoPetFiltro, setTermoPetFiltro] = useState('');
  const [petsSugeridos, setPetsSugeridos] = useState([]);
  const [mostrarDropdownFiltro, setMostrarDropdownFiltro] = useState(false);
  const [petSelecionadoFiltro, setPetSelecionadoFiltro] = useState(null);

  const [filtros, setFiltros] = useState({
    texto: '',
    status: 'Todos',
    vet: 'Todos',
    dataInicio: '',
    dataFim: '',
    horaInicio: '',
    horaFim: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [acaoModal, setAcaoModal] = useState('');

  // Busca dinâmica de pets
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

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      const [resAgenda, resVets] = await Promise.all([
        api.get('/agendamentos'),
        api.get('/usuarios')
      ]);
      const lista = Array.isArray(resAgenda.data) ? resAgenda.data : [];
      setAgendamentos(lista);
      setAgendamentosExibidos(lista);
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
      const petNomeBanco = (ag.petNome || ag.pet?.nome || "").toLowerCase();
      const veterinarioNome = ag.veterinarioNome || ag.veterinario?.nome || '';
      const dataBanco = ag.data ? ag.data.substring(0, 10) : '';
      const horarioBanco = ag.horario ? ag.horario.substring(0, 5) : '';

      const batePet = petSelecionadoFiltro 
        ? ag.petId === petSelecionadoFiltro.id 
        : petNomeBanco.includes(termoPetFiltro.toLowerCase());

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

  const limparFiltros = () => {
    setFiltros({
      texto: '', status: 'Todos', vet: 'Todos',
      dataInicio: '', dataFim: '', horaInicio: '', horaFim: ''
    });
    setPetSelecionadoFiltro(null);
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
       let novoStatus = '';
    if (acaoModal === 'CONFIRMAR') novoStatus = 'CONFIRMADO';
    else if (acaoModal === 'CANCELAR') novoStatus = 'CANCELADO';
    else if (acaoModal === 'CONCLUIR') novoStatus = 'CONCLUIDO';
      await api.patch(`/agendamentos/${agendamentoSelecionado.id}/status`, { status: novoStatus });
      await carregarDados();
      setIsModalOpen(false);
    } catch (error) {
      alert('Erro ao atualizar status.');
    }
  };

  const inputFilterClass = "w-full p-2 text-xs font-normal border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none bg-white text-on-surface transition-all";

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Header e Filtros (Mantidos como estavam) */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Agendamentos</h2>
            <p className="text-on-surface-variant">
              {isVeterinario && !isAdmin ? "Sua agenda pessoal." : "Gestão completa da agenda veterinária."}
            </p>
          </div>
          {(isAdmin || isAtendente) && (
            <button
              onClick={() => navigate('/agendamentos/novo')}
              className="bg-primary-container text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-orange-100 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Novo Agendamento
            </button>
          )}
        </header>

        <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-outline-variant">
                 {/* ... (Manter os THs de Filtro conforme o código anterior) ... */}
                 <th className="p-4 w-52"><span className="text-xs font-bold text-on-surface-variant uppercase ml-1">Data (De/Até)</span><div className="flex flex-col gap-1.5 mt-2"><input type="date" className={inputFilterClass} value={filtros.dataInicio} onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})} /><input type="date" className={inputFilterClass} value={filtros.dataFim} onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})} /></div></th>
                 <th className="p-4 w-36"><span className="text-xs font-bold text-on-surface-variant uppercase ml-1">Horário</span><div className="flex flex-col gap-1.5 mt-2"><input type="time" className={inputFilterClass} value={filtros.horaInicio} onChange={(e) => setFiltros({...filtros, horaInicio: e.target.value})} /><input type="time" className={inputFilterClass} value={filtros.horaFim} onChange={(e) => setFiltros({...filtros, horaFim: e.target.value})} /></div></th>
                 <th className="p-4 w-64 relative"><span className="text-xs font-bold text-on-surface-variant uppercase ml-1">Paciente</span><div className="relative mt-2"><input type="text" placeholder={petSelecionadoFiltro ? `Filtrando: ${petSelecionadoFiltro.nome}` : "Nome do pet..."} className={`${inputFilterClass} h-[42px] ${petSelecionadoFiltro ? 'bg-orange-50 border-orange-300 font-bold' : ''}`} value={termoPetFiltro} onChange={(e) => {setTermoPetFiltro(e.target.value); if (petSelecionadoFiltro) setPetSelecionadoFiltro(null);}} />{mostrarDropdownFiltro && (<div className="absolute z-[110] w-full mt-1 bg-white border border-outline-variant rounded-xl shadow-2xl max-h-48 overflow-y-auto">{petsSugeridos.map(p => (<button key={p.id} type="button" onClick={() => {setPetSelecionadoFiltro(p);setTermoPetFiltro(p.nome);setMostrarDropdownFiltro(false);}} className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b border-gray-50 flex flex-col transition-colors"><span className="text-sm font-bold text-on-surface">{p.nome}</span><span className="text-[10px] text-gray-400 uppercase font-medium">Tutor: {p.tutorNome}</span></button>))}</div>)}</div></th>
                 <th className="p-4"><span className="text-xs font-bold text-on-surface-variant uppercase ml-1">Veterinário</span><select className={`${inputFilterClass} mt-2 h-[42px]`} value={filtros.vet} onChange={(e) => setFiltros({...filtros, vet: e.target.value})}><option value="Todos">Todos</option>{veterinarios.map((v) => <option key={v.id} value={v.nome}>{v.nome}</option>)}</select></th>
                 <th className="p-4 w-40"><span className="text-xs font-bold text-on-surface-variant uppercase ml-1">Status</span><select className={`${inputFilterClass} mt-2 h-[42px]`} value={filtros.status} onChange={(e) => setFiltros({...filtros, status: e.target.value})}><option value="Todos">Todos</option><option value="AGENDADO">Agendado</option><option value="CONFIRMADO">Confirmado</option><option value="CANCELADO">Cancelado</option><option value="CONCLUIDO">Concluído</option></select></th>
                 <th className="p-4 w-40 text-center align-bottom"><div className="flex flex-col gap-2"><button onClick={aplicarFiltros} className="w-full h-10 bg-primary-container text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition shadow-md flex items-center justify-center gap-2 active:scale-95"><span className="material-symbols-outlined text-lg">search</span> Buscar</button><button onClick={limparFiltros} className="w-full h-10 border border-gray-200 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-50 transition active:scale-95">Limpar</button></div></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant">
              {!loading && agendamentosExibidos.map((ag) => (
                <tr key={ag.id} className="hover:bg-orange-50/20 transition-colors">
                  <td className="p-4 font-bold text-on-surface text-sm">
                    {ag.data?.substring(0, 10).split('-').reverse().join('/')}
                  </td>
                  <td className="p-4 font-bold text-primary text-sm">
                    {ag.horario?.substring(0, 5)}h
                  </td>
                  
                  {/* AJUSTE 1: Exibir o nome do Tutor abaixo do Pet */}
                  <td className="p-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{ag.petNome || ag.pet?.nome}</span>
                        <span className="text-[10px] text-on-surface-variant uppercase font-medium tracking-tight">
                            Tutor: {ag.tutorNome || "Não informado"}
                        </span>
                    </div>
                  </td>
                  
                  <td className="p-4 text-sm text-on-surface-variant">{ag.veterinarioNome || ag.veterinario?.nome}</td>
                  <td className="p-4"><StatusBadge status={ag.status} /></td>
                  
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-1">
                      {/* Botões de Status (Confirmar/Concluir/Cancelar) conforme lógica anterior */}
                      {isVeterinario && !isAdmin ? (
                        <>
                          {ag.status !== 'CONCLUIDO' && ag.status !== 'CANCELADO' && (
                            <button onClick={() => abrirModal(ag, 'CONCLUIR')} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 active:scale-95 shadow-sm"><span className="material-symbols-outlined text-[18px]">task_alt</span><span className="text-[10px] uppercase">Concluir</span></button>
                          )}
                          {ag.status === 'CONCLUIDO' && <span className="text-[10px] text-gray-400 font-bold uppercase italic">Finalizado</span>}
                        </>
                      ) : (
                        <>
                          {ag.status !== 'CONFIRMADO' && ag.status !== 'CONCLUIDO' && (
                            <button onClick={() => abrirModal(ag, 'CONFIRMAR')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"><span className="material-symbols-outlined">check_circle</span></button>
                          )}
                          {ag.status !== 'CANCELADO' && ag.status !== 'CONCLUIDO' && (
                            <button onClick={() => abrirModal(ag, 'CANCELAR')} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"><span className="material-symbols-outlined">cancel</span></button>
                          )}

                          {/* AJUSTE 2: Trava de edição quando Concluído */}
                          {ag.status !== 'CONCLUIDO' ? (
                            <button 
                                onClick={() => navigate(`/agendamentos/editar/${ag.id}`)} 
                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                title="Editar Agendamento"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                          ) : (
                            <div className="p-2 text-gray-200 cursor-not-allowed" title="Finalizados não podem ser editados">
                                <span className="material-symbols-outlined text-[20px]">edit_off</span>
                            </div>
                          )}
                        </>
                      )}
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
      

   {/* MODAL DE CONFIRMAÇÃO */}
{isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-orange-100 animate-entrance text-center">
      
      {/* Ícone Dinâmico */}
      <div className={`p-4 rounded-full mb-4 inline-block ${acaoModal === 'CONCLUIR' ? 'bg-emerald-100 text-emerald-600' : acaoModal === 'CONFIRMAR' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
        <span className="material-symbols-outlined text-4xl">
          {acaoModal === 'CONCLUIR' ? 'assignment_turned_in' : acaoModal === 'CONFIRMAR' ? 'verified' : 'event_busy'}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2">
        {acaoModal === 'CONCLUIR' ? 'Finalizar Atendimento?' : acaoModal === 'CONFIRMAR' ? 'Confirmar Presença?' : 'Cancelar Agendamento?'}
      </h3>
      
      <p className="mb-8 text-sm text-gray-500">
        Deseja alterar o status do paciente <strong>{agendamentoSelecionado?.petNome}</strong> para 
        <strong> {acaoModal === 'CONCLUIR' ? 'CONCLUÍDO' : acaoModal === 'CONFIRMAR' ? 'CONFIRMADO' : 'CANCELADO'}</strong>?
      </p>

      <div className="flex gap-4">
        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Voltar</button>
        <button 
          onClick={handleTrocarStatus} 
          className={`flex-1 py-2 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all ${acaoModal === 'CANCELAR' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          Sim, {acaoModal === 'CONCLUIR' ? 'Concluir' : acaoModal === 'CONFIRMAR' ? 'Confirmar' : 'Cancelar'}
        </button>
      </div>
    </div>
  </div>
)}
    </Layout>
  );
}

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