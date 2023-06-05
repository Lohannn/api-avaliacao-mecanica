/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos PROFESSORES no Banco de Dados.
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllProfessores = async function () {
    let sql = 'SELECT * FROM tbl_professor'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsProfessor.length > 0) {
        return rsProfessor
    } else {
        return false
    }
}

const selecByIdProfessor = async function (idProfessor) {
    let sql = `select * from tbl_professor where idProfessor = ${idProfessor}`

    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    if (rsProfessor.length > 0) {
        return rsProfessor;
    } else {
        return false
    }
}

const insertProfessor = async function (dadosProfessor) {
    let sql = `insert into tbl_professor (
        nome,
        email,
        senha
    ) values (
        '${dadosProfessor.nome}',
        '${dadosProfessor.email}',
        '${dadosProfessor.senha}'
    )`;

    //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_professor order by idProfessor desc limit 1;'

    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    if (rsProfessor.length > 0) {
        return rsProfessor
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const selectProfessorByEmailAndSenha = async function (email, senha) {
    let sql = `select * from tbl_professor where BINARY email like '${email}' and BINARY senha like '${senha}'`

    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    if (rsProfessor.length > 0) {
        return rsProfessor
    } else {
        return false
    }
}

const updateProfessor = async function (dadosProfessor) {
    let sql = `update tbl_professor set 
            nome = '${dadosProfessor.nome}',
            email = '${dadosProfessor.email}',
            senha = '${dadosProfessor.senha}'
        where id = ${dadosProfessor.id}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const deleteProfessor = async function (idProfessor) {

    let sql = `delete from tbl_professor where idProfessor = ${idProfessor}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }

}

module.exports = {
    selectAllProfessores,
    insertProfessor,
    selecByIdProfessor,
    selectLastId,
    selectProfessorByEmailAndSenha,
    selectProfessorByEmailAndSenha,
    updateProfessor,
    deleteProfessor,
    selectProfessorByEmail
}