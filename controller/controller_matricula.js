/**************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Matricula
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
let matriculaDAO = require('../model/DAO/matriculaDAO.js')

//Função que retorna todos os alunos cadastrados.
const getMatricula = async function () {
    let dadosMatriculasJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosMatricula = await matriculaDAO.selectAllMatriculas()

    if (dadosMatricula) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosMatriculasJSON.status = messages.SUCCESS_REQUEST.status
        dadosMatriculasJSON.quantidade = dadosMatricula.length
        dadosMatriculasJSON.matriculas = dadosMatricula
        return dadosMatriculasJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getMatriculaByNumber = async function (rm) {
    let dadosMatriculasJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosMatricula = await matriculaDAO.selectMatriculaByNumber(rm)

    if (dadosMatricula) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosMatriculasJSON.status = messages.SUCCESS_REQUEST.status
        dadosMatriculasJSON.quantidade = dadosMatricula.length
        dadosMatriculasJSON.matricula = dadosMatricula
        return dadosMatriculasJSON
    } else {
        return messages.ERROR_NOT_FOUND
    }
}

const getMatriculaByTurma = async function (siglaTurma, semestre) {
    let dadosMatriculasJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosMatricula = await matriculaDAO.selectMatriculaByTurma(siglaTurma, semestre)

    if (dadosMatricula) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosMatriculasJSON.status = messages.SUCCESS_REQUEST.status
        dadosMatriculasJSON.quantidade = dadosMatricula.length
        dadosMatriculasJSON.matricula = dadosMatricula
        return dadosMatriculasJSON
    } else {
        return messages.ERROR_NOT_FOUND
    }
}

//Função que retorna um aluno pelo ID.
const getMatriculaById = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosMatriculaJson = {};

        let dadosMatricula = await matriculaDAO.selectMatriculaById(id)

        if (dadosMatricula) {
            //criando um JSon com o atributo alunos, para encaminhar um array de alunos
            dadosMatriculaJson.status = messages.SUCCESS_REQUEST.status
            dadosMatriculaJson.matricula = dadosMatricula
            return dadosMatriculaJson
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const inserirNovaMatricula = async function (dadosMatricula) {

    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosMatricula.numero == '' || dadosMatricula.numero == undefined || dadosMatricula.numero.length > 100 
        || dadosMatricula.id_aluno == '' || dadosMatricula.id_aluno == undefined
        || dadosMatricula.id_curso == '' || dadosMatricula.id_curso == undefined
        || dadosMatricula.id_turma == '' || dadosMatricula.id_turma == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        let resultDadosAluno = await matriculaDAO.insertMatricula(dadosMatricula)

        if (resultDadosAluno) {
            //Chama a função que vai encontrar o id gerado após o insert
            let novaMatricula = await matriculaDAO.selectLastId()

            let dadosMatriculaJSon = {}
            dadosMatriculaJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosMatriculaJSon.matricula = novaMatricula

            return dadosMatriculaJSon
        } else {
            return messages.ERROR_MATRICULA_ALREADY_EXISTS
        }
    }
}

const atualizarMatricula = async function (dadosMatricula, id) {

    //Validaçao de campos obrigatorios e limite de cracteres
    if (dadosMatricula.numero == '' || dadosMatricula.numero == undefined || dadosMatricula.numero.length > 100
    || dadosMatricula.id_aluno == '' || dadosMatricula.id_aluno == undefined
    || dadosMatricula.id_curso == '' || dadosMatricula.id_curso == undefined
    || dadosMatricula.id_turma == '' || dadosMatricula.id_turma == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosMatricula.id = id

        let atualizacaoMatricula = await matriculaDAO.selectMatriculaById(id)

        if (atualizacaoMatricula) {
            let resultDadosMatricula = await matriculaDAO.updateMatricula(dadosMatricula)

            //Valida se o BD inseriu corretamente
            if (resultDadosMatricula) {

                let dadosMatriculaJSon = {}
                dadosMatriculaJSon.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosMatriculaJSon.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosMatriculaJSon.matricula = dadosMatricula

                return dadosMatriculaJSon

            } else {
                return messages.ERROR_MATRICULA_ALREADY_EXISTS
            }
        } else {
            return messages.ERROR_INVALID_ID
        }


    }

}

const deletarMatricula = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdMatricula = await matriculaDAO.selectMatriculaById(id)

        if (searchIdMatricula) {
            let dadosMatricula = await matriculaDAO.deleteMatricula(id)

            if (dadosMatricula) {
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
    atualizarMatricula,
    deletarMatricula,
    getMatricula,
    getMatriculaById,
    getMatriculaByNumber,
    inserirNovaMatricula,
    getMatriculaByTurma
}

