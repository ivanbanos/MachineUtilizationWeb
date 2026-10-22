import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  CBadge,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import GetCurrentSubscription from '../services/GetCurrentSubscription'

const POLL_INTERVAL_MS = 30 * 60 * 1000
const SEEN_KEY = 'subscriptionNoticeStatus'
const DATE_FORMAT = 'MM-DD-YYYY'
const NOTICE_STATUSES = ['ExpiringSoon', 'Grace', 'Suspended']

/**
 * Arma el texto de la ventana emergente según el status de la suscripción.
 * @param {object} subscription Suscripción tal como la entrega la API, con status, endDate, daysRemaining y graceEndDate.
 * @returns {string} Mensaje para el usuario, o cadena vacía si el status no lleva aviso.
 */
const buildNotice = (subscription) => {
  if (subscription.status === 'ExpiringSoon') {
    return `Your subscription expires on ${moment(subscription.endDate).format(DATE_FORMAT)} (${
      subscription.daysRemaining
    } days remaining).`
  }
  if (subscription.status === 'Grace') {
    return `Your subscription has expired. Access remains available until ${moment(
      subscription.graceEndDate,
    ).format(DATE_FORMAT)}.`
  }
  if (subscription.status === 'Suspended') {
    return 'Your subscription is suspended. Access has been revoked for the rest of the users of your client.'
  }
  return ''
}

/**
 * Muestra el periodo y el estado de la suscripción del cliente en el encabezado.
 * Consulta la API al montar y cada 30 minutos; abre una ventana emergente una vez
 * por sesión de navegador y por status cuando la suscripción requiere aviso.
 * @returns {JSX.Element|null} El resumen de la suscripción, o null si no hay suscripción registrada o la consulta falló.
 */
const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null)
  const [noticeVisible, setNoticeVisible] = useState(false)

  const fetchSubscription = async () => {
    const current = await GetCurrentSubscription()
    if (current === 'fail' || current.status === 'NotRegistered') {
      setSubscription(null)
      return
    }
    setSubscription(current)
    if (
      NOTICE_STATUSES.includes(current.status) &&
      sessionStorage.getItem(SEEN_KEY) !== current.status
    ) {
      sessionStorage.setItem(SEEN_KEY, current.status)
      setNoticeVisible(true)
    }
  }

  useEffect(() => {
    fetchSubscription()
    const interval = setInterval(fetchSubscription, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  if (subscription === null) {
    return null
  }

  return (
    <>
      <span className="me-2">
        Subscription: {moment(subscription.startDate).format(DATE_FORMAT)} –{' '}
        {moment(subscription.endDate).format(DATE_FORMAT)}
      </span>
      {subscription.status === 'ExpiringSoon' && (
        <CBadge color="warning">Expires in {subscription.daysRemaining} days</CBadge>
      )}
      {subscription.status === 'Grace' && (
        <CBadge color="danger">
          Expired · grace until {moment(subscription.graceEndDate).format(DATE_FORMAT)}
        </CBadge>
      )}
      {subscription.status === 'Suspended' && <CBadge color="danger">Suspended</CBadge>}
      <CModal visible={noticeVisible} onClose={() => setNoticeVisible(false)}>
        <CModalHeader>
          <CModalTitle>Subscription</CModalTitle>
        </CModalHeader>
        <CModalBody>{buildNotice(subscription)}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setNoticeVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SubscriptionStatus
