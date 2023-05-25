/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Semestres
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
let semestreDAO = require('../model/DAO/semestreDAO.js')

const getAllSemestres = async function(){
    let dadosSemestreJSon= {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosSemestre = await semestreDAO.selectAllSemestres()

    if (dadosSemestre) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosSemestreJSon.status = messages.SUCCESS_REQUEST.status
        dadosSemestreJSon.quantidade = dadosSemestre.length
        dadosSemestreJSon.semestres = dadosSemestre
        return dadosSemestreJSon
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getSemestreById = async function(id){
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosSemestreJSon = {};

        let dadosSemestre = await semestreDAO.selectByIdSemestre(id)

        if (dadosSemestre) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosSemestreJSon.status = messages.SUCCESS_REQUEST.status
            dadosSemestreJSon.semestre = dadosSemestre
            return dadosSemestreJSon
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const inserirNovoSemestre = async function(dadosSemestre){
    if (dadosSemestre.nome_semestre == '' || dadosSemestre.nome_semestre == undefined || dadosSemestre.nome_semestre.length > 20
    ){
        return messages.ERROR_REQUIRED_FIELDS
    } else{
        
        let resultDadoSemestre = await semestreDAO.insertSemestre(dadosSemestre)

        if (resultDadoSemestre) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novoSemestre = await semestreDAO.selectLastIdsemestre()

            let dadosSemestreJSon = {}
            dadosSemestreJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosSemestreJSon.semestre = novoSemestre

            return dadosSemestreJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
        
    }
}

const atualizarSemestre = async function(dadosSemestre){
    if (dadosSemestre.nome_semestre == '' || dadosSemestre.nome_semestre == undefined || dadosSemestre.nome_semestre.length > 20
    ){
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosSemestre.id = id


        let atualizacaoSemestre = await semestreDAO.selectByIdSemestre(id)

        if (atualizacaoSemestre) {
            let restultDadosSemestre = await semestreDAO.updateSemestre(dadosSemestre)

            //Valida se o BD inseriu corretamente
            if (restultDadosSemestre) {

                let dadosSemestreJSON = {}
                dadosSemestreJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosSemestreJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosSemestreJSON.semestre = dadosSemestre

                return dadosSemestreJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deletarSemestre = async function(id){
    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdSemestre = await semestreDAO.selectByIdSemestre(id)

        if (searchIdSemestre) {
            let dadosSemestre = await semestreDAO.deleteSemestre(id)

            if (dadosSemestre) {
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
    getAllSemestres,
    getSemestreById,
    inserirNovoSemestre,
    atualizarSemestre,
    deletarSemestre
}