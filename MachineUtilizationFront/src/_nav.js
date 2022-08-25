import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilPlus,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Machines',
  },
  {
    component: CNavItem,
    name: 'List Machine',
    to: '/theme/colors',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'soon',
    },
  },
  {
    component: CNavItem,
    name: 'Add new Machine',
    to: '/theme/colors',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'soon',
    },
  },
  {
    component: CNavTitle,
    name: 'Users',
  },
  {
    component: CNavItem,
    name: 'List Users',
    to: '/theme/colors',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'soon',
    },
  },
]

export default _nav
