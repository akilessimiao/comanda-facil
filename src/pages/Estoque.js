import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PlusCircle, Trash, Package, AlertTriangle, Scan } from 'lucide-react';
import Scanner from '../components/Scanner';

export default function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [novoProd, setNovoProd] = useState({ nome: '', preco: 0, estoque: 0, codigo_barras: '' });
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'baixo'
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => { fetchProdutos(); }, []);

  const fetchProdutos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('produtos').select('*').eq('user_id', user.id).order('nome');
    setProdutos(data || []);
  };

  const salvarProduto = async () => {
    if (!novoProd.nome || novoProd.preco <= 0) return alert("⚠️ Preencha nome e preço válido");
    
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('produtos').insert([{
      ...novoProd,
      user_id: user.id,
      preco: parseFloat(novoProd.preco),
      estoque: parseInt(novoProd.estoque) || 0
    }]);
    
    setNovoProd({ nome: '', preco: 0, estoque: 0, codigo_barras: '' });
    fetchProdutos();
    alert("✅ Produto cadastrado com sucesso!");
  };

  const handleScanEstoque = (codigo) => {
    setNovoProd({ ...novoProd, codigo_barras: codigo });
    setShowScanner(false);
  };

  const produtosFiltrados = produtos.filter(p => 
    filtro === 'baixo' ? p.estoque <= 5 : true
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <Package className="text-blue-600" /> Gerenciar Estoque
      </h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filtro === 'todos' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Todos os Produtos
        </button>
        <button
          onClick={() => setFiltro('baixo')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 ${
            filtro === 'baixo' 
              ? 'bg-red-600 text-white' 
              : 'bg-slate-200 text-red-600 hover:bg-red-50'
          }`}
        >
          <AlertTriangle size={16} /> Estoque Baixo
        </button>
      </div>

      {/* Formulário de Cadastro */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <h2 className="text-lg font-bold mb-4 text-slate-700">Cadastrar Novo Produto</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Nome do Produto" 
            className="p-3 border rounded-lg" 
            value={novoProd.nome}
            onChange={e => setNovoProd({...novoProd, nome: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Preço (R$)" 
            className="p-3 border rounded-lg" 
            value={novoProd.preco}
            onChange={e => setNovoProd({...novoProd, preco: e.target.value})}
            step="0.01"
          />
          <input 
            type="number" 
            placeholder="Qtd Estoque" 
            className="p-3 border rounded-lg" 
            value={novoProd.estoque}
            onChange={e => setNovoProd({...novoProd, estoque: e.target.value})}
          />
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Código de Barras" 
              className="p-3 border rounded-lg flex-1" 
              value={novoProd.codigo_barras}
              onChange={e => setNovoProd({...novoProd, codigo_barras: e.target.value})}
            />
            <button 
              onClick={() => setShowScanner(true)}
              className="bg-slate-800 text-white p-3 rounded-lg flex items-center justify-center"
            >
              <Scan size={20} />
            </button>
          </div>
          <button 
            onClick={salvarProduto}
            className="md:col-span-4 bg-blue-600 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} /> CADASTRAR PRODUTO
          </button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 font-bold text-slate-600">Produto</th>
                <th className="p-4 font-bold text-slate-600">Preço</th>
                <th className="p-4 font-bold text-slate-600">Estoque</th>
                <th className="p-4 font-bold text-slate-600">Código</th>
                <th className="p-4 font-bold text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map(p => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-700">{p.nome}</td>
                  <td className="p-4 text-blue-600 font-bold">R$ {p.preco.toFixed(2)}</td>
                  <td className={`p-4 font-bold ${
                    p.estoque <= 5 ? 'text-red-500' : 'text-green-600'
                  }`}>
                    {p.estoque} un
                  </td>
                  <td className="p-4 text-xs text-slate-500">{p.codigo_barras || '—'}</td>
                  <td className="p-4">
                    <button className="text-red-500 hover:text-red-700">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {produtosFiltrados.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            {filtro === 'baixo' 
              ? '✅ Todos os produtos estão com estoque adequado!' 
              : '📦 Nenhum produto cadastrado ainda'}
          </div>
        )}
      </div>

      {/* Scanner Modal */}
      {showScanner && <Scanner onScan={handleScanEstoque} onClose={() => setShowScanner(false)} />}
    </div>
  );
}