import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/Api';
import Layout from '../Layout';

export default function CadastrarUsuario() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  
  // Estado do formulário seguindo DTO do Java
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    matricula: '',
    senha: '',
    role: 'ATENDENTE', // Valor inicial padrão
    crmv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      await api.post('/usuarios', formData);
      alert("Usuário cadastrado com sucesso!");
      navigate('/usuarios'); // Volta para a listagem
    } catch (err) {
      const msg = err.response?.data?.mensagem || "Erro ao cadastrar usuário. Verifique os dados.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/usuarios')}>Usuários</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">Cadastrar Novo</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lado Esquerdo: Formulário */}
          <div className="lg:col-span-8 min-w-0">
            <div className="bg-white rounded-2xl border border-outline-variant p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-on-surface mb-2">Cadastrar Usuário</h2>
                <p className="text-on-surface-variant text-sm">Insira as informações básicas para criar uma nova conta de acesso ao sistema.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Nome Completo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">Nome Completo</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">badge</span>
                      <input 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Ex: Dr. Ricardo S. Almeida"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">E-mail</label>
                    <input 
                      type="email"
                      className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@cuidarpet.com"
                      required
                    />
                  </div>

                  {/* Matrícula */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">Matrícula</label>
                    <input 
                      className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                      name="matricula"
                      value={formData.matricula}
                      onChange={handleChange}
                      placeholder="CP-2024-001"
                      required
                    />
                  </div>

                  {/* Senha */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">Senha de Acesso</label>
                    <div className="relative">
                      <input 
                        type={verSenha ? "text" : "password"}
                        className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setVerSenha(!verSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                      >
                        <span className="material-symbols-outlined">{verSenha ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Tipo de Usuário (Role) */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">Tipo de Usuário</label>
                    <select 
                      className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all appearance-none"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="ATENDENTE">Atendente</option>
                      <option value="ADMIN">Administrador</option>
                      <option value="VETERINARIO">Veterinário</option>
                    </select>
                  </div>

                  {/* CRMV (Só aparece se for VETERINARIO) */}
                  {formData.role === 'VETERINARIO' && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">CRMV</label>
                      <input 
                        className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                        name="crmv"
                        value={formData.crmv}
                        onChange={handleChange}
                        placeholder="Ex: 12345/SP"
                        required={formData.role === 'VETERINARIO'}
                      />
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="pt-6 border-t border-outline-variant flex items-center justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => navigate('/usuarios')}
                    className="px-6 py-2.5 rounded-full border border-primary text-primary font-bold hover:bg-orange-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 rounded-full bg-primary-container text-white font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar Usuário'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lado Direito: Orientações */}
          <div className="lg:col-span-4">
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">info</span>
                <h3 className="font-bold text-primary">Orientações</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-2 text-sm text-orange-900/80">
                  <span className="material-symbols-outlined text-orange-400 text-lg">check_circle</span>
                  A senha deve conter no mínimo 6 caracteres, uma letra maiúscula e um caractere especial.
                </li>
                <li className="flex gap-2 text-sm text-orange-900/80">
                  <span className="material-symbols-outlined text-orange-400 text-lg">check_circle</span>
                  O CRMV é obrigatório apenas para veterinários.
                </li>
                <li className="flex gap-2 text-sm text-orange-900/80">
                  <span className="material-symbols-outlined text-orange-400 text-lg">check_circle</span>
                  A matrícula deve ser única para cada colaborador.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}