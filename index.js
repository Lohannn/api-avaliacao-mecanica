/**************************************************************************************************************
* Objetivo: API para integração entre Back e Banco de dados para o App de gerenciamento do curso de Mecânica.
* Autor: Lohannes da Silva Costa
* Data: 18/05/2023
* Versão: 1.0
**************************************************************************************************************/

//Import do arquivo da controller que irá solicitar a model os dados do BD.
var controllerAluno = require('./controller/controller_aluno.js')
var controllerAdm = require('./controller/controller_admin.js')
var controllerProfessor = require('./controller/controller_professor.js')

//Import do arquivo que possibilitará usar as mensagens de erro.
var messages = require('./controller/module/config.js');

const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const bodyParserJSON = bodyParser.json()

const app = express()

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')

    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())

    next()
})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de ADM.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para atualizar a senha da conta de ADM.
app.put('/v1/senai/admin/:senha', cors(), bodyParserJSON, async function (request, response) {

    //Recebe o Id do Aluno pelo parametro.
    let senhaAdmin = request.params.senha;

    let result = await controllerAdm.updateSenha(senhaAdmin)

    response.status(result.status)
    response.json(result)
})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de Alunos.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os alunos, retornar alunos pelo nome .
app.get('/v1/senai/alunos', cors(), async (request, response) => {
    let nomeAluno = request.query.nome
    let rmAluno = request.query.matricula

    if (rmAluno != undefined && nomeAluno != undefined) {
        let dadosAluno = await controllerAluno.getAlunoByNameAndRm(nomeAluno, rmAluno);

        response.json(dadosAluno)
        response.status(dadosAluno.status)
    } else if (nomeAluno != undefined) {
        //Recebe os dados do controller
        let dadosAluno = await controllerAluno.getAlunoByNome(nomeAluno);


        //Valida se existe registro
        response.json(dadosAluno)
        response.status(dadosAluno.status)
    } else if (rmAluno != undefined) {
        let dadosAluno = await controllerAluno.getAlunoByRm(rmAluno);


        //Valida se existe registro
        response.json(dadosAluno)
        response.status(dadosAluno.status)
    } else {

        //Recebe os dados do controller
        let dadosAluno = await controllerAluno.getAlunos();

        //Valida se existe registro
        response.json(dadosAluno)
        response.status(dadosAluno.status)
    }
})

//Endpoint para retornar um aluno pelo ID.
app.get('/v1/senai/aluno/:id', cors(), async (request, response) => {
    let idAluno = request.params.id

    let dadosAluno = await controllerAluno.getAlunoByID(idAluno)

    response.status(dadosAluno.status)
    response.json(dadosAluno)
})

//Endpoint para criar um aluno.
app.post('/v1/senai/aluno', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let resultDadosAluno = await controllerAluno.inserirNovoAluno(dadosBody)

    response.status(resultDadosAluno.status)
    response.json(resultDadosAluno)
})

//Endpoint para atualizar um aluno pelo ID.
app.put('/v1/senai/aluno/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosAluno = await controllerAluno.atualizarAluno(dadosBody, id)

        response.status(resultDadosAluno.status)
        response.json(resultDadosAluno)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar um aluno pelo ID.
app.delete('/v1/senai/aluno/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoAluno = await controllerAluno.getAlunoByID(id)

    if (retornoAluno.status == 404) {
        response.status(retornoAluno.status)
        response.json(retornoAluno)
    } else {
        let resultDadosAluno = await controllerAluno.deletarAluno(id)

        response.status(resultDadosAluno.status)
        response.json(resultDadosAluno)
    }
})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de Professores.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os professores.
app.get('/v1/senai/professores', cors(), async (request, response) => {
    let dadosProfessor = await controllerProfessor.getProfessores()

    response.status(dadosProfessor.status)
    response.json(dadosProfessor)
})

//Endpoint para retornar um professor.
app.get('/v1/senai/professor/:id', cors(), async (request, response) => {
    let idProfessor = request.params.id

   

    let dadosProfessor = await controllerProfessor.getProfessorByID(idProfessor)

    response.status(dadosProfessor.status)
    response.json(dadosProfessor)
})

//Endpoint para criar um professor.
app.post('/v1/senai/professor', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let resultDadosProfessor = await controllerProfessor.inserirNovoProfessor(dadosBody)

    response.status(resultDadosProfessor.status)
    response.json(resultDadosProfessor)
})

