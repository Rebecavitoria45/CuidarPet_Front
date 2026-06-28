/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Config/Api';
import Layout from '../Layout';

export default function GerenciarPets() {
  const navigate = useNavigate();
  
  // Estados de Dados
  const [pets, setPets] = useState([]);
  const [totalGeral, setTotalGeral] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Estados de Busca
  const [termoBusca, setTermoBusca] = useState('');
  const [isPesquisaAtiva, setIsPesquisaAtiva] = useState(false);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petParaExcluir, setPetParaExcluir] = useState(null);

  // 1. Carregar 5 Recentes e Contador Total
  const carregarDadosIniciais = useCallback(async () => {
    try {
      setLoading(true);
      setIsPesquisaAtiva(false);
      setTermoBusca('');

      // Faz as duas chamadas ao mesmo tempo (Performance)
      const [resRecentes, resContagem] = await Promise.all([
        api.get('/pets/recentes'),
        api.get('/pets/contar')
      ]);

      setPets(resRecentes.data);
      setTotalGeral(resContagem.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  // 2. Função de Busca Manual
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!termoBusca.trim()) return carregarDadosIniciais();

    try {
      setLoading(true);
      const response = await api.get(`/pets/buscar?nome=${termoBusca}`);
      setPets(response.data);
      setIsPesquisaAtiva(true);
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao buscar pet.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    try {
      await api.delete(`/pets/${petParaExcluir.id}`);
      setIsModalOpen(false);
      carregarDadosIniciais(); // Recarrega para atualizar contador e lista
    } catch (error) {
      alert("Erro ao excluir pet.");
    }
  };

  return (
    <Layout>
      <div className="w-full animate-entrance">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Gerenciamento de Pets</h2>
            <p className="text-on-surface-variant text-sm">
              {"Visualize os últimos pacientes cadastrados na clínica."}
            </p>
          </div>
          <button 
            onClick={() => navigate('/pets/cadastro')}
            className="bg-primary-container text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary transition-all active:scale-95 shadow-lg shadow-orange-200"
          >
            <span className="material-symbols-outlined">add</span>
            Cadastrar Pet
          </button>
        </div>

        {/* Summary Card (Estatística) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-outline-variant p-6 rounded-2xl flex items-center gap-4 shadow-sm group">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total de Pets</p>
              <p className="text-3xl font-black text-on-surface">{totalGeral.toString().padStart(2, '0')}</p>
            </div>
          </div>
        </div>

        {/* BARRA DE BUSCA (Abaixo do Quadro de Estatística) */}
        <section className="bg-white p-4 rounded-2xl border border-outline-variant mb-8 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                type="text"
                placeholder="Pesquisar pet pelo nome..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-primary-container text-white px-8 rounded-xl font-bold hover:bg-orange-600 transition-all active:scale-95">
              Buscar
            </button>
            {isPesquisaAtiva && (
              <button type="button" onClick={carregarDadosIniciais} className="px-6 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all">
                Limpar
              </button>
            )}
          </form>
        </section>

        {/* Pets Table */}
        <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-outline-variant">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Nome do Pet</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Sexo</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Cliente Vinculado (Tutor)</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {!loading && pets.map((pet) => (
                  <tr key={pet.id} className="hover:bg-orange-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-on-surface">{pet.nome}</span>
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase font-black">{pet.especie}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${pet.sexo === 'Macho' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                        {pet.sexo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {pet.tutorNome}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/pets/editar/${pet.id}`)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-orange-50 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => { setPetParaExcluir(pet); setIsModalOpen(true); }}
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
            
            {loading && (
               <div className="p-12 text-center text-primary font-bold animate-pulse">Buscando pacientes...</div>
            )}
            
            {pets.length === 0 && !loading && (
              <div className="p-12 text-center text-on-surface-variant italic">Nenhum pet encontrado para esta visualização.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Exclusão (Seu código original abaixo do return) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-red-100 animate-entrance">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full mb-6 bg-red-100 text-red-600">
                <span className="material-symbols-outlined text-5xl">pets</span>
              </div>
              <h3 className="text-2xl font-black text-on-surface mb-2">Remover Paciente?</h3>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Deseja realmente remover o prontuário de <span className="font-bold text-on-surface">{petParaExcluir?.nome}</span>? 
                Esta ação excluirá todo o histórico de consultas do animal.
              </p>
              <div className="flex gap-4 w-full">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancelar</button>
                <button onClick={handleExcluir} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-wider shadow-lg shadow-red-200 active:scale-95 transition-all">Sim, Remover</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}