import { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function EditarPet() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do pet da URL
  const [loading, setLoading] = useState(false);
  const [buscandoDados, setBuscandoDados] = useState(true);

  // Estados para busca de tutor
  const [termoBusca, setTermoBusca] = useState('');
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [clienteSelecionadoNome, setClienteSelecionadoNome] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    raca: '',
    idade: '',
    sexo: '',
    peso: '',
    corresponsavel: '',
    clienteId: '' 
  });

  // Carregar dados do Pet
  useEffect(() => {
    const carregarPet = async () => {
      try {
        const response = await api.get(`/pets/${id}`);
        const pet = response.data;
        
        setFormData({
          nome: pet.nome,
          especie: pet.especie,
          raca: pet.raca,
          idade: pet.idade,
          sexo: pet.sexo,
          peso: pet.peso,
          corresponsavel: pet.corresponsavel || '',
          clienteId: pet.clienteId
        });
        setClienteSelecionadoNome(pet.tutorNome); // Nome do dono atual
      } catch (err) {
        console.error("Erro ao buscar pet:", err);
        alert("Erro ao carregar dados do paciente.");
        navigate('/pets');
      } finally {
        setBuscandoDados(false);
      }
    };
    carregarPet();
  }, [id, navigate]);

  useEffect(() => {
    if (termoBusca.length > 2) {
      api.get(`/clientes`).then(response => {
        const filtrados = response.data.filter(c => 
          c.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
          c.cpf.includes(termoBusca)
        );
        setClientesEncontrados(filtrados);
        setMostrarDropdown(true);
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMostrarDropdown(false);
    }
  }, [termoBusca]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selecionarCliente = (cliente) => {
    setFormData(prev => ({ ...prev, clienteId: cliente.id }));
    setClienteSelecionadoNome(cliente.nome);
    setTermoBusca('');
    setMostrarDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/pets/${id}`, formData);
      alert("Prontuário atualizado com sucesso!");
      navigate('/pets');
    } catch (err) {
      alert(err.response?.data?.mensagem || "Erro ao atualizar dados do pet.");
    } finally {
      setLoading(false);
    }
  };

  if (buscandoDados) {
    return <Layout><div className="p-10 font-bold text-primary">Carregando prontuário...</div></Layout>;
  }

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/pets')}>Pets</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">Editar Pet</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-outline-variant p-10 shadow-sm">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-orange-50 text-primary rounded-lg material-symbols-outlined">edit_note</span>
                    <h2 className="text-[28px] font-bold text-on-surface">Editar Pet</h2>
                </div>
                <p className="text-on-surface-variant text-sm">Atualize as informações clínicas ou altere o tutor responsável.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Nome do Pet */}
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Nome do Pet</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Sexo */}
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Sexo</label>
                    <select 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all appearance-none"
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                      required
                    >
                      <option value="Macho">Macho</option>
                      <option value="Fêmea">Fêmea</option>
                    </select>
                  </div>

                  {/* Espécie e Raça */}
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Espécie</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="especie"
                      value={formData.especie}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Raça</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="raca"
                      value={formData.raca}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Idade e Peso */}
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Idade (Anos)</label>
                    <input 
                      type="number"
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="idade"
                      value={formData.idade}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Peso (kg)</label>
                    <input 
                      type="number" step="0.1"
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="peso"
                      value={formData.peso}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Tutor Responsável com Busca */}
                  <div className="md:col-span-12 space-y-1.5 relative">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Alterar Tutor (Atual: {clienteSelecionadoNome})</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">person_search</span>
                      <input 
                        className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                        placeholder="Buscar novo tutor por nome ou CPF..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                      />
                    </div>

                    {mostrarDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-outline-variant rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {clientesEncontrados.map(c => (
                          <button key={c.id} type="button" onClick={() => selecionarCliente(c)} className="w-full text-left px-4 py-3 hover:bg-orange-50 flex justify-between items-center transition-colors">
                            <span className="font-bold text-sm">{c.nome}</span>
                            <span className="text-xs text-gray-400">CPF: {c.cpf}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Corresponsável */}
                  <div className="md:col-span-12 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Corresponsável</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="corresponsavel"
                      value={formData.corresponsavel}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="pt-8 mt-4 border-t border-gray-100 flex items-center justify-end gap-4">
                  <button type="button" onClick={() => navigate('/pets')} className="h-12 px-10 rounded-full border-2 border-primary-container text-primary-container font-bold hover:bg-orange-50 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading} className="h-12 px-10 rounded-full bg-primary-container text-white font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lado Direito: Histórico Curto */}
          <div className="lg:col-span-4">
            <div className="bg-[#fff7ed] rounded-2xl border border-[#ffedd5] p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">history</span>
                <h3 className="font-bold text-primary text-lg">Informações</h3>
              </div>
              <p className="text-sm text-orange-900/80 leading-relaxed mb-6">
                As alterações no peso e idade serão refletidas na próxima ficha de anamnese do animal.
              </p>
              <div className="p-4 bg-white/50 rounded-xl border border-orange-200">
                  <p className="text-xs font-bold text-orange-800 uppercase mb-1">Última Atualização</p>
                  <p className="text-sm text-orange-900 font-medium">Informação disponível no prontuário completo.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}