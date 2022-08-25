import { React, useState, useEffect } from 'react'
import MachinesDropdown from '../machines/MachinesDropdown'
import GetMachines from '../../services/GetMachines'
import { CRow } from '@coreui/react'
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
        {machines.map((machine) => (
          <MachinesDropdown key={machine.guid} name={machine.name} guid={machine.guid} />
        ))}
      </CRow>
    </>
  )
}

export default Dashboard
