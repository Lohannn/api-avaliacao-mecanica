/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Periodos
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa, Felipe Graciano Bertanha dos Santos
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
var periodoDAO = require('../model/DAO/periodoDAO.js')

const inserirNovoPeriodo = async function(dadosPeriodo){
    if (dadosPeriodo.nome == '' || dadosPeriodo.nome == undefined || dadosPeriodo.nome.length > 100
        || dadosPeriodo.sigla == '' || dadosPeriodo.sigla == undefined || dadosPeriodo.sigla.length > 5
    ){
        return messages.ERROR_REQUIRED_FIELDS
    } else{
        
        let resultDadosPeriodo = await periodoDAO.insertPeriodo(dadosPeriodo)
        
        if (resultDadosPeriodo) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novaPeriodo = await periodoDAO.selectLastIdPeriodo()

            let dadosPeriodoJSon = {}
            dadosPeriodoJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosPeriodoJSon.Periodo = novaPeriodo

            return dadosPeriodoJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
        
    }
}

const getAllPeriodos = async function(){
    let dadosPeriodoJSon= {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosPeriodo = await periodoDAO.selectAllPeriodos()

    if (dadosPeriodo) {
        //Criando um JSON com o atributo periodos para encaminhar um Array de periodos
        dadosPeriodoJSon.status = messages.SUCCESS_REQUEST.status
        dadosPeriodoJSon.quantidade = dadosPeriodo.length
        dadosPeriodoJSon.Periodos = dadosPeriodo
        return dadosPeriodoJSon
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getPeriodoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosPeriodoJSon = {};

        let dadosPeriodo = await periodoDAO.selectByIdPeriodo(id)

        if (dadosPeriodo) {
            //criando um JSon com o atributo periodos, para encaminhar um array de periodos
            dadosPeriodoJSon.status = messages.SUCCESS_REQUEST.status
            dadosPeriodoJSon.Periodo = dadosPeriodo
            return dadosPeriodoJSon
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const atualizarPeriodo = async function (dadosPeriodo, id) {

    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosPeriodo.nome == '' || dadosPeriodo.nome == undefined || dadosPeriodo.nome.length > 100
        || dadosPeriodo.sigla == '' || dadosPeriodo.sigla == undefined || dadosPeriodo.sigla.length > 5
    ){
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosPeriodo.id = id


        let atualizacaoPeriodo = await periodoDAO.selectByIdPeriodo(id)

        if (atualizacaoPeriodo) {
            let restultDadosPeriodo = await periodoDAO.updatePeriodo(dadosPeriodo)

            //Valida se o BD inseriu corretamente
            if (restultDadosPeriodo) {

                let dadosPeriodoJSON = {}
                dadosPeriodoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosPeriodoJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosPeriodoJSON.Periodo = dadosPeriodo

                return dadosPeriodoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deletarPeriodo = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdPeriodo = await periodoDAO.selectByIdPeriodo(id)

        if (searchIdPeriodo) {
            let dadosPeriodo = await periodoDAO.deletePeriodo(id)

            if (dadosPeriodo) {
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
    inserirNovoPeriodo,
    getAllPeriodos,
    atualizarPeriodo,
    getPeriodoByID,
    deletarPeriodo
}