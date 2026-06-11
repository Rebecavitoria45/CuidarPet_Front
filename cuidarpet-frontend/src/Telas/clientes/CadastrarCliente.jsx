import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function CadastrarCliente() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/clientes', formData);
      alert("Cliente cadastrado com sucesso!");
      navigate('/clientes');
    } catch (err) {
      alert(err.response?.data?.mensagem || "Erro ao cadastrar cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Topo: Breadcrumbs seguindo o padrão da imagem */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/clientes')}>Clientes</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">Cadastrar Cliente</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Lado Esquerdo: Formulário Principal */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-outline-variant p-10 shadow-sm">
              <div className="mb-10">
                <h2 className="text-[28px] font-bold text-on-surface mb-2">Cadastrar Cliente</h2>
                <p className="text-on-surface-variant text-sm">Preencha as informações do tutor e os dados de contato para o prontuário.</p>
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
                        placeholder="Ex: Maria Oliveira dos Santos"
                        required
                      />
                    </div>
                  </div>

                  {/* CPF e Telefone */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">CPF</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Telefone</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
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
                      placeholder="maria@exemplo.com"
                      required
                    />
                  </div>

                  {/* Divisor Endereço */}
                  <div className="md:col-span-2 pt-4 flex items-center gap-3">
                    <span className="font-bold text-on-surface whitespace-nowrap">Endereço Residencial</span>
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
                      placeholder="Rua, Av..."
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
                      placeholder="123"
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
                      placeholder="Bairro"
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
                      placeholder="Cidade"
                      required
                    />
                  </div>

                  {/* Estado e Complemento */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Estado</label>
                    <select 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all appearance-none"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione...</option>
                       <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>
                    <option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>
                    <option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>
                    <option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
                    <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>
                    <option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>
                    <option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>
                    <option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
                    <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Complemento</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                      placeholder="Ap, Bloco..."
                    />
                  </div>
                </div>

                {/* Rodapé do Card: Botões Arredondados */}
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
                    className="h-12 px-10 rounded-full bg-primary-container text-white font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Salvando...' : 'Salvar Cadastro'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lado Direito: Card de Orientações seguindo a imagem */}
          <div className="lg:col-span-4">
            <div className="bg-[#fff7ed] rounded-2xl border border-[#ffedd5] p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-[24px]">info</span>
                <h3 className="font-bold text-primary text-lg">Orientações</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-3 text-sm text-orange-900/80 leading-relaxed">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span>O CPF é obrigatório para a emissão de notas fiscais e receitas.</span>
                </li>
                <li className="flex gap-3 text-sm text-orange-900/80 leading-relaxed">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span>Mantenha o telefone atualizado para avisos de agendamento.</span>
                </li>
                <li className="flex gap-3 text-sm text-orange-900/80 leading-relaxed">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span>O e-mail será usado para o envio do histórico clínico do pet.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}