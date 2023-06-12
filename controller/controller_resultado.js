/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Resultados
 * Data: 12/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
let resultadoDAO = require('../model/DAO/resultadosDAO.js')

const inserirNovoResultado = async function (dadosResultados) {
    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosResultados.id_criterio == "" || dadosResultados.id_criterio == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        let resultdadosResultados = await resultadoDAO.insertResultado(dadosResultados)

        if (resultdadosResultados) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novoResultado = await resultadoDAO.selectLastId()

            let dadosResultadosJSon = {}
            dadosResultadosJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosResultadosJSon.resultado = novoResultado

            return dadosResultadosJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const getResultadoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosResultadosJson = {};

        let dadosResultados = await resultadoDAO.selectResultadoById(id)

        if (dadosResultados) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosResultadosJson.status = messages.SUCCESS_REQUEST.status
            dadosResultadosJson.resultado = dadosResultados
            return dadosResultadosJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const atualizarResultado = async function (dadosResultados, id) {
    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosResultados.id_criterio == "" || dadosResultados.id_criterio == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosResultados.id = id


        let atualizacaoResultado = await resultadoDAO.selectResultadoById(id)

        if (atualizacaoResultado) {
            let resultDadosResultado = await resultadoDAO.updateResultado(dadosResultados)

            //Valida se o BD inseriu corretamente
            if (resultDadosResultado) {

                let dadosResultadosJson = {}
                dadosResultadosJson.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosResultadosJson.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosResultadosJson.professor = dadosResultados

                return dadosResultadosJson

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

module.exports = {
    atualizarResultado,
    getResultadoByID,
    inserirNovoResultado
}