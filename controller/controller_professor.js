/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Professores
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
let professorDAO = require('../model/DAO/professorDAO.js')

const inserirNovoProfessor = async function (dadosProfessor) {
    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosProfessor.nome == '' || dadosProfessor.nome == undefined || dadosProfessor.nome.length > 100
        || dadosProfessor.email == '' || dadosProfessor.email == undefined || dadosProfessor.email.length > 255
        || dadosProfessor.senha == '' || dadosProfessor.senha == undefined || dadosProfessor.senha.length > 20
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        let resultdadosProfessor = await professorDAO.insertProfessor(dadosProfessor)

        if (resultdadosProfessor) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novoProfessor = await professorDAO.selectLastId()

            let dadosProfessorJSon = {}
            dadosProfessorJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosProfessorJSon.professor = novoProfessor

            return dadosProfessorJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const getProfessores = async function () {
    let dadosProfessorJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosProfessor = await professorDAO.selectAllProfessores()

    if (dadosProfessor) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosProfessorJSON.status = messages.SUCCESS_REQUEST.status
        dadosProfessorJSON.quantidade = dadosProfessor.length
        dadosProfessorJSON.professores = dadosProfessor
        return dadosProfessorJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getProfessorByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosProfessorJson = {};

        let dadosProfessor = await professorDAO.selecByIdProfessor(id)

        if (dadosProfessor) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosProfessorJson.status = messages.SUCCESS_REQUEST.status
            dadosProfessorJson.aluno = dadosProfessor
            return dadosProfessorJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getProfessorByEmailAndSenha = async function(email, senha){
    if (email == '' ||  email == undefined || senha == '' || senha == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosProfessorJson = {};

        let dadosProfessor = await professorDAO.selectProfessorByEmailAndSenha(email, senha)

        if (dadosProfessor) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosProfessorJson.status = messages.SUCCESS_REQUEST.status
            dadosProfessorJson.professor = dadosProfessor
            return dadosProfessorJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const atualizarProfessor = async function(dadosProfessor, id) {
     //Validaçao de campos obrigatorios e limite de cracteres
     if ( dadosProfessor.nome == '' || dadosProfessor.nome == undefined || dadosProfessor.nome.length > 100 ||
     dadosProfessor.email == '', dadosProfessor.email == undefined || dadosProfessor.email.length > 255 ||
     dadosProfessor.senha == '' || dadosProfessor.senha == undefined || dadosProfessor.senha.length > 20
 ) {
     return messages.ERROR_REQUIRED_FIELDS
 } else if (id == null || id == undefined || isNaN(id)) {
     return messages.ERROR_INVALID_ID
 } else {
     //Adiciona o ID do aluno no JSON dos dados
     dadosProfessor.id = id


     let atualizacaoProfessor = await professorDAO.selecByIdProfessor(id)

     if (atualizacaoProfessor) {
         let resultDadosProfessor = await professorDAO.updateProfessor(dadosProfessor)

         //Valida se o BD inseriu corretamente
         if (resultDadosProfessor) {

             let dadosProfessorJson = {}
             dadosProfessorJson.status = messages.SUCCESS_UPDATED_ITEM.status
             dadosProfessorJson.message = messages.SUCCESS_UPDATED_ITEM.message
             dadosProfessorJson.professor = dadosProfessor

             return dadosProfessorJson

         } else {
             return messages.ERROR_INTERNAL_SERVER
         }
     } else {
         return messages.ERROR_INVALID_ID
     }
}
}

const deletarProfessor = async function(id){
    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdProfessor = await professorDAO.selecByIdProfessor(id)

        if (searchIdProfessor) {
            let dadosProfessor = await professorDAO.deleteProfessor(id)

            if (dadosProfessor) {
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
    getProfessores,
    getProfessorByID,
    inserirNovoProfessor,
    getProfessorByEmailAndSenha,
    atualizarProfessor,
    deletarProfessor
}