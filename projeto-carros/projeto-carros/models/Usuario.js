// ================================================
// PASSO 2A: Criar a COLEÇÃO de Usuários no banco
// ================================================
// O Schema define os campos que cada documento terá no MongoDB
// É como criar a "tabela" no banco de dados

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs'); // Para criptografar a senha

// Define a estrutura (campos) da coleção Usuarios
const usuarioSchema = new mongoose.Schema({

  // Campo: Nome completo do usuário
  nome: {
    type: String,      // Tipo texto
    required: true,    // Campo obrigatório
    trim: true         // Remove espaços em branco no início/fim
  },

  // Campo: Login (será usado para entrar no site)
  login: {
    type: String,
    required: true,
    unique: true,      // Não pode ter dois usuários com o mesmo login
    trim: true
  },

  // Campo: Senha (será salva criptografada)
  senha: {
    type: String,
    required: true
  },

  // Campo: Define se o usuário é administrador
  // Apenas admins podem cadastrar e editar carros
  isAdmin: {
    type: Boolean,
    default: false     // Por padrão, o usuário NÃO é admin
  }

}, {
  timestamps: true // Adiciona automaticamente: createdAt e updatedAt
});

// ================================================
// CRIPTOGRAFAR SENHA ANTES DE SALVAR
// ================================================
// Este código roda automaticamente ANTES de salvar um usuário
// Assim a senha nunca fica salva em texto puro no banco

usuarioSchema.pre('save', async function(next) {
  // Se a senha não foi modificada, pula a criptografia
  if (!this.isModified('senha')) return next();

  // Criptografa a senha (o número 10 define a dificuldade)
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// ================================================
// MÉTODO PARA VERIFICAR SENHA NO LOGIN
// ================================================
usuarioSchema.methods.verificarSenha = async function(senhaDigitada) {
  // Compara a senha digitada com a senha criptografada no banco
  return await bcrypt.compare(senhaDigitada, this.senha);
};

// Exporta o Model (é através dele que fazemos as operações CRUD)
module.exports = mongoose.model('Usuario', usuarioSchema);
