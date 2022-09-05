import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

const Summary = React.lazy(() => import('../views/summary/Summary'))
const UtilizationList = React.lazy(() => import('../views/utilizationlist/UtilizationList'))
const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/summary">
            <Route path=":machineId" element={<Summary />} />
          </Route>
          <Route path="/MachineUtilizations">
            <Route path=":machineId" element={<UtilizationList />} />
          </Route>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
