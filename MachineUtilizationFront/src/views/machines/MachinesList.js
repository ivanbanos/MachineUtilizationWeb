import { React, useState, useEffect, useRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import GetMachines from '../../services/GetMachines'
import AddMachine from '../../services/AddMachine'
import DeleteMachine from 'src/services/DeleteMachine'
import UpdateMachine from 'src/services/UpdateMachine'
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

const AddMachineModal = (props) => {
  const [addMachineVisible, setAddMachineVisible] = useState(false)
  const [newMachineName, setNewMachineName] = useState()
  const handleNameChange = (event) => {
    setNewMachineName(event.target.value)
  }
  const addMachine = async () => {
    await AddMachine(newMachineName)
    props.GetMachines()
    setAddMachineVisible(false)
    props.toast.current.showToast('Machine added successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddMachineVisible(true)}>
        <CIcon icon={cilPlus} size="m" />
      </CButton>
      <CModal visible={addMachineVisible} onClose={() => setAddMachineVisible(false)}>
        <CModalHeader>
          <CModalTitle>Adding Machine</CModalTitle>
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
          <CButton color="secondary" onClick={() => setAddMachineVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={addMachine}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const TaskMachine = (props) => {
  let navigate = useNavigate()
  const [updateMachineVisible, setUpdateMachineVisible] = useState(false)
  const [newMachineName, setNewMachineName] = useState(props.Machine.name)
  const [deleteMachineVisible, setDeleteMachineVisible] = useState(false)
  const handleNameChange = (event) => {
    setNewMachineName(event.target.value)
  }
  const updateMachine = async () => {
    await UpdateMachine(props.Machine, newMachineName)
    props.GetMachines()
    setUpdateMachineVisible(false)
    props.toast.current.showToast('Machine updated successfully')
  }
  const deleteMachine = async () => {
    await DeleteMachine(props.Machine)
    props.GetMachines()
    setDeleteMachineVisible(false)
    props.toast.current.showToast('Machine deleted successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setUpdateMachineVisible(true)}>
        <CIcon icon={cilPencil} size="m" />
      </CButton>
      <CModal visible={updateMachineVisible} onClose={() => setUpdateMachineVisible(false)}>
        <CModalHeader>
          <CModalTitle>Updating Machine</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={2}>Name</CCol>
            <CCol xs={10}>
              <CFormInput placeholder="Name" onChange={handleNameChange} value={newMachineName} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateMachineVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={updateMachine}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
      <CButton style={{ margin: '2pt' }} onClick={() => setDeleteMachineVisible(true)}>
        <CIcon icon={cilX} size="m" />
      </CButton>
      <CModal visible={deleteMachineVisible} onClose={() => setDeleteMachineVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Machine</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <label>Are you sure?</label>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteMachineVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={deleteMachine}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const MachinesList = () => {
  let navigate = useNavigate()
  const [Machines, setMachines] = useState([])
  const toastRef = useRef()

  const fetchMachines = async () => {
    let role = localStorage.getItem('role')
    if (role > 2) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    }
    let Machines = await GetMachines()

    setMachines(Machines)
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <h1>Machines</h1>
      <AddMachineModal GetMachines={fetchMachines} toast={toastRef} />
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {Machines.map((Machine) => (
              <CTableRow key={Machine.guid}>
                <CTableHeaderCell>{Machine.name}</CTableHeaderCell>
                <CTableHeaderCell>
                  <TaskMachine GetMachines={fetchMachines} toast={toastRef} Machine={Machine} />
                </CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default MachinesList
