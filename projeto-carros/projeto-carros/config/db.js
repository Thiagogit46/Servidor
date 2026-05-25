// ================================================
// PASSO 1: Configurar a conexão com o banco de dados
// ================================================
// Mongoose é a biblioteca que conecta o Node.js ao MongoDB

const mongoose = require('mongoose');

// Função que faz a conexão com o MongoDB
const conectarBanco = async () => {
  try {
    // Usa a URL do arquivo .env para conectar
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Banco de dados MongoDB conectado com sucesso!');
  } catch (erro) {
    console.error('❌ Erro ao conectar no banco de dados:', erro.message);
    process.exit(1); // Encerra o servidor se não conseguir conectar
  }
};

module.exports = conectarBanco;
