// ================================================
// ROTAS DE CARROS - CRUD COMPLETO
// ================================================
// CREATE  → Cadastrar novo carro
// READ    → Listar / Ver detalhes do carro
// UPDATE  → Editar carro / Vender carro
// DELETE  → Remover carro

const express = require('express');
const router  = express.Router();
const Carro   = require('../models/Carro');

// ================================================
// MIDDLEWARE: Verifica se o usuário está logado
// ================================================
// Middleware é uma função que roda ANTES da rota
// Se não estiver logado, manda para o login

const verificarLogin = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/usuarios/login');
  }
  next(); // Está logado, pode continuar
};

// ================================================
// MIDDLEWARE: Verifica se é ADMINISTRADOR
// ================================================
const verificarAdmin = (req, res, next) => {
  if (!req.session.usuario || !req.session.usuario.isAdmin) {
    return res.status(403).send('Acesso negado! Apenas administradores.');
  }
  next();
};

// ================================================
// READ → GET /carros → Lista todos os carros
// ================================================
// Esta é a página principal de carros, visível para todos
router.get('/', async (req, res) => {
  try {
    // READ: Busca TODOS os carros no banco de dados
    const carros = await Carro.find().sort({ createdAt: -1 }); // Mais recentes primeiro

    // Renderiza a view 'carros/lista.ejs' passando os dados
    res.render('carros/lista', {
      carros,                        // Lista de carros do banco
      usuario: req.session.usuario   // Dados do usuário logado (ou null)
    });

  } catch (erro) {
    res.status(500).send('Erro ao buscar carros: ' + erro.message);
  }
});

// ================================================
// CREATE → GET /carros/novo → Exibe formulário (só admin)
// ================================================
router.get('/novo', verificarLogin, verificarAdmin, (req, res) => {
  res.render('carros/novo', {
    erro: null,
    usuario: req.session.usuario
  });
});

// ================================================
// CREATE → POST /carros/novo → Salva o novo carro no banco
// ================================================
router.post('/novo', verificarLogin, verificarAdmin, async (req, res) => {
  try {
    // Pega os dados do formulário
    const { marca, modelo, ano, qtde_disponivel, preco } = req.body;

    // CREATE: Cria o novo documento no banco de dados
    await Carro.create({
      marca,
      modelo,
      ano:              Number(ano),
      qtde_disponivel:  Number(qtde_disponivel),
      preco:            Number(preco),
      cadastradoPor:    req.session.usuario.id  // Quem cadastrou
    });

    // Redireciona para a lista após cadastrar
    res.redirect('/carros');

  } catch (erro) {
    res.render('carros/novo', {
      erro: 'Erro ao cadastrar carro. Verifique os dados.',
      usuario: req.session.usuario
    });
  }
});

// ================================================
// UPDATE → GET /carros/editar/:id → Formulário de edição (só admin)
// ================================================
router.get('/editar/:id', verificarLogin, verificarAdmin, async (req, res) => {
  try {
    // READ: Busca o carro pelo ID para preencher o formulário
    const carro = await Carro.findById(req.params.id);

    if (!carro) return res.status(404).send('Carro não encontrado!');

    res.render('carros/editar', {
      carro,
      erro: null,
      usuario: req.session.usuario
    });

  } catch (erro) {
    res.status(500).send('Erro ao buscar carro: ' + erro.message);
  }
});

// ================================================
// UPDATE → POST /carros/editar/:id → Salva as alterações
// ================================================
router.post('/editar/:id', verificarLogin, verificarAdmin, async (req, res) => {
  try {
    const { marca, modelo, ano, qtde_disponivel, preco } = req.body;

    // Monta o objeto com os dados atualizados
    const dadosAtualizados = {
      marca,
      modelo,
      ano:             Number(ano),
      qtde_disponivel: Number(qtde_disponivel),
      preco:           Number(preco),
      // Atualiza o status baseado na quantidade
      status: Number(qtde_disponivel) === 0 ? 'vendido' : 'disponivel'
    };

    // UPDATE: Atualiza o documento no banco pelo ID
    await Carro.findByIdAndUpdate(req.params.id, dadosAtualizados, { new: true });

    res.redirect('/carros');

  } catch (erro) {
    res.status(500).send('Erro ao atualizar carro: ' + erro.message);
  }
});

// ================================================
// UPDATE → POST /carros/vender/:id → Registra uma venda
// ================================================
// Diminui a quantidade em 1 quando um carro é vendido
router.post('/vender/:id', verificarLogin, verificarAdmin, async (req, res) => {
  try {
    // READ: Busca o carro atual
    const carro = await Carro.findById(req.params.id);

    if (!carro) return res.status(404).send('Carro não encontrado!');
    if (carro.qtde_disponivel === 0) return res.redirect('/carros');

    // UPDATE: Diminui a quantidade em 1
    carro.qtde_disponivel -= 1;

    // O status é atualizado automaticamente pelo middleware do Model
    await carro.save();

    res.redirect('/carros');

  } catch (erro) {
    res.status(500).send('Erro ao registrar venda: ' + erro.message);
  }
});

// ================================================
// DELETE → POST /carros/deletar/:id → Remove o carro (só admin)
// ================================================
// Usamos POST pois HTML forms não suportam DELETE nativamente
router.post('/deletar/:id', verificarLogin, verificarAdmin, async (req, res) => {
  try {
    // DELETE: Remove o documento do banco pelo ID
    await Carro.findByIdAndDelete(req.params.id);

    res.redirect('/carros');

  } catch (erro) {
    res.status(500).send('Erro ao deletar carro: ' + erro.message);
  }
});

module.exports = router;
