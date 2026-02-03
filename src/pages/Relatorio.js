import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FileText, DollarSign, Zap, CreditCard, Printer } from 'lucide-react';

export default function Relatorios() {
  const [vendas, setVendas] = useState([]);
  const [resumo, setResumo] = useState({ 
    dinheiro: 0, 
    pix_mp: 0, 
    cartao_debito: 0, 
    cartao_credito: 0, 
    total: 0 
  });
  const [configLoja, setConfigLoja] = useState({ nome_loja: 'Minha Loja' });

  useEffect(() => {
    fetchVendasHoje();
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('configuracoes').select('*').eq('user_id', user.id).single();
    if (data) setConfigLoja(data);
  };

  const fetchVendasHoje = async () => {
    const hoje = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('vendas')
      .select('*')
      .gte('data_venda', hoje + 'T00:00:00')
      .lte('data_venda', hoje + 'T23:59:59')
      .order('data_venda', { ascending: false });

    if (data) {
      setVendas(data);
      const calc = data.reduce((acc, v) => {
        const metodo = v.forma_pagamento || 'dinheiro';
        acc[metodo] = (acc[metodo] || 0) + v.total;
        acc.total += v.total;
        return acc;
      }, { dinheiro: 0, pix_mp: 0, cartao_debito: 0, cartao_credito: 0, total: 0 });
      setResumo(calc);
    }
  };

  const imprimirLeituraZ = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 no-print">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-4 md:mb-0">
          <FileText className="text-blue-600" /> FECHAMENTO DE CAIXA - HOJE
        </h1>
        <button
          onClick={imprimirLeituraZ}
          className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition"
        >
          <Printer size={20} /> IMPRIMIR LEITURA Z
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 no-print">
        <CardResumo 
          titulo="Dinheiro" 
          valor={resumo.dinheiro} 
          cor="bg-green-50 text-green-700 border-green-200" 
          icon={<DollarSign size={24} />} 
        />
        <CardResumo 
          titulo="Pix" 
          valor={resumo.pix_mp} 
          cor="bg-blue-50 text-blue-700 border-blue-200" 
          icon={<Zap size={24} />} 
        />
        <CardResumo 
          titulo="Débito" 
          valor={resumo.cartao_debito} 
          cor="bg-orange-50 text-orange-700 border-orange-200" 
          icon={<CreditCard size={24} />} 
        />
        <CardResumo 
          titulo="Crédito" 
          valor={resumo.cartao_credito} 
          cor="bg-purple-50 text-purple-700 border-purple-200" 
          icon={<CreditCard size={24} />} 
        />
      </div>

      {/* Total Geral */}
      <div className="bg-blue-700 text-white p-6 rounded-2xl text-center mb-8 no-print">
        <p className="font-bold uppercase text-sm tracking-wider opacity-90">FATURAMENTO TOTAL DO DIA</p>
        <h2 className="text-4xl font-black mt-2">R$ {resumo.total.toFixed(2)}</h2>
      </div>

      {/* Lista de Vendas */}
      <div className="bg-white rounded-2xl shadow p-6 no-print">
        <h2 className="text-lg font-bold mb-4 text-slate-700">Vendas Realizadas Hoje</h2>
        {vendas.length === 0 ? (
          <p className="text-center text-slate-400 py-8">Nenhuma venda registrada hoje</p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {vendas.map((v, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{new Date(v.data_venda).toLocaleTimeString('pt-BR')}</p>
                  <p className="text-xs text-slate-500 capitalize">{v.forma_pagamento || 'dinheiro'}</p>
                </div>
                <p className="font-bold text-lg text-blue-600">R$ {v.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Área de Impressão Leitura Z */}
      <div className="print-only hidden">
        <div className="w-[58mm] font-mono text-xs p-2">
          <div className="text-center mb-2">
            <h2 className="font-bold text-lg">{configLoja.nome_loja || 'COMANDA FÁCIL PDV'}</h2>
            <p className="text-xs">LEITURA Z - FECHAMENTO DE CAIXA</p>
            <p className="text-xs mt-1">Data: {new Date().toLocaleDateString('pt-BR')}</p>
            <p className="text-xs">Hora: {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
          <div className="border-t border-b my-2 py-1">
            <div className="flex justify-between text-xs">
              <span>DINHEIRO:</span>
              <span>R$ {resumo.dinheiro.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>PIX:</span>
              <span>R$ {resumo.pix_mp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>CARTÃO DÉBITO:</span>
              <span>R$ {resumo.cartao_debito.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>CARTÃO CRÉDITO:</span>
              <span>R$ {resumo.cartao_credito.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>TOTAL GERAL:</span>
            <span>R$ {resumo.total.toFixed(2)}</span>
          </div>
          <p className="text-center mt-4 text-xs italic">Documento conferido e assinado eletronicamente</p>
          <div className="text-center mt-2 text-[8px] text-gray-500">
            Sistema: Comanda Fácil PDV • LDT NET (84) 99453-3322
          </div>
        </div>
      </div>
    </div>
  );
}

function CardResumo({ titulo, valor, cor, icon }) {
  return (
    <div className={`rounded-2xl p-5 border ${cor}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-bold text-sm">{titulo}</span>
      </div>
      <p className="text-2xl font-black">R$ {valor.toFixed(2)}</p>
    </div>
  );
}