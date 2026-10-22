import configData from '../config.json'

/**
 * Crea o actualiza la suscripción de un cliente.
 * @param {{client: string, startDate: string, endDate: string}} subscription Cliente y fechas ISO; el tipo de plan se envía siempre como 1.
 * @returns {Promise<object|string>} SubscriptionInfo recalculada; 'invalid' ante un 400, 'forbidden' ante un 403, 'notFound' ante un 404 o 'fail' en el resto.
 */
const SaveSubscription = async ({ client, startDate, endDate }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(configData.SERVER_URL + '/api/subscription', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify({ client, planType: 1, startDate, endDate }),
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
      return 'invalid'
    }
    if (response.status == 403) {
      return 'forbidden'
    }
    if (response.status == 404) {
      return 'notFound'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default SaveSubscription
