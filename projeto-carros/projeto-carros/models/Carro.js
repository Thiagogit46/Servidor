// ================================================
// PASSO 2B: Criar a COLEÇÃO de Carros no banco
// ================================================

const mongoose = require('mongoose');

// Define a estrutura (campos) da coleção Carros
const carroSchema = new mongoose.Schema({

  // Campo: Marca do carro (ex: Toyota, Honda, Ford)
  marca: {
    type: String,
    required: true,
    trim: true
  },

  // Campo: Modelo do carro (ex: Corolla, Civic, Ka)
  modelo: {
    type: String,
    required: true,
    trim: true
  },

  // Campo: Ano de fabricação
  ano: {
    type: Number,
    required: true,
    min: 1900,          // Ano mínimo permitido
    max: new Date().getFullYear() + 1 // Até o próximo ano
  },

  // Campo: Quantidade disponível para venda
  qtde_disponivel: {
    type: Number,
    required: true,
    default: 1,
    min: 0             // Não pode ser negativo
  },

  // Campo: Preço do carro
  preco: {
    type: Number,
    required: true,
    min: 0
  },

  // Campo: Status do carro
  // "disponivel" = pode ser comprado
  // "vendido"    = já foi vendido, quantidade zerou
  status: {
    type: String,
    enum: ['disponivel', 'vendido'], // Só aceita esses dois valores
    default: 'disponivel'
  },

  // Campo: Quem cadastrou o carro (referencia o ID do usuário admin)
  cadastradoPor: {
    type: mongoose.Schema.Types.ObjectId, // Armazena o ID do usuário
    ref: 'Usuario'                         // Referencia a coleção Usuarios
  }

}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// ================================================
// ATUALIZAR STATUS AUTOMATICAMENTE
// ================================================
// Antes de salvar, verifica se a quantidade zerou
// Se zerou, muda o status para "vendido"

carroSchema.pre('save', function(next) {
  if (this.qtde_disponivel === 0) {
    this.status = 'vendido';
  } else {
    this.status = 'disponivel';
  }
  next();
});

// Exporta o Model
module.exports = mongoose.model('Carro', carroSchema);
