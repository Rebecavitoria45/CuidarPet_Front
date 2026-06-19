import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function CadastrarPet() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    raca: '',
    idade: '',
    sexo: '',
    peso: '',
    corresponsavel: '',
    clienteId: '' // ID do tutor selecionado
  });

  const [clienteSelecionadoNome, setClienteSelecionadoNome] = useState('');

  // Busca clientes conforme o usuário digita
  useEffect(() => {
    if (termoBusca.length > 2) {
        // Faz a busca no backend agora!
        api.get(`/clientes/buscar?nome=${termoBusca}`)
            .then(response => {
                setClientesEncontrados(response.data);
                setMostrarDropdown(true);
            })
            .catch(err => console.error("Erro na busca remota", err));
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
    if (!formData.clienteId) {
      alert("Por favor, selecione um cliente responsável.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/pets', formData);
      alert("Pet cadastrado com sucesso!");
      navigate('/pets');
    } catch (err) {
      alert(err.response?.data?.mensagem || "Erro ao cadastrar pet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/pets')}>Pets</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">Cadastro</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Formulário */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-outline-variant p-10 shadow-sm">
              <div className="mb-10">
                <h2 className="text-[28px] font-bold text-on-surface mb-2">Cadastrar Pet</h2>
                <p className="text-on-surface-variant text-sm">Registre as informações clínicas e identifique o tutor responsável.</p>
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
                      placeholder="Ex: Thor, Mel, Pipoca"
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
                      <option value="">Selecione</option>
                      <option value="Macho">Macho</option>
                      <option value="Fêmea">Fêmea</option>
                    </select>
                  </div>

                  {/* Espécie */}
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Espécie</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="especie"
                      value={formData.especie}
                      onChange={handleChange}
                      placeholder="Ex: Canina, Felina..."
                      required
                    />
                  </div>

                  {/* Raça */}
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Raça</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="raca"
                      value={formData.raca}
                      onChange={handleChange}
                      placeholder="Ex: Poodle, SRD..."
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
                      placeholder="0"
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
                      placeholder="0.0"
                    />
                  </div>

                  {/* Tutor / Cliente Responsável */}
                  <div className="md:col-span-12 space-y-1.5 relative">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Cliente Responsável (Tutor)</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">person_search</span>
                      <input 
                        className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                        placeholder={clienteSelecionadoNome || "Buscar cliente por nome..."}
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                      />
                    </div>

                    {/* Dropdown de Resultados */}
                    {mostrarDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-outline-variant rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {clientesEncontrados.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => selecionarCliente(c)}
                            className="w-full text-left px-4 py-3 hover:bg-orange-50 flex justify-between items-center transition-colors"
                          >
                            <span className="font-bold text-sm">{c.nome}</span>
                            <span className="text-xs text-gray-400">CPF: {c.cpf}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Corresponsável */}
                  <div className="md:col-span-12 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Corresponsável (Opcional)</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="corresponsavel"
                      value={formData.corresponsavel}
                      onChange={handleChange}
                      placeholder="Nome de outro familiar ou responsável"
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="pt-8 mt-4 border-t border-gray-100 flex items-center justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => navigate('/pets')}
                    className="h-12 px-10 rounded-full border-2 border-primary-container text-primary-container font-bold hover:bg-orange-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="h-12 px-10 rounded-full bg-primary-container text-white font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    {loading ? 'Salvando...' : 'Salvar Cadastro'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lado Direito: Orientações */}
          <div className="lg:col-span-4">
            <div className="bg-[#fff7ed] rounded-2xl border border-[#ffedd5] p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-[24px]">info</span>
                <h3 className="font-bold text-primary text-lg">Prontuário</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-3 text-sm text-orange-900/80 leading-relaxed">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span>O vínculo com o tutor é obrigatório para histórico de cobranças e receitas.</span>
                </li>
                <li className="flex gap-3 text-sm text-orange-900/80 leading-relaxed">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span>O campo corresponsável ajuda a identificar quem pode autorizar procedimentos em emergências.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}