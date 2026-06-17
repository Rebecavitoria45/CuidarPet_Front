import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/Api';
import Layout from '../Layout';

export default function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do usuário vindo da URL
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    matricula: '',
    role: 'ATENDENTE',
    crmv: ''
  });

  // 1. Buscar os dados do usuário para preencher o formulário
  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const response = await api.get(`/usuarios`);
        const user = response.data.find(u => u.id === parseInt(id));
        
        if (user) {
          setFormData({
            nome: user.nome,
            email: user.email,
            matricula: user.matricula,
            role: user.role,
            crmv: user.crmv || '',
            admin: user.admin || false
          });
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        alert("Erro ao carregar dados do usuário.");
        navigate('/usuarios');
      } finally {
        setCarregandoDados(false);
      }
    };

    buscarUsuario();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chamada para o endpoint de edição administrativa
      await api.put(`/usuarios/${id}/admin`, formData);
      alert("Usuário atualizado com sucesso!");
      navigate('/usuarios');
    } catch (err) {
      const msg = err.response?.data?.mensagem || "Erro ao atualizar usuário.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  

  if (carregandoDados) {
    return <Layout><div className="p-8">Carregando dados...</div></Layout>;
  }

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/usuarios')}>Usuários</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">Editar Usuário</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-outline-variant p-8 shadow-sm">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-primary-container/10 text-primary rounded-lg material-symbols-outlined">edit_square</span>
                    <h2 className="text-2xl font-bold text-on-surface">Editar Cadastro Usuário</h2>
                </div>
                <p className="text-on-surface-variant text-sm">Alteração de cargos e informações cadastrais de colaboradores.</p>
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
                      required
                    />
                  </div>

                  {/* Matrícula (Campo geralmente desativado ou apenas leitura na edição) */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1 ml-1">Matrícula</label>
                    <input 
                      className="w-full px-4 py-3 bg-gray-50 border border-outline-variant rounded-xl text-gray-500 cursor-not-allowed outline-none"
                      name="matricula"
                      value={formData.matricula}
                      readOnly
                    />
                    <span className="text-[10px] text-gray-400 ml-1">A matrícula não pode ser alterada.</span>
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
                      <option value="VETERINARIO">Veterinário</option>
                    </select>
                  </div>

                  {/* CRMV (Condicional) */}
                  {formData.role === 'VETERINARIO' && (
                    <div className="animate-fade-in md:col-span-2">
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
                {/* Campo Admin Toggle */}
<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
  <div className="flex items-center h-5">
    <input
      name="admin"
      type="checkbox"
      checked={formData.admin}
      onChange={(e) => setFormData({...formData, admin: e.target.checked})}
      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
    />
  </div>
  <div className="ml-2 text-sm">
    <label className="font-bold text-on-surface">Acesso Administrativo</label>
    <p className="text-on-surface-variant text-xs">Este usuário poderá gerenciar outros usuários e configurações.</p>
  </div>
</div>

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
                    {loading ? 'Salvando...' : 'Atualizar Usuário'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lado Direito */}
          <div className="lg:col-span-4">
            <div className="bg-primary-container/5 rounded-2xl border border-primary-container/20 p-6">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">security</span>
                Segurança
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Por motivos de segurança, administradores não podem visualizar ou alterar senhas de outros usuários diretamente.
                <br /><br />
                Caso o colaborador tenha esquecido a senha, utilize o processo de <strong>Reset de Senha.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}