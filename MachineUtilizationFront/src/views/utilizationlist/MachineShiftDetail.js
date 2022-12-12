import { React, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import GetMachines from '../../services/GetMachines'
import AddOperatorToMachineUtilization from '../../services/AddOperatorToMachineUtilization'
import * as moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilEye, cilMagnifyingGlass } from '@coreui/icons'
import GetShiftDetail from 'src/services/GetShiftDetail'
import GetAllOperators from '../../services/GetAllOperators'
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
import GetMachineUtilizationInformation from 'src/services/GetMachineUtilizationInformation'

const AddUOperatorToMachineUtilization = (props) => {
  let userId = localStorage.getItem('userId')
  const [addOperatorVisible, setAddUOperatorVisible] = useState(false)
  const [operators, setOperators] = useState([])
  const [operator, setOperator] = useState()
  const [newHour, setNewHour] = useState()
  const handleHoursChange = (event) => {
    setNewHour(event.target.value)
  }
  const setOperatorToMachine = async () => {
    await AddOperatorToMachineUtilization(operator, props.guid, newHour)
    setAddUOperatorVisible(false)
    props.toast.current.showToast('Operator setted successfully')
  }
  const fetchOperators = async () => {
    let operators = await GetAllOperators()
    setOperators(operators)
  }

  const handleOperatorChange = (event) => {
    setOperator(event.target.value)
  }

  useEffect(() => {
    fetchOperators()
  }, [])

  return (
    <>
      <CRow className="justify-content-end">
        <CCol xs="auto">
          <CButton style={{ margin: '2pt' }} onClick={() => setAddUOperatorVisible(true)}>
            +
          </CButton>
        </CCol>
      </CRow>
      <CModal visible={addOperatorVisible} onClose={() => setAddUOperatorVisible(false)}>
        <CModalHeader>
          <CModalTitle>Set as operator for the shift</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={2}>Operators</CCol>
            <CCol xs={10}>
              <CFormSelect
                aria-label="Default select example"
                GetOperators={fetchOperators}
                onChange={handleOperatorChange}
              >
                <option>Select Operator</option>
                {operators.map((operator) => (
                  <option value={operator.guid} key={operator.guid}>
                    {operator.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={2}>Hours</CCol>
            <CCol xs={10}>
              <CFormInput placeholder="Hours" onChange={handleHoursChange} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddUOperatorVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={setOperatorToMachine}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const MachineShiftDetail = () => {
  let navigate = useNavigate()
  let { machineUtilizationId } = useParams()
  const [machineUtilization, setMachineUtilization] = useState([])
  const [machineUtilizationOperators, setMachineUtilizationOperators] = useState([])
  const toastRef = useRef()

  const fetchShiftDetail = async () => {
    let machineUtilization = await GetMachineUtilizationInformation(machineUtilizationId)
    setMachineUtilization(machineUtilization)
    let response = await GetShiftDetail(machineUtilizationId)
    if (response == 'fail') {
      navigate('/Login', { replace: true })
    } else {
      setMachineUtilizationOperators(response)
    }
  }

  useEffect(() => {
    fetchShiftDetail()
  }, [])

  return (
    <>
      <CRow>
        <CCol>
          <Toast ref={toastRef}></Toast>
          <h1>Machine Shift Detail</h1>
          <h2>{machineUtilization.name}</h2>
          <h5>{moment(machineUtilization.date).format('MM-DD-YYYY')}</h5>
        </CCol>
        <CCol className="align-self-end">
          <AddUOperatorToMachineUtilization
            toast={toastRef}
            guid={machineUtilizationId}
          ></AddUOperatorToMachineUtilization>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Information</CCardHeader>
            <CCardBody>
              <CCardText>
                <CRow>
                  <CCol xs={6} sm={3}>
                    Power On
                  </CCol>
                  <CCol xs={6} sm={3}>
                    {(machineUtilization.productionTime + machineUtilization.idleTime).toFixed(2)}
                  </CCol>
                  <CCol xs={6} sm={3}>
                    Power Off
                  </CCol>
                  <CCol xs={6} sm={3}>
                    {(24 - machineUtilization.productionTime - machineUtilization.idleTime).toFixed(
                      2,
                    )}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs={6} sm={3}>
                    Production time
                  </CCol>
                  <CCol xs={6} sm={3}>
                    {Number(machineUtilization.productionTime).toFixed(2)}
                  </CCol>
                  <CCol xs={6} sm={3}>
                    Idle time
                  </CCol>
                  <CCol xs={6} sm={3}>
                    {Number(machineUtilization.idleTime).toFixed(2)}
                  </CCol>
                </CRow>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Operator</CTableHeaderCell>
              <CTableHeaderCell scope="col">Hours</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {machineUtilizationOperators.map((machineUtilizationOperator) => (
              <CTableRow key={machineUtilizationOperator.guid}>
                <CTableHeaderCell> {machineUtilizationOperator.operatorName}</CTableHeaderCell>
                <CTableHeaderCell>{machineUtilizationOperator.hours.toFixed(2)}</CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default MachineShiftDetail
