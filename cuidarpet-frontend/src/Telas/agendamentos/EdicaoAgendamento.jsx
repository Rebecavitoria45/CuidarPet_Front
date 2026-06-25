/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function EditarAgendamento() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do agendamento da URL
  const [loading, setLoading] = useState(false);
  const [buscandoDados, setBuscandoDados] = useState(true);
  const [vets, setVets] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  // Estado do formulário
  const [formData, setFormData] = useState({
    data: '',
    horario: '',
    veterinarioId: '',
    petId: '',
    status: ''
  });

  const [detalhesIniciais, setDetalhesIniciais] = useState(null);

  // --- CONFIGURAÇÃO DE INTERVALOS (Igual ao cadastro) ---
  const configAgenda = {
    inicio: "08:00",
    fim: "18:00",
    intervalo: 30, 
    pausaAlmoco: { inicio: "12:00", fim: "13:30" }
  };

  const gerarHorarios = useCallback(() => {
    const slots = [];
    let atual = new Date(`2024-01-01T${configAgenda.inicio}:00`);
    const encerramento = new Date(`2024-01-01T${configAgenda.fim}:00`);
    while (atual < encerramento) {
      const horaFormatada = atual.toTimeString().substring(0, 5);
      const horaAlmocoInicio = new Date(`2024-01-01T${configAgenda.pausaAlmoco.inicio}:00`);
      const horaAlmocoFim = new Date(`2024-01-01T${configAgenda.pausaAlmoco.fim}:00`);
      if (atual < horaAlmocoInicio || atual >= horaAlmocoFim) {
        slots.push(horaFormatada);
      }
      atual.setMinutes(atual.getMinutes() + configAgenda.intervalo);
    }
    return slots;
  }, []);

  const horariosDisponiveis = gerarHorarios();

  // 1. Carregar dados iniciais (Agendamento e Veterinários)
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resAgenda, resVets] = await Promise.all([
          api.get(`/agendamentos/${id}`),
          api.get('/usuarios')
        ]);

        const ag = resAgenda.data;
        const dados = {
          data: ag.data,
          horario: ag.horario.substring(0, 5),
          veterinarioId: ag.veterinarioId,
          petId: ag.petId,
          status: ag.status,
          petNome: ag.petNome // Apenas para exibição
        };

         console.log("Dados que serão enviados:", dados);

        setFormData(dados);
        setDetalhesIniciais(dados); // Salva para comparar se o horário mudou
        setVets(resVets.data.filter(u => u.role === 'VETERINARIO'));
      } catch (err) {
        alert("Erro ao carregar agendamento.");
        navigate('/agendamentos');
      } finally {
        setBuscandoDados(false);
      }
    };
    carregarDadosIniciais();
  }, [id, navigate]);

  // 2. Buscar horários ocupados (Sempre que mudar Vet ou Data)
  useEffect(() => {
    if (formData.veterinarioId && formData.data) {
      api.get(`/agendamentos/horarios-ocupados`, {
        params: { vetId: formData.veterinarioId, data: formData.data }
      })
      .then(res => {
        // Filtrar a lista para remover o horário atual deste agendamento, 
        // senão ele apareceria como "ocupado" por ele mesmo.
        const ocupados = res.data.filter(h => {
            if (formData.veterinarioId === detalhesIniciais?.veterinarioId && 
                formData.data === detalhesIniciais?.data) {
                return h !== detalhesIniciais.horario;
            }
            return true;
        });
        setHorariosOcupados(ocupados);
      });
    }
  }, [formData.veterinarioId, formData.data, detalhesIniciais]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.horario) return alert("Selecione um horário!");
    
    setLoading(true);
    try {
      await api.put(`/agendamentos/${id}`, formData);
      alert("Agendamento atualizado com sucesso!");
      navigate('/agendamentos');
    } catch (err) {
      alert(err.response?.data?.mensagem || "Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  if (buscandoDados) return <Layout><div className="p-10 font-bold text-primary">Carregando dados...</div></Layout>;

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/agendamentos')}>Agendamentos</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">Editar Agendamento</span>
        </nav>

        <h2 className="text-3xl font-bold text-on-surface mb-2">Editar Agendamento</h2>
        <p className="text-on-surface-variant mb-8">Atualize o profissional, a data ou o status da consulta.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LADO ESQUERDO: Detalhes */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-outline-variant p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-4 text-on-surface">
              <span className="material-symbols-outlined text-primary">edit_calendar</span>
              Dados da Consulta
            </h3>

            {/* Pet (Geralmente não mudamos o pet em uma edição, mas mostramos o nome) */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-on-surface-variant">Paciente (Pet)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">pets</span>
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-outline-variant rounded-xl text-gray-500 cursor-not-allowed outline-none"
                  value={formData.petNome}
                  readOnly
                />
              </div>
            </div>

            {/* Veterinário */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-on-surface-variant">Veterinário(a)</label>
              <select 
                required
                className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 outline-none appearance-none"
                value={formData.veterinarioId}
                onChange={(e) => setFormData({...formData, veterinarioId: e.target.value})}
              >
                {vets.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </div>

            {/* Data e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-on-surface-variant">Data</label>
                <input 
                  type="date"
                  required
                  className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 outline-none"
                  value={formData.data}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-on-surface-variant">Status</label>
                <select 
                  className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 outline-none appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="AGENDADO">Agendado</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="CONCLUIDO">Concluído</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Grade de Horários */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-outline-variant p-8 shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-on-surface">
                <span className="material-symbols-outlined text-primary">schedule</span>
                Selecione o Horário
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {horariosDisponiveis.map(h => {
                  const estaOcupado = horariosOcupados.includes(h);
                  const estaSelecionado = formData.horario === h;

                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={estaOcupado}
                      onClick={() => setFormData({...formData, horario: h})}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                        estaOcupado 
                          ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through' 
                          : estaSelecionado 
                            ? 'bg-primary-container text-white border-primary shadow-lg scale-95' 
                            : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-orange-50 hover:border-orange-200'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4 text-[10px] uppercase font-bold text-gray-400 border-t pt-4">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-primary-container rounded"></div> Selecionado</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-50 border border-gray-200 rounded"></div> Livre</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-200 rounded"></div> <span className="line-through">Ocupado</span></div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
                <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-container text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button 
                type="button"
                onClick={() => navigate('/agendamentos')}
                className="w-full py-3 bg-white border-2 border-primary-container text-primary-container rounded-2xl font-bold uppercase tracking-widest hover:bg-orange-50 transition-all"
                >
                Descartar
                </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}