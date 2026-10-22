import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import { installSubscriptionGuard } from './services/subscriptionGuard'

installSubscriptionGuard()

const domNode = document.getElementById('root')
const root = createRoot(domNode)
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)

reportWebVitals()
