// src/Telas/Layout.jsx
import Sidebar from '../components/MenuLateral';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <main className="flex-1 ml-64 py-8 pl-4 pr-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}