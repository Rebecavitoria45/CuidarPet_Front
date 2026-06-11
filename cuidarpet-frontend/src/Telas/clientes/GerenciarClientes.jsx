import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function GerenciarClientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);

  // Carregar Clientes da API
  const carregarClientes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarClientes();
  }, [carregarClientes]);

  // Função para abrir confirmação de exclusão
  const confirmarExclusao = (cliente) => {
    setClienteParaExcluir(cliente);
    setIsModalOpen(true);
  };

  // Executar exclusão real
  const handleExcluir = async () => {
    try {
      await api.delete(`/clientes/${clienteParaExcluir.id}`);
      carregarClientes();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
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
            <p className="text-body-md text-on-surface-variant mt-1">Visualize e gerencie a base de dados de proprietários e seus pets.</p>
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
          <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total de Clientes</p>
            <h3 className="text-4xl font-black text-on-surface mt-2">{clientes.length.toString().padStart(2, '0')}</h3>
          </div>
        </div>

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
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-orange-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{cliente.nome}</p>
                        <p className="text-[11px] text-on-surface-variant uppercase font-medium">
                          {cliente.pets?.length || 0} Pet(s) cadastrado(s)
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{cliente.email}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{cliente.telefone}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-orange-50 rounded-lg transition-all" title="Editar"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => confirmarExclusao(cliente)}
                          className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Excluir"
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
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-entrance border border-red-100">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full mb-6 bg-red-100 text-red-600">
                <span className="material-symbols-outlined text-5xl">delete_forever</span>
              </div>
              
              <h3 className="text-2xl font-extrabold text-on-surface mb-3 tracking-tight">Excluir Cliente?</h3>
              
              <p className="text-on-surface-variant text-sm leading-relaxed mb-10">
                Você tem certeza que deseja excluir o cadastro de 
                <span className="font-bold text-on-surface"> {clienteParaExcluir?.nome}</span>? 
                Esta ação não poderá ser desfeita.
              </p>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 px-4 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleExcluir}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-base font-black uppercase tracking-wider transition-all shadow-lg shadow-red-200"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}