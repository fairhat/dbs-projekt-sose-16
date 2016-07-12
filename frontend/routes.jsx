// GENERAL IMPORTS
import { Router, Route, hashHistory } from 'react-router'
import React from 'react'

// VIEWS
import App          from 'views/app/'
import Predictions  from 'views/predictions/'
// import Home from 'views/home/'

const Routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/predictions" component={Predictions} />
        </Route>
    </Router>
)

export default Routes
