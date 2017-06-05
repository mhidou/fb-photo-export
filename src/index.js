import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'
import './index.css'

window.BACKEND_PORT = process.env.NODE_ENV === 'production' ? '3000' : '9000'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
