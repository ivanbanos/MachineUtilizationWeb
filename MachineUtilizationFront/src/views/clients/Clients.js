import { React, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import GetClients from '../../services/GetClients'
import AddClient from '../../services/AddClient'
import UpdateClient from '../../services/UpdateClient'
import DeleteClient from '../../services/DeleteClient'
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
} from '@coreui/react'

import Toast from '../toast/Toast'

const AddClientModal = (props) => {
  const [addClientVisible, setAddClientVisible] = useState(false)
  const [newClientName, setNewClientName] = useState()
  const handleNameChange = (event) => {
    setNewClientName(event.target.value)
  }
  const addClient = async () => {
    await AddClient(newClientName)
    props.GetClients()
    setAddClientVisible(false)
    props.toast.current.showToast('Client added successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddClientVisible(true)}>
        <CIcon icon={cilPlus} size="m" />
      </CButton>
      <CModal visible={addClientVisible} onClose={() => setAddClientVisible(false)}>
        <CModalHeader>
          <CModalTitle>Adding Client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={2}>Name</CCol>
            <CCol xs={10}>
              <CFormInput placeholder="Name" onChange={handleNameChange} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddClientVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={addClient}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const TaskClient = (props) => {
  let navigate = useNavigate()
  const [updateClientVisible, setUpdateClientVisible] = useState(false)
  const [newClientName, setNewClientName] = useState(props.Client.name)
  const [deleteClientVisible, setDeleteClientVisible] = useState(false)
  const handleNameChange = (event) => {
    setNewClientName(event.target.value)
  }
  const updateClient = async () => {
    await UpdateClient(props.Client, newClientName)
    props.GetClients()
    setUpdateClientVisible(false)
    props.toast.current.showToast('Client updated successfully')
  }
  const deleteClient = async () => {
    await DeleteClient(props.Client)
    props.GetClients()
    setDeleteClientVisible(false)
    props.toast.current.showToast('Client deleted successfully')
  }

  const GoClient = async (event) => {
    event.preventDefault()
    navigate('/Client/' + props.Client.guid, { replace: true })
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setUpdateClientVisible(true)}>
        <CIcon icon={cilPencil} size="m" />
      </CButton>
      <CModal visible={updateClientVisible} onClose={() => setUpdateClientVisible(false)}>
        <CModalHeader>
          <CModalTitle>Updating Client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={2}>Name</CCol>
            <CCol xs={10}>
              <CFormInput placeholder="Name" onChange={handleNameChange} value={newClientName} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateClientVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={updateClient}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
      <CButton style={{ margin: '2pt' }} onClick={() => setDeleteClientVisible(true)}>
        <CIcon icon={cilX} size="m" />
      </CButton>
      <CModal visible={deleteClientVisible} onClose={() => setDeleteClientVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <label>Are you sure?</label>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteClientVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={deleteClient}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const Clients = () => {
  let navigate = useNavigate()
  const [clients, setClients] = useState([])
  const toastRef = useRef()

  const fetchClients = async () => {
    let role = localStorage.getItem('role')
    if (role > 1) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    }
    let clients = await GetClients()

    setClients(clients)
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <h1>Clients</h1>
      <AddClientModal GetClients={fetchClients} toast={toastRef} />
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {clients.map((client) => (
              <CTableRow key={client.guid}>
                <CTableHeaderCell>{client.name}</CTableHeaderCell>
                <CTableHeaderCell>
                  <TaskClient GetClients={fetchClients} toast={toastRef} Client={client} />
                </CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default Clients
