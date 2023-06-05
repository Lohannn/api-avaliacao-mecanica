/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das Niveis de Desempenho no Banco de Dados.
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllNiveis = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_tabela_desempenho'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsDesempenho = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsDesempenho.length > 0) {
        return rsDesempenho
    } else {
        return false
    }

}

const selectNivelById = async function (idDesempenho) {
    let sql = `select * from tbl_tabela_desempenho where id = ${idDesempenho}`

    let rsDesempenho = await prisma.$queryRawUnsafe(sql)

    if (rsDesempenho.length > 0) {
        return rsDesempenho;
    } else {
        return false
    }
}


module.exports = {
    selectAllNiveis,
    selectNivelById
}