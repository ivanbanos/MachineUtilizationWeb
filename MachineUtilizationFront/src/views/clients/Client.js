import { React, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import GetClients from '../../services/GetClients'
import { useParams } from 'react-router-dom'
import * as moment from 'moment'
import AddClient from '../../services/AddClient'
import UpdateClient from '../../services/UpdateClient'
import DeleteClient from '../../services/DeleteClient'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import {
  cilCalculator,
  cilSpeedometer,
  cilUser,
  cilPlus,
  cilPencil,
  cilX,
  cilZoom,
} from '@coreui/icons'
import {
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import Toast from '../toast/Toast'

const Clients = () => {
  let navigate = useNavigate()
  let { clientId } = useParams()
  const [client, setClient] = useState({ name: '' })
  const toastRef = useRef()

  const fetchClients = async () => {
    let role = localStorage.getItem('role')
    if (role > 1) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    }
    let clients = await GetClients()
    console.log(clients)
    console.log(clientId)
    console.log(clients.filter((element) => element.guid >= clientId)[0])
    setClient(clients.filter((element) => element.guid >= clientId)[0])
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <h1>{client.name}</h1>
    </>
  )
}

export default Clients
