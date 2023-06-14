/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Turmas no Banco de Dados.
 * Data: 22/05/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllTurmas = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_turma.id, tbl_turma.nome, tbl_turma.sigla, tbl_semestre.nome_semestre as semestre, tbl_periodo.sigla as periodo FROM tbl_turma
    inner join tbl_semestre on tbl_semestre.idSemestre = tbl_turma.id_semestre
    inner join tbl_periodo_turma on tbl_periodo_turma.id_turma = tbl_turma.id
    inner join tbl_periodo on tbl_periodo.idPeriodo = tbl_periodo_turma.id_periodo`

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

const insertTurma = async function (dadosTurma, id_periodo) {
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

        let tblPeriodoTurmaLastId = await selectTblPeriodoTurmaLastId()
        console.log(id_periodo);
        console.log(tblPeriodoTurmaLastId);

        let passIdPeriodo = `update tbl_periodo_turma set id_periodo = ${id_periodo} where tbl_periodo_turma.id = ${parseInt(tblPeriodoTurmaLastId.id)}`

        let executeSecondScript = async function(){await prisma.$executeRawUnsafe(passIdPeriodo)}

        executeSecondScript()

        return true

    } else {
        return false
    }
}

const selectTblPeriodoTurmaLastId = async function () {
    let sql = 'select tbl_periodo_turma.id from tbl_periodo_turma order by id desc limit 1'

    let rsPeriodoTurma = await prisma.$queryRawUnsafe(sql)

    if (rsPeriodoTurma.length > 0) {
        return rsPeriodoTurma[0]
    } else {
        return false
    }
}


const selectTurmaById = async function (Id) {
    let sql = `SELECT tbl_turma.id, tbl_turma.nome, tbl_turma.sigla, tbl_semestre.nome_semestre as semestre, tbl_periodo.sigla as periodo FROM tbl_turma
    inner join tbl_semestre on tbl_semestre.idSemestre = tbl_turma.id_semestre
    inner join tbl_periodo_turma on tbl_periodo_turma.id_turma = tbl_turma.id
    inner join tbl_periodo on tbl_periodo.idPeriodo = tbl_periodo_turma.id_periodo where tbl_turma.id = ${Id}`

    let rsTurma = await prisma.$queryRawUnsafe(sql)

    if (rsTurma.length > 0) {
        return rsTurma;
    } else {
        return false
    }
}

const selectTurmaByPeriodo = async function (periodoSigla) {
    let sql = `SELECT tbl_turma.id, tbl_turma.nome, tbl_turma.sigla, tbl_semestre.nome_semestre as semestre, tbl_periodo.sigla as periodo FROM tbl_turma
    inner join tbl_semestre on tbl_semestre.idSemestre = tbl_turma.id_semestre
    inner join tbl_periodo_turma on tbl_periodo_turma.id_turma = tbl_turma.id
    inner join tbl_periodo on tbl_periodo.idPeriodo = tbl_periodo_turma.id_periodo where tbl_periodo.sigla = '${periodoSigla}'`

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

const updateTurma = async function (dadosTurma, id_turma) {
    let sql = `update tbl_turma set 
            nome = '${dadosTurma.nome}',
            sigla = '${dadosTurma.sigla}',
            id_semestre = ${dadosTurma.id_semestre}
        where id = ${id_turma}
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
    deleteTurma,
    selectTurmaByPeriodo
}