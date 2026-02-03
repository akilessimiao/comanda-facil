# 🚀 Comanda Fácil PDV - LDT NET

Sistema de Frente de Caixa (PDV) moderno, leve e focado em vendas rápidas. Funciona em navegadores (PC) e dispositivos móveis (Android/iOS), com leitor de código de barras via câmera e impressão térmica Bluetooth.

## ✨ Funcionalidades

- ✅ **Controle de Acesso** com ativação manual pelo administrador (LDT NET)
- ✅ **Frente de Caixa Rápida** com interface otimizada para celular
- ✅ **Leitor de Código de Barras** usando a câmera do celular (sem hardware extra)
- ✅ **Gestão de Estoque** com alerta de reposição automático
- ✅ **Múltiplas Formas de Pagamento**: Dinheiro, PIX (Mercado Pago), Cartão Débito/Crédito
- ✅ **Impressão Térmica** formatada para impressoras 58mm/80mm (Bluetooth)
- ✅ **Relatórios com Leitura Z** separando vendas por forma de pagamento
- ✅ **Painel Admin LDT NET** para ativar/desativar clientes remotamente

## 🛠️ Tecnologias

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Autenticação)
- **Leitor QR/Barcode**: html5-qrcode
- **Ícones**: Lucide React

## 🚀 Instalação Rápida

### 1. Clonar e instalar dependências
```bash
npx create-react-app comanda-facil
cd comanda-facil
npm install @supabase/supabase-js react-router-dom lucide-react html5-qrcode

📁 Estrutura de Pastas Recomendada

comanda-facil/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.js
│   │   └── Scanner.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Cadastro.js
│   │   ├── PDV.js
│   │   ├── Estoque.js
│   │   ├── Relatorios.js
│   │   ├── Configuracoes.js
│   │   └── AdminLDT.js
│   ├── supabaseClient.js
│   ├── App.js
│   └── index.css
├── .env
├── README.md
└── package.json

