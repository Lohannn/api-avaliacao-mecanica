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

    let sqlCheckAluno = `SELECT EXISTS(SELECT * FROM tbl_aluno WHERE tbl_aluno.cpf = '${dadosAluno.cpf}') as result;`

    let resultCheck = await prisma.$queryRawUnsafe(sqlCheckAluno)

    if (resultCheck[0].result == 1n) {
        return false
    } else {
        let sql = `insert into tbl_aluno (
            nome,
            email,
            senha_email,
            cpf
        ) values (
            '${dadosAluno.nome}',
            '${dadosAluno.email}',
            '${dadosAluno.senha_email}',
            '${dadosAluno.cpf}'
        )`;

        //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
        let resultStatus = await prisma.$executeRawUnsafe(sql)

        if (resultStatus) {
            return true
        } else {
            return false
        }
    }


}

const selectLastId = async function () {
    let sql = 'select * from tbl_aluno order by id desc limit 1;'

    let rsAluno = await prisma.$queryRawUnsafe(sql)

    if (rsAluno.length > 0) {
        return rsAluno
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateAluno = async function (dadosAluno) {

    let sql = `update tbl_aluno set 
            nome = '${dadosAluno.nome}',
            email = '${dadosAluno.email}',
            senha_email = '${dadosAluno.senha}',
            cpf = '${dadosAluno.cpf}'
        where id = ${dadosAluno.id}
    `

    let sqlCheckAluno = `SELECT EXISTS(SELECT * FROM tbl_aluno WHERE tbl_aluno.cpf = '${dadosAluno.cpf}') as result;`

    let resultCheck = await prisma.$queryRawUnsafe(sqlCheckAluno)

    if (resultCheck[0].result == 1n) {
        return false
    } else {
        //Executa o scriptSQL no BD
        let resultStatus = await prisma.$executeRawUnsafe(sql)

        if (resultStatus) {
            return true
        } else {
            return false
        }
    }
}

const deleteAluno = async function (id) {

    let sql = `delete from tbl_aluno where id = ${id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const selectAlunoByEmailAndSenha = async function (email, senha) {
    let sql = `select tbl_aluno.id, tbl_aluno.nome as nome, tbl_matricula.numero as matricula
     from tbl_aluno
        inner join tbl_matricula on tbl_aluno.id = tbl_matricula.id_aluno
      where email = '${email}' and BINARY senha_email like '${senha}'`

    let rsAluno = await prisma.$queryRawUnsafe(sql)

    if (rsAluno.length > 0) {
        return rsAluno;
    } else {
        return false
    }
}


module.exports = {
    deleteAluno,
    insertAluno,
    selectAllAlunos,
    selectAlunoByEmailAndSenha,
    selectAlunoByName,
    selectByIdAluno,
    selectLastId,
    updateAluno
}