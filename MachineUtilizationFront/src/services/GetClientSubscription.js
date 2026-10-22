import configData from '../config.json'

/**
 * Consulta la suscripción de un cliente concreto.
 * @param {string} clientGuid Guid del cliente.
 * @returns {Promise<object|string>} SubscriptionInfo tal cual la devuelve la API, o 'fail' ante cualquier otro caso.
 */
const GetClientSubscription = async (clientGuid) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(configData.SERVER_URL + '/api/subscription/client/' + clientGuid, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        accept: 'text/plain',
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
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default GetClientSubscription
