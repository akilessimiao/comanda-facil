import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Settings, BarChart3, 
  LogOut, UserCircle, Lock, Plus 
} from 'lucide-react';

// Páginas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import PDV from './pages/PDV';
import Estoque from './pages/Estoque';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import AdminLDT from './pages/AdminLDT';
import ProtectedRoute from './components/ProtectedRoute';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const NavLink = ({ to, icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-slate-900 text-slate-300 h-screen w-64 fixed left-0 top-0 p-4 flex flex-col shadow-2xl z-50 no-print">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-4">
        <div className="bg-blue-600 p-2.5 rounded-xl">
          <ShoppingCart className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-white font-black text-xl tracking-tighter">COMANDA</h1>
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">FÁCIL PDV</span>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">Operação</p>
        <NavLink to="/pdv" icon={<ShoppingCart size={20}/>} label="Frente de Caixa" />
        <NavLink to="/estoque" icon={<Package size={20}/>} label="Estoque" />
        
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mt-6 mb-2">Gestão</p>
        <NavLink to="/relatorios" icon={<BarChart3 size={20}/>} label="Relatórios / Z" />
        <NavLink to="/configuracoes" icon={<Settings size={20}/>} label="Configurações" />
      </div>

      {/* Rodapé */}
      <div className="border-t border-slate-800 pt-5 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-xl">
          <UserCircle className="text-slate-400" size={28} />
          <div>
            <p className="text-sm font-bold text-white">Loja Ativa</p>
            <p className="text-[10px] text-blue-400">LDT NET Partner</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 mt-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={18} /> Sair do Sistema
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/admin-ldt" element={<AdminLDT />} />

        {/* Rotas Protegidas */}
        <Route path="/pdv" element={
          <ProtectedRoute>
            <div className="ml-64 min-h-screen bg-slate-100"><Navbar /><PDV /></div>
          </ProtectedRoute>
        } />
        <Route path="/estoque" element={
          <ProtectedRoute>
            <div className="ml-64 min-h-screen bg-slate-100"><Navbar /><Estoque /></div>
          </ProtectedRoute>
        } />
        <Route path="/relatorios" element={
          <ProtectedRoute>
            <div className="ml-64 min-h-screen bg-slate-100"><Navbar /><Relatorios /></div>
          </ProtectedRoute>
        } />
        <Route path="/configuracoes" element={
          <ProtectedRoute>
            <div className="ml-64 min-h-screen bg-slate-100"><Navbar /><Configuracoes /></div>
          </ProtectedRoute>
        } />

        {/* Redirecionamento Padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Import Supabase no topo do arquivo
import { supabase } from './supabaseClient';