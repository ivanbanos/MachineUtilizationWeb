import React from 'react'
import { Link } from 'react-router-dom'
import {
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilCalculator } from '@coreui/icons'

const MachinesDropdown = (props) => {
  return (
    <CCol sm={6} lg={3}>
      <CWidgetStatsA
        className="mb-4"
        color="primary"
        value={
          <>
            <CIcon icon={cilCalculator} className="text-high-emphasis-inverse" />
            <label>{props.name}</label>
          </>
        }
        title={props.guid}
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
    </CCol>
  )
}

export default MachinesDropdown
