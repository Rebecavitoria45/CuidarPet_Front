// src/Telas/Layout.jsx
import Sidebar from '../components/MenuLateral';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />

      {/* 
         AJUSTE: 
         - ml-56 (mantém o espaço da sidebar)
         - py-8 (espaço em cima e embaixo)
         - pl-4 (reduzimos de 32px para 16px a distância do menu)
         - pr-8 (mantemos um respiro maior na direita)
      */}
      <main className="flex-1 ml-64 py-8 pl-4 pr-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}