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
 * Crea un usuario.
 * @param {string} userName Nombre de usuario.
 * @param {string} password Contraseña.
 * @param {number} [role] Id del rol; 1 si no se indica.
 * @param {string} [idClient] Id del cliente; se omite si es la cadena 'undefined'.
 * @param {string} [email] Correo del usuario; se omite si no se indica.
 * @returns {Promise<object|string>} El usuario creado; 'invalidEmail', 'clientRequired', 'passwordRequired', 'userNotFound', 'emailUsed', 'usernameUsed', 'limit', 'machineLimit', 'roleNotAllowed', 'readOnly' o 'fail' según el error.
 */
const AddUsers = async (userName, password, role, idClient, email) => {
  try {
    const token = localStorage.getItem('token')
    const body = {
      guid: '00000000-0000-0000-0000-000000000000',
      username: userName,
      password: password,
    }
    if (email) {
      body.email = email
    }
    if (role == undefined) {
      body.idRole = 1
    } else {
      body.idRole = role
    }

    if (idClient != 'undefined') {
      body.idClient = idClient
    }
    const response = await fetch(configData.SERVER_URL + '/api/Users/createUser', {
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
      let user = await response.json()
      return user
    }
    const error = await ReadApiError(response)
    return USER_ERRORS[response.status + ':' + error] || 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default AddUsers
