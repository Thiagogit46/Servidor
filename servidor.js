require("colors");

var http = require("http");
var express = require("express");
var bodyParser = require("body-parser")
var mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://thiagoregiog_db_user:T28rg1207@thicluster.i5d4rbb.mongodb.net/?appName=ThiCluster';
const client = new MongoClient(uri, { useNewUrlParser: true });


var app = express();
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');

var server = http.createServer(app);
server.listen(80);

console.log("Servidor rodando ...".rainbow);
console.log("http://localhost:80/")

////////////////////////////////////////////// 


// // app.get('/', function(requisicao, resposta){
// //     resposta.redirect('contato.html');
// // })

// // app.get('/cadastrar',function(requisicao, resposta){
// //     console.log('Requisição recebida por get');

// //     let nome = requisicao.query.nome;
// //     let email = requisicao.query.email;
// //     let telefone = requisicao.query.telefone;
// //     let nascimento = requisicao.query.nascimento;
// //     console.log(nome, email, telefone, nascimento)
// //     resposta.render('resposta.ejs', {metodo:"GET", nome, email, telefone, nascimento});
// // })

// // app.post('/cadastrar',function(requisicao, resposta){
// //     console.log('Requisição recebida por post');

// //     let nome = requisicao.body.nome;
// //     let email = requisicao.body.email;
// //     let telefone = requisicao.body.telefone;
// //     let nascimento = requisicao.body.nascimento;
// //     console.log(nome, email, telefone, nascimento)
// //     resposta.render('resposta.ejs', {metodo:"POST", nome, email, telefone, nascimento});
// // })

// // app.get('/for', function(requisicao, resposta){
// //     let qtde = requisicao.query.qtde;
// //     console.log(qtde);
// //     resposta.render('for.ejs', {qtde})
// // })


// ////////////////////////////////////////////// 

var dbo = client.db("exemplo_bd");
var blog = dbo.collection("postagem");

//   app.post("/cadastrar_usuario", function(req, resp) {
//     var data = { db_nome: req.body.nome, db_login: req.body.login, db_senha: req.body.senha };

//     usuarios.insertOne(data, function (err) {
//       if (err) {
//         resp.render('resposta_usuario', {resposta: "Erro ao cadastrar usuário!"})
//       }else {
//         resp.render('resposta_usuario', {resposta: "Usuário cadastrado com sucesso!"})        
//       };
//     });
   
//   });

//   app.post("/logar_usuario", function(req, resp) {
//     var data = {db_login: req.body.login, db_senha: req.body.senha };

//     usuarios.find(data).toArray(function(err, items) {
//       console.log(items);
//       if (items.length == 0) {
//         resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
//       }else if (err) {
//         resp.render('resposta_usuario', {resposta: "Erro ao logar usuário!"})
//       }else {
//         resp.render('resposta_usuario', {resposta: "Usuário logado com sucesso!"})        
//       };
//     });

//   });

//   app.post("/atualizar_usuario", function(req, resp) {
//     var data = { db_login: req.body.login, db_senha: req.body.senha };
//     var newData = { $set: {db_senha: req.body.novasenha} };

//     usuarios.updateOne(data, newData, function (err, result) {
//       // console.log(result);
//       if (result.modifiedCount == 0) {
//         resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
//       }else if (err) {
//         resp.render('resposta_usuario', {resposta: "Erro ao atualizar usuário!"})
//       }else {
//         resp.render('resposta_usuario', {resposta: "Usuário atualizado com sucesso!"})        
//       };
//     });
   
//   });

   
//   app.post("/remover_usuario", function(req, resp) {
//     var data = { db_login: req.body.login, db_senha: req.body.senha };
   
//     usuarios.deleteOne(data, function (err, result) {
//       // console.log(result);
//       if (result.deletedCount == 0) {
//         resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
//       }else if (err) {
//         resp.render('resposta_usuario', {resposta: "Erro ao remover usuário!"})
//       }else {
//         resp.render('resposta_usuario', {resposta: "Usuário removido com sucesso!"})        
//       };
//     });

//   });

app.post("/postagem",function(req,resp){
  blog.find()
})

app.post("/criar_post",function(req,resp){
  var postagem={db_titulo:req.body.titulo,db_resumo:req.body.resumo,db_conteudo:req.body.db_conteudo};
  blog.insertOne(postagem,function(err) {
    if(err){
      resp.render('blog_criado',{resposta:"Erro ao Cadastrar video"})
    }else {
      resp.render('blog_criado',{resposta:"Post cadastrado com sucesso"})
    };
  });
})



//   app.post("/cadastrar_usuario", function(req, resp) {
//     var data = { db_nome: req.body.nome, db_login: req.body.login, db_senha: req.body.senha };

//     usuarios.insertOne(data, function (err) {
//       if (err) {
//         resp.render('resposta_usuario', {resposta: "Erro ao cadastrar usuário!"})
//       }else {
//         resp.render('resposta_usuario', {resposta: "Usuário cadastrado com sucesso!"})        
//       };
//     });
   
//   });
