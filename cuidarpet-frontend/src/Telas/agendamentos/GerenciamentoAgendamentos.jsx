/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function GerenciarAgendamentos() {
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroVet, setFiltroVet] = useState('Todos');
  const [filtroData, setFiltroData] = useState('');
  const [filtroHorario, setFiltroHorario] = useState('');

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

      console.log('Resposta Agendamentos:', resAgenda.data);

      const dadosAgenda = Array.isArray(resAgenda.data)
        ? resAgenda.data
        : [];

      const dadosVets = Array.isArray(resVets.data)
        ? resVets.data.filter((u) => u.role === 'VETERINARIO')
        : [];

      setAgendamentos(dadosAgenda);
      setVeterinarios(dadosVets);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAgendamentos([]);
      setVeterinarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const limparFiltros = () => {
    setFiltroTexto('');
    setFiltroStatus('Todos');
    setFiltroVet('Todos');
    setFiltroData('');
    setFiltroHorario('');
  };

  const abrirModal = (agendamento, acao) => {
    setAgendamentoSelecionado(agendamento);
    setAcaoModal(acao);
    setIsModalOpen(true);
  };

  const handleTrocarStatus = async () => {
    try {
      const novoStatus = acaoModal === 'CONFIRMAR' ? 'CONFIRMADO' : 'CANCELADO';

      await api.patch(`/agendamentos/${agendamentoSelecionado.id}/status`, {
        status: novoStatus
      });

      carregarDados();
      setIsModalOpen(false);
    } catch (error) {
      alert('Erro ao atualizar status.');
    }
  };

  const agendamentosFiltrados = Array.isArray(agendamentos)
    ? agendamentos.filter((ag) => {
        const petNome = ag.petNome || ag.pet?.nome || '';
        const veterinarioNome = ag.veterinarioNome || ag.veterinario?.nome || '';
        const horarioBanco = ag.horario ? ag.horario.substring(0, 5) : '';
        const dataBanco = ag.data ? ag.data.substring(0, 10) : '';

        const bateTexto =
          petNome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
          veterinarioNome.toLowerCase().includes(filtroTexto.toLowerCase());

        const bateStatus = filtroStatus === 'Todos' || ag.status === filtroStatus;
        const bateVet = filtroVet === 'Todos' || veterinarioNome === filtroVet;
        const bateData = !filtroData || dataBanco === filtroData;
        const bateHorario = !filtroHorario || horarioBanco === filtroHorario;

        return bateTexto && bateStatus && bateVet && bateData && bateHorario;
      })
    : [];

  const inputFilterClass =
    'w-full mt-2 h-[34px] p-1.5 text-[11px] font-normal border border-gray-200 rounded-md focus:ring-1 focus:ring-primary-container outline-none bg-white text-on-surface';

  return (
    <Layout>
      <div className="w-full animate-entrance">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Agendamentos</h2>
            <p className="text-on-surface-variant">
              Agenda em tempo real e filtros rápidos por coluna.
            </p>
          </div>

          <button
            onClick={() => navigate('/agendamentos/novo')}
            className="bg-primary-container text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">
              add_circle
            </span>
            Novo Agendamento
          </button>
        </header>

        <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-outline-variant">
                <th className="p-4 w-40">
                  <span className="text-xs font-bold text-on-surface-variant uppercase ml-1">
                    Data
                  </span>
                  <input
                    type="date"
                    className={inputFilterClass}
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                  />
                </th>

                <th className="p-4 w-40">
                  <span className="text-xs font-bold text-on-surface-variant uppercase ml-1">
                    Horário
                  </span>
                  <input
                    type="time"
                    className={inputFilterClass}
                    value={filtroHorario}
                    onChange={(e) => setFiltroHorario(e.target.value)}
                  />
                </th>

                <th className="p-4 w-56">
                  <span className="text-xs font-bold text-on-surface-variant uppercase ml-1 whitespace-nowrap">
                    Paciente / Pet
                  </span>
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    className={inputFilterClass}
                    value={filtroTexto}
                    onChange={(e) => setFiltroTexto(e.target.value)}
                  />
                </th>

                <th className="p-4 w-52">
                  <span className="text-xs font-bold text-on-surface-variant uppercase ml-1">
                    Veterinário
                  </span>
                  <select
                    className={inputFilterClass}
                    value={filtroVet}
                    onChange={(e) => setFiltroVet(e.target.value)}
                  >
                    <option value="Todos">Todos</option>
                    {veterinarios.map((v) => (
                      <option key={v.id} value={v.nome}>
                        {v.nome}
                      </option>
                    ))}
                  </select>
                </th>

                <th className="p-4 w-44">
                  <span className="text-xs font-bold text-on-surface-variant uppercase ml-1">
                    Status
                  </span>
                  <select
                    className={inputFilterClass}
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                  >
                    <option value="Todos">Todos</option>
                    <option value="AGENDADO">Agendado</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="CANCELADO">Cancelado</option>
                    <option value="CONCLUIDO">Concluído</option>
                  </select>
                </th>

                <th className="p-4 w-56 text-center">
  <div className="flex flex-col items-center">
    <span className="text-xs font-bold text-on-surface-variant uppercase">
      Ações
    </span>

    <div className="mt-2 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={carregarDados}
        className="h-[34px] px-4 rounded-md bg-primary-container text-white text-[11px] font-bold hover:bg-orange-600 transition"
      >
        Buscar
      </button>

      <button
        type="button"
        onClick={limparFiltros}
        className="h-[34px] px-4 rounded-md border border-gray-200 text-[11px] font-bold text-gray-500 hover:text-primary hover:bg-orange-50 transition"
        title="Limpar filtros"
      >
        Limpar
      </button>
    </div>
  </div>
</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500">
                    Carregando agendamentos...
                  </td>
                </tr>
              ) : agendamentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                agendamentosFiltrados.map((ag) => {
                  const petNome = ag.petNome || ag.pet?.nome || 'Pet não informado';
                  const veterinarioNome =
                    ag.veterinarioNome || ag.veterinario?.nome || 'Veterinário não informado';

                  return (
                    <tr key={ag.id} className="hover:bg-orange-50/20 transition-colors">
                      <td className="p-4 font-bold text-on-surface text-sm">
                        {ag.data
                          ? ag.data.substring(0, 10).split('-').reverse().join('/')
                          : '-'}
                      </td>

                      <td className="p-4 font-medium text-primary text-sm">
                        {ag.horario ? `${ag.horario.substring(0, 5)}h` : '-'}
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-on-surface">
                          {petNome}
                        </span>
                      </td>

                      <td className="p-4 text-sm text-on-surface-variant">
                        {veterinarioNome}
                      </td>

                      <td className="p-4">
                        <StatusBadge status={ag.status} />
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-1">
                          {ag.status !== 'CANCELADO' && ag.status !== 'CONCLUIDO' && (
                            <>
                              <button
                                onClick={() => abrirModal(ag, 'CONFIRMAR')}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                title="Confirmar Presença"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  check_circle
                                </span>
                              </button>

                              <button
                                onClick={() => abrirModal(ag, 'CANCELAR')}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Cancelar"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  cancel
                                </span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => navigate(`/agendamentos/editar/${ag.id}`)}
                            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
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
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        styles[status] || styles.AGENDADO
      }`}
    >
      {status || 'AGENDADO'}
    </span>
  );
}