import { React, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import GetAllOperators from '../../services/GetAllOperators'
import AddOperator from '../../services/AddOperator'
import UpdateOperator from '../../services/UpdateOperator'
import DeleteOperator from '../../services/DeleteOperator'
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

const AddOperatorModal = (props) => {
  const [addOperatorVisible, setAddOperatorVisible] = useState(false)
  const [newOperatorName, setNewOperatorName] = useState()
  const handleNameChange = (event) => {
    setNewOperatorName(event.target.value)
  }
  const addOperator = async () => {
    const client = localStorage.getItem('idClient')
    await AddOperator(newOperatorName, client)
    props.GetOperators()
    setAddOperatorVisible(false)
    props.toast.current.showToast('Operator added successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddOperatorVisible(true)}>
        <CIcon icon={cilPlus} size="m" />
      </CButton>
      <CModal visible={addOperatorVisible} onClose={() => setAddOperatorVisible(false)}>
        <CModalHeader>
          <CModalTitle>Adding Operator</CModalTitle>
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

const TaskOperator = (props) => {
  let navigate = useNavigate()
  const [updateOperatorVisible, setUpdateOperatorVisible] = useState(false)
  const [newOperatorName, setNewOperatorName] = useState(props.Operator.name)
  const [deleteOperatorVisible, setDeleteOperatorVisible] = useState(false)
  const handleNameChange = (event) => {
    setNewOperatorName(event.target.value)
  }
  const updateOperator = async () => {
    await UpdateOperator(props.Operator, newOperatorName)
    props.GetOperators()
    setUpdateOperatorVisible(false)
    props.toast.current.showToast('Operator updated successfully')
  }
  const deleteOperator = async () => {
    await DeleteOperator(props.Operator)
    props.GetOperators()
    setDeleteOperatorVisible(false)
    props.toast.current.showToast('Operator deleted successfully')
  }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setUpdateOperatorVisible(true)}>
        <CIcon icon={cilPencil} size="m" />
      </CButton>
      <CModal visible={updateOperatorVisible} onClose={() => setUpdateOperatorVisible(false)}>
        <CModalHeader>
          <CModalTitle>Updating Operator</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={2}>Name</CCol>
            <CCol xs={10}>
              <CFormInput placeholder="Name" onChange={handleNameChange} value={newOperatorName} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateOperatorVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={updateOperator}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
      <CButton style={{ margin: '2pt' }} onClick={() => setDeleteOperatorVisible(true)}>
        <CIcon icon={cilX} size="m" />
      </CButton>
      <CModal visible={deleteOperatorVisible} onClose={() => setDeleteOperatorVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Operator</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <label>Are you sure?</label>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteOperatorVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={deleteOperator}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const Operators = () => {
  let navigate = useNavigate()
  const [operators, setOperators] = useState([])
  const toastRef = useRef()

  const fetchOperators = async () => {
    let role = localStorage.getItem('role')
    if (role > 2) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    }
    let operators = await GetAllOperators()

    setOperators(operators)
  }

  useEffect(() => {
    fetchOperators()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <h1>Operators</h1>
      <AddOperatorModal GetOperators={fetchOperators} toast={toastRef} />
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {operators.map((operator) => (
              <CTableRow key={operator.guid}>
                <CTableHeaderCell>{operator.name}</CTableHeaderCell>
                <CTableHeaderCell>
                  <TaskOperator
                    GetOperators={fetchOperators}
                    toast={toastRef}
                    Operator={operator}
                  />
                </CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default Operators
