import { React, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import GetMachineUtilizations from '../../services/GetMachineUtilizations'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import GetMachines from '../../services/GetMachines'
import * as moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilEye, cilMagnifyingGlass } from '@coreui/icons'
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
import { exportExcel } from '../../utils/excel'

/**
 * Botón que navega al detalle del turno de una utilización.
 * @param {object} props Identificador de la utilización a abrir.
 * @returns {JSX.Element} Botón con ícono de lupa.
 */
const SeeShiftDetail = (props) => {
  let navigate = useNavigate()
  return (
    <>
      <CButton
        style={{ margin: '2pt' }}
        onClick={() => navigate('/MachineShiftDetail/' + props.machineUtilizationId)}
      >
        <CIcon icon={cilMagnifyingGlass} size="sm" />
      </CButton>
    </>
  )
}

/**
 * Lista las utilizaciones diarias de una máquina en un rango de fechas y permite exportarlas a Excel.
 * @returns {JSX.Element} Filtros, botón de exportación y tabla de utilizaciones.
 */
const UtilizationList = () => {
  let navigate = useNavigate()
  let { machineId } = useParams()
  const [strat, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())
  const [machineUtilizations, setMachineUtilizations] = useState([])
  const [machine, setMachine] = useState({ name: '' })
  const toastRef = useRef()

  const fetchMachineUtilizations = async () => {
    let machines = await GetMachines()
    setMachine(machines.filter((element) => element.guid >= machineId)[0])
    let response = await GetMachineUtilizations(
      machineId,
      moment(strat).format('MM-DD-YYYY'),
      moment(end).format('MM-DD-YYYY'),
      null,
      false,
    )
    if (response == 'fail') {
      navigate('/Login', { replace: true })
    } else {
      setMachineUtilizations(response)
    }
  }

  useEffect(() => {
    fetchMachineUtilizations()
  }, [])

  /**
   * Exporta a Excel las filas de utilización ya cargadas, con los mismos valores que la tabla.
   * El archivo se nombra con la máquina y el rango de fechas de los filtros.
   * @returns {void}
   */
  const handleExportExcel = () => {
    const rows = machineUtilizations.map((machineUtilization) => [
      moment(machineUtilization.date).format('MM-DD-YYYY'),
      (machineUtilization.productionTime + machineUtilization.idleTime).toFixed(2),
      (24 - machineUtilization.productionTime - machineUtilization.idleTime).toFixed(2),
      machineUtilization.productionTime.toFixed(2),
      machineUtilization.idleTime.toFixed(2),
    ])
    const fileName = `utilization-${machine?.name || machineId}-${moment(strat).format(
      'YYYYMMDD',
    )}-${moment(end).format('YYYYMMDD')}.xlsx`
    exportExcel(
      fileName,
      'Utilization',
      ['Day', 'Power On', 'Power Off', 'Production time', 'Idle time'],
      rows,
    )
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="justify-content-end">
        <CCol xs="auto">
          <CButton
            color="secondary"
            style={{ margin: '2pt' }}
            disabled={machineUtilizations.length === 0}
            onClick={handleExportExcel}
          >
            Export Excel
          </CButton>
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
              <CTableHeaderCell scope="col">Detail</CTableHeaderCell>
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
                  <SeeShiftDetail
                    machineUtilizationId={machineUtilization.guid}
                    toast={toastRef}
                  ></SeeShiftDetail>
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
