// GENERAL IMPORTS
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import React from 'react'

// VIEWS
import App          from 'views/app/'
import Home         from 'views/home'
import RandomDogs  from 'views/random/'
import DogRace  from 'views/dograce/'
// import Home from 'views/home/'

const Routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/random" component={RandomDogs} />
            <Route path="/race" component={DogRace} />
        </Route>
    </Router>
)

export default Routes
