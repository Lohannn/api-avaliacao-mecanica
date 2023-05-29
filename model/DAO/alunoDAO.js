/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos ALUNOS no Banco de Dados.
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllAlunos = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_aluno'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAluno = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAluno.length > 0) {
        return rsAluno
    } else {
        return false
    }

}

const selectAlunoByName = async function (nomeAluno) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT * FROM tbl_aluno where nome like '%${nomeAluno}%'`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAluno = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAluno.length > 0) {
        return rsAluno
    } else {
        return false
    }

}

const selectAlunoByEmail = async function (emailAluno) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT * FROM tbl_aluno where BINARY email = '${nomeAluno}'`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAluno = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAluno.length > 0) {
        return rsAluno
    } else {
        return false
    }

}

const selectAlunoByRm = async function (rmAluno) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT * FROM tbl_aluno where matricula like '${rmAluno}%'`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAluno = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAluno.length > 0) {
        return rsAluno
    } else {
        return false
    }

}

const selectAlunoByNameAndRm = async function (nomeAluno, rmAluno) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT * FROM tbl_aluno where nome like '%${nomeAluno}%' and matricula like '${rmAluno}%';`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAluno = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAluno.length > 0) {
        return rsAluno
    } else {
        return false
    }

}

const selectByIdAluno = async function (idAluno) {
    let sql = `select * from tbl_aluno where id = ${idAluno}`

    let rsAluno = await prisma.$queryRawUnsafe(sql)

    if (rsAluno.length > 0) {
        return rsAluno;
    } else {
        return false
    }
}

const insertAluno = async function (dadosAluno) {
    let sql = `insert into tbl_aluno (
        nome, 
        matricula,
        email,
        senha,
        id_turma
    ) values (
        '${dadosAluno.nome}',
        '${dadosAluno.matricula}',
        '${dadosAluno.email}',
        '${dadosAluno.senha}',
        '${dadosAluno.id_turma}'
    )`;

    //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const selectLastId = async function(){
    let sql = 'select * from tbl_aluno order by id desc limit 1;'

    let rsAluno = await prisma.$queryRawUnsafe(sql)

    if(rsAluno.length > 0){
        return rsAluno
    } else{
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateAluno = async function (dadosAluno) {

    let sql = `update tbl_aluno set 
            nome = '${dadosAluno.nome}',
            matricula = '${dadosAluno.matricula}',
            email = '${dadosAluno.email}',
            senha = '${dadosAluno.senha}',
            id_turma = ${dadosAluno.id_turma}
        where id = ${dadosAluno.id}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

const deleteAluno = async function (id) {

    let sql = `delete from tbl_aluno where id = ${id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

const selectAlunoByRmAndSenha = async function (rm, senha){
    let sql = `select * from tbl_aluno where matricula = '${rm}' and BINARY senha like '${senha}'`

    let rsAluno = await prisma.$queryRawUnsafe(sql)

    if (rsAluno.length > 0) {
        return rsAluno;
    } else {
        return false
    }
}


module.exports = {
    selectAllAlunos,
    selectByIdAluno,
    selectAlunoByName,
    insertAluno,
    selectAlunoByRm,
    selectAlunoByNameAndRm,
    selectLastId,
    updateAluno,
    deleteAluno,
    selectAlunoByRmAndSenha,
    selectAlunoByEmail
}