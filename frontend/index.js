import Routes from './routes'
import React from 'react'
import { render } from 'react-dom'
require('./templates/chartist.js')
require('./templates/bootstrap.min.css')
require('./templates/animate.css')
require('./templates/chartist.css')
require('./css.css')

render(Routes, document.getElementById('app'))
