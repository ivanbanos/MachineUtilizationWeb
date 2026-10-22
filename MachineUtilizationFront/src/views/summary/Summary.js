import { React, useState, useEffect } from 'react'
import GetMachineUtilizations from '../../services/GetMachineUtilizations'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import GetMachines from '../../services/GetMachines'
import GetListOperators from '../../services/GetListOperators'
import Cameras from '../cameras/Cameras'
import DayDetailModal from '../dayDetail/DayDetailModal'
import * as moment from 'moment'
import { exportExcel } from '../../utils/excel'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCardHeader,
  CFormSelect,
} from '@coreui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
}

/**
 * Tarjeta con el promedio diario de una métrica y su color de referencia.
 * @param {object} props Promedio ya formateado y color de la métrica.
 * @returns {JSX.Element} Tarjeta de promedio.
 */
const AverageReport = (props) => {
  return (
    <CCol>
      <CCard style={{ width: '100%' }}>
        <CCardBody>
          <CRow>
            <CCol md={3} style={{ width: '75%' }}>
              <CCardTitle>Average/day</CCardTitle>
              <CCardText> {props.average} </CCardText>
            </CCol>
            <CCol md={3}>
              <div style={{ backgroundColor: props.color, height: '5rem' }}></div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

/**
 * Resume la utilización de una máquina en un rango y operador, con gráficas, promedios y exportación a Excel.
 * @returns {JSX.Element} Filtros, botón de exportación, gráficas y cámaras.
 */
const Summary = () => {
  let navigate = useNavigate()
  let { machineId } = useParams()
  const [strat, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())
  const [machineUtilizations, setMachineUtilizations] = useState([])
  const [productionTimeAverage, setProductionTimeAverage] = useState(0)
  const [powerOnAverage, setPowerOnAverage] = useState(0)
  const [pieceCountAverage, setPieceCountAverage] = useState(0)
  const [machine, setMachine] = useState({ name: '' })
  const [operator, setOperator] = useState('00000000-0000-0000-0000-000000000000')
  const [operators, setOperators] = useState([])
  const [dayDetailModalVisible, setDayDetailModalVisible] = useState(false)
  const handleSetDayDetailVisible = (stateDayDetailVisible) => {
    setDayDetailModalVisible(stateDayDetailVisible)
  }
  const [appliedRange, setAppliedRange] = useState({ start: new Date(), end: new Date() })
  const [dayDetailSelect, setDayDetailSelect] = useState([])
  const [rangeDayDetailSelect, setRangeDayDetailSelect] = useState([])

  const getListOperators = async (machine) => {
    let operators = await GetListOperators(machine.idClient)

    setOperators(operators)
  }

  const fetchMachineUtilizations = async () => {
    let machines = await GetMachines()

    setMachine(machines.filter((element) => element.guid == machineId)[0])
    let response = await GetMachineUtilizations(
      machineId,
      moment(strat).format('MM-DD-YYYY'),
      moment(end).format('MM-DD-YYYY'),
      operator,
      false,
    )

    if (response == 'fail') {
      navigate('/Login', { replace: true })
    } else {
      setMachineUtilizations(response)
      setAppliedRange({ start: strat, end })
      const count = response.length
      setProductionTimeAverage(
        count
          ? response.reduce((sum, machine) => sum + Number(machine.productionTime), 0) / count
          : 0,
      )
      setPowerOnAverage(
        count
          ? response.reduce(
              (sum, machine) => sum + Number(machine.idleTime + machine.productionTime),
              0,
            ) / count
          : 0,
      )
      setPieceCountAverage(
        count
          ? response.reduce((sum, machine) => sum + Number(machine.pieceCount || 0), 0) / count
          : 0,
      )
    }
    await getListOperators(machines.filter((element) => element.guid >= machineId)[0])
  }

  useEffect(() => {
    fetchMachineUtilizations()
  }, [])

  const handleOperatorChange = (event) => {
    setOperator(event.target.value)
  }

  /**
   * Exporta a Excel los registros del último filtro aplicado, con los valores de las gráficas y una fila final de promedios.
   * El archivo se nombra con la máquina y el rango de fechas aplicado.
   * @returns {void}
   */
  const handleExportExcel = () => {
    const rows = machineUtilizations.map((item) => [
      moment(item.date).format('MM-DD-YYYY'),
      (item.idleTime + item.productionTime).toFixed(2),
      Number(item.productionTime).toFixed(2),
      Number(item.idleTime).toFixed(2),
      Math.floor(item.pieceCount || 0),
    ])
    rows.push([
      'Average',
      powerOnAverage.toFixed(2),
      productionTimeAverage.toFixed(2),
      '',
      pieceCountAverage.toFixed(2),
    ])
    const fileName = `summary-${machine?.name || machineId}-${moment(appliedRange.start).format(
      'YYYYMMDD',
    )}-${moment(appliedRange.end).format('YYYYMMDD')}.xlsx`
    exportExcel(
      fileName,
      'Summary',
      ['Day', 'Power On', 'Production time', 'Idle time', 'Piece count'],
      rows,
    )
  }
  return (
    <>
      <h1>Machine Utilization Summary</h1>
      <h2>{machine.name}</h2>

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Filters</CCardHeader>
            <CCardBody>
              <CCardText component="div">
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
                  <CCol style={{ margin: '2pt' }} xs={2}>
                    Operator
                  </CCol>
                  <CCol style={{ margin: '2pt' }} xs={10}>
                    <CFormSelect
                      aria-label="Default select example"
                      value={operator}
                      onChange={handleOperatorChange}
                    >
                      <option value={'00000000-0000-0000-0000-000000000000'}>Select One</option>
                      {operators.map((operator) => (
                        <option key={operator.guid} value={operator.guid}>
                          {operator.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
              </CCardText>
              <CButton color="primary" className="px-4" onClick={fetchMachineUtilizations}>
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
        <CCol lg={9}>
          <CRow>
            <DayDetailModal
              handleSetDayDetailVisible={handleSetDayDetailVisible}
              dayDetailModalVisible={dayDetailModalVisible}
              dayDetailSelect={dayDetailSelect}
              rangeDayDetailSelect={rangeDayDetailSelect}
            ></DayDetailModal>
            <CRow className="align-items-center mb-3">
              <CCol xs={8}>
                <Bar
                  options={{
                    ...options,
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          let label = context.dataset.label || ''
                          if (label) label += ': '
                          if (context.parsed.y !== null) label += context.parsed.y
                          return label
                        },
                        afterBody: (tooltipItems) => {
                          const dataIndex = tooltipItems[0]?.dataIndex
                          if (dataIndex !== undefined && machineUtilizations[dataIndex]) {
                            const item = machineUtilizations[dataIndex]
                            const pieceCount = Math.floor(item.pieceCount ?? item.piece_count ?? 0)
                            return `Piece count: ${pieceCount}`
                          }
                          return ''
                        },
                      },
                    },
                    onClick: async (event, elementosActivos) => {
                      if (elementosActivos.length > 0) {
                        const fetchMachineUtilizationsDetail = async (
                          machineSelected,
                          daySelectStart,
                          daySelectEnd,
                          detailed,
                        ) => {
                          let response = await GetMachineUtilizations(
                            machineSelected,
                            daySelectStart,
                            daySelectEnd,
                            null,
                            detailed,
                          )

                          if (response == 'fail') {
                            navigate('/Login', { replace: true })
                          } else {
                            return response
                          }
                        }
                        const elementoClickeado = elementosActivos[0]
                        const clickInfo = machineUtilizations[elementoClickeado.index]
                        const machineDetail = clickInfo.machine

                        const daySelect = moment(clickInfo.date).format('MM-DD-YYYY')

                        const dateFiveDaysAgo = moment(clickInfo.date)
                          .subtract(5, 'days')
                          .format('MM-DD-YYYY')

                        let infoDetailDay = await fetchMachineUtilizationsDetail(
                          machineDetail,
                          daySelect,
                          daySelect,
                          true,
                        )
                        let infoRangeDetailDay = await fetchMachineUtilizationsDetail(
                          machineDetail,
                          dateFiveDaysAgo,
                          daySelect,

                          false,
                        )
                        setDayDetailSelect(infoDetailDay)
                        setRangeDayDetailSelect(infoRangeDetailDay)
                        handleSetDayDetailVisible(true)
                      }
                    },
                  }}
                  data={{
                    labels: machineUtilizations.map((machine) =>
                      moment(machine.date).format('MM-DD-YYYY'),
                    ),
                    datasets: [
                      {
                        label: 'Production time',
                        backgroundColor: '#05A51B',
                        data: machineUtilizations.map((machine) => machine.productionTime),
                      },
                      {
                        label: 'Idle time',
                        backgroundColor: '#EA0F0F',
                        data: machineUtilizations.map((machine) => machine.idleTime),
                      },
                    ],
                  }}
                  labels="days"
                />
              </CCol>
              <CCol lg={3}>
                <AverageReport average={productionTimeAverage.toFixed(2)} color={'#05A51B'} />
              </CCol>
            </CRow>
            <CRow className="align-items-center mb-3">
              <CCol xs={8}>
                <Bar
                  options={options}
                  data={{
                    labels: machineUtilizations.map((machine) =>
                      moment(machine.date).format('MM-DD-YYYY'),
                    ),
                    datasets: [
                      {
                        label: 'Power ON',
                        backgroundColor: '#052CA5',
                        data: machineUtilizations.map((machine) => {
                          return machine.idleTime + machine.productionTime
                        }),
                      },
                      {
                        label: 'Power OFF',
                        backgroundColor: '#8B8B8B',
                        data: machineUtilizations.map((machine) => {
                          return 24 - machine.idleTime - machine.productionTime
                        }),
                      },
                    ],
                  }}
                  labels="days"
                />
              </CCol>
              <CCol lg={3}>
                <AverageReport average={powerOnAverage.toFixed(2)} color={'#052CA5'} />
              </CCol>
            </CRow>
            <CRow className="align-items-center mb-3">
              <CCol xs={8}>
                <Bar
                  options={{
                    scales: {
                      x: { stacked: false },
                      y: {
                        stacked: false,
                        ticks: { stepSize: 1 },
                      },
                    },
                  }}
                  data={{
                    labels: machineUtilizations.map((machine) =>
                      moment(machine.date).format('MM-DD-YYYY'),
                    ),
                    datasets: [
                      {
                        label: 'Piece Count',
                        backgroundColor: '#2d6bb8',
                        data: machineUtilizations.map((machine) =>
                          Math.floor(machine.pieceCount || 0),
                        ),
                      },
                    ],
                  }}
                  labels="days"
                />
              </CCol>
              <CCol lg={3}>
                <AverageReport average={pieceCountAverage.toFixed(2)} color={'#2d6bb8'} />
              </CCol>
            </CRow>
          </CRow>
        </CCol>
        <CCol lg={3}>
          <Cameras machineId={machineId}></Cameras>
        </CCol>
      </CRow>
    </>
  )
}

export default Summary
