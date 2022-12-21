import { React, useState, useEffect, useRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilX, cilVideo, cilTv } from '@coreui/icons'
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
  CFormSelect,
  CEmbed,
} from '@coreui/react'

import Toast from '../toast/Toast'

const WatchCameraModal = (props) => {
  const [watchCameraVisible, setWatchCameraVisible] = useState(false)

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setWatchCameraVisible(true)}>
        <CIcon icon={cilTv} size="m" />
      </CButton>
      <CModal
        className="modal-lg"
        visible={watchCameraVisible}
        onClose={() => setWatchCameraVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Camera</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <div className="embed-responsive embed-responsive-16by9 d-flex justify-content-center">
              <iframe
                className="embed-responsive-item"
                width="560"
                height="315"
                src="https://www.youtube.com/embed/a5rlgE6dcBY"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setWatchCameraVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const TaskCamera = (props) => {
  let navigate = useNavigate()
  const [updateCameraVisible, setUpdateCameraVisible] = useState(false)
  const [newCameraName, setNewCameraName] = useState('')
  const [deleteCameraVisible, setDeleteCameraVisible] = useState(false)
  const handleNameChange = (event) => {
    setNewCameraName(event.target.value)
  }
  // const updateOperator = async () => {
  //   await UpdateOperator(props.Operator, newOperatorName)
  //   props.GetOperators()
  //   setUpdateOperatorVisible(false)
  //   props.toast.current.showToast('Operator updated successfully')
  // }
  // const deleteOperator = async () => {
  //   await DeleteOperator(props.Operator)
  //   props.GetOperators()
  //   setDeleteOperatorVisible(false)
  //   props.toast.current.showToast('Operator deleted successfully')
  // }

  return (
    <>
      <CTableHeaderCell>
        <CButton style={{ margin: '2pt' }} onClick={() => setUpdateCameraVisible(true)}>
          <CIcon icon={cilPencil} size="m" />
        </CButton>
      </CTableHeaderCell>
      <CModal visible={updateCameraVisible} onClose={() => setUpdateCameraVisible(false)}>
        <CModalHeader>
          <CModalTitle>Updating Camera</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={2}>Name</CCol>
            <CCol xs={10}>
              <CFormInput placeholder="Name" onChange={handleNameChange} value={newCameraName} />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateCameraVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Update</CButton>
        </CModalFooter>
      </CModal>
      <CTableHeaderCell>
        <CButton style={{ margin: '2pt' }} onClick={() => setDeleteCameraVisible(true)}>
          <CIcon icon={cilX} size="m" />
        </CButton>
      </CTableHeaderCell>
      <CModal visible={deleteCameraVisible} onClose={() => setDeleteCameraVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Camera</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <label>Are you sure?</label>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteCameraVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Delete</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const AddCameraModal = (props) => {
  const [addCameraVisible, setAddCameraVisible] = useState(false)
  const [newCameraName, setNewCameraName] = useState()
  const handleNameChange = (event) => {
    setNewCameraName(event.target.value)
  }
  // const addOperator = async () => {
  //   const client = localStorage.getItem('idClient')
  //   await AddOperator(newOperatorName, client)
  //   props.GetOperators()
  //   setAddOperatorVisible(false)
  //   props.toast.current.showToast('Operator added successfully')
  // }

  return (
    <>
      <CButton style={{ margin: '2pt' }} onClick={() => setAddCameraVisible(true)}>
        <CIcon icon={cilPlus} size="m" />
      </CButton>
      <CModal visible={addCameraVisible} onClose={() => setAddCameraVisible(false)}>
        <CModalHeader>
          <CModalTitle>Adding Camera</CModalTitle>
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
          <CButton color="secondary" onClick={() => setAddCameraVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Add</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const Cameras = () => {
  // let navigate = useNavigate()
  // const [operators, setOperators] = useState([])
  // const toastRef = useRef()

  // const fetchOperators = async () => {
  //   let role = localStorage.getItem('role')
  //   if (role > 2) {
  //     navigate('/Login', { replace: true })
  //     localStorage.setItem('token', undefined)
  //     localStorage.setItem('role', undefined)
  //   }
  //   let operators = await GetAllOperators()

  //   setOperators(operators)
  // }

  // useEffect(() => {
  //   fetchOperators()
  // }, [])

  return (
    <>
      {/* <Toast ref={toastRef}></Toast> */}
      <h2>Cameras</h2>
      <AddCameraModal />
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {/* {operators.map((operator) => (
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
              ))} */}
            <CTableRow>
              <CTableHeaderCell>Prueba 1</CTableHeaderCell>
              <TaskCamera />
              {/* <CTableHeaderCell>
                <CButton style={{ margin: '2pt' }}>
                  <CIcon icon={cilPencil} size="m" />
                </CButton>
              </CTableHeaderCell>
              <CTableHeaderCell>
                <CButton style={{ margin: '2pt' }}>
                  <CIcon icon={cilX} size="m" />
                </CButton>
              </CTableHeaderCell> */}
              <CTableHeaderCell>
                <WatchCameraModal />
              </CTableHeaderCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default Cameras
