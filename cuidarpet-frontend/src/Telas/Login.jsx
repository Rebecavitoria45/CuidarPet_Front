import { useState } from 'react';
import api from '../config/Api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Iniciando login...");
    console.log("Matrícula:", matricula);
    console.log("Senha:", senha);

    setLoading(true);
    setErro('');

    try {
      const response = await api.post('/auth/login', {
        matricula,
        senha
      });

      console.log("Resposta do servidor:", response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      navigate('/dashboard');

    } catch (err) {
      console.log("ERRO COMPLETO:", err);
      console.log("Resposta do erro:", err.response);

      setErro(
        err.response?.data?.mensagem ||
        'Matrícula ou senha inválidos'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <span className="material-symbols-outlined absolute text-[240px] -top-20 -left-20 text-[#964900] -rotate-12">
          pets
        </span>

        <span className="material-symbols-outlined absolute text-[180px] bottom-10 -right-10 text-[#006b5e] rotate-12">
          medical_services
        </span>
      </div>

      <main className="w-full max-w-[440px] z-10 animate-fade-in-up">
        <div className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-orange-100 flex flex-col items-center">

          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCex4GjynFIht1EP1R9n8Hfrfcbvgv-r_gAXJZcHzZGeDoqU_19Ls_lXjBj9h8QnHPoNyjDMmS1q8br3EEFaOV-_xBqkFmOKXQSAxkMgnC_vX9OCDLSKVxFWx7sMVLK6vv7nPPWW_7KGCjh4lfe9bgUzD4LMmbCpkVdiS4gMEUspD3M7eIlOZY8TY02EextT1o0Sr635cZyF1LVFzY1F6qdhk71Zx7UYVy075LYoneUhgVFdlOTU9r-htktAgmIF5h0o_jop9ahIrvQ1Q"
              className="w-16 h-16 mb-2 object-contain"
              alt="Logo"
            />

            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary tracking-tight">
                CuidarPet
              </h1>

              <p className="text-on-surface-variant font-medium">
                Clínica Veterinária
              </p>
            </div>
          </div>

          {erro && (
            <div className="w-full mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">
                error
              </span>

              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Matrícula
              </label>

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  badge
                </span>

                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Senha
              </label>

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  lock
                </span>

                <input
                  type={verSenha ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setVerSenha(!verSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <span className="material-symbols-outlined">
                    {verSenha ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-container text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? 'Autenticando...' : 'Entrar'}

              {!loading && (
                <span className="material-symbols-outlined text-lg">
                  login
                </span>
              )}
            </button>

          </form>

          <footer className="mt-8 pt-6 border-t border-gray-100 w-full text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              © 2026 CUIDARPET SISTEMA VETERINÁRIO
              <br />
              USO RESTRITO PARA COLABORADORES AUTORIZADOS.
            </p>
          </footer>

        </div>
      </main>
    </div>
  );
}