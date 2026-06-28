import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do cliente da URL
  const [loading, setLoading] = useState(false);
  const [buscandoDados, setBuscandoDados] = useState(true);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: ''
  });

  //Buscar os dados do cliente ao carregar a página
  useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        setFormData(response.data);
      } catch (err) {
        console.error("Erro ao buscar cliente:", err);
        alert("Erro ao carregar dados do cliente.");
        navigate('/clientes');
      } finally {
        setBuscandoDados(false);
      }
    };

    carregarDadosCliente();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Envia os dados atualizados 
      await api.put(`/clientes/${id}`, formData);
      alert("Cadastro atualizado com sucesso!");
      navigate('/clientes');
    } catch (err) {
      alert(err.response?.data?.mensagem || "Erro ao atualizar cliente.");
    } finally {
      setLoading(false);
    }
  };

  if (buscandoDados) {
    return <Layout><div className="p-10 font-bold text-primary">Carregando dados do cliente...</div></Layout>;
  }

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/clientes')}>Clientes</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">Editar Cadastro</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Lado Esquerdo: Formulário */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-outline-variant p-10 shadow-sm">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-primary-container/10 text-primary rounded-lg material-symbols-outlined">edit_square</span>
                    <h2 className="text-[28px] font-bold text-on-surface">Editar Cliente</h2>
                </div>
                <p className="text-on-surface-variant text-sm">Atualize as informações de contato e endereço do tutor.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Nome Completo */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Nome Completo</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">person</span>
                      <input 
                        className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* CPF e Telefone */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">CPF</label>
                    <input 
                      className="w-full h-12 px-4 bg-gray-50 border border-outline-variant rounded-xl text-gray-500 cursor-not-allowed outline-none"
                      name="cpf"
                      value={formData.cpf}
                      readOnly 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Telefone</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* E-mail */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">E-mail</label>
                    <input 
                      type="email"
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Divisor Endereço */}
                  <div className="md:col-span-2 pt-4 flex items-center gap-3">
                    <span className="font-bold text-on-surface whitespace-nowrap">Endereço Atualizado</span>
                    <div className="w-full h-[1px] bg-gray-100"></div>
                  </div>

                  {/* Rua e Número */}
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Rua / Logradouro</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="logradouro"
                      value={formData.logradouro}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Número</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Bairro e Cidade */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Bairro</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Cidade</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Botões Arredondados */}
                <div className="pt-8 mt-4 border-t border-gray-100 flex items-center justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => navigate('/clientes')}
                    className="h-12 px-10 rounded-full border-2 border-primary-container text-primary-container font-bold hover:bg-orange-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="h-12 px-10 rounded-full bg-primary-container text-white font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lado Direito: Info Card */}
          <div className="lg:col-span-4">
            <div className="bg-[#fff7ed] rounded-2xl border border-[#ffedd5] p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-[24px]">info</span>
                <h3 className="font-bold text-primary text-lg">Atualização</h3>
              </div>
              <p className="text-sm text-orange-900/80 leading-relaxed mb-6">
                Ao alterar o endereço, todos os futuros agendamentos e notas fiscais utilizarão os novos dados informados.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-orange-900/80">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  <span>Verifique se o número de telefone possui o DDD correto.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}