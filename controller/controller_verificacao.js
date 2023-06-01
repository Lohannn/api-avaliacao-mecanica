/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Verificações
 * Data: 01/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do Verificacao no BD
let verificacaoDAO = require('../model/DAO/verificacaoDAO.js')

const getVerificacaoById = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosResultadoJSON = {};

        let dadosResultado = await verificacaoDAO.selectVerificacaoById(id)

        if (dadosResultado) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosResultadoJSON.status = messages.SUCCESS_REQUEST.status
            dadosResultadoJSON.Verificacao = dadosResultado
            return dadosResultadoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const inserirNovaVerificacao = async function (dadosVerificacao) {
    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosVerificacao.verificacao_aluno == '' || dadosVerificacao.verificacao_aluno == undefined || dadosVerificacao.verificacao_aluno.length > 1
        || dadosVerificacao.confirmacao_professor == '' || dadosVerificacao.confirmacao_professor == undefined || dadosVerificacao.confirmacao_professor.length > 1
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        let resultdadosVerificacao = await verificacaoDAO.insertVerificacao(dadosVerificacao)

        if (resultdadosVerificacao) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novaVerificacao = await verificacaoDAO.selectLastId()

            let dadosVerificacaoJSon = {}
            dadosVerificacaoJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosVerificacaoJSon.Verificacao = novaVerificacao

            return dadosVerificacaoJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const atualizarVerificacao = async function (dadosVerificacao, id) {


    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosVerificacao.verificacao_aluno == '' || dadosVerificacao.verificacao_aluno == undefined || dadosVerificacao.verificacao_aluno.length > 1
    || dadosVerificacao.confirmacao_professor == '' || dadosVerificacao.confirmacao_professor == undefined || dadosVerificacao.confirmacao_professor.length > 1
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosVerificacao.id = id


        let atualizacaoVerificacao = await verificacaoDAO.selectVerificacaoById(id)

        if (atualizacaoVerificacao) {
            let resultDadosVerificacao = await verificacaoDAO.updateVerificacao(dadosVerificacao)

            //Valida se o BD inseriu corretamente
            if (resultDadosVerificacao) {

                let dadosVerificacaoJSon = {}
                dadosVerificacaoJSon.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosVerificacaoJSon.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosVerificacaoJSon.Verificacao = dadosVerificacao

                return dadosVerificacaoJSon

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }


    }

}

module.exports = {
    atualizarVerificacao,
    getVerificacaoById,
    inserirNovaVerificacao
}