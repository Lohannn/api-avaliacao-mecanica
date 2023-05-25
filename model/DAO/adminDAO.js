/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados do ADMNISTRADOR no Banco de Dados.
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const updatePassword = async function (senha){
    let sql = `update tbl_administrador
    set senha = '${senha}' where id = 1;`

    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if(resultStatus){
        return true
    } else{
        return false
    }
}

const selectAdmBySenha = async function (senha){
    let sql = `select * from tbl_administrador where BINARY senha like '${senha}'` 

    let rsAdm = await prisma.$queryRawUnsafe(sql)
    console.log(rsAdm);

    if(rsAdm){
        return rsAdm
    } else {
        return false
    }
}

module.exports = {
    updatePassword,
    selectAdmBySenha
}