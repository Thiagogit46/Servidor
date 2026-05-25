// ================================================
// PASSO 3: SERVIDOR PRINCIPAL - server.js
// ================================================
// Este é o arquivo principal que inicia toda a aplicação

// Carrega as variáveis do arquivo .env
require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const path           = require('path');
const conectarBanco  = require('./config/db');

// Importa as rotas
const rotasCarros   = require('./routes/carros');
const rotasUsuarios = require('./routes/usuarios');

// ================================================
// INICIALIZAR O EXPRESS
// ================================================
const app = express();

// ================================================
// CONECTAR AO BANCO DE DADOS
// ================================================
conectarBanco();

// ================================================
// CONFIGURAÇÕES DO EXPRESS
// ================================================

// Define EJS como motor de templates (para páginas dinâmicas)
app.set('view engine', 'ejs');
// Define a pasta onde ficam os arquivos .ejs
app.set('views', path.join(__dirname, 'views'));

// Permite ler dados de formulários HTML (req.body)
app.use(express.urlencoded({ extended: true }));
// Permite ler JSON (para APIs)
app.use(express.json());

// Define a pasta 'public' para arquivos estáticos (CSS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// ================================================
// CONFIGURAÇÃO DE SESSÃO (para manter o login)
// ================================================
app.use(session({
  secret: process.env.SESSION_SECRET, // Chave secreta do .env
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // Sessão dura 1 hora
}));

// ================================================
// MIDDLEWARE GLOBAL: Disponibiliza o usuário em TODAS as views
// ================================================
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// ================================================
// ROTAS DA APLICAÇÃO
// ================================================

// Rota principal → redireciona para a lista de carros
app.get('/', (req, res) => {
  res.redirect('/carros');
});

// Rotas de carros  → /carros
app.use('/carros', rotasCarros);

// Rotas de usuários → /usuarios
app.use('/usuarios', rotasUsuarios);

// ================================================
// INICIAR O SERVIDOR
// ================================================
const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`🚗 Servidor rodando em http://localhost:${PORTA}`);
  console.log(`📋 Acesse /carros para ver os anúncios`);
  console.log(`🔑 Acesse /usuarios/login para fazer login`);
});
