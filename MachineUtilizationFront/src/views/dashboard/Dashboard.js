import { React, useState, useEffect } from 'react'
import MachinesDropdown from '../machines/MachinesDropdown'
import GetMachines from '../../services/GetMachines'
import { CRow, CCol } from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  let navigate = useNavigate()
  const [machines, setMachines] = useState([])

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
      <CRow>
        {[...machines]
          .sort((a, b) => (a.clientName || '').localeCompare(b.clientName || ''))
          .map((machine) => (
            <CCol key={machine.guid} xs={12} sm={6} lg={4} xl={3}>
              <MachinesDropdown
                name={machine.name}
                guid={machine.guid}
                clientName={machine.clientName}
              />
            </CCol>
          ))}
      </CRow>
    </>
  )
}

export default Dashboard
