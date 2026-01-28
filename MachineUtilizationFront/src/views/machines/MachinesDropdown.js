import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CButton,
  CPopover,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilCalculator, cilCopy } from '@coreui/icons'

const MachinesDropdown = (props) => {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setVisible(true)
  }
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setVisible(false)
    }, 150)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(props.guid)
    setVisible(false)
  }

  return (
    <CCol>
      <CPopover
        visible={visible}
        placement="top"
        content={
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="d-flex align-items-center gap-2"
          >
            <span style={{ userSelect: 'all' }}>Tag: {props.guid}</span>
            <CButton color="light" size="sm" style={{ padding: '2px 6px' }} onClick={handleCopy}>
              <CIcon icon={cilCopy} />
            </CButton>
          </div>
        }
      >
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'pointer', paddingBottom: '20px' }}
        >
          <CWidgetStatsA
            className="mb-3 "
            color="primary"
            style={{
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            value={
              <label
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {props.clientName}
              </label>
            }
            title={
              <div className="d-flex align-items-center gap-3 overflow-hidden pb-4">
                <CIcon icon={cilCalculator} className="text-high-emphasis-inverse" />
                <span className="fs-5 fw-bold ">{props.name}</span>
              </div>
            }
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>
                    <Link to={'/summary/' + props.guid}>Utilization Summary</Link>
                  </CDropdownItem>
                  <CDropdownItem>
                    <Link to={'/MachineUtilizations/' + props.guid}>Utilization list</Link>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
          />
        </div>
      </CPopover>
    </CCol>
  )
}

export default MachinesDropdown
