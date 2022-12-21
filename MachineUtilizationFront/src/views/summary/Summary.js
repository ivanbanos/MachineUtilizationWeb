import { React, useState, useEffect } from 'react'
import GetMachineUtilizations from '../../services/GetMachineUtilizations'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import GetMachines from '../../services/GetMachines'
import GetListOperators from '../../services/GetListOperators'
import Cameras from '../cameras/Cameras'
import * as moment from 'moment'
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

const Summary = () => {
  let navigate = useNavigate()
  let { machineId } = useParams()
  const [strat, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())
  const [machineUtilizations, setMachineUtilizations] = useState([])
  const [productionTimeAverage, setProductionTimeAverage] = useState(0)
  const [powerOnAverage, setPowerOnAverage] = useState(0)
  const [machine, setMachine] = useState({ name: '' })
  const [operator, setOperator] = useState('00000000-0000-0000-0000-000000000000')
  const [operators, setOperators] = useState([])

  const getListOperators = async (machine) => {
    console.log(machine)
    let operators = await GetListOperators(machine.idClient)
    console.log(operators)
    setOperators(operators)
  }

  const fetchMachineUtilizations = async () => {
    let machines = await GetMachines()
    console.log(machines)
    setMachine(machines.filter((element) => element.guid == machineId)[0])
    let response = await GetMachineUtilizations(
      machineId,
      moment(strat).format('MM-DD-YYYY'),
      moment(end).format('MM-DD-YYYY'),
      operator,
    )
    console.log(response)
    if (response == 'fail') {
      navigate('/Login', { replace: true })
    } else {
      console.log(machineUtilizations.map((machine) => machine.date))
      setMachineUtilizations(response)
      setProductionTimeAverage(
        response.reduce((sum, machine) => sum + Number(machine.productionTime), 0) /
          response.length,
      )
      setPowerOnAverage(
        response.reduce(
          (sum, machine) => sum + Number(machine.idleTime + machine.productionTime),
          0,
        ) / response.length,
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

  return (
    <>
      <h1>Machine Utilization Summary</h1>
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
      <CRow>
        <CCol lg={9}>
          <CRow>
            <CCol xs={8}>
              <Bar
                options={options}
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
        </CCol>
        <CCol lg={3}>
          <Cameras></Cameras>
        </CCol>
      </CRow>
    </>
  )
}

export default Summary
