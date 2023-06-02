// **************************************************************************************
//  * Objetivo: Responsável pela manipulação de dados dos MAtérias no Banco de Dados.
//  * Data: 19/05/2023
//  * Autor: Lohannes da Silva Costa , Felipe Graciano Bertanha dos Santos
//  * Versão: 1.0
//  **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllMaterias = async function (){
    let sql = 'SELECT * FROM tbl_materia'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMateria = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMateria.length > 0) {
        return rsMateria
    } else {
        return false
    }
}

const selectByIdMateria = async function(idMateria){
    let sql = `select * from tbl_materia where id = ${idMateria}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMateria = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMateria.length > 0) {
        return rsMateria
    } else {
        return false
    }
}

const selectByNomeMateria = async function(nomeMateria){
    let sql = `select * from tbl_materia where tbl_materia.nome like '%${nomeMateria}%'`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMateria = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMateria.length > 0) {
        return rsMateria
    } else {
        return false
    }
}

const selectBySiglaMateria = async function(siglaMateria){
    let sql = `select * from tbl_materia where tbl_materia.sigla like '%${siglaMateria}%'`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMateria = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMateria.length > 0) {
        return rsMateria
    } else {
        return false
    }
}

const selectLastIdMateria = async function(){
    let sql = `select * from tbl_materia order by id desc limit 1;`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMateria = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMateria.length > 0) {
        return rsMateria
    } else {
        return false
    }
}

const insertMateria = async function(dadosMateria, id_professor){
    let sql = `insert into tbl_materia (
        nome,
        sigla
    ) values (
        '${dadosMateria.nome}',
        '${dadosMateria.sigla}'
    )`;

    //Sempre que não formos utilizar um select, devemos usar o metodo executeRawUnsafe                        
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {

        let tblProfessorMateriaLastId = await selectTblProfessorMateriaLastId()
        
        let passIdProfessor = `update tbl_professor_materia set id_professor = ${id_professor} where tbl_professor_materia.idMateria = ${parseInt(tblProfessorMateriaLastId.id)}`

        let executeSecondScript = async function(){await prisma.$executeRawUnsafe(passIdProfessor)}

        executeSecondScript()

        return true
    } else {
        return false
    }
}

const selectTblProfessorMateriaLastId = async function () {
    let sql = 'select tbl_professor_materia.id from tbl_professor_materia order by id desc limit 1'

    let rsProfessorMateria= await prisma.$queryRawUnsafe(sql)

    if (rsProfessorMateria.length > 0) {
        return rsProfessorMateria[0]
    } else {
        return false
    }
}

const updateMateria = async function(dadosMateria){
    let sql = `update tbl_materia set 
            nome = '${dadosMateria.nome}',
            sigla = '${dadosMateria.sigla}'
        where id = ${dadosMateria.id}
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

const deleteMateria = async function (idMateria) {

    let sql = `delete from tbl_materia where idMateria = ${idMateria}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    selectAllMaterias,
    selectByIdMateria,
    selectLastIdMateria,
    selectByNomeMateria,
    selectBySiglaMateria,
    insertMateria,
    updateMateria,
    deleteMateria
}