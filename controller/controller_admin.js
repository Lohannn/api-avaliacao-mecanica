/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD do Admnistrador.
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');
let adminDAO = require('../model/DAO/adminDAO.js')

const updateSenha = async function (senhaNova){
    if(senhaNova === null || senhaNova === undefined || senhaNova.length > 20){
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let senha = senhaNova;

        let resultadoUpdate = await adminDAO.updatePassword(senha)

        if (resultadoUpdate) {
            return messages.SUCCESS_UPDATED_ITEM //Status Code 201
        } else {
            return messages.ERROR_INTERNAL_SERVER //Status Code 500
        }

    }
}

module.exports = {
    updateSenha
}