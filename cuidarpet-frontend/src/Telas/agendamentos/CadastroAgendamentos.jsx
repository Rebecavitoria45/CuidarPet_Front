/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function CadastrarAgendamento() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    horario: '',
    veterinarioId: '',
    petId: '',
    status: 'AGENDADO'
  });

  const configAgenda = {
    inicio: '08:00',
    fim: '18:00',
    intervalo: 30,
    pausaAlmoco: { inicio: '12:00', fim: '13:30' }
  };

  const gerarHorarios = useCallback(() => {
    const slots = [];
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    let atual = new Date(`2024-01-01T${configAgenda.inicio}:00`);
    const encerramento = new Date(`2024-01-01T${configAgenda.fim}:00`);

    while (atual < encerramento) {
      const horaFormatada = atual.toTimeString().substring(0, 5);
      const [horas, minutos] = horaFormatada.split(':').map(Number);
      const minutosSlot = horas * 60 + minutos;

      const ehNoFuturo = formData.data !== hoje || minutosSlot > minutosAgora;

      const horaAlmocoInicio = new Date(
        `2024-01-01T${configAgenda.pausaAlmoco.inicio}:00`
      );
      const horaAlmocoFim = new Date(
        `2024-01-01T${configAgenda.pausaAlmoco.fim}:00`
      );

      if ((atual < horaAlmocoInicio || atual >= horaAlmocoFim) && ehNoFuturo) {
        slots.push(horaFormatada);
      }

      atual.setMinutes(atual.getMinutes() + configAgenda.intervalo);
    }

    return slots;
  }, [formData.data]);

  const horariosDisponiveis = gerarHorarios();

  useEffect(() => {
    api.get('/usuarios')
      .then((res) => {
        setVets(res.data.filter((u) => u.role === 'VETERINARIO'));
      })
      .catch((err) => console.error('Erro ao buscar veterinários:', err));

    api.get('/pets')
      .then((res) => {
        setPets(res.data);
      })
      .catch((err) => console.error('Erro ao buscar pets:', err));
  }, []);

  useEffect(() => {
    if (formData.veterinarioId && formData.data) {
      api.get('/agendamentos/horarios-ocupados', {
        params: {
          vetId: formData.veterinarioId,
          data: formData.data
        }
      })
        .then((res) => {
          setHorariosOcupados(res.data);

          if (res.data.includes(formData.horario)) {
            setFormData((prev) => ({ ...prev, horario: '' }));
          }
        })
        .catch((err) => console.error('Erro ao buscar horários ocupados:', err));
    }
  }, [formData.veterinarioId, formData.data, formData.horario]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.petId) {
      alert('Por favor, selecione um pet!');
      return;
    }

    if (!formData.veterinarioId) {
      alert('Por favor, selecione um veterinário!');
      return;
    }

    if (!formData.horario) {
      alert('Por favor, selecione um horário!');
      return;
    }

    setLoading(true);

    try {
      
      await api.post('/agendamentos', {
      data: formData.data,
      horario: formData.horario,
      veterinarioId: formData.veterinarioId,
      petId: formData.petId, // O ID do pet vai aqui dentro
      status: formData.status
    });

      alert('Agendamento realizado com sucesso!');
      navigate('/agendamentos');
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao agendar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full animate-entrance">
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <span
            className="cursor-pointer hover:text-primary"
            onClick={() => navigate('/agendamentos')}
          >
            Agendamentos
          </span>

          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>

          <span className="text-primary font-bold">
            Novo Agendamento
          </span>
        </nav>

        <h2 className="text-3xl font-bold text-on-surface mb-2">
          Cadastrar Agendamento
        </h2>

        <p className="text-on-surface-variant mb-8">
          Defina o paciente, o profissional e o melhor horário para o atendimento.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 bg-white rounded-2xl border border-outline-variant p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-4 text-on-surface">
              <span className="material-symbols-outlined text-primary">
                clinical_notes
              </span>
              Informações da Consulta
            </h3>

            <div>
              <label className="block text-sm font-semibold mb-2 text-on-surface-variant">
                Paciente (Pet)
              </label>

              <select
                required
                className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 outline-none"
                value={formData.petId}
                onChange={(e) =>
                  setFormData({ ...formData, petId: e.target.value })
                }
              >
                <option value="">Selecione um pet</option>

                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-on-surface-variant">
                Veterinário(a)
              </label>

              <select
                required
                className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 outline-none"
                value={formData.veterinarioId}
                onChange={(e) =>
                  setFormData({ ...formData, veterinarioId: e.target.value })
                }
              >
                <option value="">Selecione o profissional</option>

                {vets.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    {vet.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-on-surface-variant">
                Data da Consulta
              </label>

              <input
                type="date"
                required
                className="w-full p-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 outline-none"
                min={new Date().toISOString().split('T')[0]}
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value, horario: '' })
                }
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-outline-variant p-8 shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-on-surface">
                <span className="material-symbols-outlined text-primary">
                  schedule
                </span>
                Horários Disponíveis
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {horariosDisponiveis.map((horario) => {
                  const estaOcupado = horariosOcupados.includes(horario);
                  const estaSelecionado = formData.horario === horario;

                  return (
                    <button
                      key={horario}
                      type="button"
                      disabled={estaOcupado}
                      onClick={() =>
                        setFormData({ ...formData, horario })
                      }
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                        estaOcupado
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          : estaSelecionado
                            ? 'bg-primary-container text-white border-primary shadow-lg scale-95'
                            : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-orange-50 hover:border-orange-200'
                      }`}
                    >
                      {horario}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-[10px] uppercase font-bold text-gray-400 border-t pt-4">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 bg-primary-container rounded"></div>
                  Selecionado
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 bg-gray-50 border border-gray-200 rounded"></div>
                  Livre
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 bg-gray-200 rounded"></div>
                  <span className="line-through">Ocupado</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-container text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                'Confirmar Agendamento'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}