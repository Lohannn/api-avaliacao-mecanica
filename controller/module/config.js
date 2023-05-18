/**************************************************************************************
 * Objetivo: Arquivo responsável por padronizar as mensagens de Erro, Sucesso e etc.
 * Data: 28/04/2023
 * Auto: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

/***************************************** MENSAGENS DE ERRO *****************************************/

const ERROR_REQUIRED_FIELDS = {status: '400', message: 'Campos obrigatórios não foram preenchidos.'}
const ERROR_INVALID_ID = {status: '400', message: 'O ID informado não é válido ou não foi encaminhado.'}
const ERROR_NOT_FOUND = {status: '404', message: 'O Item não foi encontrado.'}
const ERROR_INVALID_CONTENT_TYPE = {status: '415', message: 'O tipo de mídia Content-Type da solicitação não é compatível com o servidor. Tipo Aceito: [application/json]'}
const ERROR_INTERNAL_SERVER = {status: '500', message: 'Devido a um erro interno do servidor, não ' + 
                                                       'foi possível processar a requisição.'}

/***************************************** MENSAGENS DE SUCESSO *****************************************/

const SUCCESS_CREATED_ITEM = {status: '201', message: 'Item criado com sucesso.'}
const SUCCESS_UPDATED_ITEM = {status: '200', message: 'Item atualizado com sucesso.'}
const SUCCESS_DELETED_ITEM = {status: '200', message: 'Item deletado com sucesso.'}
const SUCCESS_ITEM_FOUND = {status: '200', message: 'Item encontrado sucesso.'}
const SUCCESS_REQUEST = {status: '200', message: 'Requisição realizada com sucesso.'}

module.exports = {
    ERROR_REQUIRED_FIELDS,
    SUCCESS_CREATED_ITEM,
    ERROR_INTERNAL_SERVER,
    ERROR_INVALID_ID,
    SUCCESS_UPDATED_ITEM,
    ERROR_INVALID_CONTENT_TYPE,
    SUCCESS_DELETED_ITEM,
    ERROR_NOT_FOUND,
    SUCCESS_ITEM_FOUND,
    SUCCESS_REQUEST
}