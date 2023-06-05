/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Niveis de Desempenho
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
let desempenhoDAO = require('../model/DAO/desempenhoDAO.js')

//Função que retorna todos os alunos cadastrados.
const getDesempenho = async function () {
    let dadosDesempenhosJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosDesempenho = await desempenhoDAO.selectAllNiveis()

    if (dadosDesempenho) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosDesempenhosJSON.status = messages.SUCCESS_REQUEST.status
        dadosDesempenhosJSON.quantidade = dadosDesempenho.length
        dadosDesempenhosJSON.alunos = dadosDesempenho
        return dadosDesempenhosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

//Função que retorna um aluno pelo ID.
const getDesempenhoById = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosDesempenhoJson = {};

        let dadosDesempenho = await desempenhoDAO.selectNivelById(id)

        if (dadosDesempenho) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosDesempenhoJson.status = messages.SUCCESS_REQUEST.status
            dadosDesempenhoJson.aluno = dadosDesempenho
            return dadosDesempenhoJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

module.exports = {
    getDesempenho,
    getDesempenhoById
}