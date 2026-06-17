/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import api from '../../config/Api';
import Layout from '../Layout'; 

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  // ESTADOS PARA O MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // Carregar usuários ao abrir a tela
  const carregarUsuarios = useCallback( async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  carregarUsuarios();
}, [carregarUsuarios]);

  
   const abrirConfirmacao = (user) => {
    setUsuarioSelecionado(user);
    setIsModalOpen(true);
  };

  // 2. Função que EXECUTA a chamada na API (chamada pelo botão "Confirmar" do modal)
  const executarTrocaStatus = async () => {
    if (!usuarioSelecionado) return;
    
    try {
      await api.patch(`/usuarios/${usuarioSelecionado.id}/status`);
      carregarUsuarios();
      setIsModalOpen(false); // Fecha o modal após o sucesso
    } catch (error) {
      console.error(error);
      alert("Erro ao alterar status do usuário.");
    }
  };

  // Cálculos das estatísticas
  const total = usuarios.length;
  const ativos = usuarios.filter(u => u.ativo).length;
  const desativados = usuarios.filter(u => !u.ativo).length;

  return (
    <Layout>
      <div className="animate-entrance">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-lg">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Gerenciamento de Usuários</h2>
            <p className="text-body-md text-on-surface-variant">Controle de acesso e permissões para a equipe da clínica.</p>
          </div>
          <button className="flex items-center gap-2 bg-primary-container hover:bg-primary text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95" button onClick={() => window.location.href = '/usuarios/cadastro'}>
            <span className="material-symbols-outlined">add</span>
            Cadastrar Usuário
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatBox label="Total de Usuários" value={total} color="text-primary" />
          <StatBox label="Usuários Ativos" value={ativos} color="text-secondary" />
          <StatBox label="Usuários Desativados" value={desativados} color="text-outline" />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Matrícula</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {usuarios.map((user) => (
                <tr key={user.id} className={`transition-colors hover:bg-orange-50/30 ${!user.ativo ? 'opacity-70 bg-gray-50' : ''}`}>
                  <td className="px-6 py-4">
                      {user.admin && (
                        <span 
                          className="material-symbols-outlined text-amber-500 text-[18px]" 
                           title="Administrador"
                           style={{ fontVariationSettings: "'FILL' 1" }} // Deixa o ícone preenchido
                            >
                           verified_user 
                        </span>
      )}
                    <p className="font-bold text-on-surface">{user.nome}</p>
                    
                    <p className="text-xs text-on-surface-variant">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">
                    {user.matricula}
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge ativo={user.ativo} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-on-surface-variant hover:text-primary transition-all" button onClick={() => window.location.href = `/usuarios/editar/${user.id}`}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button 
                        onClick={() => abrirConfirmacao(user)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${user.ativo ? 'text-red-600 hover:bg-red-50' : 'text-secondary hover:bg-teal-50'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {user.ativo ? 'block' : 'check_circle'}
                        </span>
                        <span className="text-xs">{user.ativo ? 'Desativar' : 'Ativar'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarios.length === 0 && !loading && (
            <div className="p-10 text-center text-on-surface-variant">Nenhum usuário cadastrado.</div>
          )}
        </div>
      </div>
         {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-entrance border border-orange-100">
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 ${usuarioSelecionado?.ativo ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'}`}>
                <span className="material-symbols-outlined text-4xl">
                  {usuarioSelecionado?.ativo ? 'report' : 'verified_user'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {usuarioSelecionado?.ativo ? 'Desativar Usuário?' : 'Ativar Usuário?'}
              </h3>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Você tem certeza que deseja {usuarioSelecionado?.ativo ? 'bloquear' : 'restaurar'} o acesso do colaborador 
                <strong className="text-gray-800"> {usuarioSelecionado?.nome}</strong>? 
                {usuarioSelecionado?.ativo && ' Ele não conseguirá mais logar no sistema.'}
              </p>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executarTrocaStatus}
                  className={`flex-1 py-3 px-4 rounded-xl text-white font-bold transition-all shadow-lg active:scale-95 ${usuarioSelecionado?.ativo ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}
                >
                  Sim, Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// Sub-componentes Auxiliares
function StatBox({ label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant">
      <p className="text-sm text-on-surface-variant mb-1">{label}</p>
      <h3 className={`text-4xl font-bold ${color}`}>{value.toString().padStart(2, '0')}</h3>
    </div>
  );
}

function RoleBadge({ role }) {
  const styles = {
    VETERINARIO: "bg-primary-container/10 text-primary",
    ATENDENTE: "bg-green-100 text-gray-600"
  };
  return (
    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${styles[role] || styles.ATENDENTE}`}>
      {role}
    </span>
  );
}

function StatusBadge({ ativo }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs font-bold ${ativo ? 'text-secondary' : 'text-gray-400'}`}>
      <span className={`w-2 h-2 rounded-full ${ativo ? 'bg-secondary' : 'bg-gray-400'}`}></span>
      {ativo ? 'Ativo' : 'Desativado'}
    </span>
  );
}

