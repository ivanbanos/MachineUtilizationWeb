import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCalculator, cilSpeedometer, cilUser, cilPlus } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    level: 3,
  },
  {
    component: CNavTitle,
    name: 'Machines',
    level: 2,
  },
  {
    component: CNavItem,
    name: 'List Machine',
    to: '/500',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'soon',
    },
    level: 2,
  },
  {
    component: CNavItem,
    name: 'Add new Machine',
    to: '/500',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'soon',
    },
    level: 2,
  },
  {
    component: CNavTitle,
    name: 'Users',
    level: 2,
  },
  {
    component: CNavItem,
    name: 'List Users',
    to: '/500',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'soon',
    },
    level: 2,
  },
]

export default _nav
