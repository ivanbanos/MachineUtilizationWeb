import { React, useState, useEffect, useRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'
import * as moment from 'moment'

import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilX, cilVideo, cilTv } from '@coreui/icons'
import GetMachineUtilizations from 'src/services/GetMachineUtilizations'
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

const DayDetailModal = ({
  handleSetDayDetailVisible,
  dayDetailModalVisible,
  dayDetailSelect,
  rangeDayDetailSelect,
}) => {
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

  const dayDetailSelectAcotado = dayDetailSelect.filter((item) => {
    const d = new Date(item.date)
    const minutes = d.getHours() * 60 + d.getMinutes()
    const start = 6 * 60
    const end = 18 * 60

    return minutes >= start && minutes <= end
  })

  return (
    <>
      <CModal
        className="modal-dialog-centered modal-xl"
        visible={dayDetailModalVisible}
        onClose={() => handleSetDayDetailVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            {dayDetailSelect.length > 0 && (
              <>
                <h3>Shift Detail</h3>
                {moment(dayDetailSelect[0].date).format('MM-DD-YYYY')}
              </>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol xs={11}>
            <Bar
              options={options}
              data={{
                labels: dayDetailSelectAcotado.map((period) => moment(period.date).format('HH:mm')),
                datasets: [
                  {
                    label: 'Production time (mins)',
                    backgroundColor: '#05A51B',
                    data: dayDetailSelectAcotado.map((period) => period.productionTime * 60),
                  },
                  {
                    label: 'Idle time (mins)',
                    backgroundColor: '#EA0F0F',
                    data: dayDetailSelectAcotado.map((period) => period.idleTime * 60),
                  },
                ],
              }}
              labels="half hour"
            />
          </CCol>

          <CCol xs={11} className="mt-3">
            <h4>Piece Count Detail</h4>
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
                labels: dayDetailSelectAcotado.map((period) => moment(period.date).format('HH:mm')),
                datasets: [
                  {
                    label: 'Piece Count',
                    backgroundColor: '#2d6bb8',
                    data: dayDetailSelectAcotado.map((period) =>
                      Math.floor(period.pieceCount ?? period.piece_count ?? 0),
                    ),
                  },
                ],
              }}
              labels="half hour"
            />
          </CCol>

          <CCol xs={10} className="mt-3">
            {dayDetailSelect.length > 0 && (
              <>
                <h4>Last Shift Details</h4>
                {moment(dayDetailSelect[0].date).subtract(5, 'days').format('MM-DD-YYYY')} to{' '}
                {moment(dayDetailSelect[0].date).format('MM-DD-YYYY')}
              </>
            )}

            <Bar
              options={options}
              data={{
                labels: rangeDayDetailSelect.map((period) =>
                  moment(period.date).format('MM-DD-YYYY'),
                ),
                datasets: [
                  {
                    label: 'Production time ',
                    backgroundColor: '#05A51B',
                    data: rangeDayDetailSelect.map((period) => period.productionTime),
                  },
                  {
                    label: 'Idle time ',
                    backgroundColor: '#EA0F0F',
                    data: rangeDayDetailSelect.map((period) => period.idleTime),
                  },
                ],
              }}
              labels="days"
            />
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => handleSetDayDetailVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

// const Cameras = (props) => {
//   let navigate = useNavigate()
//   const [cameras, setCameras] = useState([])
//   const toastRef = useRef()

//   const fetchCameras = async () => {
//     let role = localStorage.getItem('role')
//     if (role > 2) {
//       navigate('/Login', { replace: true })
//       localStorage.setItem('token', undefined)
//       localStorage.setItem('role', undefined)
//     }
//     let cameras = await GetCameras(props.machineId)

//     setCameras(cameras)
//   }

//   useEffect(() => {
//     fetchCameras()
//   }, [])

//   return (
//     <>
//       <Toast ref={toastRef}></Toast>
//       <h2>Cameras</h2>
//       <AddCameraModal machineId={props.machineId} GetCameras={fetchCameras} toast={toastRef} />
//       <CRow>
//         <CTable>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col"></CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {Array.isArray(cameras) &&
//               cameras.map((camera) => (
//                 <CTableRow key={camera.guid}>
//                   <CTableHeaderCell>{camera.name}</CTableHeaderCell>
//                   <CTableHeaderCell>
//                     <TaskCamera
//                       GetCameras={fetchCameras}
//                       toast={toastRef}
//                       camera={camera}
//                       machineId={props.machineId}
//                     ></TaskCamera>
//                   </CTableHeaderCell>
//                 </CTableRow>
//               ))}
//             <CTableRow></CTableRow>
//           </CTableBody>
//         </CTable>
//       </CRow>
//     </>
//   )
// }

export default DayDetailModal
