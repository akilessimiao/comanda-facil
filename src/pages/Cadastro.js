import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const [dados, setDados] = useState({ email: '', password: '', cpf: '', nome: '' });
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email: dados.email, password: dados.password });
    if (error) return alert(error.message);

    await supabase.from('perfis').insert([{ id: data.user.id, cpf: dados.cpf, nome_completo: dados.nome, ativo: false }]);
    alert("Cadastro solicitado! Fale com a LDT NET para ativar seu acesso.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleRegistro} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Solicitar Licença</h2>
        <input type="text" placeholder="Nome Completo" className="w-full p-3 border rounded mb-3" onChange={e => setDados({...dados, nome: e.target.value})} required />
        <input type="text" placeholder="CPF (Apenas números)" className="w-full p-3 border rounded mb-3" onChange={e => setDados({...dados, cpf: e.target.value})} required />
        <input type="email" placeholder="E-mail" className="w-full p-3 border rounded mb-3" onChange={e => setDados({...dados, email: e.target.value})} required />
        <input type="password" placeholder="Senha" className="w-full p-3 border rounded mb-6" onChange={e => setDados({...dados, password: e.target.value})} required />
        <button className="w-full bg-green-600 text-white p-4 rounded-lg font-bold">CRIAR CONTA</button>
      </form>
    </div>
  );
}