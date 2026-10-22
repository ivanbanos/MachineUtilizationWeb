import configData from '../config.json'
import ReadApiError from './ReadApiError'

/**
 * Crea un cliente, con suscripción opcional.
 * @param {string} name Nombre del cliente.
 * @param {object} [subscription] Objeto con startDate y endDate, fechas 'YYYY-MM-DD'; si se omite, el cliente se crea sin suscripción.
 * @returns {Promise<boolean|string>} true si se creó; 'invalid' ante InvalidSubscription, 'forbidden' ante un 403 o 'fail' en el resto.
 */
const AddClient = async (name, subscription) => {
  try {
    const token = localStorage.getItem('token')
    const body = { name: name }
    if (subscription) {
      body.subscription = { startDate: subscription.startDate, endDate: subscription.endDate }
    }
    const response = await fetch(configData.SERVER_URL + '/api/Client', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
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
      return true
    }
    if (response.status == 400 && (await ReadApiError(response)) === 'InvalidSubscription') {
      return 'invalid'
    }
    if (response.status == 403) {
      return 'forbidden'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default AddClient
