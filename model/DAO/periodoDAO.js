/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Periodos no Banco de Dados.
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllPeriodos = async function (){
    let sql = 'SELECT * FROM tbl_periodo'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsPeriodo = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsPeriodo.length > 0) {
        return rsPeriodo
    } else {
        return false
    }
}

const selectByIdPeriodo = async function(id){
    let sql = `SELECT * FROM tbl_periodo where id = ${id}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsPeriodo = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsPeriodo.length > 0) {
        return rsPeriodo
    } else {
        return false
    }
}

const insertPeriodo = async function(dadosPeriodo){
    let sql = `insert into tbl_periodo
    (nome, sigla) values
    ('${dadosPeriodo.nome}',
     '${dadosPeriodo.sigla}')`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsPeriodo = await prisma.$executeRawUnsafe(sql)
    //Valida se o BD retornou algum registro
    if (rsPeriodo) {
        return rsPeriodo
    } else {
        return false
    }
}

const selectLastIdPeriodo = async function(){
    let sql = 'select * from tbl_periodo order by id desc limit 1;'

    let rsPeriodo = await prisma.$queryRawUnsafe(sql)

    if(rsPeriodo.length > 0){
        return rsPeriodo
    } else{
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updatePeriodo = async function(dadosPeriodo){
    let sql = `update tbl_periodo set 
            nome = '${dadosPeriodo.nome}',
            sigla = '${dadosPeriodo.sigla}'
        where id = ${dadosPeriodo.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

const deletePeriodo = async function (id) {

    let sql = `delete from tbl_periodo where id = ${id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    selectAllPeriodos,
    selectByIdPeriodo,
    insertPeriodo,
    selectLastIdPeriodo,
    updatePeriodo,
    deletePeriodo
}