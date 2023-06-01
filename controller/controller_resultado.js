/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Resultados
 * Data: 01/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do Resultado no BD
let resultadoDAO = require('../model/DAO/resultadoDAO.js')

const getResultadoById = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosResultadoJSON = {};

        let dadosResultado = await resultadoDAO.selectResultadoById(id)

        if (dadosResultado) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosResultadoJSON.status = messages.SUCCESS_REQUEST.status
            dadosResultadoJSON.Resultado = dadosResultado
            return dadosResultadoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const inserirNovaResultado = async function (dadosResultado) {
    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosResultado.resultado_desejado == '' || dadosResultado.resultado_desejado == undefined || dadosResultado.resultado_desejado.length > 1
        || dadosResultado.resultado_obtido == '' || dadosResultado.resultado_obtido == undefined || dadosResultado.resultado_obtido.length > 1
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        let resultdadosResultado = await resultadoDAO.insertResultado(dadosResultado)

        if (resultdadosResultado) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novaResultado = await resultadoDAO.selectLastId()

            let dadosResultadoJSon = {}
            dadosResultadoJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosResultadoJSon.Resultado = novaResultado

            return dadosResultadoJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const atualizarResultado = async function (dadosResultado, id) {


    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosResultado.resultado_desejado == '' || dadosResultado.resultado_desejado == undefined || dadosResultado.resultado_desejado.length > 1
    || dadosResultado.resultado_obtido == '' || dadosResultado.resultado_obtido == undefined || dadosResultado.resultado_obtido.length > 1
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosResultado.id = id


        let atualizacaoResultado = await resultadoDAO.selectResultadoById(id)

        if (atualizacaoResultado) {
            let resultDadosResultado = await resultadoDAO.updateResultado(dadosResultado)

            //Valida se o BD inseriu corretamente
            if (resultDadosResultado) {



                let dadosResultadoJSon = {}
                dadosResultadoJSon.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosResultadoJSon.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosResultadoJSon.Resultado = dadosResultado

                return dadosResultadoJSon

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
    getResultadoById,
    inserirNovaResultado
}