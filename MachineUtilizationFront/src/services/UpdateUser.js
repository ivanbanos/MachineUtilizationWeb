import configData from '../config.json'
import ReadApiError from './ReadApiError'

/** Centinela devuelto por cada par "estado:código" de error de la API. */
const USER_ERRORS = {
  '400:InvalidEmail': 'invalidEmail',
  '400:ClientRequired': 'clientRequired',
  '400:PasswordRequired': 'passwordRequired',
  '404:UserNotFound': 'userNotFound',
  '409:EmailAlreadyUsed': 'emailUsed',
  '409:UsernameAlreadyUsed': 'usernameUsed',
  '409:UserLimitReached': 'limit',
  '409:MachineLimitReached': 'machineLimit',
  '403:RoleNotAllowed': 'roleNotAllowed',
  '403:ReadOnlyRole': 'readOnly',
}

/**
 * Actualiza un usuario.
 * @param {object} User Usuario a guardar; su email solo se envía si no está vacío.
 * @returns {Promise<object|string>} La respuesta de la API; 'invalidEmail', 'clientRequired', 'passwordRequired', 'userNotFound', 'emailUsed', 'usernameUsed', 'limit', 'machineLimit', 'roleNotAllowed', 'readOnly' o 'fail' según el error.
 */
const UpdateUser = async (User) => {
  try {
    const token = localStorage.getItem('token')
    const { email, ...rest } = User
    const payload = email ? { ...rest, email } : rest
    const response = await fetch(configData.SERVER_URL + '/api/Users', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(payload),
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
      let machines = await response.json()
      return machines
    }
    const error = await ReadApiError(response)
    return USER_ERRORS[response.status + ':' + error] || 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default UpdateUser
