/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Materias
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa, Felipe Graciano Bertanha dos Santos
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
var materiaDAO = require('../model/DAO/materiaDAO.js')

const inserirNovaMateria = async function(dadosMateria, id_professor){
    if (dadosMateria.nome == '' || dadosMateria.nome == undefined || dadosMateria.nome.length > 100
        || dadosMateria.sigla == '' || dadosMateria.sigla == undefined || dadosMateria.sigla.length > 5
        || id_professor == '' || id_professor == null || id_professor == undefined || isNaN(id_professor)
    ){
        return messages.ERROR_REQUIRED_FIELDS
    } else{
        
        let resultDadosMateria = await materiaDAO.insertMateria(dadosMateria, id_professor)

        if (resultDadosMateria) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novaMateria = await materiaDAO.selectLastIdMateria()

            let dadosMateriaJSon = {}
            dadosMateriaJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosMateriaJSon.materia = novaMateria

            return dadosMateriaJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
        
    }
}

const getAllMaterias = async function(){
    let dadosMateriaJSon= {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosMateria = await materiaDAO.selectAllMaterias()

    if (dadosMateria) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosMateriaJSon.status = messages.SUCCESS_REQUEST.status
        dadosMateriaJSon.quantidade = dadosMateria.length
        dadosMateriaJSon.materias = dadosMateria
        return dadosMateriaJSon
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getMateriaByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosMateriaJSon = {};

        let dadosMateria = await materiaDAO.selectByIdMateria(id)

        if (dadosMateria) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosMateriaJSon.status = messages.SUCCESS_REQUEST.status
            dadosMateriaJSon.materia = dadosMateria
            return dadosMateriaJSon
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getMateriaByNome = async function (nome) {
    if (nome == ''  || nome == undefined || nome.length > 100) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosMateriaJSon = {};

        let dadosMateria = await materiaDAO.selectByNomeMateria(nome)

        if (dadosMateria) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosMateriaJSon.status = messages.SUCCESS_REQUEST.status
            dadosMateriaJSon.materia = dadosMateria
            return dadosMateriaJSon
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getMateriaBySigla = async function (sigla) {
    if (sigla == ''  || sigla == undefined || sigla.length > 5) {
        return messages.ERROR_INVALID_CONTENT_TYPE
    } else {

        let dadosMateriaJSon = {};

        let dadosMateria = await materiaDAO.selectBySiglaMateria(sigla)

        if (dadosMateria) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosMateriaJSon.status = messages.SUCCESS_REQUEST.status
            dadosMateriaJSon.materia = dadosMateria
            return dadosMateriaJSon
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const atualizarMateria = async function (dadosMateria, id) {

    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosMateria.nome == '' || dadosMateria.nome == undefined || dadosMateria.nome.length > 100
        || dadosMateria.sigla == '' || dadosMateria.sigla == undefined || dadosMateria.sigla.length > 5
    ){
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosMateria.id = id


        let atualizacaoMateria = await materiaDAO.selectByIdMateria(id)

        if (atualizacaoMateria) {
            let restultDadosMateria = await materiaDAO.updateMateria(dadosMateria)

            //Valida se o BD inseriu corretamente
            if (restultDadosMateria) {

                let dadosMateriaJSON = {}
                dadosMateriaJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosMateriaJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosMateriaJSON.materia = dadosMateria

                return dadosMateriaJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deletarMateria = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdMateria = await materiaDAO.selectByIdMateria(id)

        if (searchIdMateria) {
            let dadosMateria = await materiaDAO.deleteMateria(id)

            if (dadosMateria) {
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
    inserirNovaMateria,
    getAllMaterias,
    atualizarMateria,
    getMateriaByNome,
    getMateriaByID,
    getMateriaBySigla,
    deletarMateria
}