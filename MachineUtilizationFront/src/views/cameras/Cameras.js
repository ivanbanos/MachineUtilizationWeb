import { React, useState, useEffect, useRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'
import AddCamera from 'src/services/AddCamera'
import GetCameras from 'src/services/GetCameras'
import UpdateCamera from 'src/services/UpdateCamera'
import DeleteCamera from 'src/services/DeleteCamera'
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
  CListGroup,
} from '@coreui/react'

import Toast from '../toast/Toast'
import configData from '../../config.json'

const WatchCameraModal = (props) => {
  const [watchCameraVisible, setWatchCameraVisible] = useState(false)
  const userName = props.camera.user
  const password = props.camera.password
  const cameraUrl = configData.CAMERA_URL.replace('%USER_NAME%', userName).replace(
    '%PASSWORD%',
    password,
  )

  console.log(cameraUrl) // Imprime la URL dinámica resultante

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
                src={cameraUrl}
                title="Machine Utilization"
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
  const updateCamera = async () => {
    await UpdateCamera(props.camera, newCameraName)
    props.GetCameras()
    setUpdateCameraVisible(false)
    props.toast.current.showToast('Camera updated successfully')
  }
  const deleteCamera = async () => {
    await DeleteCamera(props.camera)
    props.GetCameras()
    setDeleteCameraVisible(false)
    props.toast.current.showToast('Camera deleted successfully')
  }

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
          <CButton color="primary" onClick={updateCamera}>
            Update
          </CButton>
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
          <CButton color="primary" onClick={deleteCamera}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
      <CTableHeaderCell>
        <WatchCameraModal camera={props.camera} />
      </CTableHeaderCell>
    </>
  )
}

const AddCameraModal = (props) => {
  const [addCameraVisible, setAddCameraVisible] = useState(false)
  const [cameraName, setCameraName] = useState('')
  const [cameraUser, setCameraUser] = useState('')
  const [cameraPassword, setCameraPassword] = useState('')
  const handleCameraNameChange = (event) => {
    setCameraName(event.target.value)
  }
  const handleCameraPasswordChange = (event) => {
    setCameraPassword(event.target.value)
  }
  const handleCameraUserChange = (event) => {
    setCameraUser(event.target.value)
  }

  const addCamera = async () => {
    const machineId = props.machineId
    await AddCamera(cameraName, cameraUser, cameraPassword, machineId)
    props.GetCameras()
    setAddCameraVisible(false)
    props.toast.current.showToast('Camera added successfully')
  }

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
              <CFormInput placeholder="Name" onChange={handleCameraNameChange} name="name" />
            </CCol>
            <CCol xs={2}>User</CCol>
            <CCol xs={10}>
              <CFormInput placeholder="User" onChange={handleCameraUserChange} name="user" />
            </CCol>
            <CCol xs={2}>Password</CCol>
            <CCol xs={10}>
              <CFormInput
                placeholder="Password"
                onChange={handleCameraPasswordChange}
                name="password"
                type="password"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddCameraVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={addCamera}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const Cameras = (props) => {
  let navigate = useNavigate()
  const [cameras, setCameras] = useState([])
  const toastRef = useRef()

  const fetchCameras = async () => {
    let role = localStorage.getItem('role')
    if (role > 2) {
      navigate('/Login', { replace: true })
      localStorage.setItem('token', undefined)
      localStorage.setItem('role', undefined)
    }
    let cameras = await GetCameras(props.machineId)

    setCameras(cameras)
  }

  useEffect(() => {
    fetchCameras()
  }, [])

  return (
    <>
      <Toast ref={toastRef}></Toast>
      <h2>Cameras</h2>
      <AddCameraModal machineId={props.machineId} GetCameras={fetchCameras} toast={toastRef} />
      <CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {cameras.map((camera) => (
              <CTableRow key={camera.guid}>
                <CTableHeaderCell>{camera.name}</CTableHeaderCell>
                <CTableHeaderCell>
                  <TaskCamera
                    GetCameras={fetchCameras}
                    toast={toastRef}
                    camera={camera}
                    machineId={props.machineId}
                  ></TaskCamera>
                </CTableHeaderCell>
              </CTableRow>
            ))}
            <CTableRow></CTableRow>
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default Cameras
