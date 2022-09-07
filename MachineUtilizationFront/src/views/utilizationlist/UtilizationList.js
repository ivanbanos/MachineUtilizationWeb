import { React, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import GetMachineUtilizations from '../../services/GetMachineUtilizations'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import GetMachines from '../../services/GetMachines'
import AddOperator from '../../services/AddOperator'
import GetListOperators from '../../services/GetListOperators'
import AddOperatorToMachineUtilization from '../../services/AddOperatorToMachineUtilization'
import * as moment from 'moment'
import { useNavigate } from 'react-router-dom'
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

const MachineOperator = (props) => {
  const [operatorSelected, setOperator] = useState(props.selected)

  const addOperatorToMachineUtilization = async (operator) => {
    console.log(props.machineUtilizationId)
    await AddOperatorToMachineUtilization(operator, props.machineUtilizationId)
  }

  const handleOperatorChange = (event) => {
    setOperator(event.target.value)
    addOperatorToMachineUtilization(event.target.value)
    props.toast.current.showToast('Operator changed successfully')
  }

  return (
    <>
      <CFormSelect
        aria-label="Default select example"
        value={operatorSelected}
        onChange={handleOperatorChange}
      >
        <option value={'00000000-0000-0000-0000-000000000000'}>Select One</option>
        {props.operators.map((operator) => (
          <option key={operator.guid} value={operator.guid}>
            {operator.name}
          </option>
        ))}
      </CFormSelect>
    </>
  )
}

const AddOperatorComponent = (props) => {
  const [addOperatorVisible, setAddOperatorVisible] = useState(false)
  const [newOperatorName, setNewOperatorName] = useState()
  const handleNameChange = (event) => {
    setNewOperatorName(event.target.value)
  }
  const addOperator = async () => {
    await AddOperator(newOperatorName)
    props.GetOperators(props.Machine)
    setAddOperatorVisible(false)
    props.toast.current.showToast('Operator added successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddOperatorVisible(true)}>
        Add operator
      </CButton>
      <CModal visible={addOperatorVisible} onClose={() => setAddOperatorVisible(false)}>
        <CModalHeader>
          <CModalTitle>Adding operator</CModalTitle>
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
          <CButton color="secondary" onClick={() => setAddOperatorVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={addOperator}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const UtilizationList = () => {
  let navigate = useNavigate()
  let { machineId } = useParams()
  const [strat, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())
  const [operator, setOperator] = useState('00000000-0000-0000-0000-000000000000')
  const [machineUtilizations, setMachineUtilizations] = useState([])
  const [machine, setMachine] = useState({ name: '' })
  const [operators, setOperators] = useState([])
  const toastRef = useRef()

  const getListOperators = async (machine) => {
    let operators = await GetListOperators(machine.guid)
    setOperators(operators)
  }

  const fetchMachineUtilizations = async () => {
    let machines = await GetMachines()
    setMachine(machines.filter((element) => element.guid >= machineId)[0])
    let response = await GetMachineUtilizations(
      machineId,
      moment(strat).format('MM-DD-YYYY'),
      moment(end).format('MM-DD-YYYY'),
      operator,
    )
    if (response == 'fail') {
      navigate('/Login', { replace: true })
    } else {
      console.log(machineUtilizations.map((machine) => machine.date))
      setMachineUtilizations(response)
    }
    await getListOperators(machines.filter((element) => element.guid >= machineId)[0])
  }

  useEffect(() => {
    fetchMachineUtilizations()
  }, [])

  const handleOperatorChange = (event) => {
    setOperator(event.target.value)
  }

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <h1>Machine Utilization List</h1>
      <h2>{machine.name}</h2>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Filters</CCardHeader>
            <CCardBody>
              <CCardText>
                <CRow>
                  <CCol style={{ margin: '2pt' }} xs={2}>
                    Start date
                  </CCol>
                  <CCol style={{ margin: '2pt' }} xs={10}>
                    <DatePicker selected={strat} onChange={(date) => setStart(date)} />
                  </CCol>
                  <CCol style={{ margin: '2pt' }} xs={2}>
                    End date
                  </CCol>
                  <CCol style={{ margin: '2pt' }} xs={10}>
                    <DatePicker selected={end} onChange={(date) => setEnd(date)} />
                  </CCol>
                  <CCol style={{ margin: '2pt' }} xs={2}>
                    Operator
                  </CCol>
                  <CCol style={{ margin: '2pt' }} xs={10}>
                    <CFormSelect
                      aria-label="Default select example"
                      value={operator}
                      onChange={handleOperatorChange}
                    >
                      <option value={'00000000-0000-0000-0000-000000000000'}>Select One</option>
                      {operators.map((operator) => (
                        <option key={operator.guid} value={operator.guid}>
                          {operator.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
              </CCardText>
              <CButton
                color="primary"
                style={{ margin: '2pt' }}
                className="px-4"
                onClick={fetchMachineUtilizations}
              >
                Filter
              </CButton>
              <AddOperatorComponent
                GetOperators={getListOperators}
                Machine={machine}
                toast={toastRef}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Day</CTableHeaderCell>
              <CTableHeaderCell scope="col">Power On</CTableHeaderCell>
              <CTableHeaderCell scope="col">Power Off</CTableHeaderCell>
              <CTableHeaderCell scope="col">Production time</CTableHeaderCell>
              <CTableHeaderCell scope="col">Idle time</CTableHeaderCell>
              <CTableHeaderCell scope="col">Operator</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {machineUtilizations.map((machineUtilization) => (
              <CTableRow key={machineUtilization.guid}>
                <CTableHeaderCell>
                  {moment(machineUtilization.date).format('MM-DD-YYYY')}
                </CTableHeaderCell>
                <CTableHeaderCell>
                  {(machineUtilization.productionTime + machineUtilization.idleTime).toFixed(2)}
                </CTableHeaderCell>
                <CTableHeaderCell>
                  {(24 - machineUtilization.productionTime - machineUtilization.idleTime).toFixed(
                    2,
                  )}
                </CTableHeaderCell>
                <CTableHeaderCell>{machineUtilization.productionTime.toFixed(2)}</CTableHeaderCell>
                <CTableHeaderCell>{machineUtilization.idleTime.toFixed(2)}</CTableHeaderCell>
                <CTableHeaderCell>
                  <MachineOperator
                    operators={operators}
                    selected={machineUtilization.operator}
                    machineUtilizationId={machineUtilization.guid}
                    toast={toastRef}
                  ></MachineOperator>
                </CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default UtilizationList
