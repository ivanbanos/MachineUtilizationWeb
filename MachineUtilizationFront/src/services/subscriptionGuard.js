import ReadApiError from './ReadApiError'

const SUSPENDED_ERROR = 'SubscriptionSuspended'
const SESSION_KEYS = ['token', 'role', 'idClient', 'userId']

let installed = false

/**
 * Cierra la sesión local cuando la API informa que la suscripción está suspendida.
 * @param {Response} response Respuesta HTTP recibida; no se consume.
 * @returns {Promise<void>} Sin valor. No hace nada si no hay token en sesión o si el 403 es de otro motivo.
 */
const handleForbidden = async (response) => {
  const token = localStorage.getItem('token')
  if (!token || token === 'null') {
    return
  }
  const message = await ReadApiError(response)
  if (message !== SUSPENDED_ERROR) {
    return
  }
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key))
  sessionStorage.setItem('subscriptionSuspended', '1')
  window.location.assign('#/Login')
}

/**
 * Envuelve window.fetch una sola vez para detectar suscripciones suspendidas en respuestas 403.
 * Llamarla de nuevo no tiene efecto. Cada llamada a fetch devuelve la respuesta original sin alterar.
 * @returns {void}
 */
export const installSubscriptionGuard = () => {
  if (installed) {
    return
  }
  installed = true
  const originalFetch = window.fetch.bind(window)
  window.fetch = async (...args) => {
    const response = await originalFetch(...args)
    if (response.status === 403) {
      await handleForbidden(response)
    }
    return response
  }
}
