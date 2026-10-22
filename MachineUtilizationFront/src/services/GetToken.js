import configData from '../config.json'
import ReadApiError from './ReadApiError'

/**
 * Obtiene el token de sesión con usuario y contraseña.
 * @param {string} username Nombre de usuario.
 * @param {string} password Contraseña.
 * @returns {Promise<object|string|null>} El json de la API en 200; 'suspended' si la suscripción está suspendida; null en cualquier otro caso.
 */
const GetToken = async (username, password) => {
  try {
    const response = await fetch(
      configData.SERVER_URL + '/api/Users/' + username + '/' + password,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          accept: 'text/plain',
          'sec-fetch-mode': 'cors',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': 'https://machineutilization.dbhaffnerna3.com',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
      },
    )
    if (response.status == 200) {
      let json = await response.json()
      return json
    }
    if (response.status == 403 && (await ReadApiError(response)) === 'SubscriptionSuspended') {
      return 'suspended'
    }
    return null
  } catch (error) {
    return null
  }
}

export default GetToken
