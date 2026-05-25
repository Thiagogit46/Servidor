// ================================================
// ROTAS DE USUÁRIOS (Login, Cadastro, Logout)
// ================================================

const express  = require('express');
const router   = express.Router();
const Usuario  = require('../models/Usuario');

// ================================================
// GET /usuarios/cadastro → Exibe o formulário de cadastro
// ================================================
router.get('/cadastro', (req, res) => {
  // Renderiza a página cadastro.ejs passando mensagem de erro (se houver)
  res.render('usuarios/cadastro', { erro: null });
});

// ================================================
// POST /usuarios/cadastro → CRIAR usuário (CREATE)
// ================================================
router.post('/cadastro', async (req, res) => {
  try {
    // Pega os dados do formulário enviado pelo usuário
    const { nome, login, senha } = req.body;

    // Verifica se já existe um usuário com esse login
    const usuarioExistente = await Usuario.findOne({ login });
    if (usuarioExistente) {
      // Se já existe, volta para o formulário com mensagem de erro
      return res.render('usuarios/cadastro', { erro: 'Login já está em uso!' });
    }

    // Cria o novo usuário no banco de dados
    // A senha será criptografada automaticamente (ver model/Usuario.js)
    await Usuario.create({ nome, login, senha });

    // Após cadastrar, redireciona para o login
    res.redirect('/usuarios/login');

  } catch (erro) {
    res.render('usuarios/cadastro', { erro: 'Erro ao cadastrar. Tente novamente.' });
  }
});

// ================================================
// GET /usuarios/login → Exibe o formulário de login
// ================================================
router.get('/login', (req, res) => {
  res.render('usuarios/login', { erro: null });
});

// ================================================
// POST /usuarios/login → Verificar login do usuário (READ)
// ================================================
router.post('/login', async (req, res) => {
  try {
    const { login, senha } = req.body;

    // READ: Busca o usuário pelo login no banco de dados
    const usuario = await Usuario.findOne({ login });

    // Se não achou o usuário OU a senha está errada
    if (!usuario || !(await usuario.verificarSenha(senha))) {
      return res.render('usuarios/login', { erro: 'Login ou senha incorretos!' });
    }

    // Login correto! Salva o usuário na sessão (memória temporária)
    req.session.usuario = {
      id:      usuario._id,
      nome:    usuario.nome,
      login:   usuario.login,
      isAdmin: usuario.isAdmin
    };

    // Redireciona para a página principal
    res.redirect('/');

  } catch (erro) {
    res.render('usuarios/login', { erro: 'Erro ao fazer login. Tente novamente.' });
  }
});

// ================================================
// GET /usuarios/logout → Encerra a sessão
// ================================================
router.get('/logout', (req, res) => {
  // Destroi a sessão (desconecta o usuário)
  req.session.destroy();
  res.redirect('/usuarios/login');
});

module.exports = router;
