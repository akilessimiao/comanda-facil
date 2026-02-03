import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Save, Building2, Key, Percent, MessageSquare } from 'lucide-react';

export default function Configuracoes() {
  const [config, setConfig] = useState({ 
    nome_loja: '', 
    token_mercado_pago: '', 
    taxa_servico: 0,
    mensagem_cupom: 'Obrigado pela preferência!' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('configuracoes').select('*').eq('user_id', user.id).single();
    if (data) setConfig(data);
  };

  const salvarConfig = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('configuracoes').upsert({
      user_id: user.id,
      ...config,
      taxa_servico: parseFloat(config.taxa_servico) || 0
    }, { onConflict: 'user_id' });

    if (error) alert("❌ Erro ao salvar: " + error.message);
    else alert("✅ Configurações salvas com sucesso!");
    
    setLoading(false);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
        <Building2 className="text-blue-600" /> CONFIGURAÇÕES DA LOJA
      </h1>
      
      <div className="max-w-3xl bg-white p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Loja (aparece no cupom)</label>
          <input 
            type="text" 
            className="w-full p-4 border rounded-xl text-lg font-bold" 
            value={config.nome_loja}
            onChange={e => setConfig({...config, nome_loja: e.target.value})}
            placeholder="Ex: Mercearia do João" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
            <Key size={16}/> Token Mercado Pago (Ambiente de Teste)
          </label>
          <input 
            type="password" 
            className="w-full p-4 border border-blue-200 rounded-xl font-mono" 
            value={config.token_mercado_pago}
            onChange={e => setConfig({...config, token_mercado_pago: e.target.value})}
            placeholder="APP_USR-XXXXXXXXXXXXXXXXXXXXXXXX" 
          />
          <p className="text-xs text-slate-500 mt-2 bg-blue-50 p-3 rounded-lg">
            ⚠️ Para obter seu token de teste: 
            <a href="https://www.mercadopago.com.br/developers/pt/docs/checkout-api/landing" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 underline">
              Acesse o Portal do Desenvolvedor do Mercado Pago
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Percent size={16}/> Taxa de Serviço (opcional)
          </label>
          <input 
            type="number" 
            className="w-full p-4 border rounded-xl" 
            value={config.taxa_servico}
            onChange={e => setConfig({...config, taxa_servico: e.target.value})}
            placeholder="0.00" 
            step="0.01"
          />
          <p className="text-xs text-slate-400 mt-1">Será adicionada automaticamente no total da venda</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <MessageSquare size={16}/> Mensagem no Rodapé do Cupom
          </label>
          <textarea 
            className="w-full p-4 border rounded-xl min-h-[80px]" 
            value={config.mensagem_cupom}
            onChange={e => setConfig({...config, mensagem_cupom: e.target.value})}
            placeholder="Obrigado pela preferência! Volte sempre!" 
          />
        </div>

        <button
          onClick={salvarConfig} 
          disabled={loading}
          className="w-full bg-blue-700 text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-70"
        >
          <Save size={24} /> {loading ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
        </button>
      </div>
    </div>
  );
}