import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingCart, Scan, Trash2, Printer, DollarSign, Zap, CreditCard } from 'lucide-react';
import Scanner from '../components/Scanner';

export default function PDV() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [total, setTotal] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [showModalPagamento, setShowModalPagamento] = useState(false);
  const [configLoja, setConfigLoja] = useState({ nome_loja: 'Minha Loja', mensagem_cupom: 'Obrigado pela preferência!' });

  useEffect(() => { 
    fetchProdutos();
    fetchConfiguracoes();
  }, []);

  const fetchProdutos = async () => {
    const { data } = await supabase.from('produtos').select('*').gt('estoque', 0);
    setProdutos(data || []);
  };

  const fetchConfiguracoes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('configuracoes').select('*').eq('user_id', user.id).single();
    if (data) setConfigLoja(data);
  };

  const adicionarAoCarrinho = (p) => {
    setCarrinho([...carrinho, p]);
    setTotal(prev => prev + p.preco);
  };

  const handleScan = (codigo) => {
    const p = produtos.find(item => item.codigo_barras === codigo);
    if (p) adicionarAoCarrinho(p);
    else alert("⚠️ Produto não encontrado ou sem estoque!");
  };

  const finalizarVenda = () => {
    if (carrinho.length === 0) return alert("⚠️ Carrinho vazio!");
    setShowModalPagamento(true);
  };

  const processarVenda = async (metodo) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Simulação Mercado Pago (PIX)
    if (metodo === 'pix_mp') {
      alert("⚡ Gerando QR Code PIX (simulado)...\nValor: R$ " + total.toFixed(2));
    }

    const { error } = await supabase.from('vendas').insert([{
      user_id: user.id,
      total,
      itens: carrinho,
      forma_pagamento: metodo
    }]);

    if (error) return alert("❌ Erro ao salvar venda: " + error.message);

    // Baixa estoque
    for (const item of carrinho) {
      await supabase.rpc('decrement_estoque', { row_id: item.id });
    }

    // Imprime cupom
    window.print();

    // Reseta carrinho
    setCarrinho([]);
    setTotal(0);
    setShowModalPagamento(false);
    fetchProdutos();
    alert("✅ Venda finalizada com sucesso!");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100">
      {/* Lado Esquerdo - Produtos */}
      <div className="flex-1 p-4 overflow-y-auto no-print">
        <button 
          onClick={() => setShowScanner(true)} 
          className="w-full bg-blue-600 text-white p-6 rounded-2xl mb-6 font-bold flex items-center justify-center gap-3 text-2xl shadow-lg hover:bg-blue-700 transition"
        >
          <Scan size={32} /> BIPAR PRODUTO
        </button>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {produtos.map(p => (
            <button 
              key={p.id} 
              onClick={() => adicionarAoCarrinho(p)} 
              className="bg-white p-4 rounded-xl shadow border-b-4 border-blue-400 text-left hover:shadow-md transition"
            >
              <p className="font-bold text-slate-700">{p.nome}</p>
              <p className="text-blue-600 font-black text-lg">R$ {p.preco.toFixed(2)}</p>
              <p className="text-xs text-slate-400 mt-1">Estoque: {p.estoque}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Lado Direito - Carrinho */}
      <div className="w-full md:w-96 bg-white shadow-2xl flex flex-col no-print">
        <div className="p-4 bg-slate-800 text-white font-bold flex gap-2 items-center">
          <ShoppingCart size={20} /> Comanda Atual
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {carrinho.length === 0 ? (
            <p className="text-center text-slate-400 py-8">Seu carrinho está vazio</p>
          ) : (
            carrinho.map((c, i) => (
              <div key={i} className="flex justify-between border-b pb-2 text-sm">
                <span>{c.nome}</span>
                <span className="font-bold">R$ {c.preco.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 border-t bg-slate-50">
          <div className="text-3xl font-black mb-4 text-right text-slate-800">
            TOTAL: R$ {total.toFixed(2)}
          </div>
          <button 
            onClick={finalizarVenda} 
            disabled={carrinho.length === 0}
            className={`w-full py-5 rounded-2xl font-black text-2xl shadow-xl transition ${
              carrinho.length > 0 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <DollarSign size={28} className="inline mr-2" /> FINALIZAR VENDA
          </button>
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && <Scanner onScan={handleScan} onClose={() => setShowScanner(false)} />}

      {/* Modal de Pagamento */}
      {showModalPagamento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-slate-800 text-center">Forma de Pagamento</h2>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => processarVenda('dinheiro')} 
                className="bg-green-50 hover:bg-green-100 p-4 rounded-xl flex justify-between font-bold text-green-800 border-2 border-green-200"
              >
                <span>💵 DINHEIRO</span>
                <span className="text-green-600">SEM TAXA</span>
              </button>
              <button 
                onClick={() => processarVenda('pix_mp')} 
                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-xl flex justify-between font-bold text-blue-700 border-2 border-blue-200"
              >
                <span>⚡ PIX</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">MERCADO PAGO</span>
              </button>
              <button 
                onClick={() => processarVenda('cartao_debito')} 
                className="bg-orange-50 hover:bg-orange-100 p-4 rounded-xl flex justify-between font-bold text-orange-700 border-2 border-orange-200"
              >
                <span>💳 CARTÃO DÉBITO</span>
              </button>
              <button 
                onClick={() => processarVenda('cartao_credito')} 
                className="bg-purple-50 hover:bg-purple-100 p-4 rounded-xl flex justify-between font-bold text-purple-700 border-2 border-purple-200"
              >
                <span>💳 CARTÃO CRÉDITO</span>
              </button>
            </div>
            <button 
              onClick={() => setShowModalPagamento(false)} 
              className="w-full mt-6 text-slate-400 font-bold hover:text-red-500 transition"
            >
              CANCELAR VENDA
            </button>
          </div>
        </div>
      )}

      {/* Área de Impressão (Cupom Térmico) */}
      <div className="print-only hidden">
        <div className="w-[58mm] font-mono text-xs p-2">
          <div className="text-center mb-2">
            <h2 className="font-bold text-lg">{configLoja.nome_loja || 'COMANDA FÁCIL PDV'}</h2>
            <p className="text-xs">LDT NET TELECOM</p>
            <p className="text-xs mt-1">Data: {new Date().toLocaleString('pt-BR')}</p>
          </div>
          <div className="border-t border-b my-2 py-1">
            {carrinho.map((c, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span>1x {c.nome}</span>
                <span>R$ {c.preco.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>TOTAL</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <p className="text-center mt-4 text-xs italic">{configLoja.mensagem_cupom || 'Obrigado pela preferência!'}</p>
          <div className="text-center mt-2 text-[8px] text-gray-500">
            Sistema: Comanda Fácil PDV • LDT NET (84) 99453-3322
          </div>
        </div>
      </div>
    </div>
  );
}