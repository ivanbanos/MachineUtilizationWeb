import configData from '../config.json'
import ReadApiError from './ReadApiError'

/**
 * Guarda en lote la suscripción de varios clientes.
 * @param {object[]} rows Filas del lote, de 1 a 500, cada una con startDate, endDate y clientId (Guid del cliente) o clientName; si hay clientId se ignora la creación por nombre.
 * @returns {Promise<object[]|string>} El arreglo de resultados por fila tal como lo devuelve la API; 'empty' ante EmptyBatch, 'tooMany' ante TooManyRows, 'forbidden' ante un 403 o 'fail' en el resto.
 */
const SaveSubscriptionsBatch = async (rows) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(configData.SERVER_URL + '/api/subscription/batch', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(rows),
      headers: {
        'Access-Control-Allow-Origin': '*',
        accept: 'text/plain',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'sec-fetch-mode': 'cors',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': 'https://machineutilization.dbhaffnerna3.com',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
    })
    if (response.status == 200) {
      return await response.json()
    }
    if (response.status == 400) {
      const error = await ReadApiError(response)
      if (error === 'EmptyBatch') {
        return 'empty'
      }
      if (error === 'TooManyRows') {
        return 'tooMany'
      }
    }
    if (response.status == 403) {
      return 'forbidden'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default SaveSubscriptionsBatch
