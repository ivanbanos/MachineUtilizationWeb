import { React, useState, useEffect, useRef } from 'react'
import GetMachines from '../../services/GetMachines'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
} from '@coreui/react'
import { cilOptions, cilCalculator } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../toast/Toast'
import SetOperator from 'src/services/SetOperator'

const AddUOperatorToMachineUtilization = (props) => {
  let userId = localStorage.getItem('userId')
  const [addOperatorVisible, setAddUOperatorVisible] = useState(false)
  const [newHour, setNewHour] = useState()
  const handleHoursChange = (event) => {
    setNewHour(event.target.value)
  }
  const setOperatorToMachine = async () => {
    await SetOperator(props.guid, newHour)
    setAddUOperatorVisible(false)
    props.toast.current.showToast('Operator setted successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddUOperatorVisible(true)}>
        +
      </CButton>
      <CModal visible={addOperatorVisible} onClose={() => setAddUOperatorVisible(false)}>
        <CModalHeader>
          <CModalTitle>Set as operator for the shift</CModalTitle>
        </CModalHeader>
        <CModalBody>
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

const MachinesDropdown = (props) => {
  return (
    <CCol sm={6} lg={3}>
      <CWidgetStatsA
        className="mb-4"
        color="primary"
        value={
          <>
            <CIcon icon={cilCalculator} className="text-high-emphasis-inverse" />
            <label>{props.name}</label>
          </>
        }
        title={props.guid}
        action={
          <AddUOperatorToMachineUtilization
            toast={props.toast}
            guid={props.guid}
          ></AddUOperatorToMachineUtilization>
        }
      />
    </CCol>
  )
}

const Dashboard = () => {
  let navigate = useNavigate()
  const [machines, setMachines] = useState([])

  const toastRef = useRef()
  const fetchMachines = async () => {
    let response = await GetMachines()
    if (response == 'fail') {
      navigate('/Login', { replace: true })
    } else {
      setMachines(response)
    }
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <CRow>
        {machines.map((machine) => (
          <MachinesDropdown
            toast={toastRef}
            key={machine.guid}
            name={machine.name}
            guid={machine.guid}
          />
        ))}
      </CRow>
    </>
  )
}

export default Dashboard
