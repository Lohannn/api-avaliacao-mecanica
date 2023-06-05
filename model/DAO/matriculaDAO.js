/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das Matriculas no Banco de Dados.
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllMatriculas = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_matricula'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMatricula.length > 0) {
        return rsMatricula
    } else {
        return false
    }

}

const selectMatriculaByNumber = async function (rm) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT * FROM tbl_matricula where numero like '%${rm}%'`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMatricula.length > 0) {
        return rsMatricula
    } else {
        return false
    }

}

const selectMatriculaById = async function (idMatricula) {
    let sql = `select * from tbl_matricula where id = ${idMatricula}`

    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    if (rsMatricula.length > 0) {
        return rsMatricula;
    } else {
        return false
    }
}

const insertMatricula = async function (dadosMatricula) {
    let sql = `insert into tbl_matricula (
        numero,
        id_aluno
    ) values (
        '${dadosAluno.numero}'
        '${dadosAluno.id_aluno}'
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
    let sql = 'select * from tbl_matricula order by id desc limit 1;'

    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    if (rsMatricula.length > 0) {
        return rsMatricula
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateMatricula = async function (dadosAluno) {

    let sql = `update tbl_matricula set 
    numero = '${dadosAluno.numero}',
            id_turma = ${dadosAluno.id_aluno}
        where id = ${dadosAluno.id}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const deleteMatricula = async function (id) {

    let sql = `delete from tbl_matricula where id = ${id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}


module.exports = {
    selectAllMatriculas,
    selectMatriculaById,
    selectMatriculaByNumber,
    deleteMatricula,
    insertMatricula,
    updateMatricula,
    selectLastId
}