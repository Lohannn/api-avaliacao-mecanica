/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das Avaliações no Banco de Dados.
 * Data: 19/05/2023
 * Autor: Lohannes da Silva Costa , Felipe Graciano Bertanha dos Santos
 * Versão: 1.0
 **************************************************************************************/

var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllAvaliacoes = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_avaliacao.idAvaliacao as id_avaliacao, tbl_avaliacao.nome, 
    tbl_avaliacao.somativa, tbl_avaliacao.concluida,
    tbl_professor.nome as professor,
    tbl_turma.nome as turma
    from tbl_avaliacao
       inner join tbl_professor
           on tbl_avaliacao.id_professor = tbl_professor.idProfessor
       inner join tbl_turma
           on tbl_avaliacao.id_turma = tbl_turma.id`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

    console.log(rsAvaliacao);

    //Valida se o BD retornou algum registro
    if (rsAvaliacao.length > 0) {
        return rsAvaliacao
    } else {
        return false
    }

}

const selectAllAvaliacoesByTurma = async function (idTurma) {
    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_avaliacao.idAvaliacao as id_avaliacao, tbl_avaliacao.nome, tbl_avaliacao.somativa, tbl_avaliacao.concluida
    from tbl_avaliacao where id_turma = ${idTurma}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAvaliacao.length > 0) {
        return rsAvaliacao
    } else {
        return false
    }
}

const selectByIdAvaliacao = async function (idAvaliacao) {
    let sql = `SELECT tbl_avaliacao.idAvaliacao as id_avaliacao, tbl_avaliacao.nome as nome_avaliacao, 
    SUM(tbl_verificacao_matricula.confirmacao_professor = 'S') as criticos_acertados, 
    SUM(tbl_verificacao_matricula.confirmacao_professor = 'S') as desejados_acertados, tbl_avaliacao.somativa, tbl_avaliacao.concluida, 
    tbl_professor.nome as professor, 
    concat(tbl_turma.nome, " (", tbl_turma.sigla, ")") as turma, 
    tbl_criterio.id as id_criterio, tbl_criterio.descricao, tbl_criterio.observacao, 
    tbl_verificacao_matricula.id as resultado_id, tbl_verificacao_matricula.resultado_desejado, tbl_verificacao_matricula.resultado_obtido, tbl_verificacao_matricula.verificacao_aluno, tbl_verificacao_matricula.confirmacao_professor
    from tbl_avaliacao 
        inner join tbl_criterio on tbl_criterio.id_avaliacao = tbl_avaliacao.idAvaliacao
        inner join tbl_verificacao_matricula on tbl_verificacao_matricula.id_criterio = tbl_criterio.id
        inner join tbl_professor on tbl_professor.idProfessor = tbl_avaliacao.id_professor
        inner join tbl_turma on tbl_turma.id = tbl_avaliacao.id_turma
    where idAvaliacao = ${idAvaliacao}
    GROUP BY id_avaliacao, id_criterio, resultado_id;`

    let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

    // console.log(rsAvaliacao);

    if (rsAvaliacao.length > 0) {
        // let avaliacao = {}
        // let criterios = []
        // let set = Array.from(new Set(rsAvaliacao))

        // avaliacao.id = 0
        // avaliacao.criterio_id = 0

        // console.log(set);

        // set.forEach(tarefa => {
        //     if (avaliacao.id != tarefa.id_avaliacao) {
        //         avaliacao.id = tarefa.id_avaliacao
        //         avaliacao.nome = tarefa.nome_avaliacao
        //         avaliacao.duracao = tarefa.duracao
        //         avaliacao.acertos_criticos = tarefa.criticos_acertados
        //         avaliacao.acertos_desejados = tarefa.desejados_acertados

        //         if (tarefa.somativa == 1) {
        //             avaliacao.somativa = true
        //         } else if (tarefa.somativa == 1) {
        //             avaliacao.somativa = false
        //         }

        //         avaliacao.concluida = tarefa.concluida
        //         avaliacao.professor = tarefa.professor
        //         avaliacao.turma = tarefa.turma
        //     }

        //     if (avaliacao.id_criterio != tarefa.id_criterio) {
        //         let verificacao = {}
        //         verificacao.id = tarefa.verificacao_id
        //         verificacao.verificacao_aluno = tarefa.verificacao_aluno
        //         verificacao.confirmacao_professor = tarefa.confirmacao_professor

        //         verificacoes.push(verificacao)
        //     }

        //     if (avaliacao.id_resultado != tarefa.id_resultado) {
        //         let resultado = {}
        //         resultado.id = tarefa.resultado_id
        //         resultado.resultado_desejado = tarefa.resultado_desejado
        //         resultado.resultado_obtido = tarefa.resultado_obtido

        //         resultados.push(resultado)
        //     }

        //     if (avaliacao.id_criterio != tarefa.id_criterio) {
        //         let criterio = {}
        //         criterio.id = tarefa.id_criterio
        //         criterio.descricao = tarefa.descricao
        //         criterio.observacao = tarefa.observacao

        //         criterios.push(criterio)
        //     }
        // });

        return rsAvaliacao;
    } else {
        return false
    }
}

const selectByNomeAvaliacao = async function (nomeAvaliacao) {
    let sql = `select * from tbl_avaliacao where tbl_avaliacao.nome like '%${nomeAvaliacao}%'`

    let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

    if (rsAvaliacao.length > 0) {
        return rsAvaliacao;
    } else {
        return false
    }
}

const selectLastIdAvaliacao = async function () {
    let sql = 'select * from tbl_avaliacao order by idAvaliacao desc limit 1;'

    let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

    if (rsAvaliacao.length > 0) {
        return rsAvaliacao
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateAvaliacao = async function (dadosAvaliacao) {
    let sql = `update tbl_avaliacao set 
            nome = '${dadosAvaliacao.nome}',
            id_professor = ${dadosAvaliacao.id_professor},
            id_turma = ${dadosAvaliacao.id_turma}
        where idAvaliacao = ${dadosAvaliacao.idAvaliacao}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const deleteAvaliacao = async function (idAvaliacao) {

    let sql = `delete from tbl_avaliacao where id = ${idAvaliacao}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const insertAvaliacao = async function (dadosAvaliacao) {
    console.log(dadosAvaliacao.id_professor);

    let sql = `insert into tbl_avaliacao 
    (
        nome,
        id_professor,
        id_turma
    ) values (
        '${dadosAvaliacao.nome}',
        ${dadosAvaliacao.id_professor},
        ${dadosAvaliacao.id_turma}
    )`

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    selectAllAvaliacoes,
    selectAllAvaliacoesByTurma,
    selectByIdAvaliacao,
    selectByNomeAvaliacao,
    selectLastIdAvaliacao,
    updateAvaliacao,
    deleteAvaliacao,
    insertAvaliacao
}

