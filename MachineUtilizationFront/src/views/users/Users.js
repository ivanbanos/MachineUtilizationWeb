import { React, useState, useEffect, useRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import GetUsers from '../../services/GetUsers'
import GetClients from '../../services/GetClients'
import AddOperator from '../../services/AddOperator'
import AddUser from '../../services/AddUser.js'
import UpdateUser from '../../services/UpdateUser.js'
import DeleteUser from '../../services/DeleteUser.js'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilX } from '@coreui/icons'
import {
  CButton,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormSelect,
} from '@coreui/react'

import Toast from '../toast/Toast'
import { ROLES, ROLE_NAMES, getSessionRole, hasRole } from '../../utils/roles'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'

const USER_ERROR_MESSAGES = {
  invalidEmail: 'Invalid email',
  clientRequired: 'Select a client',
  passwordRequired: 'Enter a password',
  userNotFound: 'User not found',
  emailUsed: 'Email already in use',
  usernameUsed: 'Username already in use',
  limit: 'Supervisor limit reached for this client (max. 5)',
  machineLimit: 'This client already has a machine user',
  roleNotAllowed: 'You are not allowed to assign this role',
  readOnly: 'Your role is read-only',
}

const CLIENT_ROLES = [ROLES.SUPERVISOR, ROLES.OPERATOR, ROLES.MACHINE]

/**
 * Lista los roles que puede asignar quien tiene la sesión.
 * @param {number} sessionRole Rol de la sesión.
 * @returns {{value: number, name: string}[]} Roles asignables; vacía si no puede asignar ninguno.
 */
const getAssignableRoles = (sessionRole) => {
  let values = []
  if (sessionRole === ROLES.SUPER_ADMINISTRATOR) {
    values = [
      ROLES.SUPER_ADMINISTRATOR,
      ROLES.ADMINISTRATOR,
      ROLES.SUPERVISOR,
      ROLES.OPERATOR,
      ROLES.MACHINE,
    ]
  } else if (sessionRole === ROLES.SUPERVISOR) {
    values = [ROLES.SUPERVISOR, ROLES.OPERATOR]
  }
  return values.map((value) => ({ value, name: ROLE_NAMES[value] }))
}

/**
 * Indica si un rol exige cliente.
 * @param {number|string} role Rol a evaluar.
 * @returns {boolean} True para Supervisor, Operator y Machine.
 */
const roleNeedsClient = (role) => CLIENT_ROLES.includes(Number(role))

/**
 * Indica si falta elegir un cliente.
 * @param {string} client Id del cliente elegido.
 * @returns {boolean} True si está vacío o es el id nulo.
 */
const isClientMissing = (client) =>
  !client || client === EMPTY_GUID || client === 'undefined' || client === 'null'

/**
 * Valida los datos comunes del formulario de usuario.
 * @param {number|string} role Rol elegido.
 * @param {string} client Id del cliente elegido.
 * @param {string} email Correo escrito.
 * @returns {string|null} Mensaje del primer problema, o null si todo es válido.
 */
const validateUserForm = (role, client, email) => {
  if (roleNeedsClient(role) && isClientMissing(client)) {
    return USER_ERROR_MESSAGES.clientRequired
  }
  const emailOptional = Number(role) === ROLES.MACHINE
  if ((email || !emailOptional) && !EMAIL_PATTERN.test(email)) {
    return USER_ERROR_MESSAGES.invalidEmail
  }
  return null
}

/**
 * Botón y modal para crear un usuario; el correo es obligatorio salvo para Machine.
 * @param {object} props.GetUsers Función que recarga la lista tras crear.
 * @param {object} props.toast Ref del Toast donde se muestran los avisos.
 * @returns {JSX.Element} El botón de alta y su modal.
 */
