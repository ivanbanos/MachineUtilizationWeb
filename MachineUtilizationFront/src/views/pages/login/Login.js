import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { ROLES } from '../../../utils/roles'
import GetToken from '../../../services/GetToken'
import '../../../App.css'

const MACHINE_MESSAGE = 'Machine users cannot sign in to the web portal'
const SUSPENDED_MESSAGE = 'Your company subscription is suspended. Contact your administrator.'

/**
 * Pantalla de inicio de sesión; muestra el error de credenciales o de suscripción suspendida.
 * @returns {JSX.Element} Formulario de login.
 */
const Login = () => {
  let navigate = useNavigate()
  localStorage.setItem('token', null)
  localStorage.setItem('role', null)
  localStorage.setItem('idClient', null)
  sessionStorage.removeItem('subscriptionNoticeStatus')
  const [errorMessages, seterrormessages] = useState(() => {
    if (sessionStorage.getItem('subscriptionSuspended')) {
      sessionStorage.removeItem('subscriptionSuspended')
      return { name: 'password', message: SUSPENDED_MESSAGE }
    }
    return {}
  })
  const [first_name, setfirst_name] = useState()
  const [password, setPassword] = useState()
  const handleFirstNameChange = (event) => {
    setfirst_name(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = await GetToken(first_name, password)
    if (token === 'suspended') {
      seterrormessages({ name: 'password', message: SUSPENDED_MESSAGE })
    } else if (token && Number(token.idRole) === ROLES.MACHINE) {
      seterrormessages({ name: 'password', message: MACHINE_MESSAGE })
    } else if (token) {
      localStorage.setItem('token', token.token)
      localStorage.setItem('role', token.idRole)
      localStorage.setItem('idClient', token.idClient)
      localStorage.setItem('userId', token.userId)
      if (Number(token.idRole) === ROLES.OPERATOR) {
        navigate('/Operator', { replace: true })
      } else {
        navigate('/Dashboard', { replace: true })
      }
    } else {
      seterrormessages({ name: 'password', message: 'Username or Password incorrect' })
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        name="first_name"
                        value={first_name}
                        autoComplete="username"
                        onChange={handleFirstNameChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={handlePasswordChange}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={handleSubmit}
                          navigate={navigate}
                          seterrormessages={seterrormessages}
                          type="submit"
                        >
                          Login
                        </CButton>
                        <div className="error">{errorMessages.message}</div>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Machine Utilization</h2>
                    <img id="logo" src={require('../../../assets/images/HaffnerLogo.png')} />
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
