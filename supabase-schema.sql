-- LIMPEZA (opcional - cuidado: apaga dados existentes)
DROP FUNCTION IF EXISTS decrement_estoque;
DROP TABLE IF EXISTS vendas;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS caixas;
DROP TABLE IF EXISTS configuracoes;
DROP TABLE IF EXISTS perfis;

-- PERFIS (controle de acesso LDT NET)
CREATE TABLE perfis (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  cpf TEXT UNIQUE NOT NULL,
  nome_completo TEXT,
  ativo BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUTOS (estoque com código de barras)
CREATE TABLE produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  estoque INT DEFAULT 0,
  codigo_barras TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CAIXAS (abertura/fechamento)
CREATE TABLE caixas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  valor_abertura DECIMAL(10,2) DEFAULT 0,
  valor_fechamento DECIMAL(10,2),
  aberto_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fechado_em TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'aberto'
);

-- VENDAS (histórico com forma de pagamento)
CREATE TABLE vendas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  caixa_id UUID REFERENCES caixas,
  total DECIMAL(10,2) NOT NULL,
  itens JSONB,
  forma_pagamento TEXT, -- 'dinheiro', 'pix_mp', 'cartao_debito', 'cartao_credito'
  status_pagamento TEXT DEFAULT 'concluido',
  data_venda TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CONFIGURAÇÕES (dados da loja e token Mercado Pago)
CREATE TABLE configuracoes (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  nome_loja TEXT,
  token_mercado_pago TEXT,
  taxa_servico DECIMAL(10,2) DEFAULT 0,
  mensagem_cupom TEXT DEFAULT 'Obrigado pela preferência!'
);

-- FUNÇÃO DE BAIXA AUTOMÁTICA DE ESTOQUE
CREATE OR REPLACE FUNCTION decrement_estoque(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE produtos
  SET estoque = estoque - 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- POLÍTICAS DE SEGURANÇA BÁSICA
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem só seu perfil" ON perfis FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários inserem seu perfil" ON perfis FOR INSERT WITH CHECK (auth.uid() = id);