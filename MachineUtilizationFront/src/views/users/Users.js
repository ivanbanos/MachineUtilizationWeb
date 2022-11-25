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

const AddUserModal = (props) => {
  let navigate = useNavigate()
  let role = localStorage.getItem('role')
  let idClient = localStorage.getItem('idClient')
  const [addUserVisible, setAddUserVisible] = useState(false)
  const [newUserName, setNewUserName] = useState()
  const [newPassword, setNewPassword] = useState()
  const [newRole, setNewRole] = useState()
  const [clientDisabled, setclientDisabled] = useState(role == 1)
  const [operatorDisabled, setoperatorDisabled] = useState(true)
  const [client, setClient] = useState(idClient)
  const [clients, setClients] = useState([])
  const [name, setName] = useState('')
  let roles = []
  if (role == 1) {
    roles.push({ value: 1, name: 'Administrator' })
  }
  roles.push({ value: 2, name: 'Supervisor' })
  roles.push({ value: 3, name: 'Operator' })
  const handleUserNameChange = (event) => {
    setNewUserName(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value)
  }
  const handleClientChange = (event) => {
    console.log(event.target.value)
    setClient(event.target.value)
  }
  const handleNameChange = (event) => {
    setName(event.target.value)
  }
  const handleRoleChange = (event) => {
    setNewRole(event.target.value)
    if (event.target.value == 1) {
      setclientDisabled(true)
      setoperatorDisabled(true)
    }
    if (event.target.value == 2) {
      setclientDisabled(false)
      setoperatorDisabled(true)
    }
    if (event.target.value == 3) {
      setclientDisabled(false)
      setoperatorDisabled(false)
    }
  }
  const addUser = async () => {
    console.log(client)
    let user = await AddUser(newUserName, newPassword, newRole, client)
    if (newRole == 3) {
      await AddOperator(name, client, user.guid)
    }
    props.GetUsers()
    setAddUserVisible(false)
    props.toast.current.showToast('User added successfully')
  }

  const fetchClients = async () => {
    let role = localStorage.getItem('role')
    console.log(role)
    if (role > 2) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    } else {
      let clients = await GetClients()
      console.log(clients)
      setClients(clients)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddUserVisible(true)}>
        <CIcon icon={cilPlus} size="m" />
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
                <option value={'00000000-0000-0000-0000-000000000000'}>Select One</option>
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

const TaskUser = (props) => {
  let navigate = useNavigate()
  const [updateUserVisible, setUpdateUserVisible] = useState(false)
  const [newUserName, setNewUserName] = useState(props.User.username)
  const [deleteUserVisible, setDeleteUserVisible] = useState(false)
  let role = localStorage.getItem('role')
  let idClient = localStorage.getItem('idClient')
  const [newPassword, setNewPassword] = useState()
  const [newRole, setNewRole] = useState(props.User.idRole)
  const [client, setClient] = useState(props.User.idClient)
  const [clients, setClients] = useState([])
  console.log(props.User)
  let roles = []
  if (role == 1) {
    roles.push({ value: 1, name: 'Administrator' })
  }
  roles.push({ value: 2, name: 'Supervisor' })
  roles.push({ value: 3, name: 'Operator' })
  const handleUserNameChange = (event) => {
    setNewUserName(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value)
  }
  const handleClientChange = (event) => {
    console.log(event.target.value)
    setClient(event.target.value)
  }
  const handleRoleChange = (event) => {
    console.log(event.target.value)
    setNewRole(event.target.value)
  }

  const fetchClients = async () => {
    let role = localStorage.getItem('role')
    console.log(role)
    if (role > 2) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    } else {
      let clients = await GetClients()
      console.log(clients)
      setClients(clients)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const updateUser = async () => {
    let user = props.User
    user.userName = newUserName
    user.password = newPassword
    user.idRole = newRole
    user.idClient = client
    await UpdateUser(props.User)
    props.GetUsers()
    setUpdateUserVisible(false)
    props.toast.current.showToast('User updated successfully')
  }
  const deleteUser = async () => {
    await DeleteUser(props.User)
    props.GetUsers()
    setDeleteUserVisible(false)
    props.toast.current.showToast('User deleted successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setUpdateUserVisible(true)}>
        <CIcon icon={cilPencil} size="m" />
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
              >
                <option value={'00000000-0000-0000-0000-000000000000'}>Select One</option>
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
        <CIcon icon={cilX} size="m" />
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

const Users = () => {
  let navigate = useNavigate()
  const [Users, setUsers] = useState([])
  const toastRef = useRef()

  const fetchUsers = async () => {
    let role = localStorage.getItem('role')
    if (role > 2) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    }
    let Users = await GetUsers()
    console.log(Users)
    setUsers(Users)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <h1>Users</h1>
      <AddUserModal GetUsers={fetchUsers} toast={toastRef} />
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">User name</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {Users.map((User) => (
              <CTableRow key={User.guid}>
                <CTableHeaderCell>{User.username}</CTableHeaderCell>
                <CTableHeaderCell>
                  <TaskUser GetUsers={fetchUsers} toast={toastRef} User={User} />
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
