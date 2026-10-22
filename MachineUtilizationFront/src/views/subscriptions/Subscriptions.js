import React, { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import {
  CBadge,
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import GetClients from '../../services/GetClients'
import GetClientSubscription from '../../services/GetClientSubscription'
import SaveSubscription from '../../services/SaveSubscription'
import Toast from '../toast/Toast'
import SaveSubscriptionsBatch from '../../services/SaveSubscriptionsBatch'
import { exportExcel, readExcelRows } from '../../utils/excel'
import { getSessionRole, hasRole } from '../../utils/roles'

const DATE_FORMAT = 'MM-DD-YYYY'
const PLAN_NAMES = { 0: 'Monthly', 1: 'Annual' }
const STATUS_COLORS = {
  Active: 'success',
  ExpiringSoon: 'warning',
  Grace: 'danger',
  Suspended: 'danger',
  NotRegistered: 'secondary',
}
const REQUIRED_COLUMNS = ['Start date', 'End date']
const TEMPLATE_COLUMNS = ['Client', 'Client Id', 'Start date', 'End date']
const TEMPLATE_ROW = ['Acme Corp', '', '01-01-2026', '12-31-2026']
const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const IMPORT_ERRORS = {
  empty: 'The file has no rows',
  tooMany: 'The file has more than 500 rows',
  forbidden: 'Could not import subscriptions',
  fail: 'Could not import subscriptions',
}
const SAVE_ERRORS = {
  invalid: 'Invalid subscription dates',
  notFound: 'Client not found',
  fail: 'Could not save subscription',
}

/**
 * Da formato a una fecha de la API para mostrarla en la tabla.
 * @param {string|undefined} value Fecha ISO de la suscripción.
 * @returns {string} Fecha con formato MM-DD-YYYY, o cadena vacía si no hay valor.
 */
const formatDate = (value) => (value ? moment(value).format(DATE_FORMAT) : '')

/**
 * Indica si la suscripción de un cliente tiene datos para mostrar.
 * @param {object|string} subscription SubscriptionInfo de la API, o 'fail'.
 * @returns {boolean} true si la suscripción está registrada.
 */
const isRegistered = (subscription) =>
  subscription !== 'fail' && subscription.status !== 'NotRegistered'

/**
 * Modal de edición de la suscripción de un cliente.
 * @param {object} props Propiedades del componente.
 * @param {object} props.client Cliente con guid y name.
 * @param {object|string} props.subscription SubscriptionInfo actual del cliente, o 'fail'.
 * @param {Function} props.onSaved Recibe el guid del cliente y la SubscriptionInfo devuelta al guardar.
 * @param {object} props.toast Referencia al componente Toast para avisar del resultado.
 * @returns {JSX.Element} Botón de edición y su modal.
 */
const EditSubscriptionModal = ({ client, subscription, onSaved, toast }) => {
  const [visible, setVisible] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const open = () => {
    const registered = isRegistered(subscription)
    setStartDate(registered ? new Date(subscription.startDate) : new Date())
    setEndDate(registered ? new Date(subscription.endDate) : new Date())
    setVisible(true)
  }

  const save = async () => {
    if (moment(endDate).isBefore(startDate, 'day')) {
      toast.current.showToast('End date must be on or after start date')
      return
    }
    const response = await SaveSubscription({
      client: client.guid,
      startDate: moment(startDate).startOf('day').toISOString(),
      endDate: moment(endDate).startOf('day').toISOString(),
    })
    if (typeof response === 'string') {
      toast.current.showToast(SAVE_ERRORS[response] ?? SAVE_ERRORS.fail)
      return
    }
    onSaved(client.guid, response)
    setVisible(false)
    toast.current.showToast('Subscription saved')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={open}>
        <CIcon icon={cilPencil} size="sm" />
      </CButton>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Subscription - {client.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={save}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

/**
 * Fila de la tabla con la suscripción de un cliente.
 * @param {object} props Propiedades del componente.
 * @param {object} props.client Cliente con guid y name.
 * @param {object|string} props.subscription SubscriptionInfo del cliente, o 'fail' si no se pudo consultar.
 * @param {Function} props.onSaved Se invoca al guardar la suscripción desde el modal.
 * @param {object} props.toast Referencia al componente Toast.
 * @returns {JSX.Element} Fila con los datos o con 'Unavailable' si la consulta falló.
 */
const SubscriptionRow = ({ client, subscription, onSaved, toast }) => {
  const editor = (
    <EditSubscriptionModal
      client={client}
      subscription={subscription}
      onSaved={onSaved}
      toast={toast}
    />
  )

  if (subscription === 'fail') {
    return (
      <CTableRow>
        <CTableHeaderCell>{client.name}</CTableHeaderCell>
        <CTableDataCell colSpan={6}>Unavailable</CTableDataCell>
        <CTableDataCell>{editor}</CTableDataCell>
      </CTableRow>
    )
  }

  const registered = isRegistered(subscription)
  return (
    <CTableRow>
      <CTableHeaderCell>{client.name}</CTableHeaderCell>
      <CTableDataCell>{registered ? PLAN_NAMES[subscription.planType] : ''}</CTableDataCell>
      <CTableDataCell>{registered ? formatDate(subscription.startDate) : ''}</CTableDataCell>
      <CTableDataCell>{registered ? formatDate(subscription.endDate) : ''}</CTableDataCell>
      <CTableDataCell>{registered ? formatDate(subscription.graceEndDate) : ''}</CTableDataCell>
      <CTableDataCell>{registered ? subscription.daysRemaining : ''}</CTableDataCell>
      <CTableDataCell>
        <CBadge color={STATUS_COLORS[subscription.status] ?? 'secondary'}>
          {registered ? subscription.status : 'Not registered'}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>{editor}</CTableDataCell>
    </CTableRow>
  )
}

/**
 * Modal con el resultado de una importación en lote.
 * @param {object} props Propiedades del componente.
 * @param {object[]|null} props.results Resultados por fila de la API; null mantiene el modal cerrado.
 * @param {Function} props.onClose Se invoca al cerrar el modal.
 * @returns {JSX.Element} Resumen y tabla con una fila por registro importado.
 */
const ImportResultModal = ({ results, onClose }) => {
  const list = results ?? []
  const saved = list.filter((result) => result.status === 'Saved').length
  return (
    <CModal visible={results !== null} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Import result</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          {saved} saved, {list.length - saved} with errors
        </p>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Row</CTableHeaderCell>
              <CTableHeaderCell scope="col">Client</CTableHeaderCell>
              <CTableHeaderCell scope="col">Created</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Error</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {list.map((result) => (
              <CTableRow key={result.row}>
                <CTableDataCell>{result.row}</CTableDataCell>
                <CTableDataCell>{result.clientName}</CTableDataCell>
                <CTableDataCell>{result.clientCreated ? 'Yes' : 'No'}</CTableDataCell>
                <CTableDataCell>{result.status}</CTableDataCell>
                <CTableDataCell>{result.error}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

/**
 * Pantalla del administrador con la suscripción de cada cliente.
 * Carga clientes y suscripciones en paralelo; si el rol guardado no es 1 redirige a /Login.
 * Permite importar suscripciones en lote desde Excel y descargar la plantilla.
 * @returns {JSX.Element} Tabla de suscripciones con edición por fila y acciones de importación.
 */
const Subscriptions = () => {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [importResults, setImportResults] = useState(null)
  const fileInputRef = useRef()
  const toastRef = useRef()

  const fetchSubscriptions = async () => {
    if (!hasRole(getSessionRole(), [1])) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
      return
    }
    const clients = await GetClients()
    const subscriptions = await Promise.all(
      clients.map((client) => GetClientSubscription(client.guid)),
    )
    setRows(clients.map((client, index) => ({ client, subscription: subscriptions[index] })))
  }

  const replaceSubscription = (clientGuid, subscription) => {
    setRows((current) =>
      current.map((row) => (row.client.guid === clientGuid ? { ...row, subscription } : row)),
    )
  }

  const importFile = async (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) {
      return
    }
    const fileRows = await readExcelRows(file)
    const [firstRow = {}] = fileRows
    const hasRequiredColumns =
      REQUIRED_COLUMNS.every((column) => column in firstRow) &&
      ('Client' in firstRow || 'Client Id' in firstRow)
    if (fileRows.length > 0 && !hasRequiredColumns) {
      toastRef.current.showToast(
        'The file must have the columns Client (or Client Id), Start date and End date',
      )
      return
    }
    const invalidIdRow = fileRows.findIndex(
      (row) => row['Client Id'] && !GUID_PATTERN.test(String(row['Client Id']).trim()),
    )
    if (invalidIdRow >= 0) {
      toastRef.current.showToast('Row ' + (invalidIdRow + 1) + ' has an invalid Client Id')
      return
    }
    const response = await SaveSubscriptionsBatch(
      fileRows.map((row) => ({
        clientId: row['Client Id'] ? String(row['Client Id']).trim() : undefined,
        clientName: row['Client'],
        startDate: row['Start date'],
        endDate: row['End date'],
      })),
    )
    if (typeof response === 'string') {
      toastRef.current.showToast(IMPORT_ERRORS[response] ?? IMPORT_ERRORS.fail)
      return
    }
    setImportResults(response)
  }

  const closeImportResults = () => {
    setImportResults(null)
    fetchSubscriptions()
  }

  const downloadTemplate = () => {
    exportExcel('subscriptions-template.xlsx', 'Subscriptions', TEMPLATE_COLUMNS, [TEMPLATE_ROW])
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <ImportResultModal results={importResults} onClose={closeImportResults} />
      <h1>Subscriptions</h1>
      <CRow>
        <CCol>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={importFile}
          />
          <CButton style={{ margin: '2pt' }} onClick={() => fileInputRef.current.click()}>
            Import from Excel
          </CButton>
          <CButton style={{ margin: '2pt' }} color="secondary" onClick={downloadTemplate}>
            Download template
          </CButton>
        </CCol>
      </CRow>
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Client</CTableHeaderCell>
              <CTableHeaderCell scope="col">Plan</CTableHeaderCell>
              <CTableHeaderCell scope="col">Start</CTableHeaderCell>
              <CTableHeaderCell scope="col">Expires</CTableHeaderCell>
              <CTableHeaderCell scope="col">Grace ends</CTableHeaderCell>
              <CTableHeaderCell scope="col">Days remaining</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rows.map((row) => (
              <SubscriptionRow
                key={row.client.guid}
                client={row.client}
                subscription={row.subscription}
                onSaved={replaceSubscription}
                toast={toastRef}
              />
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default Subscriptions
