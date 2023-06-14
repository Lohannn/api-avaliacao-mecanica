// **************************************************************************************
//  * Objetivo: Responsável pela regra de negócio referente ao CRUD de ALUNOS
//  * Data: 19/05/2023
//  * Autor: Lohannes da Silva Costa , Felipe Graciano Bertanha dos Santos
//  * Versão: 1.0
//  **************************************************************************************/

const criterioDAO = require('../model/DAO/criterioDAO')

//Import do arquivo de configuração das variáveis, constantes e globais.
var messages = require('./module/config.js');

//Import do arquivo DAO para acessar dados do aluno no BD
let avaliacaoDAO = require('../model/DAO/avaliacaoDAO.js')
let matriculaDAO = require('../model/DAO/matriculaDAO.js')
let turmaDAO =  require('../model/DAO/turmaDAO.js')

const getAvaliacoes = async function () {
    let dadosAvaliacaoJSON = {}

    //chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosAvaliacao = await avaliacaoDAO.selectAllAvaliacoes()

    if (dadosAvaliacao) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosAvaliacaoJSON.status = messages.SUCCESS_REQUEST.status
        dadosAvaliacaoJSON.quantidade = dadosAvaliacao.length
        dadosAvaliacaoJSON.avaliacoes = dadosAvaliacao
        return dadosAvaliacaoJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getAvaliacoesPelaTurma = async function (idTurma) {

    if (idTurma == '' || isNaN(idTurma) || idTurma == undefined) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosAvaliacaoJSON = {}

        //chama a função do arquivo DAO que irá retornar todos os registros do BD
        let dadosAvaliacao = await avaliacaoDAO.selectAllAvaliacoesByTurma(idTurma)

        if (dadosAvaliacao) {
            //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
            dadosAvaliacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosAvaliacaoJSON.quantidade = dadosAvaliacao.length
            dadosAvaliacaoJSON.avaliacoes = dadosAvaliacao
            return dadosAvaliacaoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const getAvaliacaoPeloId = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosAvaliacaoJSON = {}

        //chama a função do arquivo DAO que irá retornar todos os registros do BD
        let dadosAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(id)

        if (dadosAvaliacao) {
            //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
            dadosAvaliacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosAvaliacaoJSON.avaliacao = dadosAvaliacao
            return dadosAvaliacaoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }

}

const getAvaliacaoPeloNome = async function (nomeAvaliacao) {

    if (nomeAvaliacao == '' || nomeAvaliacao == undefined || nomeAvaliacao.length > 100) {
        return messages.ERROR_INVALID_CONTENT_TYPE
    } else {
        let dadosAvaliacaoJSON = {}

        //chama a função do arquivo DAO que irá retornar todos os registros do BD
        let dadosAvaliacao = await avaliacaoDAO.selectByNomeAvaliacao(nomeAvaliacao)

        if (dadosAvaliacao) {
            //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
            dadosAvaliacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosAvaliacaoJSON.avaliacaoDAO = dadosAvaliacao
            return dadosAvaliacaoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }

}

const inserirNovaAvaliacao = async function (dadosAvaliacao) {
    //Validaçao de campos obrigatorios e limite de cracteres

    if (dadosAvaliacao.nome == '' || dadosAvaliacao.nome == undefined || dadosAvaliacao.nome.length > 100
        || dadosAvaliacao.id_professor == '' || dadosAvaliacao.id_professor == undefined || isNaN(dadosAvaliacao.id_professor)
        || dadosAvaliacao.id_turma == '' || dadosAvaliacao.id_turma == undefined || isNaN(dadosAvaliacao.id_turma)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        let resultdadosAvaliacao = await avaliacaoDAO.insertAvaliacao(dadosAvaliacao)

        if (resultdadosAvaliacao) {

            //Chama a função que vai encontrar o id gerado após o insert
            let novaAvaliacao = await avaliacaoDAO.selectLastIdAvaliacao()

            let dadosAvaliacaoJSon = {}
            dadosAvaliacaoJSon.status = messages.SUCCESS_CREATED_ITEM.status
            dadosAvaliacaoJSon.avaliacao = novaAvaliacao

            //novaAvaliacao essa avaliação tem um id, que é o que preciso passar na tabela intermediária
            let passIdAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(novaAvaliacao.idAvaliacao)
            //novaAvaliacao essa avaliaçao também possui uma turma, que é o que a matricula vai ter em igual, a matricula e a avaliação serao da mesma turma
            
            // e é isso que preciso passar na tabela intermediaria, o id das matriculas que estão na mesma turma dessa avaliação

            

            return dadosAvaliacaoJSon
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const atualizarAvaliacao = async function (dadosAvaliacao, id) {
    if (dadosAvaliacao.nome == '' || dadosAvaliacao.nome == undefined || dadosAvaliacao.nome.length > 100
        || dadosAvaliacao.id_professor == '' || dadosAvaliacao.id_professor == undefined || isNaN(dadosAvaliacao.id_professor)
        || dadosAvaliacao.id_turma == '' || dadosAvaliacao.id_turma == undefined || isNaN(dadosAvaliacao.id_turma)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosAvaliacao.id = id


        let atualizacaoAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(id)

        if (atualizacaoAvaliacao) {
            let resultdadosAvaliacao = await avaliacaoDAO.updateAvaliacao(dadosAvaliacao)

            //Valida se o BD inseriu corretamente
            if (resultdadosAvaliacao) {

                let dadosAvaliacaoJson = {}
                dadosAvaliacaoJson.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosAvaliacaoJson.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosAvaliacaoJson.avaliacao = dadosAvaliacao

                return dadosAvaliacaoJson

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deletarAvaliacao = async function (id) {
    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(id)

        if (searchIdAvaliacao) {
            let dadosAvaliacao = await avaliacaoDAO.deleteAvaliacao(id)

            if (dadosAvaliacao) {
                return messages.SUCCESS_DELETED_ITEM
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }


    }
}

// const sendAvaliacaoParaAlunos = async function(id_matricula, id_avaliacao, dadosAvaliacao){
    

//     let checkInsertAvaliacao = await inserirNovaAvaliacao(dadosAvaliacao)

//     if (checkInsertAvaliacao){
//         let checkLastIdAvaliacao = avaliacaoDAO.selectLastIdAvaliacao()
//     }

// }


module.exports = {
    getAvaliacoes,
    getAvaliacoesPelaTurma,
    getAvaliacaoPeloId,
    getAvaliacaoPeloNome,
    inserirNovaAvaliacao,
    atualizarAvaliacao,
    deletarAvaliacao
}