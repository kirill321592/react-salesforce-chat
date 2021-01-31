import React from 'react'
import ReactDOM from 'react-dom'
import App from 'core/App'

ReactDOM.render(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept('core/App', () => {
    const NextApp = require('core/App').default

    ReactDOM.render(<NextApp />, document.getElementById('root'))
  })
}
