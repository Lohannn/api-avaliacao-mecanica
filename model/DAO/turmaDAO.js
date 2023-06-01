/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Turmas no Banco de Dados.
 * Data: 22/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

var controllerProfessor = require('./professorDAO.js')

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllTurmas = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_turma'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsTurmas = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsTurmas.length > 0) {
        return rsTurmas
    } else {
        return false
    }

}

const insertTurma = async function (dadosTurma, id_periodo, id_professor) {
    let sql = `insert into tbl_turma (
        nome,
        sigla,
        id_semestre
    ) values (
        '${dadosTurma.nome}',
        '${dadosTurma.sigla}',
        '${dadosTurma.id_semestre}'
    )`;

    //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {

        var tblPeriodoTurmaLastId = selectTblPeriodoTurmaLastId()

        let passIdPeriodo = `update tbl_periodo_turma set id_periodo = ${id_periodo} where id = ${tblPeriodoTurmaLastId}`

        let executeSecondScript = async function(){await prisma.$executeRawUnsafe(passIdPeriodo)}

        executeSecondScript()

        var getProfessorByid = controllerProfessor.selecByIdProfessor(id_professor)

        let passIdProfessor = `update tbl_turma_professor set id_professor = ${id_professor} from tbl_turma_professor inner join tbl_professor on tbl_professor.id = tbl_turma_professor.id_professor where idProfessor = ${getProfessorByid.id}`

        let executeThirdScript = async function(){await prisma.$executeRawUnsafe(passIdProfessor)}

        executeThirdScript()


        return true

    } else {
        return false
    }
}

const selectTblPeriodoTurmaLastId = async function () {
    let sql = 'select * from tbl_periodo_turma order by id desc limit 1;'

    let rsPeriodoTurma = await prisma.$queryRawUnsafe(sql)

    if (rsPeriodoTurma.length > 0) {
        return rsPeriodoTurma
    } else {
        return false
    }
}


const selectTurmaById = async function (Id) {
    let sql = `select * from tbl_turma where id = ${Id}`

    let rsTurma = await prisma.$queryRawUnsafe(sql)

    if (rsTurma.length > 0) {
        return rsTurma;
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_turma order by id desc limit 1;'

    let rsTurma = await prisma.$queryRawUnsafe(sql)

    if (rsTurma.length > 0) {
        return rsTurma
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateTurma = async function (dadosTurma) {
    let sql = `update tbl_turma set 
            nome = '${dadosTurma.nome}',
            sigla = '${dadosTurma.sigla}',
            id_semestre = ${dadosTurma.id_semestre}
        where id = ${dadosTurma.id}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const deleteTurma = async function (id) {
    let sql = `delete from tbl_turma where id = ${id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    insertTurma,
    selectAllTurmas,
    selectTurmaById,
    selectLastId,
    updateTurma,
    deleteTurma
}