import { React, useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import GetClients from '../../services/GetClients'
import AddClient from '../../services/AddClient'
import UpdateClient from '../../services/UpdateClient'
import DeleteClient from '../../services/DeleteClient'
import { useNavigate } from 'react-router-dom'
import { ROLES, getSessionRole, hasRole, isReadOnly } from '../../utils/roles'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilX } from '@coreui/icons'
import {
  CButton,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import Toast from '../toast/Toast'

const API_DATE_FORMAT = 'YYYY-MM-DD'
const ADD_ERRORS = {
  invalid: 'Invalid subscription dates',
  forbidden: 'You are not allowed to add subscriptions',
  fail: 'Could not add the client',
}

/**
 * Modal de alta de un cliente, con suscripción anual opcional.
 * @param {object} props Propiedades del componente.
 * @param {Function} props.GetClients Recarga la lista de clientes tras un alta exitosa.
 * @param {object} props.toast Referencia al componente Toast para avisar del resultado.
 * @returns {JSX.Element} Botón de alta y su modal.
 */
const AddClientModal = (props) => {
  const [addClientVisible, setAddClientVisible] = useState(false)
  const [newClientName, setNewClientName] = useState()
  const [includeSubscription, setIncludeSubscription] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(moment().add(1, 'year').toDate())
  const handleNameChange = (event) => {
    setNewClientName(event.target.value)
  }
  const addClient = async () => {
    if (includeSubscription && moment(endDate).isBefore(startDate, 'day')) {
      props.toast.current.showToast('End date must be on or after start date')
      return
    }
    const subscription = includeSubscription
      ? {
          startDate: moment(startDate).format(API_DATE_FORMAT),
          endDate: moment(endDate).format(API_DATE_FORMAT),
        }
      : undefined
    const response = await AddClient(newClientName, subscription)
    if (response !== true) {
      props.toast.current.showToast(ADD_ERRORS[response] ?? ADD_ERRORS.fail)
      return
    }
    props.GetClients()
    setAddClientVisible(false)
    props.toast.current.showToast('Client added successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddClientVisible(true)}>
        <CIcon icon={cilPlus} size="sm" />
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
          <CRow>
            <CCol style={{ margin: '2pt' }}>
              <CFormCheck
                label="Include subscription"
                checked={includeSubscription}
                onChange={(event) => setIncludeSubscription(event.target.checked)}
              />
            </CCol>
          </CRow>
          {includeSubscription && (
            <CRow>
              <CCol style={{ margin: '2pt' }} xs={3}>
                Plan
              </CCol>
              <CCol style={{ margin: '2pt' }} xs={8}>
                Annual
              </CCol>
              <CCol style={{ margin: '2pt' }} xs={3}>
                Start date
              </CCol>
              <CCol style={{ margin: '2pt' }} xs={8}>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
              </CCol>
              <CCol style={{ margin: '2pt' }} xs={3}>
                End date
              </CCol>
              <CCol style={{ margin: '2pt' }} xs={8}>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
              </CCol>
            </CRow>
          )}
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

/**
 * Botones de edición y borrado de un cliente, con sus modales.
 * @param {object} props Propiedades del componente.
 * @param {object} props.Client Cliente con guid y name.
 * @param {Function} props.GetClients Recarga la lista de clientes tras un cambio exitoso.
 * @param {object} props.toast Referencia al componente Toast para avisar del resultado.
 * @returns {JSX.Element} Acciones de edición y borrado.
 */
const TaskClient = (props) => {
  let navigate = useNavigate()
  const [updateClientVisible, setUpdateClientVisible] = useState(false)
  const [newClientName, setNewClientName] = useState(props.Client.name)
  const [deleteClientVisible, setDeleteClientVisible] = useState(false)
  const handleNameChange = (event) => {
    setNewClientName(event.target.value)
  }
  const updateClient = async () => {
    const response = await UpdateClient(props.Client, newClientName)
    if (response === 'fail') {
      props.toast.current.showToast('Could not update the client')
      return
    }
    props.GetClients()
    setUpdateClientVisible(false)
    props.toast.current.showToast('Client updated successfully')
  }
  const deleteClient = async () => {
    const response = await DeleteClient(props.Client)
    if (response === 'fail') {
      props.toast.current.showToast('Could not delete the client')
      return
    }
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
        <CIcon icon={cilPencil} size="sm" />
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
        <CIcon icon={cilX} size="sm" />
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

/**
 * Pantalla de clientes; el rol 1 gestiona y el rol 4 solo consulta.
 * Si el rol guardado no es 1 ni 4 redirige a /Login.
 * @returns {JSX.Element} Tabla de clientes con alta, edición y borrado según el rol.
 */
const Clients = () => {
  let navigate = useNavigate()
  const [clients, setClients] = useState([])
  const toastRef = useRef()
  const readOnly = isReadOnly(getSessionRole())
  const showId = hasRole(getSessionRole(), [ROLES.SUPER_ADMINISTRATOR])

  const fetchClients = async () => {
    if (!hasRole(getSessionRole(), [1, 4])) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
      return
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
      {!readOnly && <AddClientModal GetClients={fetchClients} toast={toastRef} />}
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              {showId && <CTableHeaderCell scope="col">Id</CTableHeaderCell>}
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {clients.map((client) => (
              <CTableRow key={client.guid}>
                <CTableHeaderCell>{client.name}</CTableHeaderCell>
                {showId && (
                  <CTableDataCell className="font-monospace">{client.guid}</CTableDataCell>
                )}
                <CTableHeaderCell>
                  {!readOnly && (
                    <TaskClient GetClients={fetchClients} toast={toastRef} Client={client} />
                  )}
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