//Endpoint para atualizar um professor pelo ID.
app.put('/v1/senai/professor/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar um professor pelo ID.
app.delete('/v1/senai/professor/:id', cors(), async function (request, response) {

})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de Turmas.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos as turmas.
app.get('/v1/senai/turmas', cors(), async (request, response) => {

})

//Endpoint para retornar uma turma pelo ID.
app.get('/v1/senai/turma/:id', cors(), async (request, response) => {

})

//Endpoint para criar uma turma.
app.post('/v1/senai/turma', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar uma turma pelo ID.
app.put('/v1/senai/turma/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar uma turma pelo ID.
app.delete('/v1/senai/turma/:id', cors(), async function (request, response) {

})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de Matérias.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos as matérias.
app.get('/v1/senai/materias', cors(), async (request, response) => {

})

//Endpoint para retornar uma matéria pelo ID.
app.get('/v1/senai/materia/:id', cors(), async (request, response) => {

})

//Endpoint para criar uma matéria.
app.post('/v1/senai/materia', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar uma matéria pelo ID.
app.put('/v1/senai/materia/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar uma matéria pelo ID.
app.delete('/v1/senai/materia/:id', cors(), async function (request, response) {

})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de Semestre.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os semestres.
app.get('/v1/senai/semestres', cors(), async (request, response) => {

})

//Endpoint para retornar um semestre pelo ID.
app.get('/v1/senai/semestre/:id', cors(), async (request, response) => {

})

//Endpoint para criar um semestre.
app.post('/v1/senai/semestre', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar um semestre pelo ID.
app.put('/v1/senai/semestre/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar um semestre pelo ID.
app.delete('/v1/senai/semestre/:id', cors(), async function (request, response) {

})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de Períodos.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os períodos.
app.get('/v1/senai/periodos', cors(), async (request, response) => {

})

//Endpoint para retornar um período pelo ID.
app.get('/v1/senai/periodo/:id', cors(), async (request, response) => {

})

//Endpoint para criar um período.
app.post('/v1/senai/periodo', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar um período pelo ID.
app.put('/v1/senai/periodo/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar um período pelo ID.
app.delete('/v1/senai/periodo/:id', cors(), async function (request, response) {

})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de Avaliações.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos as Avaliações.
app.get('/v1/senai/avaliacoes', cors(), async (request, response) => {

})

//Endpoint para retornar uma Avaliação pelo ID.
app.get('/v1/senai/avaliacao/:id', cors(), async (request, response) => {

})

//Endpoint para criar uma Avaliação.
app.post('/v1/senai/avaliacao', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar uma Avaliação pelo ID.
app.put('/v1/senai/avaliacao/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar uma Avaliação pelo ID.
app.delete('/v1/senai/avaliacao/:id', cors(), async function (request, response) {

})

/*************************************************************************************
 * Objetibo: API de controle de Critérios.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os Critérios.
app.get('/v1/senai/criterios', cors(), async (request, response) => {

})

//Endpoint para retornar um Critério pelo ID.
app.get('/v1/senai/criterio/:id', cors(), async (request, response) => {

})

//Endpoint para criar um Critério.
app.post('/v1/senai/criterio', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar um Critério pelo ID.
app.put('/v1/senai/criterio/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar um Critério pelo ID.
app.delete('/v1/senai/criterio/:id', cors(), async function (request, response) {

})

/*************************************************************************************
 * Objetibo: API de controle de Verificações.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos as Verificações.
app.get('/v1/senai/verificacoes', cors(), async (request, response) => {

})

//Endpoint para retornar uma Verificação pelo ID.
app.get('/v1/senai/verificacao/:id', cors(), async (request, response) => {

})

//Endpoint para criar uma Verificação.
app.post('/v1/senai/verificacao', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar uma Verificação pelo ID.
app.put('/v1/senai/verificacao/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar uma Verificação pelo ID.
app.delete('/v1/senai/verificacao/:id', cors(), async function (request, response) {

})

/*************************************************************************************
 * Objetibo: API de controle de Resultados.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os Resultados.
app.get('/v1/senai/resultados', cors(), async (request, response) => {

})

//Endpoint para retornar um Resultado pelo ID.
app.get('/v1/senai/resultado/:id', cors(), async (request, response) => {

})

//Endpoint para criar um Resultado.
app.post('/v1/senai/resultado', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar um Resultado pelo ID.
app.put('/v1/senai/resultado/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar um Resultado pelo ID.
app.delete('/v1/senai/resultado/:id', cors(), async function (request, response) {

})

/*************************************************************************************
 * Objetibo: API de controle de Registros de Tempo.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os Registros.
app.get('/v1/senai/registros', cors(), async (request, response) => {

})

//Endpoint para retornar um Registro pelo ID.
app.get('/v1/senai/registro/:id', cors(), async (request, response) => {

})

//Endpoint para criar um Registro.
app.post('/v1/senai/registro', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar um Registro pelo ID.
app.put('/v1/senai/registro/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar um Registro pelo ID.
app.delete('/v1/senai/registro/:id', cors(), async function (request, response) {

})

/*************************************************************************************
 * Objetibo: API de controle de Níveis de Desempenho.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os Níveis.
app.get('/v1/senai/niveis', cors(), async (request, response) => {

})

//Endpoint para retornar um Nível pelo ID.
app.get('/v1/senai/nivel/:id', cors(), async (request, response) => {

})

//Endpoint para criar um Nível.
app.post('/v1/senai/nivel', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para atualizar um Nível pelo ID.
app.put('/v1/senai/nivel/:id', cors(), bodyParserJSON, async function (request, response) {

})

//Endpoint para deletar um Nível pelo ID.
app.delete('/v1/senai/nivel/:id', cors(), async function (request, response) {

})

app.listen(8080, function () {
    console.log('Aguardando requisições na porta 8080...');
})