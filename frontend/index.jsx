import Routes from './routes'
import React from 'react'
import { render } from 'react-dom'
require('./templates/bootstrap.min.css')
require('./templates/animate.css')

render(Routes, document.getElementById('app'))
