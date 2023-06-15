/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Resultados no Banco de Dados.
 * Data: 12/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllresultados = async function(){
    //scriptSQL para buscar todos os itens do BD
    let sql = `select tbl_criterio.descricao,
    tbl_verificacao_matricula.resultado_desejado, tbl_verificacao_matricula.resultado_obtido, tbl_verificacao_matricula.verificacao_aluno, tbl_verificacao_matricula.confirmacao_professor
        from tbl_verificacao_matricula
            inner join tbl_criterio
                on tbl_verificacao_matricula.id_criterio = tbl_criterio.id;`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsResults = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsResults.length > 0) {
        return rsResults
    } else {
        return false
    }
}

const insertResultado = async function (dadosResultado) {
    let sql = `insert into tbl_verificacao_matricula (
        resultado_desejado,
        resultado_obtido,
        verificacao_aluno,
        confirmacao_professor,
        id_criterio
    ) values (
        '${dadosResultado.resultado_desejado}',
        '${dadosResultado.resultado_obtido}',
        '${dadosResultado.verificacao_aluno}',
        '${dadosResultado.confirmacao_professor}',
        '${dadosResultado.id_criterio}'
    )`;

    //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true

    } else {
        return false
    }
}

const selectResultadoById = async function (Id) {
    let sql = `select * from tbl_verificacao_matricula where id = ${Id}`

    let rsResultado = await prisma.$queryRawUnsafe(sql)

    if (rsResultado.length > 0) {
        return rsResultado;
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_verificacao_matricula order by id desc limit 1;'

    let rsResultado = await prisma.$queryRawUnsafe(sql)

    if (rsResultado.length > 0) {
        return rsResultado
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateResultado = async function (dadosResultado, id_resultado) {
    let sql = `update tbl_turma set 
    resultado_desejado = '${dadosResultado.resultado_desejado}',
    resultado_obtido = '${dadosResultado.resultado_obtido}',
    verificacao_aluno = '${dadosResultado.verificacao_aluno}',
    confirmacao_professor = '${dadosResultado.confirmacao_professor}'
        where id = ${id_resultado}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    insertResultado,
    selectLastId,
    selectResultadoById,
    updateResultado,
    selectAllresultados
}