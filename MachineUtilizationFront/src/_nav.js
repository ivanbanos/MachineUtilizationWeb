import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCalculator, cilSpeedometer, cilUser, cilPlus, cilCog, cilContact } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    level: 2,
  },
  {
    component: CNavItem,
    name: 'Clients',
    to: '/clients',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
    level: 1,
  },
  {
    component: CNavItem,
    name: 'Machines',
    to: '/machines',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    level: 2,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    level: 2,
  },
  {
    component: CNavItem,
    name: 'Operators',
    to: '/operators',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    level: 2,
  },
]

export default _nav
