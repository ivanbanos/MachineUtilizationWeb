export const ROLES = {
  SUPER_ADMINISTRATOR: 1,
  SUPERVISOR: 2,
  OPERATOR: 3,
  ADMINISTRATOR: 4,
  MACHINE: 5,
}

export const ROLE_NAMES = {
  [ROLES.SUPER_ADMINISTRATOR]: 'Superadministrator',
  [ROLES.SUPERVISOR]: 'Supervisor',
  [ROLES.OPERATOR]: 'Operator',
  [ROLES.ADMINISTRATOR]: 'Administrator',
  [ROLES.MACHINE]: 'Machine',
}

/**
 * Lee el rol de la sesión guardado en localStorage.
 * @returns {number} Rol numérico, o NaN si no hay sesión.
 */
export const getSessionRole = () => Number(localStorage.getItem('role'))

/**
 * Indica si un rol está entre los permitidos.
 * @param {number} role Rol a evaluar.
 * @param {number[]} allowed Roles permitidos.
 * @returns {boolean} True si el rol está permitido.
 */
export const hasRole = (role, allowed) => allowed.includes(role)

/**
 * Indica si el rol solo puede consultar, sin modificar.
 * @param {number} role Rol a evaluar.
 * @returns {boolean} True solo para el rol Administrator.
 */
export const isReadOnly = (role) => role === ROLES.ADMINISTRATOR
