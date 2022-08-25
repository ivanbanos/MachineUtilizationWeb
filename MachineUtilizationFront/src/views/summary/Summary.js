import { React, useState, useEffect } from 'react'
import GetMachineUtilizations from '../../services/GetMachineUtilizations'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CChartBar } from '@coreui/react-chartjs'
import * as moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import { CButton, CRow, CCol, CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react'

const AverageReport = (props) => {
  return (
    <CCol sm={6} lg={3}>
      <CCard style={{ width: '18rem' }}>
        <CCardBody>
          <CCardTitle>Average/day</CCardTitle>
          <CCardText> {props.average} </CCardText>
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

  const fetchMachineUtilizations = async () => {
    let response = await GetMachineUtilizations(
      machineId,
      moment(strat).format('MM-DD-YYYY'),
      moment(end).format('MM-DD-YYYY'),
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
  }

  useEffect(() => {
    fetchMachineUtilizations()
  }, [])

  return (
    <>
      <label>{machineId}</label>
      <DatePicker selected={strat} onChange={(date) => setStart(date)} />
      <DatePicker selected={end} onChange={(date) => setEnd(date)} />
      <CButton color="primary" className="px-4" onClick={fetchMachineUtilizations}>
        Filter
      </CButton>
      <CRow>
        <CCol xs={6}>
          <CChartBar
            data={{
              labels: machineUtilizations.map((machine) =>
                moment(machine.date).format('MM-DD-YYYY'),
              ),
              datasets: [
                {
                  label: 'Production time',
                  backgroundColor: '#052CA5',
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
        <CCol xs={6}>
          <AverageReport average={productionTimeAverage.toFixed(2)} />
        </CCol>
        <CCol xs={6}>
          <CChartBar
            data={{
              labels: machineUtilizations.map((machine) =>
                moment(machine.date).format('MM-DD-YYYY'),
              ),
              datasets: [
                {
                  label: 'Power ON',
                  backgroundColor: '#086700',
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
        <CCol xs={6}>
          <AverageReport average={powerOnAverage.toFixed(2)} />
        </CCol>
      </CRow>
    </>
  )
}

export default Summary
