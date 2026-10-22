/**
 * Lee el texto de error del cuerpo de una respuesta de la API sin consumirla.
 * @param {Response} response Respuesta HTTP cuyo cuerpo se inspecciona sobre una copia.
 * @returns {Promise<string>} El cuerpo si es una cadena JSON; si es un objeto, el valor de message, ExceptionMessage o exceptionMessage; cadena vacía si el cuerpo está vacío o no es JSON. Nunca lanza.
 */
const ReadApiError = async (response) => {
  try {
    const body = await response.clone().json()
    if (typeof body === 'string') {
      return body
    }
    return body?.message || body?.ExceptionMessage || body?.exceptionMessage || ''
  } catch (error) {
    return ''
  }
}

export default ReadApiError