const AddUserModal = (props) => {
  let navigate = useNavigate()
  let idClient = localStorage.getItem('idClient')
  const [addUserVisible, setAddUserVisible] = useState(false)
  const [newUserName, setNewUserName] = useState()
  const [newPassword, setNewPassword] = useState()
  const [newRole, setNewRole] = useState()
  const [clientDisabled, setclientDisabled] = useState(true)
  const [operatorDisabled, setoperatorDisabled] = useState(true)
  const [client, setClient] = useState(idClient)
  const [clients, setClients] = useState([])
  const [name, setName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const roles = getAssignableRoles(getSessionRole())
  const handleUserNameChange = (event) => {
    setNewUserName(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value)
  }
  const handleClientChange = (event) => {
    setClient(event.target.value)
  }
  const handleEmailChange = (event) => {
    setNewEmail(event.target.value)
  }
  const handleNameChange = (event) => {
    setName(event.target.value)
  }
  const handleRoleChange = (event) => {
    setNewRole(event.target.value)
    setclientDisabled(!roleNeedsClient(event.target.value))
    setoperatorDisabled(Number(event.target.value) !== ROLES.OPERATOR)
  }
  const addUser = async () => {
    const problem = validateUserForm(newRole, client, newEmail)
    if (problem) {
      props.toast.current.showToast(problem)
      return
    }
    let user = await AddUser(
      newUserName,
      newPassword,
      newRole,
      roleNeedsClient(newRole) ? client : undefined,
      newEmail,
    )
    if (typeof user === 'string') {
      props.toast.current.showToast(USER_ERROR_MESSAGES[user] ?? 'Could not create the user')
      return
    }
    if (Number(newRole) === ROLES.OPERATOR) {
      await AddOperator(name, client, user.guid)
    }
    props.GetUsers()
    setAddUserVisible(false)
    props.toast.current.showToast('User added successfully')
  }

  const fetchClients = async () => {
    if (!hasRole(getSessionRole(), [1, 2, 4])) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    } else {
      let clients = await GetClients()
      setClients(clients)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddUserVisible(true)}>
        <CIcon icon={cilPlus} size="sm" />
      </CButton>
      <CModal visible={addUserVisible} onClose={() => setAddUserVisible(false)}>
        <CModalHeader>
          <CModalTitle>Adding User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={2}>User name</CCol>
            <CCol xs={10}>
              <CFormInput placeholder="UserName" onChange={handleUserNameChange} />
            </CCol>
            <CCol xs={2}>Password</CCol>
            <CCol xs={10}>
              <CFormInput type="password" placeholder="Password" onChange={handlePasswordChange} />
            </CCol>
            <CCol xs={2}>Email</CCol>
            <CCol xs={10}>
              <CFormInput type="email" placeholder="Email" onChange={handleEmailChange} />
            </CCol>
            <CCol xs={2}>Role</CCol>
            <CCol xs={10}>
              <CFormSelect aria-label="Default select example" onChange={handleRoleChange}>
                <option value={0}>Select One</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={2}>Client</CCol>
            <CCol xs={10}>
              <CFormSelect
                aria-label="Default select example"
                value={client}
                onChange={handleClientChange}
                disabled={clientDisabled}
              >
                <option value={EMPTY_GUID}>Select One</option>
                {clients.map((client) => (
                  <option key={client.guid} value={client.guid}>
                    {client.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={2}>Operator name</CCol>
            <CCol xs={10}>
              <CFormInput
                placeholder="operator"
                onChange={handleNameChange}
                disabled={operatorDisabled}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddUserVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={addUser}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

/**
 * Botones y modales para editar o borrar un usuario; el correo es obligatorio salvo para Machine.
 * @param {object} props.User Usuario de la fila.
 * @param {Function} props.GetUsers Función que recarga la lista tras guardar.
 * @param {object} props.toast Ref del Toast donde se muestran los avisos.
 * @returns {JSX.Element} Los botones de edición y borrado con sus modales.
 */
const TaskUser = (props) => {
  let navigate = useNavigate()
  const [updateUserVisible, setUpdateUserVisible] = useState(false)
  const [newUserName, setNewUserName] = useState(props.User.username)
  const [deleteUserVisible, setDeleteUserVisible] = useState(false)
  const [newPassword, setNewPassword] = useState()
  const [newEmail, setNewEmail] = useState(props.User.email ?? '')
  const [newRole, setNewRole] = useState(props.User.idRole)
  const [client, setClient] = useState(props.User.idClient)
  const [clients, setClients] = useState([])
  const roles = getAssignableRoles(getSessionRole())
  const handleUserNameChange = (event) => {
    setNewUserName(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value)
  }
  const handleClientChange = (event) => {
    setClient(event.target.value)
  }
  const handleEmailChange = (event) => {
    setNewEmail(event.target.value)
  }
  const handleRoleChange = (event) => {
    setNewRole(event.target.value)
  }

  const fetchClients = async () => {
    if (!hasRole(getSessionRole(), [1, 2, 4])) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    } else {
      let clients = await GetClients()
      setClients(clients)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const updateUser = async () => {
    const problem = validateUserForm(newRole, client, newEmail)
    if (problem) {
      props.toast.current.showToast(problem)
      return
    }
    let user = props.User
    user.email = newEmail
    user.userName = newUserName
    user.password = newPassword
    user.idRole = newRole
    user.idClient = roleNeedsClient(newRole) ? client : undefined
    const result = await UpdateUser(props.User)
    if (typeof result === 'string') {
      props.toast.current.showToast(USER_ERROR_MESSAGES[result] ?? 'Could not update the user')
      return
    }
    props.GetUsers()
    setUpdateUserVisible(false)
    props.toast.current.showToast('User updated successfully')
  }
  const deleteUser = async () => {
    const result = await DeleteUser(props.User)
    if (result === 'fail') {
      props.toast.current.showToast('Could not delete the user')
      return
    }
    props.GetUsers()
    setDeleteUserVisible(false)
    props.toast.current.showToast('User deleted successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setUpdateUserVisible(true)}>
        <CIcon icon={cilPencil} size="sm" />
      </CButton>
      <CModal visible={updateUserVisible} onClose={() => setUpdateUserVisible(false)}>
        <CModalHeader>
          <CModalTitle>Updating User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={2}>User name</CCol>
            <CCol xs={10}>
              <CFormInput
                value={newUserName}
                placeholder="UserName"
                onChange={handleUserNameChange}
              />
            </CCol>
            <CCol xs={2}>Password</CCol>
            <CCol xs={10}>
              <CFormInput type="password" placeholder="Password" onChange={handlePasswordChange} />
            </CCol>
            <CCol xs={2}>Email</CCol>
            <CCol xs={10}>
              <CFormInput
                type="email"
                value={newEmail}
                placeholder="Email"
                onChange={handleEmailChange}
              />
            </CCol>
            <CCol xs={2}>Role</CCol>
            <CCol xs={10}>
              <CFormSelect
                value={newRole}
                aria-label="Default select example"
                onChange={handleRoleChange}
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={2}>Client</CCol>
            <CCol xs={10}>
              <CFormSelect
                aria-label="Default select example"
                value={client}
                onChange={handleClientChange}
                disabled={!roleNeedsClient(newRole)}
              >
                <option value={EMPTY_GUID}>Select One</option>
                {clients.map((client) => (
                  <option key={client.guid} value={client.guid}>
                    {client.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateUserVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={updateUser}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
      <CButton style={{ margin: '2pt' }} onClick={() => setDeleteUserVisible(true)}>
        <CIcon icon={cilX} size="sm" />
      </CButton>
      <CModal visible={deleteUserVisible} onClose={() => setDeleteUserVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <label>Are you sure?</label>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteUserVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={deleteUser}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

/**
 * Pantalla con la tabla de usuarios y sus acciones.
 * @returns {JSX.Element} La vista de usuarios.
 */
const Users = () => {
  let navigate = useNavigate()
  const [Users, setUsers] = useState([])
  const toastRef = useRef()
  const canEdit = hasRole(getSessionRole(), [ROLES.SUPER_ADMINISTRATOR, ROLES.SUPERVISOR])

  const fetchUsers = async () => {
    if (!hasRole(getSessionRole(), [1, 2, 4])) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    }
    let Users = await GetUsers()
    setUsers(Users)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <h1>Users</h1>
      {canEdit && <AddUserModal GetUsers={fetchUsers} toast={toastRef} />}
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">User name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {Users.map((User) => (
              <CTableRow key={User.guid}>
                <CTableHeaderCell>{User.username}</CTableHeaderCell>
                <CTableHeaderCell>{User.email ?? '—'}</CTableHeaderCell>
                <CTableHeaderCell>{ROLE_NAMES[User.idRole]}</CTableHeaderCell>
                <CTableHeaderCell>
                  {canEdit && <TaskUser GetUsers={fetchUsers} toast={toastRef} User={User} />}
                </CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default Users
