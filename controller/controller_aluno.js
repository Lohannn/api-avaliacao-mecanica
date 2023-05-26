/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de ALUNOS
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
let alunoDAO = require('../model/DAO/alunoDAO.js')

//Função que retorna todos os alunos cadastrados.
const getAlunos = async function () {
    let dadosAlunosJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosAluno = await alunoDAO.selectAllAlunos()

    if (dadosAluno) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosAlunosJSON.status = messages.SUCCESS_REQUEST.status
        dadosAlunosJSON.quantidade = dadosAluno.length
        dadosAlunosJSON.alunos = dadosAluno
        return dadosAlunosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getAlunoByNome = async function (nomeDoAluno) {
    let dadosAlunosJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosAluno = await alunoDAO.selectAlunoByName(nomeDoAluno)

    if (dadosAluno) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosAlunosJSON.status = messages.SUCCESS_REQUEST.status
        dadosAlunosJSON.quantidade = dadosAluno.length
        dadosAlunosJSON.alunos = dadosAluno
        return dadosAlunosJSON
    } else {
        return messages.ERROR_NOT_FOUND
    }
}

const getAlunoByRm = async function (matriculaDoAluno) {
    let dadosAlunosJSON = {}

    if (String(matriculaDoAluno.length) > 20) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosAluno = await alunoDAO.selectAlunoByRm(matriculaDoAluno)

        if (dadosAluno) {
            //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
            dadosAlunosJSON.status = messages.SUCCESS_REQUEST.status
            dadosAlunosJSON.quantidade = dadosAluno.length
            dadosAlunosJSON.alunos = dadosAluno
            return dadosAlunosJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getAlunoByNameAndRm = async function (nomeDoAluno, matriculaDoAluno) {
    let dadosAlunosJSON = {}

    if (String(matriculaDoAluno.length) > 20) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosAluno = await alunoDAO.selectAlunoByNameAndRm(nomeDoAluno, matriculaDoAluno)

        if (dadosAluno) {
            //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
            dadosAlunosJSON.status = messages.SUCCESS_REQUEST.status
            dadosAlunosJSON.quantidade = dadosAluno.length
            dadosAlunosJSON.alunos = dadosAluno
            return dadosAlunosJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

//Função que retorna um aluno pelo ID.
const getAlunoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosAlunoJson = {};

        let dadosAluno = await alunoDAO.selectByIdAluno(id)

        if (dadosAluno) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosAlunoJson.status = messages.SUCCESS_REQUEST.status
            dadosAlunoJson.aluno = dadosAluno
            return dadosAlunoJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const inserirNovoAluno = async function (dadosAluno) {
    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosAluno.nome == '' || dadosAluno.nome == undefined || dadosAluno.nome.length > 100
        || dadosAluno.matricula == '' || dadosAluno.matricula == undefined || dadosAluno.matricula.length > 20
        || dadosAluno.email == '' || dadosAluno.email == undefined || dadosAluno.email.length > 255
        || dadosAluno.senha == '' || dadosAluno.senha == undefined || dadosAluno.senha.length > 20
        || dadosAluno.id_turma == '' || dadosAluno.id_turma == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        let resultDadosAluno = await alunoDAO.insertAluno(dadosAluno)

        if (resultDadosAluno) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novoAluno = await alunoDAO.selectLastId()

            let dadosAlunoJSon = {}
            dadosAlunoJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosAlunoJSon.aluno = novoAluno

            return dadosAlunoJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const atualizarAluno = async function (dadosAluno, id) {


    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosAluno.nome == '' || dadosAluno.nome == undefined || dadosAluno.nome.length > 100
        || dadosAluno.matricula == '' || dadosAluno.matricula == undefined || dadosAluno.matricula.length > 20
        || dadosAluno.email == '' || dadosAluno.email == undefined || dadosAluno.email.length > 255
        || dadosAluno.senha == '' || dadosAluno.senha == undefined || dadosAluno.senha.length > 20
        || dadosAluno.id_turma == '' || dadosAluno.id_turma == undefined 
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosAluno.id = id


        let atualizacaoAluno = await alunoDAO.selectByIdAluno(id)

        if (atualizacaoAluno) {
            let resultDadosAlunos = await alunoDAO.updateAluno(dadosAluno)

            //Valida se o BD inseriu corretamente
            if (resultDadosAlunos) {



                let dadosAlunoJSon = {}
                dadosAlunoJSon.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosAlunoJSon.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosAlunoJSon.aluno = dadosAluno

                return dadosAlunoJSon

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }


    }

}

const deletarAluno = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdAluno = await alunoDAO.selectByIdAluno(id)

        if (searchIdAluno) {
            let dadosAluno = await alunoDAO.deleteAluno(id)

            if (dadosAluno) {
                return messages.SUCCESS_DELETED_ITEM
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else{
            return messages.ERROR_INVALID_ID
        }


    }

}

const getAlunoByRmAndSenha = async function(rm, senha) {
    if (rm == '' ||   rm == undefined || senha == '' || senha == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosAlunoJson = {};

        let dadosAluno = await alunoDAO.selectAlunoByRmAndSenha(rm, senha)

        if (dadosAluno) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosAlunoJson.status = messages.SUCCESS_REQUEST.status
            dadosAlunoJson.aluno = dadosAluno
            return dadosAlunoJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}


module.exports = {
    getAlunos,
    getAlunoByID,
    getAlunoByNome,
    getAlunoByRm,
    inserirNovoAluno,
    atualizarAluno,
    getAlunoByNameAndRm,
    deletarAluno,
    getAlunoByRmAndSenha
}