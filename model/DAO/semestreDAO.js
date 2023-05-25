/**************************************************************************************
* Objetivo: Responsável pela manipulação de dados do Semestre no Banco de Dados.
* Data: 19/05/2023
* Autor: Lohannes da Silva Costa, Felipe Graciano Bertanha dos Santos
* Versão: 1.0
**************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllSemestres = async function (){
    let sql = 'SELECT * FROM tbl_semestre'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSemestre = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSemestre.length > 0) {
        return rsSemestre
    } else {
        return false
    }
}

const selectByIdSemestre = async function(id){
    let sql = `SELECT * FROM tbl_semestre where id = ${id}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSemestre = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSemestre.length > 0) {
        return rsSemestre
    } else {
        return false
    }
}

const insertSemestre = async function(dadosSemestre){
    let sql = `insert into tbl_semestre 
    (nome_semestre) values
    ('${dadosSemestre.nome_semestre}')`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSemestre = await prisma.$executeRawUnsafe(sql)
    //Valida se o BD retornou algum registro
    if (rsSemestre) {
        return rsSemestre
    } else {
        return false
    }
}

const selectLastIdsemestre = async function(){
    let sql = 'select * from tbl_semestre order by id desc limit 1;'

    let rsSemestre = await prisma.$queryRawUnsafe(sql)

    if(rsSemestre.length > 0){
        return rsSemestre
    } else{
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const updateSemestre = async function(dadosSemestre){
    let sql = `update tbl_semestre set 
            nome_semestre = '${dadosSemestre.nome}'
        where id = ${dadosSemestre.id}
    `

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

const deleteSemestre = async function (id) {

    let sql = `delete from tbl_semestre where id = ${id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    selectAllSemestres,
    selectByIdSemestre,
    insertSemestre,
    selectLastIdsemestre,
    updateSemestre,
    deleteSemestre
}
