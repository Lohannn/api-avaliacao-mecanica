/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Professores
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa , Felipe Graciano Bertanha dos Santos
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
let criterioDAO = require('../model/DAO/criterioDAO.js')

const getCriterios = async function () {
    let dadosCriteriosJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosCriterio = await criterioDAO.selectAllCriterios()

    if (dadosCriterio) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosCriteriosJSON.status = messages.SUCCESS_REQUEST.status
        dadosCriteriosJSON.quantidade = dadosCriterio.length
        dadosCriteriosJSON.criterios = dadosCriterio
        return dadosCriteriosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getCriteriosByAvaliacao = async function(id_avaliacao){
    if(id_avaliacao == '' || id_avaliacao == undefined || id_avaliacao == null ||
    isNaN(id_avaliacao)){
        return messages.ERROR_INVALID_ID
    } else {
        let dadosCriterioJson = {};

        let dadosCriterio = await criterioDAO.selectCriterioByAvaliacao(id_avaliacao)

        if (dadosCriterio) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosCriterioJson.status = messages.SUCCESS_REQUEST.status
            dadosCriterioJson.criterio = dadosCriterio
            return dadosCriterioJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
    
}

const getCriterioByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosCriterioJson = {};

        let dadosCriterio = await criterioDAO.selectByIdCriterio(id)

        if (dadosCriterio) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosCriterioJson.status = messages.SUCCESS_REQUEST.status
            dadosCriterioJson.criterio = dadosCriterio
            return dadosCriterioJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const atualizarCriterio = async function(dadosCriterio, id){
    
}


module.exports = {
    getCriterios,
    getCriteriosByAvaliacao,
    getCriterioByID
}