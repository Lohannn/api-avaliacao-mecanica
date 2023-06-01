/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das Resultados no Banco de Dados.
 * Data: 01/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const insertResultado = async function (dadosResultado) {
    let sql = `insert into tbl_resultado (
        resultado_desejado,
        resultado_obtido,
    ) values (
        '${dadosResultado.resultado_desejado}',
        '${dadosResultado.resultado_obtido}',
    )`;

    //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const selectResultadoById = async function(Id){
    let sql = `select * from tbl_resultado where id = ${Id}`

    let rsResultado = await prisma.$queryRawUnsafe(sql)

    if (rsResultado.length > 0) {
        return rsResultado;
    } else {
        return false
    }
}

const selectLastId = async function(){
    let sql = 'select * from tbl_resultado order by id desc limit 1;'

    let rsResultado = await prisma.$queryRawUnsafe(sql)

    if(rsResultado.length > 0){
        return rsResultado
    } else{
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateResultado = async function(dadosResultado){
    let sql = `update tbl_resultado set 
            resultado_desejado = '${dadosResultado.resultado_desejado}',
            resultado_obtido = '${dadosResultado.resultado_obtido}'
        where id = ${dadosResultado.id}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    insertResultado,
    selectLastId,
    selectResultadoById,
    updateResultado
}