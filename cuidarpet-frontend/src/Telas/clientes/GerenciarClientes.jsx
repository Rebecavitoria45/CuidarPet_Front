/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function GerenciarClientes() {
  const navigate = useNavigate();
  
  // Estados
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [isPesquisaAtiva, setIsPesquisaAtiva] = useState(false);
  const [totalGeral, setTotalGeral] = useState(0);
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);

  // Carregar os 5 recentes
  const carregarDadosIniciais = useCallback(async () => {
    try {
      setLoading(true);
      setIsPesquisaAtiva(false);
      setTermoBusca('');
      
      // Chamada para o endpoint de recentes que criamos no Java
      const response = await api.get('/clientes/recentes');
      setClientes(response.data);

        const resTodos = await api.get('/clientes');
       setTotalGeral(resTodos.data.length);

    } catch (error) {
      console.error("Erro ao carregar clientes recentes:", error);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  // Função de Busca Manual
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!termoBusca.trim()) return carregarDadosIniciais();

    try {
      setLoading(true);
      const response = await api.get(`/clientes/buscar?nome=${termoBusca}`);
      setClientes(response.data);
      setIsPesquisaAtiva(true);
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao realizar a busca.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (cliente) => {
    setClienteParaExcluir(cliente);
    setIsModalOpen(true);
  };

  const handleExcluir = async () => {
    try {
      await api.delete(`/clientes/${clienteParaExcluir.id}`);
      setIsPesquisaAtiva(false) ? handleSearch() : carregarDadosIniciais();
      setIsModalOpen(false);
    } catch (error) {
      alert("Erro ao excluir cliente.");
    }
  };

  return (
    <Layout>
      <div className="w-full animate-entrance">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-lg">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Gerenciamento de Clientes</h2>
            <p className="text-body-md text-on-surface-variant mt-1">
              { "Exibindo os últimos 5 clientes cadastrados."}
            </p>
          </div>
          <button 
            onClick={() => navigate('/clientes/cadastro')}
            className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">person_add</span>
            Cadastrar Cliente
          </button>
        </div>

        {/* Stats Section */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-lg">
  <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm group">
    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-primary mb-4">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
    </div>
    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
       Total de Clientes
    </p>
    <h3 className="text-4xl font-black text-on-surface mt-2">
       {totalGeral.toString().padStart(2, '0')}
    </h3>
  </div>
</div>
        {/* COMPONENTE DE BUSCA */}
        <section className="bg-white p-4 rounded-2xl border border-outline-variant mb-6 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                type="text"
                placeholder="Pesquisar cliente por nome..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-primary-container text-white px-8 rounded-xl font-bold hover:bg-orange-600 transition-all active:scale-95"
            >
              Buscar
            </button>
            {isPesquisaAtiva && (
              <button 
                type="button"
                onClick={carregarDadosIniciais}
                className="px-6 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Limpar
              </button>
            )}
          </form>
        </section>


        {/* Client Table */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-outline-variant">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nome do Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {!loading && clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-orange-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{cliente.nome}</p>
                        <p className="text-[11px] text-on-surface-variant uppercase font-medium">{cliente.cpf}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{cliente.email}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{cliente.telefone}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-orange-50 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => confirmarExclusao(cliente)}
                          className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clientes.length === 0 && !loading && (
              <div className="p-12 text-center text-on-surface-variant italic">Nenhum cliente encontrado.</div>
            )}
            {loading && (
              <div className="p-12 text-center text-primary font-bold animate-pulse">Carregando dados...</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-entrance">
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full mb-6 bg-red-100 text-red-600"><span className="material-symbols-outlined text-5xl">delete_forever</span></div>
                    <h3 className="text-2xl font-black text-on-surface mb-2">Excluir Cliente?</h3>
                    <p className="text-on-surface-variant text-sm mb-8">Tem certeza que deseja excluir o cadastro de <strong>{clienteParaExcluir?.nome}</strong>?</p>
                    <div className="flex gap-4 w-full">
                        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-500">Cancelar</button>
                        <button onClick={handleExcluir} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-wider">Sim, Excluir</button>
                    </div>
                </div>
             </div>
        </div>
      )}
    </Layout>
  );
}