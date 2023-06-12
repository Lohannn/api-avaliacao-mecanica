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
var controllerTurma = require('./controller/controller_turma.js')
var controllerMateria = require('./controller/controller_materia.js')
var controllerSemestre = require('./controller/controller_semestre.js')
var controllerPeriodo = require('./controller/controller_periodo.js')
var controllerAvaliacao = require('./controller/controller_avaliacao.js')
var controllerCriterio = require('./controller/controller_criterio.js')
var controllerMatricula = require('./controller/controller_matricula.js')
var controllerDesempenho = require('./controller/controller_desempenho.js')
var controllerResultado = require('./controller/controller_resultado.js')

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

app.get('/v1/senai/recuperar', cors(), async function (request, response) {
    let password = Math.floor(Math.random() * 10);
    for (let index = 1; index <= 3; index++) {
        let num = Math.floor(Math.random() * 10);
        password += String(num);
}

    response.json(password)
    response.status(messages.SUCCESS_REQUEST)
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

app.get('/v1/senai/admin/:senha', cors(), async function (request, response) {
    let senhaAdmin = request.params.senha;

    let result = await controllerAdm.getAdmBySenha(senhaAdmin)

    response.status(result.status)
    response.json(result)
})

//CRUD (Create, Read, Update, Delete)
/*************************************************************************************
 * Objetibo: API de controle de Matriculas.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os alunos, retornar alunos pelo nome .
app.get('/v1/senai/matriculas', cors(), async (request, response) => {
    let matricula = request.query.matricula
    let turma = request.query.turma

    if (matricula != undefined) {
        //Recebe os dados do controller
        let dadosMatricula = await controllerMatricula.getMatriculaByNumber(matricula);

        //Valida se existe registro
        response.json(dadosMatricula)
        response.status(dadosMatricula.status)
    } else if (turma != undefined) {
        //Recebe os dados do controller
        let dadosMatricula = await controllerMatricula.getMatriculaByTurma(turma);

        //Valida se existe registro
        response.json(dadosMatricula)
        response.status(dadosMatricula.status)
    } else {

        //Recebe os dados do controller
        let dadosMatricula = await controllerMatricula.getMatricula();

        //Valida se existe registro
        response.json(dadosMatricula)
        response.status(dadosMatricula.status)
    }
})

//Endpoint para retornar um aluno pelo ID.
app.get('/v1/senai/matricula/:id', cors(), async (request, response) => {
    let idMatricula = request.params.id

    let dadosMateria = await controllerMatricula.getMatriculaById(idMatricula)

    response.status(dadosMateria.status)
    response.json(dadosMateria)
})

//Endpoint para criar um aluno.
app.post('/v1/senai/matricula', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let resultDadosMatricula = await controllerMatricula.inserirNovaMatricula(dadosBody)

        response.status(resultDadosMatricula.status)
        response.json(resultDadosMatricula)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar um aluno pelo ID.
app.put('/v1/senai/matricula/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosMatricula = await controllerMatricula.atualizarMatricula(dadosBody, id)

        response.status(resultDadosMatricula.status)
        response.json(resultDadosMatricula)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar um aluno pelo ID.
app.delete('/v1/senai/matricula/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoMatricula = await controllerMatricula.getMatriculaById(id)

    if (retornoMatricula.status == 404) {
        response.status(retornoMatricula.status)
        response.json(retornoMatricula)
    } else {
        let resultDadosMatricula = await controllerMatricula.deletarMatricula(id)

        response.status(resultDadosMatricula.status)
        response.json(resultDadosMatricula)
    }
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
    let senhaAluno = request.query.senha
    let emailAluno = request.query.email

    if (emailAluno != undefined && senhaAluno != undefined) {
        //Recebe os dados do controller
        let dadosAluno = await controllerAluno.getAlunoByEmailAndSenha(emailAluno, senhaAluno);

        //Valida se existe registro
        response.json(dadosAluno)
        response.status(dadosAluno.status)
    } else if (nomeAluno != undefined) {
        //Recebe os dados do controller
        let dadosAluno = await controllerAluno.getAlunoByNome(nomeAluno);

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
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let resultDadosAluno = await controllerAluno.inserirNovoAluno(dadosBody)

        response.status(resultDadosAluno.status)
        response.json(resultDadosAluno)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
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
    let emailProfessor = request.query.email;
    let senhaProfessor = request.query.senha;

    if (emailProfessor != undefined && senhaProfessor != undefined) {

        let resultDadosProfessor = await controllerProfessor.getProfessorByEmailAndSenha(emailProfessor, senhaProfessor)

        response.status(resultDadosProfessor.status)
        response.json(resultDadosProfessor)
    } else {
        let dadosProfessor = await controllerProfessor.getProfessores()

        response.status(dadosProfessor.status)
        response.json(dadosProfessor)
    }

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
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        let dadosBody = request.body

        let resultDadosProfessor = await controllerProfessor.inserirNovoProfessor(dadosBody)

        response.status(resultDadosProfessor.status)
        response.json(resultDadosProfessor)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar um professor pelo ID.
app.put('/v1/senai/professor/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosProfessor = await controllerProfessor.atualizarProfessor(dadosBody, id)

        response.status(resultDadosProfessor.status)
        response.json(resultDadosProfessor)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar um professor pelo ID.
app.delete('/v1/senai/professor/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoProfessor = await controllerProfessor.getProfessorByID(id)

    if (retornoProfessor.status == 404) {
        response.status(retornoProfessor.status)
        response.json(retornoProfessor)
    } else {
        let resultDadosProfessor = await controllerProfessor.deletarProfessor(id)

        response.status(resultDadosProfessor.status)
        response.json(resultDadosProfessor)
    }
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
    let dadosTurma = await controllerTurma.getTurmas()

    response.status(dadosTurma.status)
    response.json(dadosTurma)
})

//Endpoint para retornar uma turma pelo ID.
app.get('/v1/senai/turma/:id', cors(), async (request, response) => {
    let idTurma = request.params.id
    let dadosTurma = await controllerTurma.getTurmaById(idTurma)

    response.status(dadosTurma.status)
    response.json(dadosTurma)
})

//Endpoint para criar uma turma.
app.post('/v1/senai/turma', cors(), bodyParserJSON, async function (request, response) {

    let professor = request.query.id_professor;
    let periodo = request.query.id_periodo;

    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {

        let dadosBody = request.body

        let resultDadosTurma = await controllerTurma.inserirNovaTurma(dadosBody, periodo, professor)

        response.status(resultDadosTurma.status)
        response.json(resultDadosTurma)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar uma turma pelo ID.
app.put('/v1/senai/turma/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosTurma = await controllerTurma.atualizarTurma(dadosBody, id)

        response.status(resultDadosTurma.status)
        response.json(resultDadosTurma)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar uma turma pelo ID.
app.delete('/v1/senai/turma/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoTurma = await controllerTurma.getTurmaById(id)

    if (retornoTurma.status == 404) {
        response.status(retornoTurma.status)
        response.json(retornoTurma)
    } else {
        let resultDadosTurma = await controllerTurma.deletarTurma(id)

        response.status(resultDadosTurma.status)
        response.json(resultDadosTurma)
    }
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
    let nome = request.query.nome;
    let sigla = request.query.sigla;

    if (nome != undefined) {
        let dadosMateria = await controllerMateria.getMateriaByNome(nome)

        response.status(dadosMateria.status)
        response.json(dadosMateria)
    } if (sigla != undefined) {
        let dadosMateria = await controllerMateria.getMateriaBySigla(sigla)

        response.status(dadosMateria.status)
        response.json(dadosMateria)
    } else {
        let dadosMateria = await controllerMateria.getAllMaterias()

        response.status(dadosMateria.status)
        response.json(dadosMateria)
    }
})

//Endpoint para retornar uma matéria pelo ID.
app.get('/v1/senai/materia/:id', cors(), async (request, response) => {
    let idMateria = request.params.id
    let dadosMateria = await controllerMateria.getMateriaByID(idMateria)

    response.status(dadosMateria.status)
    response.json(dadosMateria)
})

//Endpoint para criar uma matéria.
app.post('/v1/senai/materia', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let professor = request.query.id_professor;

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {

        let dadosBody = request.body

        let resultDadosMateria = await controllerMateria.inserirNovaMateria(dadosBody, professor)

        response.status(resultDadosMateria.status)
        response.json(resultDadosMateria)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar uma matéria pelo ID.
app.put('/v1/senai/materia/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosMateria = await controllerMateria.atualizarMateria(dadosBody, id)

        response.status(resultDadosMateria.status)
        response.json(resultDadosMateria)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar uma matéria pelo ID.
app.delete('/v1/senai/materia/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoMateria = await controllerMateria.getMateriaByID(id)

    if (retornoMateria.status == 404) {
        response.status(retornoMateria.status)
        response.json(retornoMateria)
    } else {
        let resultDadosMateria = await controllerMateria.deletarMateria(id)

        response.status(resultDadosMateria.status)
        response.json(resultDadosMateria)
    }
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
    let dadosSemestre = await controllerSemestre.getAllSemestres()

    response.status(dadosSemestre.status)
    response.json(dadosSemestre)
})

//Endpoint para retornar um semestre pelo ID.
app.get('/v1/senai/semestre/:id', cors(), async (request, response) => {
    let idSemestre = request.params.id
    let dadosSemestre = await controllerSemestre.getSemestreById(idSemestre)

    response.status(dadosSemestre.status)
    response.json(dadosSemestre)
})

//Endpoint para criar um semestre.
app.post('/v1/senai/semestre', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {

        let dadosBody = request.body

        let resultDadoSemestre = await controllerSemestre.inserirNovoSemestre(dadosBody)

        response.status(resultDadoSemestre.status)
        response.json(resultDadoSemestre)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar um semestre pelo ID.
app.put('/v1/senai/semestre/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadoSemestre = await controllerSemestre.atualizarSemestre(dadosBody, id)

        response.status(resultDadoSemestre.status)
        response.json(resultDadoSemestre)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar um semestre pelo ID.
app.delete('/v1/senai/semestre/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoSemestre = await controllerSemestre.getSemestreById(id)

    if (retornoSemestre.status == 404) {
        response.status(retornoSemestre.status)
        response.json(retornoSemestre)
    } else {
        let resultDadoSemestre = await controllerSemestre.deletarSemestre(id)

        response.status(resultDadoSemestre.status)
        response.json(resultDadoSemestre)
    }
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
    let dadosPeriodos = await controllerPeriodo.getAllPeriodos()

    response.status(dadosPeriodos.status)
    response.json(dadosPeriodos)
})

//Endpoint para retornar um período pelo ID.
app.get('/v1/senai/periodo/:id', cors(), async (request, response) => {
    let idPeriodo = request.params.id
    let dadosPeriodo = await controllerPeriodo.getPeriodoByID(idPeriodo)

    response.status(dadosPeriodo.status)
    response.json(dadosPeriodo)
})

//Endpoint para criar um período.
app.post('/v1/senai/periodo', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {

        let dadosBody = request.body

        let resultDadosPeriodo = await controllerPeriodo.inserirNovoPeriodo(dadosBody)

        response.status(resultDadosPeriodo.status)
        response.json(resultDadosPeriodo)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar um período pelo ID.
app.put('/v1/senai/periodo/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosPeriodo = await controllerPeriodo.atualizarPeriodo(dadosBody, id)

        response.status(resultDadosPeriodo.status)
        response.json(resultDadosPeriodo)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar um período pelo ID.
app.delete('/v1/senai/periodo/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoPeriodo = await controllerPeriodo.getPeriodoByID(id)

    if (retornoPeriodo.status == 404) {
        response.status(retornoPeriodo.status)
        response.json(retornoPeriodo)
    } else {
        let resultDadosPeriodo = await controllerPeriodo.deletarPeriodo(id)

        response.status(resultDadosPeriodo.status)
        response.json(resultDadosPeriodo)
    }
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

    let nome = request.query.nome;
    let idturma = request.query.turma;

    if (nome != undefined) {
        let dadosAvaliacao = await controllerAvaliacao.getAvaliacaoPeloNome(nome)

        response.status(dadosAvaliacao.status)
        response.json(dadosAvaliacao)
    } if (idturma != undefined) {
        let dadosAvaliacao = await controllerAvaliacao.getAvaliacoesPelaTurma(idturma)

        response.status(dadosAvaliacao.status)
        response.json(dadosAvaliacao)
    } else {
        let dadosAvaliacao = await controllerAvaliacao.getAvaliacoes()

        response.status(dadosAvaliacao.status)
        response.json(dadosAvaliacao)
    }


})

//Endpoint para retornar uma Avaliação pelo ID.
app.get('/v1/senai/avaliacao/:id', cors(), async (request, response) => {
    let id = request.params.id
    let dadosAvaliacao = await controllerAvaliacao.getAvaliacaoPeloId(id)

    response.status(dadosAvaliacao.status)
    response.json(dadosAvaliacao)
})

//Endpoint para criar uma Avaliação.
app.post('/v1/senai/avaliacao', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {

        let dadosBody = request.body

        let resultDadosAvaliacao = await controllerAvaliacao.inserirNovaAvaliacao(dadosBody)

        response.status(resultDadosAvaliacao.status)
        response.json(resultDadosAvaliacao)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar uma Avaliação pelo ID.
app.put('/v1/senai/avaliacao/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosAvaliacao = await controllerAvaliacao.atualizarAvaliacao(dadosBody, id)

        response.status(resultDadosAvaliacao.status)
        response.json(resultDadosAvaliacao)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar uma Avaliação pelo ID.
app.delete('/v1/senai/avaliacao/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoAvaliacao = await controllerAvaliacao.getAvaliacaoPeloId(id)

    if (retornoAvaliacao.status == 404) {
        response.status(retornoAvaliacao.status)
        response.json(retornoAvaliacao)
    } else {
        let resultDadosAvaliacao = await controllerAvaliacao.deletarAvaliacao(id)

        response.status(resultDadosAvaliacao.status)
        response.json(resultDadosAvaliacao)
    }
})

/*************************************************************************************
 * Objetibo: API de controle de Critérios.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os Critérios.
app.get('/v1/senai/criterios', cors(), async (request, response) => {
    let dadosCriterio = await controllerCriterio.getCriterios()

    response.status(dadosCriterio.status)
    response.json(dadosCriterio)
})

//Endpoint para retornar um Critério pelo ID.
app.get('/v1/senai/criterio/:id', cors(), async (request, response) => {
    let id = request.params.id
    let dadosCriterio = await controllerCriterio.getCriterioByID(id)

    response.status(dadosCriterio.status)
    response.json(dadosCriterio)
})

//Endpoint para criar um Critério.
app.post('/v1/senai/criterio', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {

        let dadosBody = request.body

        let resultDadosCriterio = await controllerCriterio.inserirNovoCriterio(dadosBody)

        response.status(resultDadosCriterio.status)
        response.json(resultDadosCriterio)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar um Critério pelo ID.
app.put('/v1/senai/criterio/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosCriterio = await controllerCriterio.atualizarCriterio(dadosBody, id)

        response.status(resultDadosCriterio.status)
        response.json(resultDadosCriterio)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para deletar um Critério pelo ID.
app.delete('/v1/senai/criterio/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let retornoCriterio = await controllerCriterio.getCriterioByID(id)

    if (retornoCriterio.status == 404) {
        response.status(retornoCriterio.status)
        response.json(retornoCriterio)
    } else {
        let resultDadosCriterio = await controllerCriterio.deletarCriterio(id)

        response.status(resultDadosCriterio.status)
        response.json(resultDadosCriterio)
    }
})

/*************************************************************************************
 * Objetibo: API de controle de Níveis de Desempenho.
 * Autor: Lohannes da Silva Costa
 * Data: 18/05/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os Níveis.
app.get('/v1/senai/niveis', cors(), async (request, response) => {
    let dadosDesempenho = await controllerDesempenho.getDesempenho()

    response.status(dadosDesempenho.status)
    response.json(dadosDesempenho)
})

//Endpoint para retornar um Nível pelo ID.
app.get('/v1/senai/nivel/:id', cors(), async (request, response) => {
    let dadosDesempenho = await controllerDesempenho.getDesempenhoById()

    response.status(dadosDesempenho.status)
    response.json(dadosDesempenho)
})

/*************************************************************************************
 * Objetibo: API de controle de Resultados.
 * Autor: Lohannes da Silva Costa
 * Data: 12/06/2023
 * Versão: 1.0
 *************************************************************************************/

//Endpoint para retornar todos os Níveis.

//Endpoint para retornar um Resultado pelo ID.
app.get('/v1/senai/resultado/:id', cors(), async (request, response) => {
    let dadosResultado = await controllerResultado.getResultadoByID()

    response.status(dadosResultado.status)
    response.json(dadosResultado)
})

//Endpoint para criar um Critério.
app.post('/v1/senai/resultado', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {

        let dadosBody = request.body

        let dadosResultado = await controllerResultado.inserirNovoResultado(dadosBody)

        response.status(dadosResultado.status)
        response.json(dadosResultado)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

//Endpoint para atualizar um Critério pelo ID.
app.put('/v1/senai/resultado/:id', cors(), bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let id = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let dadosResultado = await controllerResultado.atualizarResultado(dadosBody, id)

        response.status(dadosResultado.status)
        response.json(dadosResultado)
    } else {
        response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
    }
})

app.listen(8080, function () {
    console.log('Aguardando requisições na porta 8080...');
})