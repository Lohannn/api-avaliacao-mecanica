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
    let sql = `SELECT tbl_avaliacao.idAvaliacao as id_avaliacao, tbl_avaliacao.nome as nome_avaliacao, 
    (IFNULL((SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_verificacao_matricula WHERE confirmacao_professor = 'S' AND id_criterio IN (SELECT id FROM tbl_criterio WHERE critico = 1)), 0)) as criticos_acertados, 
    (IFNULL((SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_verificacao_matricula WHERE confirmacao_professor = 'S' AND id_criterio IN (SELECT id FROM tbl_criterio WHERE critico = 0)), 0)) as desejados_acertados,
    (SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_criterio WHERE critico = 1) as quantidade_criticos,
    (SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_criterio WHERE critico = 0) as quantidade_desejados,
    tbl_avaliacao.somativa, tbl_avaliacao.concluida, 
    tbl_professor.nome as professor, 
    concat(tbl_turma.nome, " (", tbl_turma.sigla, ")") as turma, 
    tbl_criterio.id as id_criterio, tbl_criterio.critico, tbl_criterio.descricao, tbl_criterio.observacao, 
    tbl_verificacao_matricula.id as resultado_id, tbl_verificacao_matricula.resultado_desejado, tbl_verificacao_matricula.resultado_obtido, tbl_verificacao_matricula.verificacao_aluno, tbl_verificacao_matricula.confirmacao_professor
    from tbl_avaliacao 
        inner join tbl_criterio on tbl_criterio.id_avaliacao = tbl_avaliacao.idAvaliacao
        inner join tbl_verificacao_matricula on tbl_verificacao_matricula.id_criterio = tbl_criterio.id
        inner join tbl_professor on tbl_professor.idProfessor = tbl_avaliacao.id_professor
        inner join tbl_turma on tbl_turma.id = tbl_avaliacao.id_turma
    GROUP BY id_avaliacao, id_criterio, resultado_id;`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

    console.log(rsAvaliacao);

    //Valida se o BD retornou algum registro
    if (rsAvaliacao.length > 0) {
        let avaliacao = {}
        let criterios = []
        let resultados = []
        let set = Array.from(new Set(rsAvaliacao))

        avaliacao.id = 0
        avaliacao.criterio_id = 0
        avaliacao.resultado_id = 0

        set.forEach(tarefa => {
            if (avaliacao.id != tarefa.id_avaliacao) {
                avaliacao.id = tarefa.id_avaliacao
                avaliacao.nome = tarefa.nome_avaliacao
                avaliacao.acertos_criticos = tarefa.criticos_acertados
                avaliacao.acertos_desejados = tarefa.desejados_acertados
                avaliacao.quantidade_criticos = tarefa.quantidade_criticos
                avaliacao.quantidade_desejados = tarefa.quantidade_desejados

                if (tarefa.somativa == 1) {
                    avaliacao.somativa = true
                } else if (tarefa.somativa == 1) {
                    avaliacao.somativa = false
                }

                avaliacao.concluida = tarefa.concluida
                avaliacao.professor = tarefa.professor
                avaliacao.turma = tarefa.turma
            }

            if (avaliacao.resultado_id != tarefa.resultado_id) {
                let resultado = {}
                avaliacao.resultado_id = tarefa.resultado_id
                resultado.id = tarefa.resultado_id
                resultado.verificacao_aluno = tarefa.resultado_desejado
                resultado.verificacao_aluno = tarefa.resultado_obtido
                resultado.verificacao_aluno = tarefa.verificacao_aluno
                resultado.confirmacao_professor = tarefa.confirmacao_professor

                resultados.push(resultado)
            }

            if (avaliacao.criterio_id !== tarefa.id_criterio) {
                avaliacao.criterio_id = tarefa.id_criterio
                let criterio = {}
                criterio.id = tarefa.id_criterio

                if (tarefa.critico == 1) {
                    criterio.critico = true
                } else if (tarefa.critico == 1) {
                    criterio.critico = false
                }

                criterio.descricao = tarefa.descricao
                criterio.observcao = tarefa.observacao
                criterio.resultados = resultados

                criterios.push(criterio)
            }
            avaliacao.criterios = criterios
        });

        delete avaliacao.criterio_id
        delete avaliacao.resultado_id

        return avaliacao;
    } else {
        return false
    }

}

