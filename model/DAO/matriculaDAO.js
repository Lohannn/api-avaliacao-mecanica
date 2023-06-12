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
    let sql = `SELECT tbl_matricula.numero as matricula , tbl_curso.nome_curso as curso , tbl_aluno.nome as aluno
	from tbl_matricula
		inner join tbl_curso 
			on tbl_curso.id = tbl_matricula.id_curso
        inner join tbl_aluno
			on tbl_aluno.id = tbl_matricula.id_aluno`

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
    let sql = `SELECT tbl_matricula.numero as matricula , tbl_curso.nome_curso as curso , tbl_aluno.nome as aluno
	from tbl_matricula
		inner join tbl_curso 
			on tbl_curso.id = tbl_matricula.id_curso
        inner join tbl_aluno
			on tbl_aluno.id = tbl_matricula.id_aluno
            where tbl_matricula.numero like '%${rm}%';`

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
    let sql = `SELECT tbl_matricula.numero as matricula , tbl_curso.nome_curso as curso , tbl_aluno.nome as aluno
	from tbl_matricula
		inner join tbl_curso 
			on tbl_curso.id = tbl_matricula.id_curso
        inner join tbl_aluno
			on tbl_aluno.id = tbl_matricula.id_aluno
            where tbl_matricula.id = ${idMatricula};`

    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    if (rsMatricula.length > 0) {
        return rsMatricula;
    } else {
        return false
    }
}

const insertMatricula = async function (dadosMatricula) {

    let sqlCheckMatricula = `SELECT EXISTS(SELECT * FROM tbl_matricula WHERE numero = '${dadosMatricula.numero}') as result;`

    let resultCheck = await prisma.$queryRawUnsafe(sqlCheckMatricula)

    if (resultCheck[0].result == 1n) {
        return false
    } else {
        let sql = `insert into tbl_matricula (
            numero,
            id_curso,
            id_aluno
            ) values (
            ${dadosMatricula.numero},
            ${dadosMatricula.id_curso},
            ${dadosMatricula.id_aluno}
            )`

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
    let sql = 'select * from tbl_matricula order by id desc limit 1;'

    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    if (rsMatricula.length > 0) {
        return rsMatricula
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateMatricula = async function (dadosMatricula) {

    let sql = `update tbl_matricula set 
            numero = '${dadosMatricula.numero}',
            id_aluno = ${dadosMatricula.id_aluno},
            id_curso = ${dadosMatricula.id_curso}
        where id = ${dadosMatricula.id}
    `

    let sqlCheckMatricula = `SELECT EXISTS(SELECT * FROM tbl_matricula WHERE numero = '${dadosMatricula.numero}') as result;`

    let resultCheck = await prisma.$queryRawUnsafe(sqlCheckMatricula)

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