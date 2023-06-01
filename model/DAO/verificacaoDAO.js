/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das Verificacoes no Banco de Dados.
 * Data: 01/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const insertVerificacao = async function (dadosVerificacao) {
    let sql = `insert into tbl_verificacao (
        verificacao_aluno,
        confirmacao_professor,
    ) values (
        '${dadosVerificacao.verificacao_aluno}',
        '${dadosVerificacao.confirmacao_professor}',
    )`;

    //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const selectVerificacaoById = async function(Id){
    let sql = `select * from tbl_verificacao where id = ${Id}`

    let rsVerificacao = await prisma.$queryRawUnsafe(sql)

    if (rsVerificacao.length > 0) {
        return rsVerificacao;
    } else {
        return false
    }
}

const selectLastId = async function(){
    let sql = 'select * from tbl_verificacao order by id desc limit 1;'

    let rsVerificacao = await prisma.$queryRawUnsafe(sql)

    if(rsVerificacao.length > 0){
        return rsVerificacao
    } else{
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateVerificacao = async function(dadosVerificacao){
    let sql = `update tbl_verificacao set 
            verificacao_aluno = '${dadosVerificacao.verificacao_aluno}',
            confirmacao_professor = '${dadosVerificacao.confirmacao_professor}'
        where id = ${dadosVerificacao.id}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    insertVerificacao,
    selectLastId,
    selectVerificacaoById,
    updateVerificacao
}