const selectAllAvaliacoesByTurma = async function (idTurma) {
    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_avaliacao.idAvaliacao as id_avaliacao, tbl_avaliacao.nome as nome_avaliacao, 
    (IFNULL((SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_verificacao_matricula WHERE confirmacao_professor = 'S' AND id_criterio IN (SELECT id FROM tbl_criterio WHERE critico = 1)), 0)) as criticos_acertados, 
    (IFNULL((SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_verificacao_matricula WHERE confirmacao_professor = 'S' AND id_criterio IN (SELECT id FROM tbl_criterio WHERE critico = 0)), 0)) as desejados_acertados,
    (SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_criterio WHERE critico = 1 AND id_turma = ${idTurma}) as quantidade_criticos,
    (SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_criterio WHERE critico = 0 AND id_turma = ${idTurma}) as quantidade_desejados,
    tbl_avaliacao.somativa, tbl_avaliacao.concluida, 
    tbl_professor.nome as professor, 
    concat(tbl_turma.nome, " (", tbl_turma.sigla, ")") as turma, 
    tbl_criterio.id as id_criterio, tbl_criterio.critico, tbl_criterio.descricao, tbl_criterio.observacao, 
    tbl_verificacao_matricula.id as resultado_id, tbl_verificacao_matricula.resultado_desejado, tbl_verificacao_matricula.resultado_obtido, tbl_verificacao_matricula.verificacao_aluno, tbl_verificacao_matricula.confirmacao_professor
    from tbl_avaliacao 
        inner join tbl_criterio on tbl_criterio.id_avaliacao = tbl_avaliacao.idAvaliacao
        inner join tbl_verificacao_matricula on tbl_verificacao_matricula.id_criterio = tbl_criterio.id
        inner join tbl_professor on tbl_professor.idProfessor = tbl_avaliacao.id_professor
        inner join tbl_turma on tbl_turma.id = tbl_avaliacao.id_turma
    where id_turma = ${idTurma}
    GROUP BY id_avaliacao, id_criterio, resultado_id;`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAvaliacao.length > 0) {
        let avaliacao = {}
        let criterios = []
        let resultados = []
        let set = Array.from(new Set(rsAvaliacao))

        avaliacao.id = 0
        avaliacao.criterio_id = 0
        avaliacao.resultado_id = 0

        set.forEach(tarefa => {
            if (avaliacao.id != tarefa.id_avaliacao) {
                avaliacao.id = tarefa.id_avaliacao
                avaliacao.nome = tarefa.nome_avaliacao
                avaliacao.acertos_criticos = tarefa.criticos_acertados
                avaliacao.acertos_desejados = tarefa.desejados_acertados
                avaliacao.quantidade_criticos = tarefa.quantidade_criticos
                avaliacao.quantidade_desejados = tarefa.quantidade_desejados

                if (tarefa.somativa == 1) {
                    avaliacao.somativa = true
                } else if (tarefa.somativa == 1) {
                    avaliacao.somativa = false
                }

                avaliacao.concluida = tarefa.concluida
                avaliacao.professor = tarefa.professor
                avaliacao.turma = tarefa.turma
            }

            if (avaliacao.resultado_id != tarefa.resultado_id) {
                let resultado = {}
                avaliacao.resultado_id = tarefa.resultado_id
                resultado.id = tarefa.resultado_id
                resultado.verificacao_aluno = tarefa.resultado_desejado
                resultado.verificacao_aluno = tarefa.resultado_obtido
                resultado.verificacao_aluno = tarefa.verificacao_aluno
                resultado.confirmacao_professor = tarefa.confirmacao_professor

                resultados.push(resultado)
            }

            if (avaliacao.criterio_id !== tarefa.id_criterio) {
                avaliacao.criterio_id = tarefa.id_criterio
                let criterio = {}
                criterio.id = tarefa.id_criterio

                if (tarefa.critico == 1) {
                    criterio.critico = true
                } else if (tarefa.critico == 1) {
                    criterio.critico = false
                }

                criterio.descricao = tarefa.descricao
                criterio.observcao = tarefa.observacao
                criterio.resultados = resultados

                criterios.push(criterio)
            }
            avaliacao.criterios = criterios
        });

        delete avaliacao.criterio_id
        delete avaliacao.resultado_id

        return avaliacao;
    } else {
        return false
    }
}

const selectByIdAvaliacao = async function (idAvaliacao) {
    let sql = `SELECT tbl_avaliacao.idAvaliacao as id_avaliacao, tbl_avaliacao.nome as nome_avaliacao, 
    (IFNULL((SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_verificacao_matricula WHERE confirmacao_professor = 'S' AND id_criterio IN (SELECT id FROM tbl_criterio WHERE critico = 1)), 0)) as criticos_acertados, 
    (IFNULL((SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_verificacao_matricula WHERE confirmacao_professor = 'S' AND id_criterio IN (SELECT id FROM tbl_criterio WHERE critico = 0)), 0)) as desejados_acertados,
    (SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_criterio WHERE critico = 1 AND id_avaliacao = ${idAvaliacao}) as quantidade_criticos,
    (SELECT (CAST(COUNT(*) as CHAR) + 0) FROM tbl_criterio WHERE critico = 0 AND id_avaliacao = ${idAvaliacao}) as quantidade_desejados,
    tbl_avaliacao.somativa, tbl_avaliacao.concluida, 
    tbl_professor.nome as professor, 
    concat(tbl_turma.nome, " (", tbl_turma.sigla, ")") as turma, 
    tbl_criterio.id as id_criterio, tbl_criterio.critico, tbl_criterio.descricao, tbl_criterio.observacao, 
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
        let avaliacao = {}
        let criterios = []
        let resultados = []
        let set = Array.from(new Set(rsAvaliacao))

        avaliacao.id = 0
        avaliacao.criterio_id = 0
        avaliacao.resultado_id = 0

        set.forEach(tarefa => {
            if (avaliacao.id != tarefa.id_avaliacao) {
                avaliacao.id = tarefa.id_avaliacao
                avaliacao.nome = tarefa.nome_avaliacao
                avaliacao.acertos_criticos = tarefa.criticos_acertados
                avaliacao.acertos_desejados = tarefa.desejados_acertados
                avaliacao.quantidade_criticos = tarefa.quantidade_criticos
                avaliacao.quantidade_desejados = tarefa.quantidade_desejados

                if (tarefa.somativa == 1) {
                    avaliacao.somativa = true
                } else if (tarefa.somativa == 1) {
                    avaliacao.somativa = false
                }

                avaliacao.concluida = tarefa.concluida
                avaliacao.professor = tarefa.professor
                avaliacao.turma = tarefa.turma
            }

            if (avaliacao.resultado_id != tarefa.resultado_id) {
                let resultado = {}
                avaliacao.resultado_id = tarefa.resultado_id
                resultado.id = tarefa.resultado_id
                resultado.verificacao_aluno = tarefa.resultado_desejado
                resultado.verificacao_aluno = tarefa.resultado_obtido
                resultado.verificacao_aluno = tarefa.verificacao_aluno
                resultado.confirmacao_professor = tarefa.confirmacao_professor

                resultados.push(resultado)
            }

            if (avaliacao.criterio_id !== tarefa.id_criterio) {
                avaliacao.criterio_id = tarefa.id_criterio
                let criterio = {}
                criterio.id = tarefa.id_criterio

                if (tarefa.critico == 1) {
                    criterio.critico = true
                } else if (tarefa.critico == 1) {
                    criterio.critico = false
                }

                criterio.descricao = tarefa.descricao
                criterio.observcao = tarefa.observacao
                criterio.resultados = resultados

                criterios.push(criterio)
            }
            avaliacao.criterios = criterios
        });

        delete avaliacao.criterio_id
        delete avaliacao.resultado_id

        return avaliacao;
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

const insertIntoTableMatriculaAvaliacao = async function (idMatricula, idAvaliacao) {
    let sql = `insert into tbl_matricula_avaliacao
    (
        id_matricula,
        id_avaliacao
    ) values (
        '${idMatricula}',
        ${idAvaliacao}
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
    insertAvaliacao,
    insertIntoTableMatriculaAvaliacao
}

