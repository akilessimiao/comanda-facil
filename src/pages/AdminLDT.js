import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Users, CheckCircle, XCircle, Search, Shield } from 'lucide-react';

export default function AdminLDT() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchClientes(); }, []);

  const fetchClientes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('perfis')
      .select('*')
      .order('criado_em', { ascending: false });
    setClientes(data || []);
    setLoading(false);
  };

  const toggleAtivo = async (id, statusAtual) => {
    const novoStatus = !statusAtual;
    const { error } = await supabase
      .from('perfis')
      .update({ ativo: novoStatus })
      .eq('id', id);
    
    if (!error) {
      fetchClientes();
      alert(`✅ Cliente ${novoStatus ? 'ATIVADO' : 'BLOQUEADO'} com sucesso!`);
    } else {
      alert("❌ Erro ao atualizar status");
    }
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome_completo?.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpf?.includes(busca.replace(/\D/g, ''))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-bold">Carregando clientes LDT NET...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-blue-400 flex items-center gap-3">
              <Shield size={36} /> LDT NET ADMIN
            </h1>
            <p className="text-slate-400 text-lg mt-2">Gestão de Licenças Comanda Fácil PDV</p>
          </div>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text" 
              placeholder="Buscar por nome ou CPF..." 
              className="pl-12 pr-4 py-3 rounded-full bg-slate-800 border border-slate-700 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-700 text-slate-300">
                <tr>
                  <th className="p-5 text-xs uppercase font-bold">Cliente</th>
                  <th className="p-5 text-xs uppercase font-bold">CPF</th>
                  <th className="p-5 text-xs uppercase font-bold">Cadastro</th>
                  <th className="p-5 text-xs uppercase font-bold">Status</th>
                  <th className="p-5 text-xs uppercase font-bold text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {clientesFiltrados.map(c => (
                  <tr key={c.id} className="hover:bg-slate-750/50 transition">
                    <td className="p-5 font-semibold text-lg">{c.nome_completo}</td>
                    <td className="p-5 text-slate-300">{c.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</td>
                    <td className="p-5 text-sm text-slate-400">
                      {new Date(c.criado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-5">
                      {c.ativo ? (
                        <span className="bg-green-500/15 text-green-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 w-fit">
                          <CheckCircle size={16} /> ATIVO
                        </span>
                      ) : (
                        <span className="bg-red-500/15 text-red-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 w-fit">
                          <XCircle size={16} /> BLOQUEADO
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => toggleAtivo(c.id, c.ativo)}
                        className={`px-6 py-3 rounded-lg font-bold text-sm transition-all transform hover:scale-105 ${
                          c.ativo 
                            ? 'bg-red-600/90 hover:bg-red-700 text-white' 
                            : 'bg-green-600/90 hover:bg-green-700 text-white'
                        }`}
                      >
                        {c.ativo ? 'SUSPENDER' : 'ATIVAR AGORA'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {clientesFiltrados.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">Nenhum cliente encontrado com "{busca}"</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-900/30 border border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
            <Shield size={20} /> Como usar este painel:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Cliente se cadastra no sistema → status inicial é <span className="text-red-400 font-bold">BLOQUEADO</span></li>
            <li>Você recebe o PIX da mensalidade → clica em <span className="text-green-400 font-bold">ATIVAR AGORA</span></li>
            <li>Cliente entra com CPF/senha → sistema libera acesso imediatamente</li>
            <li>Para suspender por inadimplência → clica em <span className="text-red-400 font-bold">SUSPENDER</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}