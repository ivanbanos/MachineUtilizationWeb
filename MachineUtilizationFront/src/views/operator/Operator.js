import { React, useState, useEffect, useRef } from 'react'
import GetMachines from '../../services/GetMachines'
import SetOperator from '../../services/SetOperator'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CButton,
} from '@coreui/react'
import { cilOptions, cilCalculator } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../toast/Toast'

const MachinesDropdown = (props) => {
  const setOperator = async () => {
    await SetOperator(props.guid)

    props.toast.current.showToast('Operator setted successfully')
  }
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
          <CDropdown alignment="end">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem>
                <CButton onClick={setOperator}>Set as operator for the shift</CButton>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
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
