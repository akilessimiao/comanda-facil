import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("❌ " + error.message);
    else navigate('/pdv');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-black text-center text-blue-700 mb-2">Comanda Fácil</h1>
        <p className="text-center text-slate-500 mb-8 font-medium">LDT NET TELECOM</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Seu E-mail ou CPF@login.com" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Sua Senha" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button className="w-full bg-blue-700 text-white p-4 rounded-lg font-bold hover:bg-blue-800 transition">
            ENTRAR NO SISTEMA
          </button>
        </form>
        <button 
          onClick={() => navigate('/cadastro')} 
          className="w-full mt-4 text-green-600 font-bold hover:underline text-sm text-center"
        >
          Não tem conta? Solicite Acesso
        </button>
      </div>
    </div>
  );
}