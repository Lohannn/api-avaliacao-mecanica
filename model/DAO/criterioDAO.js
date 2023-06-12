// **************************************************************************************
//  * Objetivo: Responsável pela manipulação de dados dos Critérios no Banco de Dados.
//  * Data: 19/05/2023
//  * Autor: Lohannes da Silva Costa , Felipe Graciano Bertanha dos Santos
//  * Versão: 1.0
//  **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllCriterios = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = `select tbl_criterio.id as id, tbl_criterio.descricao as criterio , tbl_criterio.observacao from tbl_criterio`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsCriterios = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsCriterios.length > 0) {
        return rsCriterios
    } else {
        return false
    }

}

const selectByIdCriterio = async function (idCriterio) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `select * from tbl_criterio where id = ${idCriterio}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsCriterios = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsCriterios.length > 0) {
        return rsCriterios
    } else {
        return false
    }

}

const selectCriterioByAvaliacao = async function (id_avaliacao) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `select * from tbl_criterio where id_avaliacao = ${id_avaliacao}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsCriterios = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsCriterios.length > 0) {
        return rsCriterios
    } else {
        return false
    }

}

const updateCriterio = async function(dadosCriterio){
    let sql = `update tbl_criterio set 
            descricao = '${dadosCriterio.descricao}',
            observacao = '${dadosCriterio.observacao}',
            id_avaliacao = ${dadosCriterio.id_avaliacao}
        where id = ${dadosCriterio.id}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

const selectLastIdCriterio = async function(){
    let sql = 'select * from tbl_criterio order by id desc limit 1;'

    let rsCriterio = await prisma.$queryRawUnsafe(sql)

    if(rsCriterio.length > 0){
        return rsCriterio
    } else{
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const insertCriterio= async function (dadosCriterio) {
    let sql = `insert into tbl_criterio (
        descricao,
        observacao,
        id_avaliacao
    ) values (
        '${dadosCriterio.descricao}',
        '${dadosCriterio.observacao}',
        ${dadosCriterio.id_avaliacao}
    )`;

    //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const deleteCriterio = async function(idCriterio){
    let sql = `delete from tbl_criterio where id = ${idCriterio}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    selectAllCriterios,
    selectByIdCriterio,
    selectCriterioByAvaliacao,
    updateCriterio,
    selectLastIdCriterio,
    insertCriterio,
    deleteCriterio
}