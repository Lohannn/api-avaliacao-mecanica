/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de turmaS
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do turma no BD
let turmaDAO = require('../model/DAO/turmaDAO.js')

const getTurmas = async function () {
    let dadosTurmasJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosTurma = await turmaDAO.selectAllTurmas()

    if (dadosTurma) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosTurmasJSON.status = messages.SUCCESS_REQUEST.status
        dadosTurmasJSON.quantidade = dadosTurma.length
        dadosTurmasJSON.turmas = dadosTurma
        return dadosTurmasJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getTurmaById = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosTurmasJSON = {};

        let dadosTurma = await turmaDAO.selectTurmaById(id)

        if (dadosTurma) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosTurmasJSON.status = messages.SUCCESS_REQUEST.status
            dadosTurmasJSON.turma = dadosTurma
            return dadosTurmasJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const inserirNovaTurma = async function (dadosTurma) {
    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosTurma.nome == '' || dadosTurma.nome == undefined || dadosTurma.nome.length > 100
        || dadosTurma.sigla == '' || dadosTurma.sigla == undefined || dadosTurma.sigla.length > 5
        || dadosTurma.id_semestre == '' || dadosTurma.id_semestre == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        let resultdadosTurma = await turmaDAO.insertTurma(dadosTurma)

        if (resultdadosTurma) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novaTurma = await turmaDAO.selectLastId()

            let dadosTurmaJSon = {}
            dadosTurmaJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosTurmaJSon.turma = novaTurma

            return dadosTurmaJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const atualizarTurma = async function (dadosTurma, id) {


    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosTurma.nome == '' || dadosTurma.nome == undefined || dadosTurma.nome.length > 100
        || dadosTurma.sigla == '' || dadosTurma.sigla == undefined || dadosTurma.sigla.length > 5
        || dadosTurma.id_semestre == '' || dadosTurma.id_semestre == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosTurma.id = id


        let atualizacaoTurma = await turmaDAO.selectTurmaById(id)

        if (atualizacaoTurma) {
            let resultDadosTurma = await turmaDAO.updateTurma(dadosTurma)

            //Valida se o BD inseriu corretamente
            if (resultDadosTurma) {



                let dadosTurmaJSon = {}
                dadosTurmaJSon.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosTurmaJSon.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosTurmaJSon.turma = dadosTurma

                return dadosTurmaJSon

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }


    }

}

const deletarTurma = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdTurma = await turmaDAO.selectTurmaById(id)

        if (searchIdTurma) {
            let dadosTurma = await turmaDAO.deleteTurma(id)

            if (dadosTurma) {
                return messages.SUCCESS_DELETED_ITEM
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else{
            return messages.ERROR_INVALID_ID
        }


    }

}

module.exports = {
    inserirNovaTurma,
    getTurmas,
    getTurmaById,
    atualizarTurma,
    deletarTurma
